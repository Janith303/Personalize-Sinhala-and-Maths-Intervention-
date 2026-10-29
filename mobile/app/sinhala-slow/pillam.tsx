import { router } from "expo-router";

import { QuizRunner } from "@/components/sinhala-slow/QuizRunner";
import { PILLAM_QUESTIONS } from "@/constants/sinhala-slow/content";
import { useSlowProgress } from "@/contexts/sinhala-slow/progress";


export default function PillamScreen() {
  const { setPillamScore } = useSlowProgress();
  return (
    <QuizRunner
      title="පිල්ලම් භාවිතය"
      questions={PILLAM_QUESTIONS}
      onFinish={(score) => {
        setPillamScore(score);
        router.replace("/sinhala-slow");
      }}
    />
  );
}
