import { run } from '../shared/runtime.ts';
import { sum } from '../shared/math.ts';

export type ParseOutput = ReturnType<typeof parse>;

export function parse(input: string) {
  return input.trim().split('\n').map(Number);
}

export function solvePart1(input: ParseOutput) {
  return input.map(n => calculateSecrets(n).at(-1)).reduce(sum);
}

export function solvePart2(input: ParseOutput) {
  return getMaxValue(input.map(n => diff(calculateSecrets(n).map(s => s % 10))));
}

function calculateSecrets(secret: number): number[] {
  const secrets: number[] = [];
  for (let i = 0; i < 2000; i++) {
    secret ^= (secret << 6) & 0xffffff;
    secret ^= (secret >> 5) & 0xffffff;
    secret ^= (secret << 11) & 0xffffff;
    secrets.push(secret);
  }
  return secrets;
}

function diff(prices: number[]): [number[], number[]] {
  return [prices.slice(1), prices.slice(1).map((p, i) => p - prices[i])];
}

function getMaxValue(data: [number[], number[]][]) {
  return Math.max(
    ...data
      .reduce((acc, [prices, diffs]) => {
        const seen = new Set<number>();
        for (let i = 0; i < diffs.length - 3; i++) {
          const key = getKey(diffs.slice(i, i + 4));
          if (!seen.has(key)) {
            seen.add(key);
            acc.set(key, (acc.get(key) ?? 0) + prices[i + 3]);
          }
        }
        return acc;
      }, new Map<number, number>())
      .values()
  );
}

function getKey(diffs: number[]) {
  return diffs.reduce((acc, val) => acc * 100 + (val + 10), 0);
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
