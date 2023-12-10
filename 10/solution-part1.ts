type Symbol = keyof typeof directions;
const directions = {
  '|': 'north-south',
  '-': 'east-west',
  L: 'north-east',
  J: 'north-west',
  '7': 'south-east',
  F: 'south-west',
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

function deduceStartSymbol(input: string, startPosition: [number, number], mazeLength: number): Symbol {
  const [x, y] = startPosition;
  const symbolAt = (dx: number, dy: number) => input[x + dx + (y + dy) * mazeLength] as Symbol;

  let possibleSymbols = Object.keys(directions) as Symbol[];

  if (['-', '7', 'J'].includes(symbolAt(1, 0))) {
    possibleSymbols = possibleSymbols.filter(s => ['-', 'L', 'F'].includes(s));
  }
  if (['-', 'F', 'L'].includes(symbolAt(-1, 0))) {
    possibleSymbols = possibleSymbols.filter(s => ['-', 'J', '7'].includes(s));
  }
  if (['|', 'L', 'J'].includes(symbolAt(0, 1))) {
    possibleSymbols = possibleSymbols.filter(s => ['|', 'F', '7'].includes(s));
  }
  if (['|', 'F', '7'].includes(symbolAt(0, -1))) {
    possibleSymbols = possibleSymbols.filter(s => ['|', 'L', 'J'].includes(s));
  }

  return possibleSymbols[0];
}

function solve(input: string, symbolUnderStart: Symbol) {
  const mazeLength = input.indexOf('\n') + 1;
  const sPosition = input.indexOf('S');
  const startPosition: [number, number] = [sPosition % mazeLength, Math.floor(sPosition / mazeLength)];

  let symbol: Symbol | 'S' = deduceStartSymbol(input, startPosition, mazeLength);
  let previous = startPosition;
  let position = startPosition;
  let length = 0;

  do {
    const [x, y] = position;
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
    symbol = input[position[0] + position[1] * mazeLength] as Symbol | 'S';
    length++;
  } while (symbol !== 'S');

  return length / 2;
}

const inputs = [
  ['example.txt', 'F'],
  ['input.txt', 'L'],
] as const;

const [filename, symbolUnderStart] = inputs[0];

const input = (await Bun.file(filename).text()).trim();
prettyPrint(input);
const result = solve(input, symbolUnderStart);
console.log(result);
