import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

const letters = [
  "ඛ",
  "ඝ",
  "ඡ",
  "ඣ",
  "ඨ",
  "ඪ",
  "ථ",
  "ධ",
  "ඵ",
  "භ",
];

export default function SoundAndLetter() {
  const [selectedLetter, setSelectedLetter] = useState("ඛ");
  const [soundPressed, setSoundPressed] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <Text style={styles.emoji}>🔊</Text>

        <View style={styles.headerText}>
          <Text style={styles.title}>අකුර සහ ශබ්දය</Text>

          <Text style={styles.description}>
            අකුර තෝරා  එහි ශබ්දය හඳුනාගනිමු.
          </Text>
        </View>
      </View>

      <View style={styles.mainCard}>
        <Text style={styles.label}>තෝරාගත් අකුර</Text>

        <Text style={styles.bigLetter}>{selectedLetter}</Text>

        <Pressable
          style={styles.soundButton}
          onPress={() => setSoundPressed(true)}
        >
          <Text style={styles.soundIcon}>🔊</Text>
          <Text style={styles.soundButtonText}>ශබ්දය අසන්න</Text>
        </Pressable>

        {soundPressed && (
          <View style={styles.feedback}>
            <Text style={styles.feedbackTitle}>හොඳයි! 👏</Text>

            <Text style={styles.feedbackText}>
              මෙම අකුරේ ශබ්දයට හොඳින් සවන් දෙන්න.
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>අකුරක් තෝරන්න</Text>

      <View style={styles.letterGrid}>
        {letters.map((letter) => {
          const selected = selectedLetter === letter;

          return (
            <Pressable
              key={letter}
              onPress={() => {
                setSelectedLetter(letter);
                setSoundPressed(false);
              }}
              style={[
                styles.letterCard,
                selected && styles.selectedCard,
              ]}
            >
              <Text
                style={[
                  styles.letter,
                  selected && styles.selectedLetter,
                ]}
              >
                {letter}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 ඉඟිය</Text>

        <Text style={styles.tipText}>
          අකුර දෙස බලමින් එහි ශබ්දය හොඳින් අසන්න. නැවත නැවතත්
          අසා පුහුණු වන්න.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },

  emoji: {
    fontSize: 42,
    marginRight: 18,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#263238",
    marginBottom: 7,
  },

  description: {
    fontSize: 17,
    lineHeight: 25,
    color: "#546E7A",
  },

  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    marginBottom: 16,
    elevation: 3,
  },

  label: {
    fontSize: 16,
    color: "#78909C",
    marginBottom: 5,
  },

  bigLetter: {
    fontSize: 60,
    fontWeight: "800",
    color: "#2E7D32",
    marginBottom: 12,
  },

  soundButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
  },

  soundIcon: {
    fontSize: 23,
    marginRight: 10,
  },

  soundButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  feedback: {
    marginTop: 18,
    padding: 15,
    borderRadius: 16,
    backgroundColor: "#E8F5E9",
    width: "100%",
    alignItems: "center",
  },

  feedbackTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2E7D32",
    marginBottom: 5,
  },

  feedbackText: {
    fontSize: 15,
    color: "#546E7A",
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#263238",
    marginBottom: 14,
  },

  letterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },

  letterCard: {
    width: 62,
    height: 62,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  selectedCard: {
    backgroundColor: "#E8F5E9",
    borderWidth: 3,
    borderColor: "#43A047",
  },

  letter: {
    fontSize: 34,
    fontWeight: "700",
    color: "#37474F",
  },

  selectedLetter: {
    color: "#2E7D32",
  },

  tipCard: {
    backgroundColor: "#FFF8E1",
    borderRadius: 20,
    padding: 20,
  },

  tipTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#5D4037",
    marginBottom: 8,
  },

  tipText: {
    fontSize: 16,
    lineHeight: 25,
    color: "#6D4C41",
  },
});