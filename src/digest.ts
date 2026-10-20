import { LitElement, html, css, nothing } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { available, number, type Config, type Hass } from "./types";
import {
  digestRows,
  digestSummary,
  type DigestRow,
  type FrontActivity,
} from "./digest-model";
import { icon } from "./icons";
import { scheduledNote } from "./automation-note";
import "./upcoming";

export class SignalDigest extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    front: { state: true },
    pending: { state: true },
    error: { state: true },
    now: { state: true },
  };
  declare hass: Hass;
  config: Config = { type: "custom:signal-home" };
  private front: FrontActivity = {};
  private pending = "";
  private error = "";
  private now = new Date();
  private signature = "";
  private connection?: object;
  private generation = 0;
  private timer?: ReturnType<typeof setInterval>;
  static styles = css`
    :host {
      display: block;
      color: var(--ink);
      max-width: 960px;
      margin: 0 auto;
    }
    * {
      box-sizing: border-box;
    }
    h1,
    p {
      margin: 0;
    }
    button,
    a {
      font: inherit;
      color: inherit;
    }
    button {
      cursor: pointer;
    }
    button:disabled {
      opacity: 0.45;
      cursor: default;
    }
    button:focus-visible,
    a:focus-visible {
      outline: 3px solid var(--ink);
      outline-offset: 3px;
    }
    svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    .digest-heading {
      padding: 6px 0 22px;
    }
    .eyebrow {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.8px;
      color: var(--muted);
      margin-bottom: 12px;
    }
    h1 {
      font-size: clamp(26px, 3vw, 38px);
      line-height: 1.22;
      letter-spacing: -1.1px;
      font-weight: 620;
      max-width: 760px;
      text-wrap: balance;
    }
    .digest-heading p {
      font-size: 12px;
      line-height: 1.5;
      color: var(--muted);
      margin-top: 12px;
    }
    .digest-list {
      display: flex;
      flex-direction: column;
      gap: 1px;
      background: var(--line);
      border: 1px solid var(--line);
      border-radius: 24px;
      overflow: hidden;
    }
    .row {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0 12px;
      padding: 0 18px;
      background: var(--surface);
      min-width: 0;
      transition: background 0.25s;
    }
    .row.alert {
      background: color-mix(in srgb, var(--surface) 90%, #df7461);
      border-left: 4px solid #bb503c;
      padding-left: 14px;
    }
    .row.notice {
      background: color-mix(in srgb, var(--surface) 95%, #dfb45c);
    }
    .row.notable {
      padding-top: 12px;
      padding-bottom: 12px;
    }
    .row:not(.notable) .label {
      display: inline;
      font-size: 12px;
      text-transform: none;
      letter-spacing: 0;
    }
    .row:not(.notable) .label::after {
      content: " · ";
    }
    .row:not(.notable) .text {
      display: inline;
      font-size: 13px;
    }
    .row-link {
      display: flex;
      align-items: center;
      gap: 13px;
      flex: 1 1 100%;
      min-width: 0;
      text-decoration: none;
      padding: 12px 0;
      text-align: left;
    }
    .symbol {
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      flex-shrink: 0;
      border-radius: 10px;
      color: var(--muted);
    }
    .alert .symbol {
      background: #b54a3420;
      color: #b34b36;
    }
    .notice .symbol {
      background: #b58b2f14;
    }
    .copy {
      min-width: 0;
      flex: 1;
    }
    .label {
      display: block;
      font-size: 10px;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 3px;
    }
    .text {
      display: block;
      font-size: 14px;
      line-height: 1.45;
      overflow-wrap: anywhere;
      font-weight: 500;
    }
    .notable .text {
      font-size: 17px;
      font-weight: 600;
    }
    .timestamp {
      display: block;
      color: var(--muted);
      font-size: 10px;
      line-height: 1.4;
      margin-top: 3px;
      font-weight: 400;
    }
    .chevron {
      color: var(--muted);
      width: 16px;
    }
    .picture {
      width: 100%;
      margin: 0 0 10px 45px;
      max-width: 350px;
      aspect-ratio: 16/9;
      border-radius: 14px;
      overflow: hidden;
      background: var(--line);
      position: relative;
    }
    .picture img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: relative;
    }
    .picture span {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      color: var(--muted);
      font-size: 12px;
    }
    .inline-action {
      background: transparent;
      border: 1px solid var(--line);
      border-radius: 12px;
      min-height: 44px;
      padding: 8px 12px;
      font-size: 12px;
      margin: 0 0 12px 45px;
    }
    .mode-options {
      display: flex;
      gap: 4px;
      margin: 0 0 14px 45px;
      width: calc(100% - 45px);
      max-width: 360px;
      padding: 3px;
      border: 1px solid var(--line);
      border-radius: 13px;
    }
    .mode-option {
      flex: 1;
      border: 0;
      border-radius: 9px;
      background: transparent;
      font-size: 12px;
      min-height: 40px;
      padding: 8px;
    }
    .mode-option[aria-pressed="true"] {
      background: var(--mint);
      color: #17372c;
      font-weight: 600;
    }
    .target {
      display: flex;
      align-items: center;
      gap: 4px;
      margin: 0 0 12px 45px;
      font-size: 11px;
      color: var(--muted);
    }
    .target span {
      padding-right: 8px;
    }
    .target button {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: transparent;
    }
    .target svg {
      width: 15px;
      height: 15px;
    }
    @media (max-width: 649px) {
      .row[data-row="climate"] .row-link {
        flex: 1;
        min-width: 140px;
      }
      .row[data-row="climate"] .target {
        display: grid;
        grid-template-columns: 40px 40px;
        gap: 3px;
        margin: 8px 0;
      }
      .row[data-row="climate"] .target span {
        grid-column: 1/-1;
        font-size: 10px;
        padding: 0;
        text-align: center;
      }
      .row[data-row="climate"] .target button {
        width: 40px;
        height: 44px;
      }
      .mode-options {
        margin-bottom: 10px;
      }
      .row[data-row="mode"] .row-link {
        padding-bottom: 8px;
      }
    }
    .feedback {
      font-size: 13px;
      line-height: 1.5;
      margin: 12px 0;
    }
    .error {
      color: #ba4935;
    }
    .note {
      width: 100%;
      margin: 0 0 12px 45px;
      font-size: 11px;
      color: var(--muted);
    }
    @media (min-width: 650px) {
      .row-link {
        flex: 1;
        min-width: 200px;
      }
      .target,
      .inline-action {
        margin: 0;
      }
      .row:not(.notable) .row-link {
        padding: 17px 0;
      }
      .mode-options {
        margin: 0;
        width: 260px;
      }
      .picture {
        max-width: 260px;
        margin-left: 45px;
        margin-bottom: 10px;
      }
      .row {
        padding-left: 22px;
        padding-right: 22px;
      }
      .row.alert {
        padding-left: 18px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      * {
        transition: none !important;
      }
    }
  `;
  connectedCallback() {
    super.connectedCallback();
    this.signature = "";
    this.timer = setInterval(() => {
      this.now = new Date();
      if (document.visibilityState === "visible") void this.loadFront();
    }, 60000);
    document.addEventListener("visibilitychange", this.resume);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.generation++;
    clearInterval(this.timer);
    document.removeEventListener("visibilitychange", this.resume);
  }
  private resume = () => {
    if (document.visibilityState === "visible") {
      this.now = new Date();
      void this.loadFront();
    }
  };
  protected willUpdate() {
    const signature = JSON.stringify([
      this.config.doorbell,
      this.hass?.user?.id,
    ]);
    if (
      this.hass &&
      (signature !== this.signature || this.connection !== this.hass.connection)
    ) {
      this.signature = signature;
      this.connection = this.hass.connection;
      this.front = {};
      void this.loadFront();
    }
  }
  private async loadFront() {
    const d = this.config.doorbell;
    if (!d || !this.hass || this.hass.connection?.connected === false) return;
    const generation = ++this.generation;
    const current = () => this.isConnected && generation === this.generation;
    const request = async <T>(message: Record<string, unknown>): Promise<T> => {
      let timeout: ReturnType<typeof setTimeout> | undefined;
      try {
        return await Promise.race([
          this.hass.callWS<T>(message),
          new Promise<T>((_, reject) => {
            timeout = setTimeout(() => reject(new Error("timeout")), 10000);
          }),
        ]);
      } finally {
        clearTimeout(timeout);
      }
    };
    try {
      const raw = await request<any>({
        type: "frigate/reviews/get",
        instance_id: d.instance || "frigate",
        cameras: [d.camera],
        after: Date.now() / 1000 - 86400,
        limit: 1,
      });
      if (!current()) return;
      const events = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!Array.isArray(events)) throw new Error();
      const event = events[0];
      let review: FrontActivity["review"];
      if (event) {
        if (
          event.camera !== d.camera ||
          !/^\d{10}(?:\.\d+)?-[a-zA-Z0-9]+$/.test(event.id) ||
          !Number.isFinite(event.start_time) ||
          event.start_time > Date.now() / 1000 + 5
        )
          throw new Error();
        review = {
          id: event.id,
          start_time: event.start_time,
          end_time: event.end_time,
          doorbell: event.data?.objects?.some((s: string) =>
            s.startsWith("doorbell"),
          ),
        };
        if (Date.now() / 1000 - event.start_time < 7200) {
          try {
            const signed = await request<{ path: string }>({
              type: "auth/sign_path",
              path: `/api/frigate/${d.instance || "frigate"}/notifications/${event.id}/${d.camera}/review_thumbnail.webp`,
              expires: 300,
            });
            review.image = new URL(signed.path, location.origin).href;
          } catch {
            /* The event remains useful without its thumbnail. */
          }
        }
      }
      if (current()) this.front = { checked: new Date().toISOString(), review };
    } catch {
      if (current()) this.front = { ...this.front, error: true };
    }
  }
  private go(row: DigestRow, event?: Event) {
    event?.preventDefault();
    this.dispatchEvent(
      new CustomEvent("signal-digest-navigation", {
        detail: { route: row.route, review: row.review },
        bubbles: true,
        composed: true,
      }),
    );
  }
  private async send(
    key: string,
    domain: string,
    service: string,
    data: Record<string, unknown>,
  ) {
    if (this.pending || this.hass.connection?.connected === false) return;
    this.pending = key;
    this.error = "";
    try {
      await this.hass.callService(domain, service, data);
    } catch {
      this.error =
        "That didn’t go through. Check the connection and try again.";
    } finally {
      this.pending = "";
    }
  }
  private time(row: DigestRow) {
    if (!row.stamp)
      return row.text.startsWith("No ") && row.text.endsWith("connected")
        ? "Not configured"
        : "Update time unavailable";
    const date = new Date(row.stamp);
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      timeZone: this.hass.config?.time_zone,
    };
    if (this.now.getTime() - date.getTime() > 86400000) {
      options.month = "short";
      options.day = "numeric";
    }
    return `${row.timeLabel || "Updated"} ${date.toLocaleString(this.hass.locale?.language || undefined, options)}`;
  }
  private target() {
    const e = this.hass.states[this.config.climate || ""];
    if (!available(e) || e.state === "off") return nothing;
    const a = e.attributes;
    const features = number(a.supported_features) || 0;
    if (
      e.state === "heat_cool" &&
      (!(features & 2) ||
        number(a.target_temp_low) === undefined ||
        number(a.target_temp_high) === undefined)
    )
      return nothing;
    const range = e.state === "heat_cool" && !!(features & 2);
    const high = range && a.hvac_action === "cooling";
    const key = range
      ? high
        ? "target_temp_high"
        : "target_temp_low"
      : "temperature";
    const value = number(a[key]);
    if (value === undefined || (!range && !(features & 1))) return nothing;
    const lower = number(a.min_temp) ?? 7;
    const upper = number(a.max_temp) ?? 35;
    const min =
      range && high
        ? Math.max(lower, number(a.target_temp_low) ?? lower)
        : lower;
    const max =
      range && !high
        ? Math.min(upper, number(a.target_temp_high) ?? upper)
        : upper;
    const step =
      number(a.target_temp_step) ||
      (this.hass.config?.unit_system?.temperature === "°F" ? 1 : 0.5);
    const label = range ? (high ? "Cool above" : "Heat below") : "Target";
    const change = (direction: number) =>
      void this.send("climate", "climate", "set_temperature", {
        entity_id: this.config.climate,
        [key]: Math.max(
          min,
          Math.min(max, Math.round((value + direction * step) * 10) / 10),
        ),
        ...(range
          ? {
              [high ? "target_temp_low" : "target_temp_high"]:
                a[high ? "target_temp_low" : "target_temp_high"],
            }
          : {}),
      });
    return html`<div class="target">
      <span>${label} ${value}°</span
      ><button
        aria-label=${`Decrease ${label.toLowerCase()} temperature`}
        ?disabled=${!!this.pending || this.hass.connection?.connected === false || value <= min}
        @click=${() => change(-1)}
      >
        ${icon("minus")}</button
      ><button
        aria-label=${`Increase ${label.toLowerCase()} temperature`}
        ?disabled=${!!this.pending || this.hass.connection?.connected === false || value >= max}
        @click=${() => change(1)}
      >
        ${icon("plus")}
      </button>
    </div>`;
  }
  private row(row: DigestRow) {
    const notable = !!row.tone;
    const contents = html`<span class="symbol">${icon(row.icon)}</span
      ><span class="copy"
        ><span class="label">${row.label}</span
        ><span class="text">${row.text}</span
        ><span class="timestamp"
          >${this.time(row)}${row.id === "doorbell" && this.front.error ? " · refresh failed" : ""}</span
        ></span
      >${icon("arrow")}`;
    return html`<section
      class=${`row ${row.tone || ""} ${notable ? "notable" : ""}`}
      data-row=${row.id}
      aria-label=${row.label}
    >
      <a class="row-link" href=${`#signal/${row.route}`} @click=${(event: Event) => this.go(row, event)}>${contents}</a>
      ${row.image ? html`<a class="picture" aria-label="View front door event" href="#signal/cameras" @click=${(event: Event) => this.go(row, event)}><span>Preview unavailable</span><img src=${row.image} alt="Recorded front-door activity" @error=${(event: Event) => ((event.target as HTMLImageElement).style.visibility = "hidden")} /></a>` : nothing}
      ${row.action === "lights" ? html`<button class="inline-action" ?disabled=${!!this.pending || !available(this.hass.states[this.config.all_lights_off || ""]) || this.hass.connection?.connected === false} @click=${() => this.send("lights", "script", "turn_on", { entity_id: this.config.all_lights_off })}>Turn all off</button>` : nothing}
      ${row.action === "climate" ? this.target() : nothing}
      ${
        row.id === "lights"
          ? (this.config.light_rooms || []).map((room) => {
              const note = scheduledNote(
                this.hass.states[room.automation_note_entity || ""],
              );
              return note ? html`<p class="note">${room.name} · ${note}</p>` : nothing;
            })
          : nothing
      }
    </section>`;
  }
  render() {
    if (!this.hass) return nothing;
    const connected = this.hass.connection?.connected !== false;
    const rows = digestRows(this.hass, this.config, this.front, this.now);
    return html`<header class="digest-heading">
        <div class="eyebrow">Your home</div>
        <h1>${digestSummary(rows, connected)}</h1>
        ${!connected ? html`<p>Reconnect to see current conditions.</p>` : nothing}
      </header>
      <div class="digest-list">
        ${repeat(
          rows,
          (row) => row.id,
          (row) => this.row(row),
        )}
      </div>
      <signal-upcoming .hass=${this.hass} .config=${this.config}></signal-upcoming>
      ${this.pending ? html`<p class="feedback" role="status">Sending…</p>` : nothing}${this.error ? html`<p class="feedback error" role="alert">${this.error}</p>` : nothing}`;
  }
}
customElements.define("signal-digest", SignalDigest);
