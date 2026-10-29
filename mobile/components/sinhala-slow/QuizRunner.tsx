import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState, type ReactNode } from "react";
import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type TextStyle,
} from "react-native";

import { ProgressDots, useU } from "@/components/common/layout";
import { SlowPage } from "@/components/sinhala-slow/SlowPage";
import {
  type FillQuestion,
  type MatchQuestion,
  type McqQuestion,
  type Question,
  type WordQuestion,
} from "@/constants/sinhala-slow/content";
import { fonts, greenTheme, type Weight } from "@/constants/common/theme";

/** single choice -> option index; match -> chosen name index per slot */
type Value = number | null | (number | null)[];

const birdImage = require("../../assets/images/sinhala-slow/bird.png");
const theme = greenTheme;

/** Option markers shown in the tiles (අ ආ ඉ ඊ), as in the new designs. */
const MARKERS = ["1", "2", "3", "4"];

/** Border colour + marker background per option position. */
const TINTS = [
  { border: "#4DB97E", badgeBg: "#DCF0E3" },
  { border: "#F5B531", badgeBg: "#FFEFC8" },
  { border: "#F59BBD", badgeBg: "#FCDDE8" },
  { border: "#A78BFA", badgeBg: "#E7DDFB" },
];

function useK() {
  const { u, width, height } = useU();
  const k = height / 941;
  return {
    k,
    d: (n: number) => n * k,
    g: (n: number) => (n * k) / u,
    W: width,
    H: height,
  };
}

