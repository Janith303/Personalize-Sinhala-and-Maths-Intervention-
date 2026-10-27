// Colours and fonts for the dyscalculia module (blue and white theme with bright accents for games).

export const colors = {
  primary: '#185FA5',
  primaryLight: '#378ADD',
  primarySoft: '#85B7EB',
  sky: '#E6F1FB',
  page: '#F4F9FF',
  border: '#B5D4F4',
  navy: '#0C447C',
  ink: '#042C53',
  white: '#FFFFFF',
  green: '#1D9E75',
  greenSoft: '#E1F5EE',
  red: '#E24B4A',
  redSoft: '#FCEBEB',
  amber: '#EF9F27',
  amberSoft: '#FAEEDA',
  purple: '#7F77DD',
  purpleSoft: '#EEEDFE',
  pink: '#D4537E',
  coral: '#D85A30',
  coralSoft: '#FAECE7',
  muted: '#5F7A99',
};

/** Bright colours for multiple-choice answer buttons (cycled). */
export const optionColors = [colors.amber, colors.purple, colors.pink, colors.green];

/** One colour per skill area (Stage 2 profile and intervention). */
export const areaColors = {
  quantity: { main: colors.primaryLight, soft: colors.sky },
  sequence: { main: colors.purple, soft: colors.purpleSoft },
  operations: { main: colors.coral, soft: colors.coralSoft },
} as const;

/** Font family names registered in app/dyscalculia/_layout.tsx. */
export const fonts = {
  regular: 'NotoSansSinhala_400Regular',
  medium: 'NotoSansSinhala_500Medium',
  bold: 'NotoSansSinhala_700Bold',
};
