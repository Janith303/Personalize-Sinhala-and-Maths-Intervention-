import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Sentence, WORD_COLORS, splitLetters } from "./sentences";

const GREEN = "#1F8A3B";
const RED = "#E53935";
const NAVY = "#1E2440";
const BROWN = "#6B3A12";

type Props = { scale?: number; item: Sentence; done: boolean; onDone: () => void };

export default function SplitWords({ scale = 1, item, done, onDone }: Props) {
  const styles = useMemo(() => createStyles(scale), [scale]);

  // letters of the whole sentence, which word each letter belongs to,
  // and the gaps (after letter index) where a space must go
  const { letters, wordOf, cuts } = useMemo(() => {
    const letters: string[] = [];
    const wordOf: number[] = [];
    const cuts: number[] = [];
    item.words.forEach((w, wi) => {
      splitLetters(w).forEach((l) => {
        letters.push(l);
        wordOf.push(wi);
      });
      if (wi < item.words.length - 1) cuts.push(letters.length - 1);
    });
    return { letters, wordOf, cuts };
  }, [item]);

  const [made, setMade] = useState<number[]>(() => (done ? cuts : []));
  const [wrongGap, setWrongGap] = useState<number | null>(null);
  const [misses, setMisses] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const finished = done || made.length === cuts.length;

  const tapGap = (g: number) => {
    if (finished || made.includes(g)) return;
    if (cuts.includes(g)) {
      const next = [...made, g];
      setMade(next);
      if (next.length === cuts.length) onDone();
    } else {
      setWrongGap(g);
      setMisses((m) => m + 1);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setWrongGap(null), 700);
    }
  };

  let feedback = `💡 එක් වචනයක් අවසන් වන තැන ස්පර්ශ කරන්න.  හිස්තැන්: ${made.length} / ${cuts.length}`;
  if (misses > 0 && !finished) feedback = `💪 එතන නොවේ! වචනය කියවා බලන්න.  හිස්තැන්: ${made.length} / ${cuts.length}`;
  if (finished) feedback = "🎉 නියමයි! ලියන විට වචන අතර හිස්තැන් තබන්න.";

  return (
    <View style={styles.row}>
      {/* LEFT: picture */}
      <View style={styles.pictureCard}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>

      {/* RIGHT: task */}
      <View style={styles.taskCard}>
        <View style={styles.taskLabel}>
          <Text style={styles.taskLabelText} numberOfLines={1} adjustsFontSizeToFit>
            වචන අතර හිස්තැන් තිබිය යුතු තැන් ස්පර්ශ කරන්න
          </Text>
        </View>

        <View style={styles.lettersBox}>
          {letters.map((l, i) => {
            const isCut = made.includes(i);
            const isWrong = wrongGap === i;
            const color = finished ? WORD_COLORS[wordOf[i] % WORD_COLORS.length].text : NAVY;
            return (
              <React.Fragment key={i}>
                <Text style={[styles.letter, { color }]}>{l}</Text>
                {i < letters.length - 1 && (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    disabled={finished}
                    onPress={() => tapGap(i)}
                    hitSlop={{ top: 12, bottom: 12 }}
                    style={[styles.gap, isCut && styles.gapCut]}
                  >
                    <View
                      style={[
                        styles.gapLine,
                        isCut && { backgroundColor: GREEN, width: 4 },
                        isWrong && { backgroundColor: RED, width: 4 },
                      ]}
                    />
                  </TouchableOpacity>
                )}
              </React.Fragment>
            );
          })}
          {finished && <Text style={[styles.letter, { color: NAVY }]}>.</Text>}
        </View>

        {finished && (
          <View style={styles.resultRow}>
            {item.words.map((w, i) => {
              const c = WORD_COLORS[i % WORD_COLORS.length];
              return (
                <View key={i} style={[styles.resultChip, { backgroundColor: c.bg, borderColor: c.border }]}>
                  <Text style={[styles.resultText, { color: c.text }]}>
                    {w}
                    {i === item.words.length - 1 ? "." : ""}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <View style={[styles.feedback, finished && styles.feedbackDone]}>
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
  const letterFont = f(48, 25);
  const resultFont = f(26, 16);
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
      width: "22%",
      alignItems: "center",
      justifyContent: "center",
    },
    emoji: { fontSize: f(120, 54) },

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

    lettersBox: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center",
      backgroundColor: "#FFFDF5",
      borderRadius: f(18, 12),
      borderWidth: 2,
      borderColor: "#F3E8C8",
      paddingHorizontal: f(10, 6),
    },
    letter: { fontSize: letterFont, lineHeight: letterFont * 1.4, fontWeight: "900" },
    gap: {
      width: f(22, 14),
      height: letterFont * 1.2,
      alignItems: "center",
      justifyContent: "center",
    },
    gapCut: { width: f(42, 26) },
    gapLine: { width: 2, height: "70%", borderRadius: 2, backgroundColor: "#D5DAE0" },

    resultRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: f(10, 6) },
    resultChip: {
      borderWidth: 2,
      borderRadius: f(14, 10),
      paddingHorizontal: f(16, 10),
      paddingVertical: f(2, 1),
    },
    resultText: { fontSize: resultFont, lineHeight: resultFont * 1.4, fontWeight: "900" },

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