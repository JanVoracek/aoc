function parseCard(line: string) {
  const [number, rest] = line
    .replaceAll(/ +/g, ' ')
    .replace(/^Card +/, '')
    .split(':');

  const [winningPart, guessPart] = rest.split(' | ').map(part => part.trim());

  const winning = winningPart.split(' ').map(nr => Number(nr));
  const guess = guessPart.split(' ').map(nr => Number(nr));
  const matches = guess.filter(nr => winning.includes(nr));

  return {
    number,
    winning,
    guess,
    matches,
  };
}

const lines = (await Bun.file('input.txt').text()).trim().split('\n');

const result = lines
  .map(line => parseCard(line))
  .map(({ matches }) => (matches.length > 0 ? Math.pow(2, matches.length - 1) : 0))
  .reduce((acc, cur) => acc + cur, 0);
console.log(result);
