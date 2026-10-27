export const randInt = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));

export const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Exactly half "yes" answers (rounded up), in random order. */
export const balancedAnswers = (n: number) => shuffle(Array.from({ length: n }, (_, i) => i < Math.ceil(n / 2)));

/** The correct answer plus distinct wrong answers close to it, shuffled. */
export function numberOptions(answer: number, count = 3, spread = 3, min = 0): number[] {
  const opts = new Set<number>([answer]);
  let guard = 0;
  while (opts.size < count && guard++ < 100) {
    const d = randInt(1, spread) * (Math.random() < 0.5 ? -1 : 1);
    if (answer + d >= min) opts.add(answer + d);
  }
  return shuffle([...opts]);
}
