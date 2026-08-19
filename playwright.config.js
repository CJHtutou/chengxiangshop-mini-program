import { defineConfig } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const localChromium = process.env.PLAYWRIGHT_CHROMIUM_PATH || path.resolve(process.cwd(), '..', '测试依赖', 'chrome-win64', 'chrome.exe')

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:5174',
    viewport: { width: 390, height: 844 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: fs.existsSync(localChromium) ? { executablePath: localChromium } : undefined
  },
  webServer: { command: 'npm run dev:h5 -- --host 127.0.0.1', url: 'http://127.0.0.1:5174', reuseExistingServer: true, timeout: 120000 }
})
