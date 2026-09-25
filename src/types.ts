export interface Entity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
}
export interface Hass {
  states: Record<string, Entity>;
  user?: { name: string; is_admin?: boolean };
  locale?: { language: string };
  config?: { unit_system?: { temperature?: string } };
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
  climate?: string;
  weather?: string;
  todo?: string;
  humidity?: string;
  sensors?: (string | SensorConfig)[];
  favorites?: string[];
  graphs?: (string | { entity: string; name?: string; hours?: number })[];
  appearance?: "light" | "dark" | "auto";
  immersive?: boolean;
}
export interface Todo {
  uid: string;
  summary: string;
  status: string;
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
