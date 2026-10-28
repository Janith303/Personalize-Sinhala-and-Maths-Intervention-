import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/* Optional girl picture (transparent PNG), e.g.
   require("../../../../assets/images/sinhala-writing/girl-pointing.png") */
const GIRL_IMAGE: ImageSourcePropType | null =  require("../../../../assets/images/sinhala-writing/girll.png");

const GREEN = "#1F8A3B";
const NAVY = "#1E2440";

const LETTERS = ["ඛ", "ඝ", "ඡ", "ඣ", "ඨ", "ඪ", "ථ", "ධ", "ඵ", "භ"];

export default function LetterIntroduction({ scale = 1 }: { scale?: number }) {
  const styles = useMemo(() => createStyles(scale), [scale]);
  const z = (n: number) => n * scale;

  const [selected, setSelected] = useState(LETTERS[0]);

  return (
    <View style={styles.container}>
      {/* ---------- INFO CARD ---------- */}
      <View style={styles.infoCard}>
        <View style={styles.infoIcon}>
          <Text style={styles.infoEmoji}>📖</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle} numberOfLines={1}>
            මහාප්‍රාණ අකුරු හඳුනාගනිමු
          </Text>
          <Text style={styles.infoText} numberOfLines={2} adjustsFontSizeToFit>
            මහාප්‍රාණ අකුරු කියන්නේ වැඩි වායු ප්‍රමාණයක් පිට කරමින් උච්චාරණය කරන අකුරුයි.
          </Text>
        </View>
      </View>

      {/* ---------- LETTERS ---------- */}
      <View style={styles.lettersPanel}>
        <View style={styles.lettersHeader}>
          <Ionicons name="leaf" size={z(24)} color="#4CAF50" />
          <Text style={styles.lettersTitle}>මහාප්‍රාණ අකුරු {LETTERS.length}</Text>
        </View>

        <View style={styles.lettersRow}>
          {LETTERS.map((l) => {
            const active = l === selected;
            return (
              <TouchableOpacity
                key={l}
                activeOpacity={0.85}
                onPress={() => setSelected(l)}
                style={[styles.letterTile, active ? styles.letterTileActive : styles.letterTileIdle]}
              >
                <Text style={[styles.letterTileText, { color: active ? "#FFFFFF" : "#111111" }]}>
                  {l}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ---------- SELECTED LETTER ---------- */}
      <View style={styles.selectedPanel}>
        <Ionicons name="leaf" size={z(20)} color="#9ED8A4" style={{ position: "absolute", top: z(12), left: "30%" }} />
        <Ionicons name="leaf" size={z(18)} color="#9ED8A4" style={{ position: "absolute", top: z(14), right: "26%" }} />

        <View style={styles.girlArea}>
          {GIRL_IMAGE ? (
            <Image source={GIRL_IMAGE} style={styles.girlImage} resizeMode="contain" />
          ) : (
            <Text style={styles.girlEmoji}>👧🏻</Text>
          )}
        </View>

        <View style={styles.selectedCenter}>
          <View style={styles.selectedPill}>
            <Text style={styles.selectedPillText}>ඔබ තෝරාගත් අකුර</Text>
          </View>
          <View style={styles.bigLetterBox}>
            <Text style={styles.bigLetter}>{selected}</Text>
          </View>
        </View>

        <View style={styles.speechArea}>
          <View style={styles.speechBubble}>
            <View style={styles.speechTail} />
            <Text style={styles.speechText}>
              මෙම අකුර හොඳින් බලන්න.{"\n"}ඊළඟ ක්‍රියාකාරකමට යමු!
            </Text>
          </View>
        </View>
      </View>

      {/* ---------- TIP ---------- */}
      <View style={styles.tipBox}>
        <View style={styles.tipIcon}>
          <Text style={styles.tipEmoji}>💡</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.tipTitle}>මතක තබාගන්න</Text>
          <Text style={styles.tipText} numberOfLines={2} adjustsFontSizeToFit>
            මහාප්‍රාණ අකුරු නිවැරදිව හඳුනාගැනීමෙන් ඒවා වචන තුළදී හඳුනාගැනීමට පහසු වේ.
          </Text>
        </View>
      </View>
    </View>
  );
}

function createStyles(scale: number) {
  const z = (n: number) => n * scale;

  const card = {
    backgroundColor: "rgba(255,255,255,0.93)",
    borderRadius: z(20),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  };

  return StyleSheet.create({
    container: { flex: 1, gap: z(8) },

    /* ---------- INFO CARD ---------- */
    infoCard: {
      ...card,
      height: z(66),
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: z(10),
      gap: z(14),
    },
    infoIcon: {
      width: z(54),
      height: z(54),
      borderRadius: z(14),
      backgroundColor: "#FFF3C4",
      alignItems: "center",
      justifyContent: "center",
    },
    infoEmoji: { fontSize: z(32) },
    infoTitle: {
      fontSize: z(19),
      lineHeight: z(27),
      fontWeight: "900",
      color: NAVY,
    },
    infoText: {
      fontSize: z(13),
      lineHeight: z(19),
      fontWeight: "600",
      color: "#4B5563",
    },

    /* ---------- LETTERS ---------- */
    lettersPanel: {
      ...card,
      backgroundColor: "rgba(240,250,242,0.95)",
      height: z(108),
      paddingHorizontal: z(14),
      paddingVertical: z(8),
    },
    lettersHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: z(8),
      marginBottom: z(6),
    },
    lettersTitle: {
      fontSize: z(18),
      lineHeight: z(26),
      fontWeight: "900",
      color: NAVY,
    },
    lettersRow: { flex: 1, flexDirection: "row", gap: z(10) },
    letterTile: {
      flex: 1,
      borderRadius: z(12),
      alignItems: "center",
      justifyContent: "center",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
    },
    letterTileActive: { backgroundColor: GREEN },
    letterTileIdle: { backgroundColor: "#FFFFFF" },
    letterTileText: {
      fontSize: z(28),
      lineHeight: z(38),
      fontWeight: "900",
    },

    /* ---------- SELECTED LETTER ---------- */
    selectedPanel: {
      ...card,
      flex: 1,
      backgroundColor: "rgba(240,248,252,0.93)",
      flexDirection: "row",
      alignItems: "center",
      overflow: "hidden",
    },
    girlArea: {
      width: "26%",
      height: "100%",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    girlImage: { width: "100%", height: "100%" },
    girlEmoji: { fontSize: z(90), lineHeight: z(120) },
    selectedCenter: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: z(6),
    },
    selectedPill: {
      backgroundColor: "#FFEFB3",
      borderRadius: z(14),
      paddingHorizontal: z(22),
      paddingVertical: z(3),
    },
    selectedPillText: {
      fontSize: z(15),
      lineHeight: z(22),
      fontWeight: "900",
      color: "#7C2D12",
    },
    bigLetterBox: {
      width: z(118),
      height: z(110),
      borderRadius: z(16),
      backgroundColor: "#FFFFFF",
      borderWidth: 3,
      borderColor: GREEN,
      alignItems: "center",
      justifyContent: "center",
    },
    bigLetter: {
      fontSize: z(76),
      lineHeight: z(96),
      fontWeight: "900",
      color: GREEN,
    },
    speechArea: {
      width: "32%",
      paddingRight: z(16),
      paddingLeft: z(8),
    },
    speechBubble: {
      backgroundColor: "#E2F3E4",
      borderRadius: z(40),
      paddingHorizontal: z(18),
      paddingVertical: z(14),
      borderWidth: 1.5,
      borderColor: "#CBE8CF",
    },
    speechTail: {
      position: "absolute",
      left: -z(9),
      top: "42%",
      width: z(18),
      height: z(18),
      backgroundColor: "#E2F3E4",
      borderLeftWidth: 1.5,
      borderBottomWidth: 1.5,
      borderColor: "#CBE8CF",
      transform: [{ rotate: "45deg" }],
    },
    speechText: {
      fontSize: z(15),
      lineHeight: z(24),
      fontWeight: "700",
      color: NAVY,
    },

    /* ---------- TIP ---------- */
    tipBox: {
      ...card,
      backgroundColor: "rgba(255,246,214,0.97)",
      height: z(58),
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: z(8),
      gap: z(12),
      borderWidth: 1.5,
      borderColor: "#FCE7A6",
    },
    tipIcon: {
      width: z(46),
      height: z(46),
      borderRadius: z(12),
      backgroundColor: "#FFE89A",
      alignItems: "center",
      justifyContent: "center",
    },
    tipEmoji: { fontSize: z(26) },
    tipTitle: {
      fontSize: z(16),
      lineHeight: z(23),
      fontWeight: "900",
      color: "#7C2D12",
    },
    tipText: {
      fontSize: z(13),
      lineHeight: z(19),
      fontWeight: "600",
      color: "#374151",
    },
  });
}