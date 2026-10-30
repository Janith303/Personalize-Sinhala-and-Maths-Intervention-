import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  ImageSourcePropType,
  LayoutChangeEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import QuestionCard from "../../../../components/sinhala-writing/mahaprana/danumapiriksamu/question";
import QuizResult from "../../../../components/sinhala-writing/mahaprana/danumapiriksamu/result";
import { makeQuiz } from "../../../../components/sinhala-writing/mahaprana/danumapiriksamu/questions";

/* Designed for 1100 x 660, then scaled to fit the real screen */
const DESIGN_WIDTH = 1100;
const DESIGN_HEIGHT = 660;

/* Optional girl picture (transparent PNG), e.g.
   require("../../../../assets/images/sinhala-writing/girl-pointing.png") */
const GIRL_IMAGE: ImageSourcePropType | null =  require("../../../../assets/images/sinhala-writing/girll.png");

const GREEN = "#1F8A3B";
const NAVY = "#1E2440";
const BROWN = "#6B3A12";

export default function DanumaPiriksamu() {
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

  /* ---------- quiz state ---------- */
  const [quiz, setQuiz] = useState(makeQuiz);
  const [answers, setAnswers] = useState<(string | null)[]>(() => quiz.map(() => null));
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = quiz.length;
  const current = quiz[index];
  const answered = answers[index] !== null;
  const isLast = index === total - 1;
  const score = answers.filter((a, i) => a === quiz[i].answer).length;

  const selectAnswer = (option: string) => {
    if (answered) return; // one try only
    const next = [...answers];
    next[index] = option;
    setAnswers(next);
  };

  const goNext = () => {
    if (!answered) return;
    if (isLast) setFinished(true);
    else setIndex(index + 1);
  };

  const restart = () => {
    const fresh = makeQuiz();
    setQuiz(fresh);
    setAnswers(fresh.map(() => null));
    setIndex(0);
    setFinished(false);
  };

  return (
    <ImageBackground
      source={require("../../../../assets/images/sinhala-writing/quizback.png")}
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

            <View style={styles.titleSign}>
              <Text style={styles.trophy}>🏆</Text>
              <View>
                <Text style={styles.headerTitle} numberOfLines={1}>
                  දැනුම පිරික්සමු
                </Text>
                <Text style={styles.headerSub} numberOfLines={1}>
                  මහාප්‍රාණ අකුරු
                </Text>
              </View>
            </View>

            <View style={{ flex: 1 }} />

            {!finished && (
              <View style={styles.progressPill}>
                <View style={styles.progressDots}>
                  {quiz.map((q, i) => {
                    const a = answers[i];
                    const color =
                      a === null
                        ? i === index
                          ? "#8FD19E"
                          : "#D9DEE3"
                        : a === q.answer
                        ? GREEN
                        : "#E53935";
                    return <View key={i} style={[styles.progressDot, { backgroundColor: color }]} />;
                  })}
                </View>
                <Text style={styles.progressText}>
                  {index + 1} / {total}
                </Text>
              </View>
            )}
          </View>

          {/* ================= BODY ================= */}
          {finished ? (
            <View style={styles.resultWrap}>
              <QuizResult
                scale={scale}
                score={score}
                total={total}
                onRetry={restart}
                onHome={() => router.back()}
              />
            </View>
          ) : (
            <View style={styles.body}>
              {/* Left: girl + prev */}
              <View style={styles.leftCol}>
                <View style={styles.girlArea}>
                  {GIRL_IMAGE ? (
                    <Image source={GIRL_IMAGE} style={styles.girlImage} resizeMode="contain" />
                  ) : (
                    <Text style={styles.girlEmoji}>👧🏻</Text>
                  )}
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  disabled={index === 0}
                  onPress={() => setIndex(index - 1)}
                  style={[styles.navButton, styles.prevButton, index === 0 && styles.navDisabled]}
                >
                  <Ionicons name="chevron-back" size={f(24, 18)} color={GREEN} />
                  <Text style={[styles.navText, { color: GREEN }]}>පෙර</Text>
                </TouchableOpacity>
              </View>

              {/* Right: question */}
              <View style={styles.rightCol}>
                <QuestionCard
                  key={index}
                  scale={scale}
                  number={index + 1}
                  question={current}
                  selected={answers[index]}
                  onSelect={selectAnswer}
                  rightSlot={
                    <TouchableOpacity
                      activeOpacity={0.85}
                      disabled={!answered}
                      onPress={goNext}
                      style={[styles.navButton, styles.nextButton, !answered && styles.navDisabled]}
                    >
                      <Text style={[styles.navText, { color: "#FFFFFF" }]}>
                        {isLast ? "අවසන්" : "ඊළඟ"}
                      </Text>
                      <Ionicons name="chevron-forward" size={f(24, 18)} color="#FFFFFF" />
                    </TouchableOpacity>
                  }
                />
              </View>
            </View>
          )}
        </View>
      )}
    </ImageBackground>
  );
}

