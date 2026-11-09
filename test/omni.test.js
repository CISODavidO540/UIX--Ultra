import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrast, toRGBA, hex } from '../src/tokens.js';
import { capture } from '../src/capture.js';
import { audit } from '../src/audit.js';
import { buildTokens } from '../src/tokens.js';
import { scaffold } from '../src/scaffold.js';
import os from 'node:os';
import { check } from '../src/check.js';
import { withPage } from '../src/browser.js';
import { slopInPage } from '../src/slop.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = path.join(here, 'fixtures', 'sample.html');

test('color math', () => {
  assert.equal(hex(toRGBA('rgb(255, 0, 128)')), '#ff0080');
  assert.ok(Math.abs(contrast({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }) - 21) < 0.01);
});

test('full pipeline on fixture', async () => {
  const out = path.join(os.tmpdir(), `omni-test-${process.pid}`);
  const dna = await capture(fixture, { out });
  const { json, css } = buildTokens(dna);
  assert.equal(json.color.bg, '#fafafa');
  assert.equal(json.color.primary, '#6d28d9');
  assert.match(css, /--color-primary: #6d28d9/);
  assert.match(css, /prefers-reduced-motion/);

  const result = await audit(fixture);
  const rules = new Set(result.issues.map((i) => i.rule));
  for (const r of ['contrast', 'img-alt', 'control-name', 'input-label', 'tap-target', 'viewport-meta', 'focus-visible', 'reduced-motion', 'heading-order', 'html-lang']) {
    assert.ok(rules.has(r), `expected audit to flag ${r}`);
  }
  assert.ok(result.score < 70);

  const files = scaffold(json, { framework: 'react' });
  assert.ok(files['css/skeleton.css'].includes('aria') || files['css/skeleton.css'].includes('.sk'));
  assert.ok(files['react/AsyncView.tsx']);
});

test('slop detector fires on a planted template page', async () => {
  const r = await withPage(path.join(here, 'fixtures', 'slop.html'), {}, (page) => page.evaluate(slopInPage));
  const ids = new Set(r.tells.map((t) => t.id));
  for (const id of [1, 2, 3, 4, 5, 6, 7, 8, 9]) assert.ok(ids.has(id), `expected tell ${id}, got ${[...ids]}`);
});

test('audit reads OKLCH colors (no vacuous pass)', async () => {
  const r = await audit(path.join(here, 'fixtures', 'oklch.html'));
  assert.ok(r.issues.some((i) => i.rule === 'contrast' && /faint|muted/.test(i.sample || '')), 'low-contrast oklch text must be flagged');
});

test('check: B1 benchmark passes the gate (positive control)', async () => {
  const out = path.join(os.tmpdir(), `omni-check-${process.pid}`);
  const r = await check(path.join(here, '..', 'benchmarks', 'runs', '2026-11-08-B1', 'index.html'), { out });
  assert.equal(r.pass, true, JSON.stringify(r.gate.filter((g) => !g.ok)));
  assert.equal(r.slop.tells.length, 0);
});
