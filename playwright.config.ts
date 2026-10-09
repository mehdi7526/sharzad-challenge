import { defineConfig, devices } from '@playwright/test';

const scenario = process.env.MOCK_HOME_SCENARIO ?? 'normal';

export default defineConfig({
  testDir: './tests',
  testIgnore: '**/unit/**',
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3210',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'], browserName: 'chromium', channel: 'chrome' },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3210/home',
    env: {
      PORT: '3210',
      MOCK_PORT: '4210',
      API_BASE_URL: 'http://127.0.0.1:4210',
      HOME_DATA_SOURCE: 'mock',
      MOCK_HOME_SCENARIO: scenario,
      MOCK_VIEWER_SCENARIO: 'normal',
    },
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
