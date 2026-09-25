import { LitElement, html, css } from "lit";
import { available, number, words, type Hass } from "./types";
import { widgetStyles } from "./widget-styles";
import { icon } from "./icons";
interface MetricConfig {
  type: string;
  entity: string;
  name?: string;
  accent?: string;
  appearance?: string;
  min?: number;
  max?: number;
}
export class SignalMetric extends LitElement {
  static properties = { hass: { attribute: false }, config: { state: true } };
  static styles = [
    widgetStyles,
    css`
      .widget {
        cursor: pointer;
        transition: transform 0.2s;
      }
      .widget:active {
        transform: scale(0.98);
      }
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .metric {
        font-size: 48px;
        letter-spacing: -2px;
        line-height: 1.1;
        margin: 24px 0 12px;
        font-weight: 600;
      }
      .metric small {
        font-size: 21px;
        letter-spacing: 0;
      }
      .meter {
        height: 7px;
        border-radius: 8px;
        background: var(--track);
        overflow: hidden;
        margin-top: 20px;
      }
      .meter span {
        display: block;
        height: 100%;
        background: var(--accent-ink);
        border-radius: 8px;
        transition: width 600ms cubic-bezier(0.16, 1, 0.3, 1);
      }
      .dark .meter span {
        background: var(--accent);
      }
      .symbol {
        color: var(--accent-ink);
        background: var(--accent);
        border-radius: 14px;
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
      }
    `,
  ];
  declare hass: Hass;
  private config: MetricConfig = { type: "custom:signal-metric", entity: "" };
  setConfig(c: MetricConfig) {
    if (!c.entity) throw new Error("Choose an entity.");
    if (c.min !== undefined && c.max !== undefined && c.min >= c.max)
      throw new Error("Maximum must exceed minimum.");
    this.config = { ...c };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: true, selector: { entity: {} } },
        { name: "name", selector: { text: {} } },
        { name: "min", selector: { number: { mode: "box" } } },
        { name: "max", selector: { number: { mode: "box" } } },
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
      entity: Object.keys(hass.states).find((id) => id.startsWith("sensor.")),
    };
  }
  getCardSize() {
    return 3;
  }
  getGridOptions() {
    return { columns: 6, min_columns: 6 };
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
  render() {
    const e = this.hass?.states[this.config.entity];
    const ready = available(e);
    const numeric = ready ? number(e.state) : undefined;
    const percent =
      numeric === undefined
        ? 0
        : Math.max(
            0,
            Math.min(
              100,
              ((numeric - (this.config.min ?? 0)) /
                ((this.config.max ?? 100) - (this.config.min ?? 0))) *
                100,
            ),
          );
    return html`<div
      class=${`widget ${this.config.appearance || "auto"} ${this.config.accent || "lime"}`}
      role="button"
      tabindex="0"
      @click=${this.more}
      @keydown=${(event: KeyboardEvent) => {
        if (["Enter", " "].includes(event.key)) {
          event.preventDefault();
          this.more();
        }
      }}
    >
      <div class="top">
        <h2>
          ${this.config.name || e?.attributes.friendly_name || this.config.entity}
        </h2>
        <span class="symbol"
          >${icon(e?.attributes.device_class === "humidity" ? "drop" : e?.attributes.device_class === "temperature" ? "climate" : "graph")}</span
        >
      </div>
      <div class="metric numeric">
        ${!ready ? "—" : numeric === undefined ? words(e.state) : new Intl.NumberFormat(this.hass?.locale?.language || undefined, { maximumFractionDigits: 1 }).format(numeric)}<small>
          ${e?.attributes.unit_of_measurement || ""}</small
        >
      </div>
      <span class="subtle">${ready ? "Tap for details" : "Unavailable"}</span
      >${this.config.max !== undefined ? html`<div class="meter" aria-hidden="true"><span style=${`width:${percent}%`}></span></div>` : ""}
    </div>`;
  }
}
customElements.define("signal-metric", SignalMetric);
