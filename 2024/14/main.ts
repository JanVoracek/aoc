import { run } from '../shared/runtime.ts';

export type ParseOutput = ReturnType<typeof parse>;

type Robot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export function parse(inputLines: string): Robot[] {
  return inputLines
    .trim()
    .split('\n')
    .map(line => {
      const parts = line.trim().split(' ');

      const [x, y] = parts[0].substring(2).split(',').map(Number);
      const [vx, vy] = parts[1].substring(2).split(',').map(Number);

      return { x, y, vx, vy };
    });
}

export function solvePart1(input: ParseOutput) {
  const width = 101;
  const height = 103;
  const seconds = 100;

  const finalPositions = simulate(input, width, height, seconds);
  return calculateSafetyFactor(finalPositions, width, height);
}

function solvePart2(input: ParseOutput) {
  const width = 101;
  const height = 103;
  const maxSeconds = 10000;
  return findPeakInLines(input, width, height, maxSeconds);
}

function countLinesLengths(robots: Robot[]): number {
  const occupied = new Set(robots.map(r => `${r.x},${r.y}`));

  const directions = [
    { dx: 1, dy: 0 }, // horizontal
    { dx: 1, dy: 1 }, // diagonal (\)
    { dx: 1, dy: -1 }, // diagonal (/)
  ];

  let lineLengths = 0;

  for (const pos of occupied) {
    const [x, y] = pos.split(',').map(Number);

    for (const { dx, dy } of directions) {
      if (!occupied.has(`${x - dx},${y - dy}`)) {
        let length = 1;
        while (occupied.has(`${x + length * dx},${y + length * dy}`)) length++;
        if (length >= 2) {
          lineLengths += length;
        }
      }
    }
  }

  return lineLengths;
}

function findPeakInLines(robots: Robot[], width: number, height: number, maxSeconds: number): number {
  let maxLineCount = 0;
  let bestSecond = 0;

  for (let t = 0; t <= maxSeconds; t++) {
    const occupied = simulate(robots, width, height, t);
    const lineCount = countLinesLengths(occupied);

    if (lineCount > maxLineCount) {
      maxLineCount = lineCount;
      bestSecond = t;
    }
  }

  return bestSecond;
}

function teleport(value: number, size: number): number {
  return ((value % size) + size) % size;
}

function simulate(robots: Robot[], width: number, height: number, seconds: number): Robot[] {
  return robots.map(r => {
    const x = teleport(r.x + r.vx * seconds, width);
    const y = teleport(r.y + r.vy * seconds, height);
    return { ...r, x, y };
  });
}

function calculateSafetyFactor(robots: Robot[], width: number, height: number): number {
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);

  const quadrants = Object.groupBy(robots, r => {
    if (r.x < centerX && r.y < centerY) {
      return 'q1';
    } else if (r.x > centerX && r.y < centerY) {
      return 'q2';
    } else if (r.x < centerX && r.y > centerY) {
      return 'q3';
    } else if (r.x > centerX && r.y > centerY) {
      return 'q4';
    }

    return 'center';
  });
  delete quadrants.center;

  return Object.values(quadrants).reduce((acc, q) => acc * q.length, 1);
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
