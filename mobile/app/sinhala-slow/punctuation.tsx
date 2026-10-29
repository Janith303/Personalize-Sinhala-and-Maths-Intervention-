import { router } from "expo-router";

import { QuizRunner } from "@/components/sinhala-slow/QuizRunner";
import { PUNCTUATION_QUESTIONS } from "@/constants/sinhala-slow/content";
import { useSlowProgress } from "@/contexts/sinhala-slow/progress";


export default function PunctuationScreen() {
  const { setPunctuationScore } = useSlowProgress();
  return (
    <QuizRunner
      title="විරාම ලක්ෂණ"
      questions={PUNCTUATION_QUESTIONS}
      onFinish={(score) => {
        setPunctuationScore(score);
        router.replace("/sinhala-slow");
      }}
    />
  );
}
