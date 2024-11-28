function parseGame(input: string) {
  const [prefix, rest] = input.split(':');
  const number = Number(prefix.match(/\d+/)![0]);

  const rounds = rest.split(';').map(round => parseColors(round));

  const maxes = {
    red: Math.max(...rounds.map(round => round.red ?? 0)),
    green: Math.max(...rounds.map(round => round.green ?? 0)),
    blue: Math.max(...rounds.map(round => round.blue ?? 0)),
  };

  return { number, rounds, maxes };
}

function parseColors(round: string): Record<'red' | 'green' | 'blue', number> {
  return round
    .split(',')
    .map(color => color.match(/(\d+) (blue|red|green)/))
    .reduce((acc, cur) => ({ ...acc, [cur![2]]: Number(cur![1]) }), {} as ReturnType<typeof parseColors>);
}

const games = (await Bun.file('input.txt').text())
  .trim()
  .split('\n')
  .map(parseGame)
  .map(game => (game.maxes.red ?? 1) * (game.maxes.green ?? 1) * (game.maxes.blue ?? 1))
  .reduce((acc, cur) => acc + cur, 0);

console.log(games);
