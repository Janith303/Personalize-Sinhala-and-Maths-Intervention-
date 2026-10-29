import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

const pairs = [
  { alpaprana: "ක", mahaprana: "ඛ" },
  { alpaprana: "ග", mahaprana: "ඝ" },
  { alpaprana: "ච", mahaprana: "ඡ" },
  { alpaprana: "ජ", mahaprana: "ඣ" },
  { alpaprana: "ට", mahaprana: "ඨ" },
  { alpaprana: "ඩ", mahaprana: "ඪ" },
  { alpaprana: "ත", mahaprana: "ථ" },
  { alpaprana: "ද", mahaprana: "ධ" },
  { alpaprana: "ප", mahaprana: "ඵ" },
  { alpaprana: "බ", mahaprana: "භ" },
];

export default function LetterPairs() {
  const [selectedPair, setSelectedPair] = useState(0);

  const pair = pairs[selectedPair];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <Text style={styles.emoji}>🔤</Text>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            අල්පප්‍රාණ හා මහාප්‍රාණ
          </Text>

          <Text style={styles.description}>
            එකිනෙකට සම්බන්ධ අකුරු යුගල හඳුනාගනිමු.
          </Text>
        </View>
      </View>

      <View style={styles.compareCard}>
        <Text style={styles.compareTitle}>අකුරු යුගලය</Text>

        <View style={styles.pairContainer}>
          <View style={styles.singleLetterBox}>
            <Text style={styles.category}>අල්පප්‍රාණ</Text>

            <Text style={styles.bigLetter}>{pair.alpaprana}</Text>
          </View>

          <Text style={styles.arrow}>→</Text>

          <View style={styles.singleLetterBox}>
            <Text style={styles.category}>මහාප්‍රාණ</Text>

            <Text style={[styles.bigLetter, styles.mahaprana]}>
              {pair.mahaprana}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>අකුරු යුගලයක් තෝරන්න</Text>

      <View style={styles.pairGrid}>
        {pairs.map((item, index) => {
          const selected = selectedPair === index;

          return (
            <Pressable
              key={`${item.alpaprana}-${item.mahaprana}`}
              onPress={() => setSelectedPair(index)}
              style={[
                styles.pairCard,
                selected && styles.selectedPairCard,
              ]}
            >
              <Text style={styles.smallLetter}>
                {item.alpaprana}
              </Text>

              <Text style={styles.smallArrow}>→</Text>

              <Text style={styles.smallMahaprana}>
                {item.mahaprana}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 මතක තබාගන්න</Text>

        <Text style={styles.tipText}>
          මහාප්‍රාණ අකුර හඳුනාගැනීම සඳහා එයට සම්බන්ධ
          අල්පප්‍රාණ අකුර සමඟ සසඳා බලන්න.
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
    fontSize: 24,
    fontWeight: "800",
    color: "#263238",
    marginBottom: 7,
  },

  description: {
    fontSize: 17,
    lineHeight: 25,
    color: "#546E7A",
  },

  compareCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 25,
    marginBottom: 24,
    elevation: 3,
  },

  compareTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: "#263238",
    marginBottom: 20,
  },

  pairContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  singleLetterBox: {
    alignItems: "center",
    minWidth: 130,
  },

  category: {
    fontSize: 15,
    color: "#78909C",
    marginBottom: 5,
  },

  bigLetter: {
    fontSize: 52,
    fontWeight: "800",
    color: "#455A64",
  },

  mahaprana: {
    color: "#2E7D32",
  },

  arrow: {
    fontSize: 32,
    color: "#90A4AE",
    marginHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#263238",
    marginBottom: 14,
  },

  pairGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },

  pairCard: {
    minWidth: 125,
    height: 55,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  selectedPairCard: {
    backgroundColor: "#E8F5E9",
    borderWidth: 2,
    borderColor: "#43A047",
  },

  smallLetter: {
    fontSize: 25,
    fontWeight: "700",
    color: "#455A64",
  },

  smallMahaprana: {
    fontSize: 25,
    fontWeight: "700",
    color: "#2E7D32",
  },

  smallArrow: {
    fontSize: 18,
    marginHorizontal: 8,
    color: "#90A4AE",
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