// Picture icons of the dyscalculia module (PNG files in assets/images/dyscalculia/icons).
// To change an icon, replace its PNG file (keep the same name).
import { Image, type ImageStyle, type StyleProp } from 'react-native';

const ICONS = {
  owl: require('../../assets/images/dyscalculia/icons/owl.png'),
  owl_party: require('../../assets/images/dyscalculia/icons/owl_party.png'),
  trophy: require('../../assets/images/dyscalculia/icons/trophy.png'),
  star: require('../../assets/images/dyscalculia/icons/star.png'),
  star_empty: require('../../assets/images/dyscalculia/icons/star_empty.png'),
  gamepad: require('../../assets/images/dyscalculia/icons/gamepad.png'),
  lock: require('../../assets/images/dyscalculia/icons/lock.png'),
  unlock: require('../../assets/images/dyscalculia/icons/unlock.png'),
  blocks: require('../../assets/images/dyscalculia/icons/blocks.png'),
  rocket: require('../../assets/images/dyscalculia/icons/rocket.png'),
  board: require('../../assets/images/dyscalculia/icons/board.png'),
  train: require('../../assets/images/dyscalculia/icons/train.png'),
  dots: require('../../assets/images/dyscalculia/icons/dots.png'),
  operations: require('../../assets/images/dyscalculia/icons/operations.png'),
  home: require('../../assets/images/dyscalculia/icons/home.png'),
  play: require('../../assets/images/dyscalculia/icons/play.png'),
  replay: require('../../assets/images/dyscalculia/icons/replay.png'),
  arrow_up: require('../../assets/images/dyscalculia/icons/arrow_up.png'),
  arrow_down: require('../../assets/images/dyscalculia/icons/arrow_down.png'),
  map: require('../../assets/images/dyscalculia/icons/map.png'),
  info: require('../../assets/images/dyscalculia/icons/info.png'),
};

export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 32, style }: { name: IconName; size?: number; style?: StyleProp<ImageStyle> }) {
  return <Image source={ICONS[name]} style={[{ width: size, height: size }, style]} resizeMode="contain" accessible={false} />;
}

/** A row of `filled` stars out of `total` (empty stars shown as outlines). */
export function StarRow({ filled, total = filled, size = 28 }: { filled: number; total?: number; size?: number }) {
  return (
    <>
      {Array.from({ length: total }, (_, i) => (
        <Icon key={i} name={i < filled ? 'star' : 'star_empty'} size={size} style={{ marginHorizontal: 2 }} />
      ))}
    </>
  );
}
