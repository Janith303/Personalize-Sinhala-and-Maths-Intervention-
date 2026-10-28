import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import health, predict
from app.core.config import settings
from app.db.mongodb import close_db, connect_db
from app.services.prediction_service import prediction_service

logging.basicConfig(level=logging.INFO)


@asynccontextmanager
async def lifespan(app: FastAPI):
    prediction_service.load()
    await connect_db()
    yield
    await close_db()


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten for production
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Our research backend is running!"}


app.include_router(health.router)
app.include_router(predict.router, prefix=settings.api_prefix)
