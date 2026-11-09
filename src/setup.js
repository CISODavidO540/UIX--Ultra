// omni setup — wire UI-MAX into agent clients (REA-style).
// Default is a dry run that prints what it would do. --write applies it,
// backing up every config file it touches.
import fs from 'node:fs/promises';
import fss from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SERVER = { command: process.execPath, args: [path.join(ROOT, 'bin', 'omni-mcp.js')] };

function desktopConfigPath() {
  const h = os.homedir();
  if (process.platform === 'darwin') return path.join(h, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  if (process.platform === 'win32') return path.join(process.env.APPDATA || path.join(h, 'AppData', 'Roaming'), 'Claude', 'claude_desktop_config.json');
  return path.join(h, '.config', 'Claude', 'claude_desktop_config.json');
}
const has = (bin) => { try { execFileSync(process.platform === 'win32' ? 'where' : 'which', [bin], { stdio: 'ignore' }); return true; } catch { return false; } };

async function mergeMcpJson(file, write) {
  let cfg = {};
  const exists = fss.existsSync(file);
  if (exists) cfg = JSON.parse(await fs.readFile(file, 'utf8') || '{}');
  cfg.mcpServers = { ...(cfg.mcpServers || {}), 'ui-max': SERVER };
  if (!write) return `would add "ui-max" to ${file}${exists ? '' : ' (new file)'}`;
  await fs.mkdir(path.dirname(file), { recursive: true });
  if (exists) await fs.copyFile(file, `${file}.bak-${Date.now()}`);
  await fs.writeFile(file, JSON.stringify(cfg, null, 2) + '\n');
  return `added "ui-max" to ${file}${exists ? ' (backup saved)' : ''}`;
}

async function linkSkill(write) {
  const dest = path.join(os.homedir(), '.claude', 'skills', 'ui-max');
  const src = path.join(ROOT, 'skills', 'ui-max');
  if (fss.existsSync(dest)) {
    const real = fss.realpathSync(dest);
    return real === fss.realpathSync(src) ? `skill already linked at ${dest}` : `skill exists at ${dest} (not ours) — left alone`;
  }
  if (!write) return `would symlink ${dest} → ${src}`;
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.symlink(src, dest, 'dir');
  return `linked skill ${dest} → ${src}`;
}

export async function setup({ client = 'all', write = false } = {}) {
  const lines = [];
  const want = (c) => client === 'all' || client === c;
  if (want('claude-code')) {
    lines.push(await linkSkill(write));
    const cmd = ['mcp', 'add', '--scope', 'user', 'ui-max', '--', SERVER.command, ...SERVER.args];
    if (!has('claude')) lines.push(`Claude Code CLI not found. When installed: claude ${cmd.join(' ')}`);
    else if (!write) lines.push(`would run: claude ${cmd.join(' ')}`);
    else {
      try { execFileSync('claude', cmd, { stdio: 'pipe' }); lines.push('registered MCP server "ui-max" with Claude Code (user scope)'); }
      catch (e) { lines.push(`claude mcp add failed (already registered?): ${String(e.stderr || e.message).trim().split('\n')[0]}`); }
    }
  }
  if (want('cursor')) lines.push(await mergeMcpJson(path.join(os.homedir(), '.cursor', 'mcp.json'), write));
  if (want('claude-desktop')) lines.push(await mergeMcpJson(desktopConfigPath(), write));
  if (!write) lines.push('', 'Dry run. Re-run with --write to apply (config files are backed up first).');
  return lines.join('\n');
}