function DText({
  size,
  weight = "black",
  color,
  align,
  lines,
  fit,
  style,
  children,
}: {
  size: number;
  weight?: Weight;
  color: string;
  align?: TextStyle["textAlign"];
  lines?: number;
  fit?: boolean;
  style?: StyleProp<TextStyle>;
  children: ReactNode;
}) {
  const { d } = useK();
  return (
    <Text
      numberOfLines={lines}
      adjustsFontSizeToFit={fit}
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

function initialValue(q: Question): Value {
  return q.kind === "match" ? q.symbols.map(() => null) : null;
}

function isAnswered(q: Question, v: Value): boolean {
  if (q.kind === "match")
    return (v as (number | null)[]).every((x) => x !== null);
  return v !== null;
}

function isCorrect(q: Question, v: Value): boolean {
  if (q.kind === "match")
    return (v as (number | null)[]).every((x, i) => x === i);
  return v === q.answer;
}

/** Question title on a wooden plank with leaves at both ends. */
function Prompt({ children }: { children: string }) {
  const { d } = useK();
  return (
    <View style={{ alignSelf: "center", maxWidth: "94%" }}>
      <View
        style={{
          height: d(93),
          borderRadius: d(42),
          backgroundColor: "#F8DB9F",
          borderWidth: d(4),
          borderColor: "#E4AA4A",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: d(70),
          shadowColor: "#7A5418",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <View
          style={{
            position: "absolute",
            left: d(26),
            width: d(10),
            height: d(10),
            borderRadius: d(5),
            backgroundColor: "#B7772E",
          }}
        />
        <View
          style={{
            position: "absolute",
            right: d(26),
            width: d(10),
            height: d(10),
            borderRadius: d(5),
            backgroundColor: "#B7772E",
          }}
        />
        <DText size={44} color="#0F5132" align="center" lines={1} fit>
          {children}
        </DText>
      </View>
      <Ionicons
        name="leaf"
        size={d(74)}
        color="#4CAF50"
        style={{
          position: "absolute",
          left: d(-38),
          top: d(-14),
          transform: [{ rotate: "-35deg" }],
        }}
      />
      <Ionicons
        name="leaf"
        size={d(54)}
        color="#7BC65B"
        style={{
          position: "absolute",
          left: d(-30),
          top: d(34),
          transform: [{ rotate: "-110deg" }],
        }}
      />
      <Ionicons
        name="leaf"
        size={d(74)}
        color="#4CAF50"
        style={{
          position: "absolute",
          right: d(-38),
          top: d(-14),
          transform: [{ rotate: "35deg" }],
        }}
      />
      <Ionicons
        name="leaf"
        size={d(54)}
        color="#7BC65B"
        style={{
          position: "absolute",
          right: d(-30),
          top: d(34),
          transform: [{ rotate: "110deg" }],
        }}
      />
    </View>
  );
}

/** Answer tile: marker badge + content. `tint` picks the border colour of that option position. */
function OptionTile({
  tint,
  selected,
  onPress,
  height,
  column,
  mint,
  children,
}: {
  tint: number;
  selected: boolean;
  onPress: () => void;
  height: number;
  column?: boolean;
  /** all badges pale green (multiple choice); otherwise each badge takes its tile colour */
  mint?: boolean;
  children: ReactNode;
}) {
  const { d } = useK();
  const t = TINTS[tint % TINTS.length];
  const badge = column ? 66 : 82;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{
        height: d(height),
        backgroundColor: selected ? "#E6F5EB" : "#fff",
        borderRadius: d(38),
        borderWidth: d(selected ? 5 : 4),
        borderColor: selected ? theme.btn : t.border,
        flexDirection: column ? "column" : "row",
        alignItems: "center",
        justifyContent: column ? "center" : "flex-start",
        gap: d(column ? 8 : 24),
        paddingHorizontal: d(column ? 12 : 28),
        shadowColor: "#2A5A40",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.14,
        shadowRadius: 5,
        elevation: 3,
      }}
    >
      <View
        style={{
          width: d(badge),
          height: d(badge),
          borderRadius: d(18),
          backgroundColor: selected ? theme.btn : mint ? "#DCF0E3" : t.badgeBg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DText size={column ? 36 : 44} color={selected ? "#fff" : theme.ink}>
          {MARKERS[tint % MARKERS.length]}
        </DText>
      </View>
      <View
        style={{
          flex: column ? undefined : 1,
          alignItems: column ? "center" : "flex-start",
        }}
      >
        {children}
      </View>
      {selected && !column ? (
        <Ionicons name="checkmark-circle" size={d(56)} color={theme.btn} />
      ) : null}
    </Pressable>
  );
}

function McqView({
  q,
  value,
  onChange,
}: {
  q: McqQuestion;
  value: Value;
  onChange: (v: Value) => void;
}) {
  const { d } = useK();
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: d(27),
      }}
    >
      {q.options.map((o, i) => (
        <View key={i} style={{ width: "49.2%" }}>
          <OptionTile
            mint
            tint={i}
            selected={value === i}
            onPress={() => onChange(i)}
            height={143}
          >
            <DText
              size={q.size === "lg" ? 52 : 36}
              color="#1F2D26"
              style={{ lineHeight: d((q.size === "lg" ? 52 : 36) * 1.35) }}
            >
              {o}
            </DText>
          </OptionTile>
        </View>
      ))}
    </View>
  );
}

function FillView({
  q,
  value,
  onChange,
}: {
  q: FillQuestion;
  value: Value;
  onChange: (v: Value) => void;
}) {
  const { d } = useK();
  const chosen = typeof value === "number" ? q.options[value] : undefined;
  return (
    <View style={{ gap: d(20) }}>
      <View
        style={{
          height: d(122),
          backgroundColor: "#fff",
          borderRadius: d(34),
          borderWidth: d(3),
          borderColor: "#BFE0CB",
          paddingHorizontal: d(24),
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
          columnGap: d(16),
          paddingBottom: d(24),
        }}
      >
        <DText size={44} color={theme.inkDark}>
          {q.before}
        </DText>
        <View
          style={{
            minWidth: d(330),
            height: d(60),
            borderBottomWidth: d(4),
            borderBottomColor: theme.btn,
            alignItems: "center",
            justifyContent: "flex-end",
            paddingHorizontal: d(10),
          }}
        >
          {chosen ? (
            <DText size={42} color={theme.btn}>
              {chosen}
            </DText>
          ) : null}
        </View>
        <DText size={44} color={theme.inkDark}>
          {q.after}
        </DText>
      </View>
      <View style={{ flexDirection: "row", gap: d(16) }}>
        {q.options.map((o, i) => (
          <View key={i} style={{ flex: 1 }}>
            <OptionTile
              column
              tint={i}
              selected={value === i}
              onPress={() => onChange(i)}
              height={176}
            >
              <DText size={34} color="#1F2D26" align="center">
                {o}
              </DText>
            </OptionTile>
          </View>
        ))}
      </View>
    </View>
  );
}

function MatchView({
  q,
  value,
  onChange,
}: {
  q: MatchQuestion;
  value: Value;
  onChange: (v: Value) => void;
}) {
  const { d } = useK();
  const slots = value as (number | null)[];
  const [chip, setChip] = useState<number | null>(null);
  const used = new Set(slots.filter((x): x is number => x !== null));

  const tapSlot = (i: number) => {
    if (chip !== null) {
      const next = slots.map((x) => (x === chip ? null : x));
      next[i] = chip;
      onChange(next);
      setChip(null);
    } else if (slots[i] !== null) {
      onChange(slots.map((x, k) => (k === i ? null : x)));
    }
  };

  return (
    <View style={{ gap: d(18) }}>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          rowGap: d(26),
        }}
      >
        {q.symbols.map((sym, i) => (
          <View
            key={i}
            style={{
              width: "49.2%",
              flexDirection: "row",
              gap: d(18),
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: d(96),
                height: d(96),
                borderRadius: d(24),
                backgroundColor: "#fff",
                borderWidth: d(3),
                borderColor: "#BFE0CB",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DText
                size={58}
                color={theme.inkDark}
                style={{ lineHeight: d(80) }}
              >
                {sym}
              </DText>
            </View>
            <Pressable
              onPress={() => tapSlot(i)}
              accessibilityRole="button"
              style={{
                flex: 1,
                height: d(96),
                borderRadius: d(24),
                borderWidth: d(3),
                borderStyle: "dashed",
                borderColor:
                  chip !== null && slots[i] === null ? theme.btn : "#7CC59C",
                backgroundColor: slots[i] !== null ? "#E3F4E9" : "#E8F5EC",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {slots[i] !== null ? (
                <DText size={32} color={theme.inkDark} lines={1} fit>
                  {q.names[slots[i] as number]}
                </DText>
              ) : null}
            </Pressable>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", gap: d(16) }}>
        {q.chipOrder.map((n) => {
          const taken = used.has(n);
          return (
            <Pressable
              key={n}
              disabled={taken}
              onPress={() => setChip(chip === n ? null : n)}
              style={{
                flexGrow: 1,
                height: d(76),
                alignItems: "center",
                justifyContent: "center",
                borderRadius: d(38),
                borderWidth: d(3),
                borderColor: chip === n ? theme.btn : "#BFE0CB",
                backgroundColor: chip === n ? "#E3F4E9" : "#fff",
                opacity: taken ? 0.35 : 1,
                paddingHorizontal: d(26),
              }}
            >
              <DText size={32} color={theme.inkDark} lines={1}>
                {q.names[n]}
              </DText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function WordView({
  q,
  value,
  onChange,
}: {
  q: WordQuestion;
  value: Value;
  onChange: (v: Value) => void;
}) {
  const { d } = useK();
  const chosen = typeof value === "number" ? q.options[value] : undefined;
  return (
    <View style={{ gap: d(16) }}>
      <View
        style={{
          alignSelf: "center",
          minWidth: d(520),
          backgroundColor: "#fff",
          borderRadius: d(34),
          borderWidth: d(3),
          borderColor: q.blank ? "#BFE0CB" : theme.btn,
          alignItems: "center",
          paddingHorizontal: d(56),
          paddingVertical: d(8),
        }}
      >
        {q.image === "bird" ? (
          <Image
            source={birdImage}
            contentFit="contain"
            style={{ width: d(150), height: d(84) }}
          />
        ) : null}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {q.before ? (
            <DText
              size={q.blank ? 70 : 80}
              color={theme.inkDark}
              style={{ lineHeight: d((q.blank ? 70 : 80) * 1.25) }}
            >
              {q.before}
            </DText>
          ) : null}
          {q.blank ? (
            <View
              style={{
                minWidth: d(110),
                height: d(84),
                borderRadius: d(20),
                borderWidth: d(3),
                borderStyle: "dashed",
                borderColor: "#7CC59C",
                backgroundColor: "#E8F5EC",
                alignItems: "center",
                justifyContent: "center",
                marginRight: d(8),
              }}
            >
              {chosen ? (
                <DText
                  size={60}
                  color={theme.btn}
                  style={{ lineHeight: d(80) }}
                >
                  {chosen}
                </DText>
              ) : null}
            </View>
          ) : null}
          {q.after ? (
            <DText
              size={70}
              color={theme.inkDark}
              style={{ lineHeight: d(88) }}
            >
              {q.after}
            </DText>
          ) : null}
        </View>
      </View>
      {q.layout === "grid" ? (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            rowGap: d(18),
          }}
        >
          {q.options.map((o, i) => (
            <View key={i} style={{ width: "49.2%" }}>
              <OptionTile
                mint
                tint={i}
                selected={value === i}
                onPress={() => onChange(i)}
                height={84}
              >
                <DText size={32} color="#1F2D26" style={{ lineHeight: d(42) }}>
                  {o}
                </DText>
              </OptionTile>
            </View>
          ))}
        </View>
      ) : (
        <View style={{ flexDirection: "row", gap: d(28), alignSelf: "center" }}>
          {q.options.map((o, i) => (
            <Pressable
              key={i}
              onPress={() => onChange(i)}
              accessibilityRole="button"
              style={{
                width: d(200),
                height: d(116),
                borderRadius: d(32),
                borderWidth: d(value === i ? 5 : 4),
                borderColor:
                  value === i ? theme.btn : TINTS[i % TINTS.length].border,
                backgroundColor: value === i ? "#E6F5EB" : "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DText
                size={62}
                color={theme.inkDark}
                style={{ lineHeight: d(86) }}
              >
                {o}
              </DText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

/** Pale green when disabled, deep green when answered  */
function NextButton({
  label,
  icon,
  enabled,
  onPress,
}: {
  label: string;
  icon: "arrow-forward" | "checkmark";
  enabled: boolean;
  onPress: () => void;
}) {
  const { d } = useK();
  const [pressed, setPressed] = useState(false);
  const h = d(90);
  const bg = enabled ? "#0B7A45" : "#A5DCB4";
  const dark = enabled ? "#075F34" : "#7FC595";
  const fg = enabled ? "#fff" : "#0F5132";
  return (
    <View style={{ alignItems: "center", paddingTop: d(18) }}>
      <Pressable
        onPress={enabled ? onPress : undefined}
        disabled={!enabled}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={{
          width: "42%",
          height: h,
          borderRadius: h / 2,
          backgroundColor: bg,
          borderWidth: d(3),
          borderColor: dark,
          borderBottomWidth: d(8),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: d(14),
          shadowColor: dark,
          shadowOffset: { width: 0, height: d(5) },
          shadowOpacity: enabled ? 0.35 : 0.2,
          shadowRadius: d(6),
          elevation: enabled ? 5 : 2,
          transform: [{ scale: pressed && enabled ? 0.97 : 1 }],
        }}
      >
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: d(5),
            left: h * 0.32,
            right: h * 0.32,
            height: h * 0.34,
            borderRadius: h * 0.17,
            backgroundColor: enabled
              ? "rgba(255,255,255,0.2)"
              : "rgba(255,255,255,0.35)",
          }}
        />
        <DText
          size={42}
          color={fg}
          lines={1}
          style={
            enabled
              ? {
                  textShadowColor: "rgba(0,0,0,0.28)",
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 2,
                }
              : undefined
          }
        >
          {label}
        </DText>
        <Ionicons name={icon} size={d(46)} color={fg} />
      </Pressable>
    </View>
  );
}

/**
 * Runs a 5-question quiz: one question per page, "ඉදිරියට යමු" is enabled once answered,
 * no per-question reveal. Only correct answers earn a point; the total is passed to `onFinish`.
 */
export function QuizRunner({
  title,
  questions,
  onFinish,
}: {
  title: string;
  questions: Question[];
  onFinish: (score: number) => void;
}) {
  const { d, W, H } = useK();
  const [index, setIndex] = useState(0);
  const [values, setValues] = useState<Value[]>(() =>
    questions.map(initialValue),
  );

  const q = questions[index];
  const value = values[index];
  const isLast = index === questions.length - 1;
  const setValue = (v: Value) =>
    setValues((prev) => prev.map((x, i) => (i === index ? v : x)));

  const next = () => {
    if (!isLast) {
      setIndex(index + 1);
      return;
    }
    onFinish(
      questions.reduce(
        (sum, qq, i) => sum + (isCorrect(qq, values[i]) ? 1 : 0),
        0,
      ),
    );
  };

  return (
    <SlowPage
      title={`ප්‍රශ්නය ${index + 1} / ${questions.length} · ${title}`}
      header="bar"
      background="punctuation"
      right={<ProgressDots count={questions.length} index={index} />}
    >
      {/* card edges measured from the design: left 20%, right 5.2%, 1.8% below the header bar, 13.4% above the bottom */}
      <View
        style={{
          flex: 1,
          paddingLeft: W * 0.2,
          paddingRight: W * 0.052,
          paddingTop: H * 0.018,
          paddingBottom: H * 0.07,
        }}
      >
        <View
          style={{
            flex: 1,
            marginHorizontal: W * 0.03,
            transform: [{ translateX: -W * 0.015 }],
            backgroundColor: "#F1F9F3",
            borderRadius: d(60),
            borderWidth: d(10),
            borderColor: "#2FA566",
            paddingHorizontal: "2.6%",
            paddingTop: d(34),
            paddingBottom: d(20),
            shadowColor: "#06361F",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {/* faint corner leaves */}
          <Ionicons
            name="leaf"
            size={d(90)}
            color="rgba(120,190,150,0.28)"
            style={{
              position: "absolute",
              left: d(18),
              bottom: d(14),
              transform: [{ rotate: "-35deg" }],
            }}
          />
          <Ionicons
            name="leaf"
            size={d(90)}
            color="rgba(120,190,150,0.28)"
            style={{
              position: "absolute",
              right: d(18),
              bottom: d(14),
              transform: [{ rotate: "35deg" }],
            }}
          />

          <Prompt>{q.prompt}</Prompt>

          <View style={{ flex: 1, justifyContent: "center" }}>
            {q.kind === "mcq" ? (
              <McqView q={q} value={value} onChange={setValue} />
            ) : null}
            {q.kind === "fill" ? (
              <FillView q={q} value={value} onChange={setValue} />
            ) : null}
            {q.kind === "match" ? (
              <MatchView key={index} q={q} value={value} onChange={setValue} />
            ) : null}
            {q.kind === "word" ? (
              <WordView q={q} value={value} onChange={setValue} />
            ) : null}
          </View>

          <NextButton
            label={isLast ? "අවසන් කරමු" : "ඉදිරියට යමු"}
            icon={isLast ? "checkmark" : "arrow-forward"}
            enabled={isAnswered(q, value)}
            onPress={next}
          />
        </View>
      </View>
    </SlowPage>
  );
}
