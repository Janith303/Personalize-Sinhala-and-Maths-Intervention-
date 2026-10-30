import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { Sentence, COUNT_OPTIONS, WORD_COLORS } from "./sentences";

const GREEN = "#1F8A3B";
const RED = "#E53935";
const NAVY = "#1E2440";
const BROWN = "#6B3A12";

type Props = { scale?: number; item: Sentence; done: boolean; onDone: () => void };

export default function SentenceWords({ scale = 1, item, done, onDone }: Props) {
  const styles = useMemo(() => createStyles(scale), [scale]);
  const f = (n: number, min: number) => Math.max(n * scale, min);
  const player = useAudioPlayer(null);

  const count = item.words.length;
  const [tapped, setTapped] = useState<number[]>(() => (done ? item.words.map((_, i) => i) : []));
  const [wrong, setWrong] = useState<number[]>([]);
  const allTapped = tapped.length === count;

  const tapWord = (i: number) => {
    if (!tapped.includes(i)) setTapped([...tapped, i]);
  };

  const pick = (c: number) => {
    if (done) return;
    if (c === count) onDone();
    else if (!wrong.includes(c)) setWrong([...wrong, c]);
  };

  const playSound = () => {
    if (!item.sound) {
      Alert.alert("ශබ්දය නැත", "මෙම වාක්‍යයේ ශබ්දය තවම එකතු කර නැත.");
      return;
    }
    player.replace(item.sound);
    player.seekTo(0);
    player.play();
  };

  let feedback = "💡 සෑම වචනයක්ම එකින් එක ස්පර්ශ කර ගණන් කරන්න.";
  if (allTapped) feedback = "🤔 දැන් කියන්න, මෙම වාක්‍යයේ වචන කීයද?";
  if (wrong.length > 0) feedback = "💪 නැවත ගණන් කර බලන්න!";
  if (done) feedback = `🎉 නිවැරදියි! මෙම වාක්‍යයේ වචන ${count}ක් ඇත. වචන අතර හිස්තැන් තබන්න.`;

  return (
    <View style={styles.row}>
      {/* LEFT: picture */}
      <View style={styles.pictureCard}>
        <TouchableOpacity activeOpacity={0.85} style={styles.speaker} onPress={playSound}>
          <Ionicons name="volume-high" size={f(30, 20)} color={GREEN} />
        </TouchableOpacity>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.pictureCaption} numberOfLines={1}>🔊 වාක්‍යය අසන්න</Text>
      </View>

      {/* RIGHT: task */}
      <View style={styles.taskCard}>
        <View style={styles.taskLabel}>
          <Text style={styles.taskLabelText} numberOfLines={1} adjustsFontSizeToFit>
            වචන එකින් එක ස්පර්ශ කර ගණන් කරන්න
          </Text>
        </View>

        <View style={styles.wordsRow}>
          {item.words.map((w, i) => {
            const order = tapped.indexOf(i);
            const on = order >= 0;
            const c = WORD_COLORS[i % WORD_COLORS.length];
            const isLast = i === count - 1;
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.85}
                onPress={() => tapWord(i)}
                style={[
                  styles.wordChip,
                  on && { backgroundColor: c.bg, borderColor: c.border },
                ]}
              >
                <Text style={[styles.wordText, on && { color: c.text }]}>
                  {w}
                  {isLast ? "." : ""}
                </Text>
                {on && (
                  <View style={[styles.numBadge, { backgroundColor: c.text }]}>
                    <Text style={styles.numText}>{order + 1}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.questionRow, !allTapped && { opacity: 0.35 }]}>
          <Text style={styles.questionText}>වචන කීයද?</Text>
          {COUNT_OPTIONS.map((c) => {
            const isRight = done && c === count;
            const isWrong = wrong.includes(c);
            return (
              <TouchableOpacity
                key={c}
                activeOpacity={0.85}
                disabled={!allTapped || done}
                onPress={() => pick(c)}
                style={[styles.option, isRight && styles.optionRight, isWrong && styles.optionWrong]}
              >
                <Text
                  style={[styles.optionText, isRight && { color: GREEN }, isWrong && { color: RED }]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.feedback, done && styles.feedbackDone]}>
          <Text style={styles.feedbackText} numberOfLines={2} adjustsFontSizeToFit>
            {feedback}
          </Text>
        </View>
      </View>
    </View>
  );
}

function createStyles(scale: number) {
  const f = (n: number, min: number) => Math.max(n * scale, min);
  const labelFont = f(20, 13.5);
  const wordFont = f(42, 22);
  const qFont = f(24, 15);
  const optFont = f(34, 20);
  const fbFont = f(19, 13);

  const card = {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: f(26, 16),
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  };

  return StyleSheet.create({
    row: { flex: 1, flexDirection: "row", gap: f(18, 10) },

    pictureCard: {
      ...card,
      width: "30%",
      alignItems: "center",
      justifyContent: "center",
      padding: f(14, 8),
    },
    speaker: {
      position: "absolute",
      top: f(12, 8),
      right: f(12, 8),
      width: f(58, 38),
      height: f(58, 38),
      borderRadius: f(29, 19),
      backgroundColor: "#FFFFFF",
      borderWidth: 2,
      borderColor: "#CDEFD8",
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
      zIndex: 2,
    },
    emoji: { fontSize: f(140, 60) },
    pictureCaption: { fontSize: f(17, 12), fontWeight: "800", color: "#6B7280" },

    taskCard: {
      ...card,
      flex: 1,
      marginTop: f(12, 8),
      padding: f(16, 8),
      paddingTop: f(32, 20),
      gap: f(12, 6),
    },
    taskLabel: {
      position: "absolute",
      top: -f(18, 12),
      left: f(20, 12),
      maxWidth: "90%",
      backgroundColor: "#E9A65C",
      borderWidth: 2,
      borderColor: "#B8742F",
      borderRadius: f(10, 8),
      paddingHorizontal: f(22, 12),
      paddingVertical: f(3, 1),
      transform: [{ rotate: "-1deg" }],
      elevation: 4,
      zIndex: 2,
    },
    taskLabelText: { fontSize: labelFont, lineHeight: labelFont * 1.4, fontWeight: "900", color: BROWN },

    wordsRow: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center",
      gap: f(14, 8),
    },
    wordChip: {
      backgroundColor: "#FFFFFF",
      borderWidth: 3,
      borderColor: "#E5E7EB",
      borderStyle: "dashed",
      borderRadius: f(18, 12),
      paddingHorizontal: f(20, 12),
      paddingVertical: f(6, 3),
      elevation: 2,
    },
    wordText: { fontSize: wordFont, lineHeight: wordFont * 1.4, fontWeight: "900", color: NAVY },
    numBadge: {
      position: "absolute",
      top: -f(12, 8),
      right: -f(10, 6),
      width: f(30, 20),
      height: f(30, 20),
      borderRadius: f(15, 10),
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: "#FFFFFF",
    },
    numText: { fontSize: f(16, 11), fontWeight: "900", color: "#FFFFFF" },

    questionRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: f(14, 8) },
    questionText: { fontSize: qFont, lineHeight: qFont * 1.4, fontWeight: "900", color: NAVY },
    option: {
      width: f(68, 42),
      height: f(60, 38),
      borderRadius: f(16, 11),
      backgroundColor: "#FFFFFF",
      borderWidth: 3,
      borderColor: "#E5E7EB",
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
    },
    optionRight: { backgroundColor: "#DCF5E3", borderColor: GREEN },
    optionWrong: { backgroundColor: "#FDE4E4", borderColor: RED },
    optionText: { fontSize: optFont, fontWeight: "900", color: NAVY },

    feedback: {
      backgroundColor: "rgba(255,246,214,0.97)",
      borderWidth: 1.5,
      borderColor: "#FCE7A6",
      borderRadius: f(16, 11),
      paddingHorizontal: f(14, 8),
      paddingVertical: f(8, 4),
    },
    feedbackDone: { backgroundColor: "rgba(220,245,227,0.95)", borderColor: "#A7D7B0" },
    feedbackText: {
      fontSize: fbFont,
      lineHeight: fbFont * 1.5,
      fontWeight: "800",
      color: NAVY,
      textAlign: "center",
    },
  });
}