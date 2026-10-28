import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  ImageSourcePropType,
  LayoutChangeEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context";

// Put your kids illustration (transparent PNG) here, e.g.
require("../../assets/images/sinhala-writing/hero-kids.png")
const HERO_IMAGE: ImageSourcePropType | null = require("../../assets/images/sinhala-writing/hero-kids.png");

const GREEN = "#1F7A4D";
const NAVY = "#1E2A78";
const GREY = "#6B7280";

type Assessment = {
  n: number;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  tint: string;
  border: string;
  route: string | null;
};

type Module = {
  n: number;
  title: string;
  subtitle: string;
  color: string;
  tint: string;
  border: string;
  route: string;
  art: "letters" | "tracing" | "puzzle";
};

const ASSESSMENTS: Assessment[] = [
  {
    n: 1,
    title: "සිංහල ඇගයුම 1",
    subtitle: "සිංහල ලිවීම",
    emoji: "📝",
    color: "#7C4DDB",
    tint: "#F4EFFF",
    border: "#E4D9FF",
    route:  "/sinhala-writing/assessment-1",
  },
  {
    n: 2,
    title: "සිංහල ඇගයුම 2",
    subtitle: "ලිවීමේ කුසලතා",
    emoji: "📖",
    color: "#3B82F6",
    tint: "#EDF5FF",
    border: "#D3E5FF",
    route: null, // placeholder
  },
];

const MODULES: Module[] = [
  {
    n: 3,
    title: "මහාප්‍රාණ අකුරු",
    subtitle: "හඳුනා ගනිමු",
    color: "#F5B400",
    tint: "#FFF8DC",
    border: "#FCE7A6",
    route: "/sinhala-writing/mahaprana",
    art: "letters",
  },
  {
    n: 4,
    title: "අකුරු ප්‍රමාණය",
    subtitle: "ලස්සනට ලියමු",
    color: "#2FB463",
    tint: "#EBFBF0",
    border: "#CDEFD8",
    route: "/sinhala-writing/letter-size",
    art: "tracing",
  },
  {
    n: 5,
    title: "වාක්‍ය ගොඩනගමු",
    subtitle: "වාක්‍ය ලියමු",
    color: "#EC407A",
    tint: "#FFF0F5",
    border: "#FBD3E2",
    route: "/sinhala-writing/sentence-building",
    art: "puzzle",
  },
];

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/* ------------------------------------------------------------------
   All sizes come from the real screen space, so the whole page
   always fits without scrolling.
------------------------------------------------------------------- */
function computeSizes(w: number, h: number, insets: EdgeInsets) {
  const pad = clamp(Math.min(w, h) * 0.03, 8, 24);
  const availH = h - insets.top - insets.bottom - pad * 2;
  const availW = w - insets.left - insets.right - pad * 2;

  const gap = clamp(availH * 0.025, 6, 18);
  const colGap = clamp(availW * 0.015, 8, 18);
  const headerH = clamp(availH * 0.13, 40, 84);
  const rest = availH - headerH - gap * 3;

  // Height shares: hero / assessments / learning cards (add up to 1)
  const heroH = rest * 0.33;
  const row1H = rest * 0.29;
  const row2H = rest * 0.38;

  const artH = clamp(row2H * 0.55, 30, 110);

  return {
    w,
    insets,
    pad,
    availW,
    gap,
    colGap,

    // header
    headerH,
    backSize: headerH * 0.92,
    headerTitle: clamp(headerH * 0.52, 18, 44),
    headerSub: clamp(headerH * 0.21, 9, 18),

    // hero
    heroH,
    heroTop: insets.top + pad + headerH + gap,
    heroPadH: clamp(availW * 0.035, 12, 40),
    heroTitle: clamp(heroH * 0.22, 16, 46),
    heroDesc: clamp(heroH * 0.105, 11, 22),
    heroSub: clamp(heroH * 0.075, 9, 16),
    showHeroSub: heroH >= 110,
    heroImgH: heroH * 1.32,

    // assessment cards
    row1H,
    numCircle: clamp(row1H * 0.48, 22, 64),
    iconBoxW: clamp(row1H * 0.82, 30, 110),
    iconBoxH: clamp(row1H * 0.72, 28, 96),
    card1Title: clamp(row1H * 0.2, 12, 30),
    card1Sub: clamp(row1H * 0.13, 9, 18),
    arrow1: clamp(row1H * 0.36, 20, 52),
    card1PadH: clamp(row1H * 0.16, 8, 22),

    // learning cards
    row2H,
    modPad: clamp(row2H * 0.08, 6, 18),
    modNum: clamp(row2H * 0.24, 20, 56),
    modTitle: clamp(row2H * 0.13, 12, 26),
    modSub: clamp(row2H * 0.085, 9, 17),
    arrow2: clamp(row2H * 0.26, 22, 56),
    leaf: clamp(row2H * 0.09, 10, 22),
    artH,
    art: artH / 90, // scale factor for the little illustrations
  };
}

