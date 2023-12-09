const extrapolate = (values: number[]): number => {
  if (values.every(v => v === 0)) return 0;

  const deltas = values.map((num, i) => num - values[i - 1]).slice(1);
  return values[values.length - 1] + extrapolate(deltas);
};

function solve(input: string) {
  return input
    .trim()
    .split('\n')
    .map(line => line.split(' ').map(Number))
    .map(extrapolate)
    .reduce((acc, cur) => acc + cur, 0);
}

const input = (await Bun.file('input.txt').text()).trim();
const result = solve(input);
console.log(result);

