type Tile = '.' | '#' | '^' | '>' | 'v' | '<';
type TrailMap = Tile[][];
type Position = { row: number; col: number };

type Connection = {
  edgeA: Position;
  start: Position;
  distance: number;
  end: Position;
  edgeB: Position;
};

type Node = Map<string, number>;
type Graph = Map<string, Node>;

function parse(input: string): TrailMap {
  return input.split('\n').map(line => line.split('') as Tile[]);
}

function findLongestDistance(
  graph: Graph,
  nodeHash: string,
  targetHash: string,
  visited: Set<string>,
  distance: number
) {
  if (nodeHash === targetHash) {
    return distance + 1;
  }
  visited = visited.union(new Set([nodeHash]));

  let maxDistance = 0;
  for (const [adjacentNodeHash, delta] of graph.get(nodeHash)!) {
    if (visited.has(adjacentNodeHash)) {
      continue;
    }
    maxDistance = Math.max(
      maxDistance,
      findLongestDistance(graph, adjacentNodeHash, targetHash, visited, distance + delta)
    );
  }
  return maxDistance;
}

function buildGraph(map: TrailMap, target: Position): Graph {
  const queue: [Position, Position][] = [
    [
      { row: 0, col: 1 },
      { row: 1, col: 1 },
    ],
  ];
  const connections: Connection[] = [];
  const graph: Graph = new Map();

  const getNode = (key: string): Node => {
    if (!graph.has(key)) {
      graph.set(key, new Map());
    }
    return graph.get(key)!;
  };

  const setDistance = (from: Position, to: Position, distance: number): void => {
    for (const [a, b] of [
      [from, to],
      [to, from],
    ]) {
      const node = getNode(hash(a));
      const currentDistance = node.get(hash(b));
      if (currentDistance === undefined || currentDistance < distance) {
        node.set(hash(b), distance);
      }
    }
  };

  while (queue.length > 0) {
    const [startPos, nextPos] = queue.shift()!;
    if (connectionAlreadyExists(connections, startPos, nextPos)) {
      continue;
    }

    let currentPos = nextPos;
    let previousPos = startPos;
    let connectionLength = 1;
    let distance = 0;
    let nextPositions: Position[] = [];
    let targetFound = false;

    while (connectionLength === 1) {
      nextPositions = neighbors(currentPos).filter(
        pos => !(pos.row === previousPos.row && pos.col === previousPos.col) && map[pos.row][pos.col] !== '#'
      );
      connectionLength = nextPositions.length;
      if (connectionLength === 1) {
        previousPos = currentPos;
        currentPos = nextPositions[0];
      }
      distance++;
      targetFound = currentPos.row === target.row && currentPos.col === target.col;
      if (targetFound) break;
    }

    connections.push({
      edgeA: startPos,
      start: nextPos,
      end: previousPos,
      edgeB: currentPos,
      distance,
    });

    if (targetFound) break;

    if (connectionLength > 0) {
      for (const pos of nextPositions) {
        queue.push([currentPos, pos]);
      }
    }
  }

  for (const connection of connections) {
    setDistance(connection.edgeA, connection.edgeB, connection.distance);
  }

  return graph;
}

function connectionAlreadyExists(connections: Connection[], a: Position, b: Position) {
  return connections.some(
    connection =>
      (connection.edgeB.row === a.row &&
        connection.edgeB.col === a.col &&
        connection.end.row === b.row &&
        connection.end.col === b.col) ||
      (connection.edgeA.row === a.row &&
        connection.edgeA.col === a.col &&
        connection.start.row === b.row &&
        connection.start.col === b.col)
  );
}

function neighbors(pos: Position) {
  return [
    { row: pos.row - 1, col: pos.col },
    { row: pos.row, col: pos.col - 1 },
    { row: pos.row, col: pos.col + 1 },
    { row: pos.row + 1, col: pos.col },
  ];
}

function hash(pos: Position) {
  return `${pos.row}:${pos.col}`;
}

{
  const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
  const map = parse(input);
  const height = map.length - 1;
  const width = map[0].length - 1;

  const start = { row: 0, col: 1 };
  const target = { row: height, col: width - 1 };
  const graph = buildGraph(map, target);

  const distance = findLongestDistance(graph, hash(start), hash(target), new Set(), 0);
  console.log(distance);
}
