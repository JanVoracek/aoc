type Position = { x: number; y: number };
type Vector = { dx: number; dy: number };

type Hailstone = { position: Position; velocity: Vector };
type Range = [min: number, max: number];

function parse(input: string): Hailstone[] {
  return input.split('\n').map(line => {
    const [positions, velocities] = line.split('@');
    const [x, y] = positions.split(',').map(Number);
    const [dx, dy] = velocities.split(',').map(Number);

    return { position: { x, y }, velocity: { dx, dy } };
  });
}

function getIntersections(hailstones: Hailstone[], area: Range = [2e14, 4e14]) {
  let intersections = 0;

  for (const [index, a] of hailstones.entries()) {
    const angleA = Math.atan2(a.velocity.dy, a.velocity.dx);
    for (const b of hailstones.slice(0, index)) {
      const angleB = Math.atan2(b.velocity.dy, b.velocity.dx);

      if (angleA === angleB) continue;

      const intersectionX =
        (a.position.y - b.position.y + Math.tan(angleB) * b.position.x - Math.tan(angleA) * a.position.x) /
        (Math.tan(angleB) - Math.tan(angleA));
      const intersectionY = Math.tan(angleA) * (intersectionX - a.position.x) + a.position.y;

      const timeA = (intersectionX - a.position.x) / a.velocity.dx;
      const timeB = (intersectionX - b.position.x) / b.velocity.dx;

      if (timeA > 0 && timeB > 0 && inArea(intersectionX, intersectionY, area)) {
        intersections++;
      }
    }
  }

  return intersections;
}

function inArea(x: number, y: number, area: Range) {
  return x >= area[0] && x <= area[1] && y >= area[0] && y <= area[1];
}

{
  const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
  const hailstones = parse(input);

  const intersections = getIntersections(hailstones);
  console.log(intersections);
}
