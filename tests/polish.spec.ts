import { test, expect } from "@playwright/test";

test("navigation is directional, immediate, and does not reset the current tab", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Mobile navigation" });
  await nav.getByRole("button", { name: "Lists", exact: true }).click();
  expect(
    await page
      .locator("signal-home .page")
      .evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--page-travel").trim(),
      ),
  ).toBe("12px");
  await page.goBack();
  expect(
    await page
      .locator("signal-home .page")
      .evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--page-travel").trim(),
      ),
  ).toBe("-12px");
  const main = page.locator("signal-home main");
  await main.evaluate((el) => (el.scrollTop = 100));
  const scroll = await main.evaluate((el) => el.scrollTop);
  await nav.getByRole("button", { name: "Overview", exact: true }).click();
  expect(await main.evaluate((el) => el.scrollTop)).toBe(scroll);
  await expect(page.locator("signal-home .sensor").first()).toHaveCSS(
    "animation-name",
    "none",
  );
});

test("touch press feedback and new motion both respect reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const tile = page.locator(".comfort-tile");
  await tile.hover();
  await page.mouse.down();
  await expect(tile).not.toHaveCSS("transform", "none");
  await page.mouse.move(1, 1);
  await page.mouse.up();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("button", { name: "Lists", exact: true })
    .click();
  await expect(page.locator("signal-home .page")).toHaveCSS(
    "animation-name",
    "none",
  );
  await page.getByRole("button", { name: "Complete Fresh lemons" }).click();
  await expect(page.locator(".toast.success")).toBeVisible();
  await expect(page.locator(".toast-mark")).toHaveCSS("animation-name", "none");
});

test("a new list shows placeholders; background refresh never blanks loaded tasks", async ({
  page,
}) => {
  await page.goto("/#signal/lists");
  await page.getByRole("button", { name: "Complete Fresh lemons" }).waitFor();
  await page.evaluate(() => {
    const card = document.querySelector("signal-home") as any;
    const original = card.hass.callWS;
    card.hass = {
      ...card.hass,
      callWS: async (message: any) => {
        const result = await original(message);
        await new Promise((resolve) => ((window as any).releaseList = resolve));
        return result;
      },
    };
    card.setConfig({ ...card.config });
  });
  await expect(
    page.getByRole("status", { name: "Loading list" }),
  ).toBeVisible();
  await expect(page.getByText(/All caught up/)).toHaveCount(0);
  await page.evaluate(() => (window as any).releaseList());
  await expect(
    page.getByRole("button", { name: "Complete Fresh lemons" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Refresh list" }).click();
  await expect(
    page.getByRole("button", { name: "Complete Fresh lemons" }),
  ).toBeVisible();
  await expect(page.getByRole("status", { name: "Loading list" })).toHaveCount(
    0,
  );
  await page.evaluate(() => (window as any).releaseList());
  await page.evaluate(() => ((window as any).demo.fail = true));
  await page.getByRole("button", { name: "Refresh list" }).click();
  await expect(page.getByText(/Showing the last loaded list/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Complete Fresh lemons" }),
  ).toBeVisible();
});

test("device acknowledgment is honest about server state and does not shift the card", async ({
  page,
}) => {
  await page.goto("/components.html");
  const control = page
    .locator("signal-control")
    .filter({ has: page.getByRole("switch", { name: "Coffee corner" }) });
  const before = await control.boundingBox();
  await control.evaluate((card: any) => {
    card.hass = {
      ...card.hass,
      callService: () =>
        new Promise((resolve, reject) => {
          (window as any).acceptCommand = resolve;
          (window as any).rejectCommand = reject;
        }),
    };
  });
  const toggle = control.getByRole("switch", { name: "Coffee corner" });
  await toggle.click();
  await expect(toggle).toBeChecked();
  await expect(toggle).toBeDisabled();
  await expect(control.getByRole("status")).toHaveText("Sending…");
  await page.evaluate(() => (window as any).acceptCommand());
  await expect(control.getByRole("status")).toContainText("Sent");
  await expect(toggle).toBeChecked();
  expect((await control.boundingBox())!.height).toBe(before!.height);
  await toggle.click();
  await page.evaluate(() =>
    (window as any).rejectCommand(new Error("Offline")),
  );
  await expect(control.locator(".error")).toBeVisible();
  await expect(control.locator(".widget")).not.toHaveClass(/acknowledged/);
});

test("graphs keep their geometry and old data during pending and failed refreshes", async ({
  page,
}) => {
  await page.goto("/components.html");
  const graph = page.locator("signal-graph").first();
  await graph.getByRole("slider", { name: "History cursor" }).waitFor();
  const paths = () =>
    graph
      .locator("path.line")
      .evaluateAll((els) => els.map((el) => el.getAttribute("d")));
  const originalPaths = await paths();
  const statsPosition = () =>
    graph.evaluate(
      (el) =>
        el.shadowRoot!.querySelector(".stats")!.getBoundingClientRect().top -
        el.getBoundingClientRect().top,
    );
  const statsY = await statsPosition();
  await graph.evaluate((card: any) => {
    const original = card.hass.callWS;
    card.hass = {
      ...card.hass,
      callWS: async (message: any) => {
        const result = await original(message);
        await new Promise(
          (resolve) => ((window as any).releaseHistory = resolve),
        );
        return result;
      },
    };
  });
  await graph.getByRole("button", { name: "7d", exact: true }).click();
  await expect(graph.locator(".plot")).toHaveAttribute("aria-busy", "true");
  expect(await paths()).toEqual(originalPaths);
  expect(await statsPosition()).toBe(statsY);
  await expect
    .poll(() => page.evaluate(() => typeof (window as any).releaseHistory))
    .toBe("function");
  await page.evaluate(() => (window as any).releaseHistory());
  await expect(graph.locator(".plot")).toHaveAttribute("aria-busy", "false");
  expect(await statsPosition()).toBe(statsY);
  const loadedPaths = await paths();
  await page.evaluate(() => ((window as any).gallery.historyFail = true));
  await graph.getByRole("button", { name: "6h", exact: true }).click();
  await expect(graph.getByRole("status")).toContainText(
    "Showing previous data",
  );
  expect(await paths()).toEqual(loadedPaths);
  await expect(
    graph.getByText("7 days of history", { exact: false }),
  ).toBeVisible();
});

test("appearance changes do not refetch or discard graph history", async ({
  page,
}) => {
  await page.goto("/components.html");
  const graph = page.locator("signal-graph").first();
  await graph.getByRole("slider", { name: "History cursor" }).waitFor();
  const before = await page.evaluate(
    () =>
      (window as any).gallery.calls.filter(
        (c: any) => c.type === "history/history_during_period",
      ).length,
  );
  await page.getByRole("button", { name: "Dark mode", exact: true }).click();
  await expect(
    graph.getByRole("slider", { name: "History cursor" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        (window as any).gallery.calls.filter(
          (c: any) => c.type === "history/history_during_period",
        ).length,
    ),
  ).toBe(before);
});

test("closing a sheet during its entrance leaves no ghost dialog or history entry", async ({
  page,
}) => {
  await page.goto("/");
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Open Signal menu" }).click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    expect(
      await page.evaluate(() => history.state?.signalSheet),
    ).toBeUndefined();
  }
});
