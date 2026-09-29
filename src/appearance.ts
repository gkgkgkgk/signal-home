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
export function isDark(
  mode: Appearance,
  systemDark: boolean,
  now: Date,
  timeZone?: string,
) {
  if (mode === "system") return systemDark;
  if (mode !== "auto") return mode === "dark";
  const hour = homeHour(now, timeZone);
  return hour < 7 || hour >= 19;
}
