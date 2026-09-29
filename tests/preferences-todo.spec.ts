import { test, expect } from "@playwright/test";
import { setAppearance } from "../scripts/appearance.mjs";
import { isDark } from "../src/appearance";

test("time mode uses home time, with precise day/night boundaries", () => {
  for (const [iso, dark] of [
    ["2026-09-29T10:59:00Z", true],
    ["2026-09-29T11:00:00Z", false],
    ["2026-09-29T22:59:00Z", false],
    ["2026-09-29T23:00:00Z", true],
  ] as const) {
    expect(isDark("auto", !dark, new Date(iso), "America/New_York")).toBe(dark);
  }
});
test("settings expose four modes; auto updates on resume and system follows OS", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date("2026-09-29T12:00:00Z"));
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await page.evaluate(() => {
    const card = document.querySelector("signal-home") as any;
    card.hass = {
      ...card.hass,
      config: { ...card.hass.config, time_zone: "America/New_York" },
    };
    card.setConfig({ ...card.config, appearance: "auto" });
  });
  const app = page.locator("signal-home .app");
  await expect(app).not.toHaveClass(/dark/);
  await expect(
    page.getByRole("button", { name: /Switch to .* mode/ }),
  ).toHaveCount(0);
  await page.clock.setFixedTime(new Date("2026-09-30T00:00:00Z"));
  await page.evaluate(() =>
    document.dispatchEvent(new Event("visibilitychange")),
  );
  await expect(app).toHaveClass(/dark/);
  await setAppearance(page, "system");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(app).not.toHaveClass(/dark/);
  await setAppearance(page, "dark");
  await page.reload();
  await expect(app).toHaveClass(/dark/);
  await setAppearance(page, "light");
  await expect(app).not.toHaveClass(/dark/);
  await setAppearance(page, "auto");
  await page.getByRole("button", { name: "Open Signal menu" }).click();
  await expect(
    page
      .getByRole("combobox", { name: "Appearance", exact: true })
      .locator("option"),
  ).toHaveCount(4);
});
test("completed tasks can be restored by immediate undo or checked rows", async ({
  page,
}) => {
  await page.goto("/#signal/lists");
  await page.getByRole("button", { name: "Complete Fresh lemons" }).click();
  await expect(
    page.getByRole("button", { name: "Restore Fresh lemons" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Complete Fresh lemons" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Complete Fresh lemons" }).click();
  await page.getByRole("button", { name: "Restore Fresh lemons" }).click();
  await expect(
    page.getByRole("button", { name: "Restore Fresh lemons" }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(() =>
      (window as any).demo.calls
        .filter((c: any) => c.service === "update_item")
        .map((c: any) => [c.data.item, c.data.status]),
    ),
  ).toEqual([
    ["1", "completed"],
    ["1", "needs_action"],
    ["1", "completed"],
    ["1", "needs_action"],
  ]);
});
test("24-hour boundary archives without deleting; older tasks remain restorable", async ({
  page,
}) => {
  await page.goto("/#signal/lists");
  await page.evaluate(() =>
    (window as any).demo.setItems([
      {
        uid: "recent",
        summary: "Recent",
        status: "completed",
        completed: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        uid: "old",
        summary: "Older",
        status: "completed",
        completed: new Date(Date.now() - 25 * 3600000).toISOString(),
      },
      { uid: "unknown", summary: "Undated", status: "completed" },
    ]),
  );
  await expect(
    page.getByRole("button", { name: "Restore Recent" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Restore Undated" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Restore Older" }),
  ).toBeHidden();
  await page.getByText("Older completed · 1", { exact: true }).click();
  await page.getByRole("button", { name: "Restore Older" }).click();
  await expect(
    page.getByRole("button", { name: "Complete Older" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() =>
      (window as any).demo.calls.some((c: any) =>
        c.service?.includes("remove"),
      ),
    ),
  ).toBe(false);
});
test("failed restore retains the completed item and reports the error", async ({
  page,
}) => {
  await page.goto("/#signal/lists");
  await page.getByRole("button", { name: "Complete Oat milk" }).click();
  await expect(page.getByRole("button", { name: "Restore Oat milk" })).toBeVisible();
  await page.evaluate(() => ((window as any).demo.fail = true));
  await page.getByRole("button", { name: "Restore Oat milk" }).click();
  await expect(page.getByRole("status")).toContainText("Couldn’t update");
  await expect(
    page.getByRole("button", { name: "Restore Oat milk" }),
  ).toBeVisible();
});
