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

import {
  StepLines,
  StepZones,
  StepRightSize,
  StepExamples,
} from "../../../../components/sinhala-writing/akurupramanaya/igenagamu/learnsteps";

const DESIGN_WIDTH = 1100;
const DESIGN_HEIGHT = 660;

const GREEN = "#1F8A3B";
const NAVY = "#1E2440";

const STEP_TITLES = [
  "අකුරු ප්‍රමාණය ගැන ඉගෙනගනිමු",
  "අකුරේ කොටස් සහ රේඛා",
  "නිවැරදි ප්‍රමාණය",
  "අකුරු ප්‍රමාණය – උදාහරණ",
];

export default function AkuruPramanayaIgenagamu() {
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
  const total = STEP_TITLES.length;
  const isFirst = step === 0;
  const isLast = step === total - 1;

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepLines scale={scale} />;
      case 1:
        return <StepZones scale={scale} />;
      case 2:
        return <StepRightSize scale={scale} />;
      default:
        return <StepExamples scale={scale} />;
    }
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
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.8} style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={f(28, 20)} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.titleSign}>
              <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
                {STEP_TITLES[step]}
              </Text>
            </View>

            <View style={{ flex: 1 }} />

            <View style={styles.stepPill}>
              <Text style={styles.stepText}>
                {step + 1} / {total}
              </Text>
            </View>
          </View>

          {/* CONTENT */}
          <View style={styles.content}>{renderStep()}</View>

          {/* BOTTOM NAV */}
          <View style={styles.bottomRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isFirst}
              onPress={() => setStep(step - 1)}
              style={[styles.navButton, styles.prevButton, isFirst && styles.navDisabled]}
            >
              <Ionicons name="chevron-back" size={f(22, 18)} color={GREEN} />
              <Text style={[styles.navText, { color: GREEN }]}>පෙර</Text>
            </TouchableOpacity>

            <View style={styles.dots}>
              {STEP_TITLES.map((_, i) => (
                <View key={i} style={[styles.dot, i === step ? styles.dotActive : styles.dotIdle]} />
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => (isLast ? router.back() : setStep(step + 1))}
              style={[styles.navButton, styles.nextButton]}
            >
              <Text style={[styles.navText, { color: "#FFFFFF" }]}>{isLast ? "අවසන්" : "ඊළඟ"}</Text>
              <Ionicons name="chevron-forward" size={f(22, 18)} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}

function createStyles(scale: number) {
  const f = (n: number, min: number) => Math.max(n * scale, min);
  const titleFont = f(30, 17);
  const navFont = f(19, 14.5);

  return StyleSheet.create({
    container: { flex: 1 },
    page: { flex: 1, gap: f(10, 6) },

    header: { height: f(70, 48), flexDirection: "row", alignItems: "center", gap: f(14, 10) },
    backButton: {
      width: f(62, 44),
      height: f(62, 44),
      borderRadius: f(31, 22),
      backgroundColor: GREEN,
      borderWidth: 3,
      borderColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      elevation: 5,
    },
    titleSign: {
      flexShrink: 1,
      backgroundColor: "#E9A65C",
      borderWidth: 2,
      borderColor: "#B8742F",
      borderRadius: f(14, 10),
      paddingHorizontal: f(30, 16),
      paddingVertical: f(6, 3),
      transform: [{ rotate: "-1deg" }],
      elevation: 4,
    },
    title: {
      fontSize: titleFont,
      lineHeight: titleFont * 1.4,
      fontWeight: "900",
      color: NAVY,
    },
    stepPill: {
      backgroundColor: "rgba(255,255,255,0.95)",
      borderRadius: f(24, 16),
      paddingHorizontal: f(20, 12),
      paddingVertical: f(8, 5),
      elevation: 3,
    },
    stepText: { fontSize: f(20, 14), fontWeight: "800", color: NAVY },

    content: { flex: 1, minHeight: 0 },

    bottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    navButton: {
      minWidth: f(160, 110),
      height: f(52, 38),
      borderRadius: f(26, 19),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingHorizontal: f(20, 14),
      borderWidth: 3,
      elevation: 4,
    },
    prevButton: { backgroundColor: "#FFFFFF", borderColor: "#CDEFD8" },
    nextButton: { backgroundColor: GREEN, borderColor: "#FFFFFF" },
    navDisabled: { opacity: 0.45 },
    navText: { fontSize: navFont, lineHeight: navFont * 1.4, fontWeight: "900" },
    dots: {
      flexDirection: "row",
      gap: f(10, 7),
      backgroundColor: "rgba(255,255,255,0.9)",
      borderRadius: 20,
      paddingHorizontal: f(14, 10),
      paddingVertical: f(8, 5),
    },
    dot: { width: f(14, 10), height: f(14, 10), borderRadius: f(7, 5) },
    dotActive: { backgroundColor: GREEN },
    dotIdle: { backgroundColor: "#D1D5DB" },
  });
}