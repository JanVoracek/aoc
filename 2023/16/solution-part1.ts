type Tile = {
  type: '.' | '/' | '\\' | '|' | '-';
  position: [number, number];
  beamPassing: Direction;
};

type Beam = {
  position: [number, number];
  direction: Direction;
};

const enum Direction {
  None = 0,
  Right = 1,
  Left = 2,
  Up = 4,
  Down = 8,
}

function parse(input: string): Tile[][] {
  return input.split('\n').map((line, i) =>
    line.split('').map(
      (char, j) =>
        ({
          type: char,
          position: [i, j],
          beamPassing: Direction.None,
        } as Tile)
    )
  );
}

function solve(layout: Tile[][]) {
  layout[0][0].beamPassing = Direction.Right;
  const beams: Beam[] = [{ position: [0, 0], direction: Direction.Right }];

  const processBeam = (beam: Beam) => {
    const nextTile = getNextTile(layout, beam);
    if (nextTile && nextTile.beamPassing ^ beam.direction) {
      nextTile.beamPassing |= beam.direction;
      beams.push({ position: nextTile.position, direction: beam.direction });
    }
  };

  while (beams.length > 0) {
    const beam = beams.pop() as Beam;
    const tileType = layout[beam.position[0]][beam.position[1]].type;

    if (tileType === '.') {
      processBeam(beam);
    }

    if (tileType === '/' || tileType === '\\') {
      processBeam(reflectBeam(beam, tileType));
    }

    if (tileType === '|' || tileType === '-') {
      for (const newBeam of maybeSplitBeam(beam, tileType)) {
        processBeam(newBeam);
      }
    }
  }
  return layout;
}

function countEnergized(layout: Tile[][]) {
  return layout.flat().filter(tile => tile.beamPassing !== 0).length;
}

function getNextTile(tiles: Tile[][], beam: Beam): Tile | undefined {
  const [i, j] = beam.position;
  switch (beam.direction) {
    case Direction.Right:
      return tiles[i]?.[j + 1];
    case Direction.Left:
      return tiles[i]?.[j - 1];
    case Direction.Up:
      return tiles[i - 1]?.[j];
    case Direction.Down:
      return tiles[i + 1]?.[j];
  }
  return undefined;
}

function reflectBeam(beam: Beam, mirror: '/' | '\\'): Beam {
  const newDirection = {
    [Direction.Right]: mirror === '/' ? Direction.Up : Direction.Down,
    [Direction.Left]: mirror === '/' ? Direction.Down : Direction.Up,
    [Direction.Up]: mirror === '/' ? Direction.Right : Direction.Left,
    [Direction.Down]: mirror === '/' ? Direction.Left : Direction.Right,
    [Direction.None]: Direction.None,
  }[beam.direction];

  return { ...beam, direction: newDirection };
}

function maybeSplitBeam(beam: Beam, splitter: '|' | '-') {
  if (isParallel(splitter, beam)) {
    return [beam];
  }

  if (splitter === '|') {
    return [
      { ...beam, direction: Direction.Up },
      { ...beam, direction: Direction.Down },
    ];
  }

  return [
    { ...beam, direction: Direction.Left },
    { ...beam, direction: Direction.Right },
  ];
}

function isParallel(splitter: string, beam: Beam) {
  return (
    (splitter === '-' && beam.direction & (Direction.Right | Direction.Left)) ||
    (splitter === '|' && beam.direction & (Direction.Up | Direction.Down))
  );
}

const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
const layout = parse(input);
const solvedLayout = solve(layout);
const result = countEnergized(solvedLayout);
console.log(result);
