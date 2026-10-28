from datetime import datetime, timezone


def new_prediction_document(
    result: dict,
    *,
    student_id: str | None,
    subject: str | None,
    question_id: str | None,
    filename: str | None,
) -> dict:
    """MongoDB document for the `predictions` collection."""
    return {
        **result,
        "student_id": student_id,
        "subject": subject,
        "question_id": question_id,
        "filename": filename,
        "created_at": datetime.now(timezone.utc),
    }


def prediction_from_document(doc: dict) -> dict:
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    return doc
