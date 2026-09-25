import { number } from "./types";
export interface HistoryPoint {
  time: number;
  value: number | null;
}
export function normalizeHistory(
  rows: Record<string, unknown>[],
): HistoryPoint[] {
  return rows
    .map((row) => {
      const raw = row.lu ?? row.last_updated ?? row.lc ?? row.last_changed;
      const time =
        typeof raw === "number" ? raw * 1000 : Date.parse(String(raw));
      return { time, value: number(row.s ?? row.state) ?? null };
    })
    .filter((point) => Number.isFinite(point.time))
    .sort((a, b) => a.time - b.time);
}
// Preserve extrema and gaps while bounding SVG complexity for dense histories.
export function simplifyHistory(
  points: HistoryPoint[],
  limit = 600,
): HistoryPoint[] {
  if (points.length <= limit) return points;
  const size = Math.ceil(points.length / (limit / 4));
  const result: HistoryPoint[] = [];
  for (let i = 0; i < points.length; i += size) {
    const bucket = points.slice(i, i + size);
    const numeric = bucket.filter((p) => p.value !== null);
    const chosen = new Set([bucket[0], bucket[bucket.length - 1]]);
    if (numeric.length) {
      chosen.add(numeric.reduce((a, b) => (a.value! < b.value! ? a : b)));
      chosen.add(numeric.reduce((a, b) => (a.value! > b.value! ? a : b)));
    }
    const gap = bucket.find((p) => p.value === null);
    if (gap) chosen.add(gap);
    result.push(...[...chosen].sort((a, b) => a.time - b.time));
  }
  return result;
}
