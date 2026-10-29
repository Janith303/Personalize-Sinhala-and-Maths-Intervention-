"""Stage 2 learning profile: which dyscalculia group(s) a child's difficulties point to.

Rule-based (there is no labelled subtype data to train a model on). Groups follow the proposal,
after Kosc (1974): practognostic (quantities), sequential (number order), operational (operations).
A child can belong to several groups; "unclassified" means no group stands out.
This is a screening profile to guide support, not a diagnosis.
"""
from datetime import datetime, timezone
from statistics import median

GROUPS = ('practognostic', 'sequential', 'operational')

# A group needs support when accuracy is below this ...
MIN_ACCURACY = 0.70
# ... or when the child is accurate but clearly slower there than in their other groups.
SLOW_FACTOR = 1.5
SLOW_MIN_MS = 6000

GROUP_NAMES = {
    'practognostic': 'ප්‍රැක්ටොග්නොස්ටික් (Practognostic)',
    'sequential': 'අනුක්‍රමික (Sequential)',
    'operational': 'ක්‍රියාකාරී (Operational)',
    'unclassified': 'වර්ගීකරණය නොකළ (Unclassified)',
}
GROUP_EXPLANATIONS = {
    'practognostic': 'ප්‍රමාණ හඳුනාගැනීමට හා ගණන් කිරීමට සහාය අවශ්‍යයි',
    'sequential': 'අංක පිළිවෙළ හා රටා හඳුනාගැනීමට සහාය අවශ්‍යයි',
    'operational': 'එකතු කිරීම, අඩු කිරීම වැනි ගණිත ක්‍රියාවලට සහාය අවශ්‍යයි',
    'unclassified': 'කිසිදු එක් ක්ෂේත්‍රයක් පැහැදිලිව දුර්වල නැත. ගුරු නිරීක්ෂණය හා වැඩිදුර ඇගයීම නිර්දේශ කෙරේ.',
}


def _median_rt(answers: list[dict]) -> float | None:
    rts = [a['rtMs'] for a in answers if a['correct'] and a.get('rtMs') is not None]
    return float(median(rts)) if rts else None


def build_profile(answers: list[dict]) -> dict:
    """answers: [{group, kind, correct, rtMs}] -> per-group results and the profile."""
    by_group = {g: [a for a in answers if a['group'] == g] for g in GROUPS}
    stats = {}
    for g, ans in by_group.items():
        correct = sum(1 for a in ans if a['correct'])
        stats[g] = {
            'group': g,
            'correct': correct,
            'total': len(ans),
            'accuracy': correct / len(ans) if ans else None,
            'medianRtMs': _median_rt(ans),
        }

    for g, st in stats.items():
        reason = None
        if st['accuracy'] is not None and st['accuracy'] < MIN_ACCURACY:
            reason = 'accuracy'
        else:
            others = [stats[o]['medianRtMs'] for o in GROUPS if o != g and stats[o]['medianRtMs'] is not None]
            rt = st['medianRtMs']
            if rt is not None and others and rt > SLOW_FACTOR * median(others) and rt > SLOW_MIN_MS:
                reason = 'speed'
        st['needsSupport'] = reason is not None
        st['reason'] = reason
        st['name'] = GROUP_NAMES[g]
        st['explanation'] = GROUP_EXPLANATIONS[g]

    weak = [g for g in GROUPS if stats[g]['needsSupport']]
    profile = weak or ['unclassified']
    return {
        'groups': [stats[g] for g in GROUPS],
        'profile': [{'group': g, 'name': GROUP_NAMES[g], 'explanation': GROUP_EXPLANATIONS[g]} for g in profile],
        'source': 'rules',
        'date': datetime.now(timezone.utc).isoformat(),
    }
