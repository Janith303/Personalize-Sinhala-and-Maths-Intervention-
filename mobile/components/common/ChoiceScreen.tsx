import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import type { Theme } from "@/constants/common/theme";

import { Owl } from "./controls";
import { Page, Txt, useU } from "./layout";

/** Shared look of the two "choose one" screens (සිංහල ඇගයීම / ගණිත පරීක්ෂණ). */
export function ChoiceScreen({
  title,
  heading,
  theme,
  digits,
  options,
}: {
  title: string;
  heading: string;
  theme: Theme;
  digits?: boolean;
  options: { label: string; onPress: () => void }[];
}) {
  const { s } = useU();
  return (
    <Page title={title} theme={theme} digits={digits}>
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: s(44) }}>
        <Owl size={165} />
        <View
          style={{
            width: s(580),
            backgroundColor: "#fff",
            borderRadius: s(26),
            borderWidth: s(2),
            borderColor: theme.border,
            padding: s(28),
            gap: s(18),
          }}
        >
          <Txt size={36} weight="black" color={theme.ink}>
            {heading}
          </Txt>
          {options.map((o) => (
            <Pressable
              key={o.label}
              onPress={o.onPress}
              accessibilityRole="button"
              style={{
                height: s(78),
                borderRadius: s(18),
                backgroundColor: theme.btn,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: s(30),
              }}
            >
              <Txt size={28} weight="black" color="#fff" numberOfLines={1}>
                {o.label}
              </Txt>
              <Ionicons name="arrow-forward" size={s(28)} color="#fff" />
            </Pressable>
          ))}
        </View>
      </View>
    </Page>
  );
}
