// State of the dyscalculia module for the current child: name, stars, screening report,
// learning profile and practice progress. Kept in memory for now (lost when the app restarts);
// it will be saved through the backend once the shared children/auth flow is ready.
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { PracticeProgress, ProfileReport, ScreeningReport, SkillArea } from '../../types/dyscalculia';
import { MAX_LEVEL } from '../../utils/dyscalculia/questions';

const emptyProgress = (): Record<SkillArea, PracticeProgress> => ({
  quantity: { unlockedLevel: 1, stars: {} },
  sequence: { unlockedLevel: 1, stars: {} },
  operations: { unlockedLevel: 1, stars: {} },
});

interface DyscalculiaState {
  childName: string;
  stars: number;
  screening: ScreeningReport | null;
  profile: ProfileReport | null;
  progress: Record<SkillArea, PracticeProgress>;
  setChildName: (name: string) => void;
  addStars: (n: number) => void;
  saveScreening: (report: ScreeningReport) => void;
  saveProfile: (report: ProfileReport) => void;
  savePractice: (area: SkillArea, level: number, stars: number) => void;
  reset: () => void;
}

const Ctx = createContext<DyscalculiaState | null>(null);

export function DyscalculiaProvider({ children }: { children: ReactNode }) {
  const [childName, setChildName] = useState('');
  const [stars, setStars] = useState(0);
  const [screening, setScreening] = useState<ScreeningReport | null>(null);
  const [profile, setProfile] = useState<ProfileReport | null>(null);
  const [progress, setProgress] = useState(emptyProgress);

  const value: DyscalculiaState = {
    childName,
    stars,
    screening,
    profile,
    progress,
    setChildName,
    addStars: (n) => setStars((s) => s + n),
    saveScreening: setScreening,
    saveProfile: setProfile,
    savePractice: (area, level, earned) =>
      setProgress((p) => {
        const cur = p[area];
        const unlockedLevel = earned >= 2 && level === cur.unlockedLevel ? Math.min(MAX_LEVEL, level + 1) : cur.unlockedLevel;
        return {
          ...p,
          [area]: { unlockedLevel, stars: { ...cur.stars, [level]: Math.max(cur.stars[level] ?? 0, earned) } },
        };
      }),
    reset: () => {
      setChildName('');
      setStars(0);
      setScreening(null);
      setProfile(null);
      setProgress(emptyProgress());
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDyscalculia() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useDyscalculia must be used inside DyscalculiaProvider');
  return ctx;
}
