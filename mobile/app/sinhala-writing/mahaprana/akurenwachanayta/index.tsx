import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  LayoutChangeEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import WordIntro from "../../../../components/sinhala-writing/mahaprana/akurenwachanayata/wordintro";
import { LETTER_WORDS } from "../../../../components/sinhala-writing/mahaprana/akurenwachanayata/words";

/* Designed for 1100 x 660, then scaled to fit the real screen */
const DESIGN_WIDTH = 1100;
const DESIGN_HEIGHT = 660;

const GREEN = "#1F8A3B";
const NAVY = "#1E2440";

export default function AkurenWachanayata() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [size, setSize] = useState({ w: 0, h: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  const scale = Math.min(
    (size.w - insets.left - insets.right) / DESIGN_WIDTH,
    (size.h - insets.top - insets.bottom) / DESIGN_HEIGHT,
    1.3
  );
  const f = (n: number, min: number) => Math.max(n * scale, min);
  const styles = useMemo(() => createStyles(scale), [scale]);

  const [step, setStep] = useState(0);
  const total = LETTER_WORDS.length;
  const isFirst = step === 0;
  const isLast = step === total - 1;

  const goNext = () => {
    if (!isLast) setStep(step + 1);
    else router.back(); // TODO: go to the next activity when it's ready
  };

  return (
    <ImageBackground
      source={require("../../../../assets/images/sinhala-writing/maharecog.png")}
      style={styles.container}
      resizeMode="cover"
      onLayout={onLayout}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {size.h > 0 && (
        <View
          style={[
            styles.page,
            {
              paddingTop: insets.top + f(10, 6),
              paddingBottom: insets.bottom + f(10, 6),
              paddingLeft: insets.left + f(20, 12),
              paddingRight: insets.right + f(20, 12),
            },
          ]}
        >
          {/* ================= HEADER ================= */}
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={f(28, 20)} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>
                අකුරෙන් වචනයට
              </Text>
              <Text style={styles.headerSub} numberOfLines={1}>
                මහාප්‍රාණ අකුරු
              </Text>
            </View>

            {/* Progress: which letter we're on */}
            <View style={styles.progressPill}>
              <View style={styles.progressDots}>
                {LETTER_WORDS.map((_, i) => (
                  <View
                    key={i}
                    style={[styles.progressDot, i <= step ? styles.dotDone : styles.dotTodo]}
                  />
                ))}
              </View>
              <Text style={styles.progressText}>
                {step + 1} / {total}
              </Text>
            </View>
          </View>

          {/* ================= CONTENT ================= */}
          <View style={styles.content}>
            <WordIntro key={step} scale={scale} item={LETTER_WORDS[step]} />
          </View>

          {/* ================= BOTTOM NAV ================= */}
          <View style={styles.bottomRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isFirst}
              onPress={() => setStep(step - 1)}
              style={[styles.navButton, styles.prevButton, isFirst && styles.navDisabled]}
            >
              <Ionicons name="chevron-back" size={f(24, 18)} color={isFirst ? "#9CA3AF" : GREEN} />
              <Text style={[styles.navText, { color: isFirst ? "#9CA3AF" : GREEN }]}>පෙර</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={goNext}
              style={[styles.navButton, styles.nextButton]}
            >
              <Text style={[styles.navText, { color: "#FFFFFF" }]}>
                {isLast ? "අවසන්" : "ඊළඟ"}
              </Text>
              <Ionicons name="chevron-forward" size={f(24, 18)} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}

function createStyles(scale: number) {
  const f = (n: number, min: number) => Math.max(n * scale, min);

  const headerH = f(70, 48);
  const backSize = f(62, 44);
  const titleSize = f(34, 19);
  const subSize = f(18, 12);
  const navFont = f(20, 15);

  return StyleSheet.create({
    container: { flex: 1 },
    page: { flex: 1, gap: f(10, 6) },

    /* ---------- HEADER ---------- */
    header: {
      height: headerH,
      flexDirection: "row",
      alignItems: "center",
    },
    backButton: {
      width: backSize,
      height: backSize,
      borderRadius: backSize / 2,
      backgroundColor: GREEN,
      borderWidth: 3,
      borderColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    headerCenter: { flex: 1, marginLeft: f(16, 10) },
    headerTitle: {
      fontSize: titleSize,
      lineHeight: titleSize * 1.35,
      fontWeight: "900",
      color: NAVY,
      textShadowColor: "#FFFFFF",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 8,
    },
    headerSub: {
      fontSize: subSize,
      lineHeight: subSize * 1.35,
      fontWeight: "700",
      color: "#2D3748",
      textShadowColor: "#FFFFFF",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 6,
    },
    progressPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: f(14, 8),
      backgroundColor: "rgba(255,255,255,0.95)",
      borderRadius: f(30, 20),
      paddingHorizontal: f(18, 12),
      paddingVertical: f(10, 6),
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    progressDots: { flexDirection: "row", gap: f(8, 5) },
    progressDot: {
      width: f(14, 9),
      height: f(14, 9),
      borderRadius: f(7, 4.5),
    },
    dotDone: { backgroundColor: GREEN },
    dotTodo: { backgroundColor: "#D9DEE3" },
    progressText: {
      fontSize: f(20, 14),
      fontWeight: "800",
      color: NAVY,
    },

    /* ---------- CONTENT ---------- */
    content: { flex: 1, minHeight: 0 },

    /* ---------- BOTTOM NAV ---------- */
    bottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    navButton: {
      minWidth: f(170, 110),
      height: f(56, 38),
      borderRadius: f(28, 19),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: f(8, 5),
      paddingHorizontal: f(22, 14),
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.18,
      shadowRadius: 4,
    },
    prevButton: { backgroundColor: "#FFFFFF" },
    navDisabled: { opacity: 0.7 },
    nextButton: {
      backgroundColor: GREEN,
      borderWidth: 3,
      borderColor: "#FFFFFF",
    },
    navText: {
      fontSize: navFont,
      lineHeight: navFont * 1.4,
      fontWeight: "900",
    },
  });
}