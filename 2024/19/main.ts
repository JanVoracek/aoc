import { run } from '../shared/runtime.ts';
import { sum } from '../shared/math.ts';

export type ParseOutput = ReturnType<typeof parse>;

export function parse(input: string) {
  const [patternsPart, designsPart] = input.trim().split('\n\n');
  const patterns = patternsPart.split(', ');
  const designs = designsPart.split('\n');
  return { patterns, designs };
}

export function solvePart1(input: ParseOutput) {
  return input.designs.filter(design => countWaysToFormDesign(design, input.patterns)).length;
}

export function solvePart2(input: ParseOutput) {
  return input.designs.map(design => countWaysToFormDesign(design, input.patterns)).reduce(sum);
}

function countWaysToFormDesign(design: string, patterns: string[]): number {
  const ways = Array(design.length + 1).fill(0);
  ways[0] = 1;

  for (let i = 0; i <= design.length; i++) {
    if (ways[i] === 0) continue;
    for (const pattern of patterns) {
      if (design.startsWith(pattern, i)) {
        ways[i + pattern.length] += ways[i];
      }
    }
  }

  return ways[design.length];
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
