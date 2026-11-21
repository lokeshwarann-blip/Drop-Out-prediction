import joblib
import shap

import os

# Load model
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "model", "xgboost_model.pkl")
model = joblib.load(MODEL_PATH)

explainer = shap.TreeExplainer(model)

FEATURE_NAMES = [
    "program",
    "enrollment_year",
    "family_income_bracket",
    "distance_from_campus_km",
    "attendance_pct",
    "avg_score",
    "fee_status",
    "exam_attempts_this_term",
    "month",
    "year"
]


def explain(features):

    shap_values = explainer.shap_values(features)[0]

    ranked = sorted(
        zip(FEATURE_NAMES, shap_values),
        key=lambda x: abs(x[1]),
        reverse=True
    )

    return [
        {
            "factor": factor,
            "impact": round(float(value), 3)
        }
        for factor, value in ranked[:3]
    ]

from app.predict import preprocess_input

if __name__ == "__main__":

    student = {
        "attendance_pct":52,
        "avg_score":48,
        "fee_status":"overdue",
        "exam_attempts_this_term":3,
        "program":"CSE",
        "enrollment_year":2024,
        "family_income_bracket":"low",
        "distance_from_campus_km":18,
        "month":5,
        "year":2026
    }

    row = preprocess_input(student)

    print(explain(row))