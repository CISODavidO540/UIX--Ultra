import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate, apca, oklch, deltaE, toDTCG } from '../src/theme-engine.js';
import { REQUIRED_ROLES } from '../src/specimen.js';
import { themesFor } from '../src/route.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'themes', 'presets');

test('APCA reference values', () => {
  assert.ok(Math.abs(apca('#000000', '#ffffff') - 106) <= 1);
  assert.ok(Math.abs(apca('#ffffff', '#000000') - 108) <= 1);
  assert.match(oklch(0.7, 0.4, 30), /^#[0-9a-f]{6}$/); // out-of-gamut input is clipped, not broken
});

test('every preset generates all roles and passes every APCA pair', async () => {
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.json'));
  assert.ok(files.length >= 5);
  for (const f of files) {
    const t = generate(JSON.parse(await fs.readFile(path.join(dir, f), 'utf8')));
    for (const r of ['surface-inset', 'surface-0', 'text-1', 'ok-bg', 'danger-solid', 'accent-on-solid', 'focus']) assert.ok(t.roles[r], `${f}: ${r}`);
    assert.deepEqual(t.report.fails, [], `${f}: ${t.report.fails.map((x) => `${x.fg}/${x.bg} ${x.lc}<${x.target}`).join(', ')}`);
  }
});

test('router knows which themes fit a use case', async () => {
  assert.ok((await themesFor('agent-chat')).some((t) => t.name === 'flight-deck-night'));
  assert.deepEqual((await themesFor('data-table-admin')).map((t) => t.name), ['ledger']);
});

test('every theme is a complete, identical contract (all specimen roles, same names)', async () => {
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.json'));
  const themes = await Promise.all(files.map(async (f) => generate(JSON.parse(await fs.readFile(path.join(dir, f), 'utf8')))));
  const names = Object.keys(themes[0].roles).sort().join(',');
  for (const t of themes) {
    for (const r of REQUIRED_ROLES) assert.ok(t.roles[r], `${t.name} missing ${r}`);
    assert.equal(Object.keys(t.roles).sort().join(','), names, `${t.name} role names differ`);
    // status families look different from each other (warn/accent may share)
    const f = ['ok', 'danger', 'info', 'active'];
    for (let i = 0; i < f.length; i++) for (let j = i + 1; j < f.length; j++) assert.ok(deltaE(t.roles[`${f[i]}-solid`], t.roles[`${f[j]}-solid`]) >= 0.08, `${t.name}: ${f[i]} ≈ ${f[j]}`);
    // DTCG export is typed
    const d = toDTCG(t);
    assert.equal(d.color.text['1'].$type, 'color');
    assert.equal(d.duration.fast.$type, 'duration');
  }
});
