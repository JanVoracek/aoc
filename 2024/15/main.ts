import { run } from '../shared/runtime.ts';

export type ParseOutput = ReturnType<typeof parse>;

type Move = '^' | 'v' | '<' | '>';

interface Position {
  r: number;
  c: number;
}

interface Direction {
  dr: number;
  dc: number;
}

const directions: Record<Move, Direction> = {
  '^': { dr: -1, dc: 0 },
  v: { dr: 1, dc: 0 },
  '<': { dr: 0, dc: -1 },
  '>': { dr: 0, dc: 1 },
};

type BoxMove = { box: Position; direction: Direction };

export function parse(input: string) {
  const [mapPart, movesPart] = input
    .trim()
    .split('\n\n')
    .map(part => part.split('\n'));
  return { map: mapPart.map(line => line.split('')), moves: movesPart.join('') };
}

export function solvePart1({ map, moves }: ParseOutput) {
  let { walls, boxes, robot } = analyzeMapPart1(map);

  function attemptMove(box: Position, direction: Direction): [boolean, BoxMove[]] {
    const nextPos = {
      r: box.r + direction.dr,
      c: box.c + direction.dc,
    };

    if (walls.has(`${nextPos.r},${nextPos.c}`)) {
      return [false, []];
    }

    const nextBox = boxes.find(box => box.r === nextPos.r && box.c === nextPos.c);
    if (!nextBox) return [true, []];

    const [canMove, subsequentBoxMoves] = attemptMove(nextBox, direction);
    if (!canMove) {
      return [false, []];
    }

    const isNewBoxMove = !subsequentBoxMoves.some(m => m.box.r === nextBox.r && m.box.c === nextBox.c);
    return isNewBoxMove ? [true, [{ box: nextBox, direction }].concat(subsequentBoxMoves)] : [true, subsequentBoxMoves];
  }

  for (const move of moves) {
    const direction = directions[move as Move];
    const nextPos = { r: robot.r + direction.dr, c: robot.c + direction.dc };

    if (walls.has(`${nextPos.r},${nextPos.c}`)) continue;

    const collidedBox = boxes.find(box => box.r === nextPos.r && box.c === nextPos.c);
    if (!collidedBox) {
      robot = nextPos;
      continue;
    }

    const [canMove, boxMoves] = attemptMove(collidedBox, direction);
    if (canMove) {
      boxMoves.forEach(m => {
        m.box.r += m.direction.dr;
        m.box.c += m.direction.dc;
      });
      collidedBox.r += direction.dr;
      collidedBox.c += direction.dc;
      robot = nextPos;
    }
  }

  return boxes.reduce((score, box) => score + box.r * 100 + box.c, 0);
}

export function solvePart2({ map, moves }: ParseOutput) {
  let { walls, boxes, robot } = analyzeMapPart2(map);

  function attemptMove(
    collidedBox: Position,
    direction: Direction,
    movements: { box: Position; direction: Direction }[]
  ): boolean {
    const next = [
      { r: collidedBox.r + direction.dr, c: collidedBox.c + direction.dc },
      { r: collidedBox.r + direction.dr, c: collidedBox.c + 1 + direction.dc },
    ];

    for (let i = 0; i < next.length; i++) {
      if (walls.has(`${next[i].c},${next[i].r}`)) {
        return false;
      }
    }

    const collidedBoxes = boxes.filter(box => {
      for (let i = 0; i < next.length; i++) {
        if (box.c === collidedBox.c && box.r === collidedBox.r) return false;
        if ((box.c === next[i].c || box.c + 1 === next[i].c) && box.r === next[i].r) return true;
      }
      return false;
    });

    if (collidedBoxes.length === 0) return true;

    let conflicts = false;
    for (const box of collidedBoxes) {
      if (attemptMove(box, direction, movements)) {
        if (movements.map(movement => movement.box).find(b => b.c === box.c && b.r === box.r) === undefined) {
          movements.push({
            box,
            direction,
          });
        }
      } else {
        conflicts = true;
        break;
      }
    }

    return !conflicts;
  }

  for (let i = 0; i < moves.length; i++) {
    const direction = directions[moves[i] as Move];
    const position = { c: robot.c + direction.dc, r: robot.r + direction.dr };

    if (!walls.has(`${position.c},${position.r}`)) {
      const collidedBox = boxes.find(box => (box.c === position.c || box.c + 1 === position.c) && box.r === position.r);

      if (collidedBox !== undefined) {
        const movements: { box: Position; direction: Direction }[] = [];
        if (attemptMove(collidedBox, direction, movements)) {
          for (const movement of movements) {
            movement.box.c += movement.direction.dc;
            movement.box.r += movement.direction.dr;
          }
          collidedBox.c += direction.dc;
          collidedBox.r += direction.dr;
          robot = position;
        }
      } else robot = position;
    }
  }

  return boxes.reduce((score, box) => score + box.r * 100 + box.c, 0);
}

function analyzeMapPart1(map: string[][]) {
  const walls = new Set<string>();
  const boxes: Position[] = [];
  let robot = { r: 0, c: 0 };
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[0].length; c++) {
      if (map[r][c] === '@') robot = { r, c };
      if (map[r][c] === '#') {
        walls.add(`${r},${c}`);
      }
      if (map[r][c] === 'O') boxes.push({ r, c });
    }
  }
  return { walls, boxes, robot };
}

function analyzeMapPart2(map: string[][]) {
  const walls = new Set<string>();
  const boxes: Position[] = [];
  let robot = { c: 0, r: 0 };
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[0].length; c++) {
      if (map[r][c] === '@') robot = { c: c * 2, r };
      if (map[r][c] === '#') {
        walls.add(`${c * 2},${r}`);
        walls.add(`${c * 2 + 1},${r}`);
      }
      if (map[r][c] === 'O') boxes.push({ c: c * 2, r });
    }
  }
  return { walls, boxes, robot };
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
