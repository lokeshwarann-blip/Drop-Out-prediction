"""
Synthetic ERP/LMS data generator.

Simulates what you'd get from a real ERP/LMS feed:
  - a static student roster (students.csv)
  - repeated periodic "pulls" of attendance/scores/fees/attempts (snapshots_*.csv),
    spaced ~30 days apart, so you can test 30/60-day delta logic immediately
    without waiting for real time to pass.

Design choice: students are assigned a hidden "risk_archetype" that biases
their metrics AND how those metrics drift over time (e.g. a "declining"
student's attendance trends down snapshot over snapshot). This gives you
data where deltas are actually meaningful, not just random noise around
a fixed mean, which is what a real churn-preceding student looks like.
"""

import csv
import random
import uuid
from datetime import date, timedelta

random.seed(42)

N_STUDENTS = 500
N_SNAPSHOTS = 4                 # e.g. 4 pulls, 30 days apart = 90 days of history
SNAPSHOT_INTERVAL_DAYS = 30
FIRST_SNAPSHOT_DATE = date(2026, 2, 1)

PROGRAMS = ["CSE", "ECE", "MECH", "CIVIL", "IT", "EEE"]
INCOME_BRACKETS = ["low", "lower_middle", "middle", "upper_middle", "high"]
# rough population weights — most students cluster middle
INCOME_WEIGHTS = [0.12, 0.28, 0.34, 0.18, 0.08]

# Hidden archetypes drive both baseline level AND trend across snapshots.
# weight = share of population, drift = per-snapshot change applied to
# attendance/score (fees/attempts derived separately below)
ARCHETYPES = {
    "stable":      {"weight": 0.55, "attendance_drift": 0.0,  "score_drift": 0.0},
    "declining":   {"weight": 0.20, "attendance_drift": -4.5, "score_drift": -3.0},
    "improving":   {"weight": 0.10, "attendance_drift": +3.0, "score_drift": +2.5},
    "volatile":    {"weight": 0.10, "attendance_drift": 0.0,  "score_drift": 0.0},  # noisy, no trend
    "at_risk_now": {"weight": 0.05, "attendance_drift": -1.0, "score_drift": -1.0}, # already bad, mild further slide
}


def weighted_choice(options, weights):
    return random.choices(options, weights=weights, k=1)[0]


def clamp(v, lo, hi):
    return max(lo, min(hi, v))


def gen_students(n):
    students = []
    for _ in range(n):
        sid = f"STU{uuid.uuid4().hex[:8].upper()}"
        archetype = weighted_choice(list(ARCHETYPES.keys()),
                                     [a["weight"] for a in ARCHETYPES.values()])
        income = weighted_choice(INCOME_BRACKETS, INCOME_WEIGHTS)

        # distance correlates loosely with income (lower income -> commuting
        # students living further, cruder proxy but fine for synthetic data)
        base_distance = {"low": 22, "lower_middle": 16, "middle": 10,
                          "upper_middle": 6, "high": 3}[income]
        distance_km = round(clamp(random.gauss(base_distance, 6), 0.5, 60), 1)

        # baseline attendance/score set per-student so archetype drift has
        # somewhere sensible to start from
        base_attendance = clamp(random.gauss(82, 10), 40, 100)
        base_score = clamp(random.gauss(68, 12), 20, 100)

        students.append({
            "student_id": sid,
            "program": weighted_choice(PROGRAMS, [1] * len(PROGRAMS)),
            "enrollment_year": random.choice([2023, 2024, 2025, 2026]),
            "family_income_bracket": income,
            "distance_from_campus_km": distance_km,
            "_archetype": archetype,            # hidden field, stripped before CSV export
            "_base_attendance": base_attendance,
            "_base_score": base_score,
        })
    return students


