export async function setupDigest(page: any, active = false) {
  await page.clock.setFixedTime(new Date("2026-10-02T18:14:00Z"));
  await page.route("https://www.hebcal.com/hebcal?**", (route: any) =>
    route.fulfill({ contentType: "application/json", body: JSON.stringify({ items: [
      { title: "Candle lighting: 6:41pm", date: "2026-10-02T18:41:00-04:00", category: "candles", memo: "Parashat Bereshit" },
      { title: "Parashat Bereshit", date: "2026-10-03", category: "parashat" },
      { title: "Havdalah: 7:40pm", date: "2026-10-03T19:40:00-04:00", category: "havdalah" },
      { title: "Sukkot I", date: "2026-10-07", category: "holiday", subcat: "major" },
    ] }) }),
  );
  await page.goto("/");
  await page.route("**/digest-preview.svg", (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="#cad2c7"/><path d="M0 360V140L320 10l320 130v220" fill="#b8b1a1"/><path d="M230 360V80h180v280" fill="#4c5c51"/><path d="M252 105h136v116H252" fill="#84958a"/><circle cx="380" cy="255" r="8" fill="#e4c77f"/><path d="M90 360v-65q0-65 48-65t48 65v65" fill="#354742"/><circle cx="138" cy="188" r="35" fill="#8a9c8e"/><text x="20" y="32" font-family="sans-serif" font-size="18" fill="#25332b">FRONT DOOR · ILLUSTRATIVE TEST EVENT</text></svg>`,
    }),
  );

  await page.evaluate((active: boolean) => {
    const card = document.querySelector("signal-home") as any;
    const now = new Date().toISOString();
    const eventTime = Date.now() / 1000 - 1200;
    const states = { ...card.hass.states };
    const entity = (id: string, state: string, attributes: any = {}) =>
      (states[id] = { entity_id: id, state, attributes, last_updated: now });
    Object.values(states).forEach((e: any) => (e.last_updated = now));
    entity("input_select.home_mode", "Home", {
      options: ["Home", "Sleeping", "Away"],
    });
    entity("binary_sensor.back_door", active ? "on" : "off", {
      friendly_name: "Back door",
      device_class: "door",
    });
    entity("lock.front_door", "locked", { friendly_name: "Front door lock" });
    entity("camera.front_door", "idle");
    entity("automation.doorbell", "on", {
      last_triggered: active ? new Date(eventTime * 1000).toISOString() : null,
    });
    ["light.fado", "light.gram", "switch.lamp"].forEach((id, i) =>
      entity(id, "on", {
        friendly_name: ["FADO", "Gram Lamp", "Record Player Lamp"][i],
        supported_color_modes: i === 2 ? undefined : ["brightness"],
        brightness: 200,
      }),
    );
    ["script.room_on", "script.room_off", "script.all_off"].forEach((id) =>
      entity(id, "off"),
    );
    const config = {
      ...card.config,
      appearance: "light",
      greeting: undefined,
      home_mode: "input_select.home_mode",
      all_lights_off: "script.all_off",
      doorbell: {
        entity: "camera.front_door",
        camera: "front_door",
        activity_entity: "automation.doorbell",
      },
      cameras: ["camera.front_door"],
      sensors: [
        ...card.config.sensors,
        { entity: "binary_sensor.back_door", name: "Back door" },
        "lock.front_door",
      ],
      light_rooms: [
        {
          id: "living",
          name: "Living Room",
          entities: ["light.fado", "light.gram", "switch.lamp"],
          on_script: "script.room_on",
          off_script: "script.room_off",
        },
      ],
    };
    const originalWS = card.hass.callWS.bind(card.hass);
    const calls: any[] = [];
    const requests: any[] = [];
    const fixture: any = {
      calls,
      requests,
      states,
      fail: false,
      eventTime,
      event: active,
      publish: () => {
        card.hass = { ...card.hass, states: { ...states } };
      },
    };
    (window as any).digestFixture = fixture;
    card.hass = {
      ...card.hass,
      connection: { connected: true },
      config: { ...card.hass.config, time_zone: "America/New_York" },
      states,
      callService: async (domain: string, service: string, data: any) => {
        calls.push({ domain, service, data });
        if (fixture.fail) throw new Error("Offline");
        if (domain === "input_select")
          states[data.entity_id].state = data.option;
        if (domain === "climate")
          Object.assign(states[data.entity_id].attributes, data);
        fixture.publish();
      },
      callWS: async (message: any) => {
        requests.push(message);
        if (message.type === "frigate/reviews/get") {
          if (fixture.failEvents) throw new Error("Offline");
          return fixture.event
            ? [
                {
                  id: `${eventTime}.000000-visit`,
                  camera: "front_door",
                  start_time: eventTime,
                  end_time: eventTime + 30,
                  data: { objects: ["doorbell"] },
                },
              ]
            : [];
        }
        if (message.type === "auth/sign_path")
          return { path: "/digest-preview.svg" };
        return originalWS(message);
      },
    };
    card.setConfig(config);
  }, active);
  await page
    .locator('signal-digest [data-row="doorbell"] .timestamp')
    .filter({ hasText: /Checked|At/ })
    .waitFor();
}
