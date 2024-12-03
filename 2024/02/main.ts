import { run } from '../shared/runtime.ts';

export type ParseOutput = ReturnType<typeof parse>;

export function parse(input: string) {
  const lines = input
    .trim()
    .split('\n')
    .map(line => line.split(' ').map(Number));
  return lines;
}

export function solvePart1(input: ParseOutput) {
  return input.filter(isSafe).length;
}

export function solvePart2(input: ParseOutput) {
  return input.filter(list => list.some((_, i) => isSafe(without(list, i)))).length;
}

function isSafe(report: number[]) {
  const { trend: globalTrend } = compare(report[0], report[1]);
  return report.slice(1).every((value, prevIndex) => {
    const { trend, diff } = compare(report[prevIndex], value);
    return diff >= 1 && diff <= 3 && trend === globalTrend;
  });
}

function without<T>(array: T[], index: number) {
  return array.filter((_, i) => i !== index);
}

function compare(a: number, b: number) {
  return { trend: Math.sign(b - a), diff: Math.abs(a - b) };
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
