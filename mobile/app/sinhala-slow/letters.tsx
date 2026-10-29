import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Linking, View } from "react-native";

import { ProgressDots, Txt, useU } from "@/components/common/layout";
import { NoticeCard } from "@/components/sinhala-slow/NoticeCard";
import { SlowButton } from "@/components/sinhala-slow/SlowButton";
import { SlowPage } from "@/components/sinhala-slow/SlowPage";
import { LETTERS } from "@/constants/sinhala-slow/content";
import { useSlowProgress } from "@/contexts/sinhala-slow/progress";
import {
  API_BASE_URL,
  ApiError,
  checkLetter,
} from "@/services/sinhala-slow/api";

type Stage =
  "capture" | "loading" | "unclear" | "wrongLetter" | "connection" | "noCamera";

/** one page per letter, photo checked by the model. */
export default function LettersScreen() {
  const { s } = useU();
  const { letterResults, setLetterResult } = useSlowProgress();
  const [index, setIndex] = useState(() =>
    Math.max(
      0,
      letterResults.findIndex((r) => r === null),
    ),
  );
  const [photo, setPhoto] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("capture");
  const [detail, setDetail] = useState("");
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();

  const letter = LETTERS[index];
  const isLast = index === LETTERS.length - 1;
  const title = "අකුරු ලිවීම";
  const pageTitle = `අකුර ${index + 1} / ${LETTERS.length} · ${title}`;

  // allowsEditing opens the system crop screen; aspect [1, 1] keeps the crop square
  const CROP = {
    allowsEditing: true,
    aspect: [1, 1] as [number, number],
    quality: 0.8,
  };

  async function pickFromGallery() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      ...CROP,
    });
    if (!res.canceled) setPhoto(res.assets[0].uri);
  }

  async function takePhoto() {
    const current = permission?.granted
      ? permission
      : await requestPermission();
    if (!current.granted) {
      setStage("noCamera");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      ...CROP,
    });
    if (!res.canceled) setPhoto(res.assets[0].uri);
  }

  async function submit() {
    if (!photo) return;
    setStage("loading");
    try {
      const result = await checkLetter(photo, letter.id);
      if (result.verdict === "try_again") {
        setStage("unclear");
        return;
      }
      if (result.verdict === "wrong_letter") {
        setStage("wrongLetter");
        return;
      }
      // correct / wrong is stored silently and only shown on the results page
      setLetterResult(index, result.verdict);
      setPhoto(null);
      setStage("capture");
      if (isLast) router.replace("/sinhala-slow");
      else setIndex(index + 1);
    } catch (e) {
      if (e instanceof ApiError && e.kind === "unclear") {
        setStage("unclear");
        return;
      }
      setDetail(e instanceof ApiError ? e.detail : String(e));
      setStage("connection");
    }
  }

  const retake = () => {
    setPhoto(null);
    setStage("capture");
  };

  if (stage === "loading") {
    return (
      <SlowPage title={title} header="bar" background="letter">
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: s(24),
          }}
        >
          <View
            style={{
              width: s(480),
              height: s(320),
              backgroundColor: "rgba(255,255,255,0.97)",
              borderRadius: s(34),
              borderWidth: s(5),
              borderColor: "#2FA566",
              alignItems: "center",
              justifyContent: "center",
              gap: s(18),
              padding: s(24),
              shadowColor: "#06361F",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <View
              style={{
                width: s(112),
                height: s(112),
                borderRadius: s(56),
                borderWidth: s(10),
                borderColor: "#D2EEDD",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large" color="#1A8553" />
            </View>
            <Txt
              size={40}
              weight="black"
              color="#0B5A32"
              align="center"
              style={{ lineHeight: s(54) }}
            >
              පරීක්ෂා කරමින්…
            </Txt>
          </View>
        </View>
      </SlowPage>
    );
  }

  if (stage === "unclear") {
    return (
      <SlowPage title={title} header="bar" background="letter">
        <NoticeCard
          title="අකුර පැහැදිලිව පෙනෙන්නේ නැත."
          text="කරුණාකර නැවත ඡායාරූපයක් ගන්න."
          buttonLabel="නැවත උත්සාහ කරමු"
          onPress={retake}
        />
      </SlowPage>
    );
  }

  if (stage === "wrongLetter") {
    return (
      <SlowPage title={title} header="bar" background="letter">
        <NoticeCard
          title={`මෙය ${letter.glyph} අකුර නොවේ.`}
          text={`කරුණාකර ${letter.glyph} අකුර ලියා නැවත ඡායාරූපයක් ගන්න.`}
          buttonLabel="නැවත උත්සාහ කරමු"
          onPress={retake}
        />
      </SlowPage>
    );
  }

  if (stage === "connection") {
    return (
      <SlowPage title={title} header="bar" background="letter">
        <NoticeCard
          title="සේවාදායකයට සම්බන්ධ විය නොහැක."
          text="අන්තර්ජාල සම්බන්ධතාවය පරීක්ෂා කර නැවත උත්සාහ කරන්න."
          extra={`${API_BASE_URL}${detail ? `\n${detail}` : ""}`}
          buttonLabel="නැවත යවමු"
          onPress={submit}
        />
      </SlowPage>
    );
  }

  if (stage === "noCamera") {
    const blocked =
      permission && !permission.canAskAgain && !permission.granted;
    return (
      <SlowPage title={title} header="bar" background="letter">
        <NoticeCard
          title="කැමරාවට අවසර අවශ්‍යයි."
          text="ඡායාරූපයක් ගැනීමට කැමරාව භාවිතා කිරීමට ඉඩ දෙන්න, නැතහොත් ගැලරියෙන් තෝරන්න."
          buttonLabel={blocked ? "සැකසුම් විවෘත කරන්න" : "නැවත උත්සාහ කරමු"}
          onPress={() => {
            if (blocked) Linking.openSettings();
            else retake();
          }}
        />
      </SlowPage>
    );
  }

  return (
    <SlowPage
      title={pageTitle}
      header="bar"
      background="letter"
      right={<ProgressDots count={LETTERS.length} index={index} />}
    >
      {/* left padding keeps the boy in the background visible */}
      <View
        style={{
          flex: 1,
          paddingLeft: s(290),
          paddingRight: s(130),
          paddingTop: s(20),
          paddingBottom: s(24),
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            gap: s(22),
            backgroundColor: "#F1F9F3",
            borderRadius: s(34),
            borderWidth: s(4),
            borderColor: "#5DBB82",
            padding: s(18),
            shadowColor: "#06361F",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {/* the requested letter */}
          <View
            style={{
              width: s(365),
              backgroundColor: "#fff",
              borderRadius: s(26),
              borderWidth: s(2),
              borderColor: "#D3EBDC",
              padding: s(14),
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Txt
                size={200}
                weight="black"
                color="#0B5A32"
                style={{ lineHeight: s(270) }}
              >
                {letter.glyph}
              </Txt>
            </View>
            <View
              style={{
                alignSelf: "stretch",
                flexDirection: "row",
                alignItems: "center",
                gap: s(10),
                backgroundColor: "#FDEBB4",
                borderRadius: s(24),
                paddingHorizontal: s(14),
                paddingVertical: s(8),
              }}
            >
              <Ionicons name="pencil" size={s(32)} color="#F2A81D" />
              <View style={{ flex: 1 }}>
                <Txt size={21} weight="black" color="#6B3A00">
                  මෙම අකුර කඩදාසියක ලියන්න
                </Txt>
              </View>
            </View>
          </View>

          {/* photo + actions */}
          <View style={{ flex: 1, gap: s(14) }}>
            <View
              style={{
                flex: 1,
                borderRadius: s(26),
                borderWidth: s(2),
                borderStyle: "dashed",
                borderColor: "#5DBB82",
                backgroundColor: photo ? "#fff" : "#E4F4EA",
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {photo ? (
                <>
                  <Image
                    source={{ uri: photo }}
                    contentFit="contain"
                    style={{ width: "100%", height: "100%" }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      right: s(12),
                      top: s(12),
                      width: s(46),
                      height: s(46),
                      borderRadius: s(23),
                      backgroundColor: "#1F9D5F",
                      borderWidth: s(3),
                      borderColor: "#fff",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="checkmark" size={s(28)} color="#fff" />
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      left: s(12),
                      bottom: s(12),
                      flexDirection: "row",
                      alignItems: "center",
                      gap: s(8),
                      backgroundColor: "#37453D",
                      borderRadius: s(18),
                      paddingHorizontal: s(14),
                      paddingVertical: s(3),
                    }}
                  >
                    <Ionicons name="image-outline" size={s(20)} color="#fff" />
                    <Txt size={18} weight="bold" color="#fff">
                      ඡායාරූපය
                    </Txt>
                  </View>
                </>
              ) : (
                <>
                  <Ionicons
                    name="image"
                    size={s(96)}
                    color="rgba(150,200,172,0.45)"
                    style={{ position: "absolute", right: s(12), bottom: s(8) }}
                  />
                  <View style={{ alignItems: "center", gap: s(10) }}>
                    <View
                      style={{
                        width: s(72),
                        height: s(72),
                        borderRadius: s(36),
                        backgroundColor: "#fff",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="camera" size={s(38)} color="#0F7A43" />
                    </View>
                    <Txt size={26} weight="black" color="#0B4A2A">
                      ඡායාරූපය මෙතැනට
                    </Txt>
                  </View>
                </>
              )}
            </View>

            {photo ? (
              <View style={{ flexDirection: "row", gap: s(14) }}>
                <SlowButton
                  label="නැවත ගන්න"
                  icon="refresh"
                  iconLeft
                  variant="cream"
                  onPress={takePhoto}
                  height={60}
                  size={22}
                  px={12}
                  style={{ flex: 1 }}
                />
                <SlowButton
                  label={isLast ? "අවසන් කරමු" : "ඉදිරියට යමු"}
                  icon={isLast ? "checkmark" : "arrow-forward"}
                  onPress={submit}
                  height={60}
                  size={26}
                  style={{ flex: 1.3 }}
                />
              </View>
            ) : (
              <>
                <View style={{ flexDirection: "row", gap: s(14) }}>
                  <SlowButton
                    label="ඡායාරූපයක් ගන්න"
                    icon="camera-outline"
                    iconLeft
                    onPress={takePhoto}
                    height={60}
                    size={19}
                    px={8}
                    style={{ flex: 1 }}
                  />
                  <SlowButton
                    label="ගැලරියෙන් තෝරන්න"
                    icon="image-outline"
                    iconLeft
                    variant="cream"
                    onPress={pickFromGallery}
                    height={60}
                    size={19}
                    px={8}
                    style={{ flex: 1 }}
                  />
                </View>
                <SlowButton
                  label="ඉදිරියට යමු"
                  icon="arrow-forward"
                  disabled
                  onPress={() => {}}
                  height={60}
                  size={26}
                />
              </>
            )}
          </View>
        </View>
      </View>
    </SlowPage>
  );
}
