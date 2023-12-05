type Card = {
  number: number;
  winning: number[];
  guess: number[];
  matches: number[];
};

function parseCard(line: string): Card {
  const [number, rest] = line
    .replaceAll(/ +/g, ' ')
    .replace(/^Card +/, '')
    .split(':');

  const [winningPart, guessPart] = rest.split(' | ').map(part => part.trim());

  const winning = winningPart.split(' ').map(nr => Number(nr));
  const guess = guessPart.split(' ').map(nr => Number(nr));
  const matches = guess.filter(nr => winning.includes(nr));

  return {
    number: Number(number),
    winning,
    guess,
    matches,
  };
}

const lines = (await Bun.file('input.txt').text()).trim().split('\n');

const cards = lines.map(parseCard);
const cardNumbers = new Set<number>(cards.map(card => card.number));
const instances = new Map<number, number>();

const addInstances = (cardNumber: number, addedValue: number) => {
  instances.set(cardNumber, (instances.get(cardNumber) ?? 0) + addedValue);
  return instances.get(cardNumber)!;
};

for (const card of cards) {
  const currentInstances = addInstances(card.number, 1);

  for (let i = 0; i < card.matches.length; i++) {
    const cardNumber = card.number + i + 1;
    if (cardNumbers.has(cardNumber)) {
      addInstances(cardNumber, currentInstances);
    }
  }
}

const result = [...instances.values()].reduce((acc, cur) => acc + cur, 0);
console.log(result);
