// numeric solution
export function countWaysToWinNumerically(maxTime: number, minDistance: number) {
  return Array.from({ length: maxTime + 1 }, (_, i) => i).filter(i => i * (maxTime - i) > minDistance).length;
}

// analytical solution
export function countWaysToWinAnalytically(maxTime: number, minDistance: number) {
  // Solve the quadratic inequality `x * (maxTime - x) > minDistance`
  // This is equivalent to `x^2 - maxTime * x + minDistance < 0`
  const discriminant = maxTime * maxTime - 4 * minDistance;

  const sqrtDiscriminant = Math.sqrt(discriminant);
  const lowerBound = Math.ceil((maxTime - sqrtDiscriminant) / 2);
  const upperBound = Math.floor((maxTime + sqrtDiscriminant) / 2);

  // Count the integers in the interval [lowerBound, upperBound]
  return Math.max(0, upperBound - lowerBound + 1);
}

const input = (await Bun.file('input.txt').text()).replaceAll(/ +/g, ' ').trim();
const inputValues = input.split('\n').map(line => line.split(':')[1].trim().split(' ').map(Number));

const inputPairs = inputValues[0].map((_, i) => [inputValues[0][i], inputValues[1][i]]);

{
  console.time('numeric');
  const waysToWin = inputPairs.map(([maxTime, minDistance]) => countWaysToWinNumerically(maxTime, minDistance));
  const product = waysToWin.reduce((acc, cur) => acc * cur, 1);
  console.timeEnd('numeric');

  console.log(product);
}
{
  console.time('analytical');
  const waysToWin = inputPairs.map(([maxTime, minDistance]) => countWaysToWinAnalytically(maxTime, minDistance));
  const product = waysToWin.reduce((acc, cur) => acc * cur, 1);
  console.timeEnd('analytical');

  console.log(product);
}
