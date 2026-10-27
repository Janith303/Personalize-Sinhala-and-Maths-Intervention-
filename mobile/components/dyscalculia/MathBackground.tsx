// Maths-themed background used behind every question.
// To change the picture, replace mobile/assets/images/dyscalculia/question-bg.png (keep the same file name).
import type { ReactNode } from 'react';
import { ImageBackground } from 'react-native';
import { colors } from '../../constants/dyscalculia/theme';

const BACKGROUND = require('../../assets/images/dyscalculia/question-bg.png');

export function MathBackground({ children }: { children: ReactNode }) {
  return (
    <ImageBackground source={BACKGROUND} resizeMode="cover" style={{ flex: 1, backgroundColor: colors.page }}>
      {children}
    </ImageBackground>
  );
}
