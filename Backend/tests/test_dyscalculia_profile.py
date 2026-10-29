"""Tests for the Stage 2 learning profile API. Run from the Backend folder:  python -m pytest tests/test_dyscalculia_profile.py"""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)
GROUPS = ('practognostic', 'sequential', 'operational')


def answers(correct=None, rt=None, n=9):
    """correct / rt: per-group number of correct answers (of n) and reaction time in ms."""
    correct = {g: 8 for g in GROUPS} | (correct or {})
    rt = {g: 3000 for g in GROUPS} | (rt or {})
    return {
        'child': {'nickname': 'Test'},
        'answers': [
            {'group': g, 'kind': 'test', 'correct': i < correct[g], 'rtMs': rt[g] + i * 10}
            for g in GROUPS
            for i in range(n)
        ],
    }


def post(body):
    r = client.post('/api/dyscalculia/profiles', json=body)
    assert r.status_code == 200, r.text
    return r.json()


def groups_of(rep):
    return [p['group'] for p in rep['profile']]


def test_no_weak_area_is_unclassified():
    rep = post(answers())
    assert groups_of(rep) == ['unclassified']
    assert all(not g['needsSupport'] for g in rep['groups'])


def test_low_accuracy_flags_one_group():
    rep = post(answers(correct={'sequential': 4}))
    assert groups_of(rep) == ['sequential']
    seq = next(g for g in rep['groups'] if g['group'] == 'sequential')
    assert seq['reason'] == 'accuracy' and abs(seq['accuracy'] - 4 / 9) < 1e-9


def test_child_can_be_in_several_groups():
    rep = post(answers(correct={'practognostic': 5, 'operational': 3}))
    assert groups_of(rep) == ['practognostic', 'operational']


def test_accurate_but_much_slower_area_is_flagged_for_speed():
    rep = post(answers(rt={'operational': 9000}))
    op = next(g for g in rep['groups'] if g['group'] == 'operational')
    assert op['needsSupport'] and op['reason'] == 'speed'


def test_slightly_slower_area_is_not_flagged():
    rep = post(answers(rt={'operational': 4000}))
    assert groups_of(rep) == ['unclassified']


def test_group_names_and_explanations_are_in_the_report():
    rep = post(answers(correct={'practognostic': 2}))
    item = rep['profile'][0]
    assert 'Practognostic' in item['name'] and item['explanation']


def test_invalid_group_is_rejected():
    bad = {'answers': [{'group': 'other', 'kind': 'x', 'correct': True, 'rtMs': 100}]}
    assert client.post('/api/dyscalculia/profiles', json=bad).status_code == 422
