import { test, expect } from "@playwright/test";
import { normalizeHistory, simplifyHistory } from "../src/history";
test("history normalizes real payloads and retains extrema and gaps", () => {
  expect(
    normalizeHistory([
      { s: "4", lu: 100 },
      { state: "unavailable", last_updated: "1970-01-01T00:02:00Z" },
    ]),
  ).toEqual([
    { time: 100000, value: 4 },
    { time: 120000, value: null },
  ]);
  const points = Array.from({ length: 20000 }, (_, i) => ({
    time: i,
    value: i === 503 ? null : i === 502 ? 999 : 1,
  }));
  const result = simplifyHistory(points);
  expect(result.length).toBeLessThan(800);
  expect(result.some((p) => p.value === null)).toBeTruthy();
  expect(result.some((p) => p.value === 999)).toBeTruthy();
});
test.beforeEach(async ({ page }) => {
  await page.goto("/components.html");
});
test("toggle reflects server state; brightness previews without service spam", async ({
  page,
}) => {
  const toggle = page.getByRole("switch", { name: "Coffee corner" });
  await expect(toggle).toBeChecked();
  await toggle.click();
  await expect(toggle).not.toBeChecked();
  const slider = page.getByRole("slider", { name: "Brightness", exact: true });
  await slider.evaluate((input: HTMLInputElement) => {
    input.value = "42";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(
    await page.evaluate(
      () =>
        (window as any).gallery.calls.filter(
          (c: any) => c.data?.brightness_pct !== undefined,
        ).length,
    ),
  ).toBe(0);
  await slider.dispatchEvent("change");
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as any).gallery.calls.find(
          (c: any) => c.data?.brightness_pct !== undefined,
        ),
      ),
    )
    .toEqual({
      domain: "light",
      service: "turn_on",
      data: { entity_id: "light.reading", brightness_pct: 42 },
    });
});
test("controls respect capabilities, report failures, and permit unused scenes", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Activate", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as any).gallery.calls.some(
          (c: any) => c.domain === "scene" && c.service === "turn_on",
        ),
      ),
    )
    .toBe(true);
  await expect(
    page.getByRole("button", { name: "Activate", exact: true }),
  ).toBeEnabled();
  await page.evaluate(() => {
    (window as any).gallery.setAttributes("cover.living", {
      supported_features: 3,
    });
    (window as any).gallery.fail = true;
  });
  await expect(page.getByRole("button", { name: "Stop cover" })).toHaveCount(0);
  await expect(
    page.getByRole("slider", { name: "Cover position" }),
  ).toHaveCount(0);
  await page.getByRole("switch", { name: "Coffee corner" }).click();
  await expect(
    page.locator('[data-entity="switch.coffee"]').getByRole("alert"),
  ).toContainText("Couldn’t reach");
  await expect(
    page.getByRole("switch", { name: "Coffee corner" }),
  ).toBeChecked();
  await page.evaluate(() =>
    (window as any).gallery.setState("switch.coffee", "unavailable"),
  );
  await expect(
    page.getByRole("switch", { name: "Coffee corner" }),
  ).toBeDisabled();
});
test("lock requires confirmation and media/selector send exact commands", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Unlock…", exact: true }).click();
  expect(
    await page.evaluate(() =>
      (window as any).gallery.calls.some((c: any) => c.domain === "lock"),
    ),
  ).toBe(false);
  await page.getByRole("button", { name: "Unlock", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as any).gallery.calls.find((c: any) => c.domain === "lock"),
      ),
    )
    .toEqual({
      domain: "lock",
      service: "unlock",
      data: { entity_id: "lock.front" },
    });
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Play", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Set the mood" })
    .selectOption("Slow evening");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as any).gallery.calls.find(
            (c: any) => c.service === "select_option",
          )?.data.option,
      ),
    )
    .toBe("Slow evening");
});
test("graphs query recorded history, preserve gaps, support keyboard and retry", async ({
  page,
}) => {
  const graph = page.locator("signal-graph").first();
  const cursor = graph.getByRole("slider", { name: "History cursor" });
  await expect(cursor).toBeVisible();
  await expect(graph.locator("path.line")).toHaveCount(2);
  await cursor.focus();
  await cursor.press("Home");
  await expect(cursor).toHaveAttribute("aria-valuenow", "0");
  await cursor.press("End");
  await expect(cursor).toHaveAttribute("aria-valuenow", "96");
  await graph.getByRole("button", { name: "7d", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const c = (window as any).gallery.calls
          .filter(
            (c: any) =>
              c.type === "history/history_during_period" &&
              c.entity_ids[0] === "sensor.temperature",
          )
          .at(-1);
        return (Date.parse(c.end_time) - Date.parse(c.start_time)) / 3600000;
      }),
    )
    .toBe(168);
  await page.evaluate(() => ((window as any).gallery.historyFail = true));
  await graph.getByRole("button", { name: "6h", exact: true }).click();
  await expect(graph.getByRole("status")).toContainText("couldn’t be loaded");
  await page.evaluate(() => ((window as any).gallery.historyFail = false));
  await graph.getByRole("button", { name: "Try again" }).click();
  await expect(cursor).toBeVisible();
});
for (const width of [360, 390, 768, 1440])
  test(`component layouts fit ${width}px in both appearances`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const mode of ["light", "dark"]) {
      if (mode === "dark")
        await page
          .getByRole("button", { name: "Dark mode", exact: true })
          .click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const overflowing = await page
        .locator("signal-control,signal-graph,signal-metric")
        .evaluateAll(
          (cards) =>
            cards.filter((c) => {
              const widget = c.shadowRoot!.querySelector(".widget")!;
              return widget.scrollWidth > widget.clientWidth + 1;
            }).length,
        );
      expect(overflowing).toBe(0);
    }
  });
