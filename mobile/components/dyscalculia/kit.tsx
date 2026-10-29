// Building blocks of the dyscalculia screens, matching the design mockups and the team's shared
// layout (sizes are design pixels on the shared 1280 x 590 canvas, scaled with useU()).
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { Image, ImageBackground, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Txt, useU } from '@/components/common/layout';
import { colors } from '@/constants/dyscalculia/theme';
import { Icon } from './Icon';

type IonName = ComponentProps<typeof Ionicons>['name'];

// ---------------------------------------------------------------- images
const SCENES = {
  garden: require('../../assets/images/dyscalculia/scenes/garden.jpg'),
  owl: require('../../assets/images/dyscalculia/scenes/owl.jpg'),
  boyQuestion: require('../../assets/images/dyscalculia/scenes/boy_question.jpg'),
  boyCheer: require('../../assets/images/dyscalculia/scenes/boy_cheer.jpg'),
  boyWave: require('../../assets/images/dyscalculia/scenes/boy_wave.jpg'),
  owlParty: require('../../assets/images/dyscalculia/scenes/owl_party.jpg'),
};
export type SceneName = keyof typeof SCENES;

export const CHARACTERS = {
  boyNumbers: require('../../assets/images/dyscalculia/characters/boy_numbers.png'),
  girlBlocks: require('../../assets/images/dyscalculia/characters/girl_blocks.png'),
  boyBoard: require('../../assets/images/dyscalculia/characters/boy_board.png'),
  avatarOwl: require('../../assets/images/dyscalculia/characters/avatar_owl.png'),
  avatarBoyWave: require('../../assets/images/dyscalculia/characters/avatar_boy_wave.png'),
};

// ---------------------------------------------------------------- screen frame
/**
 * Full-screen scene with the floating blue header.
 * layout="side": the scene has a character on the left, so content sits in the right part.
 * layout="full": content uses the whole width (home, practice map, teacher report).
 */
export function Screen({
  scene,
  title,
  right,
  onBack,
  gear,
  layout = 'side',
  children,
}: {
  scene: SceneName;
  title: string;
  right?: ReactNode;
  onBack?: () => void;
  gear?: boolean;
  layout?: 'side' | 'full';
  children: ReactNode;
}) {
  const { s } = useU();
  const insets = useSafeAreaInsets();
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));
  return (
    <ImageBackground
      source={SCENES[scene]}
      resizeMode="cover"
      style={{ flex: 1, backgroundColor: colors.sky }}
      imageStyle={{ width: '100%', height: '100%' }}
    >
      <View style={{ flex: 1, paddingLeft: insets.left, paddingRight: insets.right }}>
        {/* header */}
        <View
          style={{
            marginTop: s(12),
            marginHorizontal: s(24),
            height: s(70),
            borderRadius: s(35),
            backgroundColor: colors.header,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: s(8),
            paddingRight: s(10),
            borderBottomWidth: s(4),
            borderBottomColor: colors.headerDark,
          }}
        >
          <Pressable
            onPress={back}
            accessibilityRole="button"
            accessibilityLabel="ආපසු"
            hitSlop={8}
            style={{
              width: s(58),
              height: s(58),
              borderRadius: s(29),
              backgroundColor: colors.white,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: s(3),
              borderColor: '#D3E3F6',
            }}
          >
            <Ionicons name="arrow-back" size={s(34)} color={colors.backArrow} />
          </Pressable>
          <View style={{ flex: 1, marginLeft: s(18) }}>
            <Txt size={28} weight="black" color={colors.white} numberOfLines={1}>
              {title}
            </Txt>
          </View>
          {right ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: s(10) }}>{right}</View> : null}
        </View>

        {/* settings gear: decoration only for now */}
        {gear ? (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={{
              position: 'absolute',
              right: s(30) + insets.right,
              top: s(94),
              width: s(64),
              height: s(64),
              borderRadius: s(32),
              backgroundColor: colors.blue,
              borderWidth: s(4),
              borderColor: colors.white,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}
          >
            <Ionicons name="settings" size={s(34)} color={colors.white} />
          </View>
        ) : null}

        <View
          style={
            layout === 'side'
              ? { flex: 1, marginLeft: '31%', marginRight: s(gear ? 100 : 40), justifyContent: 'center', paddingVertical: s(14) }
              : { flex: 1, paddingHorizontal: s(30), paddingTop: s(14), paddingBottom: s(18) }
          }
        >
          {children}
        </View>
      </View>
    </ImageBackground>
  );
}

