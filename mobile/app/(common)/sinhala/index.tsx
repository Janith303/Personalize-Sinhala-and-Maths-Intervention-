import { router } from "expo-router";

import { ChoiceScreen, choiceThemes } from "@/components/common/ChoiceScreen";

/** Screen 2: choose a Sinhala evaluation. Each team member's part starts from here. */
export default function SinhalaEvaluations() {
  return (
    <ChoiceScreen
      title="සිංහල"
      heading="ඇගයීමක් තෝරන්න"
      theme={choiceThemes.green}
      options={[
        { label: "සිංහල ඇගයීම 1", icon: "book-open-variant", onPress: () => router.push("/sinhala-slow") },
        { label: "සිංහල ඇගයීම 2", icon: "clipboard-list-outline", onPress: () => router.push("/sinhala-writing" as never) },
      ]}
    />
  );
}
