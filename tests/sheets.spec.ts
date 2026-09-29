import { test, expect } from "@playwright/test";
import { setAppearance } from "../scripts/appearance.mjs";
test("recovery link forces a fresh document even when HA intercepts anchors", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    (window as any).oldDocument = true;
    document.addEventListener("click", (event) => {
      const anchor = event
        .composedPath()
        .find((node) => node instanceof HTMLAnchorElement) as
        HTMLAnchorElement | undefined;
      if (anchor) {
        event.preventDefault();
        history.pushState({}, "", anchor.href);
      }
    });
  });
  await page.getByRole("button", { name: "Open Signal menu" }).click();
  await page
    .getByRole("link", { name: /Open standard Home Assistant/ })
    .click();
  await expect(page).toHaveURL(/disable_km/);
  await expect(
    page.getByRole("button", { name: "Open Signal menu" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => (window as any).oldDocument),
  ).toBeUndefined();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("sheets work on LAN HTTP without secure-context crypto APIs", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(crypto, "randomUUID", {
      value: undefined,
      configurable: true,
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Open Signal menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});
test("keyboard focus stays inside the sheet and non-admins do not see admin settings", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    const card = document.querySelector("signal-home") as any;
    card.hass = { ...card.hass, user: { name: "Guest", is_admin: false } };
  });
  await page.getByRole("button", { name: "Open Signal menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page
      .locator(".signal-menu")
      .getByRole("link", { name: /Home Assistant settings/ }),
  ).toHaveCount(0);
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => {
        let active: any = document.activeElement;
        while (active?.shadowRoot?.activeElement)
          active = active.shadowRoot.activeElement;
        let node = active;
        while (node) {
          if (node instanceof HTMLDialogElement && node.open) return "inside";
          node = node.assignedSlot || node.parentNode || node.host;
        }
        return active?.outerHTML?.slice(0, 250);
      }),
    ).toBe("inside");
  }
});
test("climate opens a Signal dialog, controls work, Escape restores focus", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Climate details", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    page.locator("signal-details").getByRole("combobox", { name: "HVAC mode" }),
  ).toHaveValue("heat_cool");
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
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Climate details", exact: true }),
  ).toBeFocused();
});
test("Back closes only the sheet; menu exposes account and recovery without changing auth", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Dashboard navigation" })
    .getByRole("button", { name: "Safety", exact: true })
    .click();
  await page.getByRole("button", { name: "Open Signal menu" }).click();
  const dialog = page.getByRole("dialog");
  await expect(
    page
      .locator(".signal-menu")
      .getByRole("link", { name: /Account & sign out/ }),
  ).toHaveAttribute("href", "/profile");
  await expect(
    page
      .locator(".signal-menu")
      .getByRole("link", { name: /Home Assistant settings/ }),
  ).toHaveAttribute("href", "/config/dashboard");
  await expect(
    page
      .locator(".signal-menu")
      .getByRole("link", { name: /Open standard Home Assistant/ }),
  ).toHaveAttribute("href", /disable_km/);
  await page.goBack();
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(/#signal\/safety$/);
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Home feels good." }),
  ).toBeVisible();
});
test("sensor details distinguish offline and alarm, load history, and gate native UI", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    (window as any).nativeEvents = [];
    document.addEventListener("hass-more-info", (e: any) =>
      (window as any).nativeEvents.push(e.detail),
    );
    (window as any).demo.setState("binary_sensor.kitchen", "unavailable");
  });
  await page.locator(".sensor").first().click();
  const dialog = page.getByRole("dialog");
  await expect(page.locator("signal-details .summary")).toContainText(
    "Unavailable",
  );
  await expect(page.locator("signal-details")).toContainText("Recent history");
  expect(await page.evaluate(() => (window as any).nativeEvents)).toEqual([]);
  await page.evaluate(() =>
    (window as any).demo.setState("binary_sensor.kitchen", "on"),
  );
  await expect(page.locator("signal-details .summary")).toContainText(
    "Water detected",
  );
  await page
    .locator("signal-details")
    .getByRole("button", { name: "Advanced in Home Assistant" })
    .click();
  await expect(dialog).toHaveCount(0);
  await expect
    .poll(() => page.evaluate(() => (window as any).nativeEvents))
    .toEqual([{ entityId: "binary_sensor.kitchen" }]);
});
test("weather sheet loads provider forecast and closes from the backdrop", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Weather details" }).click();
  const dialog = page.getByRole("dialog");
  await expect(page.locator("signal-details .record")).toHaveCount(5);
  await page.mouse.click(5, 5);
  await expect(dialog).toHaveCount(0);
});
test("standalone controls and metrics open matching sheets", async ({
  page,
}) => {
  await page.goto("/components.html");
  await page
    .locator('[data-entity="light.reading"]')
    .getByRole("button", { name: "Device details" })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(
    page
      .locator("signal-details")
      .getByRole("slider", { name: "Brightness", exact: true }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Close details" }).click();
  await expect(dialog).toHaveCount(0);
  await page.locator("signal-metric").first().getByRole("button").click();
  await expect(
    page
      .locator("signal-details")
      .getByRole("slider", { name: "History cursor" }),
  ).toBeVisible();
});
for (const width of [360, 390, 768, 1440])
  test(`sheet fits ${width}px in dark mode, supports swipe and reduced motion`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await setAppearance(page, "dark");
    await page
      .getByRole("button", { name: "Climate details", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toHaveClass("dark");
    const box = await dialog.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
    expect(box!.y + box!.height).toBeLessThanOrEqual(845);
    expect(
      await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    ).toBe(true);
    expect(await dialog.evaluate((el) => el.getAnimations().length)).toBe(0);
    const header = await dialog.locator("header").boundingBox();
    await page.mouse.move(header!.x + 35, header!.y + 30);
    await page.mouse.down();
    await page.mouse.move(header!.x + 35, header!.y + 110);
    await page.mouse.up();
    await expect(dialog).toHaveCount(0);
  });
