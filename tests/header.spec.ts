import { test, expect } from "@playwright/test";
import { setAppearance } from "../scripts/appearance.mjs";

for (const dark of [false, true]) {
  test(`phone header stays pinned and opaque in ${dark ? "dark" : "light"} mode`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    if (dark) await setAppearance(page, "dark");
    const header = page.locator("signal-home .app-header");
    const main = page.locator("signal-home main");
    const dock = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(header).toContainText("Good");
    const top = (await header.boundingBox())!.y;
    const dockTop = (await dock.boundingBox())!.y;
    await expect(header).not.toHaveClass(/scrolled/);
    await main.evaluate((el) => (el.scrollTop = el.scrollHeight));
    await expect(header).toHaveClass(/scrolled/);
    expect((await header.boundingBox())!.y).toBeCloseTo(top, 1);
    expect((await dock.boundingBox())!.y).toBeCloseTo(dockTop, 1);
    expect(
      await header.evaluate((el) => getComputedStyle(el).backgroundColor),
    ).toBe(dark ? "rgb(26, 35, 32)" : "rgb(244, 243, 238)");
    // The heading scrolls under the stationary header, not over it.
    const greeting = await page
      .getByRole("heading", { name: "Home feels good." })
      .boundingBox();
    expect(greeting!.y + greeting!.height).toBeLessThan(top);
    const position = await main.evaluate((el) => el.scrollTop);
    await page.getByRole("button", { name: "Open Signal menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Open Signal menu" }),
    ).toBeFocused();
    expect(await main.evaluate((el) => el.scrollTop)).toBe(position);
    await dock.getByRole("button", { name: "Safety", exact: true }).click();
    await expect(header).not.toContainText("Safety");
    await expect(header).not.toHaveClass(/scrolled/);
    expect(await main.evaluate((el) => el.scrollTop)).toBe(0);
  });
}

test("small phones, long names, reduced motion, and desktop retain usable headers", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => {
    const card = document.querySelector("signal-home") as any;
    card.setConfig({
      ...card.config,
      header_label: "Our very long family home name",
      immersive: true,
    });
  });
  const header = page.locator("signal-home .app-header");
  expect(
    await header.evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
  const menu = await page
    .getByRole("button", { name: "Open Signal menu" })
    .boundingBox();
  expect(menu!.width).toBeGreaterThanOrEqual(44);
  expect(menu!.x + menu!.width).toBeLessThanOrEqual(320);
  // Simulate an edge-to-edge cutout inset, using the same padding token as env().
  await page
    .locator("signal-home .app-header")
    .evaluate((el) =>
      (el as HTMLElement).style.setProperty("--signal-top-padding", "44px"),
    );
  expect(
    (await page
      .getByRole("button", { name: "Open Signal menu" })
      .boundingBox())!.y,
  ).toBeGreaterThanOrEqual(44);
  await page.setViewportSize({ width: 1440, height: 1040 });
  await expect
    .poll(() => header.evaluate((el) => getComputedStyle(el).position))
    .toBe("static");
  await expect(header).toContainText("Our very long family home name");
});
