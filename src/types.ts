export interface Entity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
}
export interface Hass {
  connection?: object;
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
  graphs?: (string | { entity: string; name?: string; hours?: number })[];
  appearance?: "light" | "dark" | "auto" | "system";
  immersive?: boolean;
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
