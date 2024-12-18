import { run } from '../shared/runtime.ts';

export type ParseOutput = ReturnType<typeof parse>;

type Register = 'A' | 'B' | 'C';

type ProgramState = {
  registers: Record<Register, bigint>;
  counter: number;
  output: bigint[];
};

type Instruction = (state: ProgramState, arg: number) => boolean;

const processor = {
  opcodes: ['adv', 'bxl', 'bst', 'jnz', 'bxc', 'out', 'bdv', 'cdv'] as const,
  instructions: {
    adv: (state, arg) => {
      state.registers.A = state.registers.A >> getComboArg(state, arg);
      return false;
    },
    bxl: (state, arg) => {
      state.registers.B = state.registers.B ^ BigInt(arg);
      return false;
    },
    bst: (state, arg) => {
      state.registers.B = getComboArg(state, arg) & 7n;
      return false;
    },
    jnz: (state, arg) => {
      if (state.registers.A !== 0n) state.counter = Number(arg);
      return state.registers.A !== 0n;
    },
    bxc: state => {
      state.registers.B = state.registers.B ^ state.registers.C;
      return false;
    },
    out: (state, arg) => {
      state.output.push(getComboArg(state, arg) & 7n);
      return false;
    },
    bdv: (state, arg) => {
      state.registers.B = state.registers.A >> getComboArg(state, arg);
      return false;
    },
    cdv: (state, arg) => {
      state.registers.C = state.registers.A >> getComboArg(state, arg);
      return false;
    },
  } as Record<string, Instruction>,
  execute(opcode: number, state: ProgramState, arg: number) {
    return this.instructions[this.opcodes[opcode]](state, arg);
  },
};

const runProgram = (a: bigint, instructions: number[]) => {
  const programState: ProgramState = {
    registers: { A: a, B: 0n, C: 0n },
    counter: 0,
    output: [],
  };

  while (true) {
    const opcode = instructions[programState.counter];
    const arg = instructions[programState.counter + 1];
    const isJump = processor.execute(opcode, programState, arg);

    programState.counter += isJump ? 0 : 2;

    if (programState.counter < 0 || programState.counter >= instructions.length) break;
  }

  return programState;
};

export function parse(input: string) {
  const [registerPart, programPart] = input.split('\n\n');
  const registers = registerPart.split('\n').map(line => BigInt(line.split(': ')[1]));
  const instructions = programPart
    .split(': ')[1]
    .split(',')
    .map(num => Number(num));

  return { registers, instructions };
}

export function solvePart1({ registers, instructions }: ParseOutput) {
  return runProgram(registers[0], instructions).output.join(',');
}

export function solvePart2({ instructions }: ParseOutput) {
  const searchA = (value: bigint, current: number): bigint => {
    if (current < 0) return value;

    for (let i = 0n; i < 8n; i++) {
      const candidate = value * 8n + i;
      const { output } = runProgram(candidate, instructions);
      if (output[0] === BigInt(instructions[current])) {
        const finalVal = searchA(candidate, current - 1);
        if (finalVal !== -1n) return finalVal;
      }
    }

    return -1n;
  };

  return searchA(0n, instructions.length - 1);
}

function getComboArg(state: ProgramState, arg: number): bigint {
  return arg <= 3 ? BigInt(arg) : state.registers[(['A', 'B', 'C'] as const)[arg - 4]] ?? 0n;
}

if (import.meta.main) {
  run(parse, solvePart1, solvePart2);
}
