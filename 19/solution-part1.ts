type Workflows = Record<string, Workflow>;
type Workflow = { name: string; rules: Rule[]; defaultTarget: string };
type Part = { x: number; m: number; a: number; s: number };
type Rule = {
  matches: (part: Part) => boolean;
  target: string;
};

function parse(input: string) {
  const [workflowsBlock, partsBlock] = input.split('\n\n');

  const workflows = parseWorkflows(workflowsBlock);
  const parts = parseParts(partsBlock);

  return { workflows, parts };
}

function parseWorkflows(workflowsBlock: string): Workflows {
  return Object.fromEntries(
    workflowsBlock.split('\n').map(line => {
      const [name, rulesPart] = line.slice(0, line.length - 1).split('{');
      const rules = rulesPart.split(',').map(parseRule);
      const defaultTarget = rules.pop()!.target;

      return [name, { name, rules, defaultTarget }];
    })
  );
}

function parseRule(rule: string): Rule {
  if (!rule.includes(':')) {
    return { matches: () => true, target: rule };
  }

  const [, category, op, value, nextWorkflow] = rule.match(/([xmas])([<>])(\d+):(\w+)/)!;
  const matches = (part: Part) => {
    const c = part[category as keyof Part];
    const v = Number(value);
    return op === '<' ? c < v : c > v;
  };

  return { matches, target: nextWorkflow };
}

function parseParts(partsBlock: string): Part[] {
  return eval(`_=[${partsBlock.replaceAll('=', ':').replaceAll('\n', ',')}]`);
}

function processParts(workflows: Workflows, parts: Part[]): { accepted: Part[]; rejected: Part[] } {
  return parts
    .map(part => [processPart(workflows, part), part] as const)
    .reduce(
      (acc, [result, part]) => {
        acc[result === 'A' ? 'accepted' : 'rejected'].push(part);
        return acc;
      },
      { accepted: [] as Part[], rejected: [] as Part[] }
    );
}

function processPart(workflows: Workflows, part: Part) {
  let workflowName = 'in';

  while (workflowName !== 'R' && workflowName !== 'A') {
    const workflow = workflows[workflowName];
    workflowName = workflow.rules.find(rule => rule.matches(part))?.target ?? workflow.defaultTarget;
  }

  return workflowName;
}

function sumParts(parts: Part[]) {
  return sum(parts.map(part => part.x + part.m + part.a + part.s));
}

function sum(arr: number[]) {
  return arr.reduce((acc, n) => acc + n, 0);
}

const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
const { workflows, parts } = parse(input);
const processedParts = processParts(workflows, parts);
const result = sumParts(processedParts.accepted);
console.log(result);
