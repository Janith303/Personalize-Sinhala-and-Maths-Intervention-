import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import type { ComponentProps, ReactNode } from "react";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";

import { accent, greenTheme, type Theme } from "@/constants/common/theme";

import { Txt, useU } from "./layout";

type IconName = ComponentProps<typeof Ionicons>["name"];

export const owlImage = require("../../assets/images/common/owl.png");

export function Owl({ size = 165 }: { size?: number }) {
  const { s } = useU();
  return <Image source={owlImage} contentFit="cover" style={{ width: s(size), height: s(size), borderRadius: s(size) }} />;
}

/** Rounded button. `variant` picks colours; `disabled` shows the soft grey-green look from the designs. */
export function Btn({
  label,
  onPress,
  icon,
  iconLeft,
  variant = "primary",
  disabled,
  theme = greenTheme,
  width,
  height = 64,
  size = 24,
  px = 22,
  style,
}: {
  label: string;
  onPress?: () => void;
  icon?: IconName;
  iconLeft?: boolean;
  variant?: "primary" | "cream" | "soft";
  disabled?: boolean;
  theme?: Theme;
  width?: number;
  height?: number;
  size?: number;
  px?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { s } = useU();
  const off = disabled || variant === "soft";
  const bg = off ? theme.btnSoft : variant === "cream" ? accent.cream : theme.btn;
  const fg = off ? theme.btnSoftText : variant === "cream" ? accent.creamText : "#fff";
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        {
          width: width ? s(width) : undefined,
          height: s(height),
          borderRadius: s(18),
          backgroundColor: bg,
          borderWidth: variant === "cream" ? s(2) : 0,
          borderColor: accent.creamBorder,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: s(8),
          paddingHorizontal: s(px),
        },
        style,
      ]}
    >
      {icon && iconLeft ? <Ionicons name={icon} size={s(size + 2)} color={fg} /> : null}
      <Txt size={size} weight="bold" color={fg} numberOfLines={1}>
        {label}
      </Txt>
      {icon && !iconLeft ? <Ionicons name={icon} size={s(size + 2)} color={fg} /> : null}
    </Pressable>
  );
}

/** White rounded card with the soft green border used across the designs. */
export function Card({
  children,
  width,
  height,
  borderColor = greenTheme.border,
  background = "#fff",
  style,
}: {
  children: ReactNode;
  width?: number;
  height?: number;
  borderColor?: string;
  background?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { s } = useU();
  return (
    <View
      style={[
        {
          width: width ? s(width) : undefined,
          height: height ? s(height) : undefined,
          backgroundColor: background,
          borderRadius: s(26),
          borderWidth: s(2),
          borderColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Option tile used by the quizzes. `badge` is the අ/ආ/ඉ/ඊ marker. */
export function Tile({
  children,
  badge,
  selected,
  onPress,
  width,
  height,
  theme = greenTheme,
  column,
}: {
  children: ReactNode;
  badge?: string;
  selected?: boolean;
  onPress: () => void;
  width?: number;
  height?: number;
  theme?: Theme;
  column?: boolean;
}) {
  const { s } = useU();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{
        width: width ? s(width) : undefined,
        height: height ? s(height) : undefined,
        backgroundColor: selected ? "#E3F4E9" : "#fff",
        borderRadius: s(22),
        borderWidth: s(2),
        borderColor: selected ? theme.btn : theme.border,
        flexDirection: column ? "column" : "row",
        alignItems: "center",
        justifyContent: column ? "center" : "flex-start",
        gap: s(column ? 8 : 18),
        paddingHorizontal: s(20),
        paddingVertical: s(8),
      }}
    >
      {badge ? (
        <View
          style={{
            width: s(54),
            height: s(54),
            borderRadius: s(14),
            backgroundColor: selected ? theme.btn : "#E6F4EB",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Txt size={28} weight="black" color={selected ? "#fff" : theme.ink}>
            {badge}
          </Txt>
        </View>
      ) : null}
      <View style={{ flex: column ? undefined : 1, alignItems: column ? "center" : "flex-start" }}>{children}</View>
      {selected && !column ? <Ionicons name="checkmark-circle-outline" size={s(38)} color={theme.btn} /> : null}
    </Pressable>
  );
}
