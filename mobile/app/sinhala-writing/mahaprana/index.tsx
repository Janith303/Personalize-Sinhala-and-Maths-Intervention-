import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  LayoutChangeEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MenuItem = {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  route: string;
};

const MENU_ITEMS: MenuItem[] = [
  {
    title: "මහප්‍රාණ අකුරු",
    subtitle: "(ඛ, ඝ, ඡ, ඣ, ඨ, ඪ, ථ...)",
    icon: "book",
    iconBg: "#4F7BFF",
    route: "/sinhala-writing/mahaprana/lesson",
  },
  {
    title: "අකුරු හදුනාගනිමු ",
    icon: "game-controller",
    iconBg: "#FF5C8A",
    route: "/sinhala-writing/mahaprana/recognition",
  },
  
  {
    title: "අකුරෙන් වචනයට",
    icon: "document-text",
    iconBg: "#3B82F6",
    route: "/sinhala-writing/mahaprana/words",
  },
  {
    title: "දැනුම පිරික්සමු  ",
    icon: "trophy",
    iconBg: "#F5A524",
    route: "/sinhala-writing/mahaprana/progress",
  },
];

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

export default function MahapranaHome() {
  const insets = useSafeAreaInsets();

  // Real size of the screen area we actually get (after any header/nav bar)
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);
  const [backPressed, setBackPressed] = useState(false);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  const { w: width, h: height } = size;
  const isLandscape = width > height;

  // ---- Fit-to-screen sizing ----
  const pad = clamp(Math.min(width, height) * 0.04, 10, 28);
  const usableH = height - insets.top - insets.bottom - pad * 2;
  const usableW = width - insets.left - insets.right - pad * 2;

  const panelH = isLandscape ? usableH : usableH * 0.62;
  const panelPad = clamp(panelH * 0.025, 6, 14);
  const rowGap = clamp(panelH * 0.015, 3, 10);
  const rowH = Math.max((panelH - panelPad * 2 - rowGap * 4) / 5, 30);

  const iconBox = clamp(rowH * 0.72, 26, 64);
  const iconSize = iconBox * 0.58;
  const menuFont = clamp(rowH * 0.27, 11, 22);
  const subFont = clamp(rowH * 0.19, 9, 16);

  const titleFont = isLandscape
    ? clamp(Math.min(usableH * 0.12, usableW * 0.045), 20, 52)
    : clamp(usableW * 0.085, 22, 48);

  const backSize = clamp(Math.min(width, height) * 0.11, 36, 56);

  const handlePress = (index: number, route: string) => {
    setActiveIndex(index);
    router.push(route as any);
  };

  return (
    <>
      {/* Hide the default expo-router header ("sinhala-writing/mahaprana/index") */}
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground
        source={require("../../../assets/images/sinhala-writing/mahapranahomebackground.png")}
        style={styles.container}
        resizeMode="cover"
        onLayout={onLayout}
      >
        {width > 0 && (
          <>
            <View
              style={[
                styles.container,
                {
                  paddingTop: insets.top + pad,
                  paddingBottom: insets.bottom + pad,
                  paddingLeft: insets.left + pad,
                  paddingRight: insets.right + pad,
                  flexDirection: isLandscape ? "row" : "column",
                  gap: pad,
                },
              ]}
            >
              {/* LEFT: Title */}
              <View
                style={[
                  styles.left,
                  isLandscape
                    ? { flex: 1.1, paddingLeft: backSize + pad * 0.5 }
                    : { flex: 1, paddingTop: backSize * 0.2 },
                ]}
              >
                <Text
                  style={[styles.title, { fontSize: titleFont, lineHeight: titleFont * 1.45 }]}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                >
                  මහප්‍රාණ අකුරු
                </Text>
                <Text
                  style={[styles.title, { fontSize: titleFont, lineHeight: titleFont * 1.45 }]}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                >
                  ඉගෙන ගනිමු!
                </Text>
                <View
                  style={[
                    styles.titleUnderline,
                    { width: titleFont * 5, height: Math.max(3, titleFont * 0.1) },
                  ]}
                />
              </View>

              {/* RIGHT: Menu panel */}
              <View
                style={[
                  styles.menuPanel,
                  isLandscape ? { flex: 1, height: panelH } : { height: panelH },
                  {
                    padding: panelPad,
                    gap: rowGap,
                    borderRadius: clamp(rowH * 0.35, 14, 26),
                  },
                ]}
              >
                {MENU_ITEMS.map((item, index) => {
                  const active = index === activeIndex;
                  const pressed = index === pressedIndex;
                  return (
                    <Pressable
                      key={item.route}
                      onPress={() => handlePress(index, item.route)}
                      onPressIn={() => setPressedIndex(index)}
                      onPressOut={() => setPressedIndex(null)}
                      style={[
                        styles.menuRow,
                        active ? styles.menuRowActive : styles.menuRowIdle,
                        {
                          height: rowH,
                          borderRadius: clamp(rowH * 0.28, 10, 20),
                          paddingHorizontal: clamp(rowH * 0.18, 8, 16),
                          opacity: pressed ? 0.85 : 1,
                          transform: [{ scale: pressed ? 0.98 : 1 }],
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.menuIcon,
                          {
                            width: iconBox,
                            height: iconBox,
                            borderRadius: iconBox * 0.28,
                            marginRight: iconBox * 0.3,
                            backgroundColor: active ? "#FFFFFF" : item.iconBg + "22",
                          },
                        ]}
                      >
                        <Ionicons name={item.icon} size={iconSize} color={item.iconBg} />
                      </View>

                      <View style={styles.menuTextBox}>
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={[
                            styles.menuTitle,
                            { fontSize: menuFont, color: active ? "#FFFFFF" : "#1F2937" },
                          ]}
                        >
                          {item.title}
                        </Text>
                        {item.subtitle ? (
                          <Text
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            style={[
                              styles.menuSubtitle,
                              {
                                fontSize: subFont,
                                color: active ? "rgba(255,255,255,0.9)" : "#6B7280",
                              },
                            ]}
                          >
                            {item.subtitle}
                          </Text>
                        ) : null}
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        size={menuFont * 1.3}
                        color={active ? "#FFFFFF" : "#374151"}
                      />
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* BACK BUTTON – floating top-left */}
            <Pressable
              onPress={() => router.back()}
              onPressIn={() => setBackPressed(true)}
              onPressOut={() => setBackPressed(false)}
              style={[
                styles.backButton,
                {
                  top: insets.top + pad,
                  left: insets.left + pad,
                  width: backSize,
                  height: backSize,
                  borderRadius: backSize / 2,
                  opacity: backPressed ? 0.8 : 1,
                },
              ]}
            >
              <Ionicons name="chevron-back" size={backSize * 0.55} color="#2457D6" />
            </Pressable>
          </>
        )}
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  backButton: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },

  left: {
    alignItems: "center",
  },

  title: {
    fontWeight: "900",
    color: "#1645B8",
    textAlign: "center",
    textShadowColor: "#FFFFFF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  titleUnderline: {
    backgroundColor: "#1645B8",
    borderRadius: 4,
    marginTop: 2,
  },

  menuPanel: {
    backgroundColor: "rgba(255,255,255,0.93)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },

  menuRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },

  menuRowActive: {
    backgroundColor: "#5B3FE0",
    elevation: 5,
    shadowColor: "#5B3FE0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },

  menuRowIdle: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEF0F5",
  },

  menuIcon: {
    justifyContent: "center",
    alignItems: "center",
  },

  menuTextBox: {
    flex: 1,
    justifyContent: "center",
  },

  menuTitle: { fontWeight: "800" },

  menuSubtitle: { marginTop: 2, fontWeight: "600" },
});