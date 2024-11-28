const numbers = (await Bun.file('input.txt').text())
  .trim()
  .split('\n')
  .map(line => [...line.matchAll(/(\d)/g)])
  .map(reg => reg.flatMap(x => x[0]).join(''))
  .map(nr => Number(nr.at(0)! + nr.at(-1)));

const result = numbers.reduce((acc, cur) => acc + cur, 0);

console.log(result);
