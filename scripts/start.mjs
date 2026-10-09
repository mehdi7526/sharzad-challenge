import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const standalone = resolve('.next/standalone');
const server = resolve(standalone, 'server.js');
if (!existsSync(server)) {
  throw new Error('Production output missing. Run npm run build first.');
}
mkdirSync(resolve(standalone, '.next'), { recursive: true });
cpSync(resolve('public'), resolve(standalone, 'public'), { recursive: true });
cpSync(resolve('.next/static'), resolve(standalone, '.next/static'), { recursive: true });
process.env.HOSTNAME ||= '127.0.0.1';
await import(pathToFileURL(server).href);
