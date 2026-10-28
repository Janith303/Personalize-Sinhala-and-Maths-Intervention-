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

type OpType = "add" | "subtract" | "multiply" | "divide";

type Operation = {
  type: OpType;
  label: string;
  route: string;
  tileBg: string;
  tileBorder: string;
  symbol: string;
  symbolDark: string;
  labelColor: string;
  deco: string;
};

const OPERATIONS: Operation[] = [
  {
    type: "add",
    label: "එකතු කිරීම",
    route: "/maths-slow/addition",
    tileBg: "#DDF5DC",
    tileBorder: "#8FD48C",
    symbol: "#2DB82D",
    symbolDark: "#1B8A1F",
    labelColor: "#145A1B",
    deco: "#7ED67B",
  },
  {
    type: "subtract",
    label: "අඩු කිරීම",
    route: "/maths-slow/subtraction",
    tileBg: "#FDE1E6",
    tileBorder: "#F3A3B2",
    symbol: "#E3263A",
    symbolDark: "#B0172A",
    labelColor: "#8E1027",
    deco: "#F59AAE",
  },
  {
    type: "multiply",
    label: "ගුණ කිරීම",
    route: "/maths-slow/multiplication",
    tileBg: "#DCEEFD",
    tileBorder: "#8DC3F2",
    symbol: "#1F6FE0",
    symbolDark: "#1652A8",
    labelColor: "#0F3E86",
    deco: "#82BDF2",
  },
  {
    type: "divide",
    label: "බෙදීම",
    route: "/maths-slow/division",
    tileBg: "#FFF3CC",
    tileBorder: "#F5CE6B",
    symbol: "#FF9A1A",
    symbolDark: "#D97706",
    labelColor: "#6B3A06",
    deco: "#F7D46B",
  },
];

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/* ---------- Chunky + − × ÷ symbols built from rounded bars ---------- */

function Bar({
  w,
  h,
  color,
  dark,
  style,
}: {
  w: number;
  h: number;
  color: string;
  dark: string;
  style?: object;
}) {
  return (
    <View
      style={[
        {
          position: "absolute",
          width: w,
          height: h,
          borderRadius: Math.min(w, h) * 0.32,
          backgroundColor: color,
          borderBottomWidth: Math.max(2, Math.min(w, h) * 0.16),
          borderColor: dark,
        },
        style,
      ]}
    />
  );
}

function OperatorSymbol({
  type,
  size,
  color,
  dark,
}: {
  type: OpType;
  size: number;
  color: string;
  dark: string;
}) {
  const t = size * 0.3; // bar thickness
  const mid = (size - t) / 2;

  if (type === "add" || type === "multiply") {
    return (
      <View
        style={{
          width: size,
          height: size,
          transform: [{ rotate: type === "multiply" ? "45deg" : "0deg" }],
        }}
      >
        <Bar w={size} h={t} color={color} dark={dark} style={{ top: mid, left: 0 }} />
        <Bar w={t} h={size} color={color} dark={dark} style={{ top: 0, left: mid }} />
      </View>
    );
  }

  if (type === "subtract") {
    return (
      <View style={{ width: size * 1.25, height: size }}>
        <Bar w={size * 1.25} h={t * 1.05} color={color} dark={dark} style={{ top: mid, left: 0 }} />
      </View>
    );
  }

  // divide
  const dot = t * 1.05;
  return (
    <View style={{ width: size, height: size * 1.1 }}>
      <Bar w={dot} h={dot} color={color} dark={dark} style={{ top: 0, left: (size - dot) / 2, borderRadius: dot / 2 }} />
      <Bar w={size} h={t * 0.85} color={color} dark={dark} style={{ top: (size * 1.1 - t * 0.85) / 2, left: 0 }} />
      <Bar w={dot} h={dot} color={color} dark={dark} style={{ bottom: 0, left: (size - dot) / 2, borderRadius: dot / 2 }} />
    </View>
  );
}

/* ---------- Screen ---------- */

