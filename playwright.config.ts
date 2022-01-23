// playwright.config.ts
// https://webgate.acceptance.ec.europa.eu/Twinning/resources/js/ap
import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: 'projects/tms-e2e', // /src/features/+tms/+administration',
  // testMatch: 'project.component.spec.ts',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:4207',
    headless: true,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      // testIgnore: /.*dashboard.spec.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  reporter: [
    ['html', { outputFolder: 'playwright-report' }]
  ],
};
export default config;
