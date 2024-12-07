import { run } from '../shared/runtime.ts';

export type ParseOutput = ReturnType<typeof parse>;

type Operation = (a: number, b: number) => number;
type Operations<T extends string> = Record<T, Operation>;

export function parse(input: string) {
  return input
    .trim()
    .split('\n')
    .map(line => {
      const [testValue, numbers] = line.split(': ');
      return {
        testValue: parseInt(testValue, 10),
        numbers: numbers.split(' ').map(Number),
      };
    });
}

export const solvePart1 = createSolver({
  '+': (a: number, b: number) => a + b,
  '*': (a: number, b: number) => a * b,
});

export const solvePart2 = createSolver({
  '+': (a: number, b: number) => a + b,
  '*': (a: number, b: number) => a * b,
  '||': (a: number, b: number) => Number(String(a) + String(b)),
});

function createSolver(operations: Operations<string>) {
  type Operator = keyof typeof operations;

  return (input: ParseOutput) => {
    const canMatchTestValue = (testValue: number, numbers: number[]): boolean => {
      const operators = Object.keys(operations) as Operator[];
      const n = numbers.length;

      const tryOperators = (index: number, ops: Operator[]): boolean => {
        if (index === n - 1) {
          return testValue === numbers.reduce((acc, num, i) => (i === 0 ? num : operations[ops[i - 1]](acc, num)), 0);
        }
        return operators.some(op => tryOperators(index + 1, [...ops, op])); // 😈
      };

      return tryOperators(0, []);
    };

    return input
      .filter(({ testValue, numbers }) => canMatchTestValue(testValue, numbers))
      .reduce((sum, { testValue }) => sum + testValue, 0);
  };
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
