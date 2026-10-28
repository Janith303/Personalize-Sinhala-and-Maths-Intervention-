import React, { useMemo, useState } from "react";
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

/* Optional pictures (transparent PNGs). Leave as null until you add them. e.g.
   require("../../../../assets/images/sinhala-writing/girl-megaphone.png") */
const INTRO_IMAGE: ImageSourcePropType | null = require("../../../../assets/images/sinhala-writing/girlmegaphone.png");
const BIRD_IMAGE: ImageSourcePropType | null = require("../../../../assets/images/sinhala-writing/bird.png");

/* Sound for each letter. Add your recordings to
   mobile/assets/sounds/mahaprana/ and fill these in, e.g.
   "ඛ": require("../../../../assets/sounds/mahaprana/kha.mp3"), */
const SOUNDS: Record<string, AudioSource | null> = {
  "ඛ": null,
  "ඝ": null,
  "ඡ": null,
  "ඣ": null,
  "ඨ": null,
  "ඪ": null,
  "ථ": null,
  "ධ": null,
  "ඵ": null,
  "භ": null,
};

const LETTERS = Object.keys(SOUNDS);

const GREEN = "#1F8A3B";
const NAVY = "#1E2440";
const BROWN = "#6B3A12";

export default function SoundAndLetter({ scale = 1 }: { scale?: number }) {
  const compact = scale < 0.8;
  const styles = useMemo(() => createStyles(scale, compact), [scale, compact]);
  const f = (n: number, min: number) => Math.max(n * scale, min);

  const [selected, setSelected] = useState(LETTERS[0]);
  const player = useAudioPlayer(null);

  const playSound = () => {
    const source = SOUNDS[selected];
    if (!source) {
      Alert.alert("ශබ්දය නැත", `"${selected}" අකුරේ ශබ්දය තවම එකතු කර නැත.`);
      return;
    }
    player.replace(source);
    player.seekTo(0);
    player.play();
  };

  const soundButton = (
    <TouchableOpacity activeOpacity={0.85} style={styles.soundButton} onPress={playSound}>
      <Ionicons name="volume-high" size={f(30, 20)} color="#FFFFFF" />
      <Text style={styles.soundButtonText} numberOfLines={1}>
        ශබ්දය අසන්න
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* ---------- INTRO BANNER ---------- */}
      <View style={styles.introCard}>
        <View style={styles.introImageBox}>
          {INTRO_IMAGE ? (
            <Image source={INTRO_IMAGE} style={styles.introImage} resizeMode="contain" />
          ) : (
            <Text style={styles.introEmoji}>📣</Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.introTitle} numberOfLines={1}>
            අකුරු සහ ශබ්දය
          </Text>
          <Text style={styles.introText} numberOfLines={1} adjustsFontSizeToFit>
            අකුරු තෝරා එහි ශබ්දය හඳුනාගනිමු.
          </Text>
        </View>
        <Ionicons name="leaf" size={f(30, 18)} color="#7BC67E" />
      </View>

      {/* ---------- MAIN PANEL ---------- */}
      <View style={styles.mainPanel}>
        {/* Wooden sign */}
        <View style={styles.signArea}>
          <View style={styles.signBoard}>
            <Text style={styles.signText} numberOfLines={2} adjustsFontSizeToFit>
              ශබ්දය අසා{"\n"}අකුරු හඳුනාගන්න!
            </Text>
          </View>
          <View style={styles.signPost} />
        </View>

        {/* Selected letter + sound button */}
        {compact ? (
          <View style={styles.centerRow}>
            <View style={styles.bigLetterBox}>
              <Text style={styles.bigLetter}>{selected}</Text>
            </View>
            <View style={styles.centerSide}>
              <View style={styles.selectedPill}>
                <Text style={styles.selectedPillText}>තෝරාගත් අකුර</Text>
              </View>
              {soundButton}
            </View>
          </View>
        ) : (
          <View style={styles.centerColumn}>
            <View style={styles.selectedPill}>
              <Text style={styles.selectedPillText}>තෝරාගත් අකුර</Text>
            </View>
            <View style={styles.bigLetterBox}>
              <Text style={styles.bigLetter}>{selected}</Text>
            </View>
            {soundButton}
          </View>
        )}

        {/* Bird */}
        <View style={styles.birdArea}>
          {BIRD_IMAGE ? (
            <Image source={BIRD_IMAGE} style={styles.birdImage} resizeMode="contain" />
          ) : (
            <>
              <Text style={styles.notes}>🎵 🎶</Text>
              <Text style={styles.birdEmoji}>🐦</Text>
            </>
          )}
        </View>
      </View>

      {/* ---------- LETTER PICKER ---------- */}
      <View style={styles.lettersPanel}>
        <View style={styles.lettersLabel}>
          <Text style={styles.lettersLabelText}>අකුරු තෝරන්න</Text>
        </View>

        <View style={styles.lettersRow}>
          {LETTERS.map((l) => {
            const active = l === selected;
            return (
              <TouchableOpacity
                key={l}
                activeOpacity={0.85}
                onPress={() => setSelected(l)}
                style={[styles.letterTile, active && styles.letterTileActive]}
              >
                <Text style={[styles.letterTileText, active && { color: GREEN }]}>{l}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ---------- TIP ---------- */}
      <View style={styles.tipBox}>
        <Text style={styles.tipEmoji}>💡</Text>
        <View style={styles.tipDivider} />
        <View style={{ flex: 1 }}>
          <Text style={styles.tipTitle}>ඉඟිය</Text>
          <Text style={styles.tipText} numberOfLines={1} adjustsFontSizeToFit>
            අකුර දෙස බලමින් එහි ශබ්දය හොඳින් අසන්න. නැවත නැවතත් අසා පුහුණු වන්න.
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
  const signFont = f(17, 12);
  const pillFont = f(15, 12);
  const boxH = f(120, 66);
  const btnFont = f(18, 13.5);
  const labelFont = f(18, 14);
  const tileH = f(58, 40);
  const tileFont = f(30, 22);
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
      paddingHorizontal: f(14, 10),
      paddingVertical: f(8, 4),
      gap: f(16, 10),
    },
    introImageBox: {
      width: f(110, 44),
      height: f(80, 40),
      alignItems: "center",
      justifyContent: "center",
    },
    introImage: { width: "100%", height: "100%" },
    introEmoji: { fontSize: f(48, 26) },
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
      color: "#4B5563",
    },

    /* ---------- MAIN PANEL ---------- */
    mainPanel: {
      ...card,
      flex: 1,
      minHeight: 0,
      backgroundColor: "rgba(240,248,252,0.93)",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: f(16, 10),
      overflow: "hidden",
    },

    signArea: {
      width: "26%",
      alignItems: "center",
      justifyContent: "center",
    },
    signBoard: {
      backgroundColor: "#E9A65C",
      borderWidth: 2,
      borderColor: "#B8742F",
      borderRadius: f(12, 8),
      paddingHorizontal: f(14, 8),
      paddingVertical: f(10, 5),
      transform: [{ rotate: "-3deg" }],
      zIndex: 2,
      elevation: 3,
    },
    signText: {
      fontSize: signFont,
      lineHeight: signFont * 1.45,
      fontWeight: "900",
      color: BROWN,
      textAlign: "center",
    },
    signPost: {
      width: f(12, 7),
      height: compact ? f(20, 10) : f(50, 20),
      backgroundColor: "#B8742F",
      borderBottomLeftRadius: 3,
      borderBottomRightRadius: 3,
    },

    centerColumn: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: f(8, 4),
    },
    centerRow: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: f(14, 10),
    },
    centerSide: {
      alignItems: "center",
      gap: f(8, 6),
    },

    selectedPill: {
      backgroundColor: "#DDF3E1",
      borderRadius: f(14, 10),
      paddingHorizontal: f(20, 14),
      paddingVertical: 2,
    },
    selectedPillText: {
      fontSize: pillFont,
      lineHeight: pillFont * 1.4,
      fontWeight: "800",
      color: "#2F5D3A",
    },
    bigLetterBox: {
      width: boxH * 1.1,
      height: boxH,
      borderRadius: f(18, 12),
      backgroundColor: "#E6F6E9",
      borderWidth: 3,
      borderColor: "#A7D7B0",
      alignItems: "center",
      justifyContent: "center",
    },
    bigLetter: {
      fontSize: boxH * 0.68,
      lineHeight: boxH * 0.9,
      fontWeight: "900",
      color: GREEN,
    },
    soundButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: f(10, 6),
      backgroundColor: GREEN,
      borderRadius: f(30, 20),
      paddingHorizontal: f(36, 18),
      paddingVertical: f(10, 6),
      borderWidth: 3,
      borderColor: "#FFFFFF",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    soundButtonText: {
      fontSize: btnFont,
      lineHeight: btnFont * 1.4,
      fontWeight: "900",
      color: "#FFFFFF",
    },

    birdArea: {
      width: "24%",
      alignItems: "center",
      justifyContent: "center",
    },
    birdImage: { width: "100%", height: boxH * 1.3 },
    notes: { fontSize: f(22, 14) },
    birdEmoji: { fontSize: f(64, 34) },

    /* ---------- LETTER PICKER ---------- */
    lettersPanel: {
      ...card,
      backgroundColor: "rgba(236,248,238,0.95)",
      paddingHorizontal: f(14, 10),
      paddingVertical: f(8, 5),
      gap: f(8, 5),
    },
    lettersLabel: {
      alignSelf: "flex-start",
      backgroundColor: "#F6C877",
      borderRadius: f(10, 8),
      paddingHorizontal: f(18, 12),
      paddingVertical: 1,
      transform: [{ rotate: "-1deg" }],
    },
    lettersLabelText: {
      fontSize: labelFont,
      lineHeight: labelFont * 1.4,
      fontWeight: "900",
      color: BROWN,
    },
    lettersRow: {
      height: tileH,
      flexDirection: "row",
      gap: f(10, 6),
    },
    letterTile: {
      flex: 1,
      borderRadius: f(12, 10),
      backgroundColor: "#FFFFFF",
      borderWidth: 3,
      borderColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
    },
    letterTileActive: { borderColor: GREEN },
    letterTileText: {
      fontSize: tileFont,
      lineHeight: tileFont * 1.35,
      fontWeight: "900",
      color: "#111111",
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

const DARK_GREEN = "#17702F";