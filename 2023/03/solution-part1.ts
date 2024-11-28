type Part = {
  line: number;
  start: number;
  end: number;
  value: number;
};

type SymbolPosition = {
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

const potentialParts: Part[] = [];
const symbols: SymbolPosition[] = [];

const lines = (await Bun.file('input.txt').text()).split('\n');
for (const [i, line] of lines.entries()) {
  symbols.push(...findSymbols(line, i));
  potentialParts.push(...findParts(line, i));
}

const isAdjacent = (part: Part, symbol: SymbolPosition) =>
  symbol.line <= part.line + 1 &&
  symbol.line >= part.line - 1 &&
  symbol.index >= part.start - 1 &&
  symbol.index <= part.end + 1;

const parts = potentialParts.filter(part => symbols.some(symbol => isAdjacent(part, symbol)));
const result = parts.reduce((acc, part) => part.value + acc, 0);
console.log(result);
