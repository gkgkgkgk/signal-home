import type { Hass } from "./types";

const DAY = 86400000;

function zoneOffset(time: number, timeZone?: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    })
      .formatToParts(new Date(time))
      .map((part) => [part.type, part.value]),
  );
  const local = Date.UTC(
    +parts.year,
    +parts.month - 1,
    +parts.day,
    +parts.hour,
    +parts.minute,
    +parts.second,
  );
  return local - Math.floor(time / 1000) * 1000;
}

/** Midnight that starts the home's calendar day containing `time`. */
export function homeDayStart(time: number, timeZone?: string) {
  const offset = zoneOffset(time, timeZone);
  const midnight = Math.floor((time + offset) / DAY) * DAY;
  return midnight - zoneOffset(midnight - offset, timeZone);
}

/** HA's sun integration reports the next sunrise, sunset, dawn and dusk; the sensor wins over the sun.sun attribute. */
export function nextSunEvent(
  hass: Hass,
  event: "rising" | "setting" | "dawn" | "dusk",
) {
  const sensor = Date.parse(hass.states[`sensor.sun_next_${event}`]?.state || "");
  if (Number.isFinite(sensor)) return sensor;
  const attribute = Date.parse(
    String(hass.states["sun.sun"]?.attributes[`next_${event}`] || ""),
  );
  return Number.isFinite(attribute) ? attribute : undefined;
}

/**
 * Place HA's next occurrence of an event on the given day. Once today's
 * sunrise has passed, HA reports tomorrow's, so step it back a day; sun times
 * move only a minute or two from one day to the next.
 */
export function onDay(next: number | undefined, start: number, end: number) {
  if (next === undefined) return undefined;
  let time = next;
  while (time >= end) time -= DAY;
  while (time < start) time += DAY;
  return time;
}

export const HORIZON_Y = 62;
const UP = 50;
const DOWN = 26;

/** Stylized sky position (0 top, 100 bottom): an arc from sunrise to sunset, and a shallower dip through the night. */
export function skyY(time: number, rise: number, set: number) {
  if (time >= rise && time <= set)
    return HORIZON_Y - UP * Math.sin((Math.PI * (time - rise)) / (set - rise));
  const from = time < rise ? set - DAY : set;
  const to = time < rise ? rise : rise + DAY;
  return HORIZON_Y + DOWN * Math.sin((Math.PI * (time - from)) / (to - from));
}

export function duration(ms: number) {
  const minutes = Math.max(0, Math.round(ms / 60000));
  const hours = Math.floor(minutes / 60);
  return hours ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
}
