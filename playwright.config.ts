import { defineConfig } from '@playwright/test'
const vp: [string, number, number][] = [['desktop', 1440, 900], ['tablet', 768, 1024], ['mobile-390', 390, 844], ['mobile-360', 360, 800]]
// CHROMIUM_PATH lets you use a system Chromium; otherwise run `npx playwright install chromium` first.
export default defineConfig({
  testDir: 'e2e', timeout: 60000, workers: 1, reporter: [['list']],
  use: { baseURL: process.env.BASE_URL || 'http://localhost:4173/trace-kyc/', launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox', '--disable-gpu'] } },
  projects: vp.map(([name, width, height]) => ({ name, use: { viewport: { width, height } } })),
})
