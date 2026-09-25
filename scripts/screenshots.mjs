import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const base = process.env.SIGNAL_DEMO_URL || "http://127.0.0.1:5173";
await mkdir("docs", { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1040 },
  colorScheme: "light",
});
await page.goto(base);
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
await page.goto(`${base}/components.html`);
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
await page.goto(base);
await page.getByRole("button", { name: "Switch to dark mode" }).click();
await page
  .getByRole("button", { name: "Climate details", exact: true })
  .click();
await page.waitForTimeout(450);
await page.screenshot({ path: "docs/sheet-mobile-dark.png" });
await page.getByRole("button", { name: "Close details" }).click();
await page.getByRole("button", { name: "Open Signal menu" }).click();
await page.waitForTimeout(450);
await page.screenshot({ path: "docs/menu-mobile-dark.png" });
await page.getByRole("button", { name: "Close details" }).click();
await page.getByRole("button", { name: "Weather details" }).click();
await page.waitForTimeout(450);
await page.screenshot({ path: "docs/weather-sheet-mobile-dark.png" });
await page.setViewportSize({ width: 1440, height: 1040 });
await page.getByRole("button", { name: "Close details" }).click();
await page
  .getByRole("button", { name: "Climate details", exact: true })
  .click();
await page.waitForTimeout(450);
await page.screenshot({ path: "docs/sheet-desktop-dark.png" });
await browser.close();
