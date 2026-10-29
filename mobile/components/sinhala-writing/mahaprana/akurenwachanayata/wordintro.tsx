import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer, AudioSource } from "expo-audio";
import { LetterWords } from "./words";

/* Optional girl picture (transparent PNG), e.g.
   require("../../../../assets/images/sinhala-writing/girl-pointing.png") */
const GIRL_IMAGE: ImageSourcePropType | null = null;

const GREEN = "#1F8A3B";
const NAVY = "#1E2440";
const BROWN = "#6B3A12";

/* Splits a word into its first letter (with its vowel signs) and the rest,
   so the first letter can be shown in green. */
function splitFirst(word: string): [string, string] {
  let i = 1;
  while (i < word.length) {
    const c = word.charCodeAt(i);
    const isSign = (c >= 0x0dca && c <= 0x0ddf) || c === 0x0df2 || c === 0x0df3;
    if (!isSign) break;
    i++;
  }
  return [word.slice(0, i), word.slice(i)];
}

export default function WordIntro({
  scale = 1,
  item,
}: {
  scale?: number;
  item: LetterWords;
}) {
  const styles = useMemo(() => createStyles(scale), [scale]);
  const f = (n: number, min: number) => Math.max(n * scale, min);
  const player = useAudioPlayer(null);

  const play = (source: AudioSource | null, label: string) => {
    if (!source) {
      Alert.alert("ශබ්දය නැත", `"${label}" ශබ්දය තවම එකතු කර නැත.`);
      return;
    }
    player.replace(source);
    player.seekTo(0);
    player.play();
  };

  return (
    <View style={styles.container}>
      {/* ---------- LEFT: bubble + girl ---------- */}
      <View style={styles.leftCol}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>මෙන්න මහාප්‍රාණ අකුර</Text>
          <Text style={styles.bubbleLetter}>
            {item.letter}
            <Text style={styles.bubbleText}> !</Text>
          </Text>
          <Text style={styles.bubbleText}>
            අපි දැන් මේ අකුරෙන්{"\n"}පටන් ගන්න වචන බලමු.
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

      {/* ---------- MIDDLE: big letter ---------- */}
      <View style={styles.letterCard}>
        <View style={styles.woodLabel}>
          <Text style={styles.woodLabelText}>මහාප්‍රාණ අකුර</Text>
        </View>

        <View style={styles.letterBox}>
          <Text style={styles.bigLetter} adjustsFontSizeToFit numberOfLines={1}>
            {item.letter}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.bigSpeaker}
          onPress={() => play(item.sound, item.letter)}
        >
          <Ionicons name="volume-high" size={f(40, 24)} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ---------- RIGHT: words ---------- */}
      <View style={styles.wordsPanel}>
        <View style={[styles.woodLabel, styles.woodLabelWide]}>
          <Text style={styles.woodLabelText} numberOfLines={1} adjustsFontSizeToFit>
            මෙම අකුරෙන් පටන් ගන්න වචන
          </Text>
        </View>

        {item.words.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>වචන ඉක්මනින් එකතු කෙරේ...</Text>
          </View>
        ) : (
          item.words.map((w) => {
            const [first, rest] = splitFirst(w.word);
            return (
              <View key={w.word} style={styles.wordRow}>
                <View style={styles.wordImageBox}>
                  <Text style={styles.wordEmoji}>{w.emoji}</Text>
                </View>

                <View style={styles.wordTextBox}>
                  <Text style={styles.wordText} numberOfLines={1} adjustsFontSizeToFit>
                    <Text style={{ color: GREEN }}>{first}</Text>
                    {rest}
                  </Text>
                  <Text style={styles.syllableText} numberOfLines={1}>
                    {w.syllables}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.smallSpeaker}
                  onPress={() => play(w.sound, w.word)}
                >
                  <Ionicons name="volume-high" size={f(28, 18)} color={GREEN} />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}

function createStyles(scale: number) {
  const f = (n: number, min: number) => Math.max(n * scale, min);

  const bubbleFont = f(18, 12.5);
  const bubbleLetter = f(40, 24);
  const woodFont = f(20, 13.5);
  const wordFont = f(40, 22);
  const sylFont = f(20, 12.5);

  const card = {
    borderRadius: f(24, 16),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  };

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      gap: f(18, 10),
    },

    /* ---------- LEFT ---------- */
    leftCol: {
      width: "26%",
      alignItems: "center",
    },
    bubble: {
      backgroundColor: "rgba(255,255,255,0.96)",
      borderRadius: f(40, 24),
      paddingHorizontal: f(20, 12),
      paddingVertical: f(14, 8),
      alignItems: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    bubbleText: {
      fontSize: bubbleFont,
      lineHeight: bubbleFont * 1.5,
      fontWeight: "700",
      color: NAVY,
      textAlign: "center",
    },
    bubbleLetter: {
      fontSize: bubbleLetter,
      lineHeight: bubbleLetter * 1.25,
      fontWeight: "900",
      color: GREEN,
    },
    bubbleTail: {
      position: "absolute",
      bottom: -8,
      right: "30%",
      width: 18,
      height: 18,
      backgroundColor: "rgba(255,255,255,0.96)",
      transform: [{ rotate: "45deg" }],
    },
    girlArea: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    girlImage: { width: "100%", height: "100%" },
    girlEmoji: { fontSize: f(110, 54) },

    /* ---------- MIDDLE ---------- */
    letterCard: {
      ...card,
      width: "26%",
      backgroundColor: "rgba(240,248,232,0.96)",
      alignItems: "center",
      paddingHorizontal: f(18, 10),
      paddingTop: f(26, 18),
      paddingBottom: f(16, 8),
      gap: f(10, 6),
      marginTop: f(20, 12),
    },
    woodLabel: {
      position: "absolute",
      top: -f(22, 14),
      alignSelf: "center",
      backgroundColor: "#F2B866",
      borderWidth: 2,
      borderColor: "#C98A3A",
      borderRadius: f(12, 8),
      paddingHorizontal: f(26, 14),
      paddingVertical: f(4, 2),
      elevation: 5,
      zIndex: 2,
    },
    woodLabelWide: { width: "92%", alignItems: "center" },
    woodLabelText: {
      fontSize: woodFont,
      lineHeight: woodFont * 1.4,
      fontWeight: "900",
      color: BROWN,
    },
    letterBox: {
      flex: 1,
      width: "100%",
      minHeight: 0,
      backgroundColor: "#FFFFFF",
      borderRadius: f(20, 14),
      alignItems: "center",
      justifyContent: "center",
    },
    bigLetter: {
      fontSize: f(180, 80),
      lineHeight: f(220, 100),
      fontWeight: "900",
      color: GREEN,
    },
    bigSpeaker: {
      width: f(84, 50),
      height: f(84, 50),
      borderRadius: f(42, 25),
      backgroundColor: GREEN,
      borderWidth: 4,
      borderColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },

    /* ---------- RIGHT ---------- */
    wordsPanel: {
      ...card,
      flex: 1,
      backgroundColor: "rgba(255,252,240,0.96)",
      paddingHorizontal: f(18, 10),
      paddingTop: f(30, 20),
      paddingBottom: f(14, 8),
      gap: f(12, 6),
      marginTop: f(20, 12),
    },
    wordRow: {
      flex: 1,
      minHeight: 0,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: f(20, 14),
      paddingHorizontal: f(16, 10),
      gap: f(18, 10),
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    wordImageBox: {
      width: f(120, 54),
      alignItems: "center",
      justifyContent: "center",
    },
    wordEmoji: { fontSize: f(64, 32) },
    wordTextBox: { flex: 1 },
    wordText: {
      fontSize: wordFont,
      lineHeight: wordFont * 1.3,
      fontWeight: "900",
      color: NAVY,
    },
    syllableText: {
      fontSize: sylFont,
      lineHeight: sylFont * 1.35,
      fontWeight: "600",
      color: "#6B7280",
    },
    smallSpeaker: {
      width: f(68, 40),
      height: f(68, 40),
      borderRadius: f(34, 20),
      backgroundColor: "#FFFFFF",
      borderWidth: 2,
      borderColor: "#E5E7EB",
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
    },
    emptyBox: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      fontSize: f(20, 14),
      color: "#6B7280",
      fontWeight: "700",
    },
  });
}