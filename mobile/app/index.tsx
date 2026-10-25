import { router } from "expo-router";
import { Pressable, View } from "react-native";

import { Owl } from "@/components/common/controls";
import { Page, Txt, useU } from "@/components/common/layout";

function SubjectCard({
  color,
  glyph,
  glyphColor,
  title,
  onPress,
}: {
  color: string;
  glyph: string;
  glyphColor: string;
  title: string;
  onPress: () => void;
}) {
  const { s } = useU();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={{
        flex: 1,
        backgroundColor: color,
        borderRadius: s(30),
        alignItems: "center",
        justifyContent: "center",
        gap: s(40),
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: s(18),
          width: s(112),
          height: s(82),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Txt size={glyph.length > 1 ? 40 : 58} weight="black" color={glyphColor}>
          {glyph}
        </Txt>
      </View>
      <Txt size={52} weight="black" color="#fff">
        {title}
      </Txt>
      
    </Pressable>
  );
}

/** Screen 1: choose a subject. */
export default function Home() {
  const { s } = useU();
  return (
    <Page title="" showBack={false}>
      <View style={{ flex: 1, flexDirection: "row", padding: s(24), gap: s(22) }}>
        <View
          style={{
            width: s(330),
            backgroundColor: "#fff",
            borderRadius: s(30),
            borderWidth: s(2),
            borderColor: "#C5E2D0",
            alignItems: "center",
            justifyContent: "center",
            gap: s(14),
          }}
        >
          <Owl size={150} />
          <Txt size={34} weight="black" color="#0B4A2A" align="center">
            {"සාදරයෙන්\nපිළිගනිමු!"}
          </Txt>
          <View style={{ backgroundColor: "#FFD97A", borderRadius: s(22), paddingHorizontal: s(20), paddingVertical: s(4) }}>
            <Txt size={20} weight="bold" color="#4A3300">
              විෂයක් තෝරන්න
            </Txt>
          </View>
        </View>
        <SubjectCard
          color="#1F9D5F"
          glyph="අ"
          glyphColor="#1F9D5F"
          title="සිංහල"
          onPress={() => router.push("/sinhala")}
        />
        <SubjectCard
          color="#3B6FA8"
          glyph="123"
          glyphColor="#2E6FC9"
          title="ගණිතය"
          onPress={() => router.push("/maths")}
        />
      </View>
    </Page>
  );
}
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/sinhala-writing" />;
}
