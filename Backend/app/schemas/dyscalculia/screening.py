from typing import Literal

from pydantic import BaseModel, Field

Task = Literal['SmallProblem', 'Plus1', 'LargeProblem', 'NumberMatching', 'ShapeMatching', 'FaceMatching', 'STM5']


class Trial(BaseModel):
    task: Task
    correct: bool
    responded: bool = Field(description='False when the child did not answer before the deadline')
    rtMs: float | None = Field(None, ge=0, description='Reaction time in milliseconds (None if no answer)')


class Child(BaseModel):
    nickname: str = Field('', max_length=60)


class ScreeningRequest(BaseModel):
    child: Child = Child()
    trials: list[Trial] = Field(min_length=1, max_length=500)


class ScreeningReport(BaseModel):
    """Same shape as ScreeningReport in mobile/types/dyscalculia/index.ts (plus explanation details)."""

    riskLevel: Literal['elevated', 'general', 'low']
    riskScore: float = Field(description='Model probability of dyscalculia risk, 0..1')
    recommendation: Literal['stage2', 'slowLearner', 'none']
    reasons: list[str]
    controlLow: bool
    features: dict[str, float | None]
    contributions: dict[str, float] = Field(description='SHAP value of each model feature (log-odds)')
    imputed: list[str] = Field(description='Model features that were missing and filled with the training median')
    threshold: float
    source: Literal['model']
    date: str
