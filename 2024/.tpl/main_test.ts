import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { example, input, parse, solvePart1, solvePart2 } from './main.ts';

describe.skip('parse', () => {
  it('parses example correctly', () => {
    const result = parse(example);
    expect(result).toBeDefined();
  });
});

describe.skip('part 1', () => {
  it('solves example correctly', () => {
    const result = solvePart1(parse(example));
    expect(result).toBeDefined();
  });

  it('solves input correctly', () => {
    const result = solvePart1(parse(input));
    expect(result).toBeDefined();
  });
});

describe.skip('part 2', () => {
  it('solves example correctly', () => {
    const result = solvePart2(parse(example));
    expect(result).toBeDefined();
  });

  it('solves input correctly', () => {
    const result = solvePart2(parse(input));
    expect(result).toBeDefined();
  });
});
