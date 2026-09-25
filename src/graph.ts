import { LitElement, html, svg, css, nothing, type PropertyValues } from "lit";
import { available, number, type Hass } from "./types";
import {
  normalizeHistory,
  simplifyHistory,
  type HistoryPoint,
} from "./history";
import { widgetStyles } from "./widget-styles";
import { icon } from "./icons";
interface GraphConfig {
  type: string;
  entity: string;
  name?: string;
  hours?: number;
  accent?: string;
  appearance?: string;
}
export class SignalGraph extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    points: { state: true },
    loading: { state: true },
    error: { state: true },
    hours: { state: true },
    cursor: { state: true },
  };
  static styles = [
    widgetStyles,
    css`
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }
      .periods {
        display: flex;
        gap: 3px;
        background: var(--track);
        border-radius: 13px;
        padding: 3px;
      }
      .periods button {
        min-height: 44px;
        min-width: 40px;
        border-radius: 10px;
        background: transparent;
        font-size: 11px;
      }
      .periods button[aria-pressed="true"] {
        background: var(--accent);
        color: var(--accent-ink);
      }
      .reading {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 15px;
        margin: 24px 0 16px;
      }
      .value {
        font-size: 42px;
        font-weight: 600;
        letter-spacing: -2px;
        line-height: 1.15;
      }
      .value small {
        font-size: 18px;
        letter-spacing: -0.5px;
        margin-left: 4px;
      }
      .time {
        font-size: 11px;
        color: var(--subtle);
        margin-top: 7px;
      }
      .chart {
        height: 165px;
        position: relative;
        cursor: crosshair;
        border-radius: 8px;
        touch-action: pan-y;
      }
      .chart svg {
        width: 100%;
        height: 100%;
        overflow: visible;
      }
      .line {
        stroke: var(--accent-ink);
        fill: none;
        stroke-width: 2.5;
        stroke-linejoin: round;
        stroke-linecap: round;
        vector-effect: non-scaling-stroke;
        animation: draw-in 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
      }
      .widget.dark .line {
        stroke: var(--accent);
      }
      .fill {
        fill: var(--accent);
        opacity: 0.3;
      }
      .grid-line {
        stroke: var(--border);
        stroke-dasharray: 3 5;
        stroke-width: 1;
        vector-effect: non-scaling-stroke;
      }
      .cursor-line {
        stroke: var(--subtle);
        stroke-width: 1;
        stroke-dasharray: 3 4;
        vector-effect: non-scaling-stroke;
      }
      .cursor-dot {
        fill: var(--accent-ink);
        stroke: var(--card);
        stroke-width: 3;
        vector-effect: non-scaling-stroke;
      }
      .dark .cursor-dot {
        fill: var(--accent);
      }
      .bounds {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: var(--subtle);
        margin-top: 10px;
      }
      .stats {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin-top: 22px;
        border-top: 1px solid var(--border);
        padding-top: 15px;
        font-size: 11px;
        color: var(--subtle);
      }
      .stats strong {
        display: block;
        color: var(--text);
        font-size: 15px;
        margin-top: 4px;
      }
      .skeleton {
        height: 165px;
        border-radius: 16px;
        background: linear-gradient(
          110deg,
          var(--track),
          var(--card),
          var(--track)
        );
        background-size: 200% 100%;
        animation: shimmer 1.2s 3;
      }
      .header-title {
        display: flex;
        gap: 9px;
        align-items: center;
        font-size: 13px;
        font-weight: 650;
      }
      .empty {
        height: 165px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
      }
      .widget.auto .line {
        stroke: var(--signal-graph-stroke, var(--accent-ink));
      }
      @keyframes draw-in {
        from {
          opacity: 0;
          transform: translateY(5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes shimmer {
        to {
          background-position: -200% 0;
        }
      }
      @media (prefers-color-scheme: dark) {
        .widget.auto .line {
          stroke: var(--accent);
        }
      }
    `,
  ];
  declare hass: Hass;
  private config: GraphConfig = { type: "custom:signal-graph", entity: "" };
  private points: HistoryPoint[] = [];
  private loading = false;
  private error = "";
  private hours = 24;
  private cursor: number | undefined;
  private sequence = 0;
  private queried = "";
  private timer?: ReturnType<typeof setInterval>;
  private end = Date.now();
  private start = this.end - 86400000;
  setConfig(c: GraphConfig) {
    if (!c.entity || typeof c.entity !== "string")
      throw new Error("Choose a numeric sensor entity.");
    if (
      c.hours !== undefined &&
      (!Number.isFinite(c.hours) || c.hours < 1 || c.hours > 168)
    )
      throw new Error("History hours must be between 1 and 168.");
    this.config = { ...c };
    this.hours = c.hours || 24;
    this.queried = "";
    this.points = [];
    this.sequence++;
  }
  set configuration(c: GraphConfig) {
    if (JSON.stringify(c) !== JSON.stringify(this.config)) this.setConfig(c);
  }
  static getConfigForm() {
    return {
      schema: [
        {
          name: "entity",
          required: true,
          selector: { entity: { domain: "sensor" } },
        },
        { name: "name", selector: { text: {} } },
        {
          name: "hours",
          selector: { number: { min: 1, max: 168, mode: "box" } },
        },
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
      entity: Object.keys(hass.states).find(
        (id) =>
          id.startsWith("sensor.") &&
          number(hass.states[id].state) !== undefined,
      ),
    };
  }
  getCardSize() {
    return 6;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 9 };
  }
  connectedCallback() {
    super.connectedCallback();
    this.timer = setInterval(() => {
      if (!document.hidden) void this.fetchHistory();
    }, 60000);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.timer);
    this.sequence++;
    this.queried = "";
  }
  protected updated(changed: PropertyValues) {
    if (
      this.hass &&
      (changed.has("hass") || changed.has("config")) &&
      this.queried !== `${this.config.entity}:${this.hours}`
    )
      void this.fetchHistory();
  }
  private async fetchHistory() {
    if (!this.hass || !this.config.entity || !this.isConnected) return;
    const sequence = ++this.sequence;
    this.queried = `${this.config.entity}:${this.hours}`;
    this.loading = true;
    this.error = "";
    this.cursor = undefined;
    this.end = Date.now();
    this.start = this.end - this.hours * 3600000;
    try {
      const result = await this.hass.callWS<
        Record<string, Record<string, unknown>[]>
      >({
        type: "history/history_during_period",
        start_time: new Date(this.start).toISOString(),
        end_time: new Date(this.end).toISOString(),
        entity_ids: [this.config.entity],
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      });
      if (sequence === this.sequence)
        this.points = normalizeHistory(result[this.config.entity] || []);
    } catch {
      if (sequence === this.sequence) {
        this.error = "History couldn’t be loaded.";
        this.points = [];
      }
    } finally {
      if (sequence === this.sequence) this.loading = false;
    }
  }
  private period(hours: number) {
    this.hours = hours;
    void this.fetchHistory();
  }
  private pointer(event: PointerEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const time =
      this.start +
      Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) *
        (this.end - this.start);
    let closest = 0;
    for (let i = 1; i < this.points.length; i++)
      if (
        Math.abs(this.points[i].time - time) <
        Math.abs(this.points[closest].time - time)
      )
        closest = i;
    this.cursor = closest;
  }
  private keyboard(event: KeyboardEvent) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = this.cursor ?? this.points.length - 1;
    this.cursor =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? this.points.length - 1
          : Math.max(
              0,
              Math.min(
                this.points.length - 1,
                current + (event.key === "ArrowLeft" ? -1 : 1),
              ),
            );
  }
  private format(value: unknown) {
    const n = number(value);
    return n === undefined
      ? "—"
      : new Intl.NumberFormat(this.hass?.locale?.language || undefined, {
          maximumFractionDigits: 1,
        }).format(n);
  }
  render() {
    const entity = this.hass?.states[this.config.entity];
    const unit = entity?.attributes.unit_of_measurement || "";
    const numeric = this.points.filter((p) => p.value !== null);
    const values = numeric.map((p) => p.value!);
    const min = values.length
      ? values.reduce((a, b) => Math.min(a, b), Infinity)
      : 0;
    const max = values.length
      ? values.reduce((a, b) => Math.max(a, b), -Infinity)
      : 1;
    const padding = Math.max((max - min) * 0.16, 1);
    const lower = min - padding;
    const upper = max + padding;
    const x = (p: HistoryPoint) =>
      Math.max(
        0,
        Math.min(600, ((p.time - this.start) / (this.end - this.start)) * 600),
      );
    const y = (p: HistoryPoint) =>
      150 - ((p.value! - lower) / (upper - lower)) * 150;
    const segments: HistoryPoint[][] = [];
    let segment: HistoryPoint[] = [];
    for (const point of simplifyHistory(this.points)) {
      if (point.value === null) {
        if (segment.length) segments.push(segment);
        segment = [];
      } else segment.push(point);
    }
    if (segment.length) segments.push(segment);
    const selected =
      this.cursor !== undefined ? this.points[this.cursor] : undefined;
    const display = selected
      ? selected.value
      : available(entity)
        ? entity.state
        : undefined;
    return html`<article
      class=${`widget ${this.config.appearance || "auto"} ${this.config.accent || "lilac"}`}
    >
      <div class="top">
        <span class="header-title"
          >${icon("graph")}${this.config.name || entity?.attributes.friendly_name || this.config.entity}</span
        >
        <div class="periods" aria-label="History period">
          ${[6, 24, 168].map((h) => html`<button aria-pressed=${this.hours === h} @click=${() => this.period(h)}>${h === 168 ? "7d" : `${h}h`}</button>`)}
        </div>
      </div>
      <div class="reading">
        <div>
          <div class="value numeric">
            ${this.format(display)}<small>${unit}</small>
          </div>
          <div class="time">
            ${selected ? new Date(selected.time).toLocaleString(this.hass?.locale?.language || undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : available(entity) ? "Right now" : "Current reading unavailable"}
          </div>
        </div>
        <span class="subtle"
          >${this.loading ? "Updating…" : `${this.hours === 168 ? "7 days" : this.hours + " hours"} of history`}</span
        >
      </div>
      ${
        this.loading && !this.points.length
          ? html`<div
              class="skeleton"
              role="status"
              aria-label="Loading history"
            ></div>`
          : this.error
            ? html`<div class="empty" role="status">
                ${this.error}<button
                  class="retry"
                  @click=${() => this.fetchHistory()}
                >
                  Try again
                </button>
              </div>`
            : !numeric.length
              ? html`<div class="empty">
                  No numeric history in this period.
                </div>`
              : html`<div
                    class="chart"
                    tabindex="0"
                    role="slider"
                    aria-label="History cursor"
                    aria-valuemin="0"
                    aria-valuemax=${Math.max(0, this.points.length - 1)}
                    aria-valuenow=${this.cursor ?? this.points.length - 1}
                    aria-valuetext=${`${this.format(display)} ${unit}`}
                    @pointermove=${this.pointer}
                    @pointerdown=${this.pointer}
                    @pointerleave=${() => (this.cursor = undefined)}
                    @keydown=${this.keyboard}
                    @blur=${() => (this.cursor = undefined)}
                  >
                    <svg
                      viewBox="0 0 600 160"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      ${[25, 75, 125].map((y) => svg`<line class="grid-line" x1="0" y1=${y} x2="600" y2=${y}/>`)}${segments.map(
                        (s) => {
                          const d = s
                            .map(
                              (p, i) =>
                                `${i ? "L" : "M"}${x(p).toFixed(2)},${y(p).toFixed(2)}`,
                            )
                            .join(" ");
                          return svg`<path class="fill" d=${`${d} L${x(s[s.length - 1])},160 L${x(s[0])},160 Z`}/><path class="line" d=${d}/>${s.length === 1 ? svg`<circle cx=${x(s[0])} cy=${y(s[0])} r="3" fill="var(--accent-ink)"/>` : nothing}`;
                        },
                      )}${selected ? svg`<line class="cursor-line" x1=${x(selected)} x2=${x(selected)} y1="0" y2="160"/>${selected.value !== null ? svg`<circle class="cursor-dot" cx=${x(selected)} cy=${y(selected)} r="5"/>` : nothing}` : nothing}
                    </svg>
                  </div>
                  <div class="bounds">
                    <span
                      >${new Date(this.start).toLocaleString(undefined, { weekday: this.hours > 24 ? "short" : undefined, hour: "numeric", minute: "2-digit" })}</span
                    ><span>Now</span>
                  </div>`
      }
      <div class="stats">
        <span
          >Low<strong
            >${values.length ? this.format(min) : "—"} ${unit}</strong
          ></span
        ><span
          >High<strong
            >${values.length ? this.format(max) : "—"} ${unit}</strong
          ></span
        ><span>Samples<strong>${numeric.length}</strong></span>
      </div>
    </article>`;
  }
}
customElements.define("signal-graph", SignalGraph);
