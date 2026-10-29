"""All dyscalculia endpoints, so main.py needs only one include_router line for this module."""
from fastapi import APIRouter

from app.api.dyscalculia.profile import router as profile_router
from app.api.dyscalculia.screening import router as screening_router

router = APIRouter()
router.include_router(screening_router)
router.include_router(profile_router)
