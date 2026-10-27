// Stage 1 screening games, modelled on the behavioural tasks of OpenNeuro ds004791:
// arithmetic verification (small / +1 / large sums), numeral-dot matching, shape and face matching
// (non-numerical control games) and visuo-spatial working memory with 5 stars.
import type { FaceSpec, ScreeningTask, ShapeName, TrialSpec } from '../../types/dyscalculia';
import { balancedAnswers, pick, randInt, shuffle } from './random';

export const TASK_ORDER: ScreeningTask[] = [
  'SmallProblem',
  'Plus1',
  'LargeProblem',
  'NumberMatching',
  'ShapeMatching',
  'FaceMatching',
  'STM5',
];

/** Trials per game. The research version used more (24-36); 8 keeps the session about 8 minutes. */
export const TRIALS_PER_TASK = 8;

/** No answer within this time = omission (scored as an error). */
export const DEADLINE_MS: Record<ScreeningTask, number> = {
  SmallProblem: 8000,
  Plus1: 8000,
  LargeProblem: 10000,
  NumberMatching: 5000,
  ShapeMatching: 5000,
  FaceMatching: 5000,
  STM5: 5000,
};

export const MEMORY_GRID = 4; // 4 x 4 grid
export const MEMORY_STARS = 5;

const SHAPES: ShapeName[] = ['circle', 'square', 'triangle', 'diamond', 'oval', 'rectangle'];

/** A wrong answer 1 or 2 away from the true result (never negative). */
const nearMiss = (value: number) => {
  const d = pick([-2, -1, 1, 2]);
  return value + d < 0 ? value + Math.abs(d) : value + d;
};

function verifyTrial(task: ScreeningTask, a: number, b: number, yes: boolean): TrialSpec {
  const sum = a + b;
  return { kind: 'verify', task, a, b, shown: yes ? sum : nearMiss(sum), answerYes: yes };
}

const randomFace = (): FaceSpec => ({ skin: randInt(0, 2), eyes: randInt(0, 2), mouth: randInt(0, 2), hair: randInt(0, 2) });

function differentFace(face: FaceSpec): FaceSpec {
  const key = pick(['skin', 'eyes', 'mouth', 'hair'] as const);
  return { ...face, [key]: (face[key] + randInt(1, 2)) % 3 };
}

export function buildTrials(task: ScreeningTask, n = TRIALS_PER_TASK): TrialSpec[] {
  return balancedAnswers(n).map((yes): TrialSpec => {
    switch (task) {
      case 'SmallProblem': {
        // single-digit addends, sum up to 10
        const a = randInt(2, 8);
        return verifyTrial(task, a, randInt(1, 10 - a), yes);
      }
      case 'Plus1':
        return verifyTrial(task, randInt(2, 19), 1, yes);
      case 'LargeProblem': {
        // single-digit addends, sum above 10 (carrying)
        const a = randInt(4, 9);
        return verifyTrial(task, a, randInt(Math.max(2, 11 - a), 9), yes);
      }
      case 'NumberMatching': {
        const digit = randInt(2, 9);
        const others = [digit - 2, digit - 1, digit + 1, digit + 2].filter((d) => d >= 1 && d <= 9);
        return { kind: 'numberMatch', task, digit, dots: yes ? digit : pick(others), answerYes: yes };
      }
      case 'ShapeMatching': {
        const left = pick(SHAPES);
        const right = yes ? left : pick(SHAPES.filter((s) => s !== left));
        return { kind: 'shapeMatch', task, left, right, answerYes: yes };
      }
      case 'FaceMatching': {
        const left = randomFace();
        return { kind: 'faceMatch', task, left, right: yes ? left : differentFace(left), answerYes: yes };
      }
      case 'STM5': {
        const cells = shuffle(Array.from({ length: MEMORY_GRID * MEMORY_GRID }, (_, i) => i)).slice(0, MEMORY_STARS);
        const empty = Array.from({ length: MEMORY_GRID * MEMORY_GRID }, (_, i) => i).filter((i) => !cells.includes(i));
        return { kind: 'memory', task, cells, probe: yes ? pick(cells) : pick(empty), answerYes: yes };
      }
    }
  });
}
