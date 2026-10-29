// Turns the raw screening trials into features and a risk report.
//
// DEMO SCORING: until the FastAPI backend serves the trained model (monotonic XGBoost on the 6 arithmetic
// features), the risk is estimated by comparing each feature with the typically developing children of
// ds004791 (z-scores). The feature definitions match the dataset: accuracy counts omissions as errors,
// reaction time is the median of correct trials.
import { si } from '../../constants/dyscalculia/strings.si';
import {
  AREA_GROUP,
  type DyscalculiaGroup,
  type GroupResult,
  type ProfileReport,
  type QuestionResult,
  type ScreeningReport,
  type ScreeningTask,
  type TrialResult,
} from '../../types/dyscalculia';

/** Mean and SD of the typically developing group (n = 38) in ds004791. */
const REFERENCE: Record<string, { mean: number; sd: number }> = {
  SmallProblem_acc: { mean: 0.8908, sd: 0.113 },
  LargeProblem_acc: { mean: 0.7917, sd: 0.135 },
  Plus1_acc: { mean: 0.9381, sd: 0.08927 },
  SmallProblem_rt: { mean: 2336, sd: 560.9 },
  LargeProblem_rt: { mean: 2914, sd: 696.3 },
  Plus1_rt: { mean: 2008, sd: 532.1 },
  ShapeMatching_acc: { mean: 0.9298, sd: 0.06219 },
  ShapeMatching_rt: { mean: 1190, sd: 166.4 },
  FaceMatching_acc: { mean: 0.7895, sd: 0.08893 },
  FaceMatching_rt: { mean: 1487, sd: 179 },
};

/** The 6 features of the improved model and the direction that raises risk (+1 = higher value, more risk). */
const ARITH_FEATURES: [string, 1 | -1][] = [
  ['SmallProblem_acc', -1],
  ['LargeProblem_acc', -1],
  ['Plus1_acc', -1],
  ['SmallProblem_rt', 1],
  ['LargeProblem_rt', 1],
  ['Plus1_rt', 1],
];
const CONTROL_FEATURES: [string, 1 | -1][] = [
  ['ShapeMatching_acc', -1],
  ['FaceMatching_acc', -1],
  ['ShapeMatching_rt', 1],
  ['FaceMatching_rt', 1],
];

const median = (xs: number[]) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

export function computeFeatures(trials: TrialResult[]): Record<string, number | null> {
  const byTask = new Map<ScreeningTask, TrialResult[]>();
  trials.forEach((t) => byTask.set(t.task, [...(byTask.get(t.task) ?? []), t]));
  const features: Record<string, number | null> = {};
  byTask.forEach((ts, task) => {
    features[`${task}_acc`] = ts.filter((t) => t.correct).length / ts.length;
    features[`${task}_rt`] = median(ts.filter((t) => t.correct && t.rtMs != null).map((t) => t.rtMs as number));
  });
  return features;
}

/** Signed z-score: positive = more risk than a typical child. */
function riskZ(features: Record<string, number | null>, name: string, direction: 1 | -1) {
  const v = features[name];
  const ref = REFERENCE[name];
  if (v == null || !ref) return null;
  return (direction * (v - ref.mean)) / ref.sd;
}

const meanOf = (xs: (number | null)[]) => {
  const v = xs.filter((x): x is number => x != null);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
};

