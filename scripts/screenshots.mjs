import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("docs", { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1040 },
  colorScheme: "light",
});
await page.goto("http://127.0.0.1:5173");
await page.getByRole("heading", { name: "Home feels good." }).waitFor();
await page.waitForTimeout(600);
await page.screenshot({ path: "docs/desktop-light.png", fullPage: true });
await page.getByRole("button", { name: "Switch to dark mode" }).click();
await page.waitForTimeout(350);
await page.screenshot({ path: "docs/desktop-dark.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: "docs/mobile-dark.png", fullPage: true });
await page.getByRole("button", { name: "Switch to light mode" }).click();
await page.waitForTimeout(350);
await page.screenshot({ path: "docs/mobile-light.png", fullPage: true });
await page.setViewportSize({ width: 1440, height: 1100 });
await page.goto("http://127.0.0.1:5173/components.html");
await page.getByRole("slider", { name: "History cursor" }).first().waitFor();
await page.waitForTimeout(650);
await page.screenshot({ path: "docs/components-light.png", fullPage: true });
await page.getByRole("button", { name: "Dark mode", exact: true }).click();
await page.waitForTimeout(650);
await page.screenshot({ path: "docs/components-dark.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({
  path: "docs/components-mobile-dark.png",
  fullPage: true,
});
await browser.close();
