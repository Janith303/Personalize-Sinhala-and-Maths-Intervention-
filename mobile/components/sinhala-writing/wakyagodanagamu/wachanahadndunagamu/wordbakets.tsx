import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Sentence, WordKind } from "./sentences";

const GREEN = "#1F8A3B";
const RED = "#E53935";
const NAVY = "#1E2440";
const BROWN = "#6B3A12";
const ORANGE = "#C2410C";

const BASKETS: { kind: WordKind; title: string; sub: string; emoji: string; bg: string; border: string; text: string }[] = [
  {
    kind: "name",
    title: "කවුද? / මොකක්ද?",
    sub: "නම් කරන වචන",
    emoji: "👤",
    bg: "#E2F0FD",
    border: "#93C5FD",
    text: "#1D4ED8",
  },
  {
    kind: "action",
    title: "මොකද කරන්නේ?",
    sub: "ක්‍රියා වචන",
    emoji: "🏃",
    bg: "#FFEBD9",
    border: "#FDBA74",
    text: ORANGE,
  },
];

type Props = { scale?: number; item: Sentence; done: boolean; onDone: () => void };

export default function WordBaskets({ scale = 1, item, done, onDone }: Props) {
  const styles = useMemo(() => createStyles(scale), [scale]);

  const [placed, setPlaced] = useState<(WordKind | null)[]>(() =>
    done ? [...item.kinds] : item.words.map(() => null)
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number | null>(null);
  const [tip, setTip] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const finished = done || placed.every((p) => p !== null);
  const verb = item.words[item.kinds.indexOf("action")];

  const tapCard = (i: number) => {
    if (placed[i]) return;
    setSelected(i);
    setTip(null);
  };

  const tapBasket = (kind: WordKind) => {
    if (finished) return;
    if (selected === null) {
      setTip("👆 මුලින්ම උඩ ඇති වචනයක් තෝරන්න.");
      return;
    }
    if (item.kinds[selected] === kind) {
      const next = [...placed];
      next[selected] = kind;
      setPlaced(next);
      setSelected(null);
      setTip(null);
      if (next.every((p) => p !== null)) onDone();
    } else {
      setWrong(selected);
      setTip(
        kind === "action"
          ? "🤔 මෙය කරන දෙයක් නොවේ. එය කවුද / මොකක්ද කියා බලන්න."
          : "🤔 මෙය කෙනෙක් කරන දෙයක්. 'මොකද කරන්නේ?' බලන්න."
      );
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setWrong(null), 700);
    }
  };

  return (
    <View style={styles.wrap}>
      {/* TOP: picture + sentence */}
      <View style={styles.sentenceStrip}>
        <Text style={styles.stripEmoji}>{item.emoji}</Text>
        <Text style={styles.sentence} numberOfLines={1} adjustsFontSizeToFit>
          {item.words.map((w, i) => (
            <Text key={i} style={finished && item.kinds[i] === "action" ? { color: ORANGE } : undefined}>
              {w}
              {i === item.words.length - 1 ? "." : " "}
            </Text>
          ))}
        </Text>
      </View>

      {/* MIDDLE: word cards or success */}
      <View style={styles.tray}>
        {finished ? (
          <View style={styles.doneBox}>
            <Text style={styles.doneText} numberOfLines={2} adjustsFontSizeToFit>
              🎉 හරි! "{verb}" ක්‍රියා වචනයයි. ක්‍රියා වචනය වාක්‍යයේ අගට එයි.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.cardsRow}>
              {item.words.map((w, i) => {
                if (placed[i]) return <View key={i} style={[styles.card, styles.cardGhost]} />;
                const isSel = selected === i;
                const isWrong = wrong === i;
                return (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.85}
                    onPress={() => tapCard(i)}
                    style={[styles.card, isSel && styles.cardSelected, isWrong && styles.cardWrong]}
                  >
                    <Text style={[styles.cardText, isWrong && { color: RED }]}>{w}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.tipText} numberOfLines={1} adjustsFontSizeToFit>
              {tip ?? "💡 වචනයක් තෝරා, එය අයත් කූඩය ස්පර්ශ කරන්න."}
            </Text>
          </>
        )}
      </View>

      {/* BOTTOM: baskets */}
      <View style={styles.basketsRow}>
        {BASKETS.map((b) => (
          <TouchableOpacity
            key={b.kind}
            activeOpacity={0.85}
            disabled={finished}
            onPress={() => tapBasket(b.kind)}
            style={[
              styles.basket,
              { backgroundColor: b.bg, borderColor: b.border },
              selected !== null && !finished && styles.basketReady,
            ]}
          >
            <View style={styles.basketHead}>
              <Text style={styles.basketEmoji}>{b.emoji}</Text>
              <View style={{ flexShrink: 1 }}>
                <Text style={[styles.basketTitle, { color: b.text }]} numberOfLines={1} adjustsFontSizeToFit>
                  {b.title}
                </Text>
                <Text style={styles.basketSub} numberOfLines={1}>{b.sub}</Text>
              </View>
            </View>

            <View style={styles.basketBody}>
              {item.words.map((w, i) =>
                placed[i] === b.kind ? (
                  <View key={i} style={[styles.placedChip, { borderColor: b.border }]}>
                    <Text style={[styles.placedText, { color: b.text }]}>{w}</Text>
                  </View>
                ) : null
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function createStyles(scale: number) {
  const f = (n: number, min: number) => Math.max(n * scale, min);
  const sentenceFont = f(34, 19);
  const cardFont = f(34, 19);
  const tipFont = f(18, 12.5);
  const titleFont = f(24, 15);
  const subFont = f(15, 11);
  const placedFont = f(26, 16);
  const doneFont = f(22, 14.5);

  const card = {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: f(22, 14),
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  };

  return StyleSheet.create({
    wrap: { flex: 1, gap: f(12, 6) },

    sentenceStrip: {
      ...card,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: f(16, 10),
      paddingHorizontal: f(20, 12),
      paddingVertical: f(6, 3),
    },
    stripEmoji: { fontSize: f(48, 28) },
    sentence: { flexShrink: 1, fontSize: sentenceFont, lineHeight: sentenceFont * 1.4, fontWeight: "900", color: NAVY },

    tray: {
      ...card,
      justifyContent: "center",
      paddingHorizontal: f(16, 8),
      paddingVertical: f(10, 5),
      gap: f(6, 3),
    },
    cardsRow: { flexDirection: "row", justifyContent: "center", gap: f(14, 8) },
    card: {
      minWidth: f(130, 80),
      height: cardFont * 1.9,
      paddingHorizontal: f(18, 10),
      borderRadius: f(16, 11),
      backgroundColor: "#FFFFFF",
      borderWidth: 3,
      borderColor: "#E5E7EB",
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
    },
    cardGhost: { backgroundColor: "transparent", borderStyle: "dashed", elevation: 0 },
    cardSelected: {
      borderColor: "#F59E0B",
      backgroundColor: "#FFF7E0",
      transform: [{ translateY: -4 }],
      elevation: 6,
    },
    cardWrong: { borderColor: RED, backgroundColor: "#FDE4E4" },
    cardText: { fontSize: cardFont, lineHeight: cardFont * 1.4, fontWeight: "900", color: NAVY },
    tipText: { fontSize: tipFont, lineHeight: tipFont * 1.5, fontWeight: "700", color: BROWN, textAlign: "center" },

    doneBox: {
      backgroundColor: "rgba(220,245,227,0.95)",
      borderWidth: 1.5,
      borderColor: "#A7D7B0",
      borderRadius: f(16, 11),
      paddingHorizontal: f(14, 8),
      paddingVertical: f(10, 5),
    },
    doneText: { fontSize: doneFont, lineHeight: doneFont * 1.5, fontWeight: "900", color: GREEN, textAlign: "center" },

    basketsRow: { flex: 1, minHeight: 0, flexDirection: "row", gap: f(16, 10) },
    basket: {
      flex: 1,
      borderWidth: 3,
      borderRadius: f(22, 14),
      padding: f(12, 6),
      gap: f(6, 3),
      elevation: 4,
    },
    basketReady: { borderWidth: 4, borderStyle: "dashed" },
    basketHead: { flexDirection: "row", alignItems: "center", gap: f(10, 6) },
    basketEmoji: { fontSize: f(34, 20) },
    basketTitle: { fontSize: titleFont, lineHeight: titleFont * 1.4, fontWeight: "900" },
    basketSub: { fontSize: subFont, lineHeight: subFont * 1.4, fontWeight: "700", color: "#6B7280" },
    basketBody: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      alignContent: "center",
      justifyContent: "center",
      gap: f(10, 6),
      backgroundColor: "rgba(255,255,255,0.6)",
      borderRadius: f(14, 10),
      padding: f(6, 3),
    },
    placedChip: {
      backgroundColor: "#FFFFFF",
      borderWidth: 2,
      borderRadius: f(12, 9),
      paddingHorizontal: f(14, 8),
    },
    placedText: { fontSize: placedFont, lineHeight: placedFont * 1.4, fontWeight: "900" },
  });
}