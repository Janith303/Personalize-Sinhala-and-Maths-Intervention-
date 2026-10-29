from fastapi import APIRouter, HTTPException

from app.schemas.dyscalculia.screening import ScreeningReport, ScreeningRequest
from app.services.dyscalculia.screening_service import ModelNotFoundError, get_screening_service

router = APIRouter(prefix='/api/dyscalculia', tags=['dyscalculia'])


def _service():
    try:
        return get_screening_service()
    except ModelNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))


@router.post('/screenings', response_model=ScreeningReport)
def screen(request: ScreeningRequest):
    """Stage 1: score the 7 screening games with the trained model and explain the result."""
    trials = [t.model_dump() for t in request.trials]
    return _service().screen(trials)


@router.get('/health')
def health():
    service = _service()
    return {
        'status': 'ok',
        'model': service.model_name,
        'features': service.features,
        'threshold': service.threshold,
    }
