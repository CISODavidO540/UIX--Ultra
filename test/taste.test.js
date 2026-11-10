import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import * as taste from '../src/taste.js';

test('a new user gets a seeded profile that grows from their own words', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'taste-'));
  process.env.UI_MAX_TASTE = path.join(dir, 'taste.md');
  const r = await taste.read();
  assert.match(r.text, /## Seed rules/);
  assert.doesNotMatch(r.text, /David/); // the starter is not anyone's personal log
  await taste.logVerdict({ artifact: 'demo.html', words: 'the blue is everywhere', property: 'reject · color' });
  await taste.addRule({ kind: 'never', rule: 'One hue on every edge, link and heading', from: 'the blue is everywhere' });
  const after = await fs.readFile(process.env.UI_MAX_TASTE, 'utf8');
  assert.match(after, /## Never \(yours\)\n\n- One hue on every edge/);
  assert.match(after, /## Verdict log[\s\S]*"the blue is everywhere"/);
  delete process.env.UI_MAX_TASTE;
});
