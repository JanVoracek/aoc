import { run } from '../shared/runtime.ts';

export type ParseOutput = ReturnType<typeof parse>;

export function parse(input: string) {
  return input
    .trim()
    .split('\n')
    .map(line => line.split('').map(Number));
}

export function solvePart1(input: ParseOutput) {
  return solveTrails(input).score;
}

export function solvePart2(input: ParseOutput) {
  return solveTrails(input).rating;
}

function findZeros(input: number[][]) {
  const starts = [];
  for (let r = 0; r < input.length; r++) {
    for (let c = 0; c < input[0].length; c++) {
      if (input[r][c] === 0) {
        starts.push([r, c]);
      }
    }
  }
  return starts;
}

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

function solveTrails(map: number[][]) {
  const rows = map.length;
  const cols = map[0].length;

  const trailheads = findZeros(map);

  const memo: { [key: string]: [number, Set<string>] } = {};

  function dfs(r: number, c: number): [number, Set<string>] {
    const key = `${r},${c}`;
    if (memo[key]) {
      return memo[key];
    }

    const height = map[r][c];
    if (height === 9) {
      return (memo[key] = [1, new Set([key])]);
    }

    let totalWays = 0;
    let totalNines = new Set<string>();

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && map[nr][nc] === height + 1) {
        const [w, nset] = dfs(nr, nc);
        totalWays += w;
        totalNines = totalNines.union(nset);
      }
    }

    return (memo[key] = [totalWays, totalNines]);
  }

  return trailheads.reduce(
    (acc, [r, c]) => {
      const [ways, ninesSet] = dfs(r, c);
      acc.rating += ways;
      acc.score += ninesSet.size;
      return acc;
    },
    { score: 0, rating: 0 }
  );
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
