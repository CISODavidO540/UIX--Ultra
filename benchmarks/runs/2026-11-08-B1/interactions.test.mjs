// Drives the B1 console through its main paths. Run: node interactions.test.mjs
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const require = createRequire(new URL('../../../package.json', import.meta.url));
const { chromium } = require('playwright');
const url = pathToFileURL(new URL('./index.html', import.meta.url).pathname).href;
const b = await chromium.launch();
const errors = [];
const open = async (vp = { width: 1440, height: 900 }, q = '') => {
  const p = await b.newPage({ viewport: vp }); p.on('pageerror', (e) => errors.push(e.message));
  await p.goto(url + q); await p.waitForTimeout(300); return p;
};
const s = (p, id) => p.$eval(`#s-${id}`, (e) => e.dataset.s);
let ok = 0; const t = async (name, fn) => { await fn(); ok++; console.log('✔', name); };

await t('Allow focused on load; Enter clears 08 and finishes the run', async () => {
  const p = await open();
  assert.equal(await p.evaluate(() => document.activeElement.id), 'allow');
  await p.keyboard.press('Enter');
  assert.equal(await s(p, '08'), 'run');
  await p.waitForTimeout(2600);
  assert.equal(await s(p, '08'), 'done'); assert.equal(await s(p, '09'), 'done');
  assert.match(await p.textContent('#runStatus'), /Run complete/);
  assert.match(await p.textContent('#dock'), /8 of 9 cleared · 1 failed and recovered/);
});
await t('Deny marks 08 denied, explains, continues', async () => {
  const p = await open(); await p.click('#deny');
  assert.equal(await s(p, '08'), 'deny');
  assert.match(await p.textContent('#msgs'), /leaving the fixtures in place/);
  await p.waitForTimeout(1600); assert.equal(await s(p, '09'), 'done');
});
await t('Esc stops the run and keeps work', async () => {
  const p = await open(); await p.click('#log'); await p.keyboard.press('Escape');
  assert.equal(await s(p, '08'), 'stop'); assert.equal(await s(p, '07'), 'done');
  assert.match(await p.textContent('#runStatus'), /Stopped · work kept/);
});
await t('Ctrl+Enter queues a message while running', async () => {
  const p = await open(); await p.fill('#input', 'also run the tests'); await p.focus('#input');
  await p.keyboard.press('Control+Enter');
  assert.equal(await p.$$eval('.msg[data-queued]', (n) => n.length), 1);
  assert.equal(await p.inputValue('#input'), '');
});
await t('Strip ref in transcript opens and focuses the strip', async () => {
  const p = await open(); await p.click('a.ref[data-ref="03"]');
  assert.equal(await p.$eval('#s-03', (e) => e.open), true);
  assert.equal(await p.evaluate(() => document.activeElement.closest('details')?.id), 's-03');
});
await t('Effects toggle turns motion off', async () => {
  const p = await open(); await p.click('#fx');
  assert.equal(await p.evaluate(() => document.documentElement.dataset.fx), 'off');
  assert.equal(await p.textContent('#fxState'), 'off');
});
await t('Mobile: tabs switch panels; clearance visible from both', async () => {
  const p = await open({ width: 390, height: 844 });
  assert.equal(await p.isVisible('#allow'), true);
  await p.click('#tab-bay'); assert.equal(await p.isVisible('#strips'), true); assert.equal(await p.isVisible('#log'), false);
  assert.equal(await p.isVisible('#allow'), true);
  const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(over <= 1, 'no horizontal scroll');
});
await t('Mobile header: status text never runs under Stop', async () => {
  for (const q of ['', '?state=empty', '?state=loading', '?state=done', '?state=error']) {
    const p = await open({ width: 390, height: 844 }, q);
    const [meta, stop] = await p.evaluate(() => [document.querySelector('.run p').getBoundingClientRect().right, document.getElementById('stop').getBoundingClientRect().left]);
    assert.ok(meta <= stop, `${q || 'live'}: meta right ${meta} > stop left ${stop}`);
  }
});
assert.deepEqual(errors, []);
console.log(`\n${ok} passed, 0 page errors`);
await b.close();
