export type MathsOperation = "addition" | "subtraction" | "multiplication" | "division";

export type Question = {
  id: number;
  operation: MathsOperation;
  a: number;
  b: number;
  answer: number;
  /** addition: needs a carry; subtraction: needs a borrow */
  hasCarry: boolean;
};

export const OPERATION_SYMBOL: Record<MathsOperation, string> = {
  addition: "+",
  subtraction: "−",
  multiplication: "×",
  division: "÷",
};

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

type Draft = Omit<Question, "id" | "operation">;

function makeAddition(wantCarry: boolean): Draft {
  for (let i = 0; i < 300; i++) {
    const a = rand(10, 89);
    const b = rand(10, 89);
    if (a + b > 99) continue;
    const carry = (a % 10) + (b % 10) >= 10;
    if (carry === wantCarry) return { a, b, answer: a + b, hasCarry: carry };
  }
  return wantCarry
    ? { a: 18, b: 13, answer: 31, hasCarry: true }
    : { a: 12, b: 15, answer: 27, hasCarry: false };
}

function makeSubtraction(wantBorrow: boolean): Draft {
  for (let i = 0; i < 300; i++) {
    const a = rand(20, 99);
    const b = rand(5, a - 1);
    const borrow = a % 10 < b % 10;
    if (borrow === wantBorrow) return { a, b, answer: a - b, hasCarry: borrow };
  }
  return wantBorrow
    ? { a: 14, b: 6, answer: 8, hasCarry: true }
    : { a: 28, b: 13, answer: 15, hasCarry: false };
}

function makeMultiplication(): Draft {
  const a = rand(2, 9);
  const b = rand(1, 10);
  return { a, b, answer: a * b, hasCarry: false };
}

function makeDivision(): Draft {
  const divisor = rand(2, 9);
  const quotient = rand(1, 10);
  return { a: divisor * quotient, b: divisor, answer: quotient, hasCarry: false };
}

/** Makes `count` unique questions. Add/sub get half with carry/borrow, half without. */
export function generateQuestions(operation: MathsOperation, count = 10): Question[] {
  const seen = new Set<string>();
  const list: Question[] = [];

  let guard = 0;
  while (list.length < count && guard++ < 1000) {
    const withCarry = list.length % 2 === 1;
    const draft =
      operation === "addition"
        ? makeAddition(withCarry)
        : operation === "subtraction"
        ? makeSubtraction(withCarry)
        : operation === "multiplication"
        ? makeMultiplication()
        : makeDivision();

    const key = `${draft.a}-${draft.b}`;
    if (seen.has(key)) continue;
    seen.add(key);
    list.push({ ...draft, id: list.length + 1, operation });
  }

  // shuffle so carry / no-carry questions are mixed
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list.map((q, i) => ({ ...q, id: i + 1 }));
}

export function getHint(q: Question): string {
  const a1 = q.a % 10;
  const a10 = Math.floor(q.a / 10);
  const b1 = q.b % 10;
  const b10 = Math.floor(q.b / 10);

  switch (q.operation) {
    case "addition":
      return q.hasCarry
        ? `ඒකක: ${a1} + ${b1} = ${a1 + b1}. ${(a1 + b1) % 10} ලියා 1 දහයට ගෙන යන්න.`
        : `මුලින් ඒකක: ${a1} + ${b1}, ඊළඟට දහය: ${a10} + ${b10}`;
    case "subtraction":
      return q.hasCarry
        ? `${a1} න් ${b1} අඩු කළ නොහැක. දහයෙන් 1ක් ණයට ගන්න: ${a1 + 10} − ${b1}`
        : `මුලින් ඒකක: ${a1} − ${b1}, ඊළඟට දහය: ${a10} − ${b10}`;
    case "multiplication":
      return q.b <= 6
        ? `${q.a} × ${q.b} = ${Array(q.b).fill(q.a).join(" + ")}`
        : `${q.a} × ${q.b} යනු ${q.a}, ${q.b} වතාවක් එකතු කිරීමයි.`;
    case "division":
      return `${q.b} × ? = ${q.a}  —  ${q.b} ගුණ වගුව මතක් කරන්න.`;
  }
}