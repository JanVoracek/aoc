type Row = {
  map: string;
  damagedGroupsSizes: number[];
};

function times<T>(input: T, count: number): T[] {
  return Array.from({ length: count }).map(() => input);
}

function parse(input: string): Row[] {
  return input
    .trim()
    .split(/\n/)
    .map(line => {
      const [map, runString] = line.split(' ');
      const damagedGroupsSizes = runString.split(',').map(r => parseInt(r));
      return {
        map: times(map, 5).join('?').replace(/^\.+/, '').replaceAll(/\.+/g, '.'),
        damagedGroupsSizes: times(damagedGroupsSizes, 5).flat(),
      };
    });
}

export function memoize<T extends unknown[], U>(fn: (...args: T) => U): (...args: T) => U {
  const memo: Record<string, U> = {};

  return (...args) => {
    const key = JSON.stringify(args);
    return memo[key] ?? (memo[key] = fn(...args));
  };
}

const findArrangements = memoize((map: string, damagedGroups: number[]): number => {
  // empty map && no damaged groups => 1 arrangement
  if (map.length === 0) {
    return damagedGroups.length === 0 ? 1 : 0;
  }

  // no damaged groups && damaged spring on the map => 0 arrangements
  if (damagedGroups.length === 0) {
    return map.includes('#') ? 0 : 1;
  }

  let result = 0;

  // (maybe) working spring => check the rest of the map
  if (map[0] === '.' || map[0] === '?') {
    result += findArrangements(map.slice(1), damagedGroups);
  }

  // (maybe) damaged spring => check whether the group fits
  if (map[0] === '#' || map[0] === '?') {
    const groupLength = damagedGroups[0];
    if (
      // map is long enough
      map.length >= groupLength &&
      // slice consists of only (maybe) damaged springs
      !map.slice(0, groupLength).includes('.') &&
      // spring after the group is not damaged (it would mean that the group should to be bigger)
      (groupLength === map.length || map[groupLength] !== '#')
    ) {
      // check the rest of the map
      result += findArrangements(map.slice(groupLength + 1), damagedGroups.slice(1));
    }
  }

  return result;
});

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
const rows = parse(input);
console.time('perf');
const result = sum(rows.map(row => findArrangements(row.map, row.damagedGroupsSizes)));
console.timeEnd('perf');
console.log(result);
