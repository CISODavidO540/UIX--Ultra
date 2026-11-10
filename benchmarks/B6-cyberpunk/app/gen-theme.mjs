// Regenerates src/netrunner.css from the OMNI preset pair via the Astryx bridge.
import fs from 'node:fs';
import { generate, toAstryxCSS } from '../../../src/theme-engine.js';
const load = (n) => generate(JSON.parse(fs.readFileSync(new URL(`../../../themes/presets/${n}.json`, import.meta.url))));
const light = load('netrunner-day'), dark = load('netrunner');
// html carries data-bench; Astryx re-declares tokens on its inner theme div, so scope both.
const css = ['html[data-bench="directed"]', 'html[data-bench="directed"] '].map((scope) => toAstryxCSS(light, dark, { name: 'netrunner', scope })).join('\n');
fs.writeFileSync(new URL('./src/netrunner.css', import.meta.url), css);
const nc = load('night-city');
fs.writeFileSync(new URL('./src/nightcity-theme.css', import.meta.url), ['html[data-bench="nightcity"]', 'html[data-bench="nightcity"] '].map((scope) => toAstryxCSS(nc, nc, { name: 'night-city', scope })).join('\n'));
console.log('wrote src/netrunner.css');
