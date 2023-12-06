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

function measure(label: string, fn: () => void) {
  Bun.gc(true);
  const startMemory = process.memoryUsage();
  console.time(label);
  fn();
  console.timeEnd(label);
  const endMemory = process.memoryUsage();
  console.log(`${label}: Memory usage (RSS): ${(endMemory.rss - startMemory.rss).toLocaleString()} bytes`);
  console.log(`${label}: Memory usage (heapTotal): ${(endMemory.heapTotal - startMemory.heapTotal).toLocaleString()} bytes`);
}

const input = (await Bun.file('input.txt').text()).replaceAll(/ +/g, '').trim();
const inputPair = input.split('\n').map(line => Number(line.split(':')[1]));

measure('numeric', () => {
  const waysToWin = countWaysToWinNumerically(inputPair[0], inputPair[1]);
  console.log(waysToWin);
});

measure('analytical', () => {
  const waysToWin = countWaysToWinAnalytically(inputPair[0], inputPair[1]);
  console.log(waysToWin);
});
