"""Sinhala texts used in the screening report (same wording as the app, mobile/constants/dyscalculia/strings.si.ts)."""

TASK_TITLES = {
    'SmallProblem': 'කුඩා එකතු කිරීම්',
    'Plus1': 'එකක් එකතු කිරීම',
    'LargeProblem': 'විශාල එකතු කිරීම්',
    'NumberMatching': 'අංක සහ තිත්',
    'ShapeMatching': 'හැඩ',
    'FaceMatching': 'මුහුණු',
    'STM5': 'තරු මතකය',
}


def low_accuracy(task: str) -> str:
    return f'{TASK_TITLES[task]}: නිරවද්‍යතාව අඩුයි'


def slow_response(task: str) -> str:
    return f'{TASK_TITLES[task]}: ප්‍රතිචාර කාලය වැඩියි'


CONTROL_LOW = 'හැඩ හා මුහුණු ක්‍රීඩාවල ද ලකුණු අඩුයි (ගණිතයට පමණක් සීමා නොවේ)'
GUESSING = 'පිළිතුරු ඉතා ඉක්මනින් හා අහඹු ලෙස දී ඇති බව පෙනේ. නැවත පරීක්ෂා කරන්න.'
