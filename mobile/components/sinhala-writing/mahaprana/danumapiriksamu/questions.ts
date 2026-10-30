import { AudioSource } from "expo-audio";

export type QuestionType = "find" | "missing" | "pair" | "odd" | "spell" | "count";

export type Question = {
  type: QuestionType;
  display: string;        // big text shown in the card (word, blanked word or letter)
  emoji?: string;         // picture until you add real images
  question: string;
  options: string[];
  answer: string;
  hint: string;
  sound: AudioSource | null;
};

/* Ordered from easier to harder.
   ⚠️ Please have a Sinhala teacher check these before release. */
export const QUESTIONS: Question[] = [
  {
    type: "find",
    display: "මුඛය",
    emoji: "👄",
    question: "මෙම වචනයේ ඇති මහාප්‍රාණ අකුර කුමක්ද?",
    options: ["ක", "ඛ", "ග", "බ"],
    answer: "ඛ",
    hint: "මහාප්‍රාණ අකුර වචනයේ මැද ඇත.",
    sound: null,
  },
  {
    type: "find",
    display: "කථාව",
    emoji: "📖",
    question: "මෙම වචනයේ ඇති මහාප්‍රාණ අකුර කුමක්ද?",
    options: ["ත", "ථ", "ට", "ධ"],
    answer: "ථ",
    hint: "පළමු අකුර අල්පප්‍රාණ අකුරකි.",
    sound: null,
  },
  {
    type: "missing",
    display: "___ජය",
    emoji: "🚩",
    question: "හිස් තැනට ගැළපෙන අකුර කුමක්ද?",
    options: ["ද", "ධ", "ඩ", "බ"],
    answer: "ධ",
    hint: "මෙය කොඩියකට කියන නමකි.",
    sound: null,
  },
  {
    type: "find",
    display: "සභාව",
    emoji: "👥",
    question: "මෙම වචනයේ ඇති මහාප්‍රාණ අකුර කුමක්ද?",
    options: ["බ", "භ", "හ", "ඵ"],
    answer: "භ",
    hint: "'බ' ට සමාන නමුත් වැඩි හුස්මකින් කියන අකුර.",
    sound: null,
  },
  {
    type: "pair",
    display: "ඡ",
    question: "මෙම අකුරේ අල්පප්‍රාණ යුගලය කුමක්ද?",
    options: ["ච", "ජ", "ඣ", "ට"],
    answer: "ච",
    hint: "අල්පප්‍රාණ අකුර කියන විට හුස්ම අඩුවෙන් පිටවේ.",
    sound: null,
  },
  {
    type: "odd",
    display: "ඝ  ථ  ද  ඵ",
    question: "මේවායින් මහාප්‍රාණ නොවන අකුර කුමක්ද?",
    options: ["ඝ", "ථ", "ද", "ඵ"],
    answer: "ද",
    hint: "එක් අකුරක් පමණක් අල්පප්‍රාණ අකුරකි.",
    sound: null,
  },
  {
    type: "missing",
    display: "ලා___ය",
    emoji: "💰",
    question: "හිස් තැනට ගැළපෙන අකුර කුමක්ද?",
    options: ["බ", "භ", "ඹ", "හ"],
    answer: "භ",
    hint: "වෙළඳාමෙන් ලැබෙන මුදලට කියන වචනය.",
    sound: null,
  },
  {
    type: "spell",
    display: "☂️",
    question: "නිවැරදිව ලියා ඇති වචනය කුමක්ද?",
    options: ["ඡත්‍රය", "චත්‍රය", "ජත්‍රය", "ඣත්‍රය"],
    answer: "ඡත්‍රය",
    hint: "පළමු අකුර මහාප්‍රාණ අකුරකි.",
    sound: null,
  },
  {
    type: "find",
    display: "ලේඛනය",
    emoji: "✍️",
    question: "මෙම වචනයේ ඇති මහාප්‍රාණ අකුර කුමක්ද?",
    options: ["ක", "ඛ", "ග", "ඝ"],
    answer: "ඛ",
    hint: "'ක' අකුරේ මහාප්‍රාණ යුගලය සොයන්න.",
    sound: null,
  },
  {
    type: "count",
    display: "ධනලාභය",
    emoji: "🪙",
    question: "මෙම වචනයේ මහාප්‍රාණ අකුරු කීයක් තිබේද?",
    options: ["0", "1", "2", "3"],
    answer: "2",
    hint: "අකුරෙන් අකුර හොඳින් බලන්න.",
    sound: null,
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* New quiz with shuffled answer choices (count questions keep 0-3 order) */
export function makeQuiz(): Question[] {
  return QUESTIONS.map((q) => ({
    ...q,
    options: q.type === "count" ? q.options : shuffle(q.options),
  }));
}