export default function MathsOperations() {
  const insets = useSafeAreaInsets();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);
  const [backPressed, setBackPressed] = useState(false);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  const { w: width, h: height } = size;
  const pad = clamp(Math.min(width, height) * 0.04, 10, 28);
  const usableW = width - insets.left - insets.right - pad * 2;
  const usableH = height - insets.top - insets.bottom - pad * 2;

  // Sign overlapping the top of the panel
  const signH = clamp(usableH * 0.2, 54, 150);
  const signW = signH * 3.3;
  const signFont = signH * 0.48;

  // Main panel
  const panelTop = signH * 0.5; // the sign hangs half above the panel
  const panelH = usableH - panelTop;
  const panelW = clamp(Math.min(usableW * 0.62, panelH * 1.4), 280, 900);
  const panelPad = clamp(panelH * 0.05, 10, 32);
  const subFont = clamp(panelH * 0.055, 12, 26);

  // Tiles (2 x 2)
  const gridGap = clamp(panelH * 0.04, 8, 24);
  const gridTop = signH * 0.55 + subFont * 1.8;
  const tileH = (panelH - gridTop - panelPad - gridGap) / 2;
  const symbolSize = clamp(tileH * 0.4, 28, 120);
  const labelFont = clamp(tileH * 0.17, 12, 36);
  const decoSize = clamp(tileH * 0.16, 12, 40);

  const backSize = clamp(Math.min(width, height) * 0.11, 38, 60);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground
        source={require("../../assets/images/maths-slow/operationsbackground.png")}
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
                  alignItems: "center",
                },
              ]}
            >
              {/* ---------- MAIN PANEL ---------- */}
              <View
                style={[
                  styles.panel,
                  {
                    width: panelW,
                    height: panelH,
                    marginTop: panelTop,
                    borderRadius: clamp(panelW * 0.05, 18, 40),
                    paddingHorizontal: panelPad,
                    paddingBottom: panelPad,
                    paddingTop: signH * 0.55,
                  },
                ]}
              >
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={[styles.subtitle, { fontSize: subFont, lineHeight: subFont * 1.6 }]}
                >
                  පහත ක්‍රියාවක් තෝරන්න
                </Text>

                {/* 2 x 2 grid */}
                <View style={[styles.grid, { gap: gridGap, marginTop: subFont * 0.2 }]}>
                  {[0, 2].map((rowStart) => (
                    <View key={rowStart} style={[styles.gridRow, { gap: gridGap }]}>
                      {OPERATIONS.slice(rowStart, rowStart + 2).map((op, i) => {
                        const index = rowStart + i;
                        const pressed = pressedIndex === index;
                        return (
                          <Pressable
                            key={op.type}
                            onPress={() => router.push(op.route as any)}
                            onPressIn={() => setPressedIndex(index)}
                            onPressOut={() => setPressedIndex(null)}
                            accessibilityRole="button"
                            accessibilityLabel={op.label}
                            style={[
                              styles.tile,
                              {
                                borderRadius: clamp(tileH * 0.22, 14, 36),
                                backgroundColor: op.tileBg,
                                borderColor: op.tileBorder,
                                transform: [{ scale: pressed ? 0.96 : 1 }],
                                opacity: pressed ? 0.9 : 1,
                              },
                            ]}
                          >
                            {/* soft decorations */}
                            <View style={[styles.decoLeft, { top: tileH * 0.16, left: tileH * 0.22 }]}>
                              <MaterialCommunityIcons
                                name={index % 2 === 0 ? "star" : "circle"}
                                size={decoSize}
                                color={op.deco}
                              />
                            </View>
                            <View style={[styles.decoRight, { top: tileH * 0.16, right: tileH * 0.22 }]}>
                              <MaterialCommunityIcons
                                name={op.type === "divide" ? "circle" : "triangle"}
                                size={decoSize}
                                color={op.deco}
                              />
                            </View>

                            <View style={{ height: symbolSize * 1.15, justifyContent: "center", alignItems: "center" }}>
                              <OperatorSymbol
                                type={op.type}
                                size={symbolSize}
                                color={op.symbol}
                                dark={op.symbolDark}
                              />
                            </View>

                            <Text
                              numberOfLines={1}
                              adjustsFontSizeToFit
                              style={[
                                styles.tileLabel,
                                {
                                  fontSize: labelFont,
                                  lineHeight: labelFont * 1.5,
                                  color: op.labelColor,
                                  marginTop: tileH * 0.04,
                                },
                              ]}
                            >
                              {op.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>

              {/* ---------- WOODEN SIGN (overlaps panel top) ---------- */}
              <View
                pointerEvents="none"
                style={[
                  styles.signWrap,
                  { top: insets.top + pad, width: signW + signH * 0.6, height: signH },
                ]}
              >
                <Ionicons
                  name="leaf"
                  size={signH * 0.6}
                  color="#43A047"
                  style={{ position: "absolute", left: 0, bottom: -signH * 0.05, transform: [{ rotate: "-60deg" }] }}
                />
                <Ionicons
                  name="leaf"
                  size={signH * 0.6}
                  color="#4CAF50"
                  style={{ position: "absolute", right: 0, bottom: -signH * 0.05, transform: [{ rotate: "150deg" }] }}
                />

                <View
                  style={[
                    styles.sign,
                    { width: signW, height: signH, borderRadius: signH * 0.2 },
                  ]}
                >
                  <View style={[styles.plankLine, { top: signH * 0.33 }]} />
                  <View style={[styles.plankLine, { top: signH * 0.68 }]} />
                  <View style={[styles.nail, { left: signW * 0.05, top: signH * 0.15 }]} />
                  <View style={[styles.nail, { right: signW * 0.05, bottom: signH * 0.15 }]} />

                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={[styles.signTitle, { fontSize: signFont, lineHeight: signFont * 1.45 }]}
                  >
                    ගණිත ක්‍රියා
                  </Text>
                </View>
              </View>
            </View>

            {/* ---------- BACK BUTTON ---------- */}
            <Pressable
              onPress={() => router.back()}
              onPressIn={() => setBackPressed(true)}
              onPressOut={() => setBackPressed(false)}
              accessibilityRole="button"
              accessibilityLabel="ආපසු"
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
              <Ionicons name="arrow-back" size={backSize * 0.55} color="#2E9E4F" />
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
    borderWidth: 3,
    borderColor: "#2E9E4F",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  /* Panel */
  panel: {
    backgroundColor: "rgba(255, 250, 238, 0.96)",
    borderWidth: 4,
    borderColor: "#7CC47F",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },

  subtitle: {
    fontWeight: "800",
    color: "#2B2B2B",
    textAlign: "center",
  },

  grid: {
    flex: 1,
  },

  gridRow: {
    flex: 1,
    flexDirection: "row",
  },

  tile: {
    flex: 1,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },

  decoLeft: {
    position: "absolute",
    opacity: 0.6,
  },

  decoRight: {
    position: "absolute",
    opacity: 0.6,
  },

  tileLabel: {
    fontWeight: "900",
    textAlign: "center",
  },

  /* Sign */
  signWrap: {
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8, // keeps the sign above the panel on Android
    zIndex: 10,
  },

  sign: {
    backgroundColor: "#F3C98B",
    borderWidth: 4,
    borderColor: "#C98A3E",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#5A3410",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },

  plankLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(150, 95, 40, 0.22)",
  },

  nail: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8A5626",
  },

  signTitle: {
    fontWeight: "900",
    color: "#14532D",
    textAlign: "center",
    textShadowColor: "#FFFFFF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});