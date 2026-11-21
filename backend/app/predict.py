

import joblib
import pandas as pd

import os

# Load model
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model = joblib.load(os.path.join(BASE_DIR, "model", "xgboost_model.pkl"))

# Load encoders
program_encoder = joblib.load(os.path.join(BASE_DIR, "model", "program_encoder.pkl"))
income_encoder = joblib.load(os.path.join(BASE_DIR, "model", "income_encoder.pkl"))


def preprocess_input(features: dict):
    """
    Convert a student's feature dictionary into the format
    expected by the trained XGBoost model.
    """

    fee_map = {
        "paid": 0,
        "pending": 1,
        "overdue": 2
    }

    program = program_encoder.transform([features["program"]])[0]
    income = income_encoder.transform(
        [features["family_income_bracket"]]
    )[0]

    row = pd.DataFrame([{
    "program": program,
    "enrollment_year": features["enrollment_year"],
    "family_income_bracket": income,
    "distance_from_campus_km": features["distance_from_campus_km"],
    "attendance_pct": features["attendance_pct"],
    "avg_score": features["avg_score"],
    "fee_status": fee_map[features["fee_status"]],
    "exam_attempts_this_term": features["exam_attempts_this_term"],
    "attendance_delta_30d": features.get("attendance_delta_30d", 0.0),
    "score_delta_30d": features.get("score_delta_30d", 0.0),
    "fee_status_worsening": features.get("fee_status_worsening", 0),
    "month": features["month"],
    "year": features["year"]
}])
   

    return row


def predict_student(features: dict):

    X = preprocess_input(features)

    probability = float(model.predict_proba(X)[0][1])

    if probability >= 0.75:
        level = "High"
    elif probability >= 0.40:
        level = "Medium"
    else:
        level = "Low"

    return {
        "risk_score": round(probability, 3),
        "risk_level": level
    }


if __name__ == "__main__":

    student = {
        "attendance_pct": 52,
        "avg_score": 48,
        "fee_status": "overdue",
        "exam_attempts_this_term": 3,
        "program": "CSE",
        "enrollment_year": 2024,
        "family_income_bracket": "low",
        "distance_from_campus_km": 18,
        "month": 5,
        "year": 2026
    }

    print(predict_student(student))