const blocks = (await Bun.file('input.txt').text()).trim().split('\n\n');

type CoordinatesMapper = {
  inRange: (source: number) => boolean;
  getDestination: (source: number) => number;
};

function createCoordinatesMapper(
  sourceRangeStart: number,
  destinationRangeStart: number,
  rangeLength: number
): CoordinatesMapper {
  return {
    inRange: source => source >= sourceRangeStart && source <= sourceRangeStart + rangeLength,
    getDestination: source => destinationRangeStart + (source - sourceRangeStart),
  };
}

const defaultMapper: CoordinatesMapper = {
  inRange: () => true,
  getDestination: source => source,
};

type AgroMap = {
  [source: string]: {
    target: string;
    mappers: CoordinatesMapper[];
  };
};

function parseMap(blocks: string[]): AgroMap {
  return blocks
    .map(block => {
      const [header, ...coordinates] = block.split('\n');
      const [mapName] = header.split(' ');
      const [source, _to, destination] = mapName.split('-');

      const mappers = coordinates.map(coordinate => {
        const [destinationRangeStart, sourceRangeStart, rangeLength] = coordinate.split(' ').map(Number);
        return createCoordinatesMapper(sourceRangeStart, destinationRangeStart, rangeLength);
      });

      return { [source]: { target: destination, mappers: [...mappers, defaultMapper] } };
    })
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});
}

function placeSeed(seed: number, map: AgroMap) {
  let sourceType = 'seed';
  let nr = seed;
  do {
    nr = map[sourceType].mappers.find(mapper => mapper.inRange(nr))!.getDestination(nr);
    sourceType = map[sourceType].target;
  } while (sourceType !== 'location');
  return nr;
}

const [seedsLine, ...mapsBlocks] = blocks;
const seeds = seedsLine.replace('seeds: ', '').split(' ').map(Number);
const map = parseMap(mapsBlocks);
const result = Math.min(...seeds.map(seed => placeSeed(seed, map)));

console.log(result);
