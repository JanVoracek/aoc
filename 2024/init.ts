import { copy } from 'jsr:@std/fs';

const session = Deno.env.get('SESSION');
const year = Deno.env.get('YEAR') || new Date().getFullYear();

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

const day = Deno.args[0];
const dirname = day.padStart(2, '0');
const input = await fetchInput(day);
await copy('.tpl', dirname);
await Deno.writeTextFile(`${dirname}/input.txt`, input);
