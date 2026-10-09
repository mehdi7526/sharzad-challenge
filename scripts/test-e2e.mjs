import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const playwright = require.resolve('@playwright/test/cli');
const extraArgs = process.argv.slice(2);

for (const scenario of ['normal', 'empty', 'error']) {
  const files =
    scenario === 'normal'
      ? ['tests/home.spec.ts', 'tests/viewer.spec.ts']
      : ['tests/home-states.spec.ts'];
  console.info(`E2E scenario: ${scenario}`);
  const result = spawnSync(process.execPath, [playwright, 'test', ...files, ...extraArgs], {
    stdio: 'inherit',
    env: { ...process.env, BACKEND_HOME_SCENARIO: scenario },
  });
  if (result.error) console.error(result.error);
  if (result.error || result.signal || result.status !== 0) {
    process.exit(result.status || 1);
  }
}
