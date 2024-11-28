function solve(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash + input.charCodeAt(i)) * 17) % 256;
  }
  return hash;
}

function sum(input: number[]): number {
  return input.reduce((a, b) => a + b, 0);
}

const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
const result = sum(input.split(',').map(solve));
console.log(result);
