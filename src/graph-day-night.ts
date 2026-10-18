export function dayNightBands(start: number, end: number, timeZone?: string) {
  const formatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone });
  const isDay = (time: number) => {
    const hour = Number(formatter.format(new Date(time)));
    return hour >= 6 && hour < 18;
  };
  const bands: { start: number; end: number; day: boolean }[] = [];
  let from = start;
  let day = isDay(start);
  for (let probe = Math.min(start + 30 * 60000, end); probe <= end; probe = Math.min(probe + 30 * 60000, end)) {
    const next = isDay(probe);
    if (next !== day) {
      let low = probe - 30 * 60000;
      let high = probe;
      while (high - low > 60000) {
        const middle = Math.floor((low + high) / 2);
        if (isDay(middle) === day) low = middle;
        else high = middle;
      }
      bands.push({ start: from, end: high, day });
      from = high;
      day = next;
    }
    if (probe === end) break;
  }
  bands.push({ start: from, end, day });
  return bands;
}
