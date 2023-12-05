const reverse = (str: string) => [...str].reverse().join('');

const letterNumbers = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
};

const lines = (await Bun.file('input.txt').text()).trim().split('\n');

const letterNumbersPattern = Object.keys(letterNumbers).join('|');
const firstLetterPattern = new RegExp(`(\\d|${letterNumbersPattern})`);
const lastLetterPattern = new RegExp(`(\\d|${reverse(letterNumbersPattern)})`);

const firstNumbers = lines.map(line => line.match(firstLetterPattern)?.[0]).map(nr => letterNumbers[nr!] ?? nr);
const lastNumbers = lines
  .map(line => [...line].reverse().join('').match(lastLetterPattern)?.[0])
  .map(nr => letterNumbers[reverse(nr!)] ?? nr);

const numbers = firstNumbers.map((nr, i) => Number((nr || lastNumbers[i]) + (lastNumbers[i] || nr)));

const result = numbers.reduce((acc, cur) => acc + cur, 0);
console.log(result);
