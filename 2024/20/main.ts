import { run } from '../shared/runtime.ts';
import { sum } from '../shared/math.ts';
//@deno-types=https://raw.githubusercontent.com/Kingwl/core-dts/1286bdb002464dfeaa776818083dcf812998080e/src/proposals/stage-1/new-collections-methods.d.ts
import 'https://deno.land/x/corejs@v3.39.0/index.js';

export type ParseOutput = ReturnType<typeof parse>;

type Position = [number, number];
type Size = [number, number];

export function parse(input: string) {
  const lines = input.trim().split('\n');
  const size: Size = [lines.length, lines[0].length];
  let start: Position = [0, 0];
  let end: Position = [0, 0];
  const walls = new Set<string>();

  lines.forEach((row, r) => {
    row.split('').forEach((ch, c) => {
      if (ch === 'S') start = [r, c];
      else if (ch === 'E') end = [r, c];
      else if (ch === '#') walls.add(`${r},${c}`);
    });
  });

  return { walls, start, end, size };
}

export function solvePart1(input: ParseOutput) {
  const cheats = findAllCheats(input, 2);
  return countCheatsSavingAtLeast(cheats, 100);
}

export function solvePart2(input: ParseOutput) {
  const cheats = findAllCheats(input, 20);
  return countCheatsSavingAtLeast(cheats, 100);
}

const directions: Position[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function neighbors(r: number, c: number, size: Size): Position[] {
  return directions
    .map(([dr, dc]) => [r + dr, c + dc] as Position)
    .filter(([nr, nc]) => nr >= 0 && nr < size[0] && nc >= 0 && nc < size[1]);
}

function bfsDistances(walls: Set<string>, start: Position, size: Size): number[][] {
  const dist = Array.from({ length: size[0] }, () => Array(size[1]).fill(Infinity));
  const queue: Position[] = [start];
  dist[start[0]][start[1]] = 0;

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const d = dist[r][c];
    for (const [nr, nc] of neighbors(r, c, size)) {
      if (!walls.has(`${nr},${nc}`) && dist[nr][nc] > d + 1) {
        dist[nr][nc] = d + 1;
        queue.push([nr, nc]);
      }
    }
  }

  return dist;
}

function bfsIgnoringWalls(start: Position, walls: Set<string>, size: Size, maxSteps: number): Map<number, Position[]> {
  const dist = Array.from({ length: size[0] }, () => Array(size[1]).fill(Infinity));
  dist[start[0]][start[1]] = 0;
  const queue: Position[] = [start];
  const trackEndpoints = new Map<number, Position[]>();

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const d = dist[r][c];
    if (d > maxSteps) continue;

    // cheat ends on a track
    if (!walls.has(`${r},${c}`)) {
      trackEndpoints.update(
        d,
        v => (v.push([r, c]), v),
        () => []
      );
    }

    for (const [nr, nc] of neighbors(r, c, size)) {
      if (dist[nr][nc] > d + 1) {
        dist[nr][nc] = d + 1;
        queue.push([nr, nc]);
      }
    }
  }

  return trackEndpoints;
}

function findAllCheats({ walls, start, end, size }: ParseOutput, maxCheatSteps: number): Map<number, number> {
  const distanceFromStart = bfsDistances(walls, start, size);
  const distanceFromEnd = bfsDistances(walls, end, size);
  const baselineTime = distanceFromStart[end[0]][end[1]];
  const savingsCount = new Map<number, number>();

  for (let r = 0; r < size[0]; r++) {
    for (let c = 0; c < size[1]; c++) {
      if (walls.has(`${r},${c}`) || distanceFromStart[r][c] === Infinity || distanceFromEnd[r][c] === Infinity)
        continue;

      bfsIgnoringWalls([r, c], walls, size, maxCheatSteps).forEach((endpoints, d) => {
        endpoints
          .filter(([er, ec]) => distanceFromEnd[er][ec] < Infinity)
          .map(([er, ec]) => distanceFromStart[r][c] + d + distanceFromEnd[er][ec])
          .filter(totalTime => totalTime < baselineTime)
          .forEach(totalTime => {
            const saving = baselineTime - totalTime;
            savingsCount.set(saving, (savingsCount.get(saving) ?? 0) + 1);
          });
      });
    }
  }

  return savingsCount;
}

function countCheatsSavingAtLeast(savingsCount: Map<number, number>, threshold: number): number {
  return [...savingsCount.entries()]
    .filter(([saving]) => saving >= threshold)
    .map(([, count]) => count)
    .reduce(sum);
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
