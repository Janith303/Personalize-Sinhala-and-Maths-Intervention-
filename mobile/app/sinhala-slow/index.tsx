import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { View } from "react-native";

import { Txt, useU } from "@/components/common/layout";
import { SlowButton } from "@/components/sinhala-slow/SlowButton";
import { SlowCountPill, SlowPage } from "@/components/sinhala-slow/SlowPage";
import { accent } from "@/constants/common/theme";
import { useSlowProgress } from "@/contexts/sinhala-slow/progress";

/* ---------- card illustrations (drawn in code, no images) ---------- */

function Sparkle({
  left,
  top,
  rotate,
}: {
  left: number;
  top: number;
  rotate: string;
}) {
  const { s } = useU();
  return (
    <View
      style={{
        position: "absolute",
        left: s(left),
        top: s(top),
        width: s(14),
        height: s(3),
        borderRadius: s(2),
        backgroundColor: "#F7C21F",
        transform: [{ rotate }],
      }}
    />
  );
}

function NotebookArt() {
  const { s } = useU();
  return (
    <View style={{ width: s(190), height: s(118) }}>
      <View
        style={{
          position: "absolute",
          left: s(34),
          top: s(12),
          width: s(92),
          height: s(98),
          backgroundColor: "#fff",
          borderRadius: s(10),
          borderWidth: s(3),
          borderColor: "#2A3B33",
          alignItems: "center",
          justifyContent: "center",
          transform: [{ rotate: "-5deg" }],
        }}
      >
        <View
          style={{
            position: "absolute",
            top: s(-9),
            flexDirection: "row",
            gap: s(9),
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={{
                width: s(7),
                height: s(15),
                borderRadius: s(4),
                backgroundColor: "#fff",
                borderWidth: s(2),
                borderColor: "#2A3B33",
              }}
            />
          ))}
        </View>
        <Txt
          size={64}
          weight="black"
          color="#1B1B1B"
          style={{ lineHeight: s(84) }}
        >
          අ
        </Txt>
      </View>
      <Ionicons
        name="pencil"
        size={s(66)}
        color="#F0396B"
        style={{ position: "absolute", left: s(112), top: s(14) }}
      />
      <Sparkle left={4} top={36} rotate="-20deg" />
      <Sparkle left={8} top={58} rotate="20deg" />
      <Sparkle left={172} top={44} rotate="20deg" />
    </View>
  );
}

function PunctuationArt() {
  const { s } = useU();
  const lh = (n: number) => ({ lineHeight: s(n * 1.3) });
  return (
    <View style={{ width: s(190), height: s(118) }}>
      <View style={{ position: "absolute", left: s(14), top: s(10) }}>
        <Txt size={64} weight="black" color="#F58A1F" style={lh(64)}>
          !
        </Txt>
      </View>
      <View style={{ position: "absolute", left: s(66), top: s(-6) }}>
        <Txt size={104} weight="black" color="#8E2DE2" style={lh(104)}>
          ?
        </Txt>
      </View>
      <View style={{ position: "absolute", left: s(118), top: s(46) }}>
        <Txt size={64} weight="black" color="#8E2DE2" style={lh(64)}>
          ,
        </Txt>
      </View>
      <View style={{ position: "absolute", left: s(140), top: s(2) }}>
        <Txt size={60} weight="black" color="#2D9CF0" style={lh(60)}>
          ”
        </Txt>
      </View>
      <Sparkle left={4} top={14} rotate="-30deg" />
    </View>
  );
}

function BlockArt({
  glyph,
  color,
  left,
  top,
  rotate,
}: {
  glyph: string;
  color: string;
  left: number;
  top: number;
  rotate: string;
}) {
  const { s } = useU();
  return (
    <View
      style={{
        position: "absolute",
        left: s(left),
        top: s(top),
        width: s(58),
        height: s(58),
        borderRadius: s(12),
        backgroundColor: color,
        borderWidth: s(2),
        borderColor: "rgba(255,255,255,0.7)",
        alignItems: "center",
        justifyContent: "center",
        transform: [{ rotate }],
      }}
    >
      <Txt size={34} weight="black" color="#fff" style={{ lineHeight: s(50) }}>
        {glyph}
      </Txt>
    </View>
  );
}

