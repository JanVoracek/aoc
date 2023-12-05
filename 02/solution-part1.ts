// FORMAT: Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
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
// FORMAT: 3 blue, 4 red
function parseColors(round: string): Record<'red' | 'green' | 'blue', number> {
  return round
    .split(',')
    .map(color => color.match(/(\d+) (blue|red|green)/))
    .reduce((acc, cur) => ({ ...acc, [cur![2]]: Number(cur![1]) }), {} as ReturnType<typeof parseColors>);
}

const max = {
  red: 12,
  green: 13,
  blue: 14,
};

const games = (await Bun.file('input.txt').text())
  .trim()
  .split('\n')
  .map(parseGame)
  .filter(game => game.maxes.red <= max.red && game.maxes.green <= max.green && game.maxes.blue <= max.blue)
  .reduce((acc, cur) => acc + cur.number, 0);

console.log(games);