export function demoReport(trials: TrialResult[]): ScreeningReport {
  const features = computeFeatures(trials);
  // Being faster than typical never cancels out errors: reaction-time z-scores only add risk.
  const clampRt = (name: string, z: number | null) => (z != null && name.endsWith('_rt') ? Math.max(0, z) : z);
  const arithZ = ARITH_FEATURES.map(([n, d]) => clampRt(n, riskZ(features, n, d)));
  const controlZ = CONTROL_FEATURES.map(([n, d]) => clampRt(n, riskZ(features, n, d)));
  const arith = meanOf(arithZ);
  const control = meanOf(controlZ);

  const riskScore = 1 / (1 + Math.exp(-1.6 * (arith - 0.5)));
  const controlLow = control > 1;
  const atRisk = riskScore >= 0.5;
  const riskLevel = !atRisk ? 'low' : controlLow ? 'general' : 'elevated';

  const reasons: string[] = [];
  ARITH_FEATURES.forEach(([name, dir], i) => {
    const z = arithZ[i];
    if (z != null && z > 1) {
      const task = name.split('_')[0] as ScreeningTask;
      const title = si.tasks[task].title;
      reasons.push(dir === -1 ? si.teacher.lowAccuracy(title) : si.teacher.slowResponse(title));
    }
  });
  if (controlLow) reasons.push(si.teacher.controlLow);

  // Very fast answers with near-chance accuracy suggest the child was guessing.
  const arithTrials = trials.filter((t) => ['SmallProblem', 'Plus1', 'LargeProblem'].includes(t.task));
  const arithAcc = arithTrials.filter((t) => t.correct).length / Math.max(1, arithTrials.length);
  const medianRt = median(trials.filter((t) => t.rtMs != null).map((t) => t.rtMs as number)) ?? Infinity;
  if (arithAcc < 0.65 && medianRt < 800) reasons.push(si.teacher.guessing);

  return {
    riskLevel,
    riskScore,
    recommendation: riskLevel === 'elevated' ? 'stage2' : riskLevel === 'general' ? 'slowLearner' : 'none',
    reasons,
    controlLow,
    features,
    source: 'demo',
    date: new Date().toISOString(),
  };
}

// Stage 2 rules, used only when the backend cannot be reached. They mirror
// Backend/app/services/dyscalculia/profile_service.py: a group needs support when accuracy < 70 %,
// or when the child is accurate but > 1.5x slower there than in the other groups (and > 6 s).
const MIN_ACCURACY = 0.7;
const SLOW_FACTOR = 1.5;
const SLOW_MIN_MS = 6000;
const GROUP_ORDER: DyscalculiaGroup[] = ['practognostic', 'sequential', 'operational'];

export function localProfile(results: QuestionResult[]): ProfileReport {
  const stats = GROUP_ORDER.map((group) => {
    const rs = results.filter((r) => AREA_GROUP[r.area] === group);
    const correct = rs.filter((r) => r.correct).length;
    return {
      group,
      correct,
      total: rs.length,
      accuracy: rs.length ? correct / rs.length : null,
      medianRtMs: median(rs.filter((r) => r.correct).map((r) => r.rtMs)),
    };
  });
  const groups: GroupResult[] = stats.map((st) => {
    let reason: GroupResult['reason'] = null;
    if (st.accuracy != null && st.accuracy < MIN_ACCURACY) reason = 'accuracy';
    else {
      const others = stats.filter((o) => o.group !== st.group && o.medianRtMs != null).map((o) => o.medianRtMs as number);
      const othersMedian = median(others);
      if (st.medianRtMs != null && othersMedian != null && st.medianRtMs > SLOW_FACTOR * othersMedian && st.medianRtMs > SLOW_MIN_MS)
        reason = 'speed';
    }
    return { ...st, name: si.groups.names[st.group], explanation: si.groups.explanations[st.group], needsSupport: reason != null, reason };
  });
  const weak = groups.filter((g) => g.needsSupport).map((g) => g.group);
  const profile = (weak.length ? weak : (['unclassified'] as const)).map((g) => ({
    group: g,
    name: si.groups.names[g],
    explanation: si.groups.explanations[g],
  }));
  return { groups, profile, source: 'local', date: new Date().toISOString() };
}

/** Stars for a practice session: 3 = 90 %+, 2 = 70 %+, 1 = 50 %+. */
export const starsFor = (accuracy: number) => (accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : accuracy >= 0.5 ? 1 : 0);
