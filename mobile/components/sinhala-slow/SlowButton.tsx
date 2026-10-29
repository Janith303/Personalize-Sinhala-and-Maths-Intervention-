import { Ionicons } from "@expo/vector-icons";
import { useState, type ComponentProps } from "react";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";

import { Txt, useU } from "@/components/common/layout";

type IconName = ComponentProps<typeof Ionicons>["name"];


export function SlowButton({
  label,
  onPress,
  icon,
  iconLeft,
  variant = "primary",
  disabled,
  color = "#1A8553",
  darkColor = "#0F5F3A",
  width,
  height = 56,
  size = 22,
  px = 22,
  style,
}: {
  label: string;
  onPress?: () => void;
  icon?: IconName;
  iconLeft?: boolean;
  variant?: "primary" | "cream" | "soft";
  disabled?: boolean;
  color?: string;
  darkColor?: string;
  width?: number;
  height?: number;
  size?: number;
  px?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { s } = useU();
  const [pressed, setPressed] = useState(false);

  const off = disabled || variant === "soft";
  const cream = !off && variant === "cream";

  const bg = off ? "#D5EBDF" : cream ? "#FFEFC8" : color;
  const dark = off ? "#B9D8C6" : cream ? "#E6C777" : darkColor;
  const fg = off ? "#5E8F73" : cream ? "#6B4A00" : "#fff";
  const gloss = cream ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.22)";

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        {
          width: width ? s(width) : undefined,
          height: s(height),
          borderRadius: s(height / 2),
          backgroundColor: bg,
          borderWidth: s(2),
          borderColor: dark,
          borderBottomWidth: s(5),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: s(8),
          paddingHorizontal: s(px),
          shadowColor: dark,
          shadowOffset: { width: 0, height: s(4) },
          shadowOpacity: off ? 0 : 0.35,
          shadowRadius: s(5),
          elevation: off ? 0 : 5,
          transform: [{ scale: pressed && !off ? 0.97 : 1 }],
        },
        style,
      ]}
    >
      {/* gloss highlight (inset so it never pokes past the rounded ends) */}
      {off ? null : (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: s(3),
            left: s(height * 0.32),
            right: s(height * 0.32),
            height: s(height * 0.36),
            borderRadius: s(height * 0.18),
            backgroundColor: gloss,
          }}
        />
      )}
      {icon && iconLeft ? <Ionicons name={icon} size={s(size + 2)} color={fg} /> : null}
      <Txt
        size={size}
        weight="black"
        color={fg}
        numberOfLines={1}
        style={
          off || cream
            ? undefined
            : { textShadowColor: "rgba(0,0,0,0.28)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }
        }
      >
        {label}
      </Txt>
      {icon && !iconLeft ? <Ionicons name={icon} size={s(size + 2)} color={fg} /> : null}
    </Pressable>
  );
}