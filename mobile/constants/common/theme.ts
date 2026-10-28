export type Theme = {
  header: string; // top bar
  panel: string; // light body background
  ink: string; // headings
  inkDark: string; // big glyph / strong text
  mute: string; // secondary text
  btn: string; // primary button
  btnSoft: string; // disabled / soft button background
  btnSoftText: string;
  border: string;
  backBtn: string;
  gear: string;
  gearRing: string;
};

export const greenTheme: Theme = {
  header: "#176B45",
  panel: "#F3F9F5",
  ink: "#0F6B3E",
  inkDark: "#0B4A2A",
  mute: "#3E7556",
  btn: "#1A8553",
  btnSoft: "#D5EBDF",
  btnSoftText: "#5E8F73",
  border: "#C5E2D0",
  backBtn: "#2F9B63",
  gear: "#0D4F2D",
  gearRing: "#2F9B63",
};

export const blueTheme: Theme = {
  header: "#1B5EA8",
  panel: "#F4F7FC",
  ink: "#1B5EA8",
  inkDark: "#124A87",
  mute: "#4D6F96",
  btn: "#2E79D3",
  btnSoft: "#D3E3F6",
  btnSoftText: "#6D8FB8",
  border: "#B9D2EE",
  backBtn: "#3B8CE0",
  gear: "#0F4F9A",
  gearRing: "#3B8CE0",
};

export const accent = {
  cream: "#FFEFC8",
  creamBorder: "#EBCB78",
  creamText: "#6B4A00",
  purple: "#6C3FC9",
  purpleBorder: "#D8CBF2",
  brown: "#6B5521",
  brownBorder: "#F0D88A",
  orange: "#F5A524",
  warn: "#FFD97A",
  wrongBg: "#FDECEA",
  wrongText: "#B3261E",
};

export const fonts = {
  regular: "NotoSansSinhala_400Regular",
  semi: "NotoSansSinhala_600SemiBold",
  bold: "NotoSansSinhala_700Bold",
  black: "NotoSansSinhala_800ExtraBold",
} as const;

export type Weight = keyof typeof fonts;
