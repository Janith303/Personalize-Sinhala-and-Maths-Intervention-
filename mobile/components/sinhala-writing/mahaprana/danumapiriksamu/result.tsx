import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GREEN = "#1F8A3B";
const NAVY = "#1E2440";

export default function QuizResult({
  scale = 1,
  score,
  total,
  onRetry,
  onHome,
}: {
  scale?: number;
  score: number;
  total: number;
  onRetry: () => void;
  onHome: () => void;
}) {
  const styles = useMemo(() => createStyles(scale), [scale]);
  const f = (n: number, min: number) => Math.max(n * scale, min);

  const ratio = score / total;
  const message =
    ratio >= 0.8 ? "ඉතා හොඳයි!" : ratio >= 0.5 ? "හොඳයි! තව ටිකයි!" : "අපි නැවත උත්සාහ කරමු!";
  const stars = ratio >= 0.8 ? 3 : ratio >= 0.5 ? 2 : 1;

  return (
    <View style={styles.card}>
      <Text style={styles.trophy}>{ratio >= 0.5 ? "🏆" : "📚"}</Text>
      <Text style={styles.message}>{message}</Text>

      <View style={styles.starsRow}>
        {[1, 2, 3].map((n) => (
          <Ionicons
            key={n}
            name={n <= stars ? "star" : "star-outline"}
            size={f(44, 28)}
            color="#F5B400"
          />
        ))}
      </View>

      <Text style={styles.scoreLabel}>ඔබේ ලකුණු</Text>
      <Text style={styles.score}>
        {score} / {total}
      </Text>

      <View style={styles.buttonsRow}>
        <TouchableOpacity activeOpacity={0.85} onPress={onHome} style={[styles.button, styles.homeButton]}>
          <Ionicons name="home" size={f(22, 16)} color={GREEN} />
          <Text style={[styles.buttonText, { color: GREEN }]}>මුල් පිටුව</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.85} onPress={onRetry} style={[styles.button, styles.retryButton]}>
          <Ionicons name="refresh" size={f(22, 16)} color="#FFFFFF" />
          <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>නැවත උත්සාහ කරන්න</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(scale: number) {
  const f = (n: number, min: number) => Math.max(n * scale, min);

  const messageFont = f(40, 22);
  const scoreFont = f(64, 34);
  const buttonFont = f(19, 14);

  return StyleSheet.create({
    card: {
      minWidth: "50%",
      backgroundColor: "rgba(255,255,255,0.96)",
      borderRadius: f(30, 20),
      paddingHorizontal: f(50, 24),
      paddingVertical: f(24, 12),
      alignItems: "center",
      gap: f(6, 3),
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
    },
    trophy: { fontSize: f(80, 40) },
    message: {
      fontSize: messageFont,
      lineHeight: messageFont * 1.35,
      fontWeight: "900",
      color: GREEN,
    },
    starsRow: { flexDirection: "row", gap: f(8, 5) },
    scoreLabel: {
      fontSize: f(18, 13),
      fontWeight: "700",
      color: "#6B7280",
      marginTop: f(6, 2),
    },
    score: {
      fontSize: scoreFont,
      lineHeight: scoreFont * 1.2,
      fontWeight: "900",
      color: NAVY,
    },
    buttonsRow: { flexDirection: "row", gap: f(16, 10), marginTop: f(10, 6) },
    button: {
      flexDirection: "row",
      alignItems: "center",
      gap: f(8, 5),
      height: f(56, 38),
      borderRadius: f(28, 19),
      paddingHorizontal: f(26, 16),
      elevation: 3,
    },
    homeButton: { backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: GREEN },
    retryButton: { backgroundColor: GREEN },
    buttonText: {
      fontSize: buttonFont,
      lineHeight: buttonFont * 1.4,
      fontWeight: "900",
    },
  });
}