type Symbol = keyof typeof directions;
const directions = {
  '|': 'north-south',
  '-': 'east-west',
  L: 'north-east',
  J: 'north-west',
  '7': 'south-east',
  F: 'south-west',
  '.': null,
  S: null,
} as const;

function prettyPrint(input: string) {
  const replacements = {
    '|': '│',
    '-': '─',
    L: '└',
    J: '┘',
    '7': '┐',
    F: '┌',
  } as Record<string, string>;

  console.log(input.replaceAll(/[\-LJ7F]/g, c => replacements[c] ?? c));
}

function replaceAt(input: string, index: number, replacement: string) {
  return input.slice(0, index) + replacement + input.slice(index + replacement.length);
}

function solve(input: string, symbolUnderStart: Symbol) {
  const mazeLength = input.indexOf('\n') + 1;
  const sPosition = input.indexOf('S');
  const startPosition: [number, number] = [sPosition % mazeLength, Math.floor(sPosition / mazeLength)];

  let symbol = symbolUnderStart;
  let previous = startPosition;
  let position = startPosition;
  let mazePositions = new Set<string>();
  let length = 0;

  do {
    const [x, y] = position;
    mazePositions.add(`${x},${y}`);
    const [px, py] = previous;
    const direction = directions[symbol];

    if (direction === 'north-south') {
      position = py < y ? [x, y + 1] : [x, y - 1];
    } else if (direction === 'east-west') {
      position = px < x ? [x + 1, y] : [x - 1, y];
    } else if (direction === 'north-east') {
      position = py < y ? [x + 1, y] : [x, y - 1];
    } else if (direction === 'north-west') {
      position = py < y ? [x - 1, y] : [x, y - 1];
    } else if (direction === 'south-east') {
      position = py > y ? [x - 1, y] : [x, y + 1];
    } else if (direction === 'south-west') {
      position = py > y ? [x + 1, y] : [x, y + 1];
    }
    previous = [x, y];
    symbol = input[position[0] + position[1] * mazeLength] as Symbol;
    length++;
  } while (symbol !== 'S');

  input = replaceAt(input, startPosition[0] + startPosition[1] * mazeLength, symbolUnderStart);
  const lines = input.split('\n');
  let area = 0;

  for (let y = 0; y < lines.length; y++) {
    let insideMaze = false;
    let corner: string | undefined;
    for (let x = 0; x < lines[y].length; x++) {
      if (mazePositions.has(`${x},${y}`)) {
        let symbol = lines[y][x];
        if (symbol === '-') {
          continue;
        }
        if (symbol === '|') {
          insideMaze = !insideMaze;
          continue;
        }
        if (!corner) {
          corner = symbol;
          continue;
        }

        if ((corner === 'L' && symbol === '7') || (corner === 'F' && symbol === 'J')) {
          insideMaze = !insideMaze;
        }
        corner = undefined;
        continue;
      }
      if (insideMaze) {
        area++;
      }
    }
  }

  prettyPrint(input);
  return area;
}

const inputs = [
  ['example.txt', 'F'],
  ['example2.txt', 'F'],
  ['example3.txt', 'F'],
  ['input.txt', 'L'],
] as const;

const [filename, symbolUnderStart] = inputs[3];

const input = (await Bun.file(filename).text()).trim();
prettyPrint(input);
const result = solve(input, symbolUnderStart);
console.log(result);
