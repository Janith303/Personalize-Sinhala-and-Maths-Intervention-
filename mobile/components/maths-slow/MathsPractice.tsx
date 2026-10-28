import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  LayoutChangeEvent,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  generateQuestions,
  getHint,
  MathsOperation,
  OPERATION_SYMBOL,
  Question,
} from "./questionGenerator";
import { MathsAttemptPayload, sendMathsAttempt } from "./mathsSlowApi";

type Theme = {
  title: string;
  accent: string; // operator, question border, answer box, check button
  accentDark: string;
  first: string; // first number colour
  second: string; // second number colour
  equals: string;
  panelBorder: string;
};

const THEMES: Record<MathsOperation, Theme> = {
  addition: {
    title: "එකතු කිරීම",
    accent: "#22A447",
    accentDark: "#17803A",
    first: "#6D28D9",
    second: "#1D5FE0",
    equals: "#22A447",
    panelBorder: "#A9DDA9",
  },
  subtraction: {
    title: "අඩු කිරීම",
    accent: "#EF4A5B",
    accentDark: "#C42A3C",
    first: "#6D28D9",
    second: "#1D5FE0",
    equals: "#EF4A5B",
    panelBorder: "#8FD48C",
  },
  multiplication: {
    title: "ගුණ කිරීම",
    accent: "#1E88E5",
    accentDark: "#1565C0",
    first: "#6D28D9",
    second: "#6D28D9",
    equals: "#22A447",
    panelBorder: "#BFE0F7",
  },
  division: {
    title: "බෙදීම",
    accent: "#FF9A1A",
    accentDark: "#D97706",
    first: "#6D28D9",
    second: "#6D28D9",
    equals: "#22A447",
    panelBorder: "#F5C877",
  },
};

/** Column operations: answer is typed from the ones place (right to left). */
const RIGHT_TO_LEFT: MathsOperation[] = ["addition", "subtraction"];
const MAX_DIGITS = 3;
const KEY_ROWS = [
  ["1", "2", "3", "4", "5"],
  ["6", "7", "8", "9", "0"],
];

type Entry = { digit: string; at: number };

type Props = {
  operation: MathsOperation;
  background: ImageSourcePropType;
  totalQuestions?: number;
  studentId?: string | null;
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);
const round2 = (n: number) => Math.round(n * 100) / 100;
const formatTime = (sec: number) =>
  `${String(Math.floor(sec / 60)).padStart(2, "0")} : ${String(sec % 60).padStart(2, "0")}`;

