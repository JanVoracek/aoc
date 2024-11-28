type Direction = 'U' | 'D' | 'R' | 'L';
type Position = { x: number; y: number };

type Instruction = {
  direction: Direction;
  length: number;
  theColorIsALie: never;
};

type Polygon = {
  perimeter: number;
  corners: Position[];
};

function parse(input: string): Instruction[] {
  return input.split('\n').map(line => {
    const color = line.split(' ')[2].slice(2, -1);
    const length = parseInt(color.slice(0, 5), 16);
    const direction = { '0': 'R', '1': 'D', '2': 'L', '3': 'U' }[color[5]];

    return {
      direction,
      length,
    } as Instruction;
  });
}

function createPolygon(instructions: Instruction[]): Polygon {
  const corners: Position[] = [{ x: 0, y: 0 }];
  let perimeter = 0;

  for (const { direction, length } of instructions) {
    const corner: Position = { ...corners[corners.length - 1] };

    if (direction === 'U') {
      corner.y += length;
    } else if (direction === 'D') {
      corner.y -= length;
    } else if (direction === 'R') {
      corner.x += length;
    } else if (direction === 'L') {
      corner.x -= length;
    }

    perimeter += length;
    corners.push(corner);
  }

  return { corners, perimeter };
}

// Shoelace formula
function calculatePolygonArea(polygon: Polygon) {
  let area = 0;
  const { corners } = polygon;

  for (let i = 0; i < corners.length - 1; i++) {
    area += (corners[i].y + corners[i + 1].y) * (corners[i].x - corners[i + 1].x);
  }
  return Math.abs(area) / 2;
}

function calculateLagoon(polygon: Polygon) {
  // Pick's theorem +2? Whyyyyyyyyyyy. I don't know but it works for both example and the input.
  return calculatePolygonArea(polygon) + (polygon.perimeter / 2) - 1 + 2;
}

const input = (await Bun.file(import.meta.dir + '/example.txt').text()).trim();
const instructions = parse(input);
const polygon = createPolygon(instructions);
const result = calculateLagoon(polygon);
console.log(result);
