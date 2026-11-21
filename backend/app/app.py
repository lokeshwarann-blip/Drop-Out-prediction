from flask import Flask, request, jsonify

from predict import predict_student, preprocess_input
from explain import explain
from interventions import recommend_interventions
from triage import build_triage_queue

app = Flask(__name__)


def score_student(student_id, student_features):

    processed = preprocess_input(student_features)

    prediction = predict_student(student_features)

    top_factors = explain(processed)

    interventions = recommend_interventions(top_factors)

    return {
        "student_id": student_id,
        "risk_score": prediction["risk_score"],
        "risk_level": prediction["risk_level"],
        "top_factors": top_factors,
        "recommended_interventions": interventions
    }


@app.route("/")
def home():
    return jsonify({
        "message": "Student Dropout Prediction API Running"
    })


@app.route("/score_student", methods=["POST"])
def score():

    body = request.json

    student_id = body["student_id"]

    result = score_student(student_id, body)

    return jsonify(result)


@app.route("/triage", methods=["POST"])
def triage():

    body = request.json

    students = body["students"]

    capacity = body.get("capacity", 15)

    scored = []

    for student in students:

        sid = student["student_id"]

        scored.append(
            score_student(
                sid,
                student
            )
        )

    queue = build_triage_queue(
        scored,
        counselor_capacity=capacity
    )

    return jsonify(queue)


if __name__ == "__main__":
    app.run(debug=True)