import { LitElement, html, nothing, type PropertyValues } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { live } from "lit/directives/live.js";
import { styles } from "./styles";
import { icon } from "./icons";
import {
  available,
  number,
  sensorConfig,
  words,
  type Config,
  type Hass,
  type Todo,
} from "./types";
import "./editor";

const tabs = [
  { id: "home", name: "Overview", icon: "home" },
  { id: "climate", name: "Climate", icon: "climate" },
  { id: "safety", name: "Safety", icon: "shield" },
  { id: "lists", name: "Lists", icon: "list" },
];
const modeLabels: Record<string, string> = {
  off: "Off",
  heat: "Heat",
  cool: "Cool",
  heat_cool: "Auto",
  auto: "Auto",
  dry: "Dry",
  fan_only: "Fan",
};

export class SignalHome extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    tab: { state: true },
    dark: { state: true },
    todos: { state: true },
    todoError: { state: true },
    busy: { state: true },
    message: { state: true },
    draft: { state: true },
    rangeSide: { state: true },
  };
  static styles = styles;
  declare hass: Hass;
  private config: Config = { type: "custom:signal-home" };
  private tab = "home";
  private dark = false;
  private todos: Todo[] = [];
  private rangeSide: "low" | "high" = "low";
  private syncRoute = () => {
    const route = location.hash.replace("#signal/", "");
    this.tab = tabs.some((t) => t.id === route) ? route : "home";
  };
  private todoError = "";
  private busy = false;
  private message = "";
  private draft = "";
  private timer?: ReturnType<typeof setTimeout>;
  private clock?: ReturnType<typeof setInterval>;
  private todoSequence = 0;
  private todoSignature = "";
  private todoLoading = false;
  private media = window.matchMedia("(prefers-color-scheme: dark)");
  private get appearanceKey() {
    return `signal-home-appearance:${this.config.title || "Home"}`;
  }
  private applyAppearance = () => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(this.appearanceKey);
    } catch {
      /* Private browser storage may be unavailable. */
    }
    const preference = saved || this.config.appearance || "auto";
    this.dark =
      preference === "dark" || (preference === "auto" && this.media.matches);
  };
  connectedCallback() {
    super.connectedCallback();
    this.syncRoute();
    window.addEventListener("popstate", this.syncRoute);
    window.addEventListener("hashchange", this.syncRoute);
    this.media.addEventListener("change", this.applyAppearance);
    this.applyAppearance();
    this.clock = setInterval(() => {
      this.requestUpdate();
      if (this.config.todo) void this.loadTodos();
    }, 60000);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("popstate", this.syncRoute);
    window.removeEventListener("hashchange", this.syncRoute);
    this.media.removeEventListener("change", this.applyAppearance);
    clearInterval(this.clock);
    clearTimeout(this.timer);
    this.todoSequence++;
  }
  setConfig(config: Config) {
    if (!config || typeof config !== "object")
      throw new Error("Signal Home needs a configuration.");
    for (const key of ["climate", "weather", "todo", "humidity"] as const)
      if (config[key] && typeof config[key] !== "string")
        throw new Error(`${key} must be an entity ID.`);
    if (
      config.sensors &&
      (!Array.isArray(config.sensors) ||
        config.sensors.some(
          (s) => !s || typeof sensorConfig(s).entity !== "string",
        ))
    )
      throw new Error(
        "Sensors must be entity IDs or objects containing entity.",
      );
    if (
      config.favorites &&
      (!Array.isArray(config.favorites) ||
        config.favorites.some((s) => typeof s !== "string"))
    )
      throw new Error("Favorites must be entity IDs.");
    this.config = { ...config };
    this.todoSignature = "";
    this.todoSequence++;
    this.todos = [];
    this.applyAppearance();
  }
  static getConfigElement() {
    return document.createElement("signal-home-editor");
  }
  static getStubConfig(hass: Hass) {
    const first = (domain: string) =>
      Object.keys(hass.states).find((e) => e.startsWith(`${domain}.`));
    return {
      title: "Home",
      climate: first("climate"),
      weather: first("weather"),
      todo: first("todo"),
      appearance: "auto",
      sensors: [],
    };
  }
  getCardSize() {
    return 12;
  }
  getGridOptions() {
    return { columns: "full", min_columns: 12 };
  }
  protected updated(changed: PropertyValues) {
    if (
      (changed.has("hass") || changed.has("config")) &&
      this.config.todo &&
      this.hass
    ) {
      const signature = `${this.config.todo}:${this.hass.states[this.config.todo]?.state}`;
      if (signature !== this.todoSignature) {
        this.todoSignature = signature;
        void this.loadTodos();
      }
    }
  }
  private state(id?: string) {
    return id ? this.hass?.states[id] : undefined;
  }
  private format(value: unknown, digits = 0) {
    const n = number(value);
    return n === undefined
      ? "—"
      : new Intl.NumberFormat(this.hass?.locale?.language || undefined, {
          maximumFractionDigits: digits,
        }).format(n);
  }
  private notify(text: string) {
    this.message = text;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => (this.message = ""), 4500);
  }
  private async service(
    domain: string,
    service: string,
    data: Record<string, unknown>,
    success?: string,
  ) {
    if (this.busy || !this.hass) return;
    this.busy = true;
    try {
      await this.hass.callService(domain, service, data);
      if (success) this.notify(success);
    } catch {
      this.notify(
        "That didn’t go through. Check the connection and try again.",
      );
    } finally {
      this.busy = false;
    }
  }
  private moreInfo(entity?: string) {
    if (entity)
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          detail: { entityId: entity },
          bubbles: true,
          composed: true,
        }),
      );
  }
  private async loadTodos() {
    const entity = this.config.todo;
    if (!entity || !this.hass || this.todoLoading) return;
    this.todoLoading = true;
    const sequence = ++this.todoSequence;
    try {
      const result = await this.hass.callWS<{
        response: Record<string, { items: Todo[] }>;
      }>({
        type: "call_service",
        domain: "todo",
        service: "get_items",
        service_data: { entity_id: entity, status: ["needs_action"] },
        return_response: true,
      });
      if (sequence === this.todoSequence) {
        this.todos = result.response?.[entity]?.items || [];
        this.todoError = "";
      }
    } catch {
      if (sequence === this.todoSequence)
        this.todoError = "Your list couldn’t be loaded. Tap to retry.";
    } finally {
      this.todoLoading = false;
    }
  }
  private async complete(item: Todo) {
    if (this.busy) return;
    this.busy = true;
    try {
      await this.hass.callService("todo", "update_item", {
        entity_id: this.config.todo,
        item: item.uid,
        status: "completed",
      });
      this.todos = this.todos.filter((t) => t.uid !== item.uid);
      this.notify("Checked off. Nicely done.");
    } catch {
      this.notify("Couldn’t update the list. Try again.");
    } finally {
      this.busy = false;
    }
  }
  private async addTodo(event: Event) {
    event.preventDefault();
    const item = this.draft.trim();
    if (!item || this.busy) return;
    this.busy = true;
    try {
      await this.hass.callService("todo", "add_item", {
        entity_id: this.config.todo,
        item,
      });
      this.draft = "";
      await this.loadTodos();
    } catch {
      this.notify("Couldn’t add that item. Try again.");
    } finally {
      this.busy = false;
    }
  }
  private toggleAppearance() {
    this.dark = !this.dark;
    try {
      localStorage.setItem(this.appearanceKey, this.dark ? "dark" : "light");
    } catch {
      /* Optional preference storage. */
    }
  }
  private resetAppearance() {
    try {
      localStorage.removeItem(this.appearanceKey);
    } catch {}
    this.applyAppearance();
    this.notify("Using the dashboard’s appearance setting.");
  }
  private navigate(id: string) {
    if (id !== this.tab) history.pushState(history.state, "", `#signal/${id}`);
    this.tab = id;
  }
  private nav(bottom = false) {
    return html`<nav
      class=${bottom ? "bottom-nav" : ""}
      style=${`--active: ${tabs.findIndex((t) => t.id === this.tab)}`}
      aria-label=${bottom ? "Mobile navigation" : "Dashboard navigation"}
    >
      ${bottom ? html`<span class="nav-indicator" aria-hidden="true"></span>` : nothing}
      ${tabs.map((t) => html`<button aria-current=${this.tab === t.id ? "page" : nothing} @click=${() => this.navigate(t.id)}>${icon(t.icon)}<span>${t.name}</span></button>`)}
    </nav>`;
  }
  private get sensors() {
    return (this.config.sensors || []).map(sensorConfig);
  }
  private get safetySummary() {
    const all = this.sensors;
    const alarm = all.filter(
      (s) => this.state(s.entity)?.state === "on",
    ).length;
    const unknown = all.filter((s) => !available(this.state(s.entity))).length;
    return {
      alarm,
      unknown,
      text: alarm
        ? `${alarm} sensor${alarm > 1 ? "s" : ""} need attention`
        : unknown
          ? `${unknown} sensor${unknown > 1 ? "s" : ""} unavailable`
          : all.length
            ? "Sensors clear"
            : "Make yourself at home",
    };
  }
  private climate() {
    const e = this.state(this.config.climate);
    if (!this.config.climate)
      return html`<section class="panel mint climate">
        <div class="panel-label">${icon("climate")} Climate</div>
        <h2 style="margin-top:40px">Comfort starts here.</h2>
        <p>
          Choose a climate entity in the card editor to bring your home’s
          temperature into focus.
        </p>
      </section>`;
    const ready = available(e);
    const a = e?.attributes || {};
    const current = number(a.current_temperature);
    const low = number(a.target_temp_low);
    const high = number(a.target_temp_high);
    const range =
      ready &&
      e.state === "heat_cool" &&
      low !== undefined &&
      high !== undefined &&
      ((number(a.supported_features) ?? 0) & 2) !== 0;
    const target = range
      ? this.rangeSide === "low"
        ? low
        : high
      : number(a.temperature);
    const min =
      range && this.rangeSide === "high" ? low! : (number(a.min_temp) ?? 7);
    const max =
      range && this.rangeSide === "low" ? high! : (number(a.max_temp) ?? 35);
    const step =
      number(a.target_temp_step) ||
      (this.hass?.config?.unit_system?.temperature === "°F" ? 1 : 0.5);
    const unit = this.hass?.config?.unit_system?.temperature || "°";
    const value = target ?? current;
    const ratio =
      value === undefined
        ? 0
        : Math.max(
            0,
            Math.min(
              1,
              (value - (number(a.min_temp) ?? 7)) /
                Math.max(
                  1,
                  (number(a.max_temp) ?? 35) - (number(a.min_temp) ?? 7),
                ),
            ),
          );
    const adjustable =
      ready &&
      target !== undefined &&
      (range || ((number(a.supported_features) ?? 0) & 1) !== 0) &&
      e.state !== "off";
    const change = (delta: number) => {
      if (!adjustable || target === undefined) return;
      const value = Number(
        Math.max(min, Math.min(max, target + delta)).toFixed(2),
      );
      const data = range
        ? {
            target_temp_low: this.rangeSide === "low" ? value : low,
            target_temp_high: this.rangeSide === "high" ? value : high,
          }
        : { temperature: value };
      void this.service("climate", "set_temperature", {
        entity_id: this.config.climate,
        ...data,
      });
    };
    const modes = Array.isArray(a.hvac_modes) ? (a.hvac_modes as string[]) : [];
    return html`<section
      class="panel mint climate"
      aria-label="Climate control"
    >
      <div class="panel-top">
        <span class="panel-label">${icon("climate")} Home climate</span
        ><button
          class="icon-button"
          aria-label="Climate details"
          @click=${() => this.moreInfo(this.config.climate)}
        >
          ${icon("arrow")}
        </button>
      </div>
      <div class="dial">
        <svg class="dial-svg" viewBox="0 0 240 240" aria-hidden="true">
          <circle
            cx="120"
            cy="120"
            r="101"
            fill="none"
            stroke-width="5"
            stroke-dasharray="476 635"
            stroke-linecap="round"
            class="dial-track"
          />
          <circle
            cx="120"
            cy="120"
            r="101"
            fill="none"
            stroke-width="5"
            stroke-dasharray=${`${ratio * 476} 635`}
            stroke-linecap="round"
            class="dial-fill"
          />
        </svg>
        <div class="dial-center">
          <div class="dial-mode">
            ${ready ? words(a.hvac_action || e.state) : "Unavailable"}
          </div>
          <div class="dial-value" aria-live="polite">
            ${keyed(value, html`<span class="value-in">${ready ? this.format(value, 1) : "—"}</span>`)}<sup
              >${unit}</sup
            >
          </div>
          <div class="dial-caption">
            ${!ready ? "Waiting for your thermostat" : range ? (this.rangeSide === "low" ? "Heat below" : "Cool above") : target !== undefined ? "Target temperature" : "Current temperature"}
          </div>
        </div>
      </div>
      <div class="stepper">
        <button
          aria-label="Decrease target temperature"
          ?disabled=${!adjustable || this.busy || target! <= min}
          @click=${() => change(-step)}
        >
          ${icon("minus")}</button
        ><span
          >${ready ? `${this.format(current, 1)}${unit} inside` : "No reading"}</span
        ><button
          aria-label="Increase target temperature"
          ?disabled=${!adjustable || this.busy || target! >= max}
          @click=${() => change(step)}
        >
          ${icon("plus")}
        </button>
      </div>
      ${range ? html`<div class="range-tabs" aria-label="Temperature range"><button aria-pressed=${this.rangeSide === "low"} @click=${() => (this.rangeSide = "low")}>Heat ${this.format(low, 1)}°</button><button aria-pressed=${this.rangeSide === "high"} @click=${() => (this.rangeSide = "high")}>Cool ${this.format(high, 1)}°</button></div>` : nothing}
      <div class="climate-foot">
        <span
          >${icon("drop")}
          ${this.format(this.state(this.config.humidity)?.state ?? a.current_humidity)}%
          humidity</span
        >${
          modes.length
            ? html`<select
                aria-label="HVAC mode"
                .value=${live(e?.state || "")}
                ?disabled=${!ready || this.busy}
                @change=${(event: Event) => this.service("climate", "set_hvac_mode", { entity_id: this.config.climate, hvac_mode: (event.target as HTMLSelectElement).value })}
              >
                ${modes.map((m) => html`<option value=${m} .selected=${live(m === e?.state)}>${modeLabels[m] || words(m)}</option>`)}
              </select>`
            : nothing
        }
      </div>
    </section>`;
  }
  private weather() {
    const e = this.state(this.config.weather);
    const ready = available(e);
    const a = e?.attributes || {};
    const unit =
      a.temperature_unit || this.hass?.config?.unit_system?.temperature || "°";
    return html`<section class="panel lilac weather">
      <div class="panel-top">
        <span class="panel-label">${icon("sun")} Outside</span
        >${this.config.weather ? html`<button class="icon-button" aria-label="Weather details" @click=${() => this.moreInfo(this.config.weather)}>${icon("arrow")}</button>` : nothing}
      </div>
      <div class="weather-content">
        <div>
          <div class="weather-temp">
            ${ready ? this.format(a.temperature) : "—"}<span
              style="font-size:27px;vertical-align:top;position:relative;top:9px;letter-spacing:-1px"
              >${unit}</span
            >
          </div>
          <div class="weather-condition">
            ${ready ? words(e.state) : "Weather unavailable"}
          </div>
        </div>
        <div
          class=${`weather-art ${e?.state === "clear-night" ? "night" : ""} ${e?.state?.includes("rain") ? "rain" : ""}`}
          aria-hidden="true"
        >
          <div class="sun-disc"></div>
          ${!["sunny", "clear-night"].includes(e?.state || "") ? html`<div class="cloud"></div>` : nothing}
        </div>
      </div>
      <div class="weather-details">
        <span>Humidity ${ready ? this.format(a.humidity) : "—"}%</span
        ><span
          >Wind ${ready ? this.format(a.wind_speed) : "—"}
          ${a.wind_speed_unit || ""}</span
        >
      </div>
    </section>`;
  }
  private grocery(detail = false) {
    return html`<section class="panel apricot groceries">
      <div class="panel-top">
        <span class="panel-label">${icon("list")} Groceries</span
        >${detail ? html`<button class="icon-button" aria-label="Refresh groceries" @click=${() => this.loadTodos()}>${icon("list")}</button>` : html`<button class="icon-button" aria-label="Open groceries" @click=${() => this.navigate("lists")}>${icon("arrow")}</button>`}
      </div>
      ${
        !this.config.todo
          ? html`<p class="empty">
              Select your to-do list in the card editor.
            </p>`
          : this.todoError
            ? html`<button class="text-button" @click=${() => this.loadTodos()}>
                ${this.todoError}
              </button>`
            : html`<div class="list-preview">
                ${
                  this.todos.length
                    ? (detail ? this.todos : this.todos.slice(0, 2)).map(
                        (item) =>
                          html`<div class="todo-row">
                            <button
                              class="check-button"
                              ?disabled=${this.busy}
                              aria-label=${`Complete ${item.summary}`}
                              @click=${() => this.complete(item)}
                            >
                              <span class="check-box"></span></button
                            ><span>${item.summary}</span>
                          </div>`,
                      )
                    : html`<div class="empty">
                        ${this.todoLoading ? "Loading your list…" : "All caught up. Room for something good."}
                      </div>`
                }
              </div>`
      }
      ${detail && this.config.todo ? html`<form class="todo-form" @submit=${this.addTodo}><input aria-label="New grocery item" placeholder="Add something good…" maxlength="255" .value=${this.draft} @input=${(e: Event) => (this.draft = (e.target as HTMLInputElement).value)} /><button aria-label="Add grocery item" ?disabled=${this.busy || !this.draft.trim()}>${icon("plus")}</button></form>` : html`<button class="text-button" @click=${() => this.navigate("lists")}>${this.todos.length ? `${this.todos.length} things on your list` : "Open your list"} ${icon("arrow")}</button>`}
    </section>`;
  }
  private safety() {
    if (!this.sensors.length)
      return html`<div class="notice">
        Add your water, smoke, or opening sensors in the card editor. Their
        actual state will appear here.
      </div>`;
    return html`<div class="sensors">
      ${this.sensors.map((s) => {
        const e = this.state(s.entity);
        const ready = available(e);
        const alarm = e?.state === "on";
        const kind = e?.attributes.device_class;
        const label = !ready
          ? "Unavailable"
          : alarm
            ? kind === "moisture"
              ? "Water detected"
              : kind === "opening" || kind === "door" || kind === "window"
                ? "Open"
                : "Detected"
            : kind === "moisture"
              ? "Dry"
              : kind === "opening" || kind === "door" || kind === "window"
                ? "Closed"
                : "Clear";
        const battery = this.state(s.battery);
        const charge = available(battery) ? number(battery.state) : undefined;
        return html`<button
          class="sensor"
          @click=${() => this.moreInfo(s.entity)}
        >
          <div class="sensor-head">
            <span
              class=${`sensor-symbol ${!ready ? "unknown" : alarm ? "bad" : ""}`}
              >${icon(!ready ? "warn" : alarm ? "warn" : kind === "moisture" ? "drop" : "shield")}</span
            ><span class="sensor-state">${label}</span>
          </div>
          <div>
            <div class="sensor-name">
              ${s.name || e?.attributes.friendly_name || s.entity}
            </div>
            <div class="sensor-sub">
              ${s.battery ? (charge !== undefined ? `${charge}% battery${charge < 20 ? " · Low battery" : ""}` : "Battery unavailable") : "Tap for details"}
            </div>
          </div>
        </button>`;
      })}
    </div>`;
  }
  private favorites() {
    if (!this.config.favorites?.length) return nothing;
    return html`<div class="section-top">
        <h2>Your shortcuts</h2>
        <small>A little less effort.</small>
      </div>
      <div class="favorites">
        ${this.config.favorites.map((id) => {
          const e = this.state(id);
          const domain = id.split(".")[0];
          const isOn = e?.state === "on";
          const canToggle = [
            "light",
            "switch",
            "fan",
            "input_boolean",
          ].includes(domain);
          return html`<button
            class=${`favorite ${isOn ? "on" : ""}`}
            ?disabled=${!available(e) || this.busy}
            @click=${() => (canToggle ? this.service(domain, "toggle", { entity_id: id }) : domain === "scene" ? this.service("scene", "turn_on", { entity_id: id }) : this.moreInfo(id))}
          >
            ${icon(domain === "light" ? "bulb" : "power")}<strong
              >${e?.attributes.friendly_name || id}</strong
            ><small>${available(e) ? words(e.state) : "Unavailable"}</small>
          </button>`;
        })}
      </div>`;
  }
  private content() {
    if (this.tab === "climate")
      return html`<div class="grid detail-grid">
        ${this.climate()}
        <div class="stack">
          ${this.weather()}
          <section class="panel lime">
            <div class="panel-label">${icon("drop")} Inside humidity</div>
            <div class="metric">
              ${this.format(this.state(this.config.humidity)?.state ?? this.state(this.config.climate)?.attributes.current_humidity)}<small
                >%</small
              >
            </div>
            <p class="intro" style="color:inherit">
              A little perspective on your home’s comfort.
            </p>
          </section>
        </div>
      </div>`;
    if (this.tab === "safety")
      return html`${this.safety()}
        <div class="notice" style="margin-top:20px">
          ${this.safetySummary.alarm ? "A sensor is reporting an active state. Open it for details." : this.safetySummary.unknown ? "An unavailable sensor cannot confirm the condition of its space." : "Tap any sensor for its history and details."}
        </div>`;
    if (this.tab === "lists")
      return html`<div style="max-width:740px">${this.grocery(true)}</div>`;
    return html`<div class="grid">
        ${this.climate()}
        <div class="stack">${this.weather()}${this.grocery()}</div>
      </div>
      ${this.favorites()}
      <div class="section-top">
        <h2>Around the house</h2>
        <button class="text-button" @click=${() => this.navigate("safety")}>
          All sensors ${icon("arrow")}
        </button>
      </div>
      ${this.safety()}`;
  }
  render() {
    if (!this.hass)
      return html`<div class="notice" role="status">Connecting to home…</div>`;
    const time = new Date();
    const hour = time.getHours();
    const welcome =
      this.config.greeting ||
      `Good ${hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening"}.`;
    const title =
      this.tab === "home"
        ? welcome
        : this.tab === "climate"
          ? "Just your temperature."
          : this.tab === "safety"
            ? "Peace of mind."
            : "Good things, listed.";
    const subtitle =
      this.tab === "home"
        ? "Your home, at a glance."
        : this.tab === "climate"
          ? "Find your comfortable."
          : this.tab === "safety"
            ? "A clear view of the things that matter."
            : "A little space for everyday essentials.";
    const summary = this.safetySummary;
    return html`<div class=${`app ${this.dark ? "dark" : ""}`}>
      <aside>
        <div class="sidebar-inner">
          <div class="brand">
            <span class="brand-mark" aria-hidden="true"
              ><i></i><i></i><i></i></span
            >signal<span style="font-weight:400">/</span>
          </div>
          <div class="eyebrow sidebar-label">Your place</div>
          ${this.nav()}
          <div class="sidebar-note">
            A little more connected.<span>A little more you.</span>
          </div>
        </div>
      </aside>
      <main>
        <header>
          <div class="eyebrow">
            ${this.config.title || "Home"}
            <span style="color:var(--muted);font-weight:400"
              >/ ${tabs.find((t) => t.id === this.tab)?.name}</span
            >
          </div>
          <div class="header-right">
            <span class="date"
              >${time.toLocaleDateString(this.hass.locale?.language || undefined, { weekday: "short", month: "short", day: "numeric" })}</span
            ><button
              class="icon-button"
              aria-label=${this.dark ? "Switch to light mode" : "Switch to dark mode"}
              @click=${this.toggleAppearance}
            >
              ${icon(this.dark ? "sun" : "moon")}
            </button>
          </div>
        </header>
        <div class="page-heading">
          <div>
            <h1>${title}</h1>
            <p class="intro">${subtitle}</p>
          </div>
          <div class=${`status-pill ${summary.alarm ? "alert" : ""}`}>
            <span class="dot"></span>${summary.text}
          </div>
        </div>
        ${keyed(this.tab, html`<div class="page">${this.content()}</div>`)}
        <footer class="footer">
          <span
            >Signal Home <span style="opacity:.5">/</span> made for living</span
          ><button @click=${this.resetAppearance}>Reset appearance</button>
        </footer>
      </main>
      ${this.nav(true)}${this.message ? html`<div class="toast" role="status">${this.message}</div>` : nothing}
    </div>`;
  }
}
if (!customElements.get("signal-home"))
  customElements.define("signal-home", SignalHome);
const registry = window as unknown as {
  customCards: Record<string, unknown>[];
};
registry.customCards = registry.customCards || [];
registry.customCards.push({
  type: "signal-home",
  name: "Signal Home",
  description:
    "A colorful, fluid home dashboard with climate, weather, groceries and safety.",
  preview: true,
  documentationURL: "https://github.com/gkgkgkgk/signal-home",
});
