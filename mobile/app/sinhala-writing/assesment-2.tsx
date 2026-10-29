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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

const TITLE = "සිංහල ඇගයුම 2";
const SUBTITLE = "සිංහල ලිවීම - මූලික පරීක්ෂණය";
const SENTENCE = "✏️ ඔබ කැමති වාක්‍යයක් ලියන්න";

const BACKGROUND = require("../../assets/images/sinhala-writing/homebackground.png");

// Girl writing illustration (transparent PNG), e.g.
// require("../../assets/images/sinhala-writing/girl-writing.png")
const GIRL_IMAGE: ImageSourcePropType | null = null;

const GREEN = "#2E7D4F";
const NAVY = "#1E2A78";
const GREY = "#6B7280";

type Step = {
  n: number;
  color: string;
  text: string;
  icon: { emoji?: string; ion?: keyof typeof Ionicons.glyphMap };
};

const STEPS: Step[] = [
  { n: 1, color: "#F5B400", text: "ඔබ කැමති වාක්‍යයක් ලියන්න.", icon: { emoji: "📖" } },
  { n: 2, color: "#2F80ED", text: "ලියූ වාක්‍යයේ පින්තූරයක් ගන්න.", icon: { ion: "camera" } },
  { n: 3, color: "#EC407A", text: "පැහැදිලිව පෙනෙන සේ ඡායාරූපය උඩුගත කරන්න.", icon: { ion: "image" } },
];

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/* All sizes come from the real screen space → no scrolling needed. */
function computeSizes(w: number, h: number, insets: EdgeInsets) {
  const pad = clamp(Math.min(w, h) * 0.03, 8, 24);
  const availH = h - insets.top - insets.bottom - pad * 2;
  const availW = w - insets.left - insets.right - pad * 2;

  const gap = clamp(availH * 0.025, 6, 18);
  const headerH = clamp(availH * 0.15, 44, 92);
  const bodyH = availH - headerH - gap;

  const leftW = availW * 0.34;
  const topH = bodyH * 0.42;
  const botH = bodyH - topH - gap;

  return {
    insets,
    pad,
    gap,

    // header
    headerH,
    headerW: availW * 0.52,
    backSize: headerH * 0.72,
    headerEmoji: headerH * 0.55,
    headerTitle: clamp(headerH * 0.36, 16, 36),
    headerSub: clamp(headerH * 0.2, 9, 18),

    // left panel
    bodyH,
    leftW,
    panelPad: clamp(bodyH * 0.04, 8, 22),
    tipH: clamp(bodyH * 0.11, 30, 70),
    tipTitle: clamp(bodyH * 0.05, 13, 28),
    stepNum: clamp(bodyH * 0.085, 24, 54),
    stepIcon: clamp(bodyH * 0.085, 22, 52),
    stepText: clamp(bodyH * 0.046, 11, 22),

    // top-right card
    topH,
    cardPad: clamp(bodyH * 0.035, 8, 20),
    topCircle: clamp(topH * 0.24, 28, 66),
    cardTitle: clamp(topH * 0.1, 13, 28),
    cardSub: clamp(topH * 0.065, 9, 16),
    sentence: clamp(topH * 0.15, 16, 46),
    girlH: topH * 1.05,

    // bottom-right card
    botH,
    botCircle: clamp(botH * 0.18, 28, 66),
    btnH: clamp(botH * 0.17, 34, 64),
    btnFont: clamp(botH * 0.065, 11, 18),
    previewIcon: clamp(botH * 0.16, 22, 60),
    previewText: clamp(botH * 0.06, 10, 18),
  };
}

type Sizes = ReturnType<typeof computeSizes>;

