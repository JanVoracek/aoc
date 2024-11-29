import 'core-js/proposals/collection-methods';
import type { Tagged } from 'type-fest';

type Component = Tagged<string, 'Component'>;
type Wire = Tagged<`${Component}/${Component}`, 'Wire'>;
type Wiring = Map<Component, Set<Component>>;
type Path = {
  component: Component;
  wires: Set<Wire>;
};

function parse(input: string): Wiring {
  const components = input
    .split('\n')
    .map(x => x.match(/^(\w+): (.+)$/)!.slice(1))
    .map(([name, rawConnections]) => [name, rawConnections.split(' ')] as [Component, Component[]]);

  const emptySet = () => new Set<Component>();
  const wiring: Wiring = new Map();
  for (const [source, destinations] of components) {
    for (const dest of destinations) {
      wiring.update(source, conn => conn.add(dest), emptySet);
      wiring.update(dest, conn => conn.add(source), emptySet);
    }
  }
  return wiring;
}

function findGroups(wiring: Wiring): [Wiring, Wiring] {
  const wires = findWiresToDisconnect(wiring);
  const componentInFirstGroup = wires.values().take(1).toArray()[0].split('/')[0] as Component;
  const allIgnoredWires = new Set(wires).union(flipAll(wires));
  return splitWirings(wiring, componentInFirstGroup, allIgnoredWires);
}

function findWiresToDisconnect(wiring: Wiring): [Wire, Wire, Wire] {
  const [sourceName, ...targets] = wiring.keys();

  for (const targetName of targets) {
    const curPath = findPathAvoidingWires(wiring, sourceName, targetName, new Set());
    const phase1 = curPath ? curPath.wires.union(flipAll(curPath.wires)) : new Set<Wire>();

    const nextPath = findPathAvoidingWires(wiring, sourceName, targetName, phase1);
    let phase2 = nextPath
      ? phase1.union(nextPath.wires).union(flipAll(nextPath.wires))
      : phase1;

    const evenNextPath = findPathAvoidingWires(wiring, sourceName, targetName, phase2);
    let phase3 = evenNextPath
      ? phase2.union(evenNextPath.wires).union(flipAll(evenNextPath.wires))
      : phase2;

    const noPath = findPathAvoidingWires(wiring, sourceName, targetName, phase3);
    if (noPath) continue;

    for (const disconnected1 of curPath!.wires) {
      for (const disconnected2 of nextPath!.wires) {
        for (const disconnected3 of evenNextPath!.wires) {
          const finalPath = findPathAvoidingWires(
            wiring,
            sourceName,
            targetName,
            new Set([disconnected1, disconnected2, disconnected3, flip(disconnected1), flip(disconnected2), flip(disconnected3)])
          );
          if (!finalPath) {
            return [disconnected1, disconnected2, disconnected3];
          }
        }
      }
    }
  }
  throw new Error('No solution found');
}

function findPathAvoidingWires(wiring: Wiring, source: Component, target: Component, avoidedWires: Set<Wire>): Path | null {
  const paths = new Set<Path>([{ component: source, wires: new Set() }]);
  const visited = new Set<Component>();
  for (const path of paths) {
    if (path.component === target) {
      return path;
    }

    if (visited.has(path.component)) continue;
    visited.add(path.component);

    const destinations = wiring.get(path.component)!;
    for (const destination of destinations) {
      if (visited.has(destination)) continue;
      const wire = `${path.component}/${destination}` as Wire;
      if (avoidedWires.has(wire)) {
        continue;
      }
      paths.add({
        component: destination,
        wires: path.wires.union(new Set([wire])),
      });
    }
  }
  return null;
}

function splitWirings(wiring: Wiring, sourceComponent: Component, ignored: Set<Wire>): [Wiring, Wiring] {
  const group1: Wiring = new Map();
  const group2: Wiring = new Map();
  const visited = new Set<Component>();
  const queue = [sourceComponent];

  while (queue.length > 0) {
    const component = queue.shift()!;
    if (visited.has(component)) continue;
    visited.add(component);
    group1.set(component, wiring.get(component)!.difference(ignored));

    const destinations = wiring.get(component)!;
    for (const destination of destinations) {
      const wire = `${component}/${destination}` as Wire;
      if (!ignored.has(wire) && !visited.has(destination)) {
        queue.push(destination);
      }
    }
  }

  for (const component of wiring.keys()) {
    if (!visited.has(component)) {
      group2.set(component, wiring.get(component)!.difference(ignored));
    }
  }

  return [group1, group2];
}

function flip(pair: Wire): Wire {
  const toFlip = pair.split('/');
  return `${toFlip[1]}/${toFlip[0]}` as Wire;
}

function flipAll(it: Iterable<Wire>): Set<Wire> {
  return new Set(Array.from(it).map(flip));
}

{
  const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
  const wiring = parse(input);
  const [group1, group2] = findGroups(wiring);
  console.log(group1.size * group2.size);
}
