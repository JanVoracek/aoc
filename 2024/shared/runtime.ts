export async function run<T>(parse: (input: string) => T, part1: (input: T) => unknown, part2: (input: T) => unknown) {
  const inputType = Deno.args[0];
  const partNumber = Deno.args[1];

  const currentInput = inputType === 'example' ? await readExample() : await readInput();
  const solveFunction = partNumber === '1' ? part1 : part2;

  const parsed = parse(currentInput);
  console.log(solveFunction(parsed));
}

export async function readExample() {
  return await Deno.readTextFile('example.txt');
}

export async function readInput() {
  return await Deno.readTextFile('input.txt');
}