type Sizes = ReturnType<typeof computeSizes>;

export default function SinhalaWritingHome() {
  const insets = useSafeAreaInsets();
  const [size, setSize] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  const z = useMemo(
    () => computeSizes(size.w, size.h, insets),
    [size.w, size.h, insets]
  );
  const styles = useMemo(() => makeStyles(z), [z]);

  const go = (route: string | null) => {
    if (route) router.push(route as any);
  };

  /* ---------- small illustrations for the learning cards ---------- */
  const renderArt = (art: Module["art"]) => {
    const a = z.art;

    if (art === "letters") {
      return (
        <View style={styles.artBox}>
          <View style={[styles.tile, { left: 30 * a, top: 0, transform: [{ rotate: "-6deg" }] }]}>
            <Text style={[styles.tileText, { color: "#E53935" }]}>ඛ</Text>
          </View>
          <View style={[styles.tile, { left: 0, top: 38 * a, transform: [{ rotate: "-12deg" }] }]}>
            <Text style={[styles.tileText, { color: "#22A35A" }]}>ඝ</Text>
          </View>
          <View style={[styles.tile, { left: 62 * a, top: 30 * a, transform: [{ rotate: "10deg" }] }]}>
            <Text style={[styles.tileText, { color: "#3B5BDB" }]}>ඡ</Text>
          </View>
        </View>
      );
    }

    if (art === "tracing") {
      return (
        <View style={styles.artBox}>
          <View style={styles.paper}>
            <Text style={styles.paperLetter}>අ</Text>
          </View>
          <Ionicons name="pencil" size={40 * a} color="#F5A623" style={styles.pencil} />
        </View>
      );
    }

    return (
      <View style={styles.artBox}>
        <Ionicons name="extension-puzzle" size={54 * a} color="#3B82F6" style={{ position: "absolute", left: 4 * a, top: 8 * a }} />
        <Ionicons name="extension-puzzle" size={54 * a} color="#FACC15" style={{ position: "absolute", left: 46 * a, top: 0 }} />
        <Ionicons name="extension-puzzle" size={54 * a} color="#EC4899" style={{ position: "absolute", left: 22 * a, top: 40 * a }} />
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground
        source={require("../../assets/images/sinhala-writing/homebackground.png")}
        style={styles.container}
        resizeMode="cover"
        onLayout={onLayout}
      >
        {size.w > 0 && (
          <>
            <View style={styles.page}>
              {/* ================= HEADER ================= */}
              <View style={styles.header}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <Ionicons name="arrow-back" size={z.backSize * 0.5} color="#FFFFFF" />
                </TouchableOpacity>

                <View style={styles.headerTitleBox}>
                  <Text style={styles.headerTitle} numberOfLines={1}>
                    සිංහල ලිවීම
                  </Text>
                  <Text style={styles.headerSubtitle} numberOfLines={1}>
                    අපි එකට ඉගෙන ගනිමු!
                  </Text>
                </View>
              </View>

              {/* ================= HERO ================= */}
              <View style={styles.heroCard}>
                <Ionicons name="leaf" size={z.heroH * 0.12} color="#BFE6CB" style={{ position: "absolute", top: z.heroH * 0.1, left: z.heroPadH * 0.4 }} />
                <Ionicons name="leaf" size={z.heroH * 0.1} color="#CDEFD8" style={{ position: "absolute", bottom: z.heroH * 0.12, left: z.heroPadH * 0.3 }} />
                <Ionicons name="leaf" size={z.heroH * 0.14} color="#BFE6CB" style={{ position: "absolute", top: z.heroH * 0.12, right: z.heroPadH * 0.6 }} />
                <Ionicons name="leaf" size={z.heroH * 0.12} color="#CDEFD8" style={{ position: "absolute", bottom: z.heroH * 0.12, right: z.heroPadH * 0.4 }} />

                <View style={styles.heroTextBox}>
                  <Text style={styles.heroTitle} numberOfLines={1} adjustsFontSizeToFit>
                    ආයුබෝවන්! 👋
                  </Text>
                  <Text style={styles.heroDescription} numberOfLines={2} adjustsFontSizeToFit>
                    සිංහල ලිවීමේ හැකියාව වැඩි දියුණු කරගනිමු.
                  </Text>
                  {z.showHeroSub && (
                    <Text style={styles.heroSubText} numberOfLines={1} adjustsFontSizeToFit>
                      ඔබට අවශ්‍ය පාඩමක් තෝරාගෙන ඉගෙනීම ආරම්භ කරන්න.
                    </Text>
                  )}
                </View>
              </View>

              {/* ================= ROW 1: ASSESSMENTS ================= */}
              <View style={[styles.row, { height: z.row1H }]}>
                {ASSESSMENTS.map((a) => (
                  <TouchableOpacity
                    key={a.n}
                    activeOpacity={0.85}
                    onPress={() => go(a.route)}
                    style={[styles.assessmentCard, { backgroundColor: a.tint, borderColor: a.border }]}
                  >
                    <View style={[styles.numberCircle, { backgroundColor: a.color }]}>
                      <Text style={styles.numberText}>{a.n}</Text>
                    </View>

                    <View style={[styles.assessmentIconBox, { backgroundColor: a.border }]}>
                      <Text style={styles.assessmentEmoji}>{a.emoji}</Text>
                    </View>

                    <View style={styles.assessmentTextBox}>
                      <Text style={styles.cardTitle} numberOfLines={1} adjustsFontSizeToFit>
                        {a.title}
                      </Text>
                      <Text style={styles.cardSubtitle} numberOfLines={1}>
                        {a.subtitle}
                      </Text>
                    </View>

                    <View style={[styles.arrow1, { backgroundColor: a.border }]}>
                      <Ionicons name="chevron-forward" size={z.arrow1 * 0.5} color={a.color} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* ================= ROW 2: LEARNING CARDS ================= */}
              <View style={[styles.row, { height: z.row2H }]}>
                {MODULES.map((m) => (
                  <TouchableOpacity
                    key={m.n}
                    activeOpacity={0.85}
                    onPress={() => go(m.route)}
                    style={[styles.moduleCard, { backgroundColor: m.tint, borderColor: m.border }]}
                  >
                    <Ionicons name="leaf" size={z.leaf} color="#9ED8A4" style={styles.leaf} />

                    {/* Left: number + illustration */}
                    <View style={styles.moduleLeft}>
                      <View style={[styles.moduleNumber, { backgroundColor: m.color }]}>
                        <Text style={styles.moduleNumberText}>{m.n}</Text>
                      </View>
                      <View style={styles.artWrap}>{renderArt(m.art)}</View>
                    </View>

                    {/* Right: title + arrow */}
                    <View style={styles.moduleRight}>
                      <View>
                        <Text style={styles.moduleTitle} numberOfLines={1} adjustsFontSizeToFit>
                          {m.title}
                        </Text>
                        <Text style={styles.moduleSubtitle} numberOfLines={1}>
                          {m.subtitle}
                        </Text>
                      </View>

                      <View style={[styles.arrow2, { backgroundColor: m.color }]}>
                        <Ionicons name="chevron-forward" size={z.arrow2 * 0.55} color="#FFFFFF" />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Kids illustration – sits on the right of the hero and pokes out above it */}
            {HERO_IMAGE ? (
              <Image
                source={HERO_IMAGE}
                resizeMode="contain"
                pointerEvents="none"
                style={styles.heroImage}
              />
            ) : null}
          </>
        )}
      </ImageBackground>
    </>
  );
}

const makeStyles = (z: Sizes) =>
  StyleSheet.create({
    container: { flex: 1 },

    page: {
      flex: 1,
      paddingTop: z.insets.top + z.pad,
      paddingBottom: z.insets.bottom + z.pad,
      paddingLeft: z.insets.left + z.pad,
      paddingRight: z.insets.right + z.pad,
      gap: z.gap,
    },

    row: { flexDirection: "row", gap: z.colGap },

    /* ================= HEADER ================= */

    header: {
      height: z.headerH,
      flexDirection: "row",
      alignItems: "center",
    },

    backButton: {
      width: z.backSize,
      height: z.backSize,
      borderRadius: z.backSize / 2,
      backgroundColor: "#2E8B57",
      borderWidth: 3,
      borderColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    },

    headerTitleBox: { flex: 1, marginLeft: z.headerH * 0.28 },

    headerTitle: {
      fontSize: z.headerTitle,
      lineHeight: z.headerTitle * 1.3,
      fontWeight: "900",
      color: GREEN,
      textShadowColor: "#FFFFFF",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 8,
    },

    headerSubtitle: {
      fontSize: z.headerSub,
      lineHeight: z.headerSub * 1.3,
      fontWeight: "700",
      color: "#24324F",
      textShadowColor: "#FFFFFF",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 6,
    },

    /* ================= HERO ================= */

    heroCard: {
      height: z.heroH,
      marginHorizontal: z.availW * 0.05,
      backgroundColor: "rgba(255,255,255,0.88)",
      borderRadius: clamp(z.heroH * 0.16, 14, 32),
      borderWidth: 1.5,
      borderColor: "#D5EEDC",
      paddingHorizontal: z.heroPadH,
      justifyContent: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },

    heroTextBox: { maxWidth: "55%" },

    heroTitle: {
      fontSize: z.heroTitle,
      lineHeight: z.heroTitle * 1.4,
      fontWeight: "900",
      color: GREEN,
    },

    heroDescription: {
      fontSize: z.heroDesc,
      lineHeight: z.heroDesc * 1.5,
      fontWeight: "800",
      color: NAVY,
    },

    heroSubText: {
      fontSize: z.heroSub,
      lineHeight: z.heroSub * 1.5,
      color: GREY,
      marginTop: 2,
    },

    heroImage: {
      position: "absolute",
      height: z.heroImgH,
      width: z.heroImgH * 1.55,
      top: z.heroTop + z.heroH - z.heroImgH,
      right: z.insets.right + z.pad + z.availW * 0.12,
    },

    /* ================= ASSESSMENT CARDS ================= */

    assessmentCard: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: clamp(z.row1H * 0.2, 12, 28),
      borderWidth: 1.5,
      paddingHorizontal: z.card1PadH,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.07,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    },

    numberCircle: {
      width: z.numCircle,
      height: z.numCircle,
      borderRadius: z.numCircle / 2,
      alignItems: "center",
      justifyContent: "center",
    },

    numberText: {
      color: "#FFFFFF",
      fontSize: z.numCircle * 0.42,
      fontWeight: "900",
    },

    assessmentIconBox: {
      width: z.iconBoxW,
      height: z.iconBoxH,
      borderRadius: z.iconBoxH * 0.22,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: z.card1PadH,
    },

    assessmentEmoji: { fontSize: z.iconBoxH * 0.55 },

    assessmentTextBox: { flex: 1, marginLeft: z.card1PadH },

    cardTitle: {
      fontSize: z.card1Title,
      lineHeight: z.card1Title * 1.35,
      fontWeight: "900",
      color: NAVY,
    },

    cardSubtitle: {
      fontSize: z.card1Sub,
      lineHeight: z.card1Sub * 1.35,
      color: "#3A4A7A",
    },

    arrow1: {
      width: z.arrow1,
      height: z.arrow1,
      borderRadius: z.arrow1 / 2,
      alignItems: "center",
      justifyContent: "center",
    },

    /* ================= LEARNING CARDS ================= */

    moduleCard: {
      flex: 1,
      flexDirection: "row",
      borderRadius: clamp(z.row2H * 0.14, 12, 28),
      borderWidth: 1.5,
      padding: z.modPad,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.07,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    },

    leaf: {
      position: "absolute",
      top: z.modPad,
      left: "42%",
    },

    moduleLeft: {
      width: 120 * z.art,
      alignSelf: "stretch",
    },

    moduleNumber: {
      width: z.modNum,
      height: z.modNum,
      borderRadius: z.modNum / 2,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
    },

    moduleNumberText: {
      color: "#FFFFFF",
      fontSize: z.modNum * 0.42,
      fontWeight: "900",
    },

    artWrap: {
      position: "absolute",
      bottom: 0,
      right: 0,
    },

    moduleRight: {
      flex: 1,
      marginLeft: z.modPad,
      justifyContent: "space-between",
      paddingTop: z.modNum * 0.3,
    },

    moduleTitle: {
      fontSize: z.modTitle,
      lineHeight: z.modTitle * 1.35,
      fontWeight: "900",
      color: NAVY,
    },

    moduleSubtitle: {
      fontSize: z.modSub,
      lineHeight: z.modSub * 1.35,
      color: "#3A4A7A",
    },

    arrow2: {
      alignSelf: "flex-end",
      width: z.arrow2,
      height: z.arrow2,
      borderRadius: z.arrow2 / 2,
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },

    /* ================= CARD ILLUSTRATIONS ================= */

    artBox: { width: 116 * z.art, height: z.artH },

    tile: {
      position: "absolute",
      width: 50 * z.art,
      height: 50 * z.art,
      borderRadius: 12 * z.art,
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },

    tileText: { fontSize: 30 * z.art, fontWeight: "900" },

    paper: {
      position: "absolute",
      left: 4 * z.art,
      top: 6 * z.art,
      width: 76 * z.art,
      height: 78 * z.art,
      borderRadius: 8 * z.art,
      backgroundColor: "#FFFFFF",
      borderWidth: 1,
      borderColor: "#E5E7EB",
      alignItems: "center",
      justifyContent: "center",
      transform: [{ rotate: "-8deg" }],
      elevation: 2,
    },

    paperLetter: {
      fontSize: 48 * z.art,
      color: "#B0B8C4",
      fontWeight: "300",
    },

    pencil: {
      position: "absolute",
      right: 0,
      bottom: 0,
      transform: [{ rotate: "15deg" }],
    },
  });