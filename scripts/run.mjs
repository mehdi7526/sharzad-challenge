import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

// Environment variables supplied by the caller take priority over the local files.
for (const path of ['.env.local', '.env']) {
  if (existsSync(path)) process.loadEnvFile(path);
}
const mode = process.argv[2];
if (mode !== 'dev' && mode !== 'start') throw new Error('Use dev or start');
const startBackend = process.env.START_BACKEND ?? 'true';
if (startBackend !== 'true' && startBackend !== 'false')
  throw new Error('START_BACKEND must be true or false');

const children = [];
let stopping = false;
function stop(code) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  for (const child of children) child.kill('SIGTERM');
}
function launch(args) {
  const child = spawn(process.execPath, args, { stdio: 'inherit', env: process.env });
  children.push(child);
  child.on('error', (error) => {
    console.error(error);
    stop(1);
  });
  child.on('exit', (code) => stop(code ?? 1));
}

if (startBackend === 'true') {
  launch(['--experimental-strip-types', 'backend/server.mts']);
}
launch(
  mode === 'dev'
    ? ['node_modules/next/dist/bin/next', 'dev', '--hostname', '0.0.0.0', ...process.argv.slice(3)]
    : ['scripts/start.mjs'],
);

for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => stop(0));
