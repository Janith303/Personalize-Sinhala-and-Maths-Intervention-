import { router } from "expo-router";

import { ChoiceScreen } from "@/components/common/ChoiceScreen";
import { blueTheme } from "@/constants/common/theme";

/** Screen 3: choose a maths test. Each team member's part starts from here. */
export default function MathsTests() {
  return (
    <ChoiceScreen
      title="ගණිතය"
      heading="පරීක්ෂණයක් තෝරන්න"
      theme={blueTheme}
      digits
      options={[
        // screens for these routes are added by the maths-slow / dyscalculia owners
        { label: "සාමාන්‍ය ගණිත පරීක්ෂණය", onPress: () => router.push("/maths-slow" as never) },
        { label: "ඩිස්කැල්කියුලියා පරීක්ෂණය", onPress: () => router.push("/dyscalculia" as never) },
      ]}
    />
  );
}
