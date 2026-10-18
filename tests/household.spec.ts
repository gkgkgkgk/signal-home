import { navigate } from "./navigation";
import { test, expect } from "@playwright/test";
async function setup(page: any) {
  await page.goto("/");
  await page.evaluate(() => {
    const c = document.querySelector("signal-home") as any;
    const entities = ["light.fado", "light.gram", "switch.lamp"];
    const states = { ...c.hass.states };
    entities.forEach(
      (id, i) =>
        (states[id] = {
          entity_id: id,
          state: i === 0 ? "on" : "off",
          attributes: {
            friendly_name: ["FADO", "Gram Lamp", "Record Player Lamp"][i],
            supported_color_modes: i === 2 ? undefined : ["brightness"],
            brightness: i === 0 ? 180 : 0,
          },
        }),
    );
    ["script.room_on", "script.room_off", "script.all_off"].forEach(
      (id) => (states[id] = { entity_id: id, state: "off", attributes: {} }),
    );
    states["input_select.house_mode"] = {
      entity_id: "input_select.house_mode",
      state: "Home",
      attributes: { options: ["Home", "Sleeping", "Away"] },
    };
    states["binary_sensor.basement_door"] = { entity_id: "binary_sensor.basement_door", state: "off", attributes: { friendly_name: "Basement Door", device_class: "opening" } };
    states["binary_sensor.kitchen_door"] = { entity_id: "binary_sensor.kitchen_door", state: "off", attributes: { friendly_name: "Kitchen Door", device_class: "opening" } };
    const original = c.hass.callService;
    const callService = async (domain: string, service: string, data: any) => {
      if (["script", "scene", "input_select"].includes(domain)) {
        (window as any).demo.calls.push({ domain, service, data });
        if ((window as any).demo.fail) throw new Error("Offline");
        return;
      }
      await original(domain, service, data);
    };
    c.hass = { ...c.hass, states, callService };
    c.setConfig({
      ...c.config,
      home_mode: "input_select.house_mode",
      sensors: [...c.config.sensors, {entity:"binary_sensor.basement_door",name:"Basement Door"},{entity:"binary_sensor.kitchen_door",name:"Kitchen Door"}],
      quick_actions: [{ name: "All lights off", entity: "script.all_off" }],
      light_rooms: [
        {
          id: "living",
          name: "Living Room",
          entities,
          on_script: "script.room_on",
          off_script: "script.room_off",
        },
      ],
    });
  });
}
for (const width of [390, 1440])
  test(`home priorities and room controls at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await setup(page);
    await expect(page.locator("[data-row=climate]")).toContainText("72");
    await expect(page.locator('[data-row="mode"]')).toContainText("Home");
    await expect(page.locator(".quick-actions")).toHaveCount(0);
    await page.getByRole("button", { name: "Lighting", exact: true }).click();
    await expect(page.getByText("1 of 3 on", { exact: true })).toBeVisible();
    await page.getByRole("switch", { name: "Living Room lights" }).click();
    expect(
      await page.evaluate(() =>
        (window as any).demo.calls.find(
          (x: any) => x.data?.entity_id === "script.room_off",
        ),
      ),
    ).toMatchObject({ domain: "script", service: "turn_on" });
    await page.getByRole("button", { name: "Open Living Room" }).click();
    await expect(page.locator("signal-control")).toHaveCount(3);
    await expect(
      page.locator("signal-control").nth(2).getByRole("slider"),
    ).toHaveCount(0);
    await expect(
      page
        .locator("signal-control")
        .first()
        .getByRole("slider", { name: "Brightness" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "All lighting" })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
    await page.screenshot({
      path: `/tmp/signal-household-lights-${width}.png`,
      fullPage: true,
    });
  });
test("room unavailable states and failed scripts remain honest", async ({
  page,
}) => {
  await setup(page);
  await page.getByRole("button", { name: "Lighting", exact: true }).click();
  await page.evaluate(() => {
    const c = document.querySelector("signal-home") as any;
    c.hass = {
      ...c.hass,
      states: {
        ...c.hass.states,
        "light.gram": {
          entity_id: "light.gram",
          state: "unavailable",
          attributes: {},
        },
      },
    };
    (window as any).demo.fail = true;
  });
  await expect(
    page.getByText("1 of 3 on · 1 unavailable", { exact: true }),
  ).toBeVisible();
  await page.getByRole("switch", { name: "Living Room lights" }).click();
  await expect(page.getByRole("alert")).toContainText("didn’t go through");
  await expect(
    page.getByRole("switch", { name: "Living Room lights" }),
  ).toHaveAttribute("aria-checked", "true");
});
test("current temperature stays prominent while target and activity change", async ({
  page,
}) => {
  await setup(page);
  await navigate(page, "Climate");
  await page
    .getByRole("button", { name: "Increase target temperature" })
    .click();
  await expect(page.locator(".dial-value")).toContainText("72");
  await expect(page.locator(".stepper")).toContainText("Heat below 71");
  await page.evaluate(() =>
    (window as any).demo.setClimate({ hvac_action: "cooling" }),
  );
  await expect(page.locator(".climate")).toHaveAttribute(
    "data-activity",
    "cooling",
  );
  await page.waitForTimeout(500);
  await page.screenshot({
    path: "/tmp/signal-household-home.png",
    fullPage: true,
  });
});
test("mode only changes the household helper", async ({ page }) => {
  await setup(page);
  await navigate(page, "Security");
  await expect(page.getByRole("region", { name: "Doors" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Water" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Doors" }).locator(".sensor svg path").first()).toHaveAttribute("d", "M4 21V3h16v18M7 21V5h10v16M14 13h.01");
  await page.locator(".security-mode-option.mode-sleeping").click();
  expect(
    await page.evaluate(() =>
      (window as any).demo.calls.filter(
        (x: any) => x.domain && x.service !== "get_items",
      ),
    ),
  ).toEqual([
    {
      domain: "input_select",
      service: "select_option",
      data: { entity_id: "input_select.house_mode", option: "Sleeping" },
    },
  ]);
});
test("Alarmo mode shows confirmed state and arms through the alarm panel", async ({ page }) => {
  await setup(page);
  await page.evaluate(() => {
    const c = document.querySelector("signal-home") as any;
    c.hass = {
      ...c.hass,
      states: {
        ...c.hass.states,
        "alarm_control_panel.alarmo": {
          entity_id: "alarm_control_panel.alarmo",
          state: "disarmed",
          attributes: { arm_mode: null },
        },
      },
      callService: async (domain: string, service: string, data: any) => {
        (window as any).demo.calls.push({ domain, service, data });
      },
    };
    c.setConfig({ ...c.config, alarm_entity: "alarm_control_panel.alarmo" });
  });
  await expect(page.locator('[data-row="mode"]')).toContainText("Home · alarm disarmed");
  await navigate(page, "Security");
  await expect(page.getByRole("heading", { name: "Home · alarm off" })).toBeVisible();
  await expect(page.getByRole("group", { name: "Alarm controls" })).toContainText("Alarm system · off");
  await page.locator(".security-mode-option.mode-sleeping").click();
  expect(await page.evaluate(() => (window as any).demo.calls.at(-1))).toEqual({
    domain: "alarm_control_panel",
    service: "alarm_arm_night",
    data: { entity_id: "alarm_control_panel.alarmo" },
  });
  await page.evaluate(() => {
    const c = document.querySelector("signal-home") as any;
    c.hass = { ...c.hass, states: { ...c.hass.states,
      "alarm_control_panel.alarmo": {
        entity_id: "alarm_control_panel.alarmo", state: "pending",
        attributes: { arm_mode: "armed_night", delay: 30 },
        last_updated: new Date(Date.now() - 5000).toISOString(),
      },
    } };
  });
  await expect(page.getByRole("heading", { name: "Sleeping · door opened" })).toBeVisible();
  await expect(page.getByRole("timer")).toContainText(/Before siren25s/);
  await expect(page.locator(".security-mode-option.mode-sleeping")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".security-mode-option.mode-away")).toBeDisabled();
  await page.getByRole("button", { name: "Turn alarm off" }).click();
  expect(await page.evaluate(() => (window as any).demo.calls.at(-1))).toEqual({
    domain: "alarm_control_panel",
    service: "alarm_disarm",
    data: { entity_id: "alarm_control_panel.alarmo" },
  });
  await page.evaluate(() => {
    const c = document.querySelector("signal-home") as any;
    c.hass = { ...c.hass, states: { ...c.hass.states,
      "alarm_control_panel.alarmo": {
        entity_id: "alarm_control_panel.alarmo", state: "arming",
        attributes: { arm_mode: "armed_away", delay: 60 },
        last_updated: new Date(Date.now() - 10000).toISOString(),
      },
    } };
  });
  await expect(page.getByRole("heading", { name: "Away · arming" })).toBeVisible();
  await expect(page.getByRole("timer")).toContainText(/Arming50s/);
  await expect(page.locator(".security-mode-option.mode-away .mode-progress")).toBeVisible();
  await expect(page.locator(".security-mode-option.mode-sleeping")).toBeDisabled();
  await page.evaluate(() => {
    const c = document.querySelector("signal-home") as any;
    c.hass = { ...c.hass, states: { ...c.hass.states,
      "alarm_control_panel.alarmo": {
        entity_id: "alarm_control_panel.alarmo", state: "triggered",
        attributes: { arm_mode: "armed_away" },
      },
    } };
  });
  await expect(page.getByRole("heading", { name: "Away · alarm sounding" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Disarm and silence" })).toBeEnabled();
});
test("room scenes can run before first activation and notes use backend state", async ({
  page,
}) => {
  await setup(page);
  await page.evaluate(() => {
    const c = document.querySelector("signal-home") as any;
    c.hass = {
      ...c.hass,
      states: {
        ...c.hass.states,
        "scene.reading": {
          entity_id: "scene.reading",
          state: "unknown",
          attributes: {},
        },
        "sensor.light_note": {
          entity_id: "sensor.light_note",
          state: "Turns on at 6 PM",
          attributes: { next_change_at: new Date(Date.now()+3600000).toISOString() },
        },
      },
    };
    c.setConfig({
      ...c.config,
      light_rooms: [
        {
          ...c.config.light_rooms[0],
          scenes: [{ name: "Reading", entity: "scene.reading" }],
          automation_note_entity: "sensor.light_note",
        },
      ],
    });
  });
  await page.getByRole("button", { name: "Lighting", exact: true }).click();
  await expect(page.getByText("Turns on at 6 PM")).toBeVisible();
  await page.getByRole("button", { name: "Open Living Room" }).click();
  await page.getByRole("button", { name: "Reading", exact: true }).click();
  expect(
    await page.evaluate(() =>
      (window as any).demo.calls.find(
        (x: any) => x.data?.entity_id === "scene.reading",
      ),
    ),
  ).toMatchObject({ domain: "scene", service: "turn_on" });
});
