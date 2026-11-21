def build_triage_queue(scored_students, counselor_capacity=15, min_level="Medium"):
    """
    Build a ranked intervention queue.

    Parameters
    ----------
    scored_students : list of dictionaries
        Output from score_student()

    counselor_capacity : int
        Number of students counselors can handle.

    min_level : str
        Lowest risk level to include.
    """

    level_rank = {
        "High": 0,
        "Medium": 1,
        "Low": 2
    }

    min_rank = level_rank[min_level]

    eligible = [
        s for s in scored_students
        if level_rank[s["risk_level"]] <= min_rank
    ]

    queue = sorted(
        eligible,
        key=lambda s: (
            level_rank[s["risk_level"]],
            -s["risk_score"]
        )
    )

    for i, student in enumerate(queue):

        student["queue_rank"] = i + 1

        student["within_capacity"] = (
            i < counselor_capacity
        )

    return queue


if __name__ == "__main__":

    demo = [
        {
            "student_id": "STU001",
            "risk_score": 0.92,
            "risk_level": "High"
        },
        {
            "student_id": "STU002",
            "risk_score": 0.58,
            "risk_level": "Medium"
        },
        {
            "student_id": "STU003",
            "risk_score": 0.88,
            "risk_level": "High"
        }
    ]

    queue = build_triage_queue(
        demo,
        counselor_capacity=2
    )

    for student in queue:
        print(student)

        