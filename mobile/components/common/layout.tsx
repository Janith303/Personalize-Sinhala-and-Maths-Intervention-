import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, Text, View, useWindowDimensions, type StyleProp, type TextStyle } from "react-native";

import { fonts, greenTheme, type Theme, type Weight } from "@/constants/common/theme";

/** The designs are 1280 x 590. `u` scales a design pixel to this screen. */
export function useU() {
  const { width, height } = useWindowDimensions();
  const u = Math.min(width / 1280, height / 590);
  return { u, s: (n: number) => n * u, width, height };
}

export function Txt({
  size = 24,
  weight = "semi",
  color = "#0B4A2A",
  align,
  style,
  numberOfLines,
  children,
}: {
  size?: number;
  weight?: Weight;
  color?: string;
  align?: TextStyle["textAlign"];
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  children: ReactNode;
}) {
  const { s } = useU();
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        { fontFamily: fonts[weight], fontSize: s(size), lineHeight: s(size * 1.55), color, textAlign: align },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

// ---- faint floating letters behind every screen ----
const BACKDROP: { c: string; x: number; y: number; size: number; color: string }[] = [
  { c: "ක", x: 170, y: 20, size: 40, color: "#FBE3B0" },
  { c: "ත", x: 340, y: 0, size: 38, color: "#D4EBDD" },
  { c: "ම", x: 580, y: 0, size: 42, color: "#F9D5DC" },
  { c: "ස", x: 770, y: 6, size: 40, color: "#D4EBDD" },
  { c: "ට", x: 905, y: 40, size: 86, color: "#D4EBDD" },
  { c: "ඔ", x: 1050, y: 0, size: 44, color: "#F9D5DC" },
  { c: "අ", x: 45, y: 70, size: 66, color: "#D4EBDD" },
  { c: "ඈ", x: 20, y: 175, size: 38, color: "#D4EBDD" },
  { c: "ග", x: 20, y: 275, size: 46, color: "#E3DAF6" },
  { c: "ඉ", x: 120, y: 395, size: 70, color: "#D4EBDD" },
  { c: "ච", x: 265, y: 420, size: 58, color: "#F9D5DC" },
  { c: "එ", x: 470, y: 430, size: 46, color: "#FBE3B0" },
  { c: "ද", x: 690, y: 440, size: 40, color: "#D4EBDD" },
  { c: "හ", x: 830, y: 428, size: 44, color: "#E3DAF6" },
  { c: "ල", x: 1035, y: 395, size: 70, color: "#FBE3B0" },
  { c: "ර", x: 1010, y: 110, size: 44, color: "#E3DAF6" },
  { c: "උ", x: 940, y: 310, size: 44, color: "#F9D5DC" },
  { c: "න", x: 1055, y: 270, size: 36, color: "#D4EBDD" },
];

function Backdrop({ digits }: { digits?: boolean }) {
  const { s } = useU();
  const items = digits
    ? BACKDROP.map((b, i) => ({ ...b, c: "0123456789"[i % 10] }))
    : BACKDROP;
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
      {items.map((b, i) => (
        <Text
          key={i}
          style={{
            position: "absolute",
            left: s(b.x),
            top: s(b.y),
            fontFamily: fonts.black,
            fontSize: s(b.size),
            lineHeight: s(b.size * 1.5),
            color: b.color,
          }}
        >
          {b.c}
        </Text>
      ))}
      {[
        { x: 270, y: 210, d: 40, c: "#D4EBDD" },
        { x: 935, y: 205, d: 30, c: "#E3DAF6" },
      ].map((o, i) => (
        <View
          key={`o${i}`}
          style={{
            position: "absolute",
            left: s(o.x),
            top: s(o.y),
            width: s(o.d),
            height: s(o.d),
            borderRadius: s(o.d),
            borderWidth: s(3),
            borderColor: o.c,
          }}
        />
      ))}
    </View>
  );
}

/** Round settings button shown top-right on every screen (no action yet). */
function GearButton({ theme }: { theme: Theme }) {
  const { s } = useU();
  return (
    <View
      accessibilityLabel="සැකසුම්"
      style={{
        position: "absolute",
        right: s(12),
        top: s(85),
        width: s(86),
        height: s(86),
        borderRadius: s(43),
        backgroundColor: theme.gear,
        borderWidth: s(4),
        borderColor: theme.gearRing,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name="settings-outline" size={s(42)} color="#fff" />
    </View>
  );
}

/** Header + light panel with decorative backdrop. `right` goes at the right end of the header. */
export function Page({
  title,
  right,
  theme = greenTheme,
  showBack = true,
  onBack,
  digits,
  children,
}: {
  title: string;
  right?: ReactNode;
  theme?: Theme;
  showBack?: boolean;
  onBack?: () => void;
  digits?: boolean;
  children: ReactNode;
}) {
  const { s } = useU();
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace("/")));
  return (
    <View style={{ flex: 1, backgroundColor: theme.header }}>
      <View style={{ height: s(69), flexDirection: "row", alignItems: "center" }}>
        {showBack ? (
          <Pressable
            onPress={back}
            accessibilityLabel="ආපසු"
            style={{
              marginLeft: s(110),
              width: s(47),
              height: s(47),
              borderRadius: s(24),
              backgroundColor: theme.backBtn,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="chevron-back" size={s(26)} color="#fff" />
          </Pressable>
        ) : null}
        <View style={{ marginLeft: showBack ? s(17) : s(110), flex: 1 }}>
          <Txt size={30} weight="black" color="#fff" numberOfLines={1}>
            {title}
          </Txt>
        </View>
        <View style={{ marginRight: s(110) }}>{right}</View>
      </View>
      <View style={{ flex: 1, marginHorizontal: s(89), marginBottom: s(30), backgroundColor: theme.panel, overflow: "hidden" }}>
        <Backdrop digits={digits} />
        {children}
      </View>
      
    </View>
  );
}

/** White dots in the header: current is big, finished are white, upcoming are faded. */
export function ProgressDots({ count, index }: { count: number; index: number }) {
  const { s } = useU();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: s(9) }}>
      {Array.from({ length: count }).map((_, i) => {
        const size = i === index ? 22 : 15;
        return (
          <View
            key={i}
            style={{
              width: s(size),
              height: s(size),
              borderRadius: s(size),
              backgroundColor: i <= index ? "#fff" : "rgba(255,255,255,0.4)",
            }}
          />
        );
      })}
    </View>
  );
}

export function CountPill({ done, total }: { done: number; total: number }) {
  const { s } = useU();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: s(8),
        backgroundColor: "#fff",
        borderRadius: s(24),
        paddingHorizontal: s(18),
        paddingVertical: s(5),
      }}
    >
      <Ionicons name="checkmark-circle-outline" size={s(22)} color="#1A8553" />
      <Txt size={20} weight="bold" color="#0B4A2A">
        {done} / {total} සම්පූර්ණයි
      </Txt>
    </View>
  );
}
