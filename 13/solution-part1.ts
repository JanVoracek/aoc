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
  const possibleReflections = lines.reduce((acc, row, i) => (row === lines[i + 1] ? [...acc, i] : acc), [] as number[]);

  const reflections = possibleReflections.filter(row => {
    const lastIndex = lines.length - 1;
    const d = Math.min(row, lastIndex - (row + 1));
    let isReflection = true;
    for (let i = 0; i <= d; i++) {
      if (lines[row - i] !== lines[row + 1 + i]) {
        isReflection = false;
        break;
      }
    }
    return isReflection;
  });

  if (reflections.length > 1) {
    throw new Error('More than one reflection found');
  }

  return reflections[0];
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
