function solve(input: string, cycles: number): number {
  const lines = input.split('\n');

  const previousStates: Record<string, number> = {};

  let finalRows = rotateLeft(lines);
  for (let i = 0; i < cycles; i++) {
    const key = JSON.stringify(finalRows);
    if (previousStates[key]) {
      const cycleLength = i - previousStates[key];
      const cycleOffset = previousStates[key];
      const cycleIndex = (cycles - cycleOffset) % cycleLength;
      i = cycles - cycleIndex;
    } else {
      previousStates[key] = i;
    }

    finalRows = tilt(finalRows);
    finalRows = tilt(rotateRight(finalRows));
    finalRows = tilt(rotateRight(finalRows));
    finalRows = tilt(rotateRight(finalRows));
    finalRows = rotateRight(finalRows);
  }

  return sum(finalRows.map(row => calculateLoad(row)));
}

function sum(input: number[]): number {
  return input.reduce((a, b) => a + b, 0);
}

function tilt(matrix: string[]): string[] {
  return matrix.map(tiltRow);
}

function tiltRow(row: string) {
  let newRow = row.split('').map(_ => '.');
  let lastRockIndex = 0;

  for (let i = 0; i < row.length; i++) {
    if (row[i] === '#') {
      newRow[i] = '#';
      lastRockIndex = i + 1;
      continue;
    }
    if (row[i] === 'O') {
      newRow[lastRockIndex] = 'O';
      lastRockIndex += 1;
    }
  }

  return newRow.join('');
}

function calculateLoad(row: string): number {
  return sum([...row.matchAll(/O/g)].map(m => row.length - m.index!));
}

function rotateRight(matrix: string[]): string[] {
  return matrix[0].split('').map((_, i) => column(matrix, i).split('').reverse().join(''));
}

function rotateLeft(matrix: string[]): string[] {
  return matrix[0].split('').map((_, i) => column(matrix, matrix.length - i - 1));
}

function column(matrix: string[], index: number): string {
  return matrix.map(row => row[index]).join('');
}

const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
const result = solve(input, 1000000000);
console.log(result);
