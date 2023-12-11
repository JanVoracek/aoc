type Sliceable<T> = ArrayLike<T> & { slice: Array<T>['slice'] };

function expandUniverse(input: string, expansionFactor: number) {
  const lines = input.split('\n');

  const emptyLines = new Set(
    lines
      .map((line, i) => [line, i] as const)
      .filter(([line]) => !line.includes('#'))
      .map(([_, i]) => i)
  );

  const emptyColumns = new Set(
    Array.from({ length: lines[0].length })
      .map((_, i) => [columnSlice(lines, i, 0), i] as const)
      .filter(([column]) => !column.includes('#'))
      .map(([_, i]) => i)
  );

  return lines.map((line, x) =>
    line.split('').map((_, y) => (emptyLines.has(x) || emptyColumns.has(y) ? expansionFactor : 1))
  );
}

function findGalaxies(input: string): [number, number][] {
  const universeWidth = input.indexOf('\n') + 1;
  return [...input.matchAll(/(#)/g)].map(m => [Math.floor(m.index! / universeWidth), m.index! % universeWidth]);
}

function getPairs<T>(input: T[]): [T, T][] {
  return input.flatMap((a, i) => input.slice(i + 1).map(b => [a, b] as [T, T]));
}

function columnSlice<T>(matrix: Sliceable<ArrayLike<T>>, column: number, start: number, end?: number): T[] {
  return matrix.slice(start, end).map(row => row[column]);
}

function sum(input: number[]): number {
  return input.reduce((a, b) => a + b, 0);
}

function getDistance(universe: number[][], a: [number, number], b: [number, number]) {
  const [x1, x2] = [Math.min(a[0], b[0]) + 1, Math.max(a[0], b[0])];
  const [y1, y2] = [Math.min(a[1], b[1]) + 1, Math.max(a[1], b[1])];

  return sum(columnSlice(universe, y2, x1, x2 + 1)) + sum(universe[x2].slice(y1, y2 + 1));
}

const input = (await Bun.file('input.txt').text()).trim();
console.log(input);

const universe = expandUniverse(input, 1_000_000);
const galaxies = findGalaxies(input);
const pairs = getPairs(galaxies);

const result = pairs.map(([a, b]) => getDistance(universe, a, b)).reduce((a, b) => a + b, 0);
console.log(result);
