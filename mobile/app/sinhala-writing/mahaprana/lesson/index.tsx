import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* The layout is designed for a 1100 x 640 screen,
   then scaled up or down to fit the real screen. */
const DESIGN_WIDTH = 1100;
const DESIGN_HEIGHT = 640;

const LETTERS = [
  { letter: "ඛ", background: "#FFE4EA" },
  { letter: "ඝ", background: "#E3F1FF" },
  { letter: "ඡ", background: "#EEE6FF" },
  { letter: "ඣ", background: "#E3F7E8" },
  { letter: "ඨ", background: "#FFE9F6" },
  { letter: "ඪ", background: "#FFF6DA" },
  { letter: "ථ", background: "#E6F3FF" },
  { letter: "ධ", background: "#FFF2DA" },
  { letter: "ඵ", background: "#E3EBFF" },
  { letter: "භ", background: "#E3F7E8" },
];

export default function MahapranaLesson() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const usableWidth = width - insets.left - insets.right;
  const usableHeight = height - insets.top - insets.bottom;

  const scale = Math.min(
    usableWidth / DESIGN_WIDTH,
    usableHeight / DESIGN_HEIGHT,
    1.3
  );

  const styles = useMemo(() => createStyles(scale), [scale]);

  return (
    <ImageBackground
      source={require("../../../../assets/images/sinhala-writing/mhprnaintro.png")}
      style={styles.container}
      resizeMode="cover"
    >
      {/* HIDE THE DEFAULT HEADER BAR */}
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={[
          styles.screen,
          {
            paddingTop: insets.top + styles.screen.paddingTop,
            paddingBottom: insets.bottom + styles.screen.paddingBottom,
            paddingLeft: insets.left + styles.screen.paddingLeft,
            paddingRight: insets.right + styles.screen.paddingRight,
          },
        ]}
      >
        {/* =====================================================
            TOP BAR
        ====================================================== */}

        <View style={styles.topBar}>
          {/* BACK BUTTON */}
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={30 * scale} color="#2446D8" />
          </Pressable>

          {/* PAGE TITLE */}
          <Text
            style={styles.pageTitle}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            මහාප්‍රාණ අකුරු මොනවාද?
          </Text>

          {/* EMPTY SPACE (keeps the title centered) */}
          <View style={styles.topBarSpacer} />
        </View>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <View style={styles.mainContent}>
          {/* =================================================
              LEFT PANEL
          ================================================== */}

          <View style={styles.leftPanel}>
            {/* INTRO: CHARACTER + SPEECH BUBBLE */}
            <View style={styles.introArea}>
              <View style={styles.characterArea}>
                <Image
                  source={require("../../../../assets/images/sinhala-writing/writinggirl.png")}
                  style={styles.characterImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.introBubble}>
                <View style={styles.bubbleTail} />

                <Text style={styles.introTitle}>
                  මහාප්‍රාණ අකුරු කියන්නේ{"\n"}මොනවාද?
                </Text>

                <Text style={styles.introText}>
                  සිංහල භාෂාවේ ගැඹුරු හඬින් හා පැහැදිලිව උච්චාරණය කරන
                  විශේෂ අකුරු මහාප්‍රාණ අකුරු ලෙස හැඳින්වේ.
                </Text>
              </View>
            </View>

            {/* MAHAPRANA LETTERS */}
            <View style={styles.lettersPanel}>
              <View style={styles.lettersPill}>
                <Text style={styles.lettersPillText}>මහාප්‍රාණ අකුරු</Text>
              </View>

              <View style={styles.lettersGrid}>
                {LETTERS.map((item) => (
                  <LetterCard
                    key={item.letter}
                    letter={item.letter}
                    background={item.background}
                    styles={styles}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* =================================================
              RIGHT PANEL
          ================================================== */}

          <View style={styles.rightPanel}>
            {/* TITLE */}
            <View style={styles.differencePill}>
              <Text style={styles.differenceTitle}>
                අල්පප්‍රාණ සහ මහාප්‍රාණ අකුරු අතර වෙනස
              </Text>
            </View>

            {/* DESCRIPTION */}
            <Text style={styles.descriptionText}>
              අල්පප්‍රාණ අකුරු උච්චාරණය කරන විට වායු ප්‍රවාහය අඩුයි.
              {"\n"}
              මහාප්‍රාණ අකුරු උච්චාරණය කරන විට වායු ප්‍රවාහය තදින් පිටවේ.
            </Text>

            {/* COMPARISON CARDS */}
            <View style={styles.comparisonRow}>
              <ComparisonCard
                title="අල්පප්‍රාණ අකුර (ක)"
                letter="ක"
                caption="වායු ප්‍රවාහය අඩුයි"
                headerColor="#1F74E0"
                borderColor="#CFE4FF"
                bubbleColor="#E3F0FF"
                strongAir={false}
                styles={styles}
              />

              <ComparisonCard
                title="මහාප්‍රාණ අකුර (ඛ)"
                letter="ඛ"
                caption="වායු ප්‍රවාහය තදින් පිටවේ"
                headerColor="#EE4A72"
                borderColor="#FFD0DC"
                bubbleColor="#FFE4EB"
                strongAir
                styles={styles}
              />
            </View>

            {/* MEMORY TIP */}
            <View style={styles.tipBox}>
              <Text style={styles.tipEmoji}>💡</Text>

              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>මතක තබාගන්න!</Text>
                <Text style={styles.tipText}>
                  <Text style={styles.tipBold}>ක ↔ ඛ</Text> වැනි අකුරු අතර
                  වෙනස හඳුනාගැනීම වැදගත් වේ.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* =====================================================
            NEXT BUTTON
        ====================================================== */}

        <View style={styles.bottomRow}>
          <Pressable
            style={({ pressed }) => [
              styles.nextButton,
              pressed && styles.nextButtonPressed,
            ]}
            onPress={() => {
              // Next page will be connected later.
            }}
          >
            <Text style={styles.nextButtonText}>ඊළඟට</Text>
            <Ionicons name="chevron-forward" size={28 * scale} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

/* =============================================================
   LETTER CARD
============================================================= */

function LetterCard({
  letter,
  background,
  styles,
}: {
  letter: string;
  background: string;
  styles: Styles;
}) {
  return (
    <View style={[styles.letterCard, { backgroundColor: background }]}>
      <Text style={styles.letterText}>{letter}</Text>
    </View>
  );
}

/* =============================================================
   COMPARISON CARD
============================================================= */

function ComparisonCard({
  title,
  letter,
  caption,
  headerColor,
  borderColor,
  bubbleColor,
  strongAir,
  styles,
}: {
  title: string;
  letter: string;
  caption: string;
  headerColor: string;
  borderColor: string;
  bubbleColor: string;
  strongAir: boolean;
  styles: Styles;
}) {
  return (
    <View style={[styles.comparisonCard, { borderColor }]}>
      <View style={[styles.comparisonHeader, { backgroundColor: headerColor }]}>
        <Text style={styles.comparisonHeaderText}>{title}</Text>
      </View>

      {/* To use mouth pictures, replace this View with an <Image /> */}
      <View style={styles.mouthArea}>
        <Text style={styles.mouthEmoji}>👄</Text>
        <Text style={strongAir ? styles.strongAir : styles.softAir}>
          {strongAir ? "➜➜💨" : "➜"}
        </Text>
      </View>

      <View style={[styles.letterBubble, { backgroundColor: bubbleColor }]}>
        <Text style={styles.comparisonLetter}>{letter}</Text>
      </View>

      <Text style={styles.airCaption}>{caption}</Text>
    </View>
  );
}

/* =============================================================
   STYLES (every size is multiplied by the screen scale)
============================================================= */

type Styles = ReturnType<typeof createStyles>;

function createStyles(scale: number) {
  const z = (size: number) => size * scale;

  return StyleSheet.create({
    /* MAIN */
    container: { flex: 1 },
    screen: {
      flex: 1,
      paddingHorizontal: z(20),
      paddingLeft: z(20),
      paddingRight: z(20),
      paddingTop: z(10),
      paddingBottom: z(10),
    },

    /* TOP BAR */
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: z(10),
    },
    backButton: {
      width: z(50),
      height: z(50),
      borderRadius: z(25),
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.18,
      shadowRadius: 5,
    },
    pageTitle: {
      flex: 1,
      fontSize: z(30),
      fontWeight: "900",
      color: "#173DC7",
      textAlign: "center",
    },
    topBarSpacer: {
      width: z(50),
    },

    /* MAIN CONTENT */
    mainContent: {
      flex: 1,
      flexDirection: "row",
      gap: z(14),
    },

    /* LEFT PANEL */
    leftPanel: {
      flex: 1,
      backgroundColor: "rgba(255,255,255,0.92)",
      borderRadius: z(24),
      padding: z(8),
      borderWidth: 2,
      borderColor: "#FFFFFF",
      elevation: 5,
    },
    introArea: {
      flex: 1.1,
      flexDirection: "row",
      alignItems: "center",
    },
    characterArea: {
      width: "30%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    characterImage: {
      width: "100%",
      height: "100%",
    },
    characterEmoji: {
      fontSize: z(100),
      lineHeight: z(130),
    },
    introBubble: {
      flex: 1,
      backgroundColor: "#FFF8DC",
      borderRadius: z(24),
      paddingHorizontal: z(14),
      paddingVertical: z(12),
      marginLeft: z(12),
      borderWidth: 2,
      borderColor: "#FFF0B8",
      alignItems: "center",
    },
    bubbleTail: {
      position: "absolute",
      left: -z(11),
      top: "45%",
      width: z(20),
      height: z(20),
      backgroundColor: "#FFF8DC",
      borderLeftWidth: 2,
      borderBottomWidth: 2,
      borderColor: "#FFF0B8",
      transform: [{ rotate: "45deg" }],
    },
    introTitle: {
      fontSize: z(24),
      lineHeight: z(34),
      fontWeight: "900",
      color: "#1638C2",
      textAlign: "center",
      marginBottom: z(6),
    },
    introText: {
      fontSize: z(16),
      lineHeight: z(26),
      fontWeight: "600",
      color: "#252525",
      textAlign: "center",
    },

    /* LETTERS PANEL */
    lettersPanel: {
      flex: 1,
      marginTop: z(8),
      backgroundColor: "#F3EEFF",
      borderRadius: z(20),
      paddingHorizontal: z(14),
      paddingTop: z(10),
      paddingBottom: z(12),
    },
    lettersPill: {
      alignSelf: "center",
      backgroundColor: "#6A3BEA",
      paddingHorizontal: z(36),
      paddingVertical: z(6),
      borderRadius: z(22),
      marginBottom: z(10),
      elevation: 3,
    },
    lettersPillText: {
      color: "#FFFFFF",
      fontSize: z(20),
      lineHeight: z(28),
      fontWeight: "900",
    },
    lettersGrid: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignContent: "space-between",
    },
    letterCard: {
      width: "18%",
      height: "46%",
      borderRadius: z(14),
      borderWidth: 3,
      borderColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      elevation: 2,
    },
    letterText: {
      fontSize: z(36),
      lineHeight: z(46),
      fontWeight: "900",
      color: "#111111",
    },

    /* RIGHT PANEL */
    rightPanel: {
      flex: 1,
      backgroundColor: "rgba(255,255,255,0.94)",
      borderRadius: z(24),
      padding: z(12),
      borderWidth: 2,
      borderColor: "#FFFFFF",
      elevation: 6,
    },
    differencePill: {
      backgroundColor: "#DCEBFF",
      borderRadius: z(20),
      paddingHorizontal: z(14),
      paddingVertical: z(8),
      alignItems: "center",
    },
    differenceTitle: {
      fontSize: z(20),
      lineHeight: z(28),
      fontWeight: "900",
      color: "#173DB7",
      textAlign: "center",
    },
    descriptionText: {
      fontSize: z(15),
      lineHeight: z(24),
      fontWeight: "600",
      color: "#333333",
      textAlign: "center",
      marginVertical: z(6),
    },

    /* COMPARISON CARDS */
    comparisonRow: {
      flex: 1,
      flexDirection: "row",
      gap: z(12),
    },
    comparisonCard: {
      flex: 1,
      borderRadius: z(18),
      borderWidth: 2,
      backgroundColor: "#FFFFFF",
      overflow: "hidden",
      paddingBottom: z(6),
    },
    comparisonHeader: {
      paddingVertical: z(7),
      alignItems: "center",
    },
    comparisonHeaderText: {
      color: "#FFFFFF",
      fontSize: z(16),
      lineHeight: z(22),
      fontWeight: "900",
      textAlign: "center",
    },
    mouthArea: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: z(6),
    },
    mouthEmoji: {
      fontSize: z(56),
      lineHeight: z(70),
    },
    softAir: {
      fontSize: z(26),
      fontWeight: "900",
      color: "#3AA6FF",
    },
    strongAir: {
      fontSize: z(24),
      fontWeight: "900",
      color: "#3AA6FF",
    },
    letterBubble: {
      alignSelf: "center",
      width: "60%",
      minHeight: z(42),
      borderRadius: z(22),
      alignItems: "center",
      justifyContent: "center",
    },
    comparisonLetter: {
      fontSize: z(28),
      lineHeight: z(38),
      fontWeight: "900",
      color: "#111111",
    },
    airCaption: {
      fontSize: z(14),
      lineHeight: z(20),
      fontWeight: "700",
      color: "#333333",
      textAlign: "center",
      paddingTop: z(4),
    },

    /* TIP */
    tipBox: {
      marginTop: z(8),
      backgroundColor: "#FFF5C9",
      borderRadius: z(18),
      paddingHorizontal: z(14),
      paddingVertical: z(8),
      flexDirection: "row",
      alignItems: "center",
    },
    tipEmoji: {
      fontSize: z(36),
      lineHeight: z(46),
      marginRight: z(12),
    },
    tipContent: { flex: 1 },
    tipTitle: {
      fontSize: z(18),
      lineHeight: z(26),
      fontWeight: "900",
      color: "#E0451B",
    },
    tipText: {
      fontSize: z(14),
      lineHeight: z(22),
      fontWeight: "600",
      color: "#333333",
    },
    tipBold: {
      fontWeight: "900",
      color: "#111111",
    },

    /* NEXT BUTTON */
    bottomRow: {
      alignItems: "flex-end",
      marginTop: z(8),
    },
    nextButton: {
      minWidth: z(190),
      height: z(52),
      paddingHorizontal: z(26),
      borderRadius: z(28),
      backgroundColor: "#4B2BE8",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: z(8),
      elevation: 7,
      shadowColor: "#3C18B5",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 6,
    },
    nextButtonPressed: {
      transform: [{ scale: 0.97 }],
      opacity: 0.85,
    },
    nextButtonText: {
      color: "#FFFFFF",
      fontSize: z(20),
      lineHeight: z(28),
      fontWeight: "900",
    },
  });
}