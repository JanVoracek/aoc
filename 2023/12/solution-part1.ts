type Row = {
  map: string;
  damagedGroupsSizes: number[];
};

function parse(input: string): Row[] {
  return input
    .trim()
    .split(/\n/)
    .map(line => {
      const [map, runString] = line.split(' ');
      const damagedGroupsSizes = runString.split(',').map(r => parseInt(r));
      return { map, damagedGroupsSizes };
    });
}

function findArrangements(rows: Row[]) {
  let count = 0;
  for (const row of rows) {
    const maybeDamagedIndexes = [...row.map.matchAll(/\?/g)].map(m => m.index);
    const combinations = generateCombinations(maybeDamagedIndexes.length);

    for (const combination of combinations) {
      let replacemntIndex = 0;
      const arrangement = row.map.replace(/\?/g, m => combination[replacemntIndex++]);
      const groupsSizes = [...arrangement.matchAll(/#+/g)].map(m => m[0].length);
      if (arraysEqual(groupsSizes, row.damagedGroupsSizes)) {
        count++;
      }
    }
  }

  return count;
}

function generateCombinations(length: number): string[][] {
  if (length === 1) {
    return [['.'], ['#']];
  } else {
    const smaller = generateCombinations(length - 1);
    return [...smaller.map(x => ['.', ...x]), ...smaller.map(x => ['#', ...x])];
  }
}

function arraysEqual(a: number[], b: number[]) {
  return JSON.stringify(a) === JSON.stringify(b);
}

const input = (await Bun.file(import.meta.dir + '/example.txt').text()).trim();
const result = findArrangements(parse(input));
console.log(result);
