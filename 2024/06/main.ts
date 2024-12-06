import { run } from '../shared/runtime.ts';

export type ParseOutput = ReturnType<typeof parse>;

type Position = [number, number];
type Direction = '^' | 'v' | '<' | '>';

export function parse(input: string) {
  const lines = input.trim().split('\n');
  let startingPosition: Position = [0, 0];
  const obstacles = new Map<string, Position>();

  lines.forEach((line, r) => {
    line.split('').forEach((char, c) => {
      if (char === '#') {
        obstacles.set(`${r},${c}`, [r, c]);
      } else if (char === '^') {
        startingPosition = [r, c];
      }
    });
  });

  return { obstacles, startingPosition, length: lines.length, width: lines[0].length };
}

export function solvePart1(input: ParseOutput) {
  let nextStep;
  let position = input.startingPosition;
  let direction = '^' as Direction;
  const visited = new Set<string>([`${position.join(',')}`]);
  while ((nextStep = getNextStep(input, position, direction))) {
    visited.add(`${position.join(',')}`);
    position = nextStep[0];
    direction = nextStep[1];
  }

  return visited.size + 1;
}

export function solvePart2(input: ParseOutput) {
  let totalLoops = 0;
  // yolo, brute force it
  for (let r = 0; r < input.length; r++) {
    for (let c = 0; c < input.width; c++) {
      if (input.obstacles.has(`${r},${c}`)) {
        continue;
      }
      const obstacles = new Map([...input.obstacles.entries(), [`${r},${c}`, [r, c] as Position]]);
      if (doesContainLoop({ ...input, obstacles }, input.startingPosition, '^')) {
        totalLoops++;
      }
    }
  }
  return totalLoops;
}

function doesContainLoop(input: ParseOutput, startingPosition: Position, startingDirection: Direction): boolean {
  const visited = new Set<string>();
  let position = startingPosition;
  let direction = startingDirection;
  while (true) {
    const key = `${position.join(',')}@${direction}`;
    if (visited.has(key)) {
      return true;
    }
    visited.add(key);
    const nextStep = getNextStep(input, position, direction);
    if (!nextStep) {
      return false;
    }
    [position, direction] = nextStep;
  }
}

const directionMap: Record<Direction, Position> = {
  ['^']: [-1, 0],
  ['v']: [1, 0],
  ['<']: [0, -1],
  ['>']: [0, 1],
};

const rotateRight: Record<Direction, Direction> = {
  ['^']: '>',
  ['v']: '<',
  ['<']: '^',
  ['>']: 'v',
};

function getNextStep(input: ParseOutput, position: Position, direction: Direction): [Position, Direction] | null {
  const [dr, dc] = directionMap[direction];
  const nextPosition: Position = [position[0] + dr, position[1] + dc];

  if (nextPosition[0] < 0 || nextPosition[0] >= input.length || nextPosition[1] < 0 || nextPosition[1] >= input.width) {
    return null;
  }

  if (input.obstacles.has(`${nextPosition.join(',')}`)) {
    return [position, rotateRight[direction]];
  }

  return [nextPosition, direction];
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