function createStyles(scale: number) {
  const f = (n: number, min: number) => Math.max(n * scale, min);

  const headerH = f(80, 50);
  const backSize = f(62, 44);
  const titleSize = f(32, 18);
  const subSize = f(17, 12);
  const navFont = f(20, 15);

  return StyleSheet.create({
    container: { flex: 1 },
    page: { flex: 1, gap: f(10, 6) },

    /* ---------- HEADER ---------- */
    header: {
      height: headerH,
      flexDirection: "row",
      alignItems: "center",
      gap: f(14, 10),
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
    titleSign: {
      flexDirection: "row",
      alignItems: "center",
      gap: f(12, 8),
      backgroundColor: "#E9A65C",
      borderWidth: 2,
      borderColor: "#B8742F",
      borderRadius: f(14, 10),
      paddingHorizontal: f(20, 12),
      paddingVertical: f(4, 2),
      transform: [{ rotate: "-1deg" }],
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.18,
      shadowRadius: 4,
    },
    trophy: { fontSize: f(42, 26) },
    headerTitle: {
      fontSize: titleSize,
      lineHeight: titleSize * 1.35,
      fontWeight: "900",
      color: "#FFFFFF",
      textShadowColor: BROWN,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    headerSub: {
      fontSize: subSize,
      lineHeight: subSize * 1.35,
      fontWeight: "800",
      color: BROWN,
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
    progressDot: { width: f(14, 9), height: f(14, 9), borderRadius: f(7, 4.5) },
    progressText: { fontSize: f(20, 14), fontWeight: "800", color: NAVY },

    /* ---------- BODY ---------- */
    body: { flex: 1, minHeight: 0, flexDirection: "row", gap: f(16, 10) },
    leftCol: { width: "25%", alignItems: "flex-start" },
    girlArea: { flex: 1, width: "100%", alignItems: "center", justifyContent: "flex-end" },
    girlImage: { width: "100%", height: "100%" },
    girlEmoji: { fontSize: f(130, 60) },
    rightCol: { flex: 1, minHeight: 0 },
    resultWrap: { flex: 1, minHeight: 0, alignItems: "center", justifyContent: "center" },

    /* ---------- NAV ---------- */
    navButton: {
      minWidth: f(170, 110),
      height: f(56, 38),
      borderRadius: f(28, 19),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: f(8, 5),
      paddingHorizontal: f(22, 14),
      borderWidth: 3,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.18,
      shadowRadius: 4,
    },
    prevButton: { backgroundColor: "#FFFFFF", borderColor: "#CDEFD8" },
    nextButton: { backgroundColor: GREEN, borderColor: "#FFFFFF" },
    navDisabled: { opacity: 0.45 },
    navText: { fontSize: navFont, lineHeight: navFont * 1.4, fontWeight: "900" },
  });
}