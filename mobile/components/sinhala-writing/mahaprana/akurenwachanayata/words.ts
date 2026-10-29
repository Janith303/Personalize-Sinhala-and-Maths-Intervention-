import { AudioSource } from "expo-audio";

export type WordItem = {
  word: string;
  syllables: string;
  emoji: string; // picture until you add real images
  sound: AudioSource | null;
};

export type LetterWords = {
  letter: string;
  sound: AudioSource | null;
  words: WordItem[];
};

/* Add sounds like:
   sound: require("../../../../assets/sounds/mahaprana/kha.mp3"),
   ⚠️ Please have a Sinhala teacher check these words before release. */
export const LETTER_WORDS: LetterWords[] = [
  {
    letter: "ඛ",
    sound: null,
    words: [
      { word: "ඛනිජ", syllables: "ඛ-නි-ජ", emoji: "🪨", sound: null },
      { word: "ඛඩ්ගය", syllables: "ඛඩ්-ග-ය", emoji: "🗡️", sound: null },
      { word: "ඛණ්ඩය", syllables: "ඛණ්-ඩ-ය", emoji: "🧩", sound: null },
    ],
  },
  {
    letter: "ඝ",
    sound: null,
    words: [
      { word: "ඝණ්ටාරය", syllables: "ඝණ්-ටා-ර-ය", emoji: "🔔", sound: null },
      { word: "ඝෝෂාව", syllables: "ඝෝ-ෂා-ව", emoji: "📢", sound: null },
      { word: "ඝනකය", syllables: "ඝ-න-ක-ය", emoji: "🧊", sound: null },
    ],
  },
  {
    letter: "ඡ",
    sound: null,
    words: [
      { word: "ඡත්‍රය", syllables: "ඡ-ත්‍ර-ය", emoji: "☂️", sound: null },
      { word: "ඡායාරූපය", syllables: "ඡා-යා-රූ-ප-ය", emoji: "📷", sound: null },
      { word: "ඡන්දය", syllables: "ඡන්-ද-ය", emoji: "🗳️", sound: null },
    ],
  },
  {
    letter: "ඣ",
    sound: null,
    words: [
      { word: "ඣානය", syllables: "ඣා-න-ය", emoji: "🧘", sound: null },
    ],
  },
  {
    letter: "ඨ",
    sound: null,
    words: [], // add words here
  },
  {
    letter: "ඪ",
    sound: null,
    words: [], // add words here
  },
  {
    letter: "ථ",
    sound: null,
    words: [
      { word: "ථූපය", syllables: "ථූ-ප-ය", emoji: "🛕", sound: null },
    ],
  },
  {
    letter: "ධ",
    sound: null,
    words: [
      { word: "ධජය", syllables: "ධ-ජ-ය", emoji: "🚩", sound: null },
      { word: "ධනය", syllables: "ධ-න-ය", emoji: "💰", sound: null },
      { word: "ධීවරයා", syllables: "ධී-ව-ර-යා", emoji: "🎣", sound: null },
    ],
  },
  {
    letter: "ඵ",
    sound: null,
    words: [
      { word: "ඵලය", syllables: "ඵ-ල-ය", emoji: "🍎", sound: null },
      { word: "ඵලදාව", syllables: "ඵ-ල-දා-ව", emoji: "🌾", sound: null },
    ],
  },
  {
    letter: "භ",
    sound: null,
    words: [
      { word: "භාජනය", syllables: "භා-ජ-න-ය", emoji: "🏺", sound: null },
      { word: "භූමිය", syllables: "භූ-මි-ය", emoji: "🌍", sound: null },
      { word: "භාෂාව", syllables: "භා-ෂා-ව", emoji: "🗣️", sound: null },
    ],
  },
];