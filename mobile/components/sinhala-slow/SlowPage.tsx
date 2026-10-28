import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { Txt, useU } from "@/components/common/layout";
import { fonts } from "@/constants/common/theme";

const schoolBg = require("../../assets/images/sinhala-slow/school-bg.png");
const punctuationBg = require("../../assets/images/sinhala-slow/punctuationbg.png");
const letterBg = require("../../assets/images/sinhala-slow/letterbg.png");

/** Pale pill in the top-right: "0 / 3 සම්පූර්ණයි". */
export function SlowCountPill({
  done,
  total,
}: {
  done: number;
  total: number;
}) {
  const { s } = useU();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: s(10),
        backgroundColor: "rgba(236,250,240,0.96)",
        borderRadius: s(28),
        borderWidth: s(2),
        borderColor: "#BEE3CB",
        paddingHorizontal: s(16),
        paddingVertical: s(6),
      }}
    >
      <View
        style={{
          width: s(26),
          height: s(26),
          borderRadius: s(13),
          backgroundColor: "#1FB05F",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="checkmark" size={s(18)} color="#fff" />
      </View>
      <Txt size={20} weight="black" color="#0B4A2A">
        {`${done} / ${total} සම්පූර්ණයි`}
      </Txt>
    </View>
  );
}

