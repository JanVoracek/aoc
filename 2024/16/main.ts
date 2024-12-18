import { MinHeap } from 'npm:@datastructures-js/heap';

import { run } from '../shared/runtime.ts';

export type ParseOutput = ReturnType<typeof parse>;

export function parse(input: string) {
  return input.split('\n').map(row => [...row]);
}

export function solvePart1(input: ParseOutput) {
  return shortestPath(input)[0];
}

export function solvePart2(input: ParseOutput) {
  return shortestPath(input)[1];
}

const directions = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

enum Heading {
  North,
  East,
  South,
  West,
}

function shortestPath(map: ParseOutput) {
  const sr = map.findIndex(row => row.includes('S'));
  const sc = map[sr].indexOf('S');
  const visited = new Map<string, number>();
  const heap = new MinHeap<[number, [number, number, Heading][]]>(item => item[0]);
  heap.push([0, [[sr, sc, Heading.East]]]);

  const tiles = new Set<string>();
  let min = Infinity;
  while (heap.size()) {
    const [score, path] = heap.pop()!;
    const [r, c, h] = path.at(-1)!;

    if (map[r][c] === 'E' && min >= score) {
      min = score;
      path.forEach(([r, c]) => tiles.add(`${r},${c}`));
    }

    for (const dh of [-1, 0, 1]) {
      const nh = (4 + dh + h) % 4;
      const turnScore = 1 + (dh === 0 ? 0 : 1000);
      const nr = r + directions[nh][0];
      const nc = c + directions[nh][1];
      const newScore = score + turnScore;

      if (map[nr]?.[nc] !== '#' && !(visited.get(`${nr},${nc},${nh}`)! < newScore)) {
        visited.set(`${nr},${nc},${nh}`, newScore);
        heap.push([newScore, [...path, [nr, nc, nh]]]);
      }
    }
  }
  return [min, tiles.size];
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
