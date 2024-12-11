import { run } from '../shared/runtime.ts';
import { sum } from '../shared/math.ts';

export type ParseOutput = ReturnType<typeof parse>;

export function parse(input: string) {
  return input.trim().split(' ');
}

export function solvePart1(input: ParseOutput) {
  const blinks = 25;
  for (let i = 0; i < blinks; i++) {
    input = blinkSlow(input);
  }
  return input.length;
}

export function solvePart2(input: ParseOutput) {
  const blinks = 75;
  let stones = new Map<string, number>();
  for (const n of input) {
    stones.set(n, 1);
  }
  for (let i = 0; i < blinks; i++) {
    stones = blinkFast(stones);
  }
  return [...stones.values()].reduce(sum);
}

function blinkFast(stones: Map<string, number>): Map<string, number> {
  const newStones = new Map<string, number>();

  for (const [stone, count] of stones.entries()) {
    if (stone === '0') {
      newStones.set('1', (newStones.get('1') ?? 0) + count);
    } else {
      const digits = stone.toString();
      if (digits.length % 2 === 0) {
        const half = digits.length / 2;
        const left = digits.slice(0, half).replace(/^0+/, '') || '0';
        const right = digits.slice(half).replace(/^0+/, '') || '0';

        newStones.set(left, (newStones.get(left) ?? 0) + count);
        newStones.set(right, (newStones.get(right) ?? 0) + count);
      } else {
        const multiplied = Number(stone) * 2024 + '';
        newStones.set(multiplied, (newStones.get(multiplied) ?? 0) + count);
      }
    }
  }

  return newStones;
}

function blinkSlow(stones: string[]): string[] {
  const newStones: string[] = [];

  for (const stone of stones) {
    if (stone === '0') {
      newStones.push('1');
      continue;
    }

    const length = stone.length;

    if (length % 2 === 0) {
      const half = length / 2;
      const left = stone.slice(0, half).replace(/^0+/, '') || '0';
      const right = stone.slice(half).replace(/^0+/, '') || '0';

      newStones.push(left, right);
      continue;
    }

    newStones.push(Number(stone) * 2024 + '');
  }

  return newStones;
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
