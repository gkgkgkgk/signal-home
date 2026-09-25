import { LitElement, html, css, nothing } from "lit";
import { live } from "lit/directives/live.js";
import { available, number, words, type Hass } from "./types";
import { icon } from "./icons";
import { widgetStyles } from "./widget-styles";

export interface ControlConfig {
  type: string;
  entity: string;
  name?: string;
  accent?: "mint" | "lilac" | "apricot" | "lime";
  appearance?: "auto" | "light" | "dark";
}
export class SignalControl extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    pending: { state: true },
    error: { state: true },
    confirmUnlock: { state: true },
    preview: { state: true },
  };
  static styles = [
    widgetStyles,
    css`
      .control-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }
      .entity-icon {
        width: 44px;
        height: 44px;
        display: grid;
        place-items: center;
        border-radius: 15px;
        background: var(--tint);
        color: var(--accent-ink);
        transition:
          background 0.3s,
          transform 0.4s;
      }
      .on .entity-icon {
        transform: rotate(-7deg);
      }
      .dark .entity-icon {
        color: var(--accent);
      }
      .dark.on .state-dot {
        background: var(--accent);
      }
      @media (prefers-color-scheme: dark) {
        .auto .entity-icon {
          color: var(--accent);
        }
        .auto.on .state-dot {
          background: var(--accent);
        }
      }
      .switch {
        border: 0;
        background: var(--track);
        border-radius: 40px;
        width: 72px;
        height: 44px;
        padding: 4px;
        position: relative;
        transition: background 240ms;
        flex-shrink: 0;
      }
      .switch[aria-checked="true"] {
        background: var(--accent);
      }
      .thumb {
        position: absolute;
        top: 5px;
        left: 5px;
        width: 34px;
        height: 34px;
        background: var(--card);
        color: var(--text);
        border-radius: 50%;
        display: grid;
        place-items: center;
        box-shadow: 0 2px 5px #0002;
        transition: transform 400ms cubic-bezier(0.2, 1.35, 0.35, 1);
      }
      .switch[aria-checked="true"] .thumb {
        transform: translateX(28px);
        background: var(--accent-ink);
        color: var(--accent);
      }
      .thumb svg {
        width: 17px;
        height: 17px;
      }
      .switch:active .thumb {
        scale: 0.92;
      }
      h2 {
        margin: 20px 0 3px;
      }
      .state-line {
        display: flex;
        align-items: center;
        gap: 7px;
        font-size: 13px;
        color: var(--subtle);
      }
      .state-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--subtle);
      }
      .on .state-dot {
        background: var(--accent-ink);
      }
      .slider-block {
        margin-top: 24px;
      }
      .slider-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 9px;
        font-size: 12px;
      }
      .slider-value {
        font-weight: 700;
        font-variant-numeric: tabular-nums;
      }
      .range {
        --fill: 0%;
        appearance: none;
        -webkit-appearance: none;
        width: 100%;
        height: 44px;
        margin: 0;
        cursor: pointer;
        border-radius: 14px;
        background: linear-gradient(
          to right,
          var(--accent) 0 var(--fill),
          var(--track) var(--fill) 100%
        );
        color: var(--accent-ink);
        touch-action: pan-y;
      }
      .range::-webkit-slider-thumb {
        appearance: none;
        -webkit-appearance: none;
        width: 7px;
        height: 25px;
        background: var(--accent-ink);
        border-radius: 6px;
        box-shadow: 0 0 0 7px transparent;
      }
      .range::-moz-range-thumb {
        width: 7px;
        height: 25px;
        border: 0;
        background: var(--accent-ink);
        border-radius: 6px;
      }
      .range:disabled {
        opacity: 0.4;
        cursor: default;
      }
      .button-row {
        display: flex;
        gap: 8px;
        margin-top: 20px;
      }
      .button-row button {
        flex: 1;
      }
      .action {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: 0;
        border-radius: 14px;
        min-height: 44px;
        padding: 10px 14px;
        background: var(--accent);
        color: var(--accent-ink);
        font-weight: 650;
      }
      .secondary {
        background: var(--track);
        color: var(--text);
      }
      .action:active {
        box-shadow: inset 0 2px 4px #0002;
      }
      .cover-window {
        display: block;
        width: 100%;
        height: 92px;
        border: 2px solid var(--border);
        border-radius: 14px;
        margin-top: 20px;
        overflow: hidden;
        background: var(--tint);
      }
      .cover-blind {
        height: var(--closed);
        background: repeating-linear-gradient(
          0deg,
          var(--accent-ink) 0 2px,
          var(--accent) 2px 12px
        );
        border-bottom: 3px solid var(--accent-ink);
        transition: height 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .art {
        width: 64px;
        height: 64px;
        border-radius: 17px;
        object-fit: cover;
        background: var(--tint);
      }
      .track-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .media-meta {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-top: 20px;
      }
      .media-meta > div {
        min-width: 0;
      }
      .media-meta h2 {
        margin: 0 0 5px;
      }
      .color-control {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 15px;
        font-size: 12px;
      }
      .color-control input {
        width: 48px;
        height: 44px;
        border: 0;
        background: transparent;
        cursor: pointer;
        padding: 3px;
      }
      .lock-confirm {
        padding: 14px;
        border: 1px solid var(--border);
        border-radius: 15px;
        margin-top: 18px;
        font-size: 13px;
      }
      .lock-confirm p {
        margin: 0;
      }
      .select {
        width: 100%;
        margin-top: 20px;
        min-height: 44px;
        border-radius: 14px;
        border: 1px solid var(--border);
        background: var(--track);
        color: var(--text);
        padding: 10px;
      }
      @media (prefers-reduced-motion: reduce) {
        .thumb,
        .entity-icon,
        .cover-blind {
          transition: none !important;
        }
      }
    `,
  ];
  declare hass: Hass;
  private config: ControlConfig = { type: "custom:signal-control", entity: "" };
  private pending = false;
  private error = "";
  private confirmUnlock = false;
  private preview: Record<string, number> = {};
  setConfig(c: ControlConfig) {
    if (!c.entity || typeof c.entity !== "string")
      throw new Error("Choose an entity.");
    this.config = { ...c };
    this.preview = {};
  }
  set configuration(c: ControlConfig) {
    if (JSON.stringify(c) !== JSON.stringify(this.config)) this.setConfig(c);
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: true, selector: { entity: {} } },
        { name: "name", selector: { text: {} } },
        {
          name: "accent",
          selector: {
            select: { options: ["mint", "lilac", "apricot", "lime"] },
          },
        },
        {
          name: "appearance",
          selector: { select: { options: ["auto", "light", "dark"] } },
        },
      ],
    };
  }
  static getStubConfig(hass: Hass) {
    return {
      entity:
        Object.keys(hass.states).find((id) => id.startsWith("light.")) ||
        Object.keys(hass.states).find((id) => id.startsWith("switch.")),
    };
  }
  getCardSize() {
    return 4;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 9 };
  }
  private more() {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: this.config.entity },
        bubbles: true,
        composed: true,
      }),
    );
  }
  private isReady() {
    const entity = this.hass?.states[this.config.entity];
    const action = ["scene", "button", "input_button", "script"].includes(
      this.config.entity.split(".")[0],
    );
    return !!(action && entity?.state === "unknown") || available(entity);
  }
  private async send(service: string, data: Record<string, unknown> = {}) {
    if (this.pending || !this.isReady()) return;
    this.pending = true;
    this.error = "";
    const [domain, action] = service.split(".");
    try {
      await this.hass.callService(domain, action, {
        entity_id: this.config.entity,
        ...data,
      });
      this.confirmUnlock = false;
    } catch {
      this.error = "Couldn’t reach this device. Try again.";
    } finally {
      this.pending = false;
      this.preview = {};
    }
  }
  private slider(
    label: string,
    key: string,
    value: number | undefined,
    min: number,
    max: number,
    step: number,
    unit: string,
    commit: (v: number) => void,
    disabled = false,
  ) {
    const displayed = this.preview[key] ?? value;
    const range = max - min;
    const fill =
      displayed === undefined || range <= 0
        ? 0
        : Math.max(0, Math.min(100, ((displayed - min) / range) * 100));
    return html`<div class="slider-block">
      <div class="slider-heading">
        <span>${label}</span
        ><span class="slider-value"
          >${displayed === undefined ? "—" : Math.round(displayed * 10) / 10}${unit}</span
        >
      </div>
      <input
        class="range"
        type="range"
        aria-label=${label}
        min=${min}
        max=${max}
        step=${step}
        .value=${live(String(displayed ?? min))}
        style=${`--fill:${fill}%`}
        ?disabled=${disabled || this.pending}
        @input=${(e: Event) => (this.preview = { ...this.preview, [key]: Number((e.target as HTMLInputElement).value) })}
        @change=${(e: Event) => commit(Math.max(min, Math.min(max, Number((e.target as HTMLInputElement).value))))}
      />
    </div>`;
  }
  render() {
    if (!this.hass) return html`<div class="widget">Connecting…</div>`;
    const e = this.hass.states[this.config.entity];
    const ready = this.isReady();
    const a = e?.attributes || {};
    const domain = this.config.entity.split(".")[0];
    const on = e?.state === "on";
    const features = number(a.supported_features) ?? 0;
    const canToggle = ["light", "switch", "fan", "input_boolean"].includes(
      domain,
    );
    const media = domain === "media_player";
    const cover = domain === "cover";
    const symbol =
      domain === "light"
        ? "bulb"
        : cover
          ? "cover"
          : media
            ? "music"
            : domain === "lock"
              ? "lock"
              : domain === "fan"
                ? "wind"
                : "power";
    const colors = Array.isArray(a.supported_color_modes)
      ? a.supported_color_modes
      : [];
    const dimmable =
      domain === "light" &&
      (a.brightness !== undefined ||
        colors.some((c: string) => !["onoff", "unknown"].includes(c)));
    const rgb = Array.isArray(a.rgb_color) ? a.rgb_color : [255, 255, 255];
    const hex =
      "#" +
      rgb
        .map((n: number) => Math.round(n).toString(16).padStart(2, "0"))
        .join("");
    return html`<article
      class=${`widget ${this.config.appearance || "auto"} ${this.config.accent || "mint"} ${on ? "on" : ""}`}
      aria-busy=${this.pending}
    >
      <div class="control-top">
        <div class="entity-icon">${icon(symbol)}</div>
        ${canToggle ? html`<button class="switch" role="switch" aria-label=${this.config.name || a.friendly_name || this.config.entity} aria-checked=${on} ?disabled=${!ready || this.pending} @click=${() => this.send(`${domain}.${on ? "turn_off" : "turn_on"}`)}><span class="thumb">${icon(on ? "check" : "power")}</span></button>` : html`<button class="icon-button" aria-label="Device details" @click=${this.more}>${icon("arrow")}</button>`}
      </div>
      <h2>${this.config.name || a.friendly_name || this.config.entity}</h2>
      <div class="state-line">
        <span class="state-dot"></span
        >${this.pending ? "Updating…" : ready ? words(e.state) : "Unavailable"}
      </div>
      ${dimmable ? this.slider("Brightness", "brightness", on ? ((number(a.brightness) ?? 0) / 255) * 100 : 0, 0, 100, 1, "%", (v) => this.send(v === 0 ? "light.turn_off" : "light.turn_on", v ? { brightness_pct: Math.round(v) } : {}), !ready) : nothing}
      ${domain === "light" && colors.includes("color_temp") && number(a.min_color_temp_kelvin) !== undefined && number(a.max_color_temp_kelvin) !== undefined ? this.slider("Color temperature", "kelvin", number(a.color_temp_kelvin), Number(a.min_color_temp_kelvin), Number(a.max_color_temp_kelvin), 50, " K", (v) => this.send("light.turn_on", { color_temp_kelvin: v }), !ready) : nothing}
      ${
        domain === "light" &&
        colors.some((c: string) =>
          ["rgb", "rgbw", "rgbww", "hs", "xy"].includes(c),
        )
          ? html`<label class="color-control"
              >Light color<input
                type="color"
                aria-label="Light color"
                .value=${live(hex)}
                ?disabled=${!ready || this.pending}
                @change=${(event: Event) => {
                  const value = (event.target as HTMLInputElement).value;
                  void this.send("light.turn_on", {
                    rgb_color: [1, 3, 5].map((i) =>
                      parseInt(value.slice(i, i + 2), 16),
                    ),
                  });
                }}
            /></label>`
          : nothing
      }
      ${domain === "fan" && features & 1 ? this.slider("Fan speed", "speed", number(a.percentage), 0, 100, number(a.percentage_step) || 1, "%", (v) => this.send("fan.set_percentage", { percentage: Math.round(v) }), !ready) : nothing}
      ${
        cover
          ? html`<div class="cover-window" aria-hidden="true">
                <div
                  class="cover-blind"
                  style=${`--closed:${100 - (number(a.current_position) ?? (e?.state === "closed" ? 0 : 100))}%`}
                ></div>
              </div>
              <div class="button-row">
                ${features & 1 ? html`<button class="action" ?disabled=${!ready || this.pending} aria-label="Open cover" @click=${() => this.send("cover.open_cover")}>${icon("up")}</button>` : nothing}${features & 8 ? html`<button class="action secondary" ?disabled=${!ready || this.pending} aria-label="Stop cover" @click=${() => this.send("cover.stop_cover")}>${icon("stop")}</button>` : nothing}${features & 2 ? html`<button class="action" ?disabled=${!ready || this.pending} aria-label="Close cover" @click=${() => this.send("cover.close_cover")}>${icon("down")}</button>` : nothing}
              </div>
              ${features & 4 ? this.slider("Cover position", "cover", number(a.current_position), 0, 100, 1, "%", (v) => this.send("cover.set_cover_position", { position: Math.round(v) }), !ready) : nothing}`
          : nothing
      }
      ${
        media
          ? html`<div class="media-meta">
                ${a.entity_picture ? html`<img class="art" src=${a.entity_picture} alt="" loading="lazy" />` : nothing}
                <div>
                  <h2 class="track-title" title=${a.media_title || ""}>
                    ${a.media_title || "Nothing playing"}
                  </h2>
                  <span class="subtle"
                    >${a.media_artist || a.source || ""}</span
                  >
                </div>
              </div>
              <div class="button-row">
                ${features & 16 ? html`<button class="action secondary" aria-label="Previous track" ?disabled=${!ready || this.pending} @click=${() => this.send("media_player.media_previous_track")}>${icon("previous")}</button>` : nothing}${features & (1 | 16384) ? html`<button class="action" aria-label=${e?.state === "playing" ? "Pause" : "Play"} ?disabled=${!ready || this.pending || (e?.state === "playing" ? !(features & 1) : !(features & 16384))} @click=${() => this.send(`media_player.${e?.state === "playing" ? "media_pause" : "media_play"}`)}>${icon(e?.state === "playing" ? "pause" : "play")}</button>` : nothing}${features & 32 ? html`<button class="action secondary" aria-label="Next track" ?disabled=${!ready || this.pending} @click=${() => this.send("media_player.media_next_track")}>${icon("next")}</button>` : nothing}
              </div>
              ${features & 4 ? this.slider("Volume", "volume", number(a.volume_level) === undefined ? undefined : Number(a.volume_level) * 100, 0, 100, 1, "%", (v) => this.send("media_player.volume_set", { volume_level: v / 100 }), !ready) : nothing}`
          : nothing
      }
      ${["number", "input_number"].includes(domain) ? this.slider("Value", "number", number(e?.state), number(a.min) ?? 0, number(a.max) ?? 100, number(a.step) || 1, a.unit_of_measurement || "", (v) => this.send(`${domain}.set_value`, { value: v }), !ready) : nothing}
      ${
        ["select", "input_select"].includes(domain)
          ? html`<select
              class="select"
              aria-label=${this.config.name || a.friendly_name || "Option"}
              .value=${live(e?.state || "")}
              ?disabled=${!ready || this.pending}
              @change=${(event: Event) => this.send(`${domain}.select_option`, { option: (event.target as HTMLSelectElement).value })}
            >
              ${(a.options || []).map((option: string) => html`<option value=${option} .selected=${live(e?.state === option)}>${option}</option>`)}
            </select>`
          : nothing
      }
      ${["scene", "button", "input_button", "script"].includes(domain) ? html`<div class="button-row"><button class="action" ?disabled=${!ready || this.pending} @click=${() => this.send(`${domain}.${domain.includes("button") ? "press" : "turn_on"}`)}>${icon("play")} ${domain.includes("button") ? "Press" : domain === "scene" ? "Activate" : "Run"}</button></div>` : nothing}
      ${
        domain === "lock"
          ? html`<div class="button-row">
                <button
                  class="action"
                  ?disabled=${!ready || this.pending}
                  @click=${() => (e.state === "locked" ? (this.confirmUnlock = true) : this.send("lock.lock"))}
                >
                  ${icon("lock")} ${e?.state === "locked" ? "Unlock…" : "Lock"}
                </button>
              </div>
              ${
                this.confirmUnlock
                  ? html`<div class="lock-confirm">
                      <p>
                        Unlock
                        ${this.config.name || a.friendly_name || "this lock"}?
                      </p>
                      <div class="button-row">
                        <button
                          class="action secondary"
                          @click=${() => (this.confirmUnlock = false)}
                        >
                          Cancel</button
                        ><button
                          class="action"
                          ?disabled=${this.pending}
                          @click=${() => this.send("lock.unlock")}
                        >
                          Unlock
                        </button>
                      </div>
                    </div>`
                  : nothing
              }`
          : nothing
      }
      ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
    </article>`;
  }
}
customElements.define("signal-control", SignalControl);
