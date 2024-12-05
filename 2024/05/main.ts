import { run } from '../shared/runtime.ts';
import { sum } from '../shared/math.ts';

export type ParseOutput = ReturnType<typeof parse>;

export function parse(input: string) {
  const [rawOrderings, rawUpdatePages] = input.trim().split('\n\n');

  return {
    orderings: rawOrderings.split('\n'),
    updates: rawUpdatePages.split('\n').map(line => line.split(',')),
  };
}

export function solvePart1(input: ParseOutput) {
  return input.updates
    .filter(pages => isOrdered(input.orderings, pages))
    .map(pages => Number(middle(pages)))
    .reduce(sum);
}

export function solvePart2(input: ParseOutput) {
  return input.updates
    .filter(pages => !isOrdered(input.orderings, pages))
    .map(pages => Number(middle(reOrder(input.orderings, pages))))
    .reduce(sum);
}

function isOrdered(orderings: string[], pages: string[]): boolean {
  return orderings.every(ordering => arePagesOrdered(pages, ordering));
}

function arePagesOrdered(pages: string[], ordering: string): boolean {
  const [x, y] = ordering.split('|');
  const xi = pages.indexOf(x);
  const yi = pages.indexOf(y);
  return xi === -1 || yi === -1 || xi < yi;
}

function reOrder(orderings: string[], pages: string[]): string[] {
  return pages.slice().sort((a, b) => {
    if (orderings.includes(`${a}|${b}`)) return -1;
    if (orderings.includes(`${b}|${a}`)) return 1;
    return 0;
  });
}

function middle<T>(array: T[]) {
  return array[Math.floor(array.length / 2)];
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
