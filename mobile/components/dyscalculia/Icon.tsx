// Picture icons of the dyscalculia module (PNG files in assets/images/dyscalculia/icons).
// To change an icon, replace its PNG file (keep the same name).
import { Image, type ImageStyle, type StyleProp } from 'react-native';

import type { SkillArea } from '@/types/dyscalculia';

const ICONS = {
  star: require('../../assets/images/dyscalculia/icons/star.png'),
  star_empty: require('../../assets/images/dyscalculia/icons/star_empty.png'),
  gamepad: require('../../assets/images/dyscalculia/icons/gamepad.png'),
  lock: require('../../assets/images/dyscalculia/icons/lock.png'),
  blocks: require('../../assets/images/dyscalculia/icons/blocks.png'),
  rocket: require('../../assets/images/dyscalculia/icons/rocket.png'),
  board: require('../../assets/images/dyscalculia/icons/board.png'),
  train: require('../../assets/images/dyscalculia/icons/train.png'),
  dots: require('../../assets/images/dyscalculia/icons/dots.png'),
  operations: require('../../assets/images/dyscalculia/icons/operations.png'),
};

export type IconName = keyof typeof ICONS;

/** Picture for each skill area (Stage 2 and practice). */
export const AREA_ICON: Record<SkillArea, IconName> = { quantity: 'dots', sequence: 'train', operations: 'operations' };

/** `size` is in screen pixels (callers scale design sizes with useU().s). */
export function Icon({ name, size = 32, style }: { name: IconName; size?: number; style?: StyleProp<ImageStyle> }) {
  return <Image source={ICONS[name]} style={[{ width: size, height: size }, style]} resizeMode="contain" accessible={false} />;
}
