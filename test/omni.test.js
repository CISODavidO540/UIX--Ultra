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
