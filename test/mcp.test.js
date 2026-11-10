import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { route } from '../src/route.js';

const here = path.dirname(fileURLToPath(import.meta.url));

test('router picks agent-chat for an agent console task', async () => {
  const r = await route('cyberpunk agent chat with streaming tool calls');
  assert.equal(r[0].id, 'agent-chat');
});

function client(cwd) {
  const p = spawn(process.execPath, [path.join(here, '..', 'bin', 'omni-mcp.js')], { cwd, stdio: ['pipe', 'pipe', 'inherit'], env: { ...process.env, UI_MAX_TASTE: path.join(cwd, 'taste.md') } });
  let buf = ''; const waiters = new Map(); let id = 0;
  p.stdout.on('data', (d) => { buf += d; let i; while ((i = buf.indexOf('\n')) >= 0) { const m = JSON.parse(buf.slice(0, i)); buf = buf.slice(i + 1); waiters.get(m.id)?.(m); } });
  return {
    call(method, params) { const n = ++id; p.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: n, method, params }) + '\n'); return new Promise((r) => waiters.set(n, r)); },
    notify(method) { p.stdin.write(JSON.stringify({ jsonrpc: '2.0', method }) + '\n'); },
    close() { p.kill(); },
  };
}

test('MCP server: handshake, tools, route, verdict, evidence', async () => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'uimax-'));
  const c = client(cwd);
  const init = await c.call('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 't', version: '0' } });
  assert.equal(init.result.serverInfo.name, 'ui-max');
  c.notify('notifications/initialized');
  const names = (await c.call('tools/list', {})).result.tools.map((t) => t.name);
  for (const n of ['ui_route', 'ui_playbook', 'ui_check', 'ui_verdict', 'ui_evidence', 'astryx']) assert.ok(names.includes(n), n);
  const r = await c.call('tools/call', { name: 'ui_route', arguments: { task: 'admin table of users with bulk delete' } });
  assert.match(r.result.content[0].text, /data-table-admin/);
  await c.call('tools/call', { name: 'ui_verdict', arguments: { target: 'demo', verdict: 'reject', reason: 'too vibe coded', property: 'ornament' } });
  const ev = await c.call('tools/call', { name: 'ui_evidence', arguments: {} });
  assert.match(ev.result.content[0].text, /ornament/);
  c.close();
});