function BlocksArt() {
  const { s } = useU();
  return (
    <View style={{ width: s(190), height: s(118) }}>
      <BlockArt glyph="ක" color="#F0449A" left={36} top={8} rotate="-12deg" />
      <BlockArt glyph="ා" color="#2F8CF0" left={98} top={2} rotate="10deg" />
      <BlockArt glyph="ග" color="#3DBE55" left={66} top={54} rotate="4deg" />
      <Sparkle left={8} top={34} rotate="-20deg" />
      <Sparkle left={170} top={36} rotate="20deg" />
    </View>
  );
}

/* ---------- activity card ---------- */

type CardProps = {
  art: ReactNode;
  title: string;
  titleColor: string;
  bg: string;
  border: string;
  btnColor: string;
  btnDark: string;
  description: string;
  done: boolean;
  onStart: () => void;
};

function ActivityCard({
  art,
  title,
  titleColor,
  bg,
  border,
  btnColor,
  btnDark,
  description,
  done,
  onStart,
}: CardProps) {
  const { s } = useU();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: done ? "#ECF5EF" : bg,
        borderRadius: s(28),
        borderWidth: s(6),
        borderColor: done ? "#9BCFB0" : border,
        paddingHorizontal: s(14),
        paddingVertical: s(12),
        alignItems: "center",
        justifyContent: "space-between",
        opacity: done ? 0.95 : 1,
      }}
    >
      {done ? (
        <View
          style={{
            position: "absolute",
            right: s(-8),
            top: s(-10),
            width: s(40),
            height: s(40),
            borderRadius: s(20),
            backgroundColor: accent.orange,
            borderWidth: s(3),
            borderColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <Ionicons name="checkmark" size={s(24)} color="#fff" />
        </View>
      ) : null}

      {art}

      <Txt
        size={40}
        weight="black"
        color={done ? "#4C7A62" : titleColor}
        align="center"
        style={{
          lineHeight: s(48),
          textShadowColor: done ? "#4C7A62" : titleColor,
          textShadowOffset: { width: s(18), height: 0 },
          textShadowRadius: 0,
        }}
      >
        {title.replace(" ", "\n")}
      </Txt>

      <Txt
        size={20}
        weight="black"
        color={done ? "#5E8F73" : "#33403A"}
        align="center"
        style={{ lineHeight: s(28) }}
      >
        {description}
      </Txt>

      {done ? (
        <SlowButton
          label="සම්පූර්ණයි"
          icon="checkmark-circle-outline"
          iconLeft
          variant="soft"
          disabled
          height={68}
          size={25}
          px={30}
          style={{ alignSelf: "stretch" }}
        />
      ) : (
        <SlowButton
          label="ආරම්භ කරන්න"
          icon="arrow-forward"
          onPress={onStart}
          color={btnColor}
          darkColor={btnDark}
          height={68}
          size={24}
          px={30}
          style={{ alignSelf: "stretch" }}
        />
      )}
    </View>
  );
}

