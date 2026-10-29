import React, { ReactNode, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { Question } from "./questions";

const GREEN = "#1F8A3B";
const RED = "#E53935";
const NAVY = "#1E2440";
const BROWN = "#6B3A12";

export default function QuestionCard({
  scale = 1,
  number,
  question,
  selected,
  onSelect,
  rightSlot,
}: {
  scale?: number;
  number: number;
  question: Question;
  selected: string | null;
  onSelect: (option: string) => void;
  rightSlot?: ReactNode;
}) {
  const styles = useMemo(() => createStyles(scale), [scale]);
  const f = (n: number, min: number) => Math.max(n * scale, min);
  const player = useAudioPlayer(null);
  const [showHint, setShowHint] = useState(false);

  const answered = selected !== null;
  const correct = selected === question.answer;
  const wordOptions = question.options.some((o) => o.length > 2);

  const playSound = () => {
    if (!question.sound) {
      Alert.alert("ශබ්දය නැත", "මෙම ප්‍රශ්නයේ ශබ්දය තවම එකතු කර නැත.");
      return;
    }
    player.replace(question.sound);
    player.seekTo(0);
    player.play();
  };

  return (
    <View style={styles.container}>
      {/* ---------- QUESTION CARD ---------- */}
      <View style={styles.card}>
        <View style={styles.cardInner}>
          <View style={styles.numberLabel}>
            <Text style={styles.numberText}>
              ප්‍රශ්නය {String(number).padStart(2, "0")}
            </Text>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.speaker} onPress={playSound}>
            <Ionicons name="volume-high" size={f(30, 20)} color={GREEN} />
          </TouchableOpacity>

          <View style={styles.questionRow}>
            {question.emoji && (
              <View style={styles.pictureBox}>
                <Text style={styles.pictureEmoji}>{question.emoji}</Text>
              </View>
            )}
            <View style={styles.questionTextBox}>
              <Text
                style={[styles.displayText, question.type === "spell" && styles.displayEmoji]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {question.display}
              </Text>
              <Text style={styles.questionText} numberOfLines={2} adjustsFontSizeToFit>
                {question.question}
              </Text>
            </View>
          </View>
        </View>

        {/* ---------- ANSWERS ---------- */}
        <View style={styles.optionsRow}>
          {question.options.map((option) => {
            const isAnswer = option === question.answer;
            const isPicked = option === selected;

            let state: "idle" | "right" | "wrong" | "dim" = "idle";
            if (answered) {
              if (isAnswer) state = "right";
              else if (isPicked) state = "wrong";
              else state = "dim";
            }

            return (
              <TouchableOpacity
                key={option}
                activeOpacity={0.85}
                disabled={answered}
                onPress={() => onSelect(option)}
                style={[
                  styles.option,
                  state === "right" && styles.optionRight,
                  state === "wrong" && styles.optionWrong,
                  state === "dim" && styles.optionDim,
                ]}
              >
                <Text
                  style={[
                    wordOptions ? styles.optionWord : styles.optionLetter,
                    state === "right" && { color: GREEN },
                    state === "wrong" && { color: RED },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {option}
                </Text>

                {state === "right" && (
                  <View style={[styles.badge, { backgroundColor: GREEN }]}>
                    <Ionicons name="checkmark" size={f(18, 12)} color="#FFFFFF" />
                  </View>
                )}
                {state === "wrong" && (
                  <View style={[styles.badge, { backgroundColor: RED }]}>
                    <Ionicons name="close" size={f(18, 12)} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ---------- TIP / FEEDBACK + NEXT ---------- */}
      <View style={styles.bottomRow}>
        <View
          style={[
            styles.tipBox,
            answered && (correct ? styles.tipRight : styles.tipWrong),
          ]}
        >
          <Text style={styles.tipEmoji}>{answered ? (correct ? "🎉" : "💪") : "💡"}</Text>

          <View style={{ flex: 1 }}>
            {answered ? (
              <Text style={styles.feedbackText} numberOfLines={2} adjustsFontSizeToFit>
                {correct
                  ? "නිවැරදියි! ඉතා හොඳයි!"
                  : `වැරදියි. නිවැරදි පිළිතුර: ${question.answer}`}
              </Text>
            ) : showHint ? (
              <>
                <View style={styles.hintChip}>
                  <Text style={styles.hintChipText}>ඉඟිය</Text>
                </View>
                <Text style={styles.tipText} numberOfLines={1} adjustsFontSizeToFit>
                  {question.hint}
                </Text>
              </>
            ) : (
              <TouchableOpacity activeOpacity={0.85} onPress={() => setShowHint(true)} style={styles.hintButton}>
                <Text style={styles.hintButtonText}>ඉඟිය බලන්න</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {rightSlot}
      </View>
    </View>
  );
}

function createStyles(scale: number) {
  const f = (n: number, min: number) => Math.max(n * scale, min);

  const labelFont = f(20, 13.5);
  const displayFont = f(64, 32);
  const questionFont = f(22, 13.5);
  const optionH = f(110, 54);
  const tipFont = f(17, 12.5);

  return StyleSheet.create({
    container: { flex: 1, gap: f(10, 6) },

    /* ---------- CARD ---------- */
    card: {
      flex: 1,
      minHeight: 0,
      backgroundColor: "rgba(255,255,255,0.95)",
      borderRadius: f(28, 18),
      padding: f(16, 8),
      gap: f(14, 8),
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
    },
    cardInner: {
      flex: 1,
      minHeight: 0,
      backgroundColor: "#FFFCF2",
      borderRadius: f(22, 14),
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: "#F2D48A",
      justifyContent: "center",
      paddingHorizontal: f(20, 12),
      paddingTop: f(34, 22),
      paddingBottom: f(10, 6),
    },
    numberLabel: {
      position: "absolute",
      top: -f(12, 8),
      left: f(20, 12),
      backgroundColor: "#E9A65C",
      borderWidth: 2,
      borderColor: "#B8742F",
      borderRadius: f(10, 8),
      paddingHorizontal: f(28, 14),
      paddingVertical: f(4, 1),
      transform: [{ rotate: "-2deg" }],
      elevation: 4,
      zIndex: 2,
    },
    numberText: {
      fontSize: labelFont,
      lineHeight: labelFont * 1.4,
      fontWeight: "900",
      color: BROWN,
    },
    speaker: {
      position: "absolute",
      top: f(14, 8),
      right: f(14, 8),
      width: f(64, 40),
      height: f(64, 40),
      borderRadius: f(32, 20),
      backgroundColor: "#FFFFFF",
      borderWidth: 2,
      borderColor: "#CDEFD8",
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
      zIndex: 2,
    },
    questionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: f(20, 12),
    },
    pictureBox: {
      width: f(170, 70),
      alignItems: "center",
      justifyContent: "center",
    },
    pictureEmoji: { fontSize: f(96, 42) },
    questionTextBox: { flex: 1, alignItems: "center", paddingRight: f(50, 34) },
    displayText: {
      fontSize: displayFont,
      lineHeight: displayFont * 1.3,
      fontWeight: "900",
      color: NAVY,
      letterSpacing: 2,
    },
    displayEmoji: { fontSize: displayFont * 1.2 },
    questionText: {
      fontSize: questionFont,
      lineHeight: questionFont * 1.45,
      fontWeight: "700",
      color: NAVY,
      textAlign: "center",
    },

    /* ---------- OPTIONS ---------- */
    optionsRow: {
      height: optionH,
      flexDirection: "row",
      gap: f(18, 10),
    },
    option: {
      flex: 1,
      backgroundColor: "#FFFFFF",
      borderRadius: f(20, 14),
      borderWidth: 3,
      borderColor: "#EEF0F2",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 6,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    optionRight: { backgroundColor: "#DCF5E3", borderColor: GREEN },
    optionWrong: { backgroundColor: "#FDE4E4", borderColor: RED },
    optionDim: { opacity: 0.5 },
    optionLetter: {
      fontSize: optionH * 0.5,
      lineHeight: optionH * 0.68,
      fontWeight: "900",
      color: NAVY,
    },
    optionWord: {
      fontSize: optionH * 0.28,
      lineHeight: optionH * 0.42,
      fontWeight: "900",
      color: NAVY,
    },
    badge: {
      position: "absolute",
      top: f(8, 5),
      right: f(8, 5),
      width: f(28, 18),
      height: f(28, 18),
      borderRadius: f(14, 9),
      alignItems: "center",
      justifyContent: "center",
    },

    /* ---------- TIP + NEXT ---------- */
    bottomRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: f(16, 10),
    },
    tipBox: {
      flex: 1,
      minHeight: f(76, 44),
      flexDirection: "row",
      alignItems: "center",
      gap: f(14, 10),
      backgroundColor: "rgba(255,246,214,0.97)",
      borderWidth: 1.5,
      borderColor: "#FCE7A6",
      borderRadius: f(20, 14),
      paddingHorizontal: f(16, 10),
      paddingVertical: f(6, 4),
    },
    tipRight: { backgroundColor: "rgba(220,245,227,0.97)", borderColor: "#A7D7B0" },
    tipWrong: { backgroundColor: "rgba(253,228,228,0.97)", borderColor: "#F5B5B5" },
    tipEmoji: { fontSize: f(34, 22) },
    hintChip: {
      alignSelf: "flex-start",
      backgroundColor: "#FFD966",
      borderRadius: f(10, 8),
      paddingHorizontal: f(12, 8),
    },
    hintChipText: {
      fontSize: tipFont * 0.9,
      lineHeight: tipFont * 1.3,
      fontWeight: "900",
      color: BROWN,
    },
    tipText: {
      fontSize: tipFont,
      lineHeight: tipFont * 1.45,
      fontWeight: "600",
      color: "#374151",
    },
    hintButton: {
      alignSelf: "flex-start",
      backgroundColor: "#FFD966",
      borderRadius: f(14, 10),
      paddingHorizontal: f(18, 12),
      paddingVertical: f(6, 4),
    },
    hintButtonText: {
      fontSize: tipFont,
      lineHeight: tipFont * 1.4,
      fontWeight: "900",
      color: BROWN,
    },
    feedbackText: {
      fontSize: tipFont * 1.1,
      lineHeight: tipFont * 1.6,
      fontWeight: "900",
      color: NAVY,
    },
  });
}