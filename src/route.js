// Use-case router: task description → ranked playbooks.
// Playbooks live in skills/ui-max/playbooks/*.md with a small front-matter header.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PLAYBOOK_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'skills', 'ui-max', 'playbooks');

function parse(text, file) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta = {};
  if (m) for (const line of m[1].split('\n')) { const i = line.indexOf(':'); if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim(); }
  return {
    id: meta.id || path.basename(file, '.md'),
    title: meta.title || '',
    surface: meta.surface || '',
    keywords: (meta.keywords || '').split(',').map((k) => k.trim().toLowerCase()).filter(Boolean),
    body: (m ? m[2] : text).trim(),
    file,
  };
}

export async function loadPlaybooks(dir = PLAYBOOK_DIR) {
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.md'));
  return Promise.all(files.map(async (f) => parse(await fs.readFile(path.join(dir, f), 'utf8'), path.join(dir, f))));
}

/** Score each playbook by keyword hits (multi-word keywords count double). */
export async function route(task, { limit = 3 } = {}) {
  const t = ` ${String(task).toLowerCase().replace(/[^a-z0-9+ ]/g, ' ')} `;
  const books = await loadPlaybooks();
  const scored = books.map((b) => {
    const hits = b.keywords.filter((k) => t.includes(` ${k} `) || t.includes(` ${k}s `));
    return { id: b.id, title: b.title, surface: b.surface, score: hits.reduce((s, k) => s + (k.includes(' ') ? 2 : 1), 0), hits };
  }).filter((b) => b.score > 0).sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

export async function playbook(id) {
  const books = await loadPlaybooks();
  const b = books.find((x) => x.id === id);
  if (!b) throw new Error(`No playbook "${id}". Available: ${books.map((x) => x.id).join(', ')}`);
  return b;
}
