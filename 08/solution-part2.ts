type NavigationMap = {
  getInstructions: () => Generator<string>;
  map: { [origin: string]: { left: string; right: string } };
};

function parseMap(input: string): NavigationMap {
  const [instructions, mapLines] = input.split('\n\n');

  return {
    getInstructions: () => loopArray(instructions.split('')),
    map: parseMapLines(mapLines.split('\n')),
  };
}

function* loopArray(instructions: string[]) {
  let index = 0;
  while (true) {
    yield instructions[index];
    index = (index + 1) % instructions.length;
  }
}

function parseMapLines(mapLines: string[]) {
  return Object.fromEntries(
    mapLines.map(line => {
      const [origin, left, right] = line.match(/^(.{3}) = \((.{3}), (.{3})\)/)?.slice(1)!;
      return [origin, { left, right }];
    })
  );
}

function findLoops(map: NavigationMap, start: string) {
  let destination = start;
  const path = [start];
  // Here would be the part where we find the loop
  // But actually, it always start in the second node
  // So it's ok to just skip the first node and return the path to Z
  path.pop();

  for (const instruction of map.getInstructions()) {
    if (instruction === 'L') {
      destination = map.map[destination].left;
    } else {
      destination = map.map[destination].right;
    }

    path.push(destination);
    if (destination.endsWith('Z')) break;
  }

  return path;
}

function gcd(a: number, b: number): number {
  return b == 0 ? a : gcd(b, a % b);
}
function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

const input = (await Bun.file('input.txt').text()).trim();
const map = parseMap(input);
const startingPoints = Object.keys(map.map).filter(key => key.endsWith('A'));
const paths = startingPoints.map(start => findLoops(map, start));

// We need to find the least common multiple of all the paths
// That's the number of steps we need to do to go to end in Z from all the starting points
// Again, this leverages the fact that the first node is always skipped
const result = paths.reduce((acc, cur) => lcm(acc, cur.length), 1);

console.log(result);
