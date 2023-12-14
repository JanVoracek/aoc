function solve(input: string): number {
  const lines = input.split('\n');

  return sum(columns(lines).map(column => solveColumn(column)));
}

function sum(input: number[]): number {
  return input.reduce((a, b) => a + b, 0);
}

function solveColumn(column: string) {
  let lastRockIndex = 0;
  let load = 0;
  for (let i = 0; i < column.length; i++) {
    if (column[i] === '#') {
      lastRockIndex = i + 1;
      continue;
    }
    if (column[i] === 'O') {
      load += column.length - lastRockIndex;
      lastRockIndex += 1;
    }
  }
  return load;
}

function columns(matrix: string[]): string[] {
  return matrix[0].split('').map((_, i) => column(matrix, i));
}

function column(matrix: string[], index: number): string {
  return matrix.map(row => row[index]).join('');
}

const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
const result = solve(input);
console.log(result);
