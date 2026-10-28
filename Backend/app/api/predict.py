from fastapi import APIRouter, File, Form, HTTPException, Query, UploadFile

from app.core.config import LETTERS, settings
from app.db.mongodb import get_db
from app.models.prediction import new_prediction_document, prediction_from_document
from app.schemas.prediction import PredictionRecord, PredictionResponse
from app.services.prediction_service import prediction_service

router = APIRouter(prefix="/predict", tags=["prediction"])

ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/bmp"}


@router.post("", response_model=PredictionResponse)
async def predict(
    file: UploadFile = File(..., description="Image of the written answer"),
    student_id: str | None = Form(None),
    subject: str | None = Form(None, description="e.g. 'sinhala' or 'maths'"),
    question_id: str | None = Form(None),
    asked_letter: str | None = Form(None, description="Letter the app asked for: ga, ra, ta, u or la"),
):
    if asked_letter is not None and asked_letter not in LETTERS:
        raise HTTPException(422, f"asked_letter must be one of {LETTERS}")
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(415, f"Unsupported image type '{file.content_type}'. Use JPEG, PNG or BMP.")
    data = await file.read()
    if not data:
        raise HTTPException(400, "Empty file")
    if len(data) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(413, f"File larger than {settings.max_upload_mb} MB")
    if not prediction_service.is_loaded:
        raise HTTPException(503, "Model is not loaded")

    try:
        result = prediction_service.predict(data, asked_letter)
    except Exception:
        raise HTTPException(422, "Could not read the image")

    response = PredictionResponse(**result)
    db = get_db()
    if db is not None:
        doc = new_prediction_document(
            result, student_id=student_id, subject=subject,
            question_id=question_id, filename=file.filename,
        )
        inserted = await db.predictions.insert_one(doc)
        response.id = str(inserted.inserted_id)
        response.saved = True
    return response


@router.get("", response_model=list[PredictionRecord])
async def list_predictions(
    student_id: str | None = None,
    limit: int = Query(50, ge=1, le=200),
):
    db = get_db()
    if db is None:
        raise HTTPException(503, "Database not connected (set MONGODB_URI)")
    # older records from the previous binary model have no "verdict" - skip them
    query: dict = {"verdict": {"$exists": True}}
    if student_id:
        query["student_id"] = student_id
    cursor = db.predictions.find(query).sort("created_at", -1).limit(limit)
    return [prediction_from_document(d) async for d in cursor]
