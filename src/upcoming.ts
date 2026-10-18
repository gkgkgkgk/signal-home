import { LitElement, css, html, nothing } from "lit";
import { icon } from "./icons";
import { available, type Config, type Hass } from "./types";
import { hebcalEvents, hebcalUrl, pittsburghDay, pittsburghDayOffset, sortUpcoming, wasteEvents, type UpcomingEvent } from "./upcoming-model";

const cache = new Map<string, { fetched: number; events: UpcomingEvent[] }>();
const names: Record<UpcomingEvent["kind"], string> = {
  trash: "trash", recycling: "recycling", yard: "yard", candles: "candles",
  havdalah: "havdalah", shabbat: "shabbat", holiday: "holiday",
};
const eventIcon = (kind: UpcomingEvent["kind"]) =>
  kind === "trash" || kind === "recycling" || kind === "yard" ? "trash"
    : kind === "candles" ? "sun" : kind === "havdalah" ? "moon" : "sparkle";

export class SignalUpcoming extends LitElement {
  static properties = {
    hass: { attribute: false }, config: { attribute: false },
    events: { state: true }, status: { state: true }, now: { state: true }, expanded: { state: true },
  };
  declare hass: Hass;
  config: Config = { type: "custom:signal-home" };
  private events: UpcomingEvent[] = [];
  private status: "loading" | "ready" | "error" = "loading";
  private now = new Date();
  private expanded = false;
  private timer?: ReturnType<typeof setInterval>;
  private requestKey = "";
  private requestedAt = 0;
  static styles = css`
    :host { display:block; margin-top:28px; }
    * { box-sizing:border-box; }
    .heading { display:flex; align-items:baseline; justify-content:space-between; gap:12px; margin:0 2px 13px; }
    h2 { margin:0; font-size:20px; font-weight:650; letter-spacing:-.5px; }
    .heading small { color:var(--muted); font-size:11px; }
    .shell { border:1px solid var(--line); border-radius:24px; overflow:hidden; background:var(--surface); }
    .range { display:flex; align-items:center; justify-content:center; gap:7px; width:100%; min-height:48px; padding:9px 16px; border:0; border-top:1px solid var(--line); background:color-mix(in srgb,var(--surface) 95%,var(--lilac)); color:var(--ink); font:inherit; font-size:12px; font-weight:650; cursor:pointer; }
    .range:hover { background:color-mix(in srgb,var(--surface) 87%,var(--lilac)); }
    .range svg { width:15px; height:15px; }
    .empty { margin:0; padding:23px; color:var(--muted); font-size:13px; line-height:1.5; }
    .day { padding:10px 17px 8px; background:color-mix(in srgb,var(--surface) 94%,var(--lilac)); color:var(--muted); font-size:10px; font-weight:700; letter-spacing:1.1px; text-transform:uppercase; }
    .event { display:flex; align-items:center; gap:13px; min-height:68px; padding:10px 16px; color:var(--ink); text-decoration:none; border-top:1px solid var(--line); transition:background .18s,transform .18s; }
    .event:first-child { border-top:0; }
    .event:hover { background:color-mix(in srgb,var(--surface) 91%,var(--lilac)); }
    .event:focus-visible,.range:focus-visible,.credit a:focus-visible { outline:3px solid var(--ink); outline-offset:-3px; }
    .glyph { display:grid; place-items:center; width:40px; height:40px; flex:none; border-radius:13px; }
    .glyph svg { width:20px; height:20px; }
    .trash .glyph { background:#d3eadf; color:#22654c; }
    .recycling .glyph { background:#cae7f0; color:#1a667a; }
    .yard .glyph { background:#def0c5; color:#4d6e29; }
    .candles .glyph { background:#ffdfaa; color:#8c4d10; }
    .havdalah .glyph { background:#dbd5f8; color:#574494; }
    .shabbat .glyph,.holiday .glyph { background:#eedcf4; color:#794b8a; }
    .copy { flex:1; min-width:0; }
    .title { display:block; font-size:14px; font-weight:650; line-height:1.3; }
    .detail { display:block; color:var(--muted); font-size:11px; line-height:1.4; margin-top:3px; }
    .time { flex:none; font-size:13px; font-weight:700; font-variant-numeric:tabular-nums; }
    .credit { display:flex; flex-wrap:wrap; gap:4px 12px; margin:10px 3px 0; color:var(--muted); font-size:10px; line-height:1.5; }
    .credit a { color:inherit; text-underline-offset:2px; }
    @media(max-width:450px) { .heading small { display:none; } .event { min-height:62px; } }
    @media(prefers-reduced-motion:reduce) { * { transition:none !important; } }
  `;
  connectedCallback() {
    super.connectedCallback();
    this.refresh();
    this.timer = setInterval(() => { this.now = new Date(); this.refresh(); }, 5 * 60000);
    document.addEventListener("visibilitychange", this.onVisibility);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.timer);
    document.removeEventListener("visibilitychange", this.onVisibility);
  }
  private onVisibility = () => { if (document.visibilityState === "visible") { this.now = new Date(); this.refresh(); } };
  protected updated(changed: Map<string, unknown>) {
    if (changed.has("config")) this.refresh();
  }
  private refresh() {
    const zip = this.config.upcoming?.hebcal_zip || "15217";
    const key = `${pittsburghDay(this.now)}:${zip}`;
    if (key === this.requestKey && Date.now() - this.requestedAt < (this.status === "error" ? 15 * 60000 : 6 * 3600000)) return;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.fetched < 6 * 3600000) {
      this.requestKey = key;
      this.events = cached.events;
      this.status = "ready";
      return;
    }
    this.requestKey = key;
    this.requestedAt = Date.now();
    this.status = "loading";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    void fetch(hebcalUrl(this.now, zip), { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("Hebcal unavailable"); return response.json(); })
      .then((data) => {
        if (this.requestKey !== key) return;
        this.events = hebcalEvents(data, this.now);
        cache.set(key, { fetched: Date.now(), events: this.events });
        this.status = "ready";
      })
      .catch(() => { if (this.requestKey === key) this.status = "error"; })
      .finally(() => clearTimeout(timeout));
  }
  private dateLabel(iso: string) {
    const today = pittsburghDay(this.now);
    if (iso === today) return "Today";
    if (iso === pittsburghDayOffset(this.now, 1)) return "Tomorrow";
    return new Intl.DateTimeFormat(this.hass?.locale?.language || "en-US", {
      timeZone: "America/New_York", weekday: "long", month: "short", day: "numeric",
    }).format(new Date(`${iso}T12:00:00Z`));
  }
  private timeLabel(value?: string) {
    if (!value) return "";
    return new Intl.DateTimeFormat(this.hass?.locale?.language || "en-US", {
      timeZone: "America/New_York", hour: "numeric", minute: "2-digit",
    }).format(new Date(value));
  }
  render() {
    const waste = this.config.upcoming?.waste_entity
      ? this.hass?.states[this.config.upcoming.waste_entity] : undefined;
    const events = sortUpcoming([...wasteEvents(waste, this.now), ...this.events]);
    const through = pittsburghDayOffset(this.now, this.expanded ? 30 : 7);
    const shown = events.filter((event) => event.date <= through);
    const lastWasteReport = waste?.attributes.checked_at || waste?.last_reported || waste?.last_updated;
    const wasteStale = lastWasteReport && Date.now() - Date.parse(lastWasteReport) > 36 * 3600000;
    const wasteStatus = !this.config.upcoming?.waste_entity ? "Collection schedule not connected"
      : !available(waste) ? "Collection schedule unavailable"
      : wasteStale ? "Collection schedule may be out of date" : "";
    const jewishStatus = this.status === "error" ? "Jewish calendar unavailable" : "";
    return html`<section aria-labelledby="upcoming-title">
      <div class="heading"><h2 id="upcoming-title">Coming up</h2><small>Pittsburgh · next ${this.expanded ? "30" : "7"} days</small></div>
      <div class="shell">
        <div id="upcoming-events">${shown.length ? shown.map((event, index) => html`
          ${index === 0 || shown[index - 1].date !== event.date ? html`<div class="day">${this.dateLabel(event.date)}</div>` : nothing}
          <a class=${`event ${names[event.kind]}`} href=${event.url} target="_blank" rel="noopener noreferrer" aria-label=${`${event.title}, ${this.dateLabel(event.date)}${event.time ? ` at ${this.timeLabel(event.time)}` : ""}; source ${event.source === "pghst" ? "PGH.ST" : "Hebcal"}`}>
            <span class="glyph">${icon(eventIcon(event.kind))}</span>
            <span class="copy"><span class="title">${event.title}</span><span class="detail">${event.detail ? `${event.detail} · ` : ""}${event.source === "pghst" ? "City collection" : "Jewish calendar"}</span></span>
            ${event.time ? html`<span class="time">${this.timeLabel(event.time)}</span>` : nothing}
          </a>`) : html`<p class="empty">${this.status === "loading" ? "Finding what’s next…" : "Nothing on the calendar in this window."}</p>`}</div>
        <button class="range" type="button" aria-expanded=${String(this.expanded)} aria-controls="upcoming-events" @click=${() => { this.expanded = !this.expanded; }}>${this.expanded ? "Show next week" : "Show next month"} ${icon(this.expanded ? "up" : "down")}</button>
      </div>
      <div class="credit">
        ${wasteStatus ? html`<span>${wasteStatus}</span>` : nothing}
        ${jewishStatus ? html`<span>${jewishStatus}</span>` : nothing}
        ${this.expanded && available(waste) && !Array.isArray(waste.attributes.events) ? html`<span>PGH.ST currently supplies only the next pickup of each kind.</span>` : nothing}
        <span>Sources: <a href="https://pgh.st/" target="_blank" rel="noopener noreferrer">PGH.ST</a> and <a href="https://www.hebcal.com/" target="_blank" rel="noopener noreferrer">Hebcal</a> (CC BY 4.0)</span>
      </div>
    </section>`;
  }
}
customElements.define("signal-upcoming", SignalUpcoming);
