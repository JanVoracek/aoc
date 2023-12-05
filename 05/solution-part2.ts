type AlmanacMap = {
  [sourceName: string]: {
    destinationName: string;
    groups: Group[];
  };
};

type Group = {
  sourceRange: Range;
  destinationStart: number;
};

class Range {
  constructor(public from: number, public to: number) {}
  overlaps(range: Range) {
    return this.from <= range.to && this.to >= range.from;
  }
}

// https://stackoverflow.com/a/52490977/1243495
type Tuple<T, N extends number> = N extends N ? (number extends N ? T[] : _TupleOf<T, N, []>) : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;

function toChunks<T extends number>(input: number[], size: T): Tuple<number, T>[] {
  return Array.from(
    { length: Math.ceil(input.length / size) },
    (_, i) => input.slice(i * size, i * size + size) as Tuple<number, T>
  );
}

function parseAlmanacMap(blocks: string[]): AlmanacMap {
  return Object.fromEntries(
    blocks.map(block => {
      const [header, ...coordinates] = block.split('\n');
      const [mapName] = header.split(' ');
      const [sourceName, _to, destinationName] = mapName.split('-');

      const groups = coordinates
        .map(line => {
          const [destinationStart, sourceStart, rangeLength] = line.split(' ').map(Number);
          return { sourceRange: new Range(sourceStart, sourceStart + rangeLength), destinationStart };
        })
        .toSorted((groupA, groupB) => groupA.sourceRange.from - groupB.sourceRange.from);

      groups.unshift({ sourceRange: new Range(0, groups[0].sourceRange.from - 1), destinationStart: 0 });
      groups.push({
        sourceRange: new Range(groups[groups.length - 1].sourceRange.to + 1, Infinity),
        destinationStart: groups[groups.length - 1].sourceRange.to + 1,
      });

      return [sourceName, { destinationName, groups }];
    })
  );
}

function placeSeeds(seeds: Range[], map: AlmanacMap): Range[] {
  let sourceType = 'seed';
  let ranges = seeds;
  do {
    const destination = map[sourceType];
    ranges = projectRanges(ranges, destination);

    sourceType = destination.destinationName;
  } while (sourceType !== 'location');

  return ranges;
}

function projectRanges(ranges: Range[], destination: AlmanacMap[string]): Range[] {
  return ranges.flatMap(range =>
    destination.groups
      .filter(group => group.sourceRange.overlaps(range))
      .map(group => {
        const mappedStart = Math.max(range.from, group.sourceRange.from);
        const offset = mappedStart - group.sourceRange.from;
        const mappedRangeLength = Math.min(range.to, group.sourceRange.to) - mappedStart;

        return new Range(group.destinationStart + offset, group.destinationStart + offset + mappedRangeLength);
      })
  );
}

const [seeds, ...mapsBlocks] = (await Bun.file('example.txt').text()).trim().split('\n\n');

const parsedSeeds = seeds.replace('seeds: ', '').split(' ').map(Number);
const seedRanges = toChunks(parsedSeeds, 2).map(chunk => new Range(chunk[0], chunk[0] + chunk[1]));

const almanacMap = parseAlmanacMap(mapsBlocks);
const locations = placeSeeds(seedRanges, almanacMap);

const solution = Math.min(...locations.map(range => range.from));
console.log(solution);
