import { LitElement, html, css } from "lit";
import type { Config, Hass } from "./types";
export class SignalEditor extends LitElement {
  static properties = { hass: { attribute: false }, config: { state: true } };
  declare hass: Hass;
  private config: Config = { type: "custom:signal-home" };
  static styles = css`
    :host {
      display: block;
    }
    p {
      line-height: 1.6;
      color: var(--secondary-text-color);
    }
    details {
      margin: 18px 0;
    }
    summary {
      cursor: pointer;
      padding: 12px 0;
    }
    textarea {
      width: 100%;
      min-height: 120px;
      font: 13px monospace;
      padding: 12px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 10px;
    }
    .error {
      color: var(--error-color);
    }
  `;
  setConfig(config: Config) {
    this.config = config;
  }
  private change(config: Config) {
    this.config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }
  render() {
    const schema = [
      { name: "title", selector: { text: {} } },
      { name: "greeting", selector: { text: {} } },
      {
        name: "appearance",
        selector: {
          select: {
            options: [
              { value: "auto", label: "Follow system" },
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ],
          },
        },
      },
      ...["climate", "weather", "todo"].map((domain) => ({
        name: domain,
        selector: { entity: { domain } },
      })),
      { name: "humidity", selector: { entity: { domain: "sensor" } } },
      { name: "favorites", selector: { entity: { multiple: true } } },
    ];
    return html`<p>
        <strong>Welcome to Signal.</strong> Select your entities below. For the
        full experience, use this card in a <strong>Panel</strong> view.
        Appearance can also be changed with the dashboard’s sun/moon button.
      </p>
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${schema}
        .computeLabel=${(s: { name: string }) => ({ todo: "Grocery list", greeting: "Custom greeting (optional)", favorites: "Shortcut entities", humidity: "Humidity sensor (optional)" })[s.name] || s.name[0].toUpperCase() + s.name.slice(1)}
        @value-changed=${(event: CustomEvent) => this.change({ ...this.config, ...event.detail.value })}
      ></ha-form>
      <details>
        <summary>History graphs</summary>
        <p>Add numeric sensor histories to the Climate view.</p>
        <ha-form
          .hass=${this.hass}
          .data=${{ graph_entities: (this.config.graphs || []).map((g) => (typeof g === "string" ? g : g.entity)) }}
          .schema=${[{ name: "graph_entities", selector: { entity: { domain: "sensor", multiple: true } } }]}
          .computeLabel=${() => "History sensors"}
          @value-changed=${(event: CustomEvent) => this.change({ ...this.config, graphs: (event.detail.value.graph_entities || []).map((id: string) => (this.config.graphs || []).find((g) => (typeof g === "string" ? g : g.entity) === id) || id) })}
        ></ha-form>
      </details>
      <details>
        <summary>Safety sensors</summary>
        <p>
          Add entity IDs using the selector. Optional display names and battery
          entities can be configured in YAML.
        </p>
        <ha-form
          .hass=${this.hass}
          .data=${{ sensor_entities: (this.config.sensors || []).map((s) => (typeof s === "string" ? s : s.entity)) }}
          .schema=${[{ name: "sensor_entities", selector: { entity: { domain: "binary_sensor", multiple: true } } }]}
          .computeLabel=${() => "Sensors"}
          @value-changed=${(event: CustomEvent) => {
            const selected = event.detail.value.sensor_entities || [];
            this.change({
              ...this.config,
              sensors: selected.map(
                (id: string) =>
                  (this.config.sensors || []).find(
                    (s) => (typeof s === "string" ? s : s.entity) === id,
                  ) || id,
              ),
            });
          }}
        ></ha-form>
      </details>`;
  }
}
if (!customElements.get("signal-home-editor"))
  customElements.define("signal-home-editor", SignalEditor);