export default function SinhalaAssessment2() {
  const insets = useSafeAreaInsets();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  const z = useMemo(() => computeSizes(size.w, size.h, insets), [size.w, size.h, insets]);
  const styles = useMemo(() => makeStyles(z), [z]);

  /* ---------------- photo actions ---------------- */

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("අවසර අවශ්‍යයි", "කැමරාව භාවිතා කිරීමට අවසර දෙන්න.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("අවසර අවශ්‍යයි", "ගැලරිය භාවිතා කිරීමට අවසර දෙන්න.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground source={BACKGROUND} style={styles.container} resizeMode="cover" onLayout={onLayout}>
        {size.w > 0 && (
          <View style={styles.page}>
            {/* ================= HEADER ================= */}
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={0.8} style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={z.backSize * 0.55} color="#FFFFFF" />
              </TouchableOpacity>

              <Text style={styles.headerEmoji}>📝</Text>

              <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>
                  {TITLE}
                </Text>
                <Text style={styles.headerSub} numberOfLines={1} adjustsFontSizeToFit>
                  {SUBTITLE}
                </Text>
              </View>
            </View>

            {/* ================= BODY ================= */}
            <View style={styles.body}>
              {/* ---------- LEFT: Instructions ---------- */}
              <View style={styles.leftPanel}>
                <View style={styles.tipHeader}>
                  <View style={styles.tipIcon}>
                    <Text style={{ fontSize: z.tipH * 0.5 }}>💡</Text>
                  </View>
                  <Text style={styles.tipTitle}>උපදෙස්</Text>
                </View>

                <View style={styles.steps}>
                  {STEPS.map((s) => (
                    <View key={s.n} style={styles.stepRow}>
                      <View style={[styles.stepNum, { backgroundColor: s.color }]}>
                        <Text style={styles.stepNumText}>{s.n}</Text>
                      </View>

                      <View style={styles.stepIconBox}>
                        {s.icon.emoji ? (
                          <Text style={{ fontSize: z.stepIcon * 0.85 }}>{s.icon.emoji}</Text>
                        ) : (
                          <Ionicons name={s.icon.ion!} size={z.stepIcon} color="#2F80ED" />
                        )}
                      </View>

                      <Text style={styles.stepText} numberOfLines={3} adjustsFontSizeToFit>
                        {s.text}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* ---------- RIGHT ---------- */}
              <View style={styles.right}>
                {/* ===== Sentence card ===== */}
                <View style={styles.sentenceCard}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.cardCircle, styles.purpleCircle]}>
                      <Ionicons name="clipboard" size={z.topCircle * 0.5} color="#FFFFFF" />
                    </View>
                    <View style={styles.cardHeaderText}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        ලියන වාක්‍යය
                      </Text>
                      <Text style={styles.cardSub} numberOfLines={1} adjustsFontSizeToFit>
                        ඔබ කැමති ඕනෑම වාක්‍යයක් ඔබේ පොතේ ලියන්න.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sentenceBox}>
                    <Text style={styles.sentenceText} numberOfLines={2} adjustsFontSizeToFit>
                      {SENTENCE}
                    </Text>
                  </View>

                  {GIRL_IMAGE ? (
                    <Image source={GIRL_IMAGE} resizeMode="contain" style={styles.girlImage} />
                  ) : null}
                </View>

                {/* ===== Photo card ===== */}
                <View style={styles.photoCard}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.cardCircle, styles.greenCircle]}>
                      <Ionicons name="camera" size={z.botCircle * 0.5} color="#FFFFFF" />
                    </View>
                    <View style={styles.cardHeaderText}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        ඡායාරූපය ගන්න
                      </Text>
                      <Text style={styles.cardSub} numberOfLines={1} adjustsFontSizeToFit>
                        ඔබ ලියූ වාක්‍යය පැහැදිලිව පෙනෙන සේ ඡායාරූපයක් ගන්න.
                      </Text>
                    </View>
                  </View>

                  {/* Preview */}
                  <TouchableOpacity activeOpacity={0.9} style={styles.preview} onPress={takePhoto}>
                    {photoUri ? (
                      <>
                        <Image source={{ uri: photoUri }} style={styles.previewImage} resizeMode="cover" />
                        <TouchableOpacity activeOpacity={0.8} style={styles.removeBadge} onPress={() => setPhotoUri(null)}>
                          <Ionicons name="close" size={z.previewText * 1.3} color="#FFFFFF" />
                        </TouchableOpacity>
                        <View style={styles.doneBadge}>
                          <Ionicons name="checkmark" size={z.previewText * 1.3} color="#FFFFFF" />
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={[styles.corner, styles.cTL]} />
                        <View style={[styles.corner, styles.cTR]} />
                        <View style={[styles.corner, styles.cBL]} />
                        <View style={[styles.corner, styles.cBR]} />
                        <Ionicons name="camera" size={z.previewIcon} color="#FFFFFF" />
                        <Text style={styles.previewText}>ඡායාරූපය ගන්න</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {/* Buttons */}
                  <View style={styles.btnRow}>
                    <TouchableOpacity activeOpacity={0.85} style={[styles.btn, styles.btnLight]} onPress={pickFromGallery}>
                      <Ionicons name="images-outline" size={z.btnFont * 1.6} color={GREEN} />
                      <Text style={[styles.btnText, { color: GREEN }]} numberOfLines={1}>
                        ගැලරියෙන් තෝරන්න
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.85} style={[styles.btn, styles.btnDark]} onPress={takePhoto}>
                      <Ionicons name="camera" size={z.btnFont * 1.6} color="#FFFFFF" />
                      <Text style={[styles.btnText, { color: "#FFFFFF" }]} numberOfLines={1}>
                        කැමරාවෙන් ගන්න
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </ImageBackground>
    </>
  );
}

