import { run } from '../shared/runtime.ts';

export type ParseOutput = ReturnType<typeof parse>;

export function parse(input: string) {
  const lines = input.trim().split('\n');

  return lines;
}

export function solvePart1(input: ParseOutput) {

}

export function solvePart2(input: ParseOutput) {

}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
