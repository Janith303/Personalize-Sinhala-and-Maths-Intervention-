import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  LayoutChangeEvent,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OutlinedText } from "@/components/common/OutlinedText";

type Subject = {
  key: "sinhala" | "maths";
  title: string;
  subtitle: string;
  color: string;
  colorDark: string;
  route: string;
  deco: "leaf" | "star";
};

const SUBJECTS: Subject[] = [
  {
    key: "sinhala",
    title: "සිංහල",
    subtitle: "අකුරු ඉගෙන ගනිමු",
    color: "#2E9E43",
    colorDark: "#1F7A32",
    route: "/sinhala",
    deco: "leaf",
  },
  {
    key: "maths",
    title: "ගණිතය",
    subtitle: "ඉගෙන ගනිමු",
    color: "#2F6FE0",
    colorDark: "#1E4FB0",
    route: "/maths",
    deco: "star",
  },
];

// faint decorations inside each card: [left%, top%, sizeFactor, rotate]
const DECOS: [number, number, number, number][] = [
  [0.08, 0.08, 0.12, -20],
  [0.8, 0.12, 0.1, 25],
  [0.06, 0.62, 0.09, 15],
  [0.82, 0.55, 0.13, -30],
];

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

function SubjectGlyph({ subject, size }: { subject: Subject; size: number }) {
  if (subject.key === "sinhala") {
    return (
      <Text style={{ fontSize: size, lineHeight: size * 1.35, fontWeight: "900", color: subject.color }}>
        අ
      </Text>
    );
  }
  const digits: [string, string][] = [
    ["1", "#2196F3"],
    ["2", "#FFA000"],
    ["3", "#F04E6E"],
  ];
  return (
    <View style={{ flexDirection: "row" }}>
      {digits.map(([d, c]) => (
        <Text key={d} style={{ fontSize: size * 0.82, lineHeight: size * 1.2, fontWeight: "900", color: c }}>
          {d}
        </Text>
      ))}
    </View>
  );
}

/** Screen 1: choose a subject. */
export default function Home() {
  const insets = useSafeAreaInsets();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [pressed, setPressed] = useState<string | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  const { w: width, h: height } = size;
  const pad = clamp(Math.min(width, height) * 0.04, 10, 28);
  const usableW = width - insets.left - insets.right - pad * 2;
  const usableH = height - insets.top - insets.bottom - pad * 2;

  const titleH = clamp(usableH * 0.2, 50, 130);
  const titleFont = titleH * 0.5;
  const cardH = clamp(usableH - titleH - pad, 160, 520);
  const cardW = clamp(Math.min(cardH * 0.98, usableW * 0.32), 150, 460);
  const cardGap = clamp(usableW * 0.015, 8, 24);

  const tileW = cardW * 0.42;
  const tileH = tileW * 0.78;
  const glyphSize = tileH * 0.62;
  const cardTitleFont = clamp(cardH * 0.1, 16, 46);
  const cardSubFont = clamp(cardH * 0.055, 11, 24);
  const arrowSize = clamp(cardH * 0.12, 30, 60);
  const backSize = clamp(Math.min(width, height) * 0.11, 38, 60);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground
        source={require("../assets/images/common/homebackground.png")}
        style={styles.container}
        resizeMode="cover"
        onLayout={onLayout}
      >
        {width > 0 && (
          <View
            style={[
              styles.container,
              {
                paddingTop: insets.top + pad * 0.6,
                paddingBottom: insets.bottom + pad,
                paddingLeft: insets.left + pad,
                paddingRight: insets.right + pad,
                alignItems: "center",
              },
            ]}
          >
            {/* ---------- TITLE ---------- */}
            <View style={[styles.titleRow, { height: titleH, gap: titleFont * 0.25 }]}>
              <Ionicons name="leaf" size={titleFont * 0.6} color="#43A047" style={{ transform: [{ rotate: "-30deg" }] }} />
              <OutlinedText text="විෂයක් තෝරන්න" fontSize={titleFont} color="#1B7F3B" />
              <MaterialCommunityIcons name="book-open-page-variant" size={titleFont * 0.9} color="#F5A524" />
              <Ionicons name="leaf" size={titleFont * 0.6} color="#43A047" style={{ transform: [{ rotate: "120deg" }] }} />
            </View>

            {/* ---------- CARDS ---------- */}
            <View style={[styles.cardsRow, { gap: cardGap, marginTop: pad * 0.4 }]}>
              {SUBJECTS.map((s) => {
                const isPressed = pressed === s.key;
                return (
                  <Pressable
                    key={s.key}
                    onPress={() => router.push(s.route as never)}
                    onPressIn={() => setPressed(s.key)}
                    onPressOut={() => setPressed(null)}
                    accessibilityRole="button"
                    accessibilityLabel={s.title}
                    style={[
                      styles.card,
                      {
                        width: cardW,
                        height: cardH,
                        borderRadius: cardW * 0.08,
                        backgroundColor: s.color,
                        paddingVertical: cardH * 0.07,
                        transform: [{ scale: isPressed ? 0.97 : 1 }],
                      },
                    ]}
                  >
                    {/* faint leaves / stars */}
                    {DECOS.map(([l, t, f, r], i) => (
                      <Ionicons
                        key={i}
                        name={s.deco === "leaf" ? "leaf" : "star"}
                        size={cardW * f}
                        color="rgba(255,255,255,0.16)"
                        style={{
                          position: "absolute",
                          left: cardW * l,
                          top: cardH * t,
                          transform: [{ rotate: `${r}deg` }],
                        }}
                      />
                    ))}

                    <View
                      style={[
                        styles.glyphTile,
                        { width: tileW, height: tileH, borderRadius: tileW * 0.18 },
                      ]}
                    >
                      <SubjectGlyph subject={s} size={glyphSize} />
                    </View>

                    <View style={{ alignItems: "center" }}>
                      <Text
                        style={[
                          styles.cardTitle,
                          { fontSize: cardTitleFont, lineHeight: cardTitleFont * 1.4 },
                        ]}
                      >
                        {s.title}
                      </Text>
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={[styles.cardSubtitle, { fontSize: cardSubFont, lineHeight: cardSubFont * 1.5 }]}
                      >
                        {s.subtitle}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.arrow,
                        { width: arrowSize, height: arrowSize, borderRadius: arrowSize / 2 },
                      ]}
                    >
                      <Ionicons name="chevron-forward" size={arrowSize * 0.6} color={s.colorDark} />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* ---------- BACK (only if there is somewhere to go back to) ---------- */}
        {width > 0 && router.canGoBack() && (
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="ආපසු"
            style={[
              styles.backButton,
              {
                top: insets.top + pad,
                left: insets.left + pad,
                width: backSize,
                height: backSize,
                borderRadius: backSize / 2,
              },
            ]}
          >
            <Ionicons name="chevron-back" size={backSize * 0.55} color="#1B7F3B" />
          </Pressable>
        )}
      </ImageBackground>
    </>
  );
}

const shadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 6,
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  backButton: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    ...shadow,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  cardsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    borderWidth: 5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    ...shadow,
  },

  glyphTile: {
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    ...shadow,
    elevation: 4,
  },

  cardTitle: {
    fontWeight: "900",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },

  cardSubtitle: {
    fontWeight: "700",
    color: "#FFFFFF",
  },

  arrow: {
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    ...shadow,
    elevation: 3,
  },
});