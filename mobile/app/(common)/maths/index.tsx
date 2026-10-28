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

type HomeCard = {
  title: string;
  subtitle: string;
  route: string;
  cardBg: string;
  cardBorder: string;
  artBg: string;
  titleColor: string;
  buttonColor: string;
  art: "calculator" | "brain";
};

const CARDS: HomeCard[] = [
  {
    title: "ගණිත ක්‍රියාකාරකම්",
    subtitle: "(එකතු, අඩු, ගුණ, බෙදීම්)",
    route: "/maths-slow/operations",
    cardBg: "#FFF7E6",
    cardBorder: "#F3DDB0",
    artBg: "#FCEBC4",
    titleColor: "#6B3410",
    buttonColor: "#F5B731",
    art: "calculator",
  },
  {
    title: "ඩිස්කැල්කුලියා",
    subtitle: "හඳුනාගනිමු",
    route: "/dyscalculia",
    cardBg: "#F3EDFF",
    cardBorder: "#D9CBFF",
    artBg: "#E6DBFF",
    titleColor: "#6D28D9",
    buttonColor: "#8B5CF6",
    art: "brain",
  },
];

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/* ---------- Card illustrations (drawn with icons, no images needed) ---------- */

function CalculatorArt({ size }: { size: number }) {
  const sym = size * 0.26;
  return (
    <View style={{ width: size, height: size }}>
      <View style={styles.artCenter}>
        <MaterialCommunityIcons name="calculator-variant" size={size * 0.58} color="#2563EB" />
      </View>
      <Text style={[styles.mathSym, { fontSize: sym, color: "#22C55E", top: 0, left: size * 0.06 }]}>+</Text>
      <Text style={[styles.mathSym, { fontSize: sym, color: "#EF4444", top: 0, right: size * 0.06 }]}>−</Text>
      <Text style={[styles.mathSym, { fontSize: sym, color: "#8B5CF6", bottom: 0, left: size * 0.04 }]}>×</Text>
      <Text style={[styles.mathSym, { fontSize: sym, color: "#F59E0B", bottom: size * 0.12, right: size * 0.02 }]}>÷</Text>
    </View>
  );
}

function BrainArt({ size }: { size: number }) {
  const q = size * 0.24;
  return (
    <View style={{ width: size, height: size }}>
      <View style={styles.artCenter}>
        <MaterialCommunityIcons name="brain" size={size * 0.6} color="#F472B6" />
      </View>
      <Text style={[styles.mathSym, { fontSize: q, color: "#F59E0B", top: size * 0.04, left: size * 0.06 }]}>?</Text>
      <Text style={[styles.mathSym, { fontSize: q, color: "#8B5CF6", top: 0, right: size * 0.06 }]}>?</Text>
      <MaterialCommunityIcons
        name="puzzle"
        size={size * 0.2}
        color="#3B82F6"
        style={{ position: "absolute", bottom: size * 0.06, left: 0 }}
      />
      <MaterialCommunityIcons
        name="puzzle"
        size={size * 0.2}
        color="#22C55E"
        style={{ position: "absolute", bottom: size * 0.1, right: 0, transform: [{ rotate: "25deg" }] }}
      />
    </View>
  );
}

/* ---------- Screen ---------- */

