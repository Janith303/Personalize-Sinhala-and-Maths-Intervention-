// Small building blocks shared by all dyscalculia screens.
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, Text, View, type StyleProp, type TextProps, type TextStyle, type ViewStyle } from 'react-native';
import { colors, fonts } from '../../constants/dyscalculia/theme';

type Weight = keyof typeof fonts;

/** Text in the Sinhala font. */
export function SiText({ weight = 'regular', style, ...rest }: TextProps & { weight?: Weight }) {
  return <Text {...rest} style={[{ fontFamily: fonts[weight], color: colors.ink }, style]} />;
}

/** Large numbers and maths symbols (system font, bold). */
export function NumText({ style, ...rest }: TextProps) {
  return <Text {...rest} style={[{ fontWeight: '800', color: colors.navy }, style]} />;
}

export function BigButton({
  label,
  onPress,
  color = colors.primaryLight,
  icon,
  size = 'md',
  disabled,
  style,
  textStyle,
  numeric,
}: {
  label: string;
  onPress: () => void;
  color?: string;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  /** Numbers and maths symbols: larger, in the number font. */
  numeric?: boolean;
}) {
  const pad = size === 'lg' ? 'px-9 py-4' : size === 'sm' ? 'px-4 py-2' : 'px-6 py-3';
  const font = size === 'lg' ? 24 : size === 'sm' ? 15 : 19;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={`flex-row items-center justify-center rounded-2xl active:opacity-80 ${pad}`}
      style={[{ backgroundColor: color, opacity: disabled ? 0.45 : 1 }, style]}
    >
      {icon ? <Text style={{ fontSize: font + 2, marginRight: 8, color: colors.white }}>{icon}</Text> : null}
      {numeric ? (
        <NumText style={[{ fontSize: font + 14, lineHeight: font + 20, color: colors.white }, textStyle]}>{label}</NumText>
      ) : (
        <SiText weight="bold" style={[{ fontSize: font, color: colors.white }, textStyle]}>
          {label}
        </SiText>
      )}
    </Pressable>
  );
}

export function StarPill({ count, label }: { count?: number; label?: string }) {
  return (
    <View className="flex-row items-center rounded-full bg-white px-3 py-1">
      <Text style={{ fontSize: 15, marginRight: 4 }}>⭐</Text>
      <SiText weight="bold" style={{ fontSize: 14, color: colors.navy }}>
        {label ?? count}
      </SiText>
    </View>
  );
}

/** Blue top bar with back button, title and an optional right-hand element. */
export function TopBar({ title, right, onBack }: { title: string; right?: ReactNode; onBack?: () => void }) {
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));
  return (
    <View className="flex-row items-center justify-between px-4 py-2" style={{ backgroundColor: colors.primary }}>
      <View className="flex-row items-center">
        <Pressable
          onPress={back}
          accessibilityRole="button"
          accessibilityLabel="ආපසු"
          hitSlop={12}
          className="mr-3 h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.primaryLight }}
        >
          <Text style={{ color: colors.white, fontSize: 20, fontWeight: '800', marginTop: -2 }}>‹</Text>
        </Pressable>
        <SiText weight="bold" style={{ color: colors.white, fontSize: 18 }}>
          {title}
        </SiText>
      </View>
      {right}
    </View>
  );
}

export function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <View className="flex-row items-center">
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          className="mx-0.5 rounded-full"
          style={{
            width: i === current ? 14 : 10,
            height: i === current ? 14 : 10,
            backgroundColor: i <= current ? colors.white : colors.primarySoft,
          }}
        />
      ))}
    </View>
  );
}

/** Friendly owl mascot. */
export function Mascot({ size = 80, mood = '🦉' }: { size?: number; mood?: string }) {
  return (
    <View
      className="items-center justify-center rounded-full"
      style={{ width: size, height: size, backgroundColor: colors.sky, borderWidth: 3, borderColor: colors.primaryLight }}
    >
      <Text style={{ fontSize: size * 0.55 }}>{mood}</Text>
    </View>
  );
}

export function Card({ children, style, className = '' }: { children: ReactNode; style?: StyleProp<ViewStyle>; className?: string }) {
  return (
    <View
      className={`rounded-3xl bg-white p-4 ${className}`}
      style={[{ borderWidth: 2, borderColor: colors.border }, style]}
    >
      {children}
    </View>
  );
}
