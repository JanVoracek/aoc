import { run } from '../shared/runtime.ts';
import { combinations } from '../shared/math.ts';

export type ParseOutput = ReturnType<typeof parse>;

type Node = {
  row: number;
  col: number;
  value: string;
};

export function parse(input: string) {
  const lines = input.trim().split('\n');
  const nodes = lines.flatMap((line, r) => {
    const m = line
      .matchAll(/\w/g)
      .toArray()
      .map(m => ({ row: r, col: m.index, value: m[0] } as Node));
    return m;
  });

  return { nodes, rows: lines.length, cols: lines[0].length };
}

export function solvePart1({ nodes, rows, cols }: ParseOutput) {
  return new Set(
    Object.values(Object.groupBy(nodes, node => node.value) as Record<string, Node[]>)
      .flatMap(points =>
        combinations(points, 2).flatMap(([a, b]) => [
          [2 * a.col - b.col, 2 * a.row - b.row] as const,
          [2 * b.col - a.col, 2 * b.row - a.row] as const,
        ])
      )
      .filter(([col, row]) => inBounds(rows, cols, row, col))
      .map(antinode => antinode.join(','))
  ).size;
}

export function solvePart2({ nodes, rows, cols }: ParseOutput) {
  return new Set(
    Object.values(Object.groupBy(nodes, node => node.value) as Record<string, Node[]>)
      .flatMap(points =>
        combinations(points, 2).flatMap(([a, b]) => {
          const dr = b.row - a.row;
          const dc = b.col - a.col;

          return [
            ...getCoordinatesToEdge(rows, cols, a, dr, dc),
            ...getCoordinatesToEdge(rows, cols, a, -dr, -dc),
          ];
        })
      )
      .map(antinode => antinode.join(','))
  ).size;
}

function inBounds(rows: number, cols: number, r: number, c: number) {
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

function getCoordinatesToEdge(rows: number, cols: number, start: Node, dr: number, dc: number) {
  const coordinates = [];
  let row = start.row;
  let col = start.col;
  while (inBounds(rows, cols, row, col)) {
    coordinates.push([col, row]);
    col += dc;
    row += dr;
  }
  return coordinates;
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
