INTERVENTION_RULES = {
    "attendance_pct": "Mentor call - attendance check-in",
    "avg_score": "Academic support - tutoring referral",
    "fee_status": "Financial counseling referral",
    "exam_attempts_this_term": "Backlog clearance plan",
    "distance_from_campus_km": "Hostel/transport assistance check",
    "family_income_bracket": "Financial aid / scholarship review",
    "program": "Department academic advisor review"
}


def recommend_interventions(top_factors):
    """
    top_factors = output from explain.py
    Example:
    [
        {"factor":"attendance_pct","impact":0.41},
        {"factor":"avg_score","impact":0.27},
        {"factor":"fee_status","impact":0.18}
    ]
    """

    recommendations = []

    for factor in top_factors:

        # Only recommend interventions for factors
        # that increase the dropout risk
        if factor["impact"] > 0:

            action = INTERVENTION_RULES.get(factor["factor"])

            if action and action not in recommendations:
                recommendations.append(action)

    if not recommendations:
        recommendations.append(
            "Monitor student - no major intervention required"
        )

    return recommendations



if __name__ == "__main__":

    sample_factors = [
        {"factor": "attendance_pct", "impact": 0.43},
        {"factor": "avg_score", "impact": 0.31},
        {"factor": "fee_status", "impact": 0.17}
    ]

    print(recommend_interventions(sample_factors))