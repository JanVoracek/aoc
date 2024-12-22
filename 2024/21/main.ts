import { memoize, run } from '../shared/runtime.ts';
import { arrowMovements, numericMovements } from './keypads.ts';

export type ParseOutput = ReturnType<typeof parse>;

type NumericButton = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A';
type ArrowButton = '^' | 'v' | '<' | '>' | 'A';

export function parse(input: string) {
  const lines = input.trim().split('\n');

  return lines;
}

export function solvePart1(input: ParseOutput) {
  return solveWithRobots(input, 2);
}

export function solvePart2(input: ParseOutput) {
  return solveWithRobots(input, 25);
}

function solveWithRobots(commands: string[], numRobots: number): number {
  return commands.reduce((total, command) => {
    const numericPart = Number(command.split('A')[0]);
    const arrowsCommands = processNumberCommand(command);
    const shortLength = Math.min(...arrowsCommands.map(arrowCommand => findShortestSequence(arrowCommand, numRobots)));
    return total + shortLength * numericPart;
  }, 0);
}

const findShortestSequence = memoize((command: string, robots: number, keypadNr = 0): number => {
  if (keypadNr === robots) {
    return command.length;
  }

  const nextCommand = processArrowCommand(command);
  const commandParts = nextCommand
    .split('A')
    .slice(0, -1)
    .map(c => c + 'A');

  return commandParts.reduce(
    (shortest, command) => shortest + findShortestSequence(command, robots, keypadNr + 1),
    0
  );
});

function processArrowCommand(command: string): string {
  let current: ArrowButton = 'A';
  let output = '';

  for (const button of command) {
    const actions = arrowMovements[current][button as ArrowButton][0];
    output += actions;
    current = button as ArrowButton;
  }
  return output;
}

function processNumberCommand(command: string): string[] {
  let current: NumericButton = 'A';
  let outputs = [''];

  for (const button of command) {
    const actions = numericMovements[current][button as NumericButton];
    const newOutputs = [];

    for (const output of outputs) {
      for (const action of actions) {
        newOutputs.push(output + action);
      }
    }

    outputs = newOutputs;
    current = button as NumericButton;
  }
  return outputs;
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
