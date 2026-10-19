import { navigate } from "./navigation";
import { test, expect } from "@playwright/test";

for (const width of [390, 1440])
  test(`automations page pairs shared automations at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await navigate(page, "Automations");
    await expect(page).toHaveURL(/#signal\/automations$/);
    const lamps = page.getByRole("switch", { name: "Lamp schedule" });
    const sleeping = page.getByRole("switch", { name: "Sleeping mode, 1 AM to 5 AM" });
    await expect(lamps).toHaveAttribute("aria-checked", "true");
    await expect(sleeping).toHaveAttribute("aria-checked", "false");
    await expect(page.getByText("Lights off at night · Lights on in the morning")).toBeVisible();
    // Unlabeled automations and labeled non-automations stay hidden.
    await expect(page.getByRole("switch")).toHaveCount(2);
    await expect(page.getByText("Sound siren")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await lamps.click();
    await expect(lamps).toHaveAttribute("aria-checked", "false");
    expect(await page.evaluate(() => (window as any).demo.calls.filter((c: any) => c.domain === "automation"))).toEqual([
      { domain: "automation", service: "turn_off", data: { entity_id: ["automation.lights_off", "automation.lights_on"] } },
    ]);

    await page.evaluate(() => (window as any).demo.setState("automation.lights_on", "on"));
    await expect(lamps).toHaveAttribute("aria-checked", "mixed");
    await expect(page.getByText("1 of 2 on")).toBeVisible();
    await lamps.click();
    await expect(lamps).toHaveAttribute("aria-checked", "true");
    expect(await page.evaluate(() => (window as any).demo.calls.filter((c: any) => c.domain === "automation").at(-1).service)).toBe("turn_on");

    await page.evaluate(() => ((window as any).demo.fail = true));
    await sleeping.click();
    await expect(page.getByRole("alert")).toHaveText("Sleeping mode, 1 AM to 5 AM didn’t switch on. Try again.");
    await expect(sleeping).toHaveAttribute("aria-checked", "false");
  });

test("automations page explains how to share automations when none are labeled", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const c = document.querySelector("signal-home") as any;
    c.setConfig({ ...c.config, automation_label: "nothing_here" });
  });
  await navigate(page, "Automations");
  await expect(page.getByText("No automations are shared with Signal yet.", { exact: false })).toBeVisible();
});

test("automations page offers a retry when the registry can't load", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => ((window as any).demo.fail = true));
  await navigate(page, "Automations");
  await expect(page.getByRole("alert")).toHaveText("Couldn’t load automations from Home Assistant.");
  await page.evaluate(() => ((window as any).demo.fail = false));
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("switch", { name: "Lamp schedule" })).toBeVisible();
});
