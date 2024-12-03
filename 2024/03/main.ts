import { sum, product } from '../shared/math.ts';
import { run } from '../shared/runtime.ts';

export type ParseOutput = ReturnType<typeof parse>;

export function parse(input: string) {
  const lines = input
    .matchAll(/(mul|do|don't)\((?:(\d{1,3}),(\d{1,3}))?\)/g)
    .toArray()
    .map(([, instruction, ...args]) => ({ instruction, args: args.map(Number) as [number, number] }));
  return lines;
}

export function solvePart1(input: ParseOutput) {
  return sumFilteredProducts(input, ({ instruction }) => instruction === 'mul');
}

export function solvePart2(input: ParseOutput) {
  let enabled = true;
  return sumFilteredProducts(
    input,
    ({ instruction }) => (instruction === 'mul' && enabled) || ((enabled = instruction === 'do') && false)
  );
}

function sumFilteredProducts(input: ParseOutput, filter: (instruction: ParseOutput[number]) => boolean) {
  return input
    .filter(filter)
    .map(({ args }) => product(...args))
    .reduce(sum);
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
