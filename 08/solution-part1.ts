type NavigationMap = {
  instructions: Generator<string>;
  map: { [origin: string]: { left: string; right: string } };
};

function parseMap(input: string): NavigationMap {
  const [instructions, mapLines] = input.split('\n\n');

  return {
    instructions: loopArray(instructions.split('')),
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
      const [origin, left, right] = line.match(/^([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)/)?.slice(1)!;
      return [origin, { left, right }];
    })
  );
}

function findPath(map: NavigationMap) {
  let destination = 'AAA';
  let path = [destination];

  for (const instruction of map.instructions) {
    if (instruction === 'L') {
      destination = map.map[destination].left;
    } else {
      destination = map.map[destination].right;
    }
    path.push(destination);
    if (destination === 'ZZZ') break;
  }

  return path;
}

const input = (await Bun.file('input.txt').text()).trim();
const map = parseMap(input);
const steps = findPath(map).length - 1; // -1 because we don't count the place we start from

console.log(steps);
