from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class PredictionResult(BaseModel):
    verdict: Literal["correct", "wrong", "wrong_letter", "try_again"]
    asked_letter: str | None = Field(default=None, description="Letter the app asked for: ga, ra, ta, u or la")
    predicted_letter: str
    predicted_state: Literal["correct", "wrong"]
    pred_class: str = Field(description="Top class, e.g. 'ga_correct'")
    confidence: float
    probabilities: dict[str, float]


class PredictionResponse(PredictionResult):
    id: str | None = Field(default=None, description="MongoDB id, null if the database is not connected")
    saved: bool = False


class PredictionRecord(BaseModel):
    id: str
    verdict: str
    asked_letter: str | None = None
    predicted_letter: str
    predicted_state: str
    pred_class: str
    confidence: float
    student_id: str | None = None
    subject: str | None = None
    question_id: str | None = None
    filename: str | None = None
    created_at: datetime


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    database_connected: bool
