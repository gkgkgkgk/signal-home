import "./index";
import type { Entity, Hass, Todo } from "./types";
const card = document.querySelector("signal-home") as any;
const state = (
  entity_id: string,
  state: string,
  attributes: Record<string, unknown>,
): Entity => ({ entity_id, state, attributes });
let states: Record<string, Entity> = {
  "climate.demo": state("climate.demo", "heat_cool", {
    friendly_name: "Home",
    current_temperature: 72,
    current_humidity: 48,
    target_temp_low: 70,
    target_temp_high: 76,
    min_temp: 45,
    max_temp: 92,
    target_temp_step: 1,
    hvac_modes: ["off", "heat", "cool", "heat_cool"],
    hvac_action: "idle",
    supported_features: 3,
  }),
  "weather.demo": state("weather.demo", "partlycloudy", {
    temperature: 68,
    temperature_unit: "°F",
    humidity: 54,
    wind_speed: 6,
    wind_speed_unit: "mph",
  }),
  "sensor.humidity": state("sensor.humidity", "48", {}),
  "todo.demo": state("todo.demo", "3", { supported_features: 127 }),
  "binary_sensor.kitchen": state("binary_sensor.kitchen", "off", {
    device_class: "moisture",
    friendly_name: "Kitchen sink",
  }),
  "binary_sensor.laundry": state("binary_sensor.laundry", "off", {
    device_class: "moisture",
    friendly_name: "Laundry room",
  }),
  "binary_sensor.basement": state("binary_sensor.basement", "off", {
    device_class: "moisture",
    friendly_name: "Water heater",
  }),
  "sensor.battery": state("sensor.battery", "96", {}),
  "light.demo": state("light.demo", "off", { friendly_name: "Reading light" }),
};
let items: Todo[] = [
  { uid: "1", summary: "Fresh lemons", status: "needs_action" },
  { uid: "2", summary: "Oat milk", status: "needs_action" },
  { uid: "3", summary: "Something for Friday night", status: "needs_action" },
];
const calls: unknown[] = [];
const update = () => {
  card.hass = { ...hass, states: { ...states } };
};
const hass: Hass = {
  states,
  user: { name: "Alex" },
  locale: { language: "en" },
  config: { unit_system: { temperature: "°F" } },
  async callService(domain, service, data) {
    calls.push({ domain, service, data });
    await new Promise((r) => setTimeout(r, 160));
    if ((window as any).demo.fail) throw new Error("Simulated offline");
    const id = data.entity_id as string;
    if (domain === "climate") {
      const attributes = { ...states[id].attributes };
      if (service === "set_temperature") Object.assign(attributes, data);
      if (service === "set_hvac_mode") {
        states[id] = { ...states[id], state: data.hvac_mode as string };
        attributes.temperature = data.hvac_mode === "heat_cool" ? null : 72;
      }
      states[id] = { ...states[id], attributes };
    }
    if (domain === "todo") {
      if (service === "update_item")
        items = items.filter((i) => i.uid !== data.item);
      if (service === "add_item")
        items = [
          ...items,
          {
            uid: crypto.randomUUID(),
            summary: data.item as string,
            status: "needs_action",
          },
        ];
      states[id] = { ...states[id], state: String(items.length) };
    }
    if (domain === "light")
      states[id] = {
        ...states[id],
        state: states[id].state === "on" ? "off" : "on",
      };
    update();
  },
  async callWS<T>(message: Record<string, unknown>): Promise<T> {
    calls.push(message);
    if ((window as any).demo.fail) throw new Error("Simulated offline");
    return { response: { "todo.demo": { items } } } as T;
  },
};
card.setConfig({
  type: "custom:signal-home",
  title: "Our place",
  greeting: "Home feels good.",
  climate: "climate.demo",
  weather: "weather.demo",
  todo: "todo.demo",
  humidity: "sensor.humidity",
  appearance: "auto",
  sensors: [
    {
      entity: "binary_sensor.kitchen",
      name: "Kitchen sink",
      battery: "sensor.battery",
    },
    {
      entity: "binary_sensor.laundry",
      name: "Laundry room",
      battery: "sensor.battery",
    },
    {
      entity: "binary_sensor.basement",
      name: "Water heater",
      battery: "sensor.battery",
    },
  ],
});
(window as any).demo = {
  calls,
  fail: false,
  setState(id: string, value: string) {
    states[id] = { ...states[id], state: value };
    update();
  },
  setClimate(attributes: Record<string, unknown>, value?: string) {
    states["climate.demo"] = {
      ...states["climate.demo"],
      state: value || states["climate.demo"].state,
      attributes: { ...states["climate.demo"].attributes, ...attributes },
    };
    update();
  },
};
update();
