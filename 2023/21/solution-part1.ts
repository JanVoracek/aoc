type Garden = {
  width: number;
  height: number;
  rocks: Position[];
};
type Position = [number, number];

function parse(input: string): [Position, Garden] {
  const lineLength = input.indexOf('\n') + 1;
  const height = input.match(/\n/g)?.length! + 1;
  const width = lineLength - 1;
  const sPosition = input.indexOf('S');
  const start = [Math.floor(sPosition / lineLength), sPosition % lineLength] as Position;
  const rocks = [...input.matchAll(/#/g)].map(
    ({ index }) => [Math.floor(index! / lineLength), index! % lineLength] as Position
  );
  return [start, { width, height, rocks }];
}

function solve(garden: Garden, start: Position, steps: number) {
  let reached: Position[] = [start];

  for (let i = 0; i < steps; i++) {
    reached = uniq(
      reached
        .flatMap(([x, y]) => [
          [x + 1, y] as Position,
          [x - 1, y] as Position,
          [x, y + 1] as Position,
          [x, y - 1] as Position,
        ])
        .filter(([x, y]) => x >= 0 && x < garden.height && y >= 0 && y < garden.width)
        .filter(([x, y]) => !garden.rocks.some(([x1, y1]) => x === x1 && y === y1))
    );
  }
  return reached.length;
}

function uniq(positions: Position[]): Position[] {
  return [...new Set(positions.map(p => JSON.stringify(p)))].map(s => JSON.parse(s) as Position);
}

const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
const [start, garden] = parse(input);
const result = solve(garden, start, 64);
console.log(result);