// ---------------------------------------------------------------- cards
/** Cream card with a thick light border and a dashed inner line. */
export function PaperCard({
  children,
  border = colors.skyBorder,
  dash = colors.skyDash,
  style,
}: {
  children: ReactNode;
  border?: string;
  dash?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { s } = useU();
  return (
    <View
      style={[
        { backgroundColor: colors.cream, borderRadius: s(30), borderWidth: s(5), borderColor: border, padding: s(26) },
        style,
      ]}
    >
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: s(8),
          right: s(8),
          top: s(8),
          bottom: s(8),
          borderRadius: s(22),
          borderWidth: s(2),
          borderStyle: 'dashed',
          borderColor: dash,
        }}
      />
      {children}
    </View>
  );
}

/** Little yellow "shine" strokes beside highlighted titles. */
function Sparkle({ side }: { side: 'left' | 'right' }) {
  const { s } = useU();
  const sign = side === 'left' ? -1 : 1;
  return (
    <View style={{ width: s(34), height: s(40) }}>
      {[0, 1].map((i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: s(i === 0 ? 8 : 18),
            top: s(i === 0 ? 2 : 14),
            width: s(7),
            height: s(i === 0 ? 24 : 18),
            borderRadius: s(4),
            backgroundColor: '#F6C343',
            transform: [{ rotate: `${sign * (i === 0 ? 25 : 55)}deg` }],
          }}
        />
      ))}
    </View>
  );
}

/** Title on a soft highlighter stripe (yellow by default, light blue for question prompts). */
export function Highlight({
  children,
  tone = 'yellow',
  size = 32,
  sparkles = true,
}: {
  children: string;
  tone?: 'yellow' | 'blue';
  size?: number;
  sparkles?: boolean;
}) {
  const { s } = useU();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
      {sparkles ? <Sparkle side="left" /> : null}
      <View
        style={{
          backgroundColor: tone === 'yellow' ? colors.highlight : colors.highlightBlue,
          borderRadius: s(26),
          paddingHorizontal: s(34),
          paddingVertical: s(2),
          marginHorizontal: s(6),
        }}
      >
        <Txt size={size} weight="black" color={colors.navy} align="center">
          {children}
        </Txt>
      </View>
      {sparkles ? <Sparkle side="right" /> : null}
    </View>
  );
}

// ---------------------------------------------------------------- buttons
/** Big rounded button with a darker bottom edge (3D look). */
export function Btn3D({
  label,
  onPress,
  color = colors.green,
  dark = colors.greenDark,
  icon,
  height = 76,
  size = 28,
  numeric,
  disabled,
  style,
}: {
  label: string;
  onPress: () => void;
  color?: string;
  dark?: string;
  icon?: IonName;
  height?: number;
  size?: number;
  /** Numbers and maths symbols: bigger, in the number font. */
  numeric?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { s } = useU();
  // Pressed state is tracked in React state: NativeWind drops Pressable styles written as
  // functions on Android, which made the button colours disappear.
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        {
          height: s(height),
          borderRadius: s(22),
          backgroundColor: color,
          borderBottomWidth: s(pressed ? 2 : 7),
          borderBottomColor: dark,
          marginTop: s(pressed ? 5 : 0),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: s(14),
          paddingHorizontal: s(26),
          opacity: disabled ? 0.35 : 1,
        },
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={s(size + 10)} color={colors.white} /> : null}
      {numeric ? (
        <Text style={{ fontSize: s(size + 14), lineHeight: s(size + 22), fontWeight: '900', color: colors.white }}>{label}</Text>
      ) : (
        <Txt size={size} weight="black" color={colors.white} numberOfLines={1}>
          {label}
        </Txt>
      )}
    </Pressable>
  );
}

