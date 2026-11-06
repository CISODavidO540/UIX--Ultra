import fs from 'node:fs/promises';
import path from 'node:path';
import { capture } from './capture.js';
import { audit } from './audit.js';
import { buildTokens } from './tokens.js';
import { scaffold } from './scaffold.js';
import { renderReport } from './report.js';
import { fileURLToPath } from 'node:url';

const THEMES_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'themes');

const HELP = `
super UI UX OMNI Pro Max Ultra Supreme  —  omni

USAGE
  omni capture  <url|file.html> [--out dir] [--viewport 1440x900] [--mobile]
      Load the page, extract its design DNA (colors, type, spacing, radii,
      shadows, motion), take screenshots, and write ui-dna.json.

  omni audit    <url|file.html> [--out dir]
      UX + accessibility audit: contrast, tap targets, focus visibility,
      missing labels/alt, reduced-motion support, layout shift, heading order.

  omni tokens   <dir>
      Turn ui-dna.json into tokens.json + tokens.css (normalized scales).

  omni scaffold <dir> [--framework css|react|tailwind]
      Generate the "beyond pretty" layer from tokens: skeleton loaders,
      enter/exit transitions, state styles (hover/focus/active/disabled/
      loading/empty/error/success) and prefers-reduced-motion fallbacks.

  omni theme    <name> [--out dir]
      Copy a stylized-but-usable theme pack into your project.
      Available: cyberpunk  (run "omni theme list")

  omni full     <url|file.html> [--out dir] [--framework ...]
      capture → audit → tokens → scaffold → REPORT.md, all in one.

OPTIONS
  --out <dir>        Output directory (default: ./omni-out/<host>)
  --viewport WxH     Desktop viewport (default 1440x900)
  --mobile           Also capture at 390x844
  --framework        css (default) | react | tailwind

Respect site terms. Capture for study, audits and your own products —
not for passing off someone else's brand as yours.
`;

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) { args[key] = next; i++; }
      else args[key] = true;
    } else args._.push(a);
  }
  return args;
}

function defaultOut(target) {
  let name = 'page';
  try { name = new URL(target).host || name; } catch { name = path.basename(target, path.extname(target)); }
  return path.resolve('omni-out', name.replace(/[^a-z0-9.-]/gi, '_'));
}

async function readJSON(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function writeJSON(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

export async function run(argv) {
  const args = parseArgs(argv);
  const [cmd, target] = args._;
  if (!cmd || cmd === 'help' || args.help) { console.log(HELP); return; }

  const needTarget = () => { if (!target) throw new Error(`"${cmd}" needs a target. Run "omni help".`); };

  switch (cmd) {
    case 'capture': {
      needTarget();
      const out = path.resolve(args.out || defaultOut(target));
      const dna = await capture(target, { out, viewport: args.viewport, mobile: !!args.mobile });
      await writeJSON(path.join(out, 'ui-dna.json'), dna);
      console.log(`✔ captured → ${out}/ui-dna.json`);
      return;
    }
    case 'audit': {
      needTarget();
      const out = path.resolve(args.out || defaultOut(target));
      const result = await audit(target, { viewport: args.viewport });
      await writeJSON(path.join(out, 'audit.json'), result);
      console.log(`✔ audit score ${result.score}/100, ${result.issues.length} issues → ${out}/audit.json`);
      return;
    }
    case 'tokens': {
      needTarget();
      const dir = path.resolve(target);
      const { json, css } = buildTokens(await readJSON(path.join(dir, 'ui-dna.json')));
      await writeJSON(path.join(dir, 'tokens.json'), json);
      await fs.writeFile(path.join(dir, 'tokens.css'), css);
      console.log(`✔ tokens → ${dir}/tokens.json, tokens.css`);
      return;
    }
    case 'scaffold': {
      needTarget();
      const dir = path.resolve(target);
      const tokens = await readJSON(path.join(dir, 'tokens.json'));
      const files = scaffold(tokens, { framework: args.framework || 'css' });
      for (const [rel, content] of Object.entries(files)) {
        const p = path.join(dir, 'scaffold', rel);
        await fs.mkdir(path.dirname(p), { recursive: true });
        await fs.writeFile(p, content);
      }
      console.log(`✔ scaffold (${Object.keys(files).length} files) → ${dir}/scaffold/`);
      return;
    }
    case 'full': {
      needTarget();
      const out = path.resolve(args.out || defaultOut(target));
      console.log('① capture…');
      const dna = await capture(target, { out, viewport: args.viewport, mobile: !!args.mobile });
      await writeJSON(path.join(out, 'ui-dna.json'), dna);
      console.log('② audit…');
      const result = await audit(target, { viewport: args.viewport });
      await writeJSON(path.join(out, 'audit.json'), result);
      console.log('③ tokens…');
      const { json, css } = buildTokens(dna);
      await writeJSON(path.join(out, 'tokens.json'), json);
      await fs.writeFile(path.join(out, 'tokens.css'), css);
      console.log('④ scaffold…');
      const files = scaffold(json, { framework: args.framework || 'css' });
      for (const [rel, content] of Object.entries(files)) {
        const p = path.join(out, 'scaffold', rel);
        await fs.mkdir(path.dirname(p), { recursive: true });
        await fs.writeFile(p, content);
      }
      await fs.writeFile(path.join(out, 'REPORT.md'), renderReport({ dna, audit: result, tokens: json, files: Object.keys(files) }));
      console.log(`✔ done → ${out}/REPORT.md  (audit ${result.score}/100)`);
      return;
    }
    case 'theme': {
      const names = (await fs.readdir(THEMES_DIR, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
      if (!target || target === 'list') { console.log(`Themes: ${names.join(', ')}`); return; }
      if (!names.includes(target)) throw new Error(`No theme "${target}". Available: ${names.join(', ')}`);
      const out = path.resolve(args.out || path.join('omni-theme', target));
      await fs.cp(path.join(THEMES_DIR, target), out, { recursive: true });
      console.log(`✔ ${target} theme → ${out}\n  open ${path.join(out, 'demo.html')} through a local server (ES modules) to see it live.`);
      return;
    }
    default:
      throw new Error(`Unknown command "${cmd}". Run "omni help".`);
  }
}
