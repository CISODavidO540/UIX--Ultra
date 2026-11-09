// Regression test for the fix walkthrough: the vibe-coded page must keep failing
// for the right reasons, and the fixed page must keep passing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { plan } from '../src/plan.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'examples', 'fix-vibecoded');

test('vibe-coded page fails with the expected tells and a P0 list', { timeout: 180000 }, async () => {
  const out = await fs.mkdtemp(path.join(os.tmpdir(), 'before-'));
  const { result: r, plan: p } = await plan(path.join(dir, 'before.html'), { out, task: 'Hermes agent chat with tool calls' });
  assert.equal(r.pass, false);
  assert.ok(r.overall < 50, `overall ${r.overall}`);
  const tells = r.slop.tells.map((t) => t.name);
  for (const t of ['Tech gradient', 'Feature-tile grid', 'Monument stat', 'Emoji icons', 'Center stack']) assert.ok(tells.includes(t), t);
  assert.ok(p.items.some((i) => i.p === 'P0' && i.area === 'responsive'));
  assert.ok(p.playbookItems.length >= 5, 'agent-chat playbook must-haves attached');
});

test('v1 fix passes the gate with no slop tells in every state, but is capped for low expression', { timeout: 240000 }, async () => {
  const out = await fs.mkdtemp(path.join(os.tmpdir(), 'after-'));
  const { result: r } = await plan(path.join(dir, 'after.html'), { out, states: ['attention', 'running', 'empty', 'loading', 'error', 'done'] });
  assert.equal(r.pass, true, r.gate.filter((g) => !g.ok).map((g) => g.name).join(', '));
  assert.equal(r.slop.tells.length, 0);
  assert.equal(r.a11y.issues.filter((i) => i.severity === 'critical' || i.severity === 'serious').length, 0);
  // David rejected v1 as "lacks color and enough structure" (taste.md 2026-11-09):
  // it must keep reading as low-expression, so hygiene alone can't reach S again.
  assert.ok(r.stats.expression < 50, `v1 expression ${r.stats.expression}`);
  assert.ok(r.overall < 90, `v1 overall ${r.overall} should be capped by expression`);
});

test('v2 flight deck passes the gate AND reads as expressive', { timeout: 240000 }, async () => {
  const out = await fs.mkdtemp(path.join(os.tmpdir(), 'v2a-'));
  const { result: r } = await plan(path.join(dir, 'v2-flightdeck', 'index.html'), { out, states: ['attention', 'running', 'empty', 'loading', 'error', 'done'] });
  assert.equal(r.pass, true, r.gate.filter((g) => !g.ok).map((g) => g.name).join(', '));
  assert.equal(r.slop.tells.length, 0, r.slop.tells.map((t) => t.name).join(', '));
  assert.ok(r.stats.expression >= 70, `expression ${r.stats.expression}`);
  assert.ok(r.overall >= 90, `overall ${r.overall}`);
});
