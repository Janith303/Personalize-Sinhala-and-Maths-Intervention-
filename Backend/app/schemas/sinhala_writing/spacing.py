from typing import Literal, Optional

from pydantic import BaseModel, Field


class GapResult(BaseModel):
    index: int = Field(description='Gap number, counted from the left')
    between_words: list[int] = Field(description='The two word numbers this gap separates')
    width: float = Field(description='Gap width divided by letter height')
    status: Literal['ok', 'too_wide', 'too_narrow']
    message: str = Field(description='Sinhala message for this gap')


class SpacingResult(BaseModel):
    is_correct: bool
    verdict: Literal['GOOD', 'BAD']
    message: str = Field(description='Sinhala message for the whole line')
    probability_bad: float
    confidence: float
    words_found: int
    letter_height_px: float
    normal_gap_range: list[float]
    gaps: list[GapResult]
    annotated_image: Optional[str] = Field(None, description='data:image/jpeg;base64,... with gaps coloured')
    model: str