import {
  available,
  number,
  sensorConfig,
  type Config,
  type Entity,
  type Hass,
} from "./types";
import { homeHour } from "./appearance";
export interface DigestRow {
  id: string;
  label: string;
  text: string;
  route: string;
  icon: string;
  priority: number;
  tone?: "alert" | "notice";
  stamp?: string;
  timeLabel?: string;
  image?: string;
  review?: string;
  action?: "lights" | "climate";
}
export interface FrontActivity {
  checked?: string;
  error?: boolean;
  review?: {
    id: string;
    start_time: number;
    end_time: number | null;
    image?: string;
    doorbell?: boolean;
  };
}
export const stamp = (entities: (Entity | undefined)[]) => {
  const stamps = entities
    .map((e) => e?.last_reported || e?.last_updated)
    .filter((v): v is string => !!v && Number.isFinite(Date.parse(v)));
  return stamps.length === entities.length && stamps.length
    ? stamps.sort((a, b) => Date.parse(a) - Date.parse(b))[0]
    : undefined;
};
const name = (e: Entity | undefined, fallback: string) =>
  e?.attributes.friendly_name || fallback;
export function digestRows(
  hass: Hass,
  config: Config,
  front: FrontActivity,
  now = new Date(),
): DigestRow[] {
  const states = hass.states;
  const sensors = (config.sensors || [])
    .map(sensorConfig)
    .map((s) => ({
      id: s.entity,
      name: s.name || name(states[s.entity], s.entity),
      e: states[s.entity],
      unverified: !!s.unverified,
    }));
  const doors = sensors.filter(
    (s) =>
      ["door", "window", "opening", "garage_door"].includes(
        s.e?.attributes.device_class,
      ) || s.id.startsWith("lock."),
  );
  const water = sensors.filter(
    (s) => s.e?.attributes.device_class === "moisture",
  );
  const others = sensors.filter(
    (s) => !doors.includes(s) && !water.includes(s),
  );
  const rows: DigestRow[] = [];
  const sensorRow = (
    id: string,
    label: string,
    items: typeof sensors,
    normal: string,
    empty: string,
    icon: string,
  ) => {
    const unknown = items.filter((s) => !available(s.e));
    const active = items.filter((s) =>
      s.id.startsWith("lock.")
        ? available(s.e) && s.e.state !== "locked"
        : s.e?.state === "on",
    );
    const activeText = active
      .map(
        (s) =>
          `${s.name} ${id === "water" ? "reports water" : s.id.startsWith("lock.") ? s.e!.state : id === "doors" ? "open" : "active"}`,
      )
      .join("; ");
    const unknownText = unknown.map((s) => `${s.name} offline`).join("; ");
    const unverified = items.filter((s) => s.unverified && available(s.e) && !active.includes(s));
    const unverifiedText = unverified.length
      ? `${unverified.map((s) => s.name).join(" and ")} ${unverified.length === 1 ? "needs" : "need"} verification (last reported ${unverified.every((s) => s.e?.state === "off") ? "closed" : "state only"})`
      : "";
    rows.push({
      id,
      label,
      text:
        [activeText, unknownText, unverifiedText].filter(Boolean).join(" · ") ||
        (items.length ? normal : empty),
      route: "safety",
      icon,
      priority: active.length
        ? id === "water"
          ? 100
          : 90
        : unknown.length
          ? 80
          : unverified.length
            ? 65
          : items.length
            ? 15
            : 1,
      tone: active.length ? "alert" : unknown.length || unverified.length ? "notice" : undefined,
      stamp: stamp(items.map((s) => s.e)),
      timeLabel: unverified.length ? "Last report" : undefined,
    });
  };
  const locks = doors.filter((s) => s.id.startsWith("lock."));
  const openings = doors.filter((s) => !s.id.startsWith("lock."));
  const windows = openings.some((s) => s.e?.attributes.device_class === "window");
  sensorRow(
    "doors",
    "Doors & windows",
    doors,
    locks.length && openings.length
      ? "All monitored doors closed and locks locked"
      : locks.length
        ? "All monitored locks locked"
        : windows ? "All monitored doors & windows closed" : "All monitored doors closed",
    "No door or lock sensors connected",
    "lock",
  );
  sensorRow(
    "water",
    "Water",
    water,
    "All monitored sensors dry",
    "No water sensors connected",
    "drop",
  );
  if (others.length)
    sensorRow(
      "sensors",
      "Other sensors",
      others,
      "No active sensors",
      "No sensors connected",
      "shield",
    );
  const alarm = states[config.alarm_entity || ""];
  const mode = config.alarm_entity ? alarm : states[config.home_mode || ""];
  const alarmLabels: Record<string, string> = {
    disarmed: "Home · alarm disarmed",
    armed_night: "Sleeping · alarm armed",
    armed_away: "Away · alarm armed",
    arming: `${alarm?.attributes.arm_mode === "armed_night" ? "Sleeping" : "Away"} · arming`,
    pending: `${alarm?.attributes.arm_mode === "armed_night" ? "Sleeping" : "Away"} · door opened; siren countdown`,
    triggered: "Alarm sounding",
  };
  rows.push({
    id: "mode",
    label: config.alarm_entity ? "Alarm mode" : "Household mode",
    text: available(mode)
      ? config.alarm_entity ? alarmLabels[mode.state] || mode.state : `${mode.state} · saved preference`
      : config.alarm_entity ? "Alarm unavailable" : "Mode unavailable · saved preference",
    route: "safety",
    icon: "home",
    priority: available(mode) ? mode.state === "triggered" || mode.state === "pending" ? 95 : 10 : 45,
    stamp: stamp([mode]),
  });
  const ids = [
    ...new Set((config.light_rooms || []).flatMap((r) => r.entities)),
  ];
  const lights = ids.map((id) => states[id]);
  const on = lights.filter((e) => e?.state === "on").length;
  const offline = lights.filter((e) => !available(e)).length;
  const litRooms = (config.light_rooms || []).filter((r) =>
    r.entities.some((id) => states[id]?.state === "on"),
  );
  const late =
    homeHour(now, hass.config?.time_zone) >= 22 ||
    homeHour(now, hass.config?.time_zone) < 6;
  const relevant =
    on > 0 && ((config.alarm_entity
      ? ["armed_night", "armed_away", "arming", "pending"].includes(mode?.state || "")
      : ["Sleeping", "Away"].includes(mode?.state || "")) || late);
  rows.push({
    id: "lights",
    label: "Lighting",
    text: !ids.length
      ? "No lights connected"
      : `${on ? `${on} ${on === 1 ? "light" : "lights"} on${litRooms.length === 1 ? " in " + litRooms[0].name : ""}` : offline ? "Available lights off" : "All lights off"}${offline ? ` · ${offline} unavailable` : ""}`,
    route: "rooms",
    icon: "bulb",
    priority: offline ? 70 : relevant ? 50 : 12,
    tone: offline || relevant ? "notice" : undefined,
    stamp: stamp(lights),
    action: relevant && config.all_lights_off ? "lights" : undefined,
  });
  const climate = states[config.climate || ""];
  const c = climate?.attributes || {};
  const temp = number(c.current_temperature);
  const action =
    typeof c.hvac_action === "string"
      ? c.hvac_action.replaceAll("_", " ")
      : climate?.state === "off"
        ? "off"
        : "activity unknown";
  rows.push({
    id: "climate",
    label: "Climate",
    text: available(climate)
      ? `${temp === undefined ? "Temperature unavailable" : `${temp}°`}, ${action}`
      : "Thermostat unavailable",
    route: "climate",
    icon: "climate",
    priority: !available(climate) || temp === undefined ? 65 : 11,
    tone: !available(climate) || temp === undefined ? "notice" : undefined,
    stamp: stamp([climate]),
    action: available(climate) ? "climate" : undefined,
  });
  const lists = Object.values(states).filter((e) =>
    e.entity_id.startsWith("todo."),
  );
  const unavailableLists = lists.filter((e) => !available(e));
  const tasks = lists.reduce(
    (sum, e) => sum + (available(e) ? number(e.state) || 0 : 0),
    0,
  );
  rows.push({
    id: "lists",
    label: "Lists",
    text: !lists.length
      ? "No lists connected"
      : unavailableLists.length
        ? `${unavailableLists.length} ${unavailableLists.length === 1 ? "list" : "lists"} unavailable`
        : tasks
          ? `${tasks} ${tasks === 1 ? "task" : "tasks"} on your lists`
          : "Nothing left on your lists",
    route: "lists",
    icon: "list",
    priority: unavailableLists.length ? 35 : 5,
    stamp: stamp(lists),
  });
  const doorbell = config.doorbell;
  if (doorbell) {
    const press = Date.parse(
      states[doorbell.activity_entity || ""]?.attributes.last_triggered || "",
    );
    const review = front.review;
    const reviewTime = review ? review.start_time * 1000 : NaN;
    const last = Math.max(
      Number.isFinite(press) ? press : 0,
      Number.isFinite(reviewTime) ? reviewTime : 0,
    );
    const recent =
      last > 0 && last <= now.getTime() && now.getTime() - last < 2 * 3600000;
    const camera = states[doorbell.entity];
    const cameraOffline = !available(camera);
    const mins = Math.max(0, Math.floor((now.getTime() - last) / 60000));
    const relative = mins < 1 ? "just now" : `${mins} min ago`;
    const isPress =
      press >= reviewTime ||
      (!Number.isFinite(reviewTime) && Number.isFinite(press)) ||
      review?.doorbell;
    const matchedReview =
      !!review &&
      (reviewTime >= press ||
        (press >= reviewTime &&
          press <=
            (review.end_time ? review.end_time * 1000 : now.getTime()) +
              10000));
    rows.push({
      id: "doorbell",
      label: "Front door",
      text: recent
        ? `${isPress ? "Doorbell rang" : "Activity detected"} ${relative}${cameraOffline ? " · camera unavailable" : ""}`
        : cameraOffline
          ? "Camera unavailable"
          : front.error
            ? "Recent activity unavailable"
            : !front.checked
              ? "Checking recent activity…"
              : last
                ? "No activity in the last 2 hours"
                : "No activity recorded in the last 24 hours",
      route: "cameras",
      icon: "camera",
      priority: recent ? 75 : cameraOffline || front.error ? 60 : 8,
      tone: recent || cameraOffline || front.error ? "notice" : undefined,
      stamp: recent ? new Date(last).toISOString() : front.checked,
      timeLabel: recent ? "At" : "Checked",
      image: recent && matchedReview ? review?.image : undefined,
      review: recent && matchedReview ? review?.id : undefined,
    });
  }
  return rows.sort((a, b) => b.priority - a.priority);
}
export function digestSummary(rows: DigestRow[], connected = true) {
  if (!connected) return "Connection lost. Showing last received states.";
  const alert = rows.find((r) => r.tone === "alert");
  if (alert) return alert.text + ".";
  const offline = rows.find((r) => /offline|unavailable/i.test(r.text));
  if (offline) return offline.text + ".";
  const doorbell = rows.find((r) => r.id === "doorbell" && r.priority === 75);
  if (doorbell) return doorbell.text + ".";
  const unverifiedDoors = rows.find((r) => r.id === "doors" && /\bneeds? verification\b/.test(r.text));
  if (unverifiedDoors) return "Door sensor status needs verification.";
  const climate = rows.find((r) => r.id === "climate");
  const lights = rows.find((r) => r.id === "lights");
  const lightText =
    lights?.text.match(/^\d+ lights? on/)?.[0] ||
    (lights?.text === "All lights off" ? "lights off" : "");
  const climateText = climate?.text.replace(", ", " and ") || "";
  return `Quiet.${[lightText, climateText].filter(Boolean).length ? " " + [lightText, climateText].filter(Boolean).join(", ") + "." : ""}`;
}
