from typing import Literal, Optional

from pydantic import BaseModel, Field


class WordResult(BaseModel):
    index: int = Field(description='Word number, counted from the left')
    gap: float = Field(description='Distance from the guide line in character heights (+ above, - below)')
    status: Literal['on_line', 'above', 'below']
    message: str = Field(description='Sinhala message for this word')


class BaselineMeasurements(BaseModel):
    drift_slope: Optional[float] = None
    mean_gap: Optional[float] = None
    max_abs_gap: Optional[float] = None
    waviness: Optional[float] = None


class BaselineResult(BaseModel):
    is_correct: bool
    verdict: Literal['CORRECT', 'WRONG']
    message: str = Field(description='Sinhala message for the whole line')
    probability_wrong: float
    confidence: float
    guide_line_found: bool
    words_found: int
    measurements: BaselineMeasurements
    words: list[WordResult]
    annotated_image: Optional[str] = Field(None, description='data:image/jpeg;base64,... with line and gaps drawn')
    model: str