"""
Mock ERP/LMS ingestion service.

Stands in for a live secure REST integration: instead of polling an ERP API,
staff (or a cron job) upload a CSV pull. Same downstream shape as a real
feed would produce, so swapping this for a real API later only touches
this file, not the delta/risk logic.

Storage: SQLite, one row per (student_id, snapshot_date). Uploading the
same snapshot_date twice for a student overwrites that row (idempotent —
safe to re-upload a corrected file).

Run:
    pip install fastapi uvicorn python-multipart
    uvicorn app.main:app --reload
Then POST a CSV to /upload/snapshot or /upload/students.
"""

import csv
import io
import sqlite3
from datetime import date, datetime, timedelta
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import random

from app.predict import preprocess_input, model as xgb_model
from app.explain import explain
from app.auth import router as auth_router, get_current_user, require_role
from app.notifications import send_intervention_email
from fastapi import Depends

DB_PATH = Path(__file__).parent / "risk_data.db"

app = FastAPI(title="Dropout Risk — Mock ERP/LMS Ingestion")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

REQUIRED_STUDENT_COLS = {"student_id", "program", "enrollment_year",
                          "family_income_bracket", "distance_from_campus_km"}
REQUIRED_SNAPSHOT_COLS = {"student_id", "snapshot_date", "attendance_pct",
                           "avg_score", "fee_status", "exam_attempts_this_term"}


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_conn()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS students (
            student_id TEXT PRIMARY KEY,
            program TEXT,
            enrollment_year INTEGER,
            family_income_bracket TEXT,
            distance_from_campus_km REAL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS snapshots (
            student_id TEXT,
            snapshot_date TEXT,
            attendance_pct REAL,
            avg_score REAL,
            fee_status TEXT,
            exam_attempts_this_term INTEGER,
            ingested_at TEXT,
            PRIMARY KEY (student_id, snapshot_date)
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS interventions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT,
            logged_at TEXT,
            action TEXT,
            notes TEXT,
            pre_intervention_risk REAL
        )
    """)
    conn.commit()
    conn.close()


init_db()


def _read_csv_rows(raw_bytes: bytes):
    text = raw_bytes.decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(text))
    rows = list(reader)
    if not rows:
        raise HTTPException(400, "CSV has no data rows")
    return rows


@app.post("/upload/students")
async def upload_students(file: UploadFile = File(...)):
    rows = _read_csv_rows(await file.read())
    missing = REQUIRED_STUDENT_COLS - set(rows[0].keys())
    if missing:
        raise HTTPException(400, f"Missing required columns: {sorted(missing)}")

    conn = get_conn()
    conn.executemany(
        """INSERT INTO students (student_id, program, enrollment_year,
                                  family_income_bracket, distance_from_campus_km)
           VALUES (:student_id, :program, :enrollment_year,
                   :family_income_bracket, :distance_from_campus_km)
           ON CONFLICT(student_id) DO UPDATE SET
                program=excluded.program,
                enrollment_year=excluded.enrollment_year,
                family_income_bracket=excluded.family_income_bracket,
                distance_from_campus_km=excluded.distance_from_campus_km""",
        rows
    )
    conn.commit()
    conn.close()
    return {"status": "ok", "rows_ingested": len(rows)}


@app.post("/upload/snapshot")
async def upload_snapshot(file: UploadFile = File(...)):
    rows = _read_csv_rows(await file.read())
    missing = REQUIRED_SNAPSHOT_COLS - set(rows[0].keys())
    if missing:
        raise HTTPException(400, f"Missing required columns: {sorted(missing)}")

    now = datetime.utcnow().isoformat()
    for r in rows:
        r["ingested_at"] = now

    conn = get_conn()
    conn.executemany(
        """INSERT INTO snapshots (student_id, snapshot_date, attendance_pct,
                                   avg_score, fee_status, exam_attempts_this_term,
                                   ingested_at)
           VALUES (:student_id, :snapshot_date, :attendance_pct, :avg_score,
                   :fee_status, :exam_attempts_this_term, :ingested_at)
           ON CONFLICT(student_id, snapshot_date) DO UPDATE SET
                attendance_pct=excluded.attendance_pct,
                avg_score=excluded.avg_score,
                fee_status=excluded.fee_status,
                exam_attempts_this_term=excluded.exam_attempts_this_term,
                ingested_at=excluded.ingested_at""",
        rows
    )
    conn.commit()

    dates = sorted({r["snapshot_date"] for r in rows})
    conn.close()
    return {"status": "ok", "rows_ingested": len(rows), "snapshot_dates": dates}


@app.get("/students/{student_id}/deltas")
def get_deltas(student_id: str, as_of: str | None = None):
    """
    Returns 30-day and 60-day deltas for a student's attendance/score/attempts,
    computed against the closest available snapshot >= N days before as_of.

    as_of defaults to the student's most recent snapshot date.
    """
    conn = get_conn()
    snaps = conn.execute(
        "SELECT * FROM snapshots WHERE student_id = ? ORDER BY snapshot_date",
        (student_id,)
    ).fetchall()
    conn.close()

    if not snaps:
        raise HTTPException(404, "No snapshots for this student")

    snaps = [dict(s) for s in snaps]
    for s in snaps:
        s["_date"] = date.fromisoformat(s["snapshot_date"])

    current = snaps[-1] if as_of is None else next(
        (s for s in snaps if s["snapshot_date"] == as_of), None
    )
    if current is None:
        raise HTTPException(404, f"No snapshot for as_of={as_of}")

    def closest_prior(target_days):
        target_date = current["_date"] - timedelta(days=target_days)
        candidates = [s for s in snaps if s["_date"] <= target_date]
        return candidates[-1] if candidates else None

    def diff(prior):
        if prior is None:
            return None
        return {
            "compared_to": prior["snapshot_date"],
            "attendance_pct_delta": round(current["attendance_pct"] - prior["attendance_pct"], 1),
            "avg_score_delta": round(current["avg_score"] - prior["avg_score"], 1),
            "exam_attempts_delta": current["exam_attempts_this_term"] - prior["exam_attempts_this_term"],
            "fee_status_then": prior["fee_status"],
        }

    return {
        "student_id": student_id,
        "current_snapshot": current["snapshot_date"],
        "delta_30d": diff(closest_prior(30)),
        "delta_60d": diff(closest_prior(60)),
    }

@app.get("/api/predictions")
def get_predictions():
    conn = get_conn()
    
    # Get all students with their latest snapshot
    query = """
        SELECT s.*, sn.*
        FROM students s
        LEFT JOIN snapshots sn ON s.student_id = sn.student_id
        WHERE sn.snapshot_date = (
            SELECT MAX(snapshot_date) 
            FROM snapshots 
            WHERE student_id = s.student_id
        )
    """
    rows = conn.execute(query).fetchall()
    conn.close()

    results = []
    
    mock_names = ["Aarav Sharma", "Priya Nair", "Rohan Verma", "Sneha Iyer", "Karan Mehta", "Amit Patel", "Neha Gupta", "Vikram Singh"]
    
    for idx, row in enumerate(rows):
        student_dict = dict(row)
        
        # Get deltas for prediction
        conn_d = get_conn()
        snaps = conn_d.execute(
            "SELECT * FROM snapshots WHERE student_id = ? ORDER BY snapshot_date",
            (student_dict["student_id"],)
        ).fetchall()
        conn_d.close()
        
        att_delta = 0.0
        score_delta = 0.0
        fee_worse = 0
        
        if len(snaps) >= 2:
            prev = snaps[-2]
            curr = snaps[-1]
            att_delta = curr["attendance_pct"] - prev["attendance_pct"]
            score_delta = curr["avg_score"] - prev["avg_score"]
            # fee_map: paid=0, pending=1, overdue=2
            fmap = {"paid": 0, "pending": 1, "overdue": 2}
            if fmap.get(curr["fee_status"], 0) > fmap.get(prev["fee_status"], 0):
                fee_worse = 1
        
        # Prepare features for the ML model
        features = {
            "attendance_pct": student_dict.get("attendance_pct", 75),
            "avg_score": student_dict.get("avg_score", 75),
            "fee_status": student_dict.get("fee_status", "paid"),
            "exam_attempts_this_term": student_dict.get("exam_attempts_this_term", 1),
            "program": student_dict.get("program", "B.Tech"),
            "enrollment_year": student_dict.get("enrollment_year", 2023),
            "family_income_bracket": student_dict.get("family_income_bracket", "medium"),
            "distance_from_campus_km": student_dict.get("distance_from_campus_km", 10.0),
            "attendance_delta_30d": att_delta,
            "score_delta_30d": score_delta,
            "fee_status_worsening": fee_worse,
            "month": datetime.now().month,
            "year": datetime.now().year
        }
        
        try:
            # Predict
            processed = preprocess_input(features)
            risk_prob = xgb_model.predict_proba(processed)[0][1] * 100
            
            # Explain
            shap_factors_raw = explain(processed)
            
            # Format SHAP for UI
            shap_factors_ui = []
            for sf in shap_factors_raw:
                impact_val = sf["impact"]
                is_negative = impact_val < 0
                color = "error" if is_negative else "emerald-600"
                if abs(impact_val) < 0.1:
                    color = "amber-500"
                    
                shap_factors_ui.append({
                    "factor": sf["factor"],
                    "impact": f"{impact_val:+.2f} impact",
                    "width": f"{min(abs(impact_val) * 100, 100):.0f}%",
                    "color": color,
                    "desc": f"Model detected significant variance in {sf['factor']}."
                })
                
        except Exception as e:
            print(f"Error predicting for {student_dict['student_id']}: {e}")
            risk_prob = 15.0
            shap_factors_ui = []
            
        risk_tier = "Low"
        if risk_prob > 70:
            risk_tier = "High"
        elif risk_prob > 35:
            risk_tier = "Medium"
            
        cgpa_mock = round(features["avg_score"] / 20.0, 1)

        # Get interventions from DB
        conn2 = get_conn()
        inv_rows = conn2.execute(
            "SELECT action, notes, logged_at FROM interventions WHERE student_id = ? ORDER BY logged_at DESC", 
            (student_dict["student_id"],)
        ).fetchall()
        conn2.close()
        
        intervention_history = []
        for r in inv_rows:
            try:
                dt = datetime.fromisoformat(r["logged_at"])
                date_str = dt.strftime("%b %d, %Y")
            except:
                date_str = r["logged_at"]
                
            intervention_history.append({
                "id": "INT-" + r["logged_at"][-4:],
                "date": date_str,
                "title": r["action"],
                "notes": r["notes"],
                "icon": "event",
                "channel": "System"
            })

        peer_match = None
        if risk_prob >= 40.0:
            peer_match = {
                "name": "Sarah Jenkins",
                "initials": "SJ",
                "grade": "Year 4",
                "badge": "Alumni Mentor",
                "matchPercent": "92% Match",
                "reason": "Overcame similar early attendance drop in same program"
            }

        # Build UI object
        results.append({
            "id": student_dict["student_id"],
            "name": mock_names[idx % len(mock_names)],
            "riskScore": int(risk_prob),
            "riskTier": risk_tier,
            "grade": "Year " + str(datetime.now().year - features["enrollment_year"] + 1),
            "homeroom": f"Room {100 + (idx % 20)}",
            "age": 19 + (idx % 3),
            "guardian": {
                "name": "Guardian Name",
                "phone": "555-010-0000"
            },
            "tags": [features["program"], features["fee_status"]],
            "readouts": {
                "attendance": f"{features['attendance_pct']}%",
                "cgpa": str(cgpa_mock),
                "targetCgpa": "3.5",
                "incidents": features["exam_attempts_this_term"],
                "engagement": "Moderate"
            },
            "shapFactors": shap_factors_ui,
            "schedule": [
                { "period": "P1", "course": "Core Subject", "grade": f"{(cgpa_mock/4)*100:.0f}%", "status": "normal" }
            ],
            "peerMatch": peer_match,
            "interventionHistory": intervention_history
        })

    return results

@app.get("/triage")
def triage():
    from app.triage import build_triage_queue
    predictions = get_predictions()
    # transform for triage
    scored_students = [
        {"student_id": p["id"], "risk_score": p["riskScore"] / 100.0, "risk_level": p["riskTier"]}
        for p in predictions
    ]
    queue = build_triage_queue(scored_students)
    return {"queue": queue}

from pydantic import BaseModel

class InterventionLog(BaseModel):
    action: str
    notes: str
    pre_intervention_risk: float = None

@app.post("/students/{student_id}/interventions")
def log_intervention(
    student_id: str, 
    log: InterventionLog,
    current_user: dict = Depends(require_role(["counselor", "admin"]))
):
    conn = get_conn()
    now = datetime.utcnow().isoformat()
    conn.execute("""
        INSERT INTO interventions (student_id, logged_at, action, notes, pre_intervention_risk)
        VALUES (?, ?, ?, ?, ?)
    """, (student_id, now, log.action, log.notes, log.pre_intervention_risk))
    conn.commit()
    conn.close()
    
    # Fire off multilingual notification via Resend Sandbox
    # In a production app, we would query the DB for the exact guardian name, email, and preferred language.
    # For now, we mock the retrieval.
    mock_guardian_name = "Mrs. Sharma"
    mock_student_name = "Aarav Sharma" if student_id.endswith("902") else "Student"
    mock_guardian_email = "p.lokeshwarann@gmail.com"  # Sandbox testing email
    mock_language = "hi" if "Sharma" in mock_guardian_name else "en"
    
    send_intervention_email(
        guardian_email=mock_guardian_email,
        guardian_name=mock_guardian_name,
        student_name=mock_student_name,
        language=mock_language,
        action=log.action,
        notes=log.notes
    )
    
    return {"status": "logged", "action": log.action, "timestamp": now, "user": current_user["username"]}

@app.get("/students/{student_id}/interventions")
def get_interventions(student_id: str):
    conn = get_conn()
    rows = conn.execute("SELECT * FROM interventions WHERE student_id = ? ORDER BY logged_at DESC", (student_id,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]

class SimulationRequest(BaseModel):
    attendance_pct: float
    avg_score: float
    fee_status: str

@app.post("/students/{student_id}/simulate")
def simulate_risk(student_id: str, sim: SimulationRequest):
    conn = get_conn()
    student = conn.execute("SELECT * FROM students WHERE student_id = ?", (student_id,)).fetchone()
    snaps = conn.execute("SELECT * FROM snapshots WHERE student_id = ? ORDER BY snapshot_date", (student_id,)).fetchall()
    conn.close()
    
    if not student or not snaps:
        raise HTTPException(status_code=404, detail="Student not found")
        
    student_dict = dict(student)
    student_dict.update(dict(snaps[-1]))
    
    simulated_attendance_delta = sim.attendance_pct - snaps[-2]["attendance_pct"] if len(snaps) >= 2 else 0.0
    simulated_score_delta = sim.avg_score - snaps[-2]["avg_score"] if len(snaps) >= 2 else 0.0
    
    fee_worse = 0
    if len(snaps) >= 2:
        fmap = {"paid": 0, "pending": 1, "overdue": 2}
        if fmap.get(sim.fee_status.lower(), 0) > fmap.get(snaps[-2]["fee_status"], 0):
            fee_worse = 1
            
    features = {
        "attendance_pct": sim.attendance_pct,
        "avg_score": sim.avg_score,
        "fee_status": sim.fee_status.lower(),
        "exam_attempts_this_term": student_dict.get("exam_attempts_this_term", 1),
        "program": student_dict.get("program", "B.Tech"),
        "enrollment_year": student_dict.get("enrollment_year", 2023),
        "family_income_bracket": student_dict.get("family_income_bracket", "medium"),
        "distance_from_campus_km": student_dict.get("distance_from_campus_km", 10.0),
        "attendance_delta_30d": simulated_attendance_delta,
        "score_delta_30d": simulated_score_delta,
        "fee_status_worsening": fee_worse,
        "month": datetime.now().month,
        "year": datetime.now().year
    }
    
    from app.predict import predict_student
    pred = predict_student(features)
    return {
        "simulated_risk_score": int(pred["risk_score"] * 100),
        "simulated_risk_tier": pred["risk_level"]
    }

@app.get("/api/fairness")
def get_fairness_audit():
    # In a real app, this would dynamically aggregate predictions vs historical labels.
    # For the SIH prototype, we return realistic structured data for Recharts.
    return {
        "demographic": "family_income_bracket",
        "metrics": [
            {
                "bracket": "Low",
                "total_students": 150,
                "flagged_high_risk": 45,
                "flagRate": 30.0,
                "falsePositiveRate": 12.5,
                "avgRiskScore": 42
            },
            {
                "bracket": "Medium",
                "total_students": 250,
                "flagged_high_risk": 50,
                "flagRate": 20.0,
                "falsePositiveRate": 8.2,
                "avgRiskScore": 35
            },
            {
                "bracket": "High",
                "total_students": 100,
                "flagged_high_risk": 15,
                "flagRate": 15.0,
                "falsePositiveRate": 5.1,
                "avgRiskScore": 28
            }
        ],
        "disparate_impact_ratio": 0.50, # 15% / 30% = 0.5
        "why_not_flagged_examples": [
            {
                "id": "STU1A389F45",
                "name": "Sneha Iyer",
                "bracket": "Low Income",
                "risk_score": 12,
                "reasoning": "Model identified strong protective factors that suppressed the demographic risk.",
                "factors": [
                    {"factor": "attendance_pct", "impact": "-2.14", "desc": "Consistent 95%+ attendance strongly correlates with retention."},
                    {"factor": "avg_score", "impact": "-1.50", "desc": "Top quartile academic performance offsets financial flags."}
                ]
            },
            {
                "id": "STUACA6EC93",
                "name": "Karan Mehta",
                "bracket": "Medium Income (Overdue Fees)",
                "risk_score": 8,
                "reasoning": "Despite having an active overdue fee flag, student maintains high engagement.",
                "factors": [
                    {"factor": "engagement_score", "impact": "-3.10", "desc": "LMS activity is in the 99th percentile for the cohort."},
                    {"factor": "exam_attempts_this_term", "impact": "-0.95", "desc": "Zero failed exams or retakes needed."}
                ]
            }
        ]
    }

@app.get("/api/cohorts")
def get_cohort_analytics():
    return {
        "program_risk": [
            {"program": "B.Tech CSE", "High": 12, "Medium": 45, "Low": 140},
            {"program": "B.Tech IT", "High": 8, "Medium": 30, "Low": 110},
            {"program": "B.Sc Physics", "High": 4, "Medium": 15, "Low": 60},
            {"program": "B.Com", "High": 15, "Medium": 50, "Low": 120}
        ],
        "semester_risk": [
            {"semester": "Sem 1", "Avg Risk": 15},
            {"semester": "Sem 2", "Avg Risk": 18},
            {"semester": "Sem 3", "Avg Risk": 25},
            {"semester": "Sem 4", "Avg Risk": 35},
            {"semester": "Sem 5", "Avg Risk": 22},
            {"semester": "Sem 6", "Avg Risk": 14},
            {"semester": "Sem 7", "Avg Risk": 9},
            {"semester": "Sem 8", "Avg Risk": 5}
        ]
    }
