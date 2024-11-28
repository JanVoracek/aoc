type SignalType = 'low' | 'high';
type Modules = Record<Module['name'], Module>;
type Module = {
  name: string;
  type: 'broadcast' | 'flip-flop' | 'conjunction';
  inputs: string[];
  outputs: string[];
  handleSignal(signalType: SignalType, input: string): [Module['name'], SignalType][];
};

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

function createConjunction(name: string, inputs: string[], outputs: string[]): Module {
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
  };
}

function parse(input: string): Modules {
  const parsedLines = input.split('\n').map(line => {
    const [modulePart, connectionsPart] = line.split(' -> ');
    const connections = connectionsPart.split(', ');
    const [name, type] =
      modulePart === 'broadcaster'
        ? ['broadcaster', 'broadcast']
        : [modulePart.slice(1), modulePart.startsWith('%') ? 'flip-flop' : 'conjunction'];
    return { name, type, connections };
  });

  const findInputs = (name: string) =>
    parsedLines.filter(({ connections }) => connections.includes(name)).map(({ name }) => name);

  return Object.fromEntries(
    parsedLines.map(({ name, type, connections }) => {
      switch (type) {
        case 'broadcast':
          return [name, createBroadcast(name, findInputs(name), connections)];
        case 'flip-flop':
          return [name, createFlipFlop(name, findInputs(name), connections)];
        case 'conjunction':
          return [name, createConjunction(name, findInputs(name), connections)];
        default:
          throw new Error('Unknown module type');
      }
    })
  );
}

type Signal = { input: string; output: string; type: SignalType };

function handleSignal(modules: Modules, repetitions: number) {
  const stats = { low: 0, high: 0 };

  for (let i = 0; i < repetitions; i++) {
    const queue: Signal[] = [{ input: 'button', output: 'broadcaster', type: 'low' }];
    while (queue.length) {
      const signal = queue.shift()!;
      stats[signal.type]++;
      const module = modules[signal.output];
      if (!module) {
        continue;
      }
      const newSignals = module
        .handleSignal(signal.type, signal.input)
        .map(([output, type]) => ({ input: module.name, output, type }));
      queue.push(...newSignals);
    }
  }
  return stats;
}

const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
const modules = parse(input);
const result = handleSignal(modules, 1000);
console.log(result.low * result.high);
