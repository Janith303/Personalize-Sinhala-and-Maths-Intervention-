from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.dyscalculia.screening import Child

Group = Literal['practognostic', 'sequential', 'operational']
ProfileGroup = Literal['practognostic', 'sequential', 'operational', 'unclassified']


class Answer(BaseModel):
    group: Group
    kind: str = Field(max_length=40, description='Question type, e.g. "numberLine" or "orderCheck"')
    correct: bool
    rtMs: float | None = Field(None, ge=0)


class ProfileRequest(BaseModel):
    child: Child = Child()
    answers: list[Answer] = Field(min_length=1, max_length=200)


class GroupResult(BaseModel):
    group: Group
    name: str
    explanation: str
    correct: int
    total: int
    accuracy: float | None
    medianRtMs: float | None
    needsSupport: bool
    reason: Literal['accuracy', 'speed'] | None


class ProfileItem(BaseModel):
    group: ProfileGroup
    name: str
    explanation: str


class ProfileReport(BaseModel):
    """Same shape as ProfileReport in mobile/types/dyscalculia/index.ts."""

    groups: list[GroupResult]
    profile: list[ProfileItem] = Field(description='Group(s) needing support, or "unclassified"')
    source: Literal['rules']
    date: str
