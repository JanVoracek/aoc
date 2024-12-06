export async function run<T>(parse: (input: string) => T, part1: (input: T) => unknown, part2: (input: T) => unknown) {
  const inputType = Deno.args[0];
  const partNumber = Deno.args[1];

  const currentInput = inputType === 'example' ? await readExample() : await readInput();
  const solveFunction = partNumber === '1' ? part1 : part2;

  console.time('Execution time');
  const parsed = parse(currentInput);
  console.log(solveFunction(parsed));
  console.timeEnd('Execution time');
}

export async function readExample() {
  return await Deno.readTextFile('example.txt');
}

export async function readInput() {
  return await Deno.readTextFile('input.txt');
}

export function memoize<TArgs extends unknown[], TReturn>(fn: (...args: TArgs) => TReturn) {
  const cache = new Map<string, TReturn>();
  return (...args: TArgs) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
