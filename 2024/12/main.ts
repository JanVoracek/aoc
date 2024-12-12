import { run } from '../shared/runtime.ts';

export type ParseOutput = ReturnType<typeof parse>;

const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export function parse(input: string) {
  const lines = input.trim().split('\n');

  return lines;
}

export function solvePart1(input: ParseOutput) {
  const rows = input.length;
  const cols = input[0].length;

  const visited = Array.from({ length: rows }, () => Array<boolean>(cols).fill(false));

  function calculateDimensions(r: number, c: number): { area: number; perimeter: number } {
    const regionType = input[r][c];
    visited[r][c] = true;

    let area = 1;
    let perimeter = 0;

    function dfs(r: number, c: number) {
      for (const [nr, nc] of getNeighbors(r, c)) {
        if (!inBounds(nr, nc, rows, cols)) {
          perimeter++;
        } else {
          if (input[nr][nc] !== regionType) {
            perimeter++;
          } else {
            if (!visited[nr][nc]) {
              visited[nr][nc] = true;
              area++;
              dfs(nr, nc);
            }
          }
        }
      }
    }

    dfs(r, c);

    return { area, perimeter };
  }

  let totalPrice = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!visited[r][c]) {
        const { area, perimeter } = calculateDimensions(r, c);
        totalPrice += area * perimeter;
      }
    }
  }

  return totalPrice;
}

export function solvePart2(input: ParseOutput) {
  const rows = input.length;
  const cols = input[0].length;

  const visited = Array.from({ length: rows }, () => Array<boolean>(cols).fill(false));

  function calculateDimensions(r: number, c: number): { area: number; edges: number } {
    let area = 0;
    const edges = new Set();
    let edgeCount = 0;
    const val = input[r][c];
    const stack = [[r, c] as [number, number]];

    while (stack.length > 0) {
      const [r, c] = stack.pop()!;

      if (visited[r][c]) {
        continue;
      } else {
        visited[r][c] = true;
      }

      area += 1;

      for (const [i, [nr, nc]] of getNeighbors(r, c).entries()) {
        if (!inBounds(nr, nc, rows, cols) || input[nr][nc] !== val) {
          edgeCount += 1;
          edges.add(`${i},${nr},${nc}`);

          for (const [n2r, n2c] of getNeighbors(nr, nc)) {
            if (edges.has(`${i},${n2r},${n2c}`)) {
              edgeCount -= 1;
            }
          }
        } else {
          stack.push([nr, nc]);
        }
      }
    }

    return { area, edges: edgeCount };
  }

  let totalPrice = 0;
  for (let r = 0; r < input.length; r++) {
    for (let c = 0; c < input[0].length; c++) {
      if (!visited[r][c]) {
        const { area, edges } = calculateDimensions(r, c);
        totalPrice += area * edges;
      }
    }
  }

  return totalPrice;
}

function getNeighbors(r: number, c: number) {
  return directions.map(([dr, dc]) => [r + dr, c + dc] as [number, number]);
}

function inBounds(r: number, c: number, rows: number, cols: number): boolean {
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
