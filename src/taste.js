// Per-user taste profiles.
//
// Every user gets their own profile that starts from a decent seed
// (skills/ui-max/taste/starter.md) and grows from their own verdicts.
// Location, first match wins:
//   1. $UI_MAX_TASTE
//   2. <project>/.omni/taste.md          (per-project profile, if it exists)
//   3. ~/.config/ui-max/taste.md         (personal profile, created on first use)
import fs from 'node:fs/promises';
import fss from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const TASTE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'skills', 'ui-max', 'taste');
export const STARTER = path.join(TASTE_DIR, 'starter.md');

export function profilePath(root = process.cwd()) {
  if (process.env.UI_MAX_TASTE) return path.resolve(process.env.UI_MAX_TASTE);
  const project = path.join(root, '.omni', 'taste.md');
  if (fss.existsSync(project)) return project;
  const base = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
  return path.join(base, 'ui-max', 'taste.md');
}

/** Create a profile from the starter (or an example like "david") if none exists. */
export async function init({ from = 'starter', project = false, root = process.cwd(), force = false } = {}) {
  const dest = project ? path.join(root, '.omni', 'taste.md') : profilePath(root);
  if (fss.existsSync(dest) && !force) return { path: dest, created: false };
  const src = from === 'starter' ? STARTER : path.join(TASTE_DIR, 'examples', `${String(from).replace(/[^a-z0-9-]/gi, '')}.md`);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
  return { path: dest, created: true };
}

export async function read(root) {
  const { path: p } = await init({ root });
  return { path: p, text: await fs.readFile(p, 'utf8') };
}

const today = () => new Date().toISOString().slice(0, 10);

/** Insert a line right after a "## <heading>" line (and its blank line / comment block). */
function insertUnder(text, heading, line) {
  const lines = text.split('\n');
  let i = lines.findIndex((l) => l.trim().toLowerCase() === `## ${heading}`.toLowerCase());
  if (i < 0) { lines.push('', `## ${heading}`, '', line); return lines.join('\n'); }
  i++;
  while (i < lines.length && (lines[i].trim() === '' || lines[i].trim().startsWith('<!--') || lines[i].trim().startsWith('Format:') || /-->\s*$/.test(lines[i]) || (lines[i].startsWith('     ') && !lines[i].trim().startsWith('-')))) i++;
  lines.splice(i, 0, line);
  return lines.join('\n');
}

/** Log a verdict in the user's own words (newest first). */
export async function logVerdict({ artifact, words, property, rule }, root) {
  const { path: p, text } = await read(root);
  const line = `- ${today()} · \`${artifact}\` · "${words}"${property ? ` · ${property}` : ''}${rule ? ` · ${rule}` : ''}`;
  const next = insertUnder(text.endsWith('\n') ? text : text + '\n', 'Verdict log', line);
  await fs.writeFile(p, next);
  return { path: p, line };
}

/** Add a Never/Always rule the user's words imply. */
export async function addRule({ kind, rule, from }, root) {
  if (!['never', 'always'].includes(kind)) throw new Error('kind must be "never" or "always"');
  const { path: p, text } = await read(root);
  const line = `- ${rule}${from ? ` ("${from}", ${today()})` : ` (${today()})`}`;
  const next = insertUnder(text, kind === 'never' ? 'Never (yours)' : 'Always (yours)', line);
  await fs.writeFile(p, next);
  return { path: p, line };
}
