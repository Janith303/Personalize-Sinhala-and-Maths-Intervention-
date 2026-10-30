import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View, useWindowDimensions } from "react-native";

import { useU } from "@/components/common/layout";
import { SlowButton } from "@/components/sinhala-slow/SlowButton";
import { SlowPage } from "@/components/sinhala-slow/SlowPage";
import {
  LETTERS,
  PILLAM_QUESTIONS,
  PUNCTUATION_QUESTIONS,
  scoreLabel,
} from "@/constants/sinhala-slow/content";
import { accent } from "@/constants/common/theme";
import { fonts } from "@/constants/common/theme";
import { useSlowProgress } from "@/contexts/sinhala-slow/progress";

function useK() {
  const { u, width, height } = useU();
  const k = height / 941;
  return { k, d: (n: number) => n * k, W: width, H: height };
}

function DText({
  size,
  weight = "black",
  color,
  align,
  lines,
  children,
  style,
}: {
  size: number;
  weight?: "regular" | "semi" | "bold" | "black";
  color: string;
  align?: "left" | "center" | "right";
  lines?: number;
  children: React.ReactNode;
  style?: any;
}) {
  const { d } = useK();
  return (
    <Text
      numberOfLines={lines}
      style={[
        {
          fontFamily: fonts[weight],
          fontSize: d(size),
          lineHeight: d(size * 1.45),
          color,
          textAlign: align,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

/** Floating faint Sinhala letters behind the result panel. */
function FloatingLetters() {
  const { d } = useK();
  const items = [
    { c: "ක", x: 60, y: 30, size: 54, color: "rgba(120,190,150,0.35)" },
    { c: "අ", x: 220, y: 15, size: 48, color: "rgba(230,160,160,0.3)" },
    { c: "ඉ", x: 530, y: 10, size: 52, color: "rgba(120,190,150,0.3)" },
    { c: "ඔ", x: 760, y: 30, size: 44, color: "rgba(230,160,160,0.3)" },
    { c: "ග", x: 950, y: 15, size: 50, color: "rgba(180,160,220,0.3)" },
    { c: "ච", x: 1100, y: 25, size: 46, color: "rgba(120,190,150,0.3)" },
    { c: "හ", x: 120, y: 520, size: 50, color: "rgba(180,160,220,0.35)" },
    { c: "ර", x: 340, y: 540, size: 44, color: "rgba(120,190,150,0.3)" },
    { c: "ද", x: 600, y: 550, size: 48, color: "rgba(230,160,160,0.3)" },
    { c: "ල", x: 830, y: 530, size: 52, color: "rgba(120,190,150,0.35)" },
    { c: "න", x: 1020, y: 540, size: 46, color: "rgba(180,160,220,0.3)" },
  ];
  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
    >
      {items.map((b, i) => (
        <Text
          key={i}
          style={{
            position: "absolute",
            left: d(b.x),
            top: d(b.y),
            fontFamily: fonts.black,
            fontSize: d(b.size),
            lineHeight: d(b.size * 1.5),
            color: b.color,
          }}
        >
          {b.c}
        </Text>
      ))}
    </View>
  );
}

/** Score bars at the bottom of quiz result cards. */
function ScoreBars({ score, total }: { score: number; total: number }) {
  const { d } = useK();
  return (
    <View
      style={{
        flexDirection: "row",
        gap: d(12),
        alignSelf: "center",
        marginTop: d(12),
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            width: d(50),
            height: d(30),
            borderRadius: d(15),
            backgroundColor: i < score ? "#0B7A45" : "#B8D8C8",
          }}
        />
      ))}
    </View>
  );
}

/** Screen 22: scores for the three activities, with correct/wrong per letter. */
export default function ResultScreen() {
  const { d, W, H } = useK();
  const { letterResults, letterScore, punctuationScore, pillamScore, reset } =
    useSlowProgress();

  const puncLabel = scoreLabel(punctuationScore ?? 0);
  const pillamLabel = scoreLabel(pillamScore ?? 0);
  const letterLabel = scoreLabel(letterScore);

  return (
    <SlowPage title="ඔබේ ප්‍රතිඵල" header="bar">
      <View
        style={{
          flex: 1,
          paddingLeft: W * 0.2,
          paddingRight: W * 0.052,
          paddingTop: H * 0.018,
          paddingBottom: H * 0.05,
        }}
      >
        <View
          style={{
            flex: 1,
            marginHorizontal: W * 0.03,
            backgroundColor: "#F1F9F3",
            borderRadius: d(60),
            borderWidth: d(6),
            borderColor: "#2FA566",
            padding: d(22),
            shadowColor: "#06361F",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <FloatingLetters />

          <View style={{ flex: 1, flexDirection: "row", gap: d(22) }}>
            {/* ---- අකුරු ලිවීම ---- */}
            <View
              style={{
                flex: 1.15,
                backgroundColor: "#2D6CDF",
                borderRadius: d(30),
                borderWidth: d(6),
                borderColor: "#4DB97E",
                padding: d(16),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: d(14),
                }}
              >
                <View
                  style={{
                    width: d(56),
                    height: d(56),
                    borderRadius: d(14),
                    backgroundColor: "#0B7A45",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DText size={36} color="#fff">
                    අ
                  </DText>
                </View>
                <View style={{ alignItems: "center" }}>
                  <DText
                    size={42}
                    color="#111"
                    align="center"
                    style={{ lineHeight: d(50) }}
                  >
                    අකුරු ලිවීම
                  </DText>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: d(14),
                  marginTop: d(6),
                }}
              >
                <DText size={78} color="#111" style={{ lineHeight: d(94) }}>
                  {letterScore} / {LETTERS.length}
                </DText>
                <View
                  style={{
                    backgroundColor: letterScore < 3 ? "#C62828" : "#0B7A45",
                    borderRadius: d(22),
                    borderWidth: d(2),
                    borderColor: "#111",
                    paddingHorizontal: d(18),
                    paddingVertical: d(23),
                  }}
                >
                  <DText size={28} color="#fff">
                    {letterLabel.text}
                  </DText>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  gap: d(6),
                  marginTop: d(6),
                }}
              >
                {LETTERS.map((l, i) => {
                  const ok = letterResults[i] === "correct";
                  return (
                    <View
                      key={l.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#E9F8EC",
                        borderRadius: d(14),
                        borderWidth: d(3),
                        borderColor: "#111",
                        marginHorizontal: d(80),
                        paddingHorizontal: d(14),
                        height: d(58),
                      }}
                    >
                      <DText
                        size={40}
                        color="#0B4A2A"
                        style={{ lineHeight: d(58) }}
                      >
                        {l.glyph}
                      </DText>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: d(6),
                          backgroundColor: ok ? "#DDF0E4" : accent.wrongBg,
                          borderRadius: d(16),
                          borderWidth: d(2),
                          borderColor: ok ? "#7BC89C" : "#E5A6A1",
                          paddingHorizontal: d(12),
                          paddingVertical: d(1),
                        }}
                      >
                        <Ionicons
                          name={ok ? "checkmark" : "close"}
                          size={d(22)}
                          color={ok ? "#0B7A45" : accent.wrongText}
                        />
                        <DText
                          size={32}
                          weight="black"
                          color={ok ? "#0B7A45" : accent.wrongText}
                        >
                          {ok ? "නිවැරදි" : "වැරදි"}
                        </DText>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* ---- විරාම ලක්ෂණ ---- */}
            <View
              style={{
                flex: 0.92,
                backgroundColor: "#7A3FB5",
                borderRadius: d(30),
                borderWidth: d(6),
                borderColor: "#B09AEF",
                padding: d(16),
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: d(14),
                }}
              >
                <View
                  style={{
                    width: d(56),
                    height: d(56),
                    borderRadius: d(14),
                    backgroundColor: accent.purple,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DText size={30} color="#fff">
                    ?!
                  </DText>
                </View>
                <DText size={40} color="#111" style={{ lineHeight: d(50) }}>
                  විරාම ලක්ෂණ
                </DText>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <DText size={104} color="#111" style={{ lineHeight: d(126) }}>
                  {punctuationScore ?? 0} / {PUNCTUATION_QUESTIONS.length}
                </DText>
                <View
                  style={{
                    backgroundColor:
                      (punctuationScore ?? 0) < 3 ? "#C62828" : "#0B7A45",
                    borderRadius: d(26),
                    borderWidth: d(2),
                    borderColor: "#111",
                    paddingHorizontal: d(28),
                    paddingVertical: d(23),
                    marginTop: d(28),
                  }}
                >
                  <DText size={34} color="#fff">
                    {puncLabel.text}
                  </DText>
                </View>
              </View>
              <ScoreBars
                score={punctuationScore ?? 0}
                total={PUNCTUATION_QUESTIONS.length}
              />
            </View>

            {/* ---- පිල්ලම් භාවිතය ---- */}
            <View
              style={{
                flex: 0.92,
                backgroundColor: "#D98A16",
                borderRadius: d(30),
                borderWidth: d(6),
                borderColor: "#E8CA6A",
                padding: d(16),
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: d(14),
                }}
              >
                <View
                  style={{
                    width: d(56),
                    height: d(56),
                    borderRadius: d(14),
                    backgroundColor: accent.brown,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DText size={30} color="#fff">
                    කු
                  </DText>
                </View>
                <DText size={40} color="#111" style={{ lineHeight: d(50) }}>
                  පිල්ලම් භාවිතය
                </DText>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <DText size={104} color="#111" style={{ lineHeight: d(126) }}>
                  {pillamScore ?? 0} / {PILLAM_QUESTIONS.length}
                </DText>
                <View
                  style={{
                    backgroundColor:
                      (pillamScore ?? 0) < 3 ? "#C62828" : "#0B7A45",
                    borderRadius: d(26),
                    borderWidth: d(2),
                    borderColor: "#111",
                    paddingHorizontal: d(28),
                    paddingVertical: d(23),
                    marginTop: d(28),
                  }}
                >
                  <DText size={34} color="#fff">
                    {pillamLabel.text}
                  </DText>
                </View>
              </View>
              <ScoreBars
                score={pillamScore ?? 0}
                total={PILLAM_QUESTIONS.length}
              />
            </View>
          </View>

          {/* retry button */}
          <View style={{ alignItems: "center", paddingTop: d(16) }}>
            <SlowButton
              label="නැවත උත්සාහ කරමු"
              icon="refresh"
              iconLeft
              width={440}
              height={66}
              size={30}
              onPress={() => {
                reset();
                router.replace("/sinhala-slow");
              }}
            />
          </View>
        </View>
      </View>
    </SlowPage>
  );
}
