import { router } from "expo-router";

import { ChoiceScreen } from "@/components/common/ChoiceScreen";
import { greenTheme } from "@/constants/common/theme";

/** Screen 2: choose a Sinhala evaluation. Each team member's part starts from here. */
export default function SinhalaEvaluations() {
  return (
    <ChoiceScreen
      title="සිංහල"
      heading="ඇගයීමක් තෝරන්න"
      theme={greenTheme}
      options={[
        { label: "සිංහල ඇගයීම 1", onPress: () => router.push("/sinhala-slow") },
        // the sinhala-writing owner adds the screen at app/sinhala-writing/index.tsx
        { label: "සිංහල ඇගයීම 2", onPress: () => router.push("/sinhala-writing" as never) },
      ]}
    />
  );
}
