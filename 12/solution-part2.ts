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
  if (map.length === 0) {
    return damagedGroups.length === 0 ? 1 : 0;
  }

  if (damagedGroups.length === 0) {
    return map.includes('#') ? 0 : 1;
  }

  if (map.length < minimalLength(damagedGroups)) {
    return 0;
  }

  if (map[0] === '?') {
    return findArrangements('#' + map.slice(1), damagedGroups) + findArrangements(map.slice(1), damagedGroups);
  }

  if (map[0] === '.') {
    return findArrangements(map.slice(1), damagedGroups);
  }

  if (map[0] === '#') {
    const [group, ...leftoverGroups] = damagedGroups;
    if (map.slice(0, group).includes('.')) {
      return 0;
    }

    if (map[group] === '#') {
      return 0;
    }

    return findArrangements(map.slice(group + 1), leftoverGroups);
  }

  return 0; // this should never happen :D
});

function minimalLength(damagedGroups: number[]) {
  return sum(damagedGroups) + damagedGroups.length - 1;
}

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
const rows = parse(input);
console.time('perf');
const result = sum(rows.map(row => findArrangements(row.map, row.damagedGroupsSizes)));
console.timeEnd('perf');
console.log(result);

