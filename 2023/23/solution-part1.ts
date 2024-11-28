type Tile = '.' | '#' | '^' | '>' | 'v' | '<';
type Map = Tile[][];
type Position = [number, number];

function parse(input: string): Map {
  return input.split('\n').map(line => line.split('') as Tile[]);
}

// There's a map of nearby hiking trails (your puzzle input) that indicates paths (.), forest (#), and steep slopes (^, >, v, and <).
// You're currently on the single path tile in the top row; your goal is to reach the single path tile in the bottom row. Because of all the mist from the waterfall, the slopes are probably quite icy; if you step onto a slope tile, your next step must be downhill (in the direction the arrow is pointing). To make sure you have the most scenic hike possible, never step onto the same tile twice. What is the longest hike you can take?
function findLongestPath(map: Map, start: Position) {
  const visited = new Set<string>();
  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ] as const;

  function findLongestPathRecursive(position: Position): number {
    const [y, x] = position;
    const key = `${y},${x}`;
    if (visited.has(key)) return 0;
    visited.add(key);

    let max = 0;
    directions.forEach(([dy, dx]) => {
      const ny = y + dy;
      const nx = x + dx;
      if (ny < 0 || nx < 0 || ny >= map.length || nx >= map[ny].length) return;
      if (map[ny][nx] === '.') {
        const length = 1 + findLongestPathRecursive([ny, nx]);
        if (length > max) max = length;
      }
    });

    visited.delete(key);
    return max;
  }

  return findLongestPathRecursive(start);
}

const input = (await Bun.file(import.meta.dir + '/example.txt').text()).trim();
const map = parse(input);
const start = [0, 1] as Position;
const result = findLongestPath(map, start);
console.log(result);
