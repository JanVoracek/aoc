type Lens = {
  label: string;
  focalLength: number;
};

function solve(input: string) {
  const steps = input
    .split(',')
    .map(s => s.match(/([a-z]+)([-=])(\d*)/)!.slice(1))
    .map(([label, operation, focalLength]) => ({ label, operation, focalLength: parseInt(focalLength) }));

  const boxes = placeLenses(steps);

  return sum(
    Object.entries(boxes).map(([box, lenses]) =>
      lenses.reduce((acc, lens, slot) => acc + (1 + Number(box)) * (slot + 1) * lens.focalLength, 0)
    )
  );
}

function placeLenses(steps: { label: string; operation: string; focalLength: number }[]) {
  const boxes: Record<number, Lens[]> = {};

  for (const { label, operation, focalLength } of steps) {
    const lensHash = hash(label);
    const box = (boxes[lensHash] = boxes[lensHash] ?? []);
    const existingLens = box.findIndex(lens => lens.label === label);

    if (operation === '=') {
      if (existingLens >= 0) {
        box[existingLens].focalLength = focalLength;
      } else {
        box.push({ label, focalLength });
      }
    }

    if (operation === '-') {
      if (existingLens >= 0) {
        box.splice(existingLens, 1);
      }
    }
  }
  return boxes;
}

function hash(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash + input.charCodeAt(i)) * 17) % 256;
  }
  return hash;
}

function sum(input: number[]): number {
  return input.reduce((a, b) => a + b, 0);
}

const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
const result = solve(input);
console.log(result);
