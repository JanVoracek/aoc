function analyzePattern(pattern: string) {
  const lines = pattern.split('\n');

  const horizontalReflection = findReflection(lines);
  if (horizontalReflection !== undefined) {
    return 100 * (horizontalReflection + 1);
  }

  const columns = rotate(lines);
  const verticalReflection = findReflection(columns);
  if (verticalReflection !== undefined) {
    return verticalReflection + 1;
  }

  throw new Error('No reflection found');
}

function findReflection(lines: string[]): number | undefined {
  const possibleReflections = lines.reduce(
    (acc, row, i) => (maybeReflection(row, lines[i + 1]) ? [...acc, i] : acc),
    [] as number[]
  );

  const reflections = possibleReflections.filter(row => {
    const lastIndex = lines.length - 1;
    const d = Math.min(row, lastIndex - (row + 1));
    let isReflection = true;
    let smudgeFixed = false;
    for (let i = 0; i <= d; i++) {
      if (lines[row - i] === lines[row + 1 + i]) {
        continue;
      }

      if (smudgeFixed) {
        return false;
      }

      const chars = lines[row - i].split('');
      const mirrorChars = lines[row + 1 + i].split('');
      for (let c = 0; c < chars.length; c++) {
        if (chars[c] !== mirrorChars[c]) {
          chars[c] = mirrorChars[c];
          smudgeFixed = true;
          if (chars.join('') !== mirrorChars.join('')) {
            return false;
          } else {
            break;
          }
        }
      }
    }
    return isReflection && smudgeFixed;
  });

  if (reflections.length > 1) {
    throw new Error('More than one reflection found');
  }

  return reflections[0];
}

function maybeReflection(a: string, b: string | undefined) {
  if (a === b) {
    return true;
  }
  if (b === undefined) {
    return false;
  }

  let smudge = false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      if (smudge) {
        return false;
      }
      smudge = true;
    }
  }
  return true;
}

function column(matrix: string[], index: number): string {
  return matrix.map(row => row[index]).join('');
}

function rotate(matrix: string[]): string[] {
  return matrix[0].split('').map((_, i) => column(matrix, i));
}

function sum(input: number[]): number {
  return input.reduce((a, b) => a + b, 0);
}

const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
const patterns = input.split('\n\n');
const result = sum(patterns.map(analyzePattern));
console.log(result);
