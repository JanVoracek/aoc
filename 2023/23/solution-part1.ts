type Tile = '.' | '#' | '^' | '>' | 'v' | '<';
type Map = Tile[][];
type Position = { row: number; col: number };

const slopeDirection: Record<string, string> = {
  ['>']: hash({ row: 0, col: 1 }),
  ['<']: hash({ row: 0, col: -1 }),
  ['^']: hash({ row: -1, col: 0 }),
  ['v']: hash({ row: 1, col: 0 }),
};

function parse(input: string): Map {
  return input.split('\n').map(line => line.split('') as Tile[]);
}

function findLongestPath(map: Map, pos: Position, target: Position, visited: Set<string>, distance: number): number {
  if (pos.row === target.row && pos.col === target.col) {
    return distance + 1;
  }

  const tile = map[pos.row][pos.col];
  visited = visited.union(new Set([hash(pos)]));

  let maxDistance = 0;
  for (const next of neighbors(pos)) {
    const nextTile = map[next.row][next.col];
    if (
      nextTile === '#' ||
      visited.has(hash(next)) ||
      (tile !== '.' && slopeDirection[tile] !== hash({ row: next.row - pos.row, col: next.col - pos.col }))
    ) {
      continue;
    }
    maxDistance = Math.max(maxDistance, findLongestPath(map, next, target, visited, distance + 1));
  }
  return maxDistance;
}

function neighbors(pos: Position) {
  return [
    { row: pos.row - 1, col: pos.col },
    { row: pos.row, col: pos.col - 1 },
    { row: pos.row, col: pos.col + 1 },
    { row: pos.row + 1, col: pos.col },
  ];
}

function hash(pos: Position) {
  return `${pos.row}:${pos.col}`;
}

{
  const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
  const map = parse(input);
  const height = map.length - 1;
  const width = map[0].length - 1;

  const start = { row: 1, col: 1 };
  const target = { row: height, col: width - 1 };
  const distance = findLongestPath(map, start, target, new Set([hash({ row: 0, col: 1 })]), 0);
  console.log(distance);
}

