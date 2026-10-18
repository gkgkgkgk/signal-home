import {navigate} from "./navigation";
import { test, expect } from "@playwright/test";
import { setAppearance } from "../scripts/appearance.mjs";
test("climate range actions preserve other limit and respect bounds", async ({
  page,
}) => {
  await page.goto("/#signal/climate");
  await expect(page.getByRole("combobox", { name: "HVAC mode" })).toHaveValue(
    "heat_cool",
  );
  await page
    .getByRole("button", { name: "Increase target temperature" })
    .click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as any).demo.calls
          .filter((c: any) => c.service === "set_temperature")
          .at(-1),
      ),
    )
    .toEqual({
      domain: "climate",
      service: "set_temperature",
      data: {
        entity_id: "climate.demo",
        target_temp_low: 71,
        target_temp_high: 76,
      },
    });
  await page.getByRole("button", { name: "Cool 76°" }).click();
  await page
    .getByRole("button", { name: "Decrease target temperature" })
    .click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as any).demo.calls
            .filter((c: any) => c.service === "set_temperature")
            .at(-1).data,
      ),
    )
    .toEqual({
      entity_id: "climate.demo",
      target_temp_low: 71,
      target_temp_high: 75,
    });
  await page.evaluate(() =>
    (window as any).demo.setClimate({ target_temp_high: 71 }),
  );
  await expect(
    page.getByRole("button", { name: "Decrease target temperature" }),
  ).toBeDisabled();
});
test("unavailable and off thermostat disables controls; service failure is visible", async ({
  page,
}) => {
  await page.goto("/#signal/climate");
  await page.evaluate(() =>
    (window as any).demo.setState("climate.demo", "unavailable"),
  );
  await expect(
    page.getByRole("button", { name: "Increase target temperature" }),
  ).toBeDisabled();
  await page.evaluate(() =>
    (window as any).demo.setClimate({ temperature: 72 }, "off"),
  );
  await expect(
    page.getByRole("button", { name: "Increase target temperature" }),
  ).toBeDisabled();
  await page.evaluate(() => {
    (window as any).demo.setClimate({ temperature: 72 }, "heat");
    (window as any).demo.fail = true;
  });
  await page
    .getByRole("button", { name: "Increase target temperature" })
    .click();
  await expect(page.getByRole("status")).toContainText("didn’t go through");
});
test("grocery add and completion use entity UID and stay synchronized", async ({
  page,
}) => {
  await page.goto("/");
  await navigate(page, "Lists");
  await page
    .getByRole("textbox", { name: "New task" })
    .fill("Coffee beans");
  await page.getByRole("button", { name: "Add task" }).click();
  await expect(
    page.getByRole("button", { name: "Complete Coffee beans" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Complete Fresh lemons" }).click();
  await expect(
    page.getByRole("button", { name: "Complete Fresh lemons" }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () =>
        (window as any).demo.calls.find((c: any) => c.service === "update_item")
          .data.item,
    ),
  ).toBe("1");
});

test("navigation supports browser back and refresh; failed mode change resets display", async ({
  page,
}) => {
  await page.goto("/");
  await navigate(page, "Climate");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Just your temperature." }),
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.locator("signal-digest h1"),
  ).toBeVisible();
  await navigate(page, "Climate");
  await page.evaluate(() => ((window as any).demo.fail = true));
  await page.getByRole("combobox", { name: "HVAC mode" }).selectOption("off");
  await expect(page.getByRole("status")).toContainText("didn’t go through");
  await expect(page.getByRole("combobox", { name: "HVAC mode" })).toHaveValue(
    "heat_cool",
  );
});
test("dark preference persists and unavailable safety never claims clear", async ({
  page,
}) => {
  await page.goto("/");
  await setAppearance(page, "dark");
  await page.reload();
  await expect(page.locator("signal-home .app")).toHaveClass(/dark/);
  expect(
    await page
      .locator("signal-digest h1")
      .evaluate((el) => getComputedStyle(el).color),
  ).toBe("rgb(240, 242, 233)");
  await page.evaluate(() =>
    (window as any).demo.setState("binary_sensor.kitchen", "unavailable"),
  );
  await expect(page.locator("signal-digest h1")).toContainText(
    "Kitchen sink offline",
  );
  await navigate(page, "Security");
  await expect(
    page.getByRole("button", { name: /Offline Kitchen sink/ }),
  ).toBeVisible();
  // An offline sensor says when it went offline, not a stale "last reported" claim.
  await expect(
    page.getByRole("button", { name: /Offline Kitchen sink/ }).locator(".sensor-sub"),
  ).toContainText(/^\s*Offline since /);
});
for (const width of [360, 390, 768, 1440])
  test(`responsive ${width}px has no overflow and reduced motion works`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(
      page.locator("signal-digest h1"),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .locator(".page")
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("none");
    const nav =
      width <= 760
        ? page.getByRole("navigation", { name: "Mobile navigation" })
        : page.getByRole("navigation", { name: "Dashboard navigation" });
    await navigate(page, "Security");
    await expect(
      page.getByRole("heading", { name: "Peace of mind." }),
    ).toBeVisible();
  });