const makeStyles = (z: Sizes) => {
  const corner = clamp(z.botH * 0.14, 14, 34);
  const cornerInsetV = clamp(z.botH * 0.04, 5, 14);
  const cornerInsetH = clamp(z.botH * 0.08, 10, 28);

  const cardShadow = {
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  };

  return StyleSheet.create({
    container: { flex: 1 },

    page: {
      flex: 1,
      paddingTop: z.insets.top + z.pad,
      paddingBottom: z.insets.bottom + z.pad,
      paddingLeft: z.insets.left + z.pad,
      paddingRight: z.insets.right + z.pad,
      gap: z.gap,
    },

    /* ================= HEADER ================= */
    header: {
      height: z.headerH,
      width: z.headerW,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: GREEN,
      borderRadius: z.headerH * 0.4,
      paddingHorizontal: z.headerH * 0.18,
      gap: z.headerH * 0.18,
      elevation: 5,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    },
    backButton: {
      width: z.backSize,
      height: z.backSize,
      borderRadius: z.backSize / 2,
      borderWidth: 2.5,
      borderColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
    },
    headerEmoji: { fontSize: z.headerEmoji },
    headerTitle: {
      fontSize: z.headerTitle,
      lineHeight: z.headerTitle * 1.35,
      fontWeight: "900",
      color: "#FFFFFF",
    },
    headerSub: {
      fontSize: z.headerSub,
      lineHeight: z.headerSub * 1.35,
      fontWeight: "600",
      color: "#E3F5EA",
    },

    /* ================= BODY ================= */
    body: { height: z.bodyH, flexDirection: "row", gap: z.gap },

    /* ---------- LEFT PANEL ---------- */
    leftPanel: {
      ...cardShadow,
      width: z.leftW,
      backgroundColor: "rgba(255,252,240,0.95)",
      borderRadius: clamp(z.bodyH * 0.06, 14, 30),
      padding: z.panelPad,
    },
    tipHeader: {
      height: z.tipH,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFE08A",
      borderRadius: z.tipH / 2,
      paddingHorizontal: z.tipH * 0.12,
    },
    tipIcon: {
      width: z.tipH * 0.78,
      height: z.tipH * 0.78,
      borderRadius: z.tipH * 0.39,
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
    },
    tipTitle: {
      marginLeft: z.tipH * 0.25,
      fontSize: z.tipTitle,
      lineHeight: z.tipTitle * 1.4,
      fontWeight: "900",
      color: "#C2410C",
    },
    steps: { flex: 1, justifyContent: "space-evenly", paddingTop: z.panelPad * 0.5 },
    stepRow: { flexDirection: "row", alignItems: "center" },
    stepNum: {
      width: z.stepNum,
      height: z.stepNum,
      borderRadius: z.stepNum / 2,
      alignItems: "center",
      justifyContent: "center",
    },
    stepNumText: { color: "#FFFFFF", fontSize: z.stepNum * 0.45, fontWeight: "900" },
    stepIconBox: {
      width: z.stepIcon * 1.3,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: z.stepNum * 0.25,
    },
    stepText: {
      flex: 1,
      fontSize: z.stepText,
      lineHeight: z.stepText * 1.5,
      fontWeight: "600",
      color: "#1F2937",
    },

    /* ---------- RIGHT ---------- */
    right: { flex: 1, gap: z.gap },
    cardHeader: { flexDirection: "row", alignItems: "center" },
    cardCircle: { alignItems: "center", justifyContent: "center" },
    purpleCircle: {
      width: z.topCircle,
      height: z.topCircle,
      borderRadius: z.topCircle / 2,
      backgroundColor: "#6D3FE0",
    },
    greenCircle: {
      width: z.botCircle,
      height: z.botCircle,
      borderRadius: z.botCircle / 2,
      backgroundColor: "#2E8B57",
    },
    cardHeaderText: { flex: 1, marginLeft: z.cardPad },
    cardTitle: { fontSize: z.cardTitle, lineHeight: z.cardTitle * 1.4, fontWeight: "900", color: NAVY },
    cardSub: { fontSize: z.cardSub, lineHeight: z.cardSub * 1.4, color: GREY },

    /* ===== Sentence card ===== */
    sentenceCard: {
      ...cardShadow,
      height: z.topH,
      backgroundColor: "rgba(246,242,255,0.95)",
      borderRadius: clamp(z.topH * 0.12, 14, 30),
      padding: z.cardPad,
      gap: z.cardPad * 0.6,
    },
    sentenceBox: {
      flex: 1,
      width: GIRL_IMAGE ? "74%" : "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: clamp(z.topH * 0.08, 10, 20),
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: "#C9B6F2",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: z.cardPad,
    },
    sentenceText: {
      fontSize: z.sentence,
      lineHeight: z.sentence * 1.4,
      fontWeight: "900",
      color: "#111111",
      textAlign: "center",
    },
    girlImage: {
      position: "absolute",
      right: 0,
      bottom: 0,
      height: z.girlH,
      width: z.girlH * 0.95,
    },

    /* ===== Photo card ===== */
    photoCard: {
      ...cardShadow,
      height: z.botH,
      backgroundColor: "rgba(236,250,241,0.95)",
      borderRadius: clamp(z.botH * 0.1, 14, 30),
      padding: z.cardPad,
      gap: z.cardPad * 0.6,
    },
    preview: {
      flex: 1,
      backgroundColor: "#7A7F87",
      borderRadius: clamp(z.botH * 0.07, 10, 20),
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    previewImage: { ...StyleSheet.absoluteFillObject },
    previewText: {
      marginTop: 2,
      fontSize: z.previewText,
      lineHeight: z.previewText * 1.4,
      fontWeight: "800",
      color: "#FFFFFF",
    },
    doneBadge: {
      position: "absolute",
      top: 8,
      left: 8,
      width: z.previewText * 2.2,
      height: z.previewText * 2.2,
      borderRadius: z.previewText * 1.1,
      backgroundColor: "#22A35A",
      alignItems: "center",
      justifyContent: "center",
    },
    removeBadge: {
      position: "absolute",
      top: 8,
      right: 8,
      width: z.previewText * 2.2,
      height: z.previewText * 2.2,
      borderRadius: z.previewText * 1.1,
      backgroundColor: "rgba(0,0,0,0.55)",
      alignItems: "center",
      justifyContent: "center",
    },

    corner: { position: "absolute", width: corner, height: corner, borderColor: "#FFFFFF" },
    cTL: { top: cornerInsetV, left: cornerInsetH, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 10 },
    cTR: { top: cornerInsetV, right: cornerInsetH, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 10 },
    cBL: { bottom: cornerInsetV, left: cornerInsetH, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 10 },
    cBR: { bottom: cornerInsetV, right: cornerInsetH, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 10 },

    btnRow: { height: z.btnH, flexDirection: "row", gap: z.gap },
    btn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: z.btnFont * 0.6,
      borderRadius: z.btnH * 0.3,
    },
    btnLight: { backgroundColor: "#D3F2DE" },
    btnDark: {
      backgroundColor: "#2E8B57",
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    btnText: { fontSize: z.btnFont, lineHeight: z.btnFont * 1.4, fontWeight: "800" },
  });
};