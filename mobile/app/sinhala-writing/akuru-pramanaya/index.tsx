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
    title: "අකුරු ප්‍රමාණය\nගැන ඉගෙනගනිමු",
    emoji: "✏️",
    iconBg: "#FFE7A8",
    route: "/sinhala-writing/akuru-pramanaya/igenagamu",
  },
  {
    title: "අකුරු ප්‍රමාණය\nහුරු කරමු",
    emoji: "📝",
    iconBg: "#FFE0C2",
    route: null, // coming soon
  },
  {
    title: "අභ්‍යාස කරමු",
    emoji: "🎮",
    iconBg: "#E7DDFF",
    route: null, // coming soon
  },
];

export default function AkuruPramanayaHome() {
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
    if (route) router.push(route as any);
    else Alert.alert("", "මෙම කොටස ඉක්මනින් එකතු කෙරේ.");
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/sinhala-writing/mhprnaintro.png")}
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
          {/* LEFT: back + title + girl */}
          <View style={styles.left}>
            <View style={styles.headerRow}>
              <TouchableOpacity activeOpacity={0.8} style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={f(28, 20)} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.titleSign}>
                <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
                  අකුරු ප්‍රමාණය
                </Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                  නිවැරදි ප්‍රමාණයෙන් ලියමු
                </Text>
              </View>
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
            {MENU.map((item, i) => (
              <TouchableOpacity
                key={item.title}
                activeOpacity={0.85}
                onPress={() => open(item.route)}
                style={[styles.menuRow, i === 0 && styles.menuRowActive]}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.iconBg }]}>
                  <Text style={styles.menuEmoji}>{item.emoji}</Text>
                </View>
                <Text style={styles.menuText} numberOfLines={2} adjustsFontSizeToFit>
                  {item.title}
                </Text>
                <Ionicons name="chevron-forward" size={f(28, 20)} color={NAVY} />
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
  const titleFont = f(40, 22);
  const subFont = f(18, 12.5);
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
    title: {
      fontSize: titleFont,
      lineHeight: titleFont * 1.35,
      fontWeight: "900",
      color: NAVY,
    },
    subtitle: {
      fontSize: subFont,
      lineHeight: subFont * 1.35,
      fontWeight: "800",
      color: BROWN,
    },
    girlArea: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
    girlImage: { width: "100%", height: "100%" },
    girlEmoji: { fontSize: f(160, 80) },

    menuPanel: {
      width: "46%",
      alignSelf: "center",
      backgroundColor: "rgba(255,255,255,0.93)",
      borderRadius: f(28, 18),
      padding: f(16, 10),
      gap: f(14, 8),
      elevation: 6,
    },
    menuRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: f(18, 12),
      backgroundColor: "#FFFFFF",
      borderRadius: f(20, 14),
      paddingHorizontal: f(16, 10),
      paddingVertical: f(14, 8),
      borderWidth: 2,
      borderColor: "#EEF0F2",
    },
    menuRowActive: { backgroundColor: "#EAF4FF", borderColor: "#BFDBFE" },
    menuIcon: {
      width: f(72, 46),
      height: f(72, 46),
      borderRadius: f(18, 12),
      alignItems: "center",
      justifyContent: "center",
    },
    menuEmoji: { fontSize: f(40, 24) },
    menuText: {
      flex: 1,
      fontSize: menuFont,
      lineHeight: menuFont * 1.45,
      fontWeight: "900",
      color: NAVY,
    },
  });
}