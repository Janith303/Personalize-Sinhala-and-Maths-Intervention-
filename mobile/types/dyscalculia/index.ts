// Types shared by the dyscalculia module (screening, learning profile, practice).

/** The 7 Stage 1 games, named after the tasks of the research dataset (OpenNeuro ds004791). */
export type ScreeningTask =
  | 'SmallProblem'
  | 'Plus1'
  | 'LargeProblem'
  | 'NumberMatching'
  | 'ShapeMatching'
  | 'FaceMatching'
  | 'STM5';

export type ShapeName = 'circle' | 'square' | 'triangle' | 'diamond' | 'oval' | 'rectangle';

export interface FaceSpec {
  skin: number; // index into skin tones
  eyes: number; // 0 round, 1 wide, 2 closed
  mouth: number; // 0 smile, 1 flat, 2 open
  hair: number; // 0 none, 1 top, 2 sides
}

/** One screening trial; every trial is a yes/no decision. */
export type TrialSpec =
  | { kind: 'verify'; task: ScreeningTask; a: number; b: number; shown: number; answerYes: boolean }
  | { kind: 'numberMatch'; task: ScreeningTask; digit: number; dots: number; answerYes: boolean }
  | { kind: 'shapeMatch'; task: ScreeningTask; left: ShapeName; right: ShapeName; answerYes: boolean }
  | { kind: 'faceMatch'; task: ScreeningTask; left: FaceSpec; right: FaceSpec; answerYes: boolean }
  | { kind: 'memory'; task: ScreeningTask; cells: number[]; probe: number; answerYes: boolean };

export interface TrialResult {
  task: ScreeningTask;
  correct: boolean;
  responded: boolean; // false = no answer before the deadline (counted as an error)
  rtMs: number | null;
}

/** elevated = maths-specific risk, general = maths AND control games low, low = no risk. */
export type RiskLevel = 'elevated' | 'general' | 'low';
export type Recommendation = 'stage2' | 'slowLearner' | 'none';

export interface ScreeningReport {
  riskLevel: RiskLevel;
  riskScore: number; // 0..1
  recommendation: Recommendation;
  reasons: string[];
  controlLow: boolean;
  features: Record<string, number | null>;
  source: 'demo' | 'model';
  date: string;
}

export type SkillArea = 'quantity' | 'sequence' | 'operations';

export interface AreaResult {
  area: SkillArea;
  correct: number;
  total: number;
  accuracy: number;
  needsSupport: boolean;
}

/** Visual shown above the answer buttons of a multiple-choice question. */
export type QuestionVisual =
  | { type: 'dots'; count: number }
  | { type: 'compareDots'; left: number; right: number }
  | { type: 'train'; items: (number | null)[] }
  | { type: 'equation'; text: string }
  | { type: 'numberLine'; max: number; value: number };

/** Question types, sent with each Stage 2 answer (e.g. 'numberLine', 'orderCheck'). */
export type QuestionKind =
  | 'dotCount'
  | 'dotCompare'
  | 'numberLine'
  | 'nextNumber'
  | 'missingNumber'
  | 'backwards'
  | 'orderCheck'
  | 'add'
  | 'addCarry'
  | 'subtract'
  | 'chooseSign';

export interface Question {
  area: SkillArea;
  kind: QuestionKind;
  prompt: string;
  visual: QuestionVisual;
  options: (number | string)[];
  answer: number | string;
}

export interface QuestionResult {
  area: SkillArea;
  kind: QuestionKind;
  correct: boolean;
  rtMs: number;
}

export interface PracticeProgress {
  unlockedLevel: number; // 1..4
  stars: Record<number, number>; // best stars (0..3) per level
}
