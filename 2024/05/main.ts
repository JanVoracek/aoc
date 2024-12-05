import { run } from '../shared/runtime.ts';
import { sum } from '../shared/math.ts';

export type ParseOutput = ReturnType<typeof parse>;

export function parse(input: string) {
  const [rawOrderings, rawUpdatePages] = input.trim().split('\n\n');

  return {
    orderings: rawOrderings.split('\n').map(line => line.split('|').map(Number) as [number, number]),
    updates: rawUpdatePages.split('\n').map(line => line.split(',').map(Number)),
  };
}

export function solvePart1(input: ParseOutput) {
  return input.updates
    .filter(pages => isOrdered(input.orderings, pages))
    .map(pages => middle(pages))
    .reduce(sum);
}

export function solvePart2(input: ParseOutput) {
  return input.updates
    .filter(pages => !isOrdered(input.orderings, pages))
    .map(pages => middle(reOrder(input.orderings, pages)))
    .reduce(sum);
}

function isOrdered(orderings: [number, number][], pages: number[]): boolean {
  return orderings.every(([x, y]) => {
    return orderInfo(pages, x, y).ordered;
  });
}

type OrderInfo = {
  ordered: boolean;
  xi: number;
  yi: number;
};

function orderInfo(pages: number[], x: number, y: number): OrderInfo {
  const xi = pages.indexOf(x);
  const yi = pages.indexOf(y);
  return { ordered: xi === -1 || yi === -1 || xi < yi, xi, yi };
}

function reOrder(orderings: [number, number][], pages: number[]): number[] {
  while (!isOrdered(orderings, pages)) {
    for (const [x, y] of orderings) {
      const { ordered, xi, yi } = orderInfo(pages, x, y);
      if (!ordered) {
        [pages[xi], pages[yi]] = [pages[yi], pages[xi]];
      }
    }
  }
  return pages;
}

function middle<T>(array: T[]) {
  return array[Math.floor(array.length / 2)];
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
