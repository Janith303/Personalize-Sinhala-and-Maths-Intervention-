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

import SentenceWords from "../../../../components/sinhala-writing/wakyagodanagamu/wachanahadndunagamu/sentencewords";
import SplitWords from "../../../../components/sinhala-writing/wakyagodanagamu/wachanahadndunagamu/splitwords";
import WordBaskets from "../../../../components/sinhala-writing/wakyagodanagamu/wachanahadndunagamu/wordbakets";
import { SENTENCES } from "../../../../components/sinhala-writing/wakyagodanagamu/wachanahadndunagamu/sentences";

const DESIGN_WIDTH = 1100;
const DESIGN_HEIGHT = 660;

const GREEN = "#1F8A3B";
const NAVY = "#1E2440";
const BROWN = "#6B3A12";

const TABS = [
  { label: "වාක්‍යයක වචන", emoji: "🔢" },
  { label: "වචන වෙන් කරමු", emoji: "✂️" },
  { label: "කවුද? / මොකද?", emoji: "🧺" },
];

export default function WachanaHandunagamu() {
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

  const total = SENTENCES.length;
  const [tab, setTab] = useState(0);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<boolean[][]>(() => TABS.map(() => SENTENCES.map(() => false)));

  const isFirst = tab === 0 && step === 0;
  const isLastStep = step === total - 1;
  const isLastTab = tab === TABS.length - 1;
  const canGoNext = done[tab][step];
  const nextLabel = !isLastStep ? "ඊළඟ" : !isLastTab ? "ඊළඟ කොටස" : "අවසන්";

  const goTab = (t: number) => {
    setTab(t);
    setStep(0);
  };

  const goPrev = () => {
    if (step > 0) setStep(step - 1);
    else if (tab > 0) {
      setTab(tab - 1);
      setStep(total - 1);
    }
  };

  const goNext = () => {
    if (!isLastStep) setStep(step + 1);
    else if (!isLastTab) goTab(tab + 1);
    else router.back();
  };

  const markDone = () =>
    setDone((prev) =>
      prev.map((row, t) => (t === tab ? row.map((v, i) => (i === step ? true : v)) : row))
    );

  const item = SENTENCES[step];
  const isDone = done[tab][step];

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
          {/* HEADER + TABS */}
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.8} style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={f(28, 20)} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.titleSign}>
              <Text style={styles.title} numberOfLines={1}>වචන හඳුනාගමු</Text>
            </View>

            <View style={styles.tabsRow}>
              {TABS.map((t, i) => {
                const active = i === tab;
                const complete = done[i].every(Boolean);
                return (
                  <TouchableOpacity
                    key={t.label}
                    activeOpacity={0.85}
                    onPress={() => goTab(i)}
                    style={[styles.tabChip, active && styles.tabChipActive]}
                  >
                    <Text style={styles.tabEmoji}>{t.emoji}</Text>
                    <Text
                      style={[styles.tabText, active && { color: "#FFFFFF" }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {t.label}
                    </Text>
                    {complete && (
                      <Ionicons name="checkmark-circle" size={f(20, 14)} color={active ? "#FFFFFF" : GREEN} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* CONTENT */}
          <View style={styles.content}>
            {tab === 0 && (
              <SentenceWords key={`a${step}`} scale={scale} item={item} done={isDone} onDone={markDone} />
            )}
            {tab === 1 && (
              <SplitWords key={`b${step}`} scale={scale} item={item} done={isDone} onDone={markDone} />
            )}
            {tab === 2 && (
              <WordBaskets key={`c${step}`} scale={scale} item={item} done={isDone} onDone={markDone} />
            )}
          </View>

          {/* BOTTOM NAV */}
          <View style={styles.bottomRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isFirst}
              onPress={goPrev}
              style={[styles.navButton, styles.prevButton, isFirst && styles.navDisabled]}
            >
              <Ionicons name="chevron-back" size={f(22, 18)} color={GREEN} />
              <Text style={[styles.navText, { color: GREEN }]}>පෙර</Text>
            </TouchableOpacity>

            <View style={styles.progressPill}>
              <View style={styles.dots}>
                {SENTENCES.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      i === step && styles.dotActive,
                      { backgroundColor: done[tab][i] ? GREEN : i === step ? "#8FD19E" : "#D9DEE3" },
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.progressText}>
                වාක්‍යය {step + 1} / {total}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={!canGoNext}
              onPress={goNext}
              style={[styles.navButton, styles.nextButton, !canGoNext && styles.navDisabled]}
            >
              <Text style={[styles.navText, { color: "#FFFFFF" }]}>{nextLabel}</Text>
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
  const titleFont = f(28, 16);
  const tabFont = f(19, 12.5);
  const navFont = f(19, 14);

  return StyleSheet.create({
    container: { flex: 1 },
    page: { flex: 1, gap: f(10, 6) },

    header: { height: f(70, 48), flexDirection: "row", alignItems: "center", gap: f(14, 8) },
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
      backgroundColor: "#E9A65C",
      borderWidth: 2,
      borderColor: "#B8742F",
      borderRadius: f(14, 10),
      paddingHorizontal: f(24, 12),
      paddingVertical: f(6, 3),
      transform: [{ rotate: "-1deg" }],
      elevation: 4,
    },
    title: { fontSize: titleFont, lineHeight: titleFont * 1.4, fontWeight: "900", color: NAVY },

    tabsRow: { flex: 1, flexDirection: "row", gap: f(10, 6) },
    tabChip: {
      flex: 1,
      height: f(58, 40),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: f(8, 4),
      paddingHorizontal: f(10, 6),
      borderRadius: f(18, 12),
      backgroundColor: "rgba(255,255,255,0.94)",
      borderWidth: 2,
      borderColor: "#E5E7EB",
      elevation: 3,
    },
    tabChipActive: { backgroundColor: GREEN, borderColor: "#FFFFFF" },
    tabEmoji: { fontSize: f(24, 15) },
    tabText: { flexShrink: 1, fontSize: tabFont, lineHeight: tabFont * 1.4, fontWeight: "900", color: NAVY },

    content: { flex: 1, minHeight: 0 },

    bottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
    navButton: {
      minWidth: f(160, 110),
      height: f(52, 38),
      borderRadius: f(26, 19),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingHorizontal: f(20, 12),
      borderWidth: 3,
      elevation: 4,
    },
    prevButton: { backgroundColor: "#FFFFFF", borderColor: "#CDEFD8" },
    nextButton: { backgroundColor: GREEN, borderColor: "#FFFFFF" },
    navDisabled: { opacity: 0.45 },
    navText: { fontSize: navFont, lineHeight: navFont * 1.4, fontWeight: "900" },

    progressPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: f(14, 8),
      backgroundColor: "rgba(255,255,255,0.95)",
      borderRadius: f(26, 18),
      paddingHorizontal: f(18, 12),
      paddingVertical: f(8, 5),
      elevation: 3,
    },
    dots: { flexDirection: "row", alignItems: "center", gap: f(8, 5) },
    dot: { width: f(13, 8), height: f(13, 8), borderRadius: f(7, 4) },
    dotActive: { width: f(26, 16) },
    progressText: { fontSize: f(17, 12.5), fontWeight: "800", color: NAVY },
  });
}