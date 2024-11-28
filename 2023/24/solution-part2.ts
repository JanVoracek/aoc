import readline from 'node:readline';

type Position = { x: number; y: number; z: number };
type Vector = { dx: number; dy: number; dz: number };

type Hailstone = { position: Position; velocity: Vector };

function parse(input: string): Hailstone[] {
  return input.split('\n').map(line => {
    const [positions, velocities] = line.split('@');
    const [x, y, z] = positions.split(',').map(Number);
    const [dx, dy, dz] = velocities.split(',').map(Number);

    return { position: { x, y, z }, velocity: { dx, dy, dz } };
  });
}
function formatEquation({ position: { x, y, z }, velocity: { dx, dy, dz } }: Hailstone): string {
  return `(x-${x})/(a-${dx})=(y-${y})/(b-${dy})=(z-${z})/(c-${dz})`.replaceAll('--', '+');
}

function generateEquations(hailstones: Hailstone[]): string[] {
  return hailstones.slice(0, 4).map(formatEquation);
}

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    return await new Promise(resolve => rl.question(question, resolve));
  } finally {
    rl.close();
  }
}

function calculateResult(input: string): Number {
  return input.matchAll(/[xyz] = (\d+)/g).toArray().map(match => Number(match[1])).reduce((a, b) => a + b);
}

{
  const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
  const hailstones = parse(input);

  const equations = generateEquations(hailstones);
  console.log('Insert the equations here: https://www.wolframalpha.com/calculators/system-equation-calculator');
  console.log(equations.join('\n'));

  const resultInput = await prompt('Plain Text Result: ');
  const result = calculateResult(resultInput);
  console.log(result);
}
