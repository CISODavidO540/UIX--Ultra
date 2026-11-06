#!/usr/bin/env node
import { run } from '../src/cli.js';

run(process.argv.slice(2)).catch((err) => {
  console.error(`\n✖ ${err.message}`);
  if (process.env.OMNI_DEBUG) console.error(err.stack);
  process.exit(1);
});
