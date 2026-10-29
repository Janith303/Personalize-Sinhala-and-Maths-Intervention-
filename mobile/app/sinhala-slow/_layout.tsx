import { Stack } from "expo-router";

import { SlowProgressProvider } from "@/contexts/sinhala-slow/progress";

/** Progress (letters / quizzes) lives only inside the sinhala-slow flow. */
export default function SinhalaSlowLayout() {
  return (
    <SlowProgressProvider>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
    </SlowProgressProvider>
  );
}
