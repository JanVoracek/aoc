import { run } from '../shared/runtime.ts';
import { sum } from '../shared/math.ts';

export type ParseOutput = ReturnType<typeof parse>;

interface Machine {
  Ax: number;
  Ay: number;
  Bx: number;
  By: number;
  Px: number;
  Py: number;
}

export function parse(input: string): Machine[] {
  return input.trim().split('\n\n').map(machine => {
    const [aLine, bLine, pLine] = machine.split('\n');
    const [Ax, Ay] = aLine.match(/\d+/g)!.map(Number);
    const [Bx, By] = bLine.match(/\d+/g)!.map(Number);
    const [Px, Py] = pLine.match(/\d+/g)!.map(Number);
    return { Ax, Ay, Bx, By, Px, Py };
  });
}

export function solvePart1(input: ParseOutput) {
  return input.map(machine => solveMachine(machine)).reduce(sum);
}

export function solvePart2(input: ParseOutput) {
  const offset = 10000000000000;
  return input
    .map(machine => solveMachine({ ...machine, Px: machine.Px + offset, Py: machine.Py + offset }))
    .reduce(sum);
}

function solveMachine(machine: Machine): number | null {
  const { Ax, Ay, Bx, By, Px, Py } = machine;

  const det = Ax * By - Bx * Ay;

  // Cramer's rule
  const numeratorA = Px * By - Bx * Py;
  const numeratorB = Ax * Py - Px * Ay;

  if (numeratorA % det !== 0 || numeratorB % det !== 0) {
    return null; // Not an integer solution
  }

  const a = numeratorA / det;
  const b = numeratorB / det;

  const cost = 3 * a + b;
  return cost;
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
