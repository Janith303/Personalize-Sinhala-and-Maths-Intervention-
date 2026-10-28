import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  LayoutChangeEvent,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Owl } from "@/components/common/controls";

export type ChoiceTheme = {
  primary: string;
  primaryDark: string;
  heading: string;
  panelBorder: string;
  leaf: string;
};

export const choiceThemes = {
  green: {
    primary: "#1F8A4C",
    primaryDark: "#166B3A",
    heading: "#0B4A2A",
    panelBorder: "#B9DEC3",
    leaf: "#4CAF50",
  },
  blue: {
    primary: "#2F6FE0",
    primaryDark: "#1E4FB0",
    heading: "#163B7A",
    panelBorder: "#BFD3F5",
    leaf: "#4CAF50",
  },
} satisfies Record<string, ChoiceTheme>;

export type ChoiceOption = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

const DEFAULT_ICONS: (keyof typeof MaterialCommunityIcons.glyphMap)[] = [
  "book-open-variant",
  "clipboard-list-outline",
  "pencil",
  "star",
];

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

type Props = {
  title: string;
  heading: string;
  options: ChoiceOption[];
  theme?: ChoiceTheme;
};

/** Shared "choose an evaluation" screen (used by Sinhala and Maths). */
export function ChoiceScreen({ title, heading, options, theme = choiceThemes.green }: Props) {
  const insets = useSafeAreaInsets();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [pressed, setPressed] = useState<number | "back" | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  const { w: width, h: height } = size;
  const pad = clamp(Math.min(width, height) * 0.04, 10, 28);

  // header band
  const headerH = clamp(height * 0.14, 46, 84);
  const backSize = headerH * 0.72;
  const headerFont = clamp(headerH * 0.42, 16, 34);

  // body
  const bodyH = height - insets.top - headerH - insets.bottom - pad * 2;
  const bodyW = width - insets.left - insets.right - pad * 2;
  const panelW = clamp(bodyW * 0.48, 280, 760);
  const owlSize = clamp(bodyH * 0.62, 90, 280);

  const n = Math.max(options.length, 1);
  const headingFont = clamp(bodyH * 0.09, 16, 40);
  const panelPad = clamp(bodyH * 0.06, 12, 32);
  const optGap = clamp(bodyH * 0.035, 8, 18);
  const optH = clamp((bodyH * 0.78 - headingFont * 2 - panelPad * 2 - optGap * (n - 1)) / n, 42, 92);
  const optFont = clamp(optH * 0.32, 13, 30);
  const iconCircle = optH * 0.72;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground
        source={require("../../assets/images/common/homebackground.png")}
        style={styles.container}
        resizeMode="cover"
        onLayout={onLayout}
      >
        {width > 0 && (
          <>
            {/* ---------- HEADER BAND ---------- */}
            <View
              style={[
                styles.header,
                {
                  height: insets.top + headerH,
                  paddingTop: insets.top,
                  paddingLeft: insets.left + pad * 2.5,
                  backgroundColor: theme.primary,
                  borderBottomColor: theme.primaryDark,
                },
              ]}
            >
              <Pressable
                onPress={() => router.back()}
                onPressIn={() => setPressed("back")}
                onPressOut={() => setPressed(null)}
                accessibilityRole="button"
                accessibilityLabel="ආපසු"
                style={[
                  styles.backButton,
                  {
                    width: backSize,
                    height: backSize,
                    borderRadius: backSize / 2,
                    opacity: pressed === "back" ? 0.8 : 1,
                  },
                ]}
              >
                <Ionicons name="chevron-back" size={backSize * 0.55} color={theme.primary} />
              </Pressable>
              <Text style={[styles.headerTitle, { fontSize: headerFont, lineHeight: headerFont * 1.45 }]}>
                {title}
              </Text>
            </View>

            {/* ---------- BODY ---------- */}
            <View
              style={[
                styles.body,
                {
                  paddingTop: pad,
                  paddingBottom: insets.bottom + pad,
                  paddingLeft: insets.left + pad,
                  paddingRight: insets.right + pad,
                  gap: pad,
                },
              ]}
            >
              {/* mascot */}
              <View style={styles.mascot}>
                <Owl size={owlSize} />
              </View>

              {/* choice panel */}
              <View
                style={[
                  styles.panelOuter,
                  { width: panelW, borderRadius: clamp(panelW * 0.06, 18, 40) },
                ]}
              >
                <View
                  style={[
                    styles.panelInner,
                    {
                      borderColor: theme.panelBorder,
                      borderRadius: clamp(panelW * 0.05, 14, 34),
                      padding: panelPad,
                      gap: optGap,
                    },
                  ]}
                >
                  {/* corner leaves */}
                  <Ionicons name="leaf" size={headingFont} color={theme.leaf} style={[styles.leaf, { top: 8, left: 10, transform: [{ rotate: "-40deg" }] }]} />
                  <Ionicons name="leaf" size={headingFont} color={theme.leaf} style={[styles.leaf, { top: 8, right: 10, transform: [{ rotate: "40deg" }] }]} />
                  <Ionicons name="leaf" size={headingFont * 0.8} color={theme.leaf} style={[styles.leaf, { bottom: 8, left: 10, transform: [{ rotate: "-130deg" }] }]} />
                  <Ionicons name="leaf" size={headingFont * 0.8} color={theme.leaf} style={[styles.leaf, { bottom: 8, right: 10, transform: [{ rotate: "130deg" }] }]} />

                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={[
                      styles.heading,
                      { fontSize: headingFont, lineHeight: headingFont * 1.5, color: theme.heading },
                    ]}
                  >
                    {heading}
                  </Text>

                  {options.map((opt, i) => (
                    <Pressable
                      key={opt.label}
                      onPress={opt.onPress}
                      onPressIn={() => setPressed(i)}
                      onPressOut={() => setPressed(null)}
                      accessibilityRole="button"
                      accessibilityLabel={opt.label}
                      style={[
                        styles.option,
                        {
                          height: optH,
                          borderRadius: optH * 0.4,
                          paddingHorizontal: optH * 0.18,
                          backgroundColor: theme.primary,
                          borderBottomColor: theme.primaryDark,
                          transform: [{ scale: pressed === i ? 0.97 : 1 }],
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.optionIcon,
                          { width: iconCircle, height: iconCircle, borderRadius: iconCircle / 2 },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={opt.icon ?? DEFAULT_ICONS[i % DEFAULT_ICONS.length]}
                          size={iconCircle * 0.58}
                          color={theme.primary}
                        />
                      </View>

                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={[styles.optionLabel, { fontSize: optFont, lineHeight: optFont * 1.5 }]}
                      >
                        {opt.label}
                      </Text>

                      <Ionicons name="chevron-forward" size={optFont * 1.3} color="#FFFFFF" />
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </>
        )}
      </ImageBackground>
    </>
  );
}

const shadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.18,
  shadowRadius: 6,
  elevation: 5,
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomWidth: 4,
    ...shadow,
  },

  backButton: {
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    ...shadow,
    elevation: 3,
  },

  headerTitle: {
    fontWeight: "900",
    color: "#FFFFFF",
  },

  body: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  mascot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  panelOuter: {
    backgroundColor: "rgba(255,253,245,0.96)",
    padding: 6,
    marginRight: "6%",
    ...shadow,
  },

  panelInner: {
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
  },

  leaf: {
    position: "absolute",
    opacity: 0.7,
  },

  heading: {
    fontWeight: "900",
    textAlign: "center",
  },

  option: {
    width: "88%",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomWidth: 4,
    ...shadow,
    elevation: 4,
  },

  optionIcon: {
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  optionLabel: {
    flex: 1,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});