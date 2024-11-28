type SignalType = 'low' | 'high';
type Modules = Record<Module['name'], Module>;
type Module = {
  name: string;
  type: 'broadcast' | 'flip-flop' | 'conjunction';
  inputs: string[];
  outputs: string[];
  handleSignal(signalType: SignalType, input: string): [Module['name'], SignalType][];
};
type ConjuctionModule = Module & { memory: Record<string, SignalType> };

function createBroadcast(name: string, inputs: string[], outputs: string[]): Module {
  return {
    name,
    type: 'broadcast',
    inputs,
    outputs,
    handleSignal(signalType: SignalType) {
      return outputs.map(connection => [connection, signalType]);
    },
  };
}

function createFlipFlop(name: string, inputs: string[], outputs: string[]): Module {
  let on = false;
  return {
    name,
    type: 'flip-flop',
    inputs,
    outputs,
    handleSignal(signalType: SignalType) {
      if (signalType === 'high') {
        return [];
      }
      on = !on;
      return outputs.map(connection => [connection, on ? 'high' : 'low']);
    },
  };
}

function createConjunction(name: string, inputs: string[], outputs: string[]): ConjuctionModule {
  const memory: Record<string, SignalType> = Object.fromEntries(inputs.map(input => [input, 'low']));
  return {
    name,
    type: 'conjunction',
    inputs,
    outputs,
    handleSignal(signalType: SignalType, input: string) {
      memory[input] = signalType;
      const allHigh = inputs.every(input => memory[input] === 'high');
      return outputs.map(connection => [connection, allHigh ? 'low' : 'high']);
    },
    memory,
  };
}

function parse(input: string): Modules {
  const parsedLines = input.split('\n').map(line => {
    const [modulePart, connectionsPart] = line.split(' -> ');
    const outputs = connectionsPart.split(', ');
    const [name, type] =
      modulePart === 'broadcaster'
        ? ['broadcaster', 'broadcast']
        : [modulePart.slice(1), modulePart.startsWith('%') ? 'flip-flop' : 'conjunction'];
    return { name, type, outputs };
  });

  const findInputs = (name: string) =>
    parsedLines.filter(({ outputs }) => outputs.includes(name)).map(({ name }) => name);

  return Object.fromEntries(
    parsedLines.map(({ name, type, outputs }) => {
      switch (type) {
        case 'broadcast':
          return [name, createBroadcast(name, findInputs(name), outputs)];
        case 'flip-flop':
          return [name, createFlipFlop(name, findInputs(name), outputs)];
        case 'conjunction':
          return [name, createConjunction(name, findInputs(name), outputs)];
        default:
          throw new Error('Unknown module type');
      }
    })
  );
}

type Signal = { input: string; output: string; type: SignalType };

function findLoop(modules: Modules, begin: string, finalConjuction: ConjuctionModule) {
  let length = 0;

  while (true) {
    const queue: Signal[] = [{ input: 'broadcaster', output: begin, type: 'low' }];
    length++;

    while (queue.length) {
      const signal = queue.shift()!;
      const module = modules[signal.output];
      if (!module) {
        continue;
      }
      if (finalConjuction.inputs.includes(module.name) && signal.type === 'low') {
        return length;
      }

      const newSignals = module
        .handleSignal(signal.type, signal.input)
        .map(([output, type]) => ({ input: module.name, output, type }));
      queue.push(...newSignals);
    }
  }
}

function findLoops(modules: Modules) {
  const loopEntrypoints = modules['broadcaster'].outputs;
  const finalConjuction = Object.values(modules).find(m => m.outputs.includes('rx')) as ConjuctionModule;

  return loopEntrypoints.map(begin => findLoop(modules, begin, finalConjuction));
}

function gcd(a: number, b: number): number {
  return b == 0 ? a : gcd(b, a % b);
}
function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
const modules = parse(input);
const loops = findLoops(modules);
const result = loops.reduce((acc, cur) => lcm(acc, cur), 1);
console.log(result);
