"""Turns the Stage 1 game answers into the features the model was trained on.

Definitions match the research dataset (OpenNeuro ds004791):
  <task>_acc = share of correct trials (no answer before the deadline counts as wrong)
  <task>_rt  = median reaction time (ms) of the correct trials
"""
from statistics import median

# Typically developing children in ds004791 (n = 38): mean and SD, used for the
# non-numerical control games that separate dyscalculia from general slowness.
CONTROL_REFERENCE = {
    'ShapeMatching_acc': (0.9298, 0.06219),
    'FaceMatching_acc': (0.7895, 0.08893),
    'ShapeMatching_rt': (1190.0, 166.4),
    'FaceMatching_rt': (1487.0, 179.0),
}
CONTROL_LOW_Z = 1.0  # control games on average 1 SD worse than typical -> not maths-specific

ARITHMETIC_TASKS = ('SmallProblem', 'Plus1', 'LargeProblem')


def summarise_trials(trials: list[dict]) -> dict[str, float | None]:
    """trials: [{task, correct, responded, rtMs}] -> {'<task>_acc': ..., '<task>_rt': ...}"""
    by_task: dict[str, list[dict]] = {}
    for t in trials:
        by_task.setdefault(t['task'], []).append(t)
    features: dict[str, float | None] = {}
    for task, ts in by_task.items():
        features[f'{task}_acc'] = sum(1 for t in ts if t['correct']) / len(ts)
        rts = [t['rtMs'] for t in ts if t['correct'] and t.get('rtMs') is not None]
        features[f'{task}_rt'] = float(median(rts)) if rts else None
    return features


def control_low(features: dict[str, float | None]) -> bool:
    """True when the shape and face games are also clearly below typical children.
    Being faster than typical never cancels out errors (reaction-time z-scores only add)."""
    zs = []
    for name, (mean, sd) in CONTROL_REFERENCE.items():
        value = features.get(name)
        if value is None:
            continue
        z = (value - mean) / sd if name.endswith('_rt') else (mean - value) / sd
        zs.append(max(0.0, z) if name.endswith('_rt') else z)
    return bool(zs) and sum(zs) / len(zs) > CONTROL_LOW_Z


def looks_like_guessing(trials: list[dict]) -> bool:
    """Very fast answers with near-chance accuracy on the arithmetic games."""
    arith = [t for t in trials if t['task'] in ARITHMETIC_TASKS]
    if not arith:
        return False
    accuracy = sum(1 for t in arith if t['correct']) / len(arith)
    rts = [t['rtMs'] for t in trials if t.get('rtMs') is not None]
    return accuracy < 0.65 and bool(rts) and median(rts) < 800