/** Round settings button for the sign header (decorative, no action yet - same as the shared Page). */
function Gear() {
  const { s } = useU();
  return (
    <View
      accessibilityLabel="සැකසුම්"
      style={{
        width: s(62),
        height: s(62),
        borderRadius: s(31),
        backgroundColor: "#176B45",
        borderWidth: s(3),
        borderColor: "#3FA66B",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name="settings-outline" size={s(34)} color="#fff" />
    </View>
  );
}

/**
 * Full-screen school background + header + back button + (decorative) gear.
 * Replaces the shared `Page` for the sinhala-slow screens only. `children` are laid out below the header.
 *
 * header="sign" (default): hanging wooden sign, `right` sits next to the gear (menu screen).
 * header="bar": dark green bar with back button, title and `right` inside it, gear outside (letters / quiz screens).
 *   The bar and gear are placed with the same proportions as the designs (fractions of the screen).
 */
export function SlowPage({
  title,
  right,
  showBack = true,
  onBack,
  header = "sign",
  background = "school",
  children,
}: {
  title: string;
  right?: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  header?: "sign" | "bar";
  background?: "school" | "punctuation" | "letter";
  children: ReactNode;
}) {
  const { s } = useU();
  const { width: W, height: H } = useWindowDimensions();
  const back =
    onBack ??
    (() => (router.canGoBack() ? router.back() : router.replace("/")));
  const isBar = header === "bar";
  const backgroundSource =
    background === "punctuation"
      ? punctuationBg
      : background === "letter"
        ? letterBg
        : schoolBg;

  // bar proportions measured from the designs (1672 x 941)
  const barTop = H * 0.09;
  const barH = H * 0.117;
  const gearD = H * 0.122;

  return (
    <View style={{ flex: 1, backgroundColor: "#7FC8F0" }}>
      {/* anchored bottom-left so the boy and flowers stay visible when the sides/top are cropped */}
      <Image
        source={backgroundSource}
        contentFit="cover"
        contentPosition={{ left: 0, bottom: 0 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={{ flex: 1, paddingTop: isBar ? barTop + barH : s(96) }}>
        {children}
      </View>

      {isBar ? (
        <>
          <View
            style={{
              position: "absolute",
              top: barTop,
              left: W * 0.127,
              right: W * 0.098,
              height: barH,
              borderRadius: barH / 2,
              backgroundColor: "#0A5F38",
              borderWidth: barH * 0.04,
              borderColor: "#27925A",
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: showBack ? barH * 0.06 : barH * 0.45,
              paddingRight: barH * 0.45,
              shadowColor: "#06361F",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              elevation: 6,
            }}
          >
            {showBack ? (
              <Pressable
                onPress={back}
                accessibilityRole="button"
                accessibilityLabel="ආපසු"
                style={{
                  width: barH * 0.86,
                  height: barH * 0.86,
                  borderRadius: barH * 0.43,
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="arrow-back"
                  size={barH * 0.52}
                  color="#1B8A3F"
                  style={{
                    textShadowColor: "#1B8A3F",
                    textShadowOffset: { width: 1, height: 0 },
                    textShadowRadius: 0,
                  }}
                />
              </Pressable>
            ) : null}
            <View style={{ flex: 1, marginLeft: barH * 0.34 }}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontFamily: fonts.black,
                  fontSize: H * 0.046,
                  lineHeight: H * 0.07,
                  color: "#fff",
                }}
              >
                {title}
              </Text>
            </View>
            {right}
          </View>
          {/* decorative gear, no action (same as the shared Page) */}
          <View
            accessibilityLabel="සැකසුම්"
            style={{
              position: "absolute",
              right: W * 0.019,
              top: barTop + barH / 2 - gearD / 2,
              width: gearD,
              height: gearD,
              borderRadius: gearD / 2,
              backgroundColor: "#0F6B3E",
              borderWidth: gearD * 0.06,
              borderColor: "#2FA566",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="settings-outline"
              size={gearD * 0.52}
              color="#fff"
            />
          </View>
        </>
      ) : (
        <>
          {/* hanging sign */}
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              alignItems: "center",
            }}
          >
            <View style={{ width: s(520), paddingTop: s(24) }}>
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: s(70),
                  width: s(6),
                  height: s(36),
                  backgroundColor: "#8A5A2B",
                  borderRadius: s(3),
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  right: s(70),
                  width: s(6),
                  height: s(36),
                  backgroundColor: "#8A5A2B",
                  borderRadius: s(3),
                }}
              />
              <View
                style={{
                  height: s(74),
                  borderRadius: s(12),
                  backgroundColor: "#EDC689",
                  borderWidth: s(3),
                  borderColor: "#C48A45",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: s(20),
                  shadowColor: "#5A3410",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  elevation: 6,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: s(24),
                    height: s(2),
                    backgroundColor: "rgba(150,95,40,0.18)",
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: s(48),
                    height: s(2),
                    backgroundColor: "rgba(150,95,40,0.18)",
                  }}
                />
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontFamily: fonts.black,
                    fontSize: s(38),
                    lineHeight: s(54),
                    color: "#4A2408",
                    textAlign: "center",
                  }}
                >
                  {title}
                </Text>
              </View>
              <Ionicons
                name="leaf"
                size={s(22)}
                color="#3FA34D"
                style={{
                  position: "absolute",
                  top: s(14),
                  left: s(54),
                  transform: [{ rotate: "-40deg" }],
                }}
              />
              <Ionicons
                name="leaf"
                size={s(22)}
                color="#3FA34D"
                style={{
                  position: "absolute",
                  top: s(14),
                  right: s(54),
                  transform: [{ rotate: "40deg" }],
                }}
              />
            </View>
          </View>

          {showBack ? (
            <Pressable
              onPress={back}
              accessibilityRole="button"
              accessibilityLabel="ආපසු"
              style={{
                position: "absolute",
                top: s(14),
                left: s(30),
                width: s(60),
                height: s(60),
                borderRadius: s(30),
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <Ionicons
                name="arrow-back"
                size={s(36)}
                color="#1B8A3F"
                style={{
                  textShadowColor: "#1B8A3F",
                  textShadowOffset: { width: s(1), height: 0 },
                  textShadowRadius: 0,
                }}
              />
            </Pressable>
          ) : null}

          <View
            pointerEvents="box-none"
            style={{
              position: "absolute",
              top: s(14),
              right: s(24),
              flexDirection: "row",
              alignItems: "center",
              gap: s(14),
            }}
          >
            {right}
            <Gear />
          </View>
        </>
      )}
    </View>
  );
}
