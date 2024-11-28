type Garden = {
  size: number;
  rocks: Position[];
};
type Position = [number, number];

function parse(input: string): [Position, Garden] {
  const lineLength = input.indexOf('\n') + 1;
  const size = lineLength - 1;
  const sPosition = input.indexOf('S');
  const start = [Math.floor(sPosition / lineLength), sPosition % lineLength] as Position;
  const rocks = [...input.matchAll(/#/g)].map(
    ({ index }) => [Math.floor(index! / lineLength), index! % lineLength] as Position
  );
  return [start, { size, rocks }];
}

const getVisitedKey = ([y, x]: Position, d: number) => (y * 1000 + x) * 1000 + d;
const getRockKey = ([y, x]: Position) => y * 1000 + x;
const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
] as const;

function findPlots(garden: Garden, start: Position, maxSteps: number): number {
  const rocks = new Set(garden.rocks.map(getRockKey));
  const visited = new Set<number>();

  let plots = 0;
  let reachable: [Position, number][] = [[start, 0]];

  while (reachable.length > 0) {
    const [[y, x], distance] = reachable.pop()!;
    const key = getVisitedKey([y, x], distance);

    if (visited.has(key)) continue;
    visited.add(key);

    if (distance === maxSteps) {
      plots += 1;
      continue;
    }

    directions.forEach(([dy, dx]) => {
      const ny = y + dy;
      const nx = x + dx;

      if (nx < 0 || ny < 0 || nx >= garden.size || ny >= garden.size) return;

      if (!rocks.has(getRockKey([ny, nx]))) {
        reachable.push([[ny, nx], distance + 1]);
      }
    });
  }

  return plots;
}

/**
 * The pattern in plots repeats in a diamond shape:
 *
 * O = Odd garden bed
 * E = Even garden bed
 * Sp = Small partial garden bed
 * Lp = Large partial garden bed
 * S = Start garden bed
 * C = Corner garden bed
 *
 * One quadrant:
 *
 *    C
 *    | \
 *    |  \ Sp
 *    |   \
 *    E --- Lp
 *    |     | \
 *    |     |  \ Sp
 *    |     |   \
 *    O --- E --- Lp
 *    |     |     | \
 *    |     |     |  \ Sp
 *    |     |     |   \
 *    S --- O --- E --- C
 */

function solve(garden: Garden, start: Position, steps: number) {
  // Number of beds that can be reached from the start position
  const gardenDiameter = Math.floor(steps / garden.size) - 1;

  const oddBeds = (Math.floor(gardenDiameter / 2) * 2 + 1) ** 2;
  const evenBeds = (Math.floor((gardenDiameter + 1) / 2) * 2) ** 2;

  const oddBedPlots = findPlots(garden, [start[0], start[1]], garden.size * 2 + 1);
  const evenBedPlots = findPlots(garden, [start[0], start[1]], garden.size * 2);

  const corners = [
    [garden.size - 1, start[1]],
    [start[0], garden.size - 1],
    [start[0], 0],
    [0, start[1]],
  ];

  const cornerBedsPlots = corners.map(([y, x]) => findPlots(garden, [y, x], garden.size - 1));

  const halfBed = Math.floor(garden.size / 2) - 1;
  const oneAndHalfBed = Math.floor((garden.size * 3) / 2) - 1;

  const partialBedsLocations = [
    [garden.size - 1, 0],
    [0, garden.size - 1],
    [0, 0],
    [garden.size - 1, garden.size - 1],
  ];

  const smallPartialBedsPlots = partialBedsLocations.map(([y, x]) => findPlots(garden, [y, x], halfBed));
  const largePartialBedsPlots = partialBedsLocations.map(([y, x]) => findPlots(garden, [y, x], oneAndHalfBed));

  const mainGardenPlots = oddBeds * oddBedPlots + evenBeds * evenBedPlots;
  const smallPartialPlots = (gardenDiameter + 1) * sum(smallPartialBedsPlots);
  const largePartialPlots = gardenDiameter * sum(largePartialBedsPlots);
  return mainGardenPlots + smallPartialPlots + largePartialPlots + sum(cornerBedsPlots);
}

function sum(numbers: number[]) {
  return numbers.reduce((acc, val) => acc + val, 0);
}

const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
const [start, garden] = parse(input);
const result = solve(garden, start, 26501365);
console.log(result);
