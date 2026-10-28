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

/* Optional girl picture (transparent PNG). Leave as null until you add it. e.g.
   require("../../../../assets/images/sinhala-writing/girl-chalkboard.png") */
const GIRL_IMAGE: ImageSourcePropType | null = null;

const PAIRS: { alpa: string; maha: string }[] = [
  { alpa: "ක", maha: "ඛ" },
  { alpa: "ග", maha: "ඝ" },
  { alpa: "ච", maha: "ඡ" },
  { alpa: "ජ", maha: "ඣ" },
  { alpa: "ට", maha: "ඨ" },
  { alpa: "ඩ", maha: "ඪ" },
  { alpa: "ත", maha: "ථ" },
  { alpa: "ද", maha: "ධ" },
  { alpa: "ප", maha: "ඵ" },
  { alpa: "බ", maha: "භ" },
];

const GREEN = "#1F8A3B";
const DARK_GREEN = "#17702F";
const NAVY = "#1E2440";
const BLUE = "#2F5FA8";
const BROWN = "#6B3A12";

export default function LetterPairs({ scale = 1 }: { scale?: number }) {
  const compact = scale < 0.8;
  const styles = useMemo(() => createStyles(scale, compact), [scale, compact]);
  const f = (n: number, min: number) => Math.max(n * scale, min);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const pair = PAIRS[selectedIndex];

  const rows = compact ? [PAIRS] : [PAIRS.slice(0, 5), PAIRS.slice(5)];

  return (
    <View style={styles.container}>
      {/* ---------- INTRO ---------- */}
      <View style={styles.introCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.introTitle} numberOfLines={1}>
            අල්පප්‍රාණ හා මහාප්‍රාණ
          </Text>
          <Text style={styles.introText} numberOfLines={1} adjustsFontSizeToFit>
            එකිනෙකට සම්බන්ධ අකුරු යුගල හඳුනාගනිමු.
          </Text>
        </View>

        {GIRL_IMAGE && !compact ? (
          <Image source={GIRL_IMAGE} style={styles.girlImage} resizeMode="contain" />
        ) : null}

        <View style={styles.chalkboard}>
          <Text style={styles.chalkText} numberOfLines={1}>
            {pair.alpa} → {pair.maha}
          </Text>
        </View>
      </View>

      {/* ---------- MAIN PANEL ---------- */}
      <View style={styles.mainPanel}>
        <View style={styles.pairArea}>
          {!compact && (
            <View style={styles.pairPill}>
              <Text style={styles.pairPillText}>අකුරු යුගලය</Text>
            </View>
          )}

          <View style={styles.pairRow}>
            {/* Alpaprana card */}
            <View style={[styles.letterCard, styles.alpaCard]}>
              <View style={compact ? styles.cardTextCol : undefined}>
                <View style={[styles.cardLabel, { backgroundColor: "#D6E6FA" }]}>
                  <Text style={[styles.cardLabelText, { color: BLUE }]}>අල්පප්‍රාණ</Text>
                </View>
                {compact && (
                  <View style={[styles.caption, { backgroundColor: "#D6E6FA" }]}>
                    <Text style={[styles.captionText, { color: BLUE }]}>හඬ මෘදුයි</Text>
                  </View>
                )}
              </View>

              <Text style={[styles.cardLetter, { color: "#1F2937" }]}>{pair.alpa}</Text>

              {!compact && (
                <View style={[styles.caption, { backgroundColor: "#D6E6FA" }]}>
                  <Text style={[styles.captionText, { color: BLUE }]}>හඬ මෘදුයි</Text>
                </View>
              )}
            </View>

            <Ionicons name="arrow-forward" size={f(44, 28)} color={GREEN} />

            {/* Mahaprana card */}
            <View style={[styles.letterCard, styles.mahaCard]}>
              <View style={compact ? styles.cardTextCol : undefined}>
                <View style={[styles.cardLabel, { backgroundColor: "#D3EFD9" }]}>
                  <Text style={[styles.cardLabelText, { color: DARK_GREEN }]}>මහාප්‍රාණ</Text>
                </View>
                {compact && (
                  <View style={[styles.caption, { backgroundColor: "#D3EFD9" }]}>
                    <Text style={[styles.captionText, { color: DARK_GREEN }]}>හඬ ශක්තිමත් වේ</Text>
                  </View>
                )}
              </View>

              <Text style={[styles.cardLetter, { color: GREEN }]}>{pair.maha}</Text>

              {!compact && (
                <View style={[styles.caption, { backgroundColor: "#D3EFD9" }]}>
                  <Text style={[styles.captionText, { color: DARK_GREEN }]}>හඬ ශක්තිමත් වේ</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* ---------- PAIR PICKER ---------- */}
      <View style={styles.pickerPanel}>
        <View style={styles.woodLabel}>
          <Text style={styles.woodLabelText}>අකුරු යුගලයක් තෝරන්න</Text>
        </View>

        {rows.map((row, r) => (
          <View key={r} style={styles.pairsRow}>
            {row.map((p) => {
              const index = PAIRS.indexOf(p);
              const active = index === selectedIndex;
              return (
                <TouchableOpacity
                  key={p.alpa}
                  activeOpacity={0.85}
                  onPress={() => setSelectedIndex(index)}
                  style={[styles.pairTile, active && styles.pairTileActive]}
                >
                  <Text style={styles.pairTileText} numberOfLines={1} adjustsFontSizeToFit>
                    {p.alpa}
                    <Text style={styles.pairArrow}> → </Text>
                    {p.maha}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* ---------- TIP ---------- */}
      <View style={styles.tipBox}>
        <Text style={styles.tipEmoji}>💡</Text>
        <View style={styles.tipDivider} />
        <View style={{ flex: 1 }}>
          <Text style={styles.tipTitle}>ඉඟිය</Text>
          <Text style={styles.tipText} numberOfLines={1} adjustsFontSizeToFit>
            මහාප්‍රාණ අකුරු හඳුනාගැනීම සඳහා එයට සම්බන්ධ අල්පප්‍රාණ අකුරු සමග සසඳා බලන්න.
          </Text>
        </View>
      </View>
    </View>
  );
}

function createStyles(scale: number, compact: boolean) {
  // scaled size, but never smaller than `min`
  const f = (n: number, min: number) => Math.max(n * scale, min);

  const introTitle = f(24, 16);
  const introText = f(16, 12.5);
  const chalkFont = f(30, 18);
  const pillFont = f(16, 12.5);
  const labelFont = f(15, 12);
  const captionFont = f(14, 11.5);
  const cardLetter = compact ? f(68, 44) : f(80, 44);
  const woodFont = f(18, 13.5);
  const tileH = f(56, 40);
  const tileFont = f(28, 17);
  const tipTitle = f(17, 14);
  const tipText = f(14, 12.5);

  const card = {
    borderRadius: f(20, 14),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  };

  return StyleSheet.create({
    container: { flex: 1, gap: f(8, 6) },

    /* ---------- INTRO ---------- */
    introCard: {
      ...card,
      backgroundColor: "rgba(255,247,214,0.96)",
      borderWidth: 1.5,
      borderColor: "#FCE7A6",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: f(20, 14),
      paddingVertical: f(8, 4),
      gap: f(14, 10),
    },
    introTitle: {
      fontSize: introTitle,
      lineHeight: introTitle * 1.4,
      fontWeight: "900",
      color: DARK_GREEN,
    },
    introText: {
      fontSize: introText,
      lineHeight: introText * 1.4,
      fontWeight: "600",
      color: "#374151",
    },
    girlImage: { width: f(110, 60), height: f(90, 50) },
    chalkboard: {
      backgroundColor: "#2F5D46",
      borderWidth: f(5, 3),
      borderColor: "#A0632B",
      borderRadius: f(6, 4),
      paddingHorizontal: f(24, 12),
      paddingVertical: f(10, 3),
    },
    chalkText: {
      fontSize: chalkFont,
      lineHeight: chalkFont * 1.35,
      fontWeight: "800",
      color: "#FFFFFF",
    },

    /* ---------- MAIN PANEL ---------- */
    mainPanel: {
      ...card,
      flex: 1,
      minHeight: 0,
      backgroundColor: "rgba(240,248,252,0.93)",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: f(16, 10),
      paddingVertical: f(8, 4),
      overflow: "hidden",
    },
    pairArea: {
      alignItems: "center",
      justifyContent: "center",
      gap: f(8, 4),
    },
    pairPill: {
      backgroundColor: "#DDF3E1",
      borderRadius: f(14, 10),
      paddingHorizontal: f(40, 20),
      paddingVertical: 2,
    },
    pairPillText: {
      fontSize: pillFont,
      lineHeight: pillFont * 1.4,
      fontWeight: "900",
      color: DARK_GREEN,
    },
    pairRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: f(28, 18),
    },
    letterCard: {
      flexDirection: compact ? "row" : "column",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: f(16, 12),
      borderWidth: 2,
      paddingHorizontal: f(18, 12),
      paddingVertical: f(10, 4),
      gap: compact ? f(14, 10) : f(4, 2),
      minWidth: compact ? f(200, 150) : f(240, 150),
    },
    alpaCard: { backgroundColor: "#EEF5FF", borderColor: "#C9DDF6" },
    mahaCard: { backgroundColor: "#EBF8EE", borderColor: "#BFE3C7" },
    cardTextCol: { alignItems: "center", gap: 4 },
    cardLabel: {
      borderRadius: f(12, 8),
      paddingHorizontal: f(16, 10),
      paddingVertical: 1,
    },
    cardLabelText: {
      fontSize: labelFont,
      lineHeight: labelFont * 1.4,
      fontWeight: "900",
    },
    cardLetter: {
      fontSize: cardLetter,
      lineHeight: cardLetter * 1.3,
      fontWeight: "900",
    },
    caption: {
      borderRadius: f(14, 10),
      paddingHorizontal: f(16, 10),
      paddingVertical: 1,
    },
    captionText: {
      fontSize: captionFont,
      lineHeight: captionFont * 1.4,
      fontWeight: "800",
    },

    /* ---------- PAIR PICKER ---------- */
    pickerPanel: {
      ...card,
      backgroundColor: "rgba(236,248,238,0.95)",
      paddingHorizontal: f(14, 10),
      paddingVertical: f(8, 5),
      gap: f(8, 5),
    },
    woodLabel: {
      alignSelf: "flex-start",
      backgroundColor: "#F6C877",
      borderWidth: 1.5,
      borderColor: "#D99A3E",
      borderRadius: f(10, 8),
      paddingHorizontal: f(18, 12),
      paddingVertical: 1,
      transform: [{ rotate: "-1deg" }],
    },
    woodLabelText: {
      fontSize: woodFont,
      lineHeight: woodFont * 1.4,
      fontWeight: "900",
      color: BROWN,
    },
    pairsRow: {
      height: tileH,
      flexDirection: "row",
      gap: f(12, 6),
    },
    pairTile: {
      flex: 1,
      borderRadius: f(12, 10),
      backgroundColor: "#FFFFFF",
      borderWidth: 2.5,
      borderColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 4,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
    },
    pairTileActive: { borderColor: GREEN },
    pairTileText: {
      fontSize: tileFont,
      lineHeight: tileFont * 1.35,
      fontWeight: "900",
      color: NAVY,
    },
    pairArrow: {
      color: "#9CA3AF",
      fontWeight: "600",
    },

    /* ---------- TIP ---------- */
    tipBox: {
      ...card,
      backgroundColor: "rgba(255,246,214,0.97)",
      borderWidth: 1.5,
      borderColor: "#FCE7A6",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: f(16, 10),
      paddingVertical: f(6, 4),
      gap: f(14, 10),
    },
    tipEmoji: { fontSize: f(30, 20) },
    tipDivider: {
      width: 2,
      alignSelf: "stretch",
      backgroundColor: "#F2C14E",
      borderRadius: 1,
    },
    tipTitle: {
      fontSize: tipTitle,
      lineHeight: tipTitle * 1.4,
      fontWeight: "900",
      color: BROWN,
    },
    tipText: {
      fontSize: tipText,
      lineHeight: tipText * 1.4,
      fontWeight: "600",
      color: "#374151",
    },
  });
}