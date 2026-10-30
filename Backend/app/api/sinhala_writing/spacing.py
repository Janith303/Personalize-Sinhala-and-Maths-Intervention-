from fastapi import APIRouter, File, HTTPException, Query, UploadFile

from app.schemas.sinhala_writing.spacing import SpacingResult
from app.services.sinhala_writing.config import settings
from app.services.sinhala_writing.spacing_preprocessing import NoHandwritingError
from app.services.sinhala_writing.spacing_service import InvalidImageError, get_spacing_service

router = APIRouter(prefix='/api/sinhala-writing/spacing', tags=['sinhala-writing'])


@router.post('/predict', response_model=SpacingResult)
async def predict_spacing(
    file: UploadFile = File(..., description='Photo of ONE handwritten line'),
    include_image: bool = Query(True, description='Return the image with gaps coloured'),
):
    if file.content_type and not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail='ඡායාරූපයක් පමණක් එවන්න.')

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail='ඡායාරූපය හිස්ය. නැවත උත්සාහ කරන්න.')
    if len(data) > settings.MAX_UPLOAD_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f'ඡායාරූපය විශාල වැඩියි (උපරිමය {settings.MAX_UPLOAD_MB} MB).')

    try:
        return get_spacing_service().predict(data, include_image=include_image)
    except InvalidImageError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except NoHandwritingError as e:
        raise HTTPException(status_code=422, detail=str(e))


@router.get('/health')
def spacing_health():
    service = get_spacing_service()
    return {'status': 'ok', 'model': service.model_name, 'normal_gap_range': service.good_range}