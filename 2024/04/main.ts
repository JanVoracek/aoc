import { run } from '../shared/runtime.ts';

export type ParseOutput = ReturnType<typeof parse>;

export function parse(input: string) {
  return input
    .trim()
    .split('\n')
    .map(line => line.split(''));
}

export function solvePart1(input: ParseOutput) {
  type Pattern = { dr: number; dc: number; pattern: string };

  const patterns = [
    { dr: 0, dc: 1, pattern: 'XMAS' }, // left-right
    { dr: 1, dc: 0, pattern: 'XMAS' }, // top-down
    { dr: 1, dc: 1, pattern: 'XMAS' }, // top-left to bottom-right
    { dr: -1, dc: 1, pattern: 'XMAS' }, // bottom-left to top-right

    { dr: 0, dc: 1, pattern: 'SAMX' }, // right-left
    { dr: 1, dc: 0, pattern: 'SAMX' }, // bottom-up
    { dr: 1, dc: 1, pattern: 'SAMX' }, // top-right to bottom-left
    { dr: -1, dc: 1, pattern: 'SAMX' }, // top-left to bottom-right
  ] as Pattern[];

  const checkPattern = (r: number, c: number, p: Pattern) => {
    return [...p.pattern].every(
      (char, i) => inBounds(r + i * p.dr, c + i * p.dc, input) && input[r + i * p.dr][c + i * p.dc] === char
    );
  };

  return countPatterns(input, patterns, checkPattern);
}

export function solvePart2(input: ParseOutput) {
  type Char = null | 'M' | 'A' | 'S';
  type Pattern = Char[][];

  const _ = null;
  const M = 'M';
  const A = 'A';
  const S = 'S';

  const patterns = [
    [
      [M, _, M],
      [_, A, _],
      [S, _, S],
    ],
    [
      [M, _, S],
      [_, A, _],
      [M, _, S],
    ],
    [
      [S, _, M],
      [_, A, _],
      [S, _, M],
    ],
    [
      [S, _, S],
      [_, A, _],
      [M, _, M],
    ],
  ] as Pattern[];

  const matchesPattern = (char: string, patternChar: Char) => patternChar === _ || char === patternChar;
  const checkPattern = (r: number, c: number, pattern: Pattern) =>
    pattern.every((row, dr) =>
      row.every((char, dc) => inBounds(r + dr, c + dc, input) && matchesPattern(input[r + dr][c + dc], char))
    );

  return countPatterns(input, patterns, checkPattern);
}

function countPatterns<TPattern>(
  input: ParseOutput,
  patterns: TPattern[],
  checkPattern: (r: number, c: number, pattern: TPattern) => boolean
) {
  const rows = input.length;
  const columns = input[0].length;

  let count = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      for (const pattern of patterns) {
        if (checkPattern(r, c, pattern)) {
          count++;
        }
      }
    }
  }

  return count;
}

function inBounds(r: number, c: number, m: unknown[][]) {
  return r >= 0 && r < m.length && c >= 0 && c < m[0].length;
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
