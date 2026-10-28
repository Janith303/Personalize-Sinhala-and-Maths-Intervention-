from fastapi import APIRouter

from app.db.mongodb import get_db
from app.schemas.prediction import HealthResponse
from app.services.prediction_service import prediction_service

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="ok",
        model_loaded=prediction_service.is_loaded,
        database_connected=get_db() is not None,
    )
