import React from "react";
import { Text, View } from "react-native";

const OFFSETS = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

/** Big title text with a thick outline (React Native has no text-stroke). */
export function OutlinedText({
  text,
  fontSize,
  color,
  strokeColor = "#FFFFFF",
  shadowColor = "rgba(0,0,0,0.25)",
}: {
  text: string;
  fontSize: number;
  color: string;
  strokeColor?: string;
  shadowColor?: string;
}) {
  const stroke = Math.max(2, fontSize * 0.08);
  const base = {
    fontSize,
    lineHeight: fontSize * 1.45,
    fontWeight: "900" as const,
    textAlign: "center" as const,
  };

  return (
    <View>
      {OFFSETS.map(([x, y], i) => (
        <Text
          key={i}
          numberOfLines={1}
          style={[
            base,
            {
              position: "absolute",
              left: x * stroke,
              right: -x * stroke,
              top: y * stroke,
              color: strokeColor,
            },
          ]}
        >
          {text}
        </Text>
      ))}
      <Text
        numberOfLines={1}
        style={[
          base,
          {
            color,
            textShadowColor: shadowColor,
            textShadowOffset: { width: 0, height: 3 },
            textShadowRadius: 4,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}