function column(lines: string[], index: number): string {
  return lines.map(line => line[index]).join('');
}

function expandUniverse(input: string) {
  const lines = input.split('\n');
  const universe: number[][] = lines
    .map(line => line.split('').map(c => 1));

  for (let i = 0; i < universe.length; i++) {
    const line = lines[i];
    const empty = !line.includes('#');
    universe[i] = universe[i].map(c => (empty ? 2 : c));
  }

  for (let i = 0; i < universe[0].length; i++) {
    const col = column(lines, i);
    const empty = !col.includes('#');
    for (let j = 0; j < universe.length; j++) {
      universe[j][i] = empty ? 2 : universe[j][i];
    }
  }
  return universe;
}

function findGalaxies(input: string): [number, number][] {
  const universeWidth = input.indexOf('\n') + 1;
  return [...input.matchAll(/(#)/g)].map(m => [Math.floor(m.index! / universeWidth), m.index! % universeWidth]);
}

function getPairs<T>(input: T[]): [T,T][] {
  const combinations: [T,T][] = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      combinations.push([input[i], input[j]]);
    }
  }
  return combinations;
}

function getDistance(universe: number[][], a: [number, number], b: [number, number]) {
  const minX = Math.min(a[0], b[0]);
  const maxX = Math.max(a[0], b[0]);
  const minY = Math.min(a[1], b[1]);
  const maxY = Math.max(a[1], b[1]);
  let distance = 0;
  for (let x = minX + 1; x <= maxX; x++) {
    distance += universe[x][minY];
  }
  for (let y = minY + 1; y <= maxY; y++) {
    distance += universe[maxX][y];
  }
  return distance;
}

const input = (await Bun.file('input.txt').text()).trim();
console.log(input);

const universe = expandUniverse(input);
const galaxies = findGalaxies(input);
const pairs = getPairs(galaxies);

const result = pairs.map(([a, b]) => getDistance(universe, a, b));
console.log(result.reduce((a, b) => a + b, 0));

