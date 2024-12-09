import { run } from '../shared/runtime.ts';

export type ParseOutput = ReturnType<typeof parse>;

type Block = number | '.';

export function parse(input: string): number[] {
  return [...input].map(Number);
}

export function solvePart1(input: ParseOutput) {
  const blocks: Block[] = [];
  let id = 0;

  input.forEach((length, i) => {
    const content = i % 2 === 0 ? id++ : '.';
    blocks.push(...Array(length > 0 ? length : 0).fill(content));
  });

  while (hasGap(blocks)) {
    const lastFile = findLastFilePosition(blocks);
    const firstGap = findFirstGap(blocks, lastFile);

    blocks[firstGap] = blocks[lastFile];
    blocks[lastFile] = '.';
  }

  return checksum(blocks);
}

type FileInfo = { id: number; start: number; length: number };

export function solvePart2(input: ParseOutput) {
  const blocks: Block[] = [];
  const fileInfo: FileInfo[] = [];
  let id = 0;

  input.forEach((length, i) => {
    const isFile = i % 2 === 0;
    if (isFile) {
      fileInfo.push({ id, start: blocks.length, length });
    }
    const content = isFile ? id++ : '.';
    blocks.push(...Array(length).fill(content));
  });

  for (const file of fileInfo.toReversed()) {
    const { start, length } = file;
    if (length === 0) continue;

    const freeSpaceStart = findFreeSpace(blocks, length, start);
    if (freeSpaceStart === null) {
      continue;
    }

    moveFile(blocks, file, freeSpaceStart);
  }

  return checksum(blocks);
}

function hasGap(blocks: Block[]): boolean {
  const lastFilePos = findLastFilePosition(blocks);
  for (let i = 0; i < lastFilePos; i++) {
    if (blocks[i] === '.') return true;
  }
  return false;
}

function findLastFilePosition(blocks: Block[]): number {
  return blocks.findLastIndex(block => block !== '.');
}

function findFirstGap(blocks: Block[], lastFilePos: number): number {
  return blocks.findIndex((block, index) => index < lastFilePos && block === '.');
}

function findFreeSpace(blocks: Block[], length: number, before: number): number | null {
  for (let i = 0; i <= before - length; i++) {
    let isFree = true;
    for (let j = 0; j < length; j++) {
      if (blocks[i + j] !== '.') {
        isFree = false;
        break;
      }
    }
    if (isFree) {
      return i;
    }
  }
  return null;
}

function moveFile(blocks: Block[], file: FileInfo, position: number) {
  const from = file.start;
  const to = position;
  const length = file.length;

  for (let i = 0; i < length; i++) {
    blocks[to + i] = blocks[from + i];
    blocks[from + i] = '.';
  }

  file.start = position;
}

function checksum(blocks: Block[]): number {
  return blocks.reduce((sum: number, block, i) => (block === '.' ? sum : sum + i * block), 0);
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
