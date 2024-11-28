type Part = {
  line: number;
  start: number;
  end: number;
  value: number;
};

type Position = {
  line: number;
  index: number;
};

function findParts(line: string, lineNumber: number) {
  return Array.from(line.matchAll(/[0-9]+/g)).map(match => ({
    line: lineNumber,
    start: match.index!,
    end: match.index! + match[0].length - 1,
    value: parseInt(match[0]),
  }));
}

function findSymbols(line: string, lineNumber: number) {
  return Array.from(line.matchAll(/[^0-9|.]/g)).map(match => ({
    line: lineNumber,
    index: match.index!,
  }));
}

function findGears(line: string, lineNumber: number) {
  return Array.from(line.matchAll(/\*/g)).map(match => ({
    line: lineNumber,
    index: match.index!,
  }));
}

const isAdjacent = (part: Part, position: Position) =>
  position.line <= part.line + 1 &&
  position.line >= part.line - 1 &&
  position.index >= part.start - 1 &&
  position.index <= part.end + 1;

const potentialParts: Part[] = [];
const symbols: Position[] = [];
const potentialGears: Position[] = [];

const lines = (await Bun.file('input.txt').text()).split('\n');
for (const [i, line] of lines.entries()) {
  symbols.push(...findSymbols(line, i));
  potentialParts.push(...findParts(line, i));
  potentialGears.push(...findGears(line, i));
}

const parts = potentialParts.filter(part => symbols.some(symbol => isAdjacent(part, symbol)));
const gearRatios = potentialGears
  .map(gear => {
    const matchingParts = parts.filter(part => isAdjacent(part, gear));
    const isValid = matchingParts.length === 2;
    return isValid ? matchingParts.reduce((acc, part) => (acc === 0 ? part.value : acc * part.value), 0) : null;
  })
  .filter(Boolean);

const result = gearRatios.reduce((acc, ratio) => acc! + ratio!, 0);
console.log(result);
