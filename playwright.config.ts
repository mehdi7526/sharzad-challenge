import { defineConfig, devices } from '@playwright/test';

const scenario = process.env.BACKEND_HOME_SCENARIO ?? 'normal';

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
      BACKEND_PORT: '4210',
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:4210',
      START_BACKEND: 'true',
      BACKEND_HOME_SCENARIO: scenario,
      BACKEND_VIEWER_SCENARIO: 'normal',
      BACKEND_CORS_ORIGIN: 'http://127.0.0.1:3210',
    },
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
