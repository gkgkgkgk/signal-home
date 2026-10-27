import { LitElement, css, html, type PropertyValues } from "lit";
import type { Hass } from "./types";

interface CameraEvent { id: string; camera: string; label?: string; severity?: string; data?: {objects?:string[];detections?:string[]}; start_time: number; end_time: number | null; }
interface Padding { pre: number; post: number; }

/** Frigate's record pre/post capture for this camera and review severity, published by
 *  HA's `sensor.signal_frigate_padding` so playback always matches Frigate's config.
 *  Falls back to 5s/5s (the configured value when this was written) if it's missing. */
export const PADDING_SENSOR = "sensor.signal_frigate_padding";
function eventPadding(hass: Hass | undefined, camera: string, severity?: string): Padding {
  const cameras = hass?.states?.[PADDING_SENSOR]?.attributes?.cameras as Record<string, Record<string, Partial<Padding>>> | undefined;
  const value = cameras?.[camera]?.[severity === "alert" ? "alerts" : "detections"];
  const valid = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 300;
  return valid(value?.pre) && valid(value?.post) ? { pre: value.pre, post: value.post } : { pre: 5, post: 5 };
}

/** Resolves only the requested event. Never substitutes a newer event or live video. */
export class SignalCameraEvent extends LitElement {
  static properties = {
    hass: { attribute: false }, eventId: {}, kind: {}, camera: {}, instance: {},
    event: { state: true }, url: { state: true }, error: { state: true }, loading: { state: true },
  };
  declare hass: Hass;
  eventId = "";
  kind = "event";
  camera = "";
  instance = "frigate";
  private event?: CameraEvent;
  private url = "";
  private error = "";
  private loading = true;
  private signature = "";
  private connection?: object;
  private user?: string;
  private generation = 0;
  private playerTimer?: ReturnType<typeof setTimeout>;
  private padding: Padding = { pre: 5, post: 5 };

