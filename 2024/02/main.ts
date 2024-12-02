export const example = await Deno.readTextFile('example.txt');
export const input = await Deno.readTextFile('input.txt');

export type ParseOutput = ReturnType<typeof parse>;

export function parse(input: string) {
  const lines = input
    .trim()
    .split('\n')
    .map(line => line.split(' ').map(Number));
  return lines;
}

export function solvePart1(input: ParseOutput) {
  return input.filter(isSafe).length;
}

export function solvePart2(input: ParseOutput) {
  return input.filter(list => list.some((_, i) => isSafe(without(list, i)))).length;
}

function isSafe(report: number[]) {
  const { trend: globalTrend } = compare(report[0], report[1]);
  return report.slice(1).every((value, prevIndex) => {
    const { trend, diff } = compare(report[prevIndex], value);
    return diff >= 1 && diff <= 3 && trend === globalTrend;
  });
}

function without<T>(array: T[], index: number) {
  return array.filter((_, i) => i !== index);
}

function compare(a: number, b: number) {
  return { trend: Math.sign(b - a), diff: Math.abs(a - b) };
}

if (import.meta.main) {
  const inputType = Deno.args[0];
  const partNumber = Deno.args[1];

  const currentInput = inputType === 'example' ? example : input;
  const solveFunction = partNumber === '1' ? solvePart1 : solvePart2;

  const parsed = parse(currentInput);
  console.log(solveFunction(parsed));
}
