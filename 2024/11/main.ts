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
  let stones = new Map<bigint, number>();
  for (const n of input) {
    stones.set(BigInt(n), 1);
  }

  for (let i = 0; i < blinks; i++) {
    stones = blinkFast(stones);
  }
  return [...stones.values()].reduce(sum);
}

function blinkFast(stones: Map<bigint, number>): Map<bigint, number> {
  const newStones = new Map<bigint, number>();

  for (const [stone, count] of stones.entries()) {
    if (stone === 0n) {
      newStones.set(1n, (newStones.get(1n) ?? 0) + count);
    } else {
      const digits = stone.toString();
      if (digits.length % 2 === 0) {
        const half = digits.length / 2;
        const left = BigInt(digits.slice(0, half));
        const right = BigInt(digits.slice(half));
        newStones.set(left, (newStones.get(left) ?? 0) + count);
        newStones.set(right, (newStones.get(right) ?? 0) + count);
      } else {
        const multiplied = stone * 2024n;
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
      let left = stone.slice(0, half);
      let right = stone.slice(half);

      left = left.replace(/^0+/, '') || '0';
      right = right.replace(/^0+/, '') || '0';

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
