import { run } from '../shared/runtime.ts';

export type ParseOutput = ReturnType<typeof parse>;

export function parse(input: string) {
  return input
    .trim()
    .split('\n')
    .map(line => line.split(/\s+/).map(Number))
    .reduce(
      (acc, [c1, c2]) => [
        [...acc[0], c1],
        [...acc[1], c2],
      ],
      [[], []] as [number[], number[]]
    ) as [number[], number[]];
}

export function solvePart1(columns: ParseOutput) {
  const [left, right] = columns.map(column => column.sort((a, b) => a - b));
  return left.reduce((acc, val, i) => acc + Math.abs(right[i] - val), 0);
}

export function solvePart2([left, right]: ParseOutput) {
  const rightGroups = Object.groupBy(right, n => n);
  return left.reduce((acc, num) => acc + num * (rightGroups[num]?.length ?? 0), 0);
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
