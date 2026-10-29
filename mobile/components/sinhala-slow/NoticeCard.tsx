import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { Txt, useU } from "@/components/common/layout";
import { SlowButton } from "@/components/sinhala-slow/SlowButton";

function Spark({ left, top, rotate }: { left: number; top: number; rotate: string }) {
  const { s } = useU();
  return (
    <View
      style={{
        position: "absolute",
        left: s(left),
        top: s(top),
        width: s(14),
        height: s(4),
        borderRadius: s(2),
        backgroundColor: "#F7B82A",
        transform: [{ rotate }],
      }}
    />
  );
}

function WarningArt() {
  const { s } = useU();
  return (
    <View style={{ width: s(96), height: s(92), alignItems: "center", justifyContent: "center" }}>
      <Ionicons name="triangle" size={s(80)} color="#FFC83D" />
      <Ionicons name="alert" size={s(44)} color="#3A2A00" style={{ position: "absolute", top: s(30) }} />
      <Spark left={2} top={14} rotate="30deg" />
      <Spark left={80} top={10} rotate="-35deg" />
      <Spark left={86} top={26} rotate="-10deg" />
    </View>
  );
}

/** White card with a warning icon, a message and one button. Sits to the right so the boy in the background stays visible. */
export function NoticeCard({
  title,
  text,
  buttonLabel,
  onPress,
  extra,
}: {
  title: string;
  text?: string;
  buttonLabel: string;
  onPress: () => void;
  extra?: string;
}) {
  const { s } = useU();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end", paddingRight: s(100), paddingBottom: s(24) }}>
      <View
        style={{
          width: s(760),
          backgroundColor: "rgba(255,255,255,0.97)",
          borderRadius: s(34),
          borderWidth: s(5),
          borderColor: "#2FA566",
          padding: s(30),
          gap: s(14),
          shadowColor: "#06361F",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: s(24) }}>
          <WarningArt />
          <View style={{ flex: 1 }}>
            <Txt size={36} weight="black" color="#0B5A32" style={{ lineHeight: s(50) }}>
              {title}
            </Txt>
          </View>
        </View>
        {text ? (
          <View style={{ paddingLeft: s(120) }}>
            <Txt size={22} weight="semi" color="#2E5A44">
              {text}
            </Txt>
          </View>
        ) : null}
        {extra ? (
          <View style={{ paddingLeft: s(120) }}>
            <Txt size={14} weight="regular" color="#7A8F82">
              {extra}
            </Txt>
          </View>
        ) : null}
        <SlowButton
          label={buttonLabel}
          icon="refresh"
          iconLeft
          onPress={onPress}
          height={60}
          size={26}
          style={{ alignSelf: "stretch", marginHorizontal: s(80), marginTop: s(6) }}
        />
      </View>
    </View>
  );
}