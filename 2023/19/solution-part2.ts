type Workflows = Record<string, Workflow>;
type Workflow = {
  name: string;
  rules: Rule[];
  defaultTarget: string;
};
type Part = { x: number; m: number; a: number; s: number };
type Category = keyof Part;
type Rule = {
  category: Category;
  op: '<' | '>';
  value: number;
  target: string;
};

type Range = [number, number];
type Ranges = Record<Category, Range>;

function parse(input: string) {
  const [workflowsBlock] = input.split('\n\n');

  const workflows = parseWorkflows(workflowsBlock);

  return { workflows };
}

function parseWorkflows(workflowsBlock: string): Workflows {
  return Object.fromEntries(
    workflowsBlock.split('\n').map(line => {
      const [name, rulesPart] = line.slice(0, line.length - 1).split('{');
      const rulesParts = rulesPart.split(',');
      const rules = rulesParts.slice(0, rulesParts.length - 1).map(parseRule);
      const defaultTarget = rulesParts[rulesParts.length - 1];

      return [name, { name, rules, defaultTarget }];
    })
  );
}

function parseRule(rule: string): Rule {
  const [, category, op, value, nextWorkflow] = rule.match(/([xmas])([<>])(\d+):(\w+)/)!;
  return { category, op, value: Number(value), target: nextWorkflow } as Rule;
}

function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function getCombinations(ranges: Ranges) {
  return (
    (ranges.x[1] - ranges.x[0]) *
    (ranges.m[1] - ranges.m[0]) *
    (ranges.a[1] - ranges.a[0]) *
    (ranges.s[1] - ranges.s[0])
  );
}

function countAccepted(workflows: Workflows, workflowName: string, ranges: Ranges) {
  if (workflowName === 'R') return 0;
  if (workflowName === 'A') {
    return getCombinations(ranges);
  }

  let result = 0;
  const workflow = workflows[workflowName];

  for (const rule of workflow.rules) {
    const [min, max] = ranges[rule.category];
    const { op, value, target } = rule;

    if (entireRangeFits([min, max], op, value)) {
      return countAccepted(workflows, target, ranges);
    }

    if (rangePartiallyFits([min, max], op, value)) {
      const subranges: Ranges = {
        ...clone(ranges),
        [rule.category]: op === '<' ? [min, value] : [value + 1, max],
      };

      // process the rest of the rules with remaining ranges
      result += countAccepted(workflows, target, subranges);
      ranges = {
        ...clone(ranges),
        [rule.category]: op === '<' ? [value, max] : [min, value + 1],
      };
    }
  }

  // use the remaining ranges for the default target
  result += countAccepted(workflows, workflow.defaultTarget, ranges);
  return result;
}

function entireRangeFits([min, max]: [number, number], op: string, value: number) {
  return (op === '<' && max < value) || (op === '>' && min > value);
}

function rangePartiallyFits([min, max]: [number, number], op: string, value: number) {
  return (op === '<' && min < value) || (op === '>' && max > value + 1);
}

const input = (await Bun.file(import.meta.dir + '/input.txt').text()).trim();
const { workflows } = parse(input);
const result = countAccepted(workflows, 'in', { x: [1, 4001], m: [1, 4001], a: [1, 4001], s: [1, 4001] } as Ranges);
console.log(result);
