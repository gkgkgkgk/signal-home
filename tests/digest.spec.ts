import { test, expect } from "@playwright/test";
import { setupDigest } from "./digest-fixture";
import { digestRows, digestSummary } from "../src/digest-model";
import { scheduledNote } from "../src/automation-note";

test("quiet phone digest and confirmed five-button navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setupDigest(page);
  await expect(page.locator("signal-digest h1")).toHaveText(
    "Quiet. 3 lights on, 72° and idle.",
  );
  await expect(page.locator(".dial")).toHaveCount(0);
  await expect(page.locator(".quick-actions")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Turn all off" })).toHaveCount(
    0,
  );
  const nav = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(nav.getByRole("button")).toHaveText([
    "Home",
    "Lighting",
    "Cameras",
    "Lists",
    "More",
  ]);
  await expect(page.locator('[data-row="doors"]')).toContainText(
    "All monitored doors closed and locks locked",
  );
  await page.waitForTimeout(350);
  await page.screenshot({
    path: "docs/digest-quiet-phone.png",
    fullPage: true,
  });
  await nav.getByRole("button", { name: "More" }).click();
  await expect(
    page.getByRole("dialog", { name: "More", exact: true }),
  ).toBeVisible();
  await page
    .locator("#more-sheet")
    .getByRole("button", { name: "Climate", exact: true })
    .click();
  await expect(page.locator(".dial")).toBeVisible();
  await expect(nav.getByRole("button", { name: "More" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await page.goBack();
  await expect(page.locator("signal-digest")).toBeVisible();
});
test("Home combines live collection state and Pittsburgh Jewish dates in an agenda", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setupDigest(page);
  await page.evaluate(() => {
    const card = document.querySelector("signal-home") as any;
    const states = { ...card.hass.states,
      "sensor.pghst_collection": {
        entity_id: "sensor.pghst_collection", state: "10-9-2026",
        attributes: { events: [
          { date: "2026-10-09", kind: "trash" },
          { date: "2026-10-09", kind: "recycling" },
          { date: "2026-10-16", kind: "trash" },
          { date: "2026-10-23", kind: "recycling" },
        ], checked_at: "2026-10-02T17:00:00Z" },
        last_reported: "2026-10-02T17:00:00Z",
      },
    };
    card.hass = { ...card.hass, states };
    card.setConfig({ ...card.config, upcoming: { waste_entity: "sensor.pghst_collection" } });
  });
  const agenda = page.locator("signal-upcoming");
  await expect(agenda.getByRole("heading", { name: "Coming up" })).toBeVisible();
  await expect(agenda.getByRole("link", { name: /Candle lighting/ })).toContainText("6:41 PM");
  await expect(agenda.getByRole("link", { name: /Trash pickup/ })).toBeVisible();
  await expect(agenda.getByRole("link", { name: /Recycling pickup/ })).toBeVisible();
  await expect(agenda.getByRole("link", { name: /Sukkot I/ })).toBeVisible();
  await expect(agenda.locator(".day")).toContainText(["Today", "Tomorrow", "Wednesday, Oct 7", "Friday, Oct 9"]);
  await expect(agenda.getByRole("link", { name: /Trash pickup, Friday, Oct 16/ })).toHaveCount(0);
  const expand = agenda.getByRole("button", { name: "Show next month" });
  await expect(expand).toHaveAttribute("aria-expanded", "false");
  await expand.click();
  await expect(agenda.getByRole("button", { name: "Show next week" })).toHaveAttribute("aria-expanded", "true");
  await expect(agenda.locator(".day")).toContainText(["Today", "Tomorrow", "Wednesday, Oct 7", "Friday, Oct 9", "Friday, Oct 16", "Friday, Oct 23"]);
  await agenda.getByRole("button", { name: "Show next week" }).click();
  await expect(agenda.locator(".day")).toContainText(["Today", "Tomorrow", "Wednesday, Oct 7", "Friday, Oct 9"]);
  await expect(agenda.getByText("Collection schedule unavailable")).toHaveCount(0);
  await agenda.scrollIntoViewIfNeeded();
  await page.screenshot({ path: "docs/upcoming-phone.png" });
});
test("active phone prioritizes open door and exact recorded doorbell event", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setupDigest(page, true);
  await expect(page.locator("signal-digest h1")).toHaveText("Back door open.");
  await expect(page.locator("signal-digest .row").first()).toHaveAttribute(
    "data-row",
    "doors",
  );
  await expect(page.locator('[data-row="doorbell"]')).toContainText(
    "Doorbell rang 20 min ago",
  );
  await expect(page.getByAltText("Recorded front-door activity")).toBeVisible();
  await page.waitForTimeout(350);
  await page.screenshot({
    path: "docs/digest-active-phone.png",
    fullPage: true,
  });
  await page.getByRole("link", { name: "View front door event" }).click();
  await expect(page).toHaveURL(/signal_review=.*visit.*#signal\/cameras/);
  expect(await page.locator("signal-digest").count()).toBe(0);
});
test("unverified doors do not become a clear claim until physically checked", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setupDigest(page);
  await page.evaluate(() => {
    const card = document.querySelector("signal-home") as any;
    const states = { ...card.hass.states };
    for (const [id, name] of [["binary_sensor.basement_door", "Basement Door"], ["binary_sensor.kitchen_door", "Kitchen Door"]]) {
      states[id] = { entity_id: id, state: "off", attributes: { device_class: "opening", friendly_name: name }, last_reported: "2026-10-02T14:00:00Z", last_updated: "2026-10-02T14:00:00Z" };
    }
    card.hass = { ...card.hass, states };
    card.setConfig({ ...card.config, sensors: [
      ...card.config.sensors,
      { entity: "binary_sensor.basement_door", name: "Basement Door", unverified: true },
      { entity: "binary_sensor.kitchen_door", name: "Kitchen Door", unverified: true },
    ] });
  });
  await expect(page.locator("signal-digest h1")).toHaveText("Door sensor status needs verification.");
  await expect(page.locator('[data-row="doors"]')).toContainText("last reported closed");
  await expect(page.locator('[data-row="doors"]')).not.toContainText("All monitored doors closed");
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("button", { name: "Lighting" }).click();
  await expect(page.locator("button.status-pill")).toContainText("2 sensors need verification");
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("button", { name: "More" }).click();
  await page.locator("#more-sheet").getByRole("button", { name: "Security" }).click();
  await expect(page.getByRole("region", { name: "Doors" }).locator(".sensor")).toContainText(["Needs verification", "Needs verification"]);
  await expect(page.getByRole("region", { name: "Doors" }).locator(".sensor").filter({ hasText: "Basement Door" }).locator(".sensor-sub")).toContainText("Last reported closed");
});
test("room entry is one card with independent toggle and individual controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setupDigest(page);
  await page.getByRole("button", { name: "Lighting", exact: true }).click();
  const pillColors = await page.locator("button.status-pill").evaluate((el) => {
    const style = getComputedStyle(el);
    return { text: style.color, background: style.backgroundColor };
  });
  expect(pillColors.text).not.toBe(pillColors.background);
  await expect(
    page.getByRole("button", { name: "Open Living Room" }),
  ).toBeVisible();
  await page.waitForTimeout(350);
  await page.screenshot({ path: "docs/rooms-phone.png", fullPage: true });
  await page.getByRole("switch", { name: "Living Room lights" }).click();
  expect(
    await page.evaluate(() => (window as any).digestFixture.calls),
  ).toEqual([
    {
      domain: "script",
      service: "turn_on",
      data: { entity_id: "script.room_off" },
    },
  ]);
  await expect(page.locator("signal-control")).toHaveCount(0);
  await page.getByRole("button", { name: "Open Living Room" }).click();
  await expect(page.locator("signal-control")).toHaveCount(3);
  await expect(
    page.locator("signal-control").nth(2).getByRole("slider"),
  ).toHaveCount(0);
  await page.waitForTimeout(350);
  await page.setViewportSize({ width: 390, height: 1500 });
  await page.screenshot({ path: "docs/room-detail-phone.png", fullPage: true });
});
test("offline data never becomes all closed and connection loss disables actions", async ({
  page,
}) => {
  await setupDigest(page);
  await page.evaluate(() => {
    const f = (window as any).digestFixture;
    f.states["binary_sensor.back_door"].state = "unavailable";
    f.publish();
  });
  await expect(page.locator("signal-digest h1")).toHaveText(
    "Back door offline.",
  );
  await expect(page.locator('[data-row="doors"]')).not.toContainText(
    "All monitored",
  );
  await page.evaluate(() => {
    const c = document.querySelector("signal-home") as any;
    c.hass = { ...c.hass, connection: { connected: false } };
  });
  await expect(page.locator("signal-digest h1")).toContainText(
    "Connection lost",
  );
  await expect(page.getByRole("button", { name: "Increase heat below temperature" })).toBeDisabled();
});
test("contextual lights-off and small thermostat adjustment use backend commands", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setupDigest(page);
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("button", { name: "More" }).click();
  await page.locator("#more-sheet").getByRole("button", { name: "Security" }).click();
  await page.locator(".security-mode-option.mode-sleeping").click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("button", { name: "Home" }).click();
  await page.getByRole("button", { name: "Turn all off" }).click();
  await page
    .getByRole("button", { name: "Increase heat below temperature" })
    .click();
  const calls = await page.evaluate(() => (window as any).digestFixture.calls);
  expect(calls).toContainEqual({
    domain: "script",
    service: "turn_on",
    data: { entity_id: "script.all_off" },
  });
  expect(calls).toContainEqual({
    domain: "climate",
    service: "set_temperature",
    data: {
      entity_id: "climate.demo",
      target_temp_low: 71,
      target_temp_high: 76,
    },
  });
  await expect(page.locator('[data-row="climate"]')).toContainText("72°, idle");
});
test("event fetch failure is explicit and stale event fades without inventing a visitor", async ({
  page,
}) => {
  await setupDigest(page, true);
  await page.evaluate(async () => {
    const d = document
      .querySelector("signal-home")!
      .shadowRoot!.querySelector("signal-digest") as any;
    (window as any).digestFixture.failEvents = true;
    await d.loadFront();
  });
  await expect(page.locator('[data-row="doorbell"]')).toContainText(
    "refresh failed",
  );
  await page.evaluate(() => {
    const d = document
      .querySelector("signal-home")!
      .shadowRoot!.querySelector("signal-digest") as any;
    d.now = new Date(Date.now() + 3 * 3600000);
  });
  await expect(page.locator('[data-row="doorbell"]')).toContainText(
    "Recent activity unavailable",
  );
  await expect(page.getByAltText("Recorded front-door activity")).toHaveCount(
    0,
  );
});
test("unknown timestamp remains unknown; missing sensor categories are explicit", () => {
  const hass: any = {
    states: {
      "climate.demo": {
        entity_id: "climate.demo",
        state: "off",
        attributes: {},
      },
    },
  };
  const rows = digestRows(
    hass,
    { type: "custom:signal-home", climate: "climate.demo" },
    {},
  );
  expect(rows.find((r) => r.id === "doors")?.text).toBe(
    "No door or lock sensors connected",
  );
  expect(rows.find((r) => r.id === "water")?.text).toBe(
    "No water sensors connected",
  );
  expect(rows.find((r) => r.id === "climate")?.stamp).toBeUndefined();
  expect(digestSummary(rows)).not.toContain("all closed");
});