export default function MathsPractice({
  operation,
  background,
  totalQuestions = 10,
  studentId = null,
}: Props) {
  const theme = THEMES[operation];
  const symbol = OPERATION_SYMBOL[operation];
  const rightToLeft = RIGHT_TO_LEFT.includes(operation);
  const insets = useSafeAreaInsets();

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [questions, setQuestions] = useState<Question[]>(() =>
    generateQuestions(operation, totalQuestions)
  );
  const [qIndex, setQIndex] = useState(0);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [eraseCount, setEraseCount] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [hintText, setHintText] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [feedback, setFeedback] = useState<{ correct: boolean; answer: number } | null>(null);
  const [results, setResults] = useState<MathsAttemptPayload[]>([]);
  const [finished, setFinished] = useState(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const startRef = useRef(Date.now());
  const sessionId = useRef(`${operation}-${Date.now()}`).current;
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const q = questions[qIndex];
  const locked = !!feedback || finished;
  const answerText = (rightToLeft ? [...entries].reverse() : entries)
    .map((e) => e.digit)
    .join("");

  /* ---------- Timer ---------- */
  useEffect(() => {
    if (!running) return;
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)),
      250
    );
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  const later = (fn: () => void, ms: number) => {
    timeouts.current.push(setTimeout(fn, ms));
  };

  const startQuestion = () => {
    setEntries([]);
    setEraseCount(0);
    setHintCount(0);
    setHintText(null);
    startRef.current = Date.now();
    setElapsed(0);
    setRunning(true);
  };

  /* ---------- Buttons ---------- */
  const pressDigit = (d: string) => {
    if (locked || entries.length >= MAX_DIGITS) return;
    setEntries((prev) => [...prev, { digit: d, at: Date.now() }]);
  };

  const pressErase = () => {
    if (locked || entries.length === 0) return;
    setEraseCount((c) => c + 1);
    setEntries((prev) => prev.slice(0, -1));
  };

  const pressHint = () => {
    if (locked) return;
    setHintCount((c) => c + 1);
    setHintText(getHint(q));
  };

  const pressCheck = () => {
    if (locked || entries.length === 0) return;

    const now = Date.now();
    const studentAnswer = parseInt(answerText, 10);
    const isCorrect = studentAnswer === q.answer;
    const carryOverTime =
      q.hasCarry && entries.length >= 2 ? (entries[1].at - entries[0].at) / 1000 : 0;

    const payload: MathsAttemptPayload = {
      student_id: studentId,
      session_id: sessionId,
      question_no: qIndex + 1,
      question_type: operation,
      question: `${q.a} ${symbol} ${q.b}`,
      operand_a: q.a,
      operand_b: q.b,
      correct_answer: q.answer,
      student_answer: studentAnswer,
      is_correct: isCorrect,
      total_time: round2((now - startRef.current) / 1000),
      erase_count: eraseCount,
      hint_count: hintCount,
      has_carry: q.hasCarry,
      carry_over_time: round2(carryOverTime),
      created_at: new Date(now).toISOString(),
    };

    setRunning(false);
    setElapsed(Math.floor((now - startRef.current) / 1000));
    setResults((prev) => [...prev, payload]);
    setFeedback({ correct: isCorrect, answer: q.answer });
    sendMathsAttempt(payload);

    later(() => {
      setFeedback(null);
      if (qIndex + 1 >= questions.length) {
        setFinished(true);
      } else {
        setQIndex((i) => i + 1);
        startQuestion();
      }
    }, isCorrect ? 1200 : 2200);
  };

  const restart = () => {
    setQuestions(generateQuestions(operation, totalQuestions));
    setQIndex(0);
    setResults([]);
    setFinished(false);
    startQuestion();
  };

  /* ---------- Fit-to-screen sizing ---------- */
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  const { w: width, h: height } = size;
  const pad = clamp(Math.min(width, height) * 0.035, 8, 24);
  const usableW = width - insets.left - insets.right - pad * 2;
  const usableH = height - insets.top - insets.bottom - pad * 2;

  const topH = clamp(usableH * 0.15, 40, 84);
  const gap = clamp(usableH * 0.03, 6, 18);
  const panelH = usableH - topH - gap;
  const panelW = clamp(Math.min(usableW * 0.64, panelH * 1.75), 300, 1000);
  const panelPad = clamp(panelH * 0.045, 8, 24);
  const innerH = panelH - panelPad * 2;
  const innerGap = clamp(innerH * 0.04, 6, 16);

  const toolsH = innerH * 0.18;
  const questionH = innerH * 0.36;
  const keypadH = innerH - toolsH - questionH - innerGap * 2;
  const keyGap = clamp(keypadH * 0.07, 5, 14);
  const keyH = (keypadH - keyGap) / 2;
  const checkW = clamp(panelW * 0.16, 56, 170);

  const toolFont = clamp(toolsH * 0.32, 11, 30);
  const toolIcon = clamp(toolsH * 0.55, 18, 52);
  const qFont = clamp(questionH * 0.42, 22, 96);
  const keyFont = clamp(keyH * 0.45, 14, 44);
  const backSize = clamp(topH * 0.95, 38, 64);
  const signFont = clamp(topH * 0.42, 16, 36);
  const progressW = clamp(usableW * 0.32, 150, 420);

  const done = finished ? questions.length : qIndex;
  const score = results.filter((r) => r.is_correct).length;
  const totalTime = Math.round(results.reduce((s, r) => s + r.total_time, 0));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground
        source={background}
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
                gap,
              },
            ]}
          >
            {/* ================= TOP BAR ================= */}
            <View style={[styles.topBar, { height: topH, gap: pad }]}>
              <Pressable
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel="ආපසු"
                style={[
                  styles.backButton,
                  { width: backSize, height: backSize, borderRadius: backSize / 2 },
                ]}
              >
                <Ionicons name="arrow-back" size={backSize * 0.55} color="#2E9E4F" />
              </Pressable>

              <View
                style={[
                  styles.sign,
                  {
                    height: topH * 0.92,
                    paddingHorizontal: signFont * 1.2,
                    borderRadius: topH * 0.2,
                  },
                ]}
              >
                <Ionicons
                  name="leaf"
                  size={topH * 0.38}
                  color="#4CAF50"
                  style={{ position: "absolute", left: -topH * 0.12, top: -topH * 0.12, transform: [{ rotate: "-35deg" }] }}
                />
                <Text style={[styles.signText, { fontSize: signFont, lineHeight: signFont * 1.45 }]}>
                  {theme.title}
                </Text>
              </View>

              <View style={{ flex: 1 }} />

              <View
                style={[
                  styles.progressWrap,
                  { width: progressW, height: topH * 0.62, borderRadius: topH * 0.31 },
                ]}
              >
                <View style={[styles.progressTrack, { height: topH * 0.26, borderRadius: topH * 0.13 }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(done / questions.length) * 100}%`, borderRadius: topH * 0.13 },
                    ]}
                  />
                </View>
                <View style={[styles.progressPill, { borderRadius: topH * 0.25 }]}>
                  <Text style={[styles.progressText, { fontSize: clamp(topH * 0.3, 12, 26) }]}>
                    {Math.min(qIndex + 1, questions.length)} / {questions.length}
                  </Text>
                </View>
              </View>
            </View>

            {/* ================= PANEL (right side, kid stays visible on left) ================= */}
            <View style={styles.panelRow}>
              <View
                style={[
                  styles.panel,
                  {
                    width: panelW,
                    height: panelH,
                    padding: panelPad,
                    gap: innerGap,
                    borderRadius: clamp(panelW * 0.04, 16, 36),
                    borderColor: theme.panelBorder,
                  },
                ]}
              >
                {/* ---------- Timer / Hint / Erase ---------- */}
                <View style={[styles.toolsRow, { height: toolsH, gap: innerGap }]}>
                  <View style={[styles.tool, styles.toolTimer, { flex: 1.15, borderRadius: toolsH * 0.25 }]}>
                    <MaterialCommunityIcons name="alarm" size={toolIcon} color="#E53935" />
                    <Text style={[styles.timerText, { fontSize: toolFont * 1.25 }]}>
                      {formatTime(elapsed)}
                    </Text>
                  </View>

                  <Pressable
                    onPress={pressHint}
                    onPressIn={() => setPressedKey("hint")}
                    onPressOut={() => setPressedKey(null)}
                    accessibilityRole="button"
                    accessibilityLabel="ඉඟිය"
                    style={[
                      styles.tool,
                      styles.toolHint,
                      { flex: 1, borderRadius: toolsH * 0.25, transform: [{ scale: pressedKey === "hint" ? 0.95 : 1 }] },
                    ]}
                  >
                    <MaterialCommunityIcons name="lightbulb-on" size={toolIcon} color="#F5B400" />
                    <Text style={[styles.toolText, { fontSize: toolFont }]}>ඉඟිය</Text>
                  </Pressable>

                  <Pressable
                    onPress={pressErase}
                    onPressIn={() => setPressedKey("erase")}
                    onPressOut={() => setPressedKey(null)}
                    accessibilityRole="button"
                    accessibilityLabel="මකන්න"
                    style={[
                      styles.tool,
                      styles.toolErase,
                      { flex: 1, borderRadius: toolsH * 0.25, transform: [{ scale: pressedKey === "erase" ? 0.95 : 1 }] },
                    ]}
                  >
                    <MaterialCommunityIcons name="eraser" size={toolIcon} color="#C026D3" />
                    <Text style={[styles.toolText, { fontSize: toolFont }]}>මකන්න</Text>
                  </Pressable>
                </View>

                {/* ---------- Question ---------- */}
                <View
                  style={[
                    styles.questionCard,
                    { height: questionH, borderColor: theme.accent, borderRadius: questionH * 0.16 },
                  ]}
                >
                  <View style={[styles.equationRow, { gap: qFont * 0.35, marginBottom: questionH * 0.12 }]}>
                    <Text style={[styles.eqText, { fontSize: qFont, color: theme.first }]}>{q.a}</Text>
                    <Text style={[styles.eqText, { fontSize: qFont, color: theme.accent }]}>{symbol}</Text>
                    <Text style={[styles.eqText, { fontSize: qFont, color: theme.second }]}>{q.b}</Text>
                    <Text style={[styles.eqText, { fontSize: qFont, color: theme.equals }]}>=</Text>
                    <View
                      style={[
                        styles.answerBox,
                        {
                          width: qFont * 2.2,
                          height: qFont * 1.4,
                          borderRadius: qFont * 0.25,
                          borderColor: theme.accent,
                        },
                      ]}
                    >
                      <Text style={[styles.eqText, { fontSize: qFont * 0.9, color: "#1F2937" }]}>
                        {answerText}
                      </Text>
                    </View>
                  </View>

                  {hintText ? (
                    <View style={[styles.hintBanner, { borderRadius: questionH * 0.08 }]}>
                      <MaterialCommunityIcons name="lightbulb-on" size={qFont * 0.32} color="#F5B400" />
                      <Text
                        numberOfLines={2}
                        adjustsFontSizeToFit
                        style={[styles.hintText, { fontSize: clamp(qFont * 0.22, 10, 20) }]}
                      >
                        {hintText}
                      </Text>
                    </View>
                  ) : rightToLeft ? (
                    <Text style={[styles.caption, { fontSize: clamp(qFont * 0.2, 10, 18) }]}>
                      ← ඒකක ස්ථානයේ සිට ලියන්න
                    </Text>
                  ) : null}
                </View>

                {/* ---------- Keypad + Check ---------- */}
                <View style={[styles.keypadRow, { height: keypadH, gap: keyGap }]}>
                  <View style={{ flex: 1, gap: keyGap }}>
                    {KEY_ROWS.map((row, r) => (
                      <View key={r} style={{ flex: 1, flexDirection: "row", gap: keyGap }}>
                        {row.map((d) => (
                          <Pressable
                            key={d}
                            onPress={() => pressDigit(d)}
                            onPressIn={() => setPressedKey(d)}
                            onPressOut={() => setPressedKey(null)}
                            accessibilityRole="button"
                            accessibilityLabel={d}
                            style={[
                              styles.key,
                              {
                                borderRadius: keyH * 0.22,
                                backgroundColor: pressedKey === d ? "#EEF2F7" : "#FFFFFF",
                                transform: [{ scale: pressedKey === d ? 0.94 : 1 }],
                              },
                            ]}
                          >
                            <Text style={[styles.keyText, { fontSize: keyFont }]}>{d}</Text>
                          </Pressable>
                        ))}
                      </View>
                    ))}
                  </View>

                  <Pressable
                    onPress={pressCheck}
                    onPressIn={() => setPressedKey("check")}
                    onPressOut={() => setPressedKey(null)}
                    accessibilityRole="button"
                    accessibilityLabel="පරීක්ෂා කරන්න"
                    style={[
                      styles.checkButton,
                      {
                        width: checkW,
                        borderRadius: keyH * 0.25,
                        backgroundColor: theme.accent,
                        borderBottomColor: theme.accentDark,
                        opacity: entries.length === 0 ? 0.6 : 1,
                        transform: [{ scale: pressedKey === "check" ? 0.95 : 1 }],
                      },
                    ]}
                  >
                    <Ionicons name="checkmark-sharp" size={checkW * 0.55} color="#FFFFFF" />
                  </Pressable>
                </View>

                {/* ---------- Correct / wrong feedback ---------- */}
                {feedback && (
                  <View style={[styles.overlay, { borderRadius: clamp(panelW * 0.04, 16, 36) }]}>
                    <View
                      style={[
                        styles.feedbackCircle,
                        {
                          width: panelH * 0.3,
                          height: panelH * 0.3,
                          borderRadius: panelH * 0.15,
                          backgroundColor: feedback.correct ? "#22A447" : "#EF4A5B",
                        },
                      ]}
                    >
                      <Ionicons
                        name={feedback.correct ? "checkmark-sharp" : "close-sharp"}
                        size={panelH * 0.2}
                        color="#FFFFFF"
                      />
                    </View>
                    <Text style={[styles.feedbackTitle, { fontSize: clamp(panelH * 0.09, 18, 44) }]}>
                      {feedback.correct ? "නියමයි!" : "නැවත උත්සාහ කරමු!"}
                    </Text>
                    {!feedback.correct && (
                      <Text style={[styles.feedbackSub, { fontSize: clamp(panelH * 0.06, 14, 30) }]}>
                        නිවැරදි පිළිතුර: {q.a} {symbol} {q.b} = {feedback.answer}
                      </Text>
                    )}
                  </View>
                )}

                {/* ---------- Finished ---------- */}
                {finished && (
                  <View style={[styles.overlay, { borderRadius: clamp(panelW * 0.04, 16, 36), gap: panelH * 0.03 }]}>
                    <MaterialCommunityIcons name="trophy" size={panelH * 0.25} color="#F5B400" />
                    <Text style={[styles.feedbackTitle, { fontSize: clamp(panelH * 0.08, 18, 40) }]}>
                      හොඳයි! ඔබ අවසන් කළා
                    </Text>
                    <Text style={[styles.feedbackSub, { fontSize: clamp(panelH * 0.065, 14, 32) }]}>
                      ලකුණු: {score} / {questions.length}   ·   කාලය: {formatTime(totalTime)}
                    </Text>
                    <View style={{ flexDirection: "row", gap: panelPad, marginTop: panelH * 0.02 }}>
                      <Pressable
                        onPress={restart}
                        style={[styles.endButton, { backgroundColor: theme.accent, paddingHorizontal: panelPad * 1.4, paddingVertical: panelH * 0.03 }]}
                      >
                        <Ionicons name="refresh" size={clamp(panelH * 0.06, 16, 30)} color="#FFF" />
                        <Text style={[styles.endButtonText, { fontSize: clamp(panelH * 0.055, 13, 26) }]}>නැවත කරමු</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => router.back()}
                        style={[styles.endButton, { backgroundColor: "#6B7280", paddingHorizontal: panelPad * 1.4, paddingVertical: panelH * 0.03 }]}
                      >
                        <Ionicons name="home" size={clamp(panelH * 0.06, 16, 30)} color="#FFF" />
                        <Text style={[styles.endButtonText, { fontSize: clamp(panelH * 0.055, 13, 26) }]}>ආපසු</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      </ImageBackground>
    </>
  );
}

const shadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 5,
  elevation: 4,
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* Top bar */
  topBar: { flexDirection: "row", alignItems: "center" },
  backButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#2E9E4F",
    justifyContent: "center",
    alignItems: "center",
    ...shadow,
  },
  sign: {
    backgroundColor: "#F3D9A6",
    borderWidth: 4,
    borderColor: "#C98A3E",
    justifyContent: "center",
    alignItems: "center",
    ...shadow,
  },
  signText: { fontWeight: "900", color: "#3B1F0B" },
  progressWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingLeft: 10,
    paddingRight: 4,
    gap: 8,
    ...shadow,
  },
  progressTrack: { flex: 1, backgroundColor: "#E5E7EB", overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#22A447" },
  progressPill: { backgroundColor: "#FFFFFF", paddingHorizontal: 12, paddingVertical: 2 },
  progressText: { fontWeight: "900", color: "#1F2937" },

  /* Panel */
  panelRow: { flex: 1, alignItems: "flex-end", justifyContent: "flex-start" },
  panel: {
    backgroundColor: "rgba(255,251,240,0.96)",
    borderWidth: 4,
    ...shadow,
    elevation: 6,
  },

  /* Tools */
  toolsRow: { flexDirection: "row" },
  tool: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    ...shadow,
    elevation: 2,
  },
  toolTimer: { backgroundColor: "#FFF4D6", borderColor: "#F3DFA8" },
  toolHint: { backgroundColor: "#FFEFB0", borderColor: "#F5D96B" },
  toolErase: { backgroundColor: "#FFD9E0", borderColor: "#F5B3C2" },
  timerText: { fontWeight: "900", color: "#3B1F0B", fontVariant: ["tabular-nums"] },
  toolText: { fontWeight: "900", color: "#3B1F0B" },

  /* Question */
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  equationRow: { flexDirection: "row", alignItems: "center" },
  eqText: { fontWeight: "900" },
  answerBox: {
    borderWidth: 4,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  caption: {
    position: "absolute",
    bottom: 6,
    fontWeight: "700",
    color: "#6B7280",
  },
  hintBanner: {
    position: "absolute",
    bottom: 6,
    left: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF7D1",
    borderWidth: 1.5,
    borderColor: "#F5D96B",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  hintText: { flex: 1, fontWeight: "800", color: "#5B3A00" },

  /* Keypad */
  keypadRow: { flexDirection: "row" },
  key: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...shadow,
    elevation: 3,
  },
  keyText: { fontWeight: "900", color: "#1F2937" },
  checkButton: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 6,
    ...shadow,
    elevation: 5,
  },

  /* Overlays */
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.94)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
    elevation: 10,
  },
  feedbackCircle: { justifyContent: "center", alignItems: "center", ...shadow },
  feedbackTitle: { marginTop: 10, fontWeight: "900", color: "#1F2937", textAlign: "center" },
  feedbackSub: { marginTop: 4, fontWeight: "800", color: "#374151", textAlign: "center" },
  endButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 16,
    ...shadow,
  },
  endButtonText: { fontWeight: "900", color: "#FFFFFF" },
});