// ---------------------------------------------------------------- header pills
export function StarPill({ label }: { label: string }) {
  const { s } = useU();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(8),
        backgroundColor: colors.creamPill,
        borderRadius: s(26),
        borderWidth: s(2),
        borderColor: colors.creamBorder,
        paddingHorizontal: s(18),
        height: s(50),
      }}
    >
      <Icon name="star" size={s(30)} />
      <Txt size={22} weight="bold" color={colors.navy}>
        {label}
      </Txt>
    </View>
  );
}

/** Progress through the games: finished and current dots are green, the rest pale. */
export function DotsPill({ total, current }: { total: number; current: number }) {
  const { s } = useU();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(7),
        backgroundColor: colors.white,
        borderRadius: s(26),
        paddingHorizontal: s(16),
        height: s(50),
      }}
    >
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={{
            width: s(i === current ? 22 : 18),
            height: s(i === current ? 22 : 18),
            borderRadius: s(12),
            backgroundColor: i <= current ? colors.green : '#D5E3F0',
          }}
        />
      ))}
    </View>
  );
}

/** Pill button in the header (e.g. teacher / parent results). */
export function HeaderPill({ label, onPress }: { label: string; onPress: () => void }) {
  const { s } = useU();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(8),
        backgroundColor: colors.blue,
        borderRadius: s(26),
        paddingHorizontal: s(16),
        height: s(50),
      }}
    >
      <Icon name="board" size={s(32)} />
      <Txt size={19} weight="bold" color={colors.white}>
        {label}
      </Txt>
    </Pressable>
  );
}

/** Round light-bulb button (practice hints). */
export function HintButton({ onPress, used }: { onPress: () => void; used?: boolean }) {
  const { s } = useU();
  return (
    <Pressable
      onPress={onPress}
      disabled={used}
      accessibilityRole="button"
      accessibilityLabel="ඉඟියක්"
      style={{
        position: 'absolute',
        right: s(-34),
        top: s(-34),
        width: s(76),
        height: s(76),
        borderRadius: s(38),
        backgroundColor: colors.white,
        borderWidth: s(4),
        borderColor: colors.skyBorder,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: used ? 0.45 : 1,
        zIndex: 3,
      }}
    >
      <Ionicons name="bulb" size={s(42)} color={colors.amber} />
    </Pressable>
  );
}

/** Dashed info box with a round icon (e.g. "?" + "ready?"). */
export function InfoBox({ icon, children, style }: { icon?: IonName; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { s } = useU();
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: s(14),
          backgroundColor: colors.sky,
          borderRadius: s(22),
          borderWidth: s(2),
          borderStyle: 'dashed',
          borderColor: '#A9CFF2',
          paddingHorizontal: s(20),
          paddingVertical: s(12),
        },
        style,
      ]}
    >
      {icon ? (
        <View
          style={{ width: s(54), height: s(54), borderRadius: s(27), backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name={icon} size={s(34)} color={colors.white} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

/** Row of star pictures (filled out of total). */
export function Stars({ filled, total = filled, size = 64 }: { filled: number; total?: number; size?: number }) {
  const { s } = useU();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: s(8) }}>
      {Array.from({ length: total }, (_, i) => (
        <Icon key={i} name={i < filled ? 'star' : 'star_empty'} size={s(size)} />
      ))}
    </View>
  );
}

export function Avatar({ source, size }: { source: number; size: number }) {
  const { s } = useU();
  return <Image source={source} style={{ width: s(size), height: s(size) }} resizeMode="contain" accessible={false} />;
}
