const session = Deno.env.get('SESSION');
const year = Deno.env.get('YEAR') || new Date().getFullYear();

const commonFiles = ['example.txt', 'input.txt'];
const templates = {
  ts: ['deno.json', 'main.ts', 'main_test.ts'],
  go: ['go.mod', 'main.go', 'main_test.go'],
  fsharp: ['main.fsx', 'main_test.fsx'],
};

export async function fetchInput(day: string): Promise<string> {
  const url = `https://adventofcode.com/${year}/day/${day}/input`;
  const headers = { Cookie: session ? `session=${Deno.env.get('SESSION')}` : '' };

  const response = await fetch(url, { headers });

  if (response.ok) {
    return response.text();
  }

  console.log(`Failed to fetch input`, await response.text());
  return '';
}

async function copyIfNotExists(from: string, to: string) {
  try {
    await Deno.stat(to);
  } catch {
    await Deno.copyFile(from, to);
  }
}

const day = Deno.args[0];
const template = (Deno.args[1] || 'ts') as keyof typeof templates;
const dirname = day.padStart(2, '0');
const input = await fetchInput(day);
await Deno.mkdir(dirname, { recursive: true });
await Promise.all(
  [...commonFiles, ...templates[template]].map(file => copyIfNotExists(`.tpl/${file}`, `${dirname}/${file}`))
);
await Deno.writeTextFile(`${dirname}/input.txt`, input);
