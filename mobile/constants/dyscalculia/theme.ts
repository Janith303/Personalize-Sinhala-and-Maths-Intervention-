// Colours of the dyscalculia module, taken from the design mockups (blue header, cream cards,
// bright game buttons). Fonts come from the shared team theme (constants/common/theme.ts).

export const colors = {
  header: '#1B5EA8', // same as the team's blue theme header
  headerDark: '#124A87',
  navy: '#123A6B',
  blue: '#2E79D3',
  blueDark: '#1D5BA8',
  sky: '#EAF4FD',
  skyBorder: '#9CCFF4',
  skyDash: '#B9DCF7',
  cream: '#FFFBF0',
  creamPill: '#FFF3C4',
  creamBorder: '#F3D27A',
  highlight: '#FFE89A',
  highlightBlue: '#CFE6FA',
  white: '#FFFFFF',
  green: '#22A045',
  greenDark: '#17803A',
  greenSoft: '#E1F5EE',
  greenBorder: '#9EDCB5',
  red: '#E5383B',
  redDark: '#B82528',
  redSoft: '#FCEBEB',
  amber: '#F5A524',
  amberDark: '#C47F0B',
  amberSoft: '#FAEEDA',
  purple: '#8B5CF6',
  purpleDark: '#6D28D9',
  purpleSoft: '#EEEDFE',
  pink: '#E0457B',
  pinkDark: '#B02A5B',
  orange: '#F26B1D',
  orangeDark: '#C44F0E',
  orangeSoft: '#FDEBDD',
  backArrow: '#2E9E43',
  muted: '#5F7A99',
  lockCard: '#FFF6E0',
  lockBorder: '#F2C24E',
  lockText: '#5A3A10',
};

/** Bright colours for multiple-choice answer buttons (cycled): [face, darker bottom edge]. */
export const optionColors: [string, string][] = [
  [colors.amber, colors.amberDark],
  [colors.purple, colors.purpleDark],
  [colors.pink, colors.pinkDark],
  [colors.green, colors.greenDark],
];

/** One colour set per skill area (Stage 2 profile and practice map). */
export const areaColors = {
  quantity: { main: colors.blue, dark: colors.blueDark, soft: '#E3F0FC' },
  sequence: { main: colors.purple, dark: colors.purpleDark, soft: colors.purpleSoft },
  operations: { main: colors.orange, dark: colors.orangeDark, soft: colors.orangeSoft },
} as const;
