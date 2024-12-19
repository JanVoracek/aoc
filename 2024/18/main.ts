import { run } from '../shared/runtime.ts';

export type ParseOutput = ReturnType<typeof parse>;

type Position = [number, number];

type Step = {
  position: Position;
  steps: number;
};

const directions = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

export function parse(input: string) {
  const corruptedBytes = input
    .trim()
    .split('\n')
    .map(line => line.split(',').map(Number) as Position);
  const size = Math.max(...corruptedBytes.flat()) + 1;
  return { corruptedBytes, size };
}

export function solvePart1({ corruptedBytes, size }: ParseOutput) {
  return findFastestPath(corruptedBytes.slice(0, 1024), size);
}

export function solvePart2({ corruptedBytes, size }: ParseOutput) {
  let lastWorking = 1024;
  let firstNotWorking = corruptedBytes.length;

  while (lastWorking < firstNotWorking - 1) {
    const tested = (lastWorking + firstNotWorking) >> 1;
    if (findFastestPath(corruptedBytes.slice(0, tested), size) === 0) {
      firstNotWorking = tested;
    } else {
      lastWorking = tested;
    }
  }
  return corruptedBytes[lastWorking].join();
}

function findFastestPath(corruptedBytes: Position[], size: number): number {
  const corrupted = new Set<string>(corruptedBytes.map(([c, r]) => `${r},${c}`));
  const start: Position = [0, 0];
  const queue: Step[] = [{ position: start, steps: 0 }];
  const visited = new Set<string>([start.join()]);

  while (queue.length > 0) {
    const {
      position: [r, c],
      steps,
    } = queue.pop()!;

    for (const [dr, dc] of directions) {
      const position: Position = [r + dr, c + dc];
      const key = position.join();
      if (!inBounds(position, size) || corrupted.has(key) || visited.has(key)) {
        continue;
      }

      if (position[0] === size - 1 && position[1] === size - 1) {
        return steps + 1;
      }
      visited.add(key);
      queue.push({ position, steps: steps + 1 });
    }
  }
  return 0;
}

function inBounds(pos: Position, size: number) {
  return pos[0] >= 0 && pos[0] < size && pos[1] >= 0 && pos[1] < size;
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
