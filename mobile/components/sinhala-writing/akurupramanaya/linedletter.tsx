import React, { useState } from "react";
import { View, Text, StyleSheet, LayoutChangeEvent } from "react-native";

/* Where the 4 guide lines sit (as a fraction of the box height) */
const LINE_TOP = 0.14;    // pink  – height limit
const LINE_MID1 = 0.38;   // blue  – top of the middle area
const LINE_MID2 = 0.62;   // blue  – bottom of the middle area (base line)
const LINE_BOTTOM = 0.86; // green – foot limit

/* ⚙️ Font tuning – adjust if the letter does not sit nicely between the blue lines
   BODY_RATIO:     bigger = bigger letter
   BASELINE_RATIO: bigger = letter moves UP */
const BODY_RATIO = 1.9;
const BASELINE_RATIO = 1.0;

const PINK = "#F06292";
const BLUE = "#64B5F6";
const GREEN_LINE = "#66BB6A";

export default function LinedLetter({
  letter,
  sizeFactor = 1,
  showLabels = false,
  scale = 1,
  color = "#111111",
}: {
  letter: string;
  sizeFactor?: number;   // 0.55 = too small, 1 = correct, 1.5 = too big
  showLabels?: boolean;  // show the line names on the right
  scale?: number;
  color?: string;
}) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== box.w || height !== box.h) setBox({ w: width, h: height });
  };

  const h = box.h;
  const zone = (LINE_MID2 - LINE_MID1) * h;
  const fontSize = zone * BODY_RATIO * sizeFactor;
  const top = LINE_MID2 * h - fontSize * BASELINE_RATIO;
  const lettersRight = showLabels ? "42%" : 0;

  const f = (n: number, min: number) => Math.max(n * scale, min);
  const chipFont = f(16, 11);
  const chipH = chipFont * 3;

  const line = (y: number, c: string, thick = 2) => (
    <View
      style={[
        styles.line,
        { top: y * h - thick / 2, height: thick, backgroundColor: c, right: lettersRight },
      ]}
    />
  );

  const chip = (y: number, text: string, bg: string, fg: string) => (
    <View style={[styles.chip, { top: y * h - chipH / 2, height: chipH, backgroundColor: bg }]}>
      <Text
        style={[styles.chipText, { fontSize: chipFont, lineHeight: chipFont * 1.35, color: fg }]}
        numberOfLines={2}
        adjustsFontSizeToFit
      >
        {text}
      </Text>
    </View>
  );

  return (
    <View style={styles.box} onLayout={onLayout}>
      {h > 0 && (
        <>
          {/* middle area tint */}
          <View
            style={[
              styles.midTint,
              { top: LINE_MID1 * h, height: zone, right: lettersRight },
            ]}
          />

          {line(LINE_TOP, PINK)}
          {line(LINE_MID1, BLUE)}
          {line(LINE_MID2, BLUE)}
          {line(LINE_BOTTOM, GREEN_LINE)}

          <Text
            style={[
              styles.letter,
              {
                top,
                right: lettersRight,
                fontSize,
                lineHeight: fontSize * 1.4,
                color,
              },
            ]}
          >
            {letter}
          </Text>

          {showLabels && (
            <>
              {chip(LINE_TOP, "උපරිම රේඛාව\n(උස සීමාව)", "#FDE2EC", "#C2185B")}
              {chip((LINE_MID1 + LINE_MID2) / 2, "මැද කොටස", "#DCEEFF", "#1565C0")}
              {chip(LINE_BOTTOM, "පහළ රේඛාව\n(පාද සීමාව)", "#DFF3E0", "#2E7D32")}
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, overflow: "hidden" },
  midTint: { position: "absolute", left: 0, backgroundColor: "rgba(100,181,246,0.10)" },
  line: { position: "absolute", left: 0 },
  letter: {
    position: "absolute",
    left: 0,
    textAlign: "center",
    fontWeight: "700",
    includeFontPadding: false,
  },
  chip: {
    position: "absolute",
    right: 0,
    width: "38%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  chipText: { fontWeight: "800", textAlign: "center" },
});