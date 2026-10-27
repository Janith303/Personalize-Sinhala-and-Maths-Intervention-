// Multiple-choice questions for the Stage 2 learning profile and the intervention (practice).
// Each skill area has 4 levels; the profile samples levels 1-3 of every area.
import { si } from '../../constants/dyscalculia/strings.si';
import type { Question, SkillArea } from '../../types/dyscalculia';
import { numberOptions, pick, randInt, shuffle } from './random';

export const MAX_LEVEL = 4;
export const PRACTICE_QUESTIONS = 8;
export const PROFILE_QUESTIONS_PER_AREA = 6;

function quantity(level: number): Question {
  if (level === 3) {
    // which group has more dots (non-symbolic comparison)
    const left = randInt(5, 15);
    let right = randInt(5, 15);
    while (right === left) right = randInt(5, 15);
    return {
      area: 'quantity',
      prompt: si.questions.whichMore,
      visual: { type: 'compareDots', left, right },
      options: [si.questions.left, si.questions.right],
      answer: left > right ? si.questions.left : si.questions.right,
    };
  }
  const max = level === 1 ? 5 : level === 2 ? 10 : 15;
  const count = randInt(level === 1 ? 1 : 4, max);
  return {
    area: 'quantity',
    prompt: si.questions.howManyDots,
    visual: { type: 'dots', count },
    options: numberOptions(count, 3, 2, 1),
    answer: count,
  };
}

function sequence(level: number): Question {
  const step = level === 1 ? 1 : level === 2 ? 2 : pick([5, 10]);
  const descending = level === 4 && Math.random() < 0.5;
  const start = level === 1 ? randInt(1, 6) : level === 2 ? randInt(1, 10) : step * randInt(1, 4);
  let items = Array.from({ length: 5 }, (_, i) => start + i * step);
  if (descending) items = items.reverse();
  // levels 1-3: the last number is missing; level 4: a number in the middle is missing
  const hole = level === 4 ? randInt(1, 3) : 4;
  const answer = items[hole];
  return {
    area: 'sequence',
    prompt: hole === 4 ? si.questions.nextNumber : si.questions.missingNumber,
    visual: { type: 'train', items: items.map((n, i) => (i === hole ? null : n)) },
    options: numberOptions(answer, 3, step === 1 ? 2 : step, 0),
    answer,
  };
}

function operations(level: number): Question {
  if (level === 4) {
    // choose the operation sign
    const plus = Math.random() < 0.5;
    const a = randInt(6, 15);
    const b = randInt(2, 5);
    return {
      area: 'operations',
      prompt: si.questions.chooseSign,
      visual: { type: 'equation', text: `${a}  ?  ${b}  =  ${plus ? a + b : a - b}` },
      options: ['+', '−'],
      answer: plus ? '+' : '−',
    };
  }
  let a: number;
  let b: number;
  let text: string;
  let answer: number;
  if (level === 2) {
    a = randInt(4, 10);
    b = randInt(1, a - 1);
    answer = a - b;
    text = `${a}  −  ${b}  =  ?`;
  } else {
    const max = level === 1 ? 10 : 20;
    a = randInt(2, max - 2);
    b = randInt(1, Math.min(9, max - a));
    answer = a + b;
    text = `${a}  +  ${b}  =  ?`;
  }
  return {
    area: 'operations',
    prompt: si.questions.solve,
    visual: { type: 'equation', text },
    options: numberOptions(answer, 3, 2, 0),
    answer,
  };
}

const GENERATORS: Record<SkillArea, (level: number) => Question> = { quantity, sequence, operations };

export const makeQuestions = (area: SkillArea, level: number, n = PRACTICE_QUESTIONS) =>
  Array.from({ length: n }, () => GENERATORS[area](level));

/** Stage 2: levels 1-3 of each area, area by area. */
export const profileQuestions = (): Question[] =>
  (['quantity', 'sequence', 'operations'] as SkillArea[]).flatMap((area) =>
    shuffle(Array.from({ length: PROFILE_QUESTIONS_PER_AREA }, (_, i) => GENERATORS[area]((i % 3) + 1))),
  );
