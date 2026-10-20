export type Appearance = "auto" | "system" | "light" | "dark";
export const appearanceModes: Appearance[] = [
  "auto",
  "system",
  "light",
  "dark",
];
export function homeHour(now: Date, timeZone?: string): number {
  try {
    return Number(
      new Intl.DateTimeFormat("en-GB", {
        hour: "numeric",
        hourCycle: "h23",
        timeZone,
      }).format(now),
    );
  } catch {
    return now.getHours();
  }
}
/** Auto follows HA's sun (dark while sun.sun is below the horizon), falling back to light 7am–7pm. */
export function isDark(
  mode: Appearance,
  systemDark: boolean,
  now: Date,
  timeZone?: string,
  sun?: string,
) {
  if (mode === "system") return systemDark;
  if (mode !== "auto") return mode === "dark";
  if (sun === "above_horizon") return false;
  if (sun === "below_horizon") return true;
  const hour = homeHour(now, timeZone);
  return hour < 7 || hour >= 19;
}
