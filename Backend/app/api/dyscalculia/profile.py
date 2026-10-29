from fastapi import APIRouter

from app.schemas.dyscalculia.profile import ProfileReport, ProfileRequest
from app.services.dyscalculia.profile_service import build_profile

router = APIRouter(prefix='/api/dyscalculia', tags=['dyscalculia'])


@router.post('/profiles', response_model=ProfileReport)
def profile(request: ProfileRequest):
    """Stage 2: rule-based learning profile (practognostic / sequential / operational / unclassified)."""
    return build_profile([a.model_dump() for a in request.answers])
