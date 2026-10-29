// ---- Letters (the 5 letters the model knows; ids are the backend class prefixes) ----
export type LetterId = "ga" | "ra" | "ta" | "u" | "la";

export const LETTERS: { id: LetterId; glyph: string }[] = [
  { id: "ga", glyph: "ග" },
  { id: "ra", glyph: "ර" },
  { id: "ta", glyph: "ට" },
  { id: "u", glyph: "උ" },
  { id: "la", glyph: "ල" },
];

// ---- Quiz question types ----
export type McqQuestion = {
  kind: "mcq";
  prompt: string;
  options: string[];
  answer: number;
  /** "lg" = big single word tiles (pillam), "md" = sentence tiles */
  size?: "md" | "lg";
};

/** Sentence with a blank, answered from a row of options */
export type FillQuestion = {
  kind: "fill";
  prompt: string;
  before: string;
  after: string;
  options: string[];
  answer: number;
};

/** Match each symbol to its name (tap a name, then tap a slot) */
export type MatchQuestion = {
  kind: "match";
  prompt: string;
  symbols: string[];
  /** names in the same order as `symbols` (correct pairing) */
  names: string[];
  /** order in which the name chips are shown */
  chipOrder: number[];
};

/** Pillam: a word shown in a card, answered from a row of short options */
export type WordQuestion = {
  kind: "word";
  prompt: string;
  /** text before / after the blank (blank only if `blank`) */
  before: string;
  after: string;
  blank?: boolean;
  image?: "bird";
  options: string[];
  answer: number;
  /** option layout: row of big tiles (default) or 2x2 labelled tiles */
  layout?: "row" | "grid";
};

export type Question = McqQuestion | FillQuestion | MatchQuestion | WordQuestion;

// ---- විරාම ලක්ෂණ (answer keys inferred from the designs) ----
export const PUNCTUATION_QUESTIONS: Question[] = [
  {
    kind: "mcq",
    prompt: "නිවැරදි විරාම ලක්ෂණ සහිත වාක්‍ය තෝරන්න",
    options: ["අම්මා කෑම පිසින්නීය.", "අම්මා, කෑම පිසින්නීය", "අම්මා කෑම පිසින්නීය?", "\"අම්මා කෑම පිසින්නීය\""],
    answer: 0,
  },
  {
    kind: "mcq",
    prompt: "ප්‍රශ්නාර්ථ ලකුණ නිවැරදිව යොදා ඇති වාක්‍යය තෝරන්න",
    options: ["ඔබ පාසලට යන්නේ කීයටද.", "ඔබ පාසලට යන්නේ කීයටද?", "ඔබ පාසලට යන්නේ කීයටද,", "\"ඔබ පාසලට යන්නේ කීයටද\""],
    answer: 1,
  },
  {
    kind: "mcq",
    prompt: "නිවැරදි විරාම ලකුණු සහිත වාක්‍යය තෝරන්න",
    options: [
      "මම අඹ, දොඩම් කෙසෙල්, ගෙනාවෙමි.",
      "මම, අඹ දොඩම් කෙසෙල් ගෙනාවෙමි.",
      "මම අඹ, දොඩම්, කෙසෙල් ගෙනාවෙමි.",
      "මම අඹ දොඩම් කෙසෙල් ගෙනාවෙමි?",
    ],
    answer: 2,
  },
  {
    kind: "fill",
    prompt: "හිස්තැනට නිවැරදි විරාම ලකුණ තෝරන්න",
    before: "යමකු කළ ප්‍රකාශයක් පෙන්වීමට",
    after: "යෙදේ.",
    options: ["තිත", "කොමාව", "ප්‍රශ්නාර්ථ ලකුණ", "යුගල උඩු කොමා"],
    answer: 3,
  },
  {
    kind: "match",
    prompt: "විරාම ලක්ෂණ නම් කරන්න",
    symbols: [",", ".", "?", "“”"],
    names: ["කොමාව", "නැවතීමේ තිත", "ප්‍රශ්නාර්ථ ලකුණ", "යුගල උඩු කොමා"],
    chipOrder: [1, 2, 0, 3],
  },
];

// ---- පිල්ලම් භාවිතය ----
export const PILLAM_QUESTIONS: Question[] = [
  {
    kind: "word",
    prompt: "නිවැරදි පිල්ලම සහිත අකුරු යොදන්න.",
    before: "",
    after: "රුල්ලා",
    blank: true,
    image: "bird",
    options: ["කු", "කි", "කෙ", "කූ"],
    answer: 0,
  },
  {
    kind: "word",
    prompt: "මෙම වචනයේ ඇලපිල්ල කීයක් තිබේද?",
    before: "තාත්තා",
    after: "",
    options: ["1", "2", "3", "4"],
    answer: 1,
  },
  {
    kind: "mcq",
    prompt: "කොම්බුව + ඇලපිල්ල නැති වචනය තෝරන්න.",
    options: ["කොළ", "ගෙය", "ගොවියා", "රොටි"],
    answer: 1,
    size: "lg",
  },
  {
    kind: "mcq",
    prompt: "ගැටපිල්ල යෙදුන වචනයකි.",
    options: ["හෘදය", "ගීතය", "පිදුරු", "ලේනා"],
    answer: 0,
    size: "lg",
  },
  {
    kind: "word",
    prompt: "මෙම වචනයෙහි ඇති පිල්ලම් මොනවාද?",
    before: "පිදුරු",
    after: "",
    layout: "grid",
    options: [
      "කෙටි ඉස්පිල්ල, ඇලපිල්ල",
      "දික් ඉස්පිල්ල, කෙටි පාපිල්ල",
      "කෙටි ඉස්පිල්ල, කෙටි පාපිල්ල",
      "කෙටි පාපිල්ල, හල්කිරීම",
    ],
    answer: 2,
  },
];

export const BADGES = ["1", "2", "3", "4"];

/** Label shown on result cards */
export function scoreLabel(score: number): { text: string; good: boolean } {
  if (score >= 5) return { text: "ඉතා හොඳයි!", good: true };
  if (score === 4) return { text: "හොඳයි", good: true };
  return { text: "උනන්දු විය යුතුයි!", good: false };
}
