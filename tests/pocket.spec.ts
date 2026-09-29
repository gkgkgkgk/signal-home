import { test, expect } from "@playwright/test";
import { setAppearance } from "../scripts/appearance.mjs";
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
});
test("phone overview fits the essential tiles above the dock without overlap", async ({
  page,
}) => {
  await expect(page.locator(".pocket-temperature")).toContainText("72");
  await expect(page.locator(".comfort-tile")).toContainText(
    "Heat 70° · Cool 76°",
  );
  const dock = await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .boundingBox();
  for (const selector of [
    ".comfort-tile",
    ".outside-tile",
    ".list-tile",
    ".home-signal",
  ]) {
    const tile = await page.locator(selector).boundingBox();
    expect(tile!.y + tile!.height).toBeLessThanOrEqual(dock!.y);
  }
  const content = await page.locator("signal-home main").boundingBox();
  expect(content!.y + content!.height).toBeLessThanOrEqual(dock!.y + 1);
  expect(
    await page
      .getByRole("button", { name: "Increase target temperature" })
      .count(),
  ).toBe(0);
});
test("whole tile opens controls without sending a command, then controls work", async ({
  page,
}) => {
  const tile = page.getByRole("button", {
    name: "Climate details",
    exact: true,
  });
  await tile.click({ position: { x: 35, y: 70 } });
  await expect(
    page.getByRole("dialog", { name: "Climate", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        (window as any).demo.calls.filter(
          (c: any) => c.service === "set_temperature",
        ).length,
    ),
  ).toBe(0);
  await page
    .locator("signal-details")
    .getByRole("button", { name: "Increase target temperature" })
    .click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as any).demo.calls.find(
            (c: any) => c.service === "set_temperature",
          )?.data.target_temp_low,
      ),
    )
    .toBe(71);
  await page.keyboard.press("Escape");
  await expect(tile).toBeFocused();
  await expect(tile).toContainText("Heat 71°");
  await expect(page.locator(".pocket-temperature")).toContainText("72");
});
test("status stays honest and the whole grocery tile navigates to the list", async ({
  page,
}) => {
  await page.evaluate(() =>
    (window as any).demo.setState("binary_sensor.kitchen", "unavailable"),
  );
  await expect(page.locator(".home-signal")).toContainText(
    "1 sensor unavailable",
  );
  await page.evaluate(() =>
    (window as any).demo.setState("binary_sensor.kitchen", "on"),
  );
  await expect(page.locator(".home-signal")).toContainText("need attention");
  await page.locator(".list-tile").click();
  await expect(
    page.getByRole("textbox", { name: "New grocery item" }),
  ).toBeVisible();
  await page.getByRole("textbox", { name: "New grocery item" }).fill("Coffee");
  await page.getByRole("button", { name: "Add grocery item" }).click();
  await expect(
    page.getByRole("button", { name: "Complete Coffee" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("button", { name: "Overview" })
    .click();
  await expect(page.locator(".list-tile .pocket-reading")).toContainText("4");
});
test("scrolling never moves the dock; switching tabs resets content position", async ({
  page,
}) => {
  const main = page.locator("signal-home main");
  await main.evaluate((el) => (el.scrollTop = el.scrollHeight));
  expect(await main.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("button", { name: "Safety", exact: true })
    .click();
  await expect.poll(() => main.evaluate((el) => el.scrollTop)).toBe(0);
  await expect(
    page.getByRole("heading", { name: "Peace of mind." }),
  ).toBeVisible();
});
for (const width of [320, 360, 390, 430, 760])
  test(`compact layout works at ${width}px with motion reduced`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 740 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await setAppearance(page, "dark");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .locator(".comfort-tile")
        .evaluate((el) => getComputedStyle(el).transitionDuration),
    ).toBe("0s");
    await page.getByRole("button", { name: "Weather details" }).click();
    await expect(page.locator("signal-details .record")).toHaveCount(5);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
