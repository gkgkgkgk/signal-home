export interface Entity {
  entity_id: string;
  last_updated?: string;
  last_changed?: string;
  last_reported?: string;
  state: string;
  attributes: Record<string, any>;
}
export interface Hass {
  connection?: { connected?: boolean };
  auth?: {
    external?: { fireMessage(message: { type: "theme-update" }): void };
  };
  states: Record<string, Entity>;
  user?: { id?: string; name: string; is_admin?: boolean };
  locale?: { language: string };
  config?: { unit_system?: { temperature?: string }; time_zone?: string };
  callService(
    domain: string,
    service: string,
    data: Record<string, unknown>,
  ): Promise<unknown>;
  callWS<T = any>(message: Record<string, unknown>): Promise<T>;
}
export interface SensorConfig {
  entity: string;
  name?: string;
  battery?: string;
  /** A real-world open/close test has not confirmed this sensor's reported state. */
  unverified?: boolean;
}
export interface QuickAction { name: string; entity: string }
export interface LightRoom {
  id: string; name: string; entities: string[];
  on_script: string; off_script: string;
  scenes?: QuickAction[];
  automation_note_entity?: string;
  /** Outdoor rooms (a porch) stay on overnight by design, so Home does not nag about them. */
  outdoor?: boolean;
}
export interface Config {
  type: string;
  title?: string;
  greeting?: string;
  header_label?: string;
  climate?: string;
  weather?: string;
  todo?: string;
  completed_retention_days?: number;
  humidity?: string;
  sensors?: (string | SensorConfig)[];
  favorites?: string[];
  cameras?: string[];
  /** Cameras that run only while alarm_entity is armed; Signal shows them as off otherwise. */
  alarm_cameras?: string[];
  light_rooms?: LightRoom[];
  quick_actions?: QuickAction[];
  home_mode?: string;
  alarm_entity?: string;
  alarm_sensors?: string[];
  alarm_siren?: string;
  all_lights_off?: string;
  /** Label ID marking the automations listed on the Automations page; default show_in_signal. */
  automation_label?: string;
  doorbell?: { entity: string; camera: string; instance?: string; activity_entity?: string };
  graphs?: (string | { entity: string; name?: string; hours?: number })[];
  appearance?: "light" | "dark" | "auto" | "system";
  immersive?: boolean;
  upcoming?: { waste_entity?: string; hebcal_zip?: string };
}
export interface Todo {
  uid: string;
  summary: string;
  status: string;
  completed?: string | null;
}
export const available = (e?: Entity): e is Entity =>
  !!e && !["unknown", "unavailable"].includes(e.state);
export const number = (v: unknown): number | undefined =>
  v !== null && v !== undefined && v !== "" && Number.isFinite(Number(v))
    ? Number(v)
    : undefined;
export const words = (v?: string) =>
  v === "partlycloudy"
    ? "Partly cloudy"
    : (v || "Unavailable").replaceAll("_", " ").replaceAll("-", " ");
export const sensorConfig = (v: string | SensorConfig): SensorConfig =>
  typeof v === "string" ? { entity: v } : v;
