import Heap from 'heap-js';

type Direction = 'up' | 'down' | 'right' | 'left';
type Position = { x: number; y: number };
type Step = {
  position: Position;
  direction: Direction;
  heatLoss: number;
  stepsInDirection: number;
};

function getNextPositions({ x, y }: Position, direction: Direction): [Position, Direction][] {
  const axes = [
    ['up', 'down'],
    ['right', 'left'],
  ];
  return (
    [
      [{ x, y: y - 1 }, 'up'],
      [{ x, y: y + 1 }, 'down'],
      [{ x: x + 1, y }, 'right'],
      [{ x: x - 1, y }, 'left'],
    ] as [Position, Direction][]
  ).filter(([, direction]) => {
    const oppositeDirection = axes.find(axis => axis.includes(direction))!.filter(d => d !== direction)[0];
    return direction !== oppositeDirection;
  });
}

function cacheKey({ position, direction, stepsInDirection }: Step): string {
  return JSON.stringify([position, direction, stepsInDirection]);
}

function findOptimalRoute(input: string) {
  const map = input.split('\n').map(line => line.split('').map(Number));
  const start: Position = { x: 0, y: 0 };
  const end: Position = { x: map[0].length - 1, y: map.length - 1 };

  const startingStepRight: Step = {
    position: start,
    direction: 'right',
    heatLoss: 0,
    stepsInDirection: 0,
  };
  const startingStepDown: Step = {
    position: start,
    direction: 'down',
    heatLoss: 0,
    stepsInDirection: 0,
  };

  const queue = new Heap<Step>((stepA, stepB) => stepA.heatLoss - stepB.heatLoss);
  queue.push(startingStepRight);
  queue.push(startingStepDown);

  const visited = new Set<string>();

  while (queue.size() > 0) {
    const step = queue.pop()!;

    if (step.position.x === end.x && step.position.y === end.y) return step.heatLoss;

    const nextPositions = getNextPositions(step.position, step.direction)
      .filter(([_, direction]) => step.stepsInDirection <= 2 || direction !== step.direction)
      .filter(([{ x, y }]) => x >= 0 && y >= 0 && x <= end.x && y <= end.y);

    for (const [position, direction] of nextPositions) {
      const nextStep: Step = {
        position,
        direction,
        heatLoss: step.heatLoss + map[position.y][position.x],
        stepsInDirection: direction === step.direction ? step.stepsInDirection + 1 : 1,
      };

      const key = cacheKey(nextStep);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push(nextStep);
      }
    }
  }

  throw new Error('No route found');
}

const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
const result = findOptimalRoute(input);
console.log(result);
