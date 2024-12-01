export const example = await Deno.readTextFile('example.txt');
export const input = await Deno.readTextFile('input.txt');

export type ParseOutput = ReturnType<typeof parse>;

export function parse(input: string) {
  return input
    .trim()
    .split('\n')
    .map(line => line.split(/\s+/).map(Number))
    .reduce(
      (acc, [c1, c2]) => [
        [...acc[0], c1],
        [...acc[1], c2],
      ],
      [[], []] as [number[], number[]]
    ) as [number[], number[]];
}

export function solvePart1(columns: ParseOutput) {
  const [left, right] = columns.map(column => column.sort((a, b) => a - b));
  return left.reduce((acc, val, i) => acc + Math.abs(right[i] - val), 0);
}

export function solvePart2([left, right]: ParseOutput) {
  const rightGroups = Object.groupBy(right, n => n);
  return left.reduce((acc, num) => acc + num * (rightGroups[num]?.length ?? 0), 0);
}

if (import.meta.main) {
  const inputType = Deno.args[0];
  const partNumber = Deno.args[1];

  const currentInput = inputType === 'example' ? example : input;
  const solveFunction = partNumber === '1' ? solvePart1 : solvePart2;

  const parsed = parse(currentInput);
  console.log(solveFunction(parsed));
}
