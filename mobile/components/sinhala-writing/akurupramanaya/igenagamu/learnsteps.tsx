import React, { useMemo } from "react";
import { View, Text, StyleSheet, Image, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LinedLetter from "../linedletter";

/* Optional girl picture (transparent PNG), e.g.
   require("../../../../assets/images/sinhala-writing/girl-pointing.png") */
const GIRL_IMAGE: ImageSourcePropType | null = null;

const GREEN = "#1F8A3B";
const RED = "#E53935";
const NAVY = "#1E2440";

const useStyles = (scale: number) => useMemo(() => createStyles(scale), [scale]);

/* ---------------- STEP 1: the guide lines ---------------- */
export function StepLines({ scale = 1 }: { scale?: number }) {
  const styles = useStyles(scale);

  return (
    <View style={styles.row}>
      <View style={styles.girlCol}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText} numberOfLines={5} adjustsFontSizeToFit>
            සිංහල අකුරු ලියනවිට නිවැරදි ප්‍රමාණය සහ උස පළල තිබිය යුතුයි. අපි දැන් එය ඉගෙනගනිමු!
          </Text>
          <View style={styles.bubbleTail} />
        </View>
        <View style={styles.girlArea}>
          {GIRL_IMAGE ? (
            <Image source={GIRL_IMAGE} style={styles.girlImage} resizeMode="contain" />
          ) : (
            <Text style={styles.girlEmoji}>👧🏻</Text>
          )}
        </View>
      </View>

      <View style={[styles.card, { flex: 1 }]}>
        <LinedLetter letter="ඛ" showLabels scale={scale} />
      </View>
    </View>
  );
}

/* ---------------- STEP 2: parts of a letter ---------------- */
const ZONES = [
  { letter: "ක", caption: "ප්‍රධාන කොටස\nමැද කොටසේ ලියයි" },
  { letter: "කි", caption: "ඉස්පිල්ල\nඉහළ කොටසට යයි" },
  { letter: "කු", caption: "පාපිල්ල\nපහළ කොටසට යයි" },
];

export function StepZones({ scale = 1 }: { scale?: number }) {
  const styles = useStyles(scale);

  return (
    <View style={styles.column}>
      <View style={styles.infoBar}>
        <Text style={styles.infoText} numberOfLines={1} adjustsFontSizeToFit>
          අකුරේ ප්‍රධාන කොටස නිල් රේඛා දෙක අතර ලියන්න. උඩට සහ පහළට යන කොටස් එම කොටස්වලට යයි.
        </Text>
      </View>

      <View style={styles.cardsRow}>
        {ZONES.map((z) => (
          <View key={z.letter} style={styles.card}>
            <LinedLetter letter={z.letter} scale={scale} />
            <Text style={styles.caption} numberOfLines={2} adjustsFontSizeToFit>
              {z.caption}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/* ---------------- STEP 3: right vs wrong size ---------------- */
const SIZES = [
  { factor: 0.55, ok: false, caption: "කුඩා වැඩියි" },
  { factor: 1, ok: true, caption: "නිවැරදි ප්‍රමාණය" },
  { factor: 1.55, ok: false, caption: "විශාල වැඩියි" },
];

export function StepRightSize({ scale = 1 }: { scale?: number }) {
  const styles = useStyles(scale);
  const f = (n: number, min: number) => Math.max(n * scale, min);

  return (
    <View style={styles.column}>
      <View style={styles.infoBar}>
        <Text style={styles.infoText} numberOfLines={1} adjustsFontSizeToFit>
          අකුර රේඛා තුළට ගැළපෙන සේ, කුඩා හෝ විශාල නොවී ලියන්න.
        </Text>
      </View>

      <View style={styles.cardsRow}>
        {SIZES.map((s) => (
          <View
            key={s.caption}
            style={[styles.card, { borderColor: s.ok ? GREEN : "#F5B5B5", borderWidth: 3 }]}
          >
            <LinedLetter letter="ඛ" sizeFactor={s.factor} scale={scale} />
            <View style={styles.captionRow}>
              <Ionicons
                name={s.ok ? "checkmark-circle" : "close-circle"}
                size={f(28, 18)}
                color={s.ok ? GREEN : RED}
              />
              <Text style={[styles.caption, { color: s.ok ? GREEN : RED }]} numberOfLines={1}>
                {s.caption}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

/* ---------------- STEP 4: examples ---------------- */
const EXAMPLES = ["ක", "ඛ", "ග", "ස", "ඩ", "ධ"];

export function StepExamples({ scale = 1 }: { scale?: number }) {
  const styles = useStyles(scale);

  return (
    <View style={[styles.card, styles.examplesPanel]}>
      {[EXAMPLES.slice(0, 3), EXAMPLES.slice(3)].map((row, r) => (
        <View key={r} style={styles.examplesRow}>
          {row.map((l) => (
            <View key={l} style={styles.exampleTile}>
              <LinedLetter letter={l} scale={scale} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

/* ---------------- STYLES ---------------- */
function createStyles(scale: number) {
  const f = (n: number, min: number) => Math.max(n * scale, min);
  const bubbleFont = f(19, 12.5);
  const infoFont = f(18, 13);
  const captionFont = f(18, 12.5);

  return StyleSheet.create({
    row: { flex: 1, flexDirection: "row", gap: f(18, 10) },
    column: { flex: 1, gap: f(10, 6) },

    girlCol: { width: "30%" },
    bubble: {
      backgroundColor: "rgba(255,255,255,0.96)",
      borderRadius: f(36, 22),
      paddingHorizontal: f(20, 12),
      paddingVertical: f(14, 8),
      elevation: 4,
    },
    bubbleText: {
      fontSize: bubbleFont,
      lineHeight: bubbleFont * 1.55,
      fontWeight: "700",
      color: NAVY,
      textAlign: "center",
    },
    bubbleTail: {
      position: "absolute",
      bottom: -8,
      left: "45%",
      width: 18,
      height: 18,
      backgroundColor: "rgba(255,255,255,0.96)",
      transform: [{ rotate: "45deg" }],
    },
    girlArea: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
    girlImage: { width: "100%", height: "100%" },
    girlEmoji: { fontSize: f(120, 56) },

    card: {
      flex: 1,
      backgroundColor: "rgba(255,255,255,0.96)",
      borderRadius: f(24, 16),
      padding: f(16, 8),
      gap: f(6, 4),
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },

    infoBar: {
      backgroundColor: "rgba(255,246,214,0.97)",
      borderWidth: 1.5,
      borderColor: "#FCE7A6",
      borderRadius: f(18, 12),
      paddingHorizontal: f(18, 12),
      paddingVertical: f(8, 5),
    },
    infoText: {
      fontSize: infoFont,
      lineHeight: infoFont * 1.45,
      fontWeight: "700",
      color: NAVY,
      textAlign: "center",
    },

    cardsRow: { flex: 1, minHeight: 0, flexDirection: "row", gap: f(16, 10) },
    caption: {
      fontSize: captionFont,
      lineHeight: captionFont * 1.4,
      fontWeight: "800",
      color: NAVY,
      textAlign: "center",
    },
    captionRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },

    examplesPanel: { gap: f(14, 8) },
    examplesRow: { flex: 1, flexDirection: "row", gap: f(14, 8) },
    exampleTile: {
      flex: 1,
      backgroundColor: "#FFFFFF",
      borderRadius: f(16, 12),
      borderWidth: 1.5,
      borderColor: "#E5E7EB",
      paddingHorizontal: f(10, 6),
    },
  });
}