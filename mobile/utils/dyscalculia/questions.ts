// Multiple-choice questions for the Stage 2 learning profile and the intervention (practice).
// Practice: 4 levels per skill area. Stage 2: 3 question types per group, 3 questions each (27 in total).
import { si } from '@/constants/dyscalculia/strings.si';
import type { Question, QuestionKind, SkillArea } from '@/types/dyscalculia';
import { numberOptions, pick, randInt, shuffle } from './random';

export const MAX_LEVEL = 4;
export const PRACTICE_QUESTIONS = 8;
export const PROFILE_QUESTIONS_PER_KIND = 3;

// ---------------------------------------------------------------- single question types

function dotCount(min: number, max: number): Question {
  const count = randInt(min, max);
  return {
    area: 'quantity',
    kind: 'dotCount',
    prompt: si.questions.howManyDots,
    visual: { type: 'dots', count },
    options: numberOptions(count, 3, 2, 1),
    answer: count,
  };
}

function dotCompare(): Question {
  const left = randInt(5, 15);
  let right = randInt(5, 15);
  while (right === left) right = randInt(5, 15);
  return {
    area: 'quantity',
    kind: 'dotCompare',
    prompt: si.questions.whichMore,
    visual: { type: 'compareDots', left, right },
    options: [si.questions.left, si.questions.right],
    answer: left > right ? si.questions.left : si.questions.right,
  };
}

/** Which number does the arrow point to? Only the two ends (and the middle for 0-20) are labelled. */
function numberLine(max: 10 | 20): Question {
  let value = randInt(1, max - 1);
  while (value === max / 2) value = randInt(1, max - 1);
  return {
    area: 'quantity',
    kind: 'numberLine',
    prompt: si.questions.numberLine,
    visual: { type: 'numberLine', max, value },
    options: numberOptions(value, 3, max === 10 ? 2 : 3, 1),
    answer: value,
  };
}

/** A number train with one car missing. */
function train(kind: 'nextNumber' | 'missingNumber' | 'backwards', step: number, start: number, hole: number): Question {
  let items = Array.from({ length: 5 }, (_, i) => start + i * step);
  if (kind === 'backwards') items = items.reverse();
  const answer = items[hole];
  return {
    area: 'sequence',
    kind,
    prompt: hole === 4 ? si.questions.nextNumber : si.questions.missingNumber,
    visual: { type: 'train', items: items.map((n, i) => (i === hole ? null : n)) },
    options: numberOptions(answer, 3, step === 1 ? 2 : step, 0),
    answer,
  };
}

/** Are these numbers in order? Half the time two neighbouring cars are swapped. */
function orderCheck(): Question {
  const step = pick([1, 2]);
  const start = randInt(1, 9);
  const items = Array.from({ length: 5 }, (_, i) => start + i * step);
  const inOrder = Math.random() < 0.5;
  if (!inOrder) {
    const i = randInt(1, 3);
    [items[i], items[i + 1]] = [items[i + 1], items[i]];
  }
  return {
    area: 'sequence',
    kind: 'orderCheck',
    prompt: si.questions.orderCheck,
    visual: { type: 'train', items },
    options: [si.common.yes, si.common.no],
    answer: inOrder ? si.common.yes : si.common.no,
  };
}

function addition(kind: 'add' | 'addCarry', max: number): Question {
  let a: number;
  let b: number;
  if (kind === 'addCarry') {
    // both single digits, sum above 10
    a = randInt(4, 9);
    b = randInt(Math.max(2, 11 - a), 9);
  } else {
    a = randInt(2, max - 2);
    b = randInt(1, Math.min(9, max - a));
  }
  return {
    area: 'operations',
    kind,
    prompt: si.questions.solve,
    visual: { type: 'equation', text: `${a}  +  ${b}  =  ?` },
    options: numberOptions(a + b, 3, 2, 0),
    answer: a + b,
  };
}

function subtraction(max: number): Question {
  const a = randInt(4, max);
  const b = randInt(1, Math.min(9, a - 1));
  return {
    area: 'operations',
    kind: 'subtract',
    prompt: si.questions.solve,
    visual: { type: 'equation', text: `${a}  −  ${b}  =  ?` },
    options: numberOptions(a - b, 3, 2, 0),
    answer: a - b,
  };
}

function chooseSign(): Question {
  const plus = Math.random() < 0.5;
  const a = randInt(6, 15);
  const b = randInt(2, 5);
  return {
    area: 'operations',
    kind: 'chooseSign',
    prompt: si.questions.chooseSign,
    visual: { type: 'equation', text: `${a}  ?  ${b}  =  ${plus ? a + b : a - b}` },
    options: ['+', '−'],
    answer: plus ? '+' : '−',
  };
}

// ---------------------------------------------------------------- practice levels

const PRACTICE: Record<SkillArea, (level: number) => Question> = {
  quantity: (level) => (level === 1 ? dotCount(1, 5) : level === 2 ? dotCount(4, 10) : level === 3 ? dotCompare() : numberLine(pick([10, 20]))),
  sequence: (level) =>
    level === 1
      ? train('nextNumber', 1, randInt(1, 6), 4)
      : level === 2
        ? train('nextNumber', 2, randInt(1, 10), 4)
        : level === 3
          ? train('nextNumber', pick([5, 10]), 5 * randInt(1, 4), 4)
          : pick([train('backwards', 1, randInt(5, 15), randInt(1, 3)), orderCheck()]),
  operations: (level) => (level === 1 ? addition('add', 10) : level === 2 ? subtraction(10) : level === 3 ? addition('addCarry', 20) : chooseSign()),
};

export const makeQuestions = (area: SkillArea, level: number, n = PRACTICE_QUESTIONS) =>
  Array.from({ length: n }, () => PRACTICE[area](level));

// ---------------------------------------------------------------- Stage 2 profile

/** The 3 question types of each group (practognostic / sequential / operational). */
const PROFILE_KINDS: Record<SkillArea, { kind: QuestionKind; make: () => Question }[]> = {
  quantity: [
    { kind: 'dotCount', make: () => dotCount(3, 12) },
    { kind: 'dotCompare', make: dotCompare },
    { kind: 'numberLine', make: () => numberLine(pick([10, 20])) },
  ],
  sequence: [
    { kind: 'nextNumber', make: () => train('nextNumber', pick([1, 2]), randInt(1, 9), 4) },
    { kind: 'backwards', make: () => train('backwards', 1, randInt(5, 15), randInt(1, 4)) },
    { kind: 'orderCheck', make: orderCheck },
  ],
  operations: [
    { kind: 'addCarry', make: () => addition('addCarry', 20) },
    { kind: 'subtract', make: () => subtraction(18) },
    { kind: 'chooseSign', make: chooseSign },
  ],
};

/** Stage 2: 9 questions per group (3 of each type), group by group, shuffled within each group. */
export const profileQuestions = (): Question[] =>
  (['quantity', 'sequence', 'operations'] as SkillArea[]).flatMap((area) =>
    shuffle(PROFILE_KINDS[area].flatMap(({ make }) => Array.from({ length: PROFILE_QUESTIONS_PER_KIND }, make))),
  );
