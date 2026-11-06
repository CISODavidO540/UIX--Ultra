import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export function resolveTarget(target) {
  if (/^https?:\/\//i.test(target) || target.startsWith('file:')) return target;
  const abs = path.resolve(target);
  if (fs.existsSync(abs)) return pathToFileURL(abs).href;
  return `https://${target}`;
}

export function parseViewport(v, fallback = { width: 1440, height: 900 }) {
  if (!v || typeof v !== 'string') return fallback;
  const [w, h] = v.toLowerCase().split('x').map(Number);
  return w && h ? { width: w, height: h } : fallback;
}

export async function withPage(target, { viewport, reducedMotion } = {}, fn) {
  let playwright;
  try { playwright = require('playwright'); }
  catch { throw new Error('Playwright is required: npm i -D playwright && npx playwright install chromium'); }

  const launchOpts = {};
  if (process.env.OMNI_CHROMIUM) launchOpts.executablePath = process.env.OMNI_CHROMIUM;
  const browser = await playwright.chromium.launch(launchOpts);
  try {
    const context = await browser.newContext({
      viewport: parseViewport(viewport),
      reducedMotion: reducedMotion || 'no-preference',
      userAgent: 'super-uiux-omni/0.1 (+design audit tool)',
    });
    const page = await context.newPage();
    await page.goto(resolveTarget(target), { waitUntil: 'networkidle', timeout: 45000 }).catch(async (e) => {
      // networkidle can hang on sites with long-polling; fall back to load.
      if (!/Timeout/.test(e.message)) throw e;
    });
    await page.waitForTimeout(500);
    return await fn(page, context);
  } finally {
    await browser.close();
  }
}
