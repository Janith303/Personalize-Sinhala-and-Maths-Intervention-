import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { LETTERS } from "@/constants/sinhala-slow/content";

export type LetterResult = "correct" | "wrong" | null;

type Progress = {
  /** Model verdict per letter (same order as LETTERS). Only shown on the results page. */
  letterResults: LetterResult[];
  punctuationScore: number | null;
  pillamScore: number | null;
  lettersDone: boolean;
  completedCount: number;
  letterScore: number;
  setLetterResult: (index: number, result: "correct" | "wrong") => void;
  setPunctuationScore: (score: number) => void;
  setPillamScore: (score: number) => void;
  reset: () => void;
};

const emptyLetters = (): LetterResult[] => LETTERS.map(() => null);

const ProgressContext = createContext<Progress | null>(null);

export function SlowProgressProvider({ children }: { children: ReactNode }) {
  const [letterResults, setLetterResults] = useState<LetterResult[]>(emptyLetters);
  const [punctuationScore, setPunctuationScore] = useState<number | null>(null);
  const [pillamScore, setPillamScore] = useState<number | null>(null);

  const setLetterResult = useCallback((index: number, result: "correct" | "wrong") => {
    setLetterResults((prev) => prev.map((v, i) => (i === index ? result : v)));
  }, []);

  const reset = useCallback(() => {
    setLetterResults(emptyLetters());
    setPunctuationScore(null);
    setPillamScore(null);
  }, []);

  const value = useMemo<Progress>(() => {
    const lettersDone = letterResults.every((r) => r !== null);
    return {
      letterResults,
      punctuationScore,
      pillamScore,
      lettersDone,
      completedCount: [lettersDone, punctuationScore !== null, pillamScore !== null].filter(Boolean).length,
      letterScore: letterResults.filter((r) => r === "correct").length,
      setLetterResult,
      setPunctuationScore,
      setPillamScore,
      reset,
    };
  }, [letterResults, punctuationScore, pillamScore, setLetterResult, reset]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useSlowProgress(): Progress {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useSlowProgress must be used inside SlowProgressProvider");
  return ctx;
}
