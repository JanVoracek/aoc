export const example = await Deno.readTextFile('example.txt');
export const input = await Deno.readTextFile('input.txt');

export type ParseOutput = ReturnType<typeof parse>;

export function parse(input: string) {
  const lines = input.split('\n');

  return lines;
}

export function solvePart1(input: ParseOutput) {

}

export function solvePart2(input: ParseOutput) {

}

if (import.meta.main) {
  const inputType = Deno.args[0];
  const partNumber = Deno.args[1];

  const currentInput = inputType === 'example' ? example : input;
  const solveFunction = partNumber === '1' ? solvePart1 : solvePart2;

  const parsed = parse(currentInput);
  console.log(solveFunction(parsed));
}
