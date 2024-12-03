import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { parse, solvePart1, solvePart2 } from './main.ts';
import { readExample, readInput } from '../shared/runtime.ts';

describe.skip('parse', () => {
  it('parses example correctly', async () => {
    const result = parse(await readExample());
    expect(result).toBeDefined();
  });
});

describe.skip('part 1', () => {
  it('solves example correctly', async () => {
    const result = solvePart1(parse(await readExample()));
    expect(result).toBeDefined();
  });

  it('solves input correctly', async () => {
    const result = solvePart1(parse(await readInput()));
    expect(result).toBeDefined();
  });
});

describe.skip('part 2', () => {
  it('solves example correctly', async () => {
    const result = solvePart2(parse(await readExample()));
    expect(result).toBeDefined();
  });

  it('solves input correctly', async () => {
    const result = solvePart2(parse(await readInput()));
    expect(result).toBeDefined();
  });
});
