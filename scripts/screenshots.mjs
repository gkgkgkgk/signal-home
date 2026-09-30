import { chromium } from "@playwright/test";
import { setAppearance } from "./appearance.mjs";
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
await setAppearance(page, "dark");
await page.waitForTimeout(350);
await page.screenshot({ path: "docs/desktop-dark.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(600);
await page.screenshot({ path: "docs/mobile-dark.png", fullPage: true });
await page.locator("signal-home main").evaluate((el) => (el.scrollTop = 180));
await page.waitForTimeout(250);
await page.screenshot({ path: "docs/mobile-scrolled-dark.png" });
await page.locator("signal-home main").evaluate((el) => (el.scrollTop = 0));
await setAppearance(page, "light");
await page.waitForTimeout(350);
await page.screenshot({ path: "docs/mobile-light.png", fullPage: true });
await page.locator("signal-home main").evaluate((el) => (el.scrollTop = 180));
await page.waitForTimeout(250);
await page.screenshot({ path: "docs/mobile-scrolled-light.png" });
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
await setAppearance(page, "dark");
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
await page.getByRole("button", { name: "Close details" }).click();
await page.setViewportSize({ width: 390, height: 844 });
await page
  .getByRole("navigation", { name: "Mobile navigation" })
  .getByRole("button", { name: "Lists", exact: true })
  .click();
await page.evaluate(() =>
  window.demo.setItems([
    { uid: "1", summary: "Fresh lemons", status: "needs_action" },
    {
      uid: "2",
      summary: "Oat milk",
      status: "completed",
      completed: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      uid: "3",
      summary: "Coffee beans",
      status: "completed",
      completed: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ]),
);
await page.getByRole("button", { name: "Restore Oat milk" }).waitFor();
await page.evaluate(() => {
  window.demo.setList("todo.projects", "House projects", [
    { uid: "project", summary: "Paint the hallway", status: "needs_action" },
  ]);
  window.demo.setList("todo.weekend", "Weekend", [
    { uid: "weekend", summary: "Book a table", status: "needs_action" },
  ]);
});
await page.waitForTimeout(400);
await page.screenshot({ path: "docs/completed-mobile-dark.png" });
await page
  .getByRole("button", { name: "Delete Oat milk", exact: true })
  .click();
await page.waitForTimeout(400);
await page.screenshot({ path: "docs/delete-mobile-dark.png" });
await page.getByRole("button", { name: "Keep item", exact: true }).click();
await setAppearance(page, "light");
await page
  .getByRole("button", { name: "Delete Oat milk", exact: true })
  .click();
await page.waitForTimeout(400);
await page.screenshot({ path: "docs/delete-mobile-light.png" });
await browser.close();
