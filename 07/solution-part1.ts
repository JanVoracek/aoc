type Hand = {
  deck: Deck;
  bid: number;
};

type Deck = string & { length: 5 };

type Type = keyof typeof types;
const types = {
  FIVE_OF_A_KIND: 7,
  FOUR_OF_A_KIND: 6,
  FULL_HOUSE: 5,
  THREE_OF_A_KIND: 4,
  TWO_PAIRS: 3,
  ONE_PAIR: 2,
  HIGH_CARD: 1,
};

// Mapping     ABCDEFGHIJKLM
const cards = '23456789TJQKA'.split('');
// Mapping allows comparing decks as strings, e.g. 'A2345' (MABCD) > 'KQJT9' (LKJIH)
const cardMapping = Object.fromEntries(cards.map((card, i) => [card, String.fromCharCode(65 + i)]));
const mapped = (deck: Deck) => deck.replaceAll(/./g, c => cardMapping[c]);

function parseHands(input: string): Hand[] {
  return input.split('\n').map(line => {
    const [deck, bid] = line.split(' ');
    return { deck: deck as Deck, bid: Number(bid) };
  });
}

function compareDecks(a: Deck, b: Deck) {
  const typeA = getType(a);
  const typeB = getType(b);
  if (types[typeB] > types[typeA]) return 1;
  if (types[typeB] < types[typeA]) return -1;
  if (mapped(b) > mapped(a)) return 1;
  if (mapped(b) < mapped(a)) return -1;
  return 0;
}

function getType(deck: Deck): Type {
  const cards = deck
    .trim()
    .split('')
    .reduce((acc, cur) => ({ ...acc, [cur]: (acc[cur] ?? 0) + 1 }), {} as Record<string, number>);

  const groups = Object.values(cards).toSorted((a, b) => b - a);

  if (groups[0] === 5) return 'FIVE_OF_A_KIND';
  if (groups[0] === 4) return 'FOUR_OF_A_KIND';
  if (groups[0] === 3 && groups[1] === 2) return 'FULL_HOUSE';
  if (groups[0] === 3) return 'THREE_OF_A_KIND';
  if (groups[0] === 2 && groups[1] === 2) return 'TWO_PAIRS';
  if (groups[0] === 2) return 'ONE_PAIR';
  return 'HIGH_CARD';
}

const input = (await Bun.file('input.txt').text()).trim();
const result = parseHands(input)
  .toSorted((a, b) => compareDecks(a.deck, b.deck))
  .toReversed()
  .reduce((acc, cur, i) => acc + cur.bid * (i + 1), 0);

console.log(result);