export default function MathsSlowHome() {
  const insets = useSafeAreaInsets();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);
  const [backPressed, setBackPressed] = useState(false);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  const { w: width, h: height } = size;
  const pad = clamp(Math.min(width, height) * 0.04, 10, 28);
  const usableW = width - insets.left - insets.right - pad * 2;
  const usableH = height - insets.top - insets.bottom - pad * 2;

  // Wooden sign
  const signW = clamp(Math.min(usableW * 0.4, usableH * 0.95), 200, 560);
  const signH = signW * 0.34;
  const ropeH = signH * 0.28;
  const signFont = signH * 0.34;

  // Cards
  const cardsTop = ropeH + signH + pad * 0.8;
  const availCardH = usableH - cardsTop;
  const cardH = clamp(availCardH, 160, 460);
  const cardW = clamp(Math.min(cardH * 0.86, usableW * 0.27), 140, 380);
  const cardGap = clamp(usableW * 0.02, 10, 28);
  const artSize = cardH * 0.4;
  const cardTitleFont = clamp(cardH * 0.082, 13, 30);
  const cardSubFont = clamp(cardH * 0.058, 10, 20);
  const arrowSize = clamp(cardH * 0.16, 34, 64);

  const backSize = clamp(Math.min(width, height) * 0.11, 38, 60);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground
        source={require("../../../assets/images/maths-slow/mathshomebackground.png")}
        style={styles.container}
        resizeMode="cover"
        onLayout={onLayout}
      >
        {width > 0 && (
          <View
            style={[
              styles.container,
              {
                paddingTop: insets.top + pad,
                paddingBottom: insets.bottom + pad,
                paddingLeft: insets.left + pad,
                paddingRight: insets.right + pad,
                alignItems: "center",
              },
            ]}
          >
            {/* ---------- HANGING WOODEN SIGN ---------- */}
            <View style={{ width: signW, alignItems: "center", marginTop: -pad }}>
              {/* ropes */}
              <View style={{ flexDirection: "row", width: signW * 0.82, justifyContent: "space-between" }}>
                <View style={[styles.rope, { height: ropeH + pad }]} />
                <View style={[styles.rope, { height: ropeH + pad }]} />
              </View>

              <View
                style={[
                  styles.sign,
                  { width: signW, height: signH, borderRadius: signH * 0.18 },
                ]}
              >
                {/* wood plank lines */}
                <View style={[styles.plankLine, { top: signH * 0.33 }]} />
                <View style={[styles.plankLine, { top: signH * 0.66 }]} />

                {/* nails */}
                <View style={[styles.nail, { left: signW * 0.08, top: signH * 0.1 }]} />
                <View style={[styles.nail, { right: signW * 0.08, top: signH * 0.1 }]} />

                <Text style={[styles.signTitle, { fontSize: signFont, lineHeight: signFont * 1.35 }]}>
                  ගණිතය
                </Text>
                <Text
                  style={[
                    styles.signSubtitle,
                    { fontSize: signFont * 0.62, lineHeight: signFont * 0.9 },
                  ]}
                >
                  ඉගෙන ගනිමු
                </Text>
              </View>

              {/* leaves on the sign corners */}
              <Ionicons
                name="leaf"
                size={signH * 0.42}
                color="#4CAF50"
                style={{ position: "absolute", left: -signH * 0.22, top: ropeH + pad + signH * 0.05, transform: [{ rotate: "-40deg" }] }}
              />
              <Ionicons
                name="leaf"
                size={signH * 0.42}
                color="#43A047"
                style={{ position: "absolute", right: -signH * 0.22, top: ropeH + pad + signH * 0.45, transform: [{ rotate: "130deg" }] }}
              />
            </View>

            {/* ---------- CARDS ---------- */}
            <View style={[styles.cardsRow, { gap: cardGap, marginTop: pad * 0.8 }]}>
              {CARDS.map((card, index) => {
                const pressed = pressedIndex === index;
                return (
                  <Pressable
                    key={card.route}
                    onPress={() => router.push(card.route as any)}
                    onPressIn={() => setPressedIndex(index)}
                    onPressOut={() => setPressedIndex(null)}
                    style={[
                      styles.card,
                      {
                        width: cardW,
                        height: cardH,
                        borderRadius: cardW * 0.1,
                        backgroundColor: card.cardBg,
                        borderColor: card.cardBorder,
                        padding: cardH * 0.04,
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                        opacity: pressed ? 0.92 : 1,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.artCircle,
                        {
                          width: artSize * 1.15,
                          height: artSize * 1.15,
                          borderRadius: artSize,
                          backgroundColor: card.artBg,
                        },
                      ]}
                    >
                      {card.art === "calculator" ? (
                        <CalculatorArt size={artSize} />
                      ) : (
                        <BrainArt size={artSize} />
                      )}
                    </View>

                    <View style={styles.cardTextBox}>
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={[styles.cardTitle, { fontSize: cardTitleFont, color: card.titleColor }]}
                      >
                        {card.title}
                      </Text>
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={[styles.cardSubtitle, { fontSize: cardSubFont }]}
                      >
                        {card.subtitle}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.arrowButton,
                        {
                          width: arrowSize,
                          height: arrowSize,
                          borderRadius: arrowSize / 2,
                          backgroundColor: card.buttonColor,
                        },
                      ]}
                    >
                      <Ionicons name="arrow-forward" size={arrowSize * 0.55} color="#FFFFFF" />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* ---------- BACK BUTTON ---------- */}
        {width > 0 && (
          <Pressable
            onPress={() => router.back()}
            onPressIn={() => setBackPressed(true)}
            onPressOut={() => setBackPressed(false)}
            style={[
              styles.backButton,
              {
                top: insets.top + pad,
                left: insets.left + pad,
                width: backSize,
                height: backSize,
                borderRadius: backSize * 0.32,
                opacity: backPressed ? 0.8 : 1,
              },
            ]}
          >
            <Ionicons name="arrow-back" size={backSize * 0.55} color="#2E9E4F" />
          </Pressable>
        )}
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  backButton: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  /* Sign */
  rope: {
    width: 5,
    backgroundColor: "#9C6B3C",
    borderRadius: 3,
  },

  sign: {
    backgroundColor: "#E9B872",
    borderWidth: 4,
    borderColor: "#B7782F",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#5A3410",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 7,
  },

  plankLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(150, 95, 40, 0.25)",
  },

  nail: {
    position: "absolute",
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#7A4A1E",
  },

  signTitle: {
    fontWeight: "900",
    color: "#5A2D0C",
    textAlign: "center",
  },

  signSubtitle: {
    fontWeight: "900",
    color: "#2E7D32",
    textAlign: "center",
  },

  /* Cards */
  cardsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },

  artCircle: {
    justifyContent: "center",
    alignItems: "center",
  },

  artCenter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },

  mathSym: {
    position: "absolute",
    fontWeight: "900",
  },

  cardTextBox: {
    width: "100%",
    alignItems: "center",
  },

  cardTitle: {
    fontWeight: "900",
    textAlign: "center",
  },

  cardSubtitle: {
    marginTop: 2,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
  },

  arrowButton: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});