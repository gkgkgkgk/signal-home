import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { available, number, words, type Hass } from "./types";
import "./sheet";
import { SignalSheet } from "./sheet";

export class SignalDetails extends LitElement {
  static properties = {
    hass: { attribute: false },
    entity: { type: String },
    dark: { type: Boolean },
    name: { type: String },
    custom: { type: Boolean },
    battery: { type: String },
    records: { state: true },
    loading: { state: true },
    loadError: { state: true },
  };
  static styles = css`
    :host {
      display: block;
    }
    .content {
      color: #222b28;
      font-family: var(--signal-font, system-ui, sans-serif);
    }
    .content.dark {
      color: #f0f2e9;
    }
    .summary {
      background: #e0edb3;
      color: #354225;
      padding: 24px;
      border-radius: 22px;
      margin-bottom: 16px;
    }
    .summary.unavailable {
      background: #e7e5df;
      color: #575c56;
    }
    .summary.alert {
      background: #f7cfac;
      color: #513520;
    }
    .value {
      font-size: 40px;
      letter-spacing: -1.5px;
      margin: 8px 0;
      overflow-wrap: anywhere;
    }
    .caption {
      font-size: 12px;
      opacity: 0.8;
    }
    .facts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin: 16px 0;
    }
    .fact {
      padding: 16px;
      border: 1px solid #81948755;
      border-radius: 18px;
      font-size: 13px;
    }
    .fact span {
      display: block;
      opacity: 0.7;
      font-size: 11px;
      margin-bottom: 6px;
    }
    .advanced {
      width: 100%;
      border: 1px solid #81948766;
      color: inherit;
      background: transparent;
      border-radius: 15px;
      min-height: 46px;
      margin-top: 20px;
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    .hint {
      font-size: 13px;
      line-height: 1.6;
      opacity: 0.7;
    }
    .records {
      margin-top: 20px;
    }
    .records h3 {
      font-size: 14px;
      font-weight: 600;
    }
    .record {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      padding: 13px 4px;
      border-bottom: 1px solid #81948744;
      font-size: 13px;
    }
    .record small {
      display: block;
      font-size: 11px;
      opacity: 0.7;
      margin-top: 4px;
    }
    .record strong {
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    .retry {
      min-height: 44px;
      background: transparent;
      color: inherit;
      border: 1px solid #81948766;
      border-radius: 12px;
      padding: 10px 16px;
      cursor: pointer;
    }
    signal-control,
    signal-graph {
      display: block;
      margin-bottom: 16px;
    }
  `;
  declare hass: Hass;
  entity = "";
  dark = false;
  name = "";
  custom = false;
  battery = "";
  private advanced = false;
  private records: Record<string, any>[] = [];
  private loading = false;
  private loadError = "";
  private sequence = 0;
  protected updated(changed: PropertyValues) {
    if (changed.has("entity")) {
      this.records = [];
      this.loadError = "";
      this.sequence++;
      if (this.entity && this.hass) void this.load();
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.sequence++;
  }
  private async load() {
    const entity = this.entity;
    const domain = entity.split(".")[0];
    if (!["weather", "binary_sensor"].includes(domain)) return;
    const sequence = ++this.sequence;
    this.loading = true;
    this.loadError = "";
    try {
      if (domain === "weather") {
        const features =
          number(this.hass.states[entity]?.attributes.supported_features) || 0;
        const type =
          features & 1
            ? "daily"
            : features & 2
              ? "hourly"
              : features & 4
                ? "twice_daily"
                : "daily";
        const result = await this.hass.callWS<any>({
          type: "call_service",
          domain: "weather",
          service: "get_forecasts",
          service_data: { entity_id: entity, type },
          return_response: true,
        });
        if (sequence === this.sequence)
          this.records = (result.response?.[entity]?.forecast || []).slice(
            0,
            7,
          );
      } else {
        const result = await this.hass.callWS<
          Record<string, Record<string, any>[]>
        >({
          type: "history/history_during_period",
          start_time: new Date(Date.now() - 86400000).toISOString(),
          end_time: new Date().toISOString(),
          entity_ids: [entity],
          minimal_response: true,
          no_attributes: true,
          significant_changes_only: true,
        });
        if (sequence === this.sequence)
          this.records = (result[entity] || [])
            .filter(
              (row, i, rows) =>
                i === 0 ||
                (row.s ?? row.state) !== (rows[i - 1].s ?? rows[i - 1].state),
            )
            .slice(-10)
            .reverse();
      }
    } catch {
      if (sequence === this.sequence)
        this.loadError =
          domain === "weather"
            ? "Forecast could not be loaded."
            : "Recent history could not be loaded.";
    } finally {
      if (sequence === this.sequence) this.loading = false;
    }
  }
  private historyLabel(value: string) {
    const moisture =
      this.hass.states[this.entity]?.attributes.device_class === "moisture";
    return value === "on"
      ? moisture
        ? "Water detected"
        : "Active"
      : value === "off"
        ? moisture
          ? "Dry"
          : "Clear"
        : words(value);
  }
  private native() {
    this.advanced = true;
    (
      this.renderRoot.querySelector("signal-sheet") as SignalSheet
    ).requestClose();
  }
  private closed(e: Event) {
    e.stopPropagation();
    const id = this.entity;
    this.dispatchEvent(
      new CustomEvent("signal-close", { bubbles: true, composed: true }),
    );
    if (this.advanced) {
      this.advanced = false;
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          detail: { entityId: id },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }
  render() {
    const e = this.hass?.states[this.entity];
    const a = e?.attributes || {};
    const domain = this.entity.split(".")[0];
    const ready = available(e);
    const binary = domain === "binary_sensor";
    const moisture = a.device_class === "moisture";
    const label = !ready
      ? "Unavailable"
      : binary
        ? e.state === "on"
          ? moisture
            ? "Water detected"
            : "Active"
          : moisture
            ? "Dry"
            : "Clear"
        : words(e.state);
    const controlled = [
      "light",
      "switch",
      "fan",
      "input_boolean",
      "cover",
      "media_player",
      "scene",
      "script",
      "button",
      "input_button",
      "number",
      "input_number",
      "select",
      "input_select",
      "lock",
    ].includes(domain);
    const numeric =
      domain === "sensor" &&
      (number(e?.state) !== undefined || !!a.unit_of_measurement);
    const battery = this.hass?.states[this.battery];
    return html`<signal-sheet
      .open=${!!this.entity}
      .heading=${this.name || a.friendly_name || "Device details"}
      .dark=${this.dark}
      @signal-close=${this.closed}
      ><div class=${`content ${this.dark ? "dark" : ""}`}>
        ${
          this.custom
            ? html`<slot></slot>`
            : controlled
              ? html`<signal-control
                  .hass=${this.hass}
                  .configuration=${{ type: "custom:signal-control", entity: this.entity, name: this.name || undefined, appearance: this.dark ? "dark" : "light", detail: true }}
                ></signal-control>`
              : html`<div
                    class=${`summary ${!ready ? "unavailable" : binary && e.state === "on" ? "alert" : ""}`}
                  >
                    <div class="caption">
                      ${binary ? "LIVE SENSOR STATUS" : "CURRENT READING"}
                    </div>
                    <div class="value">
                      ${numeric ? (ready ? e.state : "—") : label}
                      ${numeric ? a.unit_of_measurement || "" : ""}
                    </div>
                    <div class="caption">
                      ${!ready ? "This device cannot currently confirm its state." : binary && e.state === "on" ? "Check this area. Open advanced details for more information." : "Reported by Home Assistant"}
                    </div>
                  </div>
                  ${battery ? html`<div class="fact"><span>Battery</span>${available(battery) ? battery.state + "%" : "Unavailable"}</div>` : nothing}${numeric ? html`<signal-graph .hass=${this.hass} .configuration=${{ type: "custom:signal-graph", entity: this.entity, appearance: this.dark ? "dark" : "light" }}></signal-graph>` : nothing}${!controlled && !binary && !numeric ? html`<p class="hint">Additional controls for this device are available in advanced details.</p>` : nothing}`
        }
        ${
          ["weather", "binary_sensor"].includes(domain)
            ? html`<section class="records">
                <h3>
                  ${domain === "weather" ? "The days ahead" : "Recent history · 24 hours"}
                </h3>
                ${
                  this.loading
                    ? html`<p class="hint" role="status">Loading…</p>`
                    : this.loadError
                      ? html`<p class="hint" role="status">${this.loadError}</p>
                          <button class="retry" @click=${this.load}>
                            Try again
                          </button>`
                      : this.records.length
                        ? this.records.map((row) => {
                            const raw =
                              row.datetime ??
                              row.lu ??
                              row.last_updated ??
                              row.lc ??
                              row.last_changed;
                            const time = new Date(
                              typeof raw === "number" ? raw * 1000 : raw,
                            );
                            return html`<div class="record">
                              <div>
                                ${domain === "weather" ? time.toLocaleDateString(this.hass.locale?.language, { weekday: "short", month: "short", day: "numeric" }) : this.historyLabel(row.s ?? row.state)}<small
                                  >${domain === "weather" ? words(row.condition) : time.toLocaleString(this.hass.locale?.language, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</small
                                >
                              </div>
                              ${domain === "weather" ? html`<strong>${number(row.temperature) ?? "—"}° ${row.templow !== undefined ? html`<small>Low ${row.templow}°</small>` : nothing}</strong>` : nothing}
                            </div>`;
                          })
                        : html`<p class="hint">
                            ${domain === "weather" ? "No forecast is available from this provider." : "No recorded history in this period."}
                          </p>`
                }
              </section>`
            : nothing
        }
        <button class="advanced" @click=${this.native}>
          Advanced in Home Assistant ↗
        </button>
      </div></signal-sheet
    >`;
  }
}
customElements.define("signal-details", SignalDetails);