  static styles = css`
    :host { display:block; min-width:0; }
    * { box-sizing:border-box; }
    .panel { border:1px solid var(--line); border-radius:26px; overflow:hidden; background:var(--surface); }
    .heading { padding:24px; }
    .badge { display:inline-flex; padding:6px 10px; border-radius:20px; background:color-mix(in srgb,#d19b50 18%,var(--surface)); color:var(--ink); font-size:11px; white-space:nowrap; font-weight:700; letter-spacing:.3px; }
    h2 { margin:14px 0 6px; color:var(--ink); font-size:clamp(21px,3vw,28px); font-weight:600; letter-spacing:-.7px; }
    p { margin:0; color:var(--muted); font-size:13px; line-height:1.6; }
    time { color:var(--ink); font-weight:600; }
    .player { background:#142019; aspect-ratio:4/3; }
    ha-hls-player { display:block; width:100%; height:100%; }
    .footer { padding:16px 24px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
    .notice { padding:44px 24px; min-height:220px; display:grid; align-content:center; gap:12px; text-align:center; border-top:1px solid var(--line); }
    .notice strong { color:var(--ink); font-size:16px; font-weight:600; }
    button { font:inherit; min-height:44px; padding:10px 15px; border:1px solid var(--line); border-radius:12px; background:var(--surface); color:var(--ink); cursor:pointer; }
    button:focus-visible { outline:2px solid var(--ink); outline-offset:3px; }
    .notice button { justify-self:center; }
    @media(max-width:480px) { .heading { padding:18px; } .footer { padding:14px 18px; } .panel { border-radius:22px; } }
  `;
  connectedCallback() { super.connectedCallback(); this.signature = ""; }
  disconnectedCallback() { super.disconnectedCallback(); this.generation++; clearTimeout(this.playerTimer); this.url = ""; }
  protected willUpdate(_changes: PropertyValues) {
    const key = JSON.stringify([this.instance, this.camera, this.kind, this.eventId]);
    if (this.hass && (key !== this.signature || this.connection !== this.hass.connection || this.user !== this.hass.user?.id)) {
      this.signature = key; this.connection = this.hass.connection; this.user = this.hass.user?.id;
      void this.load();
    }
  }
  private load = async () => {
    const generation = ++this.generation;
    clearTimeout(this.playerTimer); this.loading = true; this.error = ""; this.url = ""; this.event = undefined;
    const current = () => this.isConnected && generation === this.generation;
    try {
      if (!/^\d{10}(?:\.\d+)?-[a-zA-Z0-9]+$/.test(this.eventId) || this.eventId.length > 80 || !/^[a-zA-Z0-9_-]+$/.test(this.instance) || !/^[a-z0-9_]+$/.test(this.camera)) throw new Error("invalid_link");
      const start = Number(this.eventId.split("-")[0]);
      // Review items are visits; raw object records may outlive the actual activity.
      const raw = await this.hass.callWS<CameraEvent[] | string>({ type: "frigate/reviews/get", instance_id: this.instance, cameras: [this.camera], after: Math.floor(start) - 60, ...(this.kind === "review" ? {before: Math.ceil(start) + 1} : {}),  limit:500 });
      if (!current()) return;
      const events = typeof raw === "string" ? JSON.parse(raw) : raw;
      const event = Array.isArray(events) ? events.find(e => e.camera === this.camera && (this.kind === "review" ? e.id === this.eventId : e.data?.detections?.includes(this.eventId))) : undefined;
      if (!event) throw new Error("event_missing");
      this.event = event;
      const padding = this.padding = eventPadding(this.hass, this.camera, event.severity);
      const begin = Math.floor(event.start_time - padding.pre);
      // An ongoing visit is a finite recording through now, refreshed explicitly.
      const end = event.end_time == null ? Math.floor(Date.now()/1000) : Math.floor(event.end_time + padding.post);
      if (!Number.isFinite(begin) || !Number.isFinite(end) || end <= begin) throw new Error("invalid_media");
      const media = {url:`/api/frigate/${this.instance}/vod/${this.camera}/start/${begin}/end/${end}/index.m3u8`};
      const signed = await this.hass.callWS<{path: string}>({ type: "auth/sign_path", path: media.url, expires: 3600 });
      if (!current()) return;
      if (!customElements.get("ha-hls-player")) await Promise.race([
        customElements.whenDefined("ha-hls-player"),
        new Promise((_, reject) => { this.playerTimer = setTimeout(() => reject(new Error("player_missing")), 10000); }),
      ]);
      if (!current()) return;
      this.url = new URL(signed.path, location.origin).href;
    } catch (error) {
      if (!current()) return;
      const reason = error instanceof Error ? error.message : "";
      this.error = reason === "event_missing" ? "This event is no longer available. Its footage may have expired or been removed." : reason === "invalid_link" ? "This event link isn’t valid." : this.event?.end_time === null ? "This event is still recording. Try again in a moment to load the footage." : "We couldn’t load this recording. Check your connection and try again.";
    } finally { if (current()) { clearTimeout(this.playerTimer); this.loading = false; } }
  };
  private date() {
    const timestamp = this.event?.start_time ?? Number(this.eventId.split("-")[0]);
    if (!Number.isFinite(timestamp)) return "";
    return new Intl.DateTimeFormat(this.hass?.locale?.language || undefined, { dateStyle: "medium", timeStyle: "short", timeZone: this.hass?.config?.time_zone }).format(new Date(timestamp * 1000));
  }
  render() {
    const title = this.event?.data?.objects?.some(o=>o.startsWith("doorbell")) ? "Doorbell ring" : this.event?.data?.objects?.includes("person") ? "Person detected" : "Recorded event";
    return html`<section class="panel" aria-label="Recorded event">
      <div class="heading"><span class="badge">${this.event?.end_time === null ? "Visit in progress · Recorded footage" : "Recorded event"}</span><h2>${title}</h2><p><time>${this.date()}</time> · ${this.camera.replaceAll("_", " ")}</p>${this.event?.end_time != null ? html`<p>${Math.round(this.event.end_time-this.event.start_time)}-second visit · includes ${this.padding.pre}s before and ${this.padding.post}s after</p>` : ""}</div>
      ${this.loading ? html`<div class="notice" role="status"><strong>Opening this recording…</strong><p>Loading the event from your notification.</p></div>` : this.error ? html`<div class="notice" role="alert"><strong>Recording unavailable</strong><p>${this.error}</p><button @click=${this.load}>Try again</button></div>` : html`<div class="player"><ha-hls-player .hass=${this.hass} .url=${this.url} .controls=${true} .autoPlay=${true} .muted=${true} .playsInline=${true} .allowExoPlayer=${false} .aspectRatio=${4/3}></ha-hls-player></div>${this.event?.end_time === null ? html`<div class="footer"><button @click=${this.load}>Refresh recording</button></div>` : ""}`}
    </section>`;
  }
}
if (!customElements.get("signal-camera-event")) customElements.define("signal-camera-event", SignalCameraEvent);
