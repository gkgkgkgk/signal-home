import {navigate} from "./navigation";
import { test, expect } from "@playwright/test";
import { setAppearance } from "../scripts/appearance.mjs";
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
});
test("phone home shows current temperature and its controls above the dock", async ({page}) => {
  await expect(page.locator("[data-row=climate]")).toContainText("72");
  const dock=await page.getByRole("navigation", {name:"Mobile navigation"}).boundingBox();
  const stepper=await page.locator("[data-row=climate]").boundingBox();
  expect(stepper!.y+stepper!.height).toBeLessThan(dock!.y);
  expect(dock!.y+dock!.height).toBeLessThan(844);
});
test("details button opens controls without sending a command, then controls work", async ({
  page,
}) => {
  await navigate(page,"Climate");
  const tile = page.getByRole("button", {
    name: "Climate details",
    exact: true,
  });
  await tile.click();
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
  await expect(page.locator(".stepper")).toContainText("Heat below 71");
  await expect(page.locator(".dial-value")).toContainText("72");
});
test("home security summary stays honest and opens sensors", async ({page}) => {
  await page.evaluate(() => (window as any).demo.setState("binary_sensor.kitchen", "unavailable"));
  const summary=page.locator("[data-row=water]");
  await expect(summary).toContainText("Kitchen sink offline");
  await page.evaluate(() => (window as any).demo.setState("binary_sensor.kitchen", "on"));
  await expect(summary).toContainText("reports water");
  await summary.getByRole("link").click();
  await expect(page.locator(".sensor")).toHaveCount(3);
});
test("scrolling never moves the dock; switching tabs resets content position", async ({
  page,
}) => {
  const main = page.locator("signal-home main");
  await page.locator("signal-digest").evaluate((el) => (el as HTMLElement).style.paddingBottom = "500px");
  await main.evaluate((el) => (el.scrollTop = el.scrollHeight));
  expect(await main.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  await navigate(page, "Security");
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
        .locator("signal-digest .row").first()
        .evaluate((el) => getComputedStyle(el).transitionDuration),
    ).toBe("0s");
    await navigate(page, "Climate");
    await page.getByRole("button", { name: "Weather details" }).click();
    await expect(page.locator("signal-details .record")).toHaveCount(5);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

test("floating dock stays in the viewport through outer scrolling and resize", async ({page}) => {
  const dock = page.getByRole('navigation', {name: 'Mobile navigation'});
  const before = await dock.boundingBox();
  await page.evaluate(() => { document.body.style.paddingBottom = '800px'; window.scrollTo(0, 300); });
  const after = await dock.boundingBox();
  expect(Math.abs(after!.y - before!.y)).toBeLessThan(1);
  expect(after!.x).toBeGreaterThan(0);
  await page.setViewportSize({width:390,height:680});
  const resized = await dock.boundingBox();
  expect(resized!.y + resized!.height).toBeLessThan(680);
  expect(resized!.y).toBeGreaterThan(550);
});
