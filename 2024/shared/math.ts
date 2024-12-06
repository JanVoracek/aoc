export function sum(a: number, b: number) {
  return a + b;
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
