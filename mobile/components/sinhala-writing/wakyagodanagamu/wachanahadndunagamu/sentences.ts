import { AudioSource } from "expo-audio";

export type WordKind = "name" | "action";

export type Sentence = {
  words: string[];     // words in order (no full stop)
  kinds: WordKind[];   // "name" = කවුද?/මොකක්ද?  "action" = මොකද කරන්නේ?
  emoji: string;       // picture until real images are added
  sound: AudioSource | null;
};

/* Add a sound like:
   sound: require("../../../../assets/sounds/sentences/s1.mp3"),
   ⚠️ Please have a Sinhala teacher check these sentences. */
export const SENTENCES: Sentence[] = [
  { words: ["අම්මා", "බත්", "උයයි"], kinds: ["name", "name", "action"], emoji: "🍚", sound: null },
  { words: ["බල්ලා", "දුවයි"], kinds: ["name", "action"], emoji: "🐕", sound: null },
  { words: ["ළමයා", "පොත", "කියවයි"], kinds: ["name", "name", "action"], emoji: "📖", sound: null },
  {
    words: ["ආච්චි", "මුනුබුරාට", "කතාවක්", "කියයි"],
    kinds: ["name", "name", "name", "action"],
    emoji: "👵",
    sound: null,
  },
  { words: ["කුරුල්ලා", "ගී", "ගයයි"], kinds: ["name", "name", "action"], emoji: "🐦", sound: null },
  { words: ["මම", "පාසලට", "යමි"], kinds: ["name", "name", "action"], emoji: "🏫", sound: null },
];

export const COUNT_OPTIONS = [2, 3, 4, 5];

/* background / text colours used to colour each word */
export const WORD_COLORS = [
  { bg: "#FFE9A8", border: "#F5C842", text: "#B45309" },
  { bg: "#FBE4F1", border: "#F3C1DD", text: "#BE185D" },
  { bg: "#DFF5E6", border: "#B5E3C3", text: "#1F8A3B" },
  { bg: "#E2F0FD", border: "#BCD9F7", text: "#1D4ED8" },
  { bg: "#EDE4FB", border: "#D4C2F5", text: "#7C3AED" },
];

/* Splits a Sinhala word into letters: a consonant keeps its vowel signs,
   hal kirima and joined letters (්‍ර / ්‍ය). */
const MARK = /[\u0D82\u0D83\u0DCA-\u0DDF\u0DF2\u0DF3\u200D]/;

export function splitLetters(word: string): string[] {
  const out: string[] = [];
  for (const ch of word) {
    const last = out[out.length - 1];
    if (last !== undefined && (MARK.test(ch) || last.endsWith("\u200D"))) {
      out[out.length - 1] = last + ch;
    } else {
      out.push(ch);
    }
  }
  return out;
}