from typing import Literal, Optional

from pydantic import BaseModel


class MathsAttempt(BaseModel):
    """One answered question, exactly as the app sends it (mobile/components/maths-slow/mathsSlowApi.ts)."""
    student_id: Optional[str] = None
    session_id: str
    question_no: int
    question_type: Literal['addition', 'subtraction', 'multiplication', 'division']
    question: str
    operand_a: float
    operand_b: float
    correct_answer: float
    student_answer: float
    is_correct: bool
    total_time: float          # seconds spent on this question
    erase_count: int
    hint_count: int
    has_carry: bool
    carry_over_time: float     # seconds between ones digit and tens digit (0 if no carry)
    created_at: str


class SlowLearnerPrediction(BaseModel):
    prediction: str            # "Slow" or "Normal"
    is_slow: bool
    probability_slow: float
    features: dict[str, float | str]
    model: str