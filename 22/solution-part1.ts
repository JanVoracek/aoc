type Position = { x: number; y: number; z: number };
type Brick = {
  from: Position;
  to: Position;
};

function parse(input: string): Brick[] {
  return input.split('\n').map(line => {
    const [from, to] = line.split('~').map(coord => {
      const [x, y, z] = coord.split(',').map(Number);
      return { x, y, z } as Position;
    });
    return { from, to };
  });
}

function solve(bricks: Brick[]): number {
  const pile = buildPile(bricks);

  let somethingFell;
  do {
    somethingFell = false;
    for (const brick of bricks) {
      let canFall = true;
      canFall = brickCanFall(brick, pile);
      if (canFall) {
        somethingFell = true;
        moveBrickDown(brick, pile);
      }
    }
  } while (somethingFell);

  const { above, below } = buildDependencyMaps(bricks, pile);

  return bricks.filter(brick => {
    return [...above.get(brick)!].every(brickAbove => below.get(brickAbove)!.size > 1);
  }).length;
}

function foreach3d<T>(from: Position, to: Position, fn: (p: Position) => void) {
  for (let x = from.x; x <= to.x; x++) {
    for (let y = from.y; y <= to.y; y++) {
      for (let z = from.z; z <= to.z; z++) {
        fn({ x, y, z });
      }
    }
  }
}

const getKey = (p: Position) => `${p.x},${p.y},${p.z}`;

function buildDependencyMaps(bricks: Brick[], pile: Map<string, Brick>) {
  const above = new Map(bricks.map(brick => [brick, new Set<Brick>()]));
  const below = new Map(bricks.map(brick => [brick, new Set<Brick>()]));

  for (const brick of bricks) {
    foreach3d(brick.from, brick.to, p => {
      const key = getKey({ ...p, z: p.z + 1 });
      const other = pile.get(key);
      if (other && other != brick) {
        above.get(brick)!.add(other);
        below.get(other)!.add(brick);
      }
    });
  }
  return { above, below };
}

function buildPile(bricks: Brick[]) {
  const pile = new Map<string, Brick>();
  for (const brick of bricks) {
    foreach3d(brick.from, brick.to, p => {
      const key = getKey(p);
      if (!pile.has(key)) {
        pile.set(key, brick);
      }
    });
  }
  return pile;
}

function brickCanFall(brick: Brick, pile: Map<string, Brick>) {
  let canFall = true;
  foreach3d(brick.from, brick.to, p => {
    const key = getKey({ ...p, z: p.z - 1 });
    // is on the ground or is on top of another brick
    if (p.z - 1 <= 0 || (pile.has(key) && pile.get(key) != brick)) {
      canFall = false;
    }
  });
  return canFall;
}

function moveBrickDown(brick: Brick, pile: Map<string, Brick>) {
  foreach3d(brick.from, brick.to, p => {
    pile.delete(getKey(p));
  });

  brick.from.z -= 1;
  brick.to.z -= 1;

  foreach3d(brick.from, brick.to, p => {
    pile.set(getKey(p), brick);
  });
}

const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
const bricks = parse(input);
const result = solve(bricks);
console.log(result);

