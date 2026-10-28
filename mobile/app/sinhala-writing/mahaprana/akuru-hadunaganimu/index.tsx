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
import { Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LetterIntroduction from "../../../../components/sinhala-writing/mahaprana/akuruhadunaganimu/letterintro";
import SoundAndLetter from "../../../../components/sinhala-writing/mahaprana/akuruhadunaganimu/soundandletter";
import LetterPairs from "../../../../components/sinhala-writing/mahaprana/akuruhadunaganimu/letterpair";

/* Designed for 1100 x 660, then scaled to fit the real screen */
const DESIGN_WIDTH = 1100;
const DESIGN_HEIGHT = 660;

/* Optional boy picture for the header (transparent PNG), e.g.
   require("../../../../assets/images/sinhala-writing/boy-pencil.png") */
const BOY_IMAGE: ImageSourcePropType | null = null;

const GREEN = "#1F8A3B";
const DARK_GREEN = "#17702F";

const activities: { label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: "අකුරු හඳුනාගනිමු", icon: "book" },
  { label: "අකුර සහ ශබ්දය", icon: "pencil" },
  { label: "අල්පප්‍රාණ හා මහාප්‍රාණ", icon: "extension-puzzle" },
];

export default function AkuruHadunaganimu() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Real space this screen gets
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

  // Short screens (phones in landscape): tabs go into the header row
  const compact = scale < 0.8;

  // Size helper: scaled, but never smaller than `min`
  const f = (n: number, min: number) => Math.max(n * scale, min);
  const styles = useMemo(() => createStyles(scale, compact), [scale, compact]);

  const [currentActivity, setCurrentActivity] = useState(0);
  const isFirst = currentActivity === 0;
  const isLast = currentActivity === activities.length - 1;

  const renderActivity = () => {
    switch (currentActivity) {
      case 0:
        return <LetterIntroduction scale={scale} />;
      case 1:
        return <SoundAndLetter scale={scale} />;
      case 2:
        return <LetterPairs scale={scale} />;
      default:
        return <LetterIntroduction scale={scale} />;
    }
  };

  const tabs = (
    <View style={styles.activityTabs}>
      {activities.map((activity, index) => {
        const active = index === currentActivity;
        return (
          <TouchableOpacity
            key={activity.label}
            activeOpacity={0.85}
            onPress={() => setCurrentActivity(index)}
            style={[styles.tab, active ? styles.activeTab : styles.idleTab]}
          >
            <Ionicons
              name={activity.icon}
              size={f(22, 17)}
              color={active ? "#FFFFFF" : "#4B5563"}
            />
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[styles.tabText, { color: active ? "#FFFFFF" : "#374151" }]}
            >
              {activity.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <ImageBackground
      source={require("../../../../assets/images/sinhala-writing/maharecog.png")}
      style={styles.container}
      resizeMode="cover"
      onLayout={onLayout}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {size.h > 0 && (
        <>
          <View
            style={[
              styles.main,
              {
                paddingTop: insets.top + f(10, 6),
                paddingLeft: insets.left + f(20, 12),
                paddingRight: insets.right + f(20, 12),
              },
            ]}
          >
            {/* ================= HEADER ================= */}
            <View style={styles.header}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={f(28, 20)} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>
                  අකුරු හඳුනාගනිමු
                </Text>
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  මහාප්‍රාණ අකුරු
                </Text>
              </View>

              {compact ? (
                tabs
              ) : (
                <View style={styles.headerRight}>
                  <View style={styles.letterCircle}>
                    <Text style={styles.letterCircleText}>අ</Text>
                  </View>
                  {BOY_IMAGE ? (
                    <Image source={BOY_IMAGE} style={styles.boyImage} resizeMode="contain" />
                  ) : null}
                </View>
              )}
            </View>

            {/* ================= TABS (big screens) ================= */}
            {!compact && tabs}

            {/* ================= ACTIVITY CONTENT ================= */}
            <View style={styles.content}>{renderActivity()}</View>
          </View>

          {/* ================= BOTTOM BAR ================= */}
          <View
            style={[
              styles.bottomBar,
              {
                paddingBottom: insets.bottom + f(8, 6),
                paddingLeft: insets.left + f(20, 12),
                paddingRight: insets.right + f(20, 12),
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isFirst}
              onPress={() => setCurrentActivity((p) => p - 1)}
              style={[styles.navButton, isFirst ? styles.navDisabled : styles.navPrev]}
            >
              <Ionicons name="chevron-back" size={f(22, 18)} color={isFirst ? "#FFFFFF" : GREEN} />
              <Text style={[styles.navText, { color: isFirst ? "#FFFFFF" : GREEN }]}>පෙර</Text>
            </TouchableOpacity>

            <View style={styles.dots}>
              {activities.map((_, index) => (
                <View
                  key={index}
                  style={[styles.dot, index === currentActivity ? styles.activeDot : styles.idleDot]}
                />
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isLast}
              onPress={() => setCurrentActivity((p) => p + 1)}
              style={[styles.navButton, isLast ? styles.navDisabled : styles.navNext]}
            >
              <Text style={[styles.navText, { color: "#FFFFFF" }]}>ඊළඟට</Text>
              <Ionicons name="chevron-forward" size={f(22, 18)} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </ImageBackground>
  );
}

function createStyles(scale: number, compact: boolean) {
  const f = (n: number, min: number) => Math.max(n * scale, min);

  const headerH = f(64, 46);
  const backSize = f(58, 42);
  const titleSize = f(32, 18);
  const subSize = f(16, 11);
  const tabH = compact ? headerH - 4 : f(58, 44);
  const tabFont = f(16, 13);
  const navH = f(44, 36);
  const navFont = f(18, 14);

  return StyleSheet.create({
    container: { flex: 1 },

    main: {
      flex: 1,
      gap: f(8, 6),
      paddingBottom: f(8, 6),
      overflow: "hidden",
    },

    /* ---------- HEADER ---------- */
    header: {
      height: headerH,
      flexDirection: "row",
      alignItems: "center",
    },
    backButton: {
      width: backSize,
      height: backSize,
      borderRadius: backSize / 2,
      backgroundColor: GREEN,
      borderWidth: 3,
      borderColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    headerCenter: compact
      ? { width: f(260, 150), marginLeft: f(16, 10), marginRight: f(16, 10) }
      : { flex: 1, marginLeft: f(16, 10) },
    headerTitle: {
      fontSize: titleSize,
      lineHeight: titleSize * 1.35,
      fontWeight: "900",
      color: DARK_GREEN,
      textShadowColor: "#FFFFFF",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 8,
    },
    headerSubtitle: {
      fontSize: subSize,
      lineHeight: subSize * 1.35,
      fontWeight: "700",
      color: "#2D3748",
      textShadowColor: "#FFFFFF",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 6,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: f(40, 20),
    },
    letterCircle: {
      width: f(62, 44),
      height: f(62, 44),
      borderRadius: f(31, 22),
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    letterCircleText: {
      fontSize: f(34, 24),
      lineHeight: f(34, 24) * 1.3,
      fontWeight: "900",
      color: GREEN,
    },
    boyImage: { width: f(110, 70), height: f(80, 50), marginLeft: 4 },

    /* ---------- TABS ---------- */
    activityTabs: {
      ...(compact ? { flex: 1 } : {}),
      height: tabH,
      flexDirection: "row",
      padding: f(6, 4),
      gap: f(8, 5),
      backgroundColor: "rgba(255,255,255,0.95)",
      borderRadius: f(22, 16),
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    tab: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: f(8, 5),
      borderRadius: f(16, 12),
      paddingHorizontal: f(10, 6),
    },
    activeTab: { backgroundColor: GREEN },
    idleTab: { backgroundColor: "#EEF0F2" },
    tabText: {
      flexShrink: 1,
      fontSize: tabFont,
      lineHeight: tabFont * 1.4,
      fontWeight: "800",
    },

    /* ---------- CONTENT ---------- */
    content: { flex: 1, minHeight: 0 },

    /* ---------- BOTTOM BAR ---------- */
    bottomBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#FFFFFF",
      paddingTop: f(8, 6),
    },
    navButton: {
      minWidth: f(140, 110),
      height: navH,
      borderRadius: f(16, 12),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingHorizontal: f(18, 14),
    },
    navDisabled: { backgroundColor: "#CBD5E1" },
    navPrev: {
      backgroundColor: "#FFFFFF",
      borderWidth: 2,
      borderColor: GREEN,
    },
    navNext: {
      backgroundColor: GREEN,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    navText: {
      fontSize: navFont,
      lineHeight: navFont * 1.4,
      fontWeight: "900",
    },
    dots: { flexDirection: "row", gap: f(10, 8) },
    dot: { width: f(14, 10), height: f(14, 10), borderRadius: f(7, 5) },
    activeDot: { backgroundColor: GREEN },
    idleDot: { backgroundColor: "#D1D5DB" },
  });
}