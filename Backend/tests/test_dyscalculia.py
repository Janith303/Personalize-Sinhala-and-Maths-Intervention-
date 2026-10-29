"""Tests for the dyscalculia screening API. Run from the Backend folder:  python -m pytest tests/test_dyscalculia.py
Uses the model in app/ml_models/ML/dyscalculia (or DYSCALCULIA_MODEL_DIR)."""
import math

from fastapi.testclient import TestClient

from app.main import app
from app.services.dyscalculia.features import summarise_trials

client = TestClient(app)

TASKS = ['SmallProblem', 'Plus1', 'LargeProblem', 'NumberMatching', 'ShapeMatching', 'FaceMatching', 'STM5']


def session(math_acc=0.9, math_rt=2000.0, control_acc=0.9, control_rt=1200.0, skip=()):
    """8 trials per game; the first round(acc * 8) answers are correct."""
    trials = []
    for task in TASKS:
        if task in skip:
            continue
        maths = task in ('SmallProblem', 'Plus1', 'LargeProblem')
        acc, rt = (math_acc, math_rt) if maths else (control_acc, control_rt)
        for i in range(8):
            trials.append({'task': task, 'correct': i < round(acc * 8), 'responded': True, 'rtMs': rt + i * 10})
    return {'child': {'nickname': 'Test'}, 'trials': trials}


def test_feature_definitions_match_the_dataset():
    trials = [
        {'task': 'SmallProblem', 'correct': True, 'responded': True, 'rtMs': 1000},
        {'task': 'SmallProblem', 'correct': True, 'responded': True, 'rtMs': 3000},
        {'task': 'SmallProblem', 'correct': False, 'responded': True, 'rtMs': 500},
        {'task': 'SmallProblem', 'correct': False, 'responded': False, 'rtMs': None},
    ]
    f = summarise_trials(trials)
    assert f['SmallProblem_acc'] == 0.5  # no answer counts as wrong
    assert f['SmallProblem_rt'] == 2000  # median of correct trials only


def test_health_reports_the_six_feature_model():
    r = client.get('/api/dyscalculia/health')
    assert r.status_code == 200
    body = r.json()
    assert body['features'] == ['SmallProblem_acc', 'LargeProblem_acc', 'Plus1_acc',
                                'SmallProblem_rt', 'LargeProblem_rt', 'Plus1_rt']
    assert 0 < body['threshold'] < 1


def test_struggling_child_is_flagged_with_reasons():
    rep = client.post('/api/dyscalculia/screenings', json=session(math_acc=0.4, math_rt=4500)).json()
    assert rep['riskLevel'] == 'elevated'
    assert rep['recommendation'] == 'stage2'
    assert rep['riskScore'] >= rep['threshold']
    assert rep['reasons'], 'an at-risk child needs reasons'
    assert rep['source'] == 'model'


def test_strong_child_is_low_risk():
    rep = client.post('/api/dyscalculia/screenings', json=session(math_acc=1.0, math_rt=1500)).json()
    assert rep['riskLevel'] == 'low'
    assert rep['recommendation'] == 'none'
    assert rep['reasons'] == []


def test_low_control_games_route_to_slow_learner_module():
    body = session(math_acc=0.4, math_rt=4500, control_acc=0.5, control_rt=2200)
    rep = client.post('/api/dyscalculia/screenings', json=body).json()
    assert rep['riskLevel'] == 'general'
    assert rep['recommendation'] == 'slowLearner'
    assert rep['controlLow'] is True


def test_missing_game_is_filled_with_training_median():
    rep = client.post('/api/dyscalculia/screenings', json=session(skip=('LargeProblem',))).json()
    assert set(rep['imputed']) == {'LargeProblem_acc', 'LargeProblem_rt'}


def test_shap_contributions_add_up_to_the_probability():
    rep = client.post('/api/dyscalculia/screenings', json=session(math_acc=0.6, math_rt=3000)).json()
    from app.services.dyscalculia.screening_service import get_screening_service

    pred = get_screening_service().predict_features(rep['features'])
    margin = pred['base_value'] + sum(pred['contributions'].values())
    assert math.isclose(1 / (1 + math.exp(-margin)), rep['riskScore'], rel_tol=1e-5)


def test_guessing_is_flagged():
    rep = client.post('/api/dyscalculia/screenings', json=session(math_acc=0.5, math_rt=300, control_rt=300)).json()
    assert any('අහඹු' in r for r in rep['reasons'])


def test_invalid_input_is_rejected():
    assert client.post('/api/dyscalculia/screenings', json={'trials': []}).status_code == 422
    bad = {'trials': [{'task': 'Unknown', 'correct': True, 'responded': True, 'rtMs': 1000}]}
    assert client.post('/api/dyscalculia/screenings', json=bad).status_code == 422