test("inline target clamps to the opposite bound and reports failed commands", async ({
  page,
}) => {
  await setupDigest(page);
  await page.evaluate(() => {
    const f = (window as any).digestFixture;
    f.states["climate.demo"].attributes.target_temp_low = 76;
    f.publish();
  });
  await expect(
    page.getByRole("button", { name: "Increase heat below temperature" }),
  ).toBeDisabled();
  await page.evaluate(() => ((window as any).digestFixture.fail = true));
  await page
    .getByRole("button", { name: "Decrease heat below temperature" })
    .click();
  await expect(page.locator("signal-digest [role=alert]")).toContainText(
    "didn’t go through",
  );
  await expect(page.locator("[data-row=climate]")).toContainText(
    "Heat below 76°",
  );
});
test("relevance follows home time and duplicate room members count once", () => {
  const states: any = {
    "light.one": { entity_id: "light.one", state: "on", attributes: {} },
    "input_select.mode": {
      entity_id: "input_select.mode",
      state: "Home",
      attributes: {},
    },
  };
  const config: any = {
    type: "custom:signal-home",
    home_mode: "input_select.mode",
    all_lights_off: "script.all_off",
    light_rooms: [
      { name: "Living Room", entities: ["light.one", "light.one"] },
    ],
  };
  const hass: any = { states, config: { time_zone: "America/New_York" } };
  const noon = digestRows(
    hass,
    config,
    {},
    new Date("2026-10-02T16:00:00Z"),
  ).find((r) => r.id === "lights")!;
  expect(noon.text).toBe("1 light on in Living Room");
  expect(noon.action).toBeUndefined();
  const late = digestRows(
    hass,
    config,
    {},
    new Date("2026-10-03T03:00:00Z"),
  ).find((r) => r.id === "lights")!;
  expect(late.action).toBe("lights");
});
test("digest fits small dark phones and retains full desktop navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await setupDigest(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => {
    const c = document.querySelector("signal-home") as any;
    c.chooseAppearance("dark");
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  const widths = await page
    .locator("signal-digest .row")
    .evaluateAll((rows) => rows.map((el) => el.scrollWidth > el.clientWidth));
  expect(widths.some(Boolean)).toBe(false);
  await page.screenshot({ path: "docs/digest-dark-phone.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(
    page
      .getByRole("navigation", { name: "Dashboard navigation" })
      .getByRole("button"),
  ).toHaveText(["Home", "Lighting", "Cameras", "Lists", "Security", "Climate"]);
  await page.screenshot({ path: "docs/digest-desktop.png", fullPage: true });
});

test("automation notes require a known future change time", () => {
  const now = Date.now();
  const note: any = {
    entity_id: "sensor.note",
    state: "Hallway light turns off at 10:30",
    attributes: {},
  };
  expect(scheduledNote(note, now)).toBeUndefined();
  note.attributes.next_change_at = new Date(now - 60000).toISOString();
  expect(scheduledNote(note, now)).toBeUndefined();
  note.attributes.next_change_at = new Date(now + 60000).toISOString();
  expect(scheduledNote(note, now)).toBe(note.state);
});
