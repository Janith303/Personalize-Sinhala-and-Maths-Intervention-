// All Sinhala text of the dyscalculia module, in one place so it can be reviewed and corrected easily.
// English comments describe each group; change only the text inside the quotes.

import type { ScreeningTask, SkillArea } from '../../types/dyscalculia';

export const si = {
  common: {
    back: 'ආපසු',
    start: 'පටන් ගමු',
    next: 'ඊළඟ',
    continue: 'ඉදිරියට',
    home: 'මුල් පිටුවට',
    stars: 'තරු',
    correct: 'හරි',
    wrong: 'වැරදි',
    same: 'සමානයි',
    different: 'වෙනස්',
    yes: 'ඔව්',
    no: 'නැහැ',
    ready: 'සූදානම්ද?',
    praise: ['නියමයි!', 'ශාබාෂ්!', 'හරි අගෙයි!', 'ඉතා හොඳයි!'],
    keepGoing: 'හොඳයි! දිගටම කරමු',
    tryAgain: 'කමක් නැහැ!',
    correctAnswerIs: (answer: string | number) => `නිවැරදි පිළිතුර: ${answer}`,
    loading: 'මඳක් රැඳී සිටින්න...',
  },

  // Module home screen
  home: {
    title: 'ගණිත වික්‍රමය',
    hello: 'ආයුබෝවන්!',
    helloName: (name: string) => `ආයුබෝවන්, ${name}!`,
    subtitle: 'අද අපි ගණිතය ඉගෙන ගනිමු!',
    stage1Title: 'ගණිත ක්‍රීඩා',
    stage1Sub: 'පටන් ගමු',
    stage1Done: 'අවසන් කළා',
    stage2Title: 'තවත් ක්‍රීඩා',
    stage2Locked: 'පළමු ක්‍රීඩා අවසන් කරන්න',
    stage2Sub: 'පටන් ගමු',
    practiceTitle: 'පුහුණු වෙමු',
    practiceSub: 'මගේ ගණිත ගමන',
    teacher: 'ගුරු / දෙමාපිය ප්‍රතිඵල',
  },

  // Stage 1: screening
  screening: {
    introTitle: 'ගණිත ක්‍රීඩා',
    askName: 'ඔබේ නම කුමක්ද?',
    namePlaceholder: 'නම',
    nameRequired: 'කරුණාකර ඔබේ නම ඇතුළත් කරන්න',
    explain: 'කෙටි ක්‍රීඩා 7ක් තිබෙනවා. හොඳින් බලා, ඉක්මනින් පිළිතුරු දෙන්න!',
    tip: 'වැරදුණත් කමක් නැහැ. ඔබට හැකි හොඳම දේ කරන්න.',
    nameHelp: 'හොඳයි! ඔබේ නම ලියන්න.\nඉන්පසු "පටන් ගමු" බොත්තම ඔබන්න!\nඑවිට අපි එකට ගණිතය ඉගෙන ගනිමු!',
    gameOf: (i: number, n: number) => `ක්‍රියාව ${i} / ${n}`,
    ask: {
      verify: 'මෙම පිළිතුර හරිද?',
      numberMatch: 'අංකය සහ තිත් ගණන සමානද?',
      shapeMatch: 'හැඩ දෙක සමානද?',
      faceMatch: 'මුහුණු දෙක සමානද?',
      memoryWatch: 'තරු ඇති කොටු මතක තබා ගන්න!',
      memoryAsk: 'මෙම කොටුවේ තරුවක් තිබුණාද?',
    },
    doneTitleA: 'නියමයි!',
    doneTitleB: 'ඔබ සියලු ක්‍රීඩා අවසන් කළා!',
    doneSub: 'ඔබට තරු ලැබුණා:',
    forTeacher: 'ගුරුවරයාට ප්‍රතිඵල',
    calculating: 'ප්‍රතිඵල සකසමින්...',
  },

  // Titles and instructions of the 7 screening games
  tasks: {
    SmallProblem: {
      title: 'කුඩා එකතු කිරීම්',
      instruction: 'ඔබට එකතු කිරීමක් සහ පිළිතුරක් පෙනෙනවා. පිළිතුර හරිද, වැරදිද?',
    },
    Plus1: {
      title: 'එකක් එකතු කිරීම',
      instruction: 'සෑම ගණනකටම 1ක් එකතු වෙනවා. පිළිතුර හරිද, වැරදිද?',
    },
    LargeProblem: {
      title: 'විශාල එකතු කිරීම්',
      instruction: 'දැන් ගණන් ටිකක් විශාලයි. පිළිතුර හරිද, වැරදිද?',
    },
    NumberMatching: {
      title: 'අංක සහ තිත්',
      instruction: 'අංකය සහ තිත් ගණන සමානද?',
    },
    ShapeMatching: {
      title: 'හැඩ',
      instruction: 'හැඩ දෙක එක හා සමානද?',
    },
    FaceMatching: {
      title: 'මුහුණු',
      instruction: 'මුහුණු දෙක එක හා සමානද?',
    },
    STM5: {
      title: 'තරු මතකය',
      instruction: 'තරු ඇති කොටු මතක තබා ගන්න. පසුව එක් කොටුවක් දිලිසෙනවා. එහි තරුවක් තිබුණාද?',
    },
  } satisfies Record<ScreeningTask, { title: string; instruction: string }>,

  // Stage 2: learning profile, and skill area names (also used in practice)
  areas: {
    quantity: 'ගණන් කරමු',
    sequence: 'පිළිවෙළට තබමු',
    operations: 'ගණිත ක්‍රියා',
  } satisfies Record<SkillArea, string>,

  profile: {
    introTitle: 'තවත් ක්‍රීඩා',
    explain: 'ගණන් කිරීම, අංක පිළිවෙළ සහ ගණිත ක්‍රියා ගැන ක්‍රීඩා 3ක්.',
    doneTitle: 'ශාබාෂ්! ක්‍රීඩා සියල්ල අවසන්!',
    doneSub: 'දැන් අපි එකට පුහුණු වෙමු',
    toPractice: 'පුහුණු වෙමු',
  },

  // Questions used in Stage 2 and practice
  questions: {
    howManyDots: 'තිත් කීයක් තිබේද?',
    whichMore: 'වැඩිපුර තිත් ඇත්තේ කුමන පැත්තේද?',
    nextNumber: 'ඊළඟට එන්නේ කුමන අංකයද?',
    missingNumber: 'නැති අංකය කුමක්ද?',
    solve: 'පිළිතුර කුමක්ද?',
    chooseSign: 'නිවැරදි ලකුණ තෝරන්න',
    left: 'වම',
    right: 'දකුණ',
  },

  // Intervention (practice)
  practice: {
    title: 'මගේ ගණිත ගමන',
    areaSub: {
      quantity: 'අංක හඳුනාගෙන ගණන් කරමු',
      sequence: 'අංකවල රටාව හඳුනා ගනිමු',
      operations: 'එකතු කිරීම හා අඩු කිරීම',
    } satisfies Record<SkillArea, string>,
    level: (n: number) => `මට්ටම ${n}`,
    recommended: 'ඔබට නිර්දේශිතයි',
    sessionDone: 'පුහුණුව අවසන්!',
    score: (correct: number, total: number) => `ප්‍රශ්න ${total}න් ${correct}ක් හරි`,
    levelUp: 'නව මට්ටමක් විවෘත විය!',
    tryEasier: 'ටිකක් පහසු මට්ටමකින් පුහුණු වෙමු',
    again: 'නැවත කරමු',
    nextLevel: 'ඊළඟ මට්ටම',
    backToMap: 'ගමනට ආපසු',
  },

  // Teacher / parent area (behind a PIN)
  teacher: {
    title: 'ගුරුවරුන් හා දෙමාපියන් සඳහා ප්‍රතිඵල',
    about:
      'මෙම කොටස ළමයාට නොව, ගුරුවරයාට හෝ දෙමාපියන්ට පමණි. ළමයාගේ ක්‍රීඩා ප්‍රතිඵල, අවදානම සහ ඊළඟ පියවර මෙහි පෙන්වයි.',
    pinPrompt: 'PIN අංකය ඇතුළත් කරන්න',
    pinHint: 'ආදර්ශ PIN: 1234',
    wrongPin: 'PIN අංකය වැරදියි',
    open: 'විවෘත කරන්න',
    child: 'ළමයා',
    noResults: 'තවම පරීක්ෂණයක් සිදු කර නැත',
    stage1: 'පියවර 1: තිරගත කිරීම',
    stage2: 'පියවර 2: ඉගෙනුම් පැතිකඩ',
    practice: 'පුහුණු ප්‍රගතිය',
    riskScore: 'අවදානම් ලකුණු',
    risk: {
      elevated: 'ඩිස්කැල්කියුලියා අවදානම ඉහළයි',
      general: 'සාමාන්‍ය ඉගෙනුම් අපහසුතාවක ලක්ෂණ',
      low: 'අවදානම අඩුයි',
    },
    recommendation: {
      stage2: 'පියවර 2 ක්‍රීඩා කරවන්න',
      slowLearner: 'ගණිතයේ මන්දගාමී ඉගෙනුම් කොටස යෝජනා කෙරේ',
      none: 'විශේෂ ක්‍රියාමාර්ගයක් අවශ්‍ය නැත',
    },
    reasons: 'හේතු',
    lowAccuracy: (task: string) => `${task}: නිරවද්‍යතාව අඩුයි`,
    slowResponse: (task: string) => `${task}: ප්‍රතිචාර කාලය වැඩියි`,
    controlLow: 'හැඩ හා මුහුණු ක්‍රීඩාවල ද ලකුණු අඩුයි (ගණිතයට පමණක් සීමා නොවේ)',
    guessing: 'පිළිතුරු ඉතා ඉක්මනින් හා අහඹු ලෙස දී ඇති බව පෙනේ. නැවත පරීක්ෂා කරන්න.',
    needsSupport: 'සහාය අවශ්‍යයි',
    strength: 'ශක්තිමත්',
    levelReached: (n: number) => `ළඟා වූ මට්ටම: ${n} / 4`,
    disclaimer: 'මෙය තිරගත කිරීමක් පමණි, රෝග විනිශ්චයක් නොවේ. තහවුරු කිරීමට මනෝවිද්‍යාඥයෙකු හමුවන්න.',
    demoNote: 'ආදර්ශ ගණනය කිරීම (AI ආකෘතිය පසුව සම්බන්ධ කෙරේ)',
    reset: 'නව ළමයෙකු සඳහා මකා දමන්න',
  },
};
