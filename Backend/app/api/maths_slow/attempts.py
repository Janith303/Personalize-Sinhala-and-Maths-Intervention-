from fastapi import APIRouter

from app.schemas.maths_slow.attempt import MathsAttempt, SlowLearnerPrediction
from app.services.maths_slow.slow_learner_service import build_features, get_slow_learner_service

router = APIRouter(prefix='/api/maths-slow', tags=['maths-slow'])


@router.post('/attempts', response_model=SlowLearnerPrediction)
def receive_attempt(attempt: MathsAttempt):
    features = build_features(attempt.total_time, attempt.carry_over_time,
                              attempt.erase_count, attempt.hint_count, attempt.question_type)
    result = get_slow_learner_service().predict(features)

    # Show the prediction in the backend terminal
    print(f"[maths-slow] session={attempt.session_id} Q{attempt.question_no} {attempt.question} "
          f"({attempt.question_type}) time={attempt.total_time}s carry={attempt.carry_over_time}s "
          f"erase={attempt.erase_count} hints={attempt.hint_count} "
          f"-> {result['prediction'].upper()} (P(slow)={result['probability_slow']:.2f})", flush=True)
    return result


@router.get('/health')
def maths_slow_health():
    get_slow_learner_service()
    return {'status': 'ok', 'model': 'DecisionTreeClassifier'}