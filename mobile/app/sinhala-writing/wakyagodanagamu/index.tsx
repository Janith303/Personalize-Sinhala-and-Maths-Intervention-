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
  ToastAndroid,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DESIGN_WIDTH = 1100;
const DESIGN_HEIGHT = 660;

/* Optional girl picture (transparent PNG), e.g.
   require("../../../assets/images/sinhala-writing/girl-pointing.png") */
const GIRL_IMAGE: ImageSourcePropType | null = require("../../../assets/images/sinhala-writing/girll.png");

const GREEN = "#1F8A3B";
const NAVY = "#1E2440";
const BROWN = "#6B3A12";

const MENU = [
  {
    title: "වචන හඳුනාගමු",
    emoji: "📖",
    bg: "#FFE9A8",
    border: "#F5C842",
    arrow: "#B45309",
    route: "/sinhala-writing/wakyagodanagamu/wachanahadunaganimu",
  },
  {
    title: "වචන ක්‍රමයට\nගොඩනගමු",
    emoji: "🧩",
    bg: "#FBE4F1",
    border: "#F3C1DD",
    arrow: "#BE185D",
    route: null,
  },
  {
    title: "නිවැරදි වාක්‍ය\nතෝරමු",
    emoji: "💬",
    bg: "#DFF5E6",
    border: "#B5E3C3",
    arrow: GREEN,
    route: null,
  },
];

export default function WakyaGodanagamuHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [size, setSize] = useState({ w: 0, h: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  const scale = Math.min(
    (size.w - insets.left - insets.right) / DESIGN_WIDTH,
    (size.h - insets.top - insets.bottom) / DESIGN_HEIGHT,
    1.3
  );
  const f = (n: number, min: number) => Math.max(n * scale, min);
  const styles = useMemo(() => createStyles(scale), [scale]);

  const open = (route: string | null) => {
    if (route) {
      router.push(route as any);
      return;
    }
    if (Platform.OS === "android") {
      ToastAndroid.show("මෙම කොටස ඉක්මනින් එකතු කෙරේ", ToastAndroid.SHORT);
    } else {
      Alert.alert("", "මෙම කොටස ඉක්මනින් එකතු කෙරේ.");
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/sinhala-writing/maharecog.png")}
      style={styles.container}
      resizeMode="cover"
      onLayout={onLayout}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {size.h > 0 && (
        <View
          style={[
            styles.page,
            {
              paddingTop: insets.top + f(14, 8),
              paddingBottom: insets.bottom + f(14, 8),
              paddingLeft: insets.left + f(24, 14),
              paddingRight: insets.right + f(24, 14),
            },
          ]}
        >
          {/* LEFT */}
          <View style={styles.left}>
            <View style={styles.headerRow}>
              <TouchableOpacity activeOpacity={0.8} style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={f(28, 20)} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.titleSign}>
                <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
                  වාක්‍ය ගොඩනගමු
                </Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                  වාක්‍ය ලිවීම
                </Text>
              </View>
            </View>

            <View style={styles.bubble}>
              <Text style={styles.bubbleText} numberOfLines={4} adjustsFontSizeToFit>
                වචන හඳුනාගෙන, ක්‍රමයට තබා, නිවැරදි වාක්‍ය ලියමු!
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

          {/* RIGHT: menu */}
          <View style={styles.menuPanel}>
            {MENU.map((item) => (
              <TouchableOpacity
                key={item.title}
                activeOpacity={0.85}
                onPress={() => open(item.route)}
                style={[styles.menuRow, { backgroundColor: item.bg, borderColor: item.border }]}
              >
                <View style={styles.menuIcon}>
                  <Text style={styles.menuEmoji}>{item.emoji}</Text>
                </View>
                <Text style={styles.menuText} numberOfLines={2} adjustsFontSizeToFit>
                  {item.title}
                </Text>
                <Ionicons name="chevron-forward" size={f(30, 22)} color={item.arrow} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ImageBackground>
  );
}

function createStyles(scale: number) {
  const f = (n: number, min: number) => Math.max(n * scale, min);
  const titleFont = f(38, 21);
  const subFont = f(18, 12.5);
  const bubbleFont = f(21, 13.5);
  const menuFont = f(24, 15);

  return StyleSheet.create({
    container: { flex: 1 },
    page: { flex: 1, flexDirection: "row", gap: f(24, 14) },

    left: { flex: 1 },
    headerRow: { flexDirection: "row", alignItems: "center", gap: f(16, 10) },
    backButton: {
      width: f(64, 44),
      height: f(64, 44),
      borderRadius: f(32, 22),
      backgroundColor: GREEN,
      borderWidth: 3,
      borderColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      elevation: 5,
    },
    titleSign: {
      flexShrink: 1,
      backgroundColor: "#E9A65C",
      borderWidth: 2,
      borderColor: "#B8742F",
      borderRadius: f(16, 10),
      paddingHorizontal: f(30, 16),
      paddingVertical: f(6, 3),
      alignItems: "center",
      transform: [{ rotate: "-1deg" }],
      elevation: 4,
    },
    title: { fontSize: titleFont, lineHeight: titleFont * 1.35, fontWeight: "900", color: NAVY },
    subtitle: { fontSize: subFont, lineHeight: subFont * 1.35, fontWeight: "800", color: BROWN },

    bubble: {
      alignSelf: "center",
      maxWidth: "80%",
      marginTop: f(20, 10),
      backgroundColor: "rgba(255,255,255,0.96)",
      borderRadius: f(36, 22),
      paddingHorizontal: f(24, 14),
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
      left: "30%",
      width: 18,
      height: 18,
      backgroundColor: "rgba(255,255,255,0.96)",
      transform: [{ rotate: "45deg" }],
    },
    girlArea: { flex: 1, alignItems: "flex-start", justifyContent: "flex-end", paddingLeft: f(20, 10) },
    girlImage: { width: "100%", height: "100%" },
    girlEmoji: { fontSize: f(130, 60) },

    menuPanel: {
      width: "44%",
      alignSelf: "center",
      backgroundColor: "rgba(255,255,255,0.93)",
      borderRadius: f(28, 18),
      padding: f(16, 9),
      gap: f(16, 9),
      elevation: 6,
    },
    menuRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: f(16, 10),
      borderRadius: f(20, 14),
      borderWidth: 2,
      paddingHorizontal: f(16, 10),
      paddingVertical: f(16, 9),
    },
    menuIcon: {
      width: f(70, 46),
      height: f(70, 46),
      borderRadius: f(18, 12),
      backgroundColor: "rgba(255,255,255,0.75)",
      alignItems: "center",
      justifyContent: "center",
    },
    menuEmoji: { fontSize: f(38, 24) },
    menuText: { flex: 1, fontSize: menuFont, lineHeight: menuFont * 1.45, fontWeight: "900", color: NAVY },
  });
}