function InfoHint({ children }: { children: ReactNode }) {
  const { s } = useU();
  return (
    <View
      style={{
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        gap: s(12),
        backgroundColor: "rgba(255,255,255,0.96)",
        borderRadius: s(28),
        borderWidth: s(2),
        borderColor: "#BFE0F2",
        paddingHorizontal: s(18),
        paddingVertical: s(4),
        maxWidth: s(700),
      }}
    >
      <View
        style={{
          width: s(30),
          height: s(30),
          borderRadius: s(15),
          backgroundColor: "#2D8CF0",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="information" size={s(20)} color="#fff" />
      </View>
      <Txt size={17} weight="semi" color="#2E4A5A" style={{ flexShrink: 1 }}>
        {children}
      </Txt>
    </View>
  );
}

export default function SinhalaSlowMenu() {
  const { s } = useU();
  const { lettersDone, punctuationScore, pillamScore, completedCount } =
    useSlowProgress();
  const allDone = completedCount === 3;

  return (
    <SlowPage
      title="සිංහල ඇගයීම 1"
      right={<SlowCountPill done={completedCount} total={3} />}
    >
      <View style={{ flex: 1, paddingBottom: s(10) }}>
        {/* leaf banner */}
        <View
          style={{
            alignSelf: "center",
            marginTop: s(2),
            minWidth: s(480),
            height: s(52),
            borderRadius: s(26),
            backgroundColor: "#FFF1C9",
            borderWidth: s(2),
            borderColor: "#E8C77C",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: s(64),
          }}
        >
          <Ionicons
            name="leaf"
            size={s(34)}
            color="#3FA34D"
            style={{
              position: "absolute",
              left: s(14),
              transform: [{ rotate: "-35deg" }],
            }}
          />
          <Ionicons
            name="leaf"
            size={s(34)}
            color="#3FA34D"
            style={{
              position: "absolute",
              right: s(14),
              transform: [{ rotate: "35deg" }],
            }}
          />
          <Txt
            size={30}
            weight="black"
            color="#3E2A0E"
            style={{ lineHeight: s(42) }}
          >
            {allDone ? "ක්‍රියාකාරකම් සියල්ල අවසන්!" : "ක්‍රියාකාරකම් තෝරන්න"}
          </Txt>
        </View>

        {/* cards sit to the right so the boy in the background stays visible */}
        <View
          style={{
            flex: 1,
            marginVertical: s(10),
            flexDirection: "row",
            gap: s(14),
            width: s(930),
            alignSelf: "center",
            transform: [{ translateX: s(80) }],
          }}
        >
          <ActivityCard
            art={<NotebookArt />}
            title="අකුරු ලිවීම"
            titleColor="#1A7A4B"
            bg="#E9F8EC"
            border="#4FB87A"
            btnColor="#0F7A43"
            btnDark="#0A5A31"
            description="අකුරු 5ක් ලියමු"
            done={lettersDone}
            onStart={() => router.push("/sinhala-slow/letters")}
          />
          <ActivityCard
            art={<PunctuationArt />}
            title="විරාම ලක්ෂණ"
            titleColor={accent.purple}
            bg="#F6E9FF"
            border="#C79BEF"
            btnColor="#8A2BE2"
            btnDark="#6A1DB5"
            description="ප්‍රශ්න 5කට පිළිතුරු දෙමු"
            done={punctuationScore !== null}
            onStart={() => router.push("/sinhala-slow/punctuation")}
          />
          <ActivityCard
            art={<BlocksArt />}
            title="පිල්ලම් භාවිතය"
            titleColor={accent.brown}
            bg="#FFF4D8"
            border="#F4B83A"
            btnColor="#F26A0F"
            btnDark="#C4500A"
            description="ප්‍රශ්න 5කට පිළිතුරු දෙමු"
            done={pillamScore !== null}
            onStart={() => router.push("/sinhala-slow/pillam")}
          />
        </View>

        {allDone ? (
          <View style={{ alignItems: "center" }}>
            <SlowButton
              label="ඔබේ ප්‍රතිඵල බලන්න"
              icon="arrow-forward"
              width={460}
              height={68}
              size={30}
              px={30}
              onPress={() => router.push("/sinhala-slow/result")}
            />
          </View>
        ) : (
          <InfoHint>කැමති අනුපිළිවෙලකට ක්‍රියාකාරකම සම්පූර්ණ කළ හැක.</InfoHint>
        )}
      </View>
    </SlowPage>
  );
}
