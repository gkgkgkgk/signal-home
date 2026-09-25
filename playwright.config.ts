import { defineConfig } from "@playwright/test";
const port = process.env.SIGNAL_TEST_PORT || "5173";
export default defineConfig({
  testDir: "tests",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    colorScheme: "light",
    launchOptions: { executablePath: process.env.CHROMIUM_PATH },
  },
  webServer: {
    command: `npm run dev -- --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
  },
  reporter: "list",
});
