import { available, type Entity } from "./types";

export interface UpcomingEvent {
  id: string;
  date: string;
  title: string;
  detail?: string;
  source: "pghst" | "hebcal";
  kind: "trash" | "recycling" | "yard" | "candles" | "havdalah" | "shabbat" | "holiday";
  url: string;
  time?: string;
}
const day = (date: Date) => new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
}).format(date);
export const pittsburghDay = day;
export const pittsburghDayOffset = (today: Date, days: number) => {
  const result = new Date(`${day(today)}T12:00:00Z`);
  result.setUTCDate(result.getUTCDate() + days);
  return day(result);
};
export const hebcalUrl = (today: Date, zip = "15217") => {
  const start = day(today);
  const end = pittsburghDayOffset(today, 30);
  const params = new URLSearchParams({
    v: "1", cfg: "json", start, end, maj: "on", min: "on", mod: "on",
    ss: "on", s: "on", leyning: "off", c: "on", M: "on",
    geo: "zip", zip, i: "off",
  });
  return `https://www.hebcal.com/hebcal?${params}`;
};
export function wasteEvents(entity: Entity | undefined, today: Date): UpcomingEvent[] {
  if (!available(entity)) return [];
  if (Array.isArray(entity.attributes.events)) {
    const earliest = day(today);
    return entity.attributes.events.flatMap((entry: any): UpcomingEvent[] => {
      if (!entry || typeof entry.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)
        || entry.date < earliest || !["trash", "recycling", "yard"].includes(entry.kind)) return [];
      return [{ id: `pghst-${entry.kind}-${entry.date}`, date: entry.date,
        title: entry.kind === "trash" ? "Trash pickup" : entry.kind === "recycling" ? "Recycling pickup" : "Yard pickup",
        kind: entry.kind, source: "pghst", url: "https://pgh.st/" }];
    });
  }
  const fields = [
    ["next_pickup_date", "Trash pickup", "trash"],
    ["next_recycling_date", "Recycling pickup", "recycling"],
    ["next_yard_date", "Yard pickup", "yard"],
  ] as const;
  const earliest = day(today);
  return fields.flatMap(([field, title, kind]) => {
    const value = field === "next_pickup_date" ? entity.state : entity.attributes[field];
    if (typeof value !== "string" || !/^\d{1,2}-\d{1,2}-\d{4}$/.test(value)) return [];
    const [month, date, year] = value.split("-").map(Number);
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    if (Number.isNaN(Date.parse(`${iso}T12:00:00Z`)) || iso < earliest) return [];
    return [{ id: `pghst-${kind}-${iso}`, date: iso, title, kind, source: "pghst" as const, url: "https://pgh.st/" }];
  });
}
export function hebcalEvents(payload: unknown, today: Date): UpcomingEvent[] {
  if (!payload || typeof payload !== "object" || !Array.isArray((payload as any).items)) return [];
  const earliest = day(today);
  return (payload as any).items.flatMap((item: any): UpcomingEvent[] => {
    if (!item || typeof item.title !== "string" || typeof item.date !== "string") return [];
    const date = item.date.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < earliest) return [];
    const kind = item.category === "candles" ? "candles"
      : item.category === "havdalah" ? "havdalah"
      : item.category === "parashat" ? "shabbat"
      : item.category === "holiday" ? "holiday" : null;
    if (!kind) return [];
    const title = kind === "candles" ? "Candle lighting"
      : kind === "havdalah" ? "Havdalah"
      : kind === "shabbat" ? "Shabbat" : item.title;
    const time = /T\d{2}:\d{2}/.test(item.date) ? item.date : undefined;
    return [{ id: `hebcal-${kind}-${date}-${item.title}`, date, title,
      detail: kind === "shabbat" ? item.title : kind === "candles" && item.memo ? item.memo : undefined,
      kind, source: "hebcal", time,
      url: typeof item.link === "string" && item.link.startsWith("https://")
        ? item.link : "https://www.hebcal.com/shabbat?geo=zip&zip=15217" }];
  });
}
export function sortUpcoming(events: UpcomingEvent[]): UpcomingEvent[] {
  return [...events].sort((a, b) => a.date.localeCompare(b.date)
    || (a.time || "").localeCompare(b.time || "") || a.title.localeCompare(b.title));
}
