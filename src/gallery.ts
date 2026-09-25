import "./index";
import type { Entity, Hass } from "./types";
const states: Record<string, Entity> = {};
const calls: Record<string, unknown>[] = [];
const cards: any[] = [];
let dark = false;
const fixtures: [string, string, string, Record<string, unknown>, string][] = [
  ["switch.coffee", "Coffee corner", "on", {}, "apricot"],
  [
    "light.reading",
    "Reading nook",
    "on",
    {
      brightness: 178,
      supported_color_modes: ["color_temp", "rgb"],
      rgb_color: [255, 191, 115],
      color_temp_kelvin: 3000,
      min_color_temp_kelvin: 2200,
      max_color_temp_kelvin: 6500,
    },
    "mint",
  ],
  [
    "cover.living",
    "Let the light in",
    "open",
    { current_position: 68, supported_features: 15 },
    "lilac",
  ],
  [
    "media_player.living",
    "Living room",
    "playing",
    {
      media_title: "Sunday kind of feeling",
      media_artist: "Your favorite mix",
      volume_level: 0.35,
      supported_features: 16437,
    },
    "apricot",
  ],
  [
    "fan.bedroom",
    "A little breeze",
    "on",
    { percentage: 40, percentage_step: 10, supported_features: 1 },
    "mint",
  ],
  ["scene.evening", "Evening mode", "unknown", {}, "lilac"],
  [
    "input_number.level",
    "Focus level",
    "60",
    { min: 0, max: 100, step: 5, unit_of_measurement: "%" },
    "lime",
  ],
  [
    "input_select.mood",
    "Set the mood",
    "Easy morning",
    { options: ["Easy morning", "Deep focus", "Slow evening"] },
    "apricot",
  ],
  ["lock.front", "Front door", "locked", {}, "lilac"],
];
for (const [id, name, state, attributes] of fixtures)
  states[id] = {
    entity_id: id,
    state,
    attributes: { friendly_name: name, ...attributes },
  };
states["sensor.temperature"] = {
  entity_id: "sensor.temperature",
  state: "72",
  attributes: {
    friendly_name: "Room temperature",
    unit_of_measurement: "°F",
    device_class: "temperature",
  },
};
states["sensor.humidity"] = {
  entity_id: "sensor.humidity",
  state: "48",
  attributes: {
    friendly_name: "Humidity",
    unit_of_measurement: "%",
    device_class: "humidity",
  },
};
states["sensor.battery"] = {
  entity_id: "sensor.battery",
  state: "96",
  attributes: { friendly_name: "Sensor battery", unit_of_measurement: "%" },
};
const update = () =>
  cards.forEach((card) => (card.hass = { ...hass, states: { ...states } }));
const hass: Hass = {
  states,
  locale: { language: "en" },
  async callService(domain, service, data) {
    calls.push({ domain, service, data });
    await new Promise((resolve) => setTimeout(resolve, 160));
    if ((window as any).gallery.fail) throw new Error("Simulated offline");
    const id = data.entity_id as string;
    const e = states[id];
    let state = e.state;
    const a = { ...e.attributes };
    if (service === "turn_on") state = "on";
    if (service === "turn_off") state = "off";
    if (service === "set_value") state = String(data.value);
    if (service === "select_option") state = String(data.option);
    if (service === "lock") state = "locked";
    if (service === "unlock") state = "unlocked";
    if (service === "media_pause") state = "paused";
    if (service === "media_play") state = "playing";
    if (service === "open_cover") {
      state = "open";
      a.current_position = 100;
    }
    if (service === "close_cover") {
      state = "closed";
      a.current_position = 0;
    }
    if (service === "set_cover_position") a.current_position = data.position;
    if (data.brightness_pct !== undefined)
      a.brightness = Number(data.brightness_pct) * 2.55;
    for (const key of [
      "percentage",
      "volume_level",
      "rgb_color",
      "color_temp_kelvin",
    ])
      if (data[key] !== undefined) a[key] = data[key];
    states[id] = { ...e, state, attributes: a };
    update();
  },
  async callWS<T>(message: Record<string, unknown>): Promise<T> {
    calls.push(message);
    await new Promise((resolve) => setTimeout(resolve, 70));
    if ((window as any).gallery.historyFail)
      throw new Error("History unavailable");
    const id = (message.entity_ids as string[])[0];
    const start = Date.parse(String(message.start_time));
    const end = Date.parse(String(message.end_time));
    return {
      [id]: Array.from({ length: 97 }, (_, i) => ({
        lu: (start + ((end - start) * i) / 96) / 1000,
        s:
          i === 45
            ? "unavailable"
            : String(
                (id.includes("humidity") ? 48 : 72) +
                  Math.sin(i / 11) * 2 +
                  Math.cos(i / 4) * 0.4,
              ),
      })),
    } as T;
  },
};
function add(tag: string, container: string, config: Record<string, unknown>) {
  const card = document.createElement(tag) as any;
  card.demoConfig = { type: `custom:${tag}`, ...config, appearance: "light" };
  card.setConfig(card.demoConfig);
  card.dataset.entity = config.entity;
  cards.push(card);
  document.getElementById(container)!.append(card);
}
for (const [entity, , , , accent] of fixtures)
  add("signal-control", "controls", { entity, accent });
add("signal-graph", "graphs", {
  entity: "sensor.temperature",
  accent: "lilac",
});
add("signal-graph", "graphs", { entity: "sensor.humidity", accent: "mint" });
for (const [entity, accent] of [
  ["sensor.temperature", "apricot"],
  ["sensor.humidity", "mint"],
  ["sensor.battery", "lime"],
])
  add("signal-metric", "metrics", {
    entity,
    accent,
    ...(entity.includes("temperature") ? {} : { min: 0, max: 100 }),
  });
document.getElementById("theme")!.addEventListener("click", () => {
  dark = !dark;
  document.body.classList.toggle("dark", dark);
  document.getElementById("theme")!.textContent = dark
    ? "Light mode"
    : "Dark mode";
  cards.forEach((card) =>
    card.setConfig({ ...card.demoConfig, appearance: dark ? "dark" : "light" }),
  );
});
(window as any).gallery = {
  calls,
  fail: false,
  historyFail: false,
  setState(id: string, state: string) {
    states[id] = { ...states[id], state };
    update();
  },
  setAttributes(id: string, attributes: Record<string, unknown>) {
    states[id] = {
      ...states[id],
      attributes: { ...states[id].attributes, ...attributes },
    };
    update();
  },
};
update();
