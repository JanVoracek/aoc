export function sum(a: number | null | undefined, b: number | null | undefined) {
  return Number(a) + Number(b);
}

export function product(a: number, b: number) {
  return a * b;
}

export function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function cartesianProduct<T>(a: T[], b: T[]) {
  return a.flatMap(x => b.map(y => [x, y] as [T, T]));
}

export function combinations<T>(array: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (k > array.length) return [];

  return array.flatMap((item, index) => combinations(array.slice(index + 1), k - 1).map(combo => [item, ...combo]));
}
