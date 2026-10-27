import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
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

export default function LetterIntroduction() {
  const [selectedLetter, setSelectedLetter] = useState("ඛ");
  const { width } = useWindowDimensions();

  const isLandscape = width > 700;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        isLandscape && styles.landscapeContent,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.introCard}>
        

        <View style={styles.introTextContainer}>
          <Text style={styles.title}>මහාප්‍රාණ අකුරු හඳුනාගනිමු</Text>

          <Text style={styles.description}>
            මහාප්‍රාණ අකුරු කියන්නේ වැඩි වායු ප්‍රමාණයක් පිට කරමින්
            උච්චාරණය කරන අකුරුයි.
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>මහාප්‍රාණ අකුරු 10</Text>

      <View style={styles.letterGrid}>
        {letters.map((letter) => {
          const selected = selectedLetter === letter;

          return (
            <Pressable
              key={letter}
              onPress={() => setSelectedLetter(letter)}
              style={[
                styles.letterCard,
                selected && styles.selectedLetterCard,
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

      <View style={styles.selectedCard}>
        <Text style={styles.selectedLabel}>ඔබ තෝරාගත් අකුර</Text>

        <Text style={styles.bigLetter}>{selectedLetter}</Text>

        <Text style={styles.helpText}>
          මෙම අකුර හොඳින් බලන්න. ඊළඟ ක්‍රියාකාරකමේදී එහි ශබ්දය
          හඳුනාගනිමු.
        </Text>
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 මතක තබාගන්න</Text>

        <Text style={styles.tipText}>
          මහාප්‍රාණ අකුරු නිවැරදිව හඳුනාගැනීමෙන් ඒවා වචන තුළදී
          හඳුනාගැනීමට පහසු වේ.
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
    padding: 14,
    paddingBottom: 20,
  },

  landscapeContent: {
    paddingHorizontal: 40,
  },

  introCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    elevation: 3,
  },

  emoji: {
    fontSize: 42,
    marginRight: 18,
  },

  introTextContainer: {
    flex: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
    color: "#263238",
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#546E7A",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#263238",
    marginBottom: 10,
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

  selectedLetterCard: {
    backgroundColor: "#E8F5E9",
    borderWidth: 3,
    borderColor: "#43A047",
  },

  letter: {
    fontSize: 29,
    fontWeight: "700",
    color: "#37474F",
  },

  selectedLetter: {
    color: "#2E7D32",
  },

  selectedCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    marginBottom: 14,
    elevation: 3,
  },

  selectedLabel: {
    fontSize: 16,
    color: "#78909C",
    marginBottom: 8,
  },

  bigLetter: {
    fontSize: 55,
    fontWeight: "800",
    color: "#2E7D32",
    marginBottom: 8,
  },

  helpText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#546E7A",
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