def gen_snapshots(students, n_snapshots, interval_days, first_date):
    """Returns list of (snapshot_date, [row, ...]) tuples."""
    all_snapshots = []
    for i in range(n_snapshots):
        snap_date = first_date + timedelta(days=interval_days * i)
        rows = []
        for s in students:
            arche = ARCHETYPES[s["_archetype"]]

            # attendance/score drift compounds snapshot over snapshot, plus noise
            noise_scale = 6 if s["_archetype"] == "volatile" else 3
            attendance = clamp(
                s["_base_attendance"] + arche["attendance_drift"] * i + random.gauss(0, noise_scale),
                0, 100
            )
            avg_score = clamp(
                s["_base_score"] + arche["score_drift"] * i + random.gauss(0, noise_scale),
                0, 100
            )

            # fee status worsens for low income + declining/at_risk archetypes
            fee_risk = 0.05
            if s["family_income_bracket"] in ("low", "lower_middle"):
                fee_risk += 0.18
            if s["_archetype"] in ("declining", "at_risk_now"):
                fee_risk += 0.15
            fee_status = weighted_choice(
                ["paid", "pending", "overdue"],
                [max(0.05, 1 - fee_risk * 2), fee_risk, fee_risk * 0.6]
            )

            # exam re-attempts (backlog) — inversely related to score, accumulates
            base_attempts = max(0, round((70 - avg_score) / 15))
            attempts_this_term = clamp(
                base_attempts + (1 if s["_archetype"] in ("declining", "at_risk_now") and random.random() < 0.3 else 0),
                0, 6
            )

            rows.append({
                "student_id": s["student_id"],
                "snapshot_date": snap_date.isoformat(),
                "attendance_pct": round(attendance, 1),
                "avg_score": round(avg_score, 1),
                "fee_status": fee_status,
                "exam_attempts_this_term": attempts_this_term,
            })
        all_snapshots.append((snap_date, rows))
    return all_snapshots


import os

def write_csv(path, rows, fieldnames):
    os.makedirs(os.path.dirname(path), exist_ok=True)

    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)



def main(out_dir):
    students = gen_students(N_STUDENTS)

    # -------------------------
    # Write students.csv
    # -------------------------
    student_fieldnames = [
        "student_id",
        "program",
        "enrollment_year",
        "family_income_bracket",
        "distance_from_campus_km"
    ]

    student_rows = [
        {k: s[k] for k in student_fieldnames}
        for s in students
    ]

    write_csv(
        f"{out_dir}/students.csv",
        student_rows,
        student_fieldnames
    )

    print(f"wrote {out_dir}/students.csv ({len(student_rows)} rows)")

    # -------------------------
    # Generate dropout.csv
    # -------------------------
    dropout_rows = []

    for s in students:

        if s["_archetype"] == "at_risk_now":
            dropout = 1 if random.random() < 0.95 else 0

        elif s["_archetype"] == "declining":
            dropout = 1 if random.random() < 0.65 else 0

        elif s["_archetype"] == "volatile":
            dropout = 1 if random.random() < 0.20 else 0

        elif s["_archetype"] == "stable":
            dropout = 1 if random.random() < 0.03 else 0

        else:   # improving
            dropout = 1 if random.random() < 0.02 else 0

        dropout_rows.append({
            "student_id": s["student_id"],
            "dropout": dropout
        })

    write_csv(
        f"{out_dir}/dropout.csv",
        dropout_rows,
        ["student_id", "dropout"]
    )

    print(f"wrote {out_dir}/dropout.csv ({len(dropout_rows)} rows)")

    # -------------------------
    # Generate snapshots
    # -------------------------
    snapshots = gen_snapshots(
        students,
        N_SNAPSHOTS,
        SNAPSHOT_INTERVAL_DAYS,
        FIRST_SNAPSHOT_DATE
    )

    snapshot_fieldnames = [
        "student_id",
        "snapshot_date",
        "attendance_pct",
        "avg_score",
        "fee_status",
        "exam_attempts_this_term"
    ]

    for snap_date, rows in snapshots:
        filename = f"{out_dir}/snapshot_{snap_date.isoformat()}.csv"

        write_csv(
            filename,
            rows,
            snapshot_fieldnames
        )

        print(f"wrote {filename} ({len(rows)} rows)")

    print("\nArchetype mix:")
    from collections import Counter
    print(Counter(s["_archetype"] for s in students))


if __name__ == "__main__":
    main("../data")
