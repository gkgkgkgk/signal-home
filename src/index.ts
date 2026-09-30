import { LitElement, html, nothing, type PropertyValues } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { live } from "lit/directives/live.js";
import { repeat } from "lit/directives/repeat.js";
import type { SignalSheet } from "./sheet";
import { styles } from "./styles";
import { pocketStyles } from "./pocket-styles";
import { ImmersiveChrome } from "./immersive-chrome";
import {
  appearanceModes,
  homeHour,
  isDark,
  type Appearance,
} from "./appearance";
import { icon } from "./icons";
import {
  available,
  number,
  sensorConfig,
  words,
  type Config,
  type Entity,
  type Hass,
  type Todo,
} from "./types";
import "./editor";
import "./control";
import "./graph";
import "./metric";
import "./details";

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
    detailEntity: { state: true },
    menuOpen: { state: true },
    narrow: { state: true },
    contentScrolled: { state: true },
    appearance: { state: true },
    completedTodos: { state: true },
    undoItem: { state: true },
    deleteTarget: { state: true },
    deleteError: { state: true },
    selectedTodo: { state: true },
  };
  static styles = [styles, pocketStyles];
  declare hass: Hass;
  private config: Config = { type: "custom:signal-home" };
  private tab = "home";
  private dark = false;
  private appearance: Appearance = "auto";
  private completedTodos: Todo[] = [];
  private completionTimes: Record<string, number> = {};
  private undoItem?: Todo;
  private deleteTarget?: { item: Todo; entity: string };
  private deleteError = "";
  private todoMutating = false;
  private todoRefreshPending = false;
  private todoOrder = new Map<string, number>();
  private selectedTodo = "";
  private loadedTodo = "";
  private todoListStates?: Hass["states"];
  private discoveredTodos: Entity[] = [];
  private get todoLists() {
    if (this.todoListStates === this.hass?.states) return this.discoveredTodos;
    this.todoListStates = this.hass?.states;
    this.discoveredTodos = Object.entries(this.hass?.states || {})
      .filter(([id]) => id.startsWith("todo."))
      .map(([id, entity]) => ({ ...entity, entity_id: id }))
      .sort((a, b) =>
        this.listName(a.entity_id).localeCompare(this.listName(b.entity_id)),
      );
    return this.discoveredTodos;
  }
  private listName(entity: string) {
    return (
      this.hass?.states[entity]?.attributes.friendly_name ||
      words(entity.replace(/^todo\./, ""))
    );
  }
  private get todoEntity(): string | undefined {
    const lists = this.todoLists;
    return (
      lists.find((entity) => entity.entity_id === this.selectedTodo)
        ?.entity_id ||
      lists.find((entity) => entity.entity_id === this.config.todo)
        ?.entity_id ||
      lists[0]?.entity_id
    );
  }
  private get todoName() {
    return this.todoEntity ? this.listName(this.todoEntity) : "To-do lists";
  }
  private chooseTodo(entity: string) {
    if (this.busy || entity === this.todoEntity) return;
    this.selectedTodo = entity;
    this.resetTodoState();
  }
  private resetTodoState() {
    this.closeDelete();
    this.deleteTarget = undefined;
    this.loadedTodo = this.todoEntity || "";
    this.todoSignature = "";
    this.todoSequence++;
    this.todos = [];
    this.completedTodos = [];
    this.todoOrder.clear();
    this.undoItem = undefined;
    this.message = "";
    this.draft = "";
    this.todoError = "";
    try {
      const saved = JSON.parse(
        localStorage.getItem(this.completionKey) || "{}",
      );
      this.completionTimes =
        saved && typeof saved === "object" && !Array.isArray(saved)
          ? saved
          : {};
    } catch {
      this.completionTimes = {};
    }
  }
  private detailEntity = "";
  private menuOpen = false;
  private contentScrolled = false;
  private onContentScroll = (event: Event) => {
    this.contentScrolled = (event.currentTarget as HTMLElement).scrollTop > 4;
  };
  private chrome = new ImmersiveChrome();
  private chromePath = "";
  private get immersive() {
    return (
      !!this.config.immersive &&
      !new URLSearchParams(location.search).has("disable_km")
    );
  }
  private syncChrome = () => {
    if (
      this.isConnected &&
      this.immersive &&
      location.pathname === this.chromePath
    )
      this.chrome.sync(this.dark, this.hass?.auth?.external);
    else this.chrome.release();
  };
  private phone = window.matchMedia("(max-width: 760px)");
  private narrow = this.phone.matches;
  private resize = () => {
    this.narrow = this.phone.matches;
  };
  private todos: Todo[] = [];
  private rangeSide: "low" | "high" = "low";
  private syncRoute = () => {
    const route = location.hash.replace("#signal/", "");
    const next = tabs.some((t) => t.id === route) ? route : "home";
    if (next !== this.tab) {
      this.tab = next;
      this.resetScroll();
    }
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
    return `signal-home-appearance-v2:${this.config.title || "Home"}`;
  }
  private applyAppearance = () => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(this.appearanceKey);
    } catch {
      /* Private browser storage may be unavailable. */
    }
    const preference = saved || this.config.appearance || "auto";
    this.appearance = appearanceModes.includes(preference as Appearance)
      ? (preference as Appearance)
      : "auto";
    this.dark = isDark(
      this.appearance,
      this.media.matches,
      new Date(),
      this.hass?.config?.time_zone,
    );
  };
  connectedCallback() {
    super.connectedCallback();
    this.chromePath = location.pathname;
    window.addEventListener("location-changed", this.syncChrome);
    window.addEventListener("popstate", this.syncChrome);
    this.syncRoute();
    window.addEventListener("popstate", this.syncRoute);
    window.addEventListener("hashchange", this.syncRoute);
    this.media.addEventListener("change", this.applyAppearance);
    document.addEventListener("visibilitychange", this.applyAppearance);
    this.phone.addEventListener("change", this.resize);
    this.resize();
    this.applyAppearance();
    this.clock = setInterval(() => {
      this.applyAppearance();
      this.requestUpdate();
      if (this.todoEntity) void this.loadTodos();
    }, 60000);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("location-changed", this.syncChrome);
    window.removeEventListener("popstate", this.syncChrome);
    this.chrome.release();
    window.removeEventListener("popstate", this.syncRoute);
    window.removeEventListener("hashchange", this.syncRoute);
    this.media.removeEventListener("change", this.applyAppearance);
    document.removeEventListener("visibilitychange", this.applyAppearance);
    this.phone.removeEventListener("change", this.resize);
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
    if (
      config.graphs &&
      (!Array.isArray(config.graphs) ||
        config.graphs.some(
          (entry) =>
            !entry ||
            (typeof entry !== "string" &&
              (typeof entry.entity !== "string" ||
                (entry.hours !== undefined &&
                  (!Number.isFinite(entry.hours) ||
                    entry.hours < 1 ||
                    entry.hours > 168)))),
        ))
    )
      throw new Error(
        "Graphs need an entity ID and optional hours between 1 and 168.",
      );
    this.config = { ...config };
    this.selectedTodo = "";
    this.resetTodoState();
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
    if (changed.has("hass")) this.applyAppearance();
    this.syncChrome();
    if (
      (changed.has("hass") ||
        changed.has("config") ||
        changed.has("selectedTodo")) &&
      this.hass
    ) {
      if ((this.todoEntity || "") !== this.loadedTodo) this.resetTodoState();
      const signature = `${this.todoEntity}:${this.hass.states[this.todoEntity || ""]?.state}`;
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
    this.undoItem = undefined;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.message = "";
      this.undoItem = undefined;
    }, 8000);
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
    if (entity) this.detailEntity = entity;
  }
  private async loadTodos() {
    const entity = this.todoEntity;
    if (!entity || !this.hass) return;
    if (this.todoMutating || this.todoLoading) {
      this.todoRefreshPending = true;
      return;
    }
    this.todoRefreshPending = false;
    this.todoLoading = true;
    const sequence = ++this.todoSequence;
    try {
      const result = await this.hass.callWS<{
        response: Record<string, { items: Todo[] }>;
      }>({
        type: "call_service",
        domain: "todo",
        service: "get_items",
        service_data: { entity_id: entity },
        return_response: true,
      });
      if (sequence === this.todoSequence && entity === this.todoEntity) {
        const items = result.response?.[entity]?.items;
        if (!Array.isArray(items)) throw new Error("Missing list response");
        this.todoOrder = new Map(items.map((item, index) => [item.uid, index]));
        this.todos = items.filter((item) => item.status === "needs_action");
        this.completedTodos = items.filter(
          (item) => item.status === "completed",
        );
        const ids = new Set(this.completedTodos.map((item) => item.uid));
        for (const id of Object.keys(this.completionTimes))
          if (!ids.has(id)) delete this.completionTimes[id];
        for (const item of items) {
          if (item.status !== "completed")
            delete this.completionTimes[item.uid];
          else if (!Number.isFinite(this.completionTimes[item.uid]))
            this.completionTimes[item.uid] = Date.now();
        }
        this.saveCompletionTimes();
        this.todoError = "";
      }
    } catch {
      if (sequence === this.todoSequence)
        this.todoError = "Your list couldn’t be loaded. Tap to retry.";
    } finally {
      this.todoLoading = false;
      if (this.todoRefreshPending && !this.todoMutating && this.isConnected)
        void this.loadTodos();
    }
  }
  private get completionKey() {
    return `signal-completed:${this.todoEntity || ""}`;
  }
  private saveCompletionTimes() {
    try {
      localStorage.setItem(
        this.completionKey,
        JSON.stringify(this.completionTimes),
      );
    } catch {
      /* Optional fallback timestamps, never task contents. */
    }
  }
  private completedAt(item: Todo) {
    const recorded = item.completed ? Date.parse(item.completed) : NaN;
    return Number.isFinite(recorded)
      ? recorded
      : this.completionTimes[item.uid] || Date.now();
  }
  private motionRows() {
    return Array.from(
      this.renderRoot.querySelectorAll<HTMLElement>("[data-todo-motion]"),
    ).filter((row) => row.getClientRects().length);
  }
  /** Commit only after HA accepts the change; keep refreshes out of the transition. */
  private async moveTodo(
    uid: string,
    commit: () => void,
    entity: string,
    focused = false,
  ) {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rows = this.motionRows();
    const outgoing = rows.find((row) => row.dataset.todoUid === uid);
    if (outgoing && !reduced) {
      await outgoing
        .animate(
          [
            { opacity: 1, transform: "none" },
            { opacity: 0, transform: "translateX(10px) scale(.98)" },
          ],
          { duration: 150, easing: "ease-in", fill: "forwards" },
        )
        .finished.catch(() => {});
    }
    if (entity !== this.todoEntity || !this.isConnected) return;
    const before = new Map(
      rows.map((row) => [
        row.dataset.todoMotion!,
        row.getBoundingClientRect().top,
      ]),
    );
    commit();
    await this.updateComplete;
    const next = this.motionRows();
    const animations: Animation[] = [];
    if (!reduced)
      for (const row of next) {
        const previous = before.get(row.dataset.todoMotion!);
        const moved = row.dataset.todoUid === uid;
        const delta =
          previous === undefined || moved
            ? 12
            : previous - row.getBoundingClientRect().top;
        if (!delta && !moved) continue;
        animations.push(
          row.animate(
            [
              {
                transform: `translateY(${delta}px)`,
                opacity: previous === undefined || moved ? 0 : 1,
              },
              { transform: "none", opacity: 1 },
            ],
            { duration: 300, easing: "cubic-bezier(.2,.8,.2,1)" },
          ),
        );
      }
    await Promise.all(
      animations.map((animation) => animation.finished.catch(() => {})),
    );
    // A keyboard action must not strand focus when its row changes sections.
    // Do not steal focus from a modal or a different tab opened in the meantime.
    if (
      focused &&
      this.tab === "lists" &&
      !this.deleteTarget &&
      !this.menuOpen &&
      !this.detailEntity
    ) {
      const destination = next.find((row) => row.dataset.todoUid === uid);
      const button =
        destination?.querySelector<HTMLButtonElement>(".check-button");
      // Wait until the caller re-enables the controls, without opening a mobile keyboard.
      requestAnimationFrame(() => {
        if (button?.isConnected && !button.disabled)
          button.focus({ preventScroll: true });
        else if (this.tab === "lists")
          this.renderRoot
            .querySelector<HTMLButtonElement>('[aria-label="Refresh list"]')
            ?.focus({ preventScroll: true });
      });
    }
  }
  private closeDelete() {
    if (this.deleteTarget)
      this.renderRoot
        .querySelector<SignalSheet>("#delete-sheet")
        ?.requestClose();
  }
  private askDelete(item: Todo) {
    if (this.busy || !this.todoEntity || !this.canDeleteTodo) return;
    this.deleteError = "";
    this.deleteTarget = { item, entity: this.todoEntity };
  }
  private async deleteTodo() {
    const target = this.deleteTarget;
    if (
      !target ||
      this.busy ||
      target.entity !== this.todoEntity ||
      !this.canDeleteTodo
    )
      return;
    this.busy = true;
    this.todoMutating = true;
    this.todoSequence++;
    try {
      await this.hass.callService("todo", "remove_item", {
        entity_id: target.entity,
        item: target.item.uid,
      });
      if (target.entity !== this.todoEntity || !this.isConnected) return;
      await this.moveTodo(
        target.item.uid,
        () => {
          this.todos = this.todos.filter(
            (item) => item.uid !== target.item.uid,
          );
          this.completedTodos = this.completedTodos.filter(
            (item) => item.uid !== target.item.uid,
          );
          delete this.completionTimes[target.item.uid];
          this.saveCompletionTimes();
          this.notify("Permanently deleted.");
        },
        target.entity,
      );
      if (this.deleteTarget === target) this.closeDelete();
    } catch {
      if (this.deleteTarget === target)
        this.deleteError =
          "Couldn’t delete this item. Check your connection and try again.";
      else this.notify("Couldn’t delete this item. Try again.");
    } finally {
      this.busy = false;
      this.todoMutating = false;
      if (this.todoRefreshPending && this.isConnected) void this.loadTodos();
    }
  }
  private async complete(item: Todo, restore = false) {
    if (this.busy || !this.todoSupports(4)) return;
    const entity = this.todoEntity;
    const active = this.shadowRoot?.activeElement;
    const focused =
      !!active?.matches(":focus-visible") &&
      active.closest<HTMLElement>("[data-todo-uid]")?.dataset.todoUid ===
        item.uid;
    this.busy = true;
    this.todoMutating = true;
    this.todoSequence++;
    try {
      await this.hass.callService("todo", "update_item", {
        entity_id: entity,
        item: item.uid,
        status: restore ? "needs_action" : "completed",
      });
      if (entity !== this.todoEntity) return;
      await this.moveTodo(
        item.uid,
        () => {
          if (restore) {
            delete this.completionTimes[item.uid];
            this.completedTodos = this.completedTodos.filter(
              (t) => t.uid !== item.uid,
            );
            if (!this.todos.some((t) => t.uid === item.uid))
              this.todos = [
                ...this.todos,
                { ...item, status: "needs_action", completed: null },
              ].sort(
                (a, b) =>
                  (this.todoOrder.get(a.uid) ?? Infinity) -
                  (this.todoOrder.get(b.uid) ?? Infinity),
              );
            this.notify("Back on your list.");
          } else {
            this.completionTimes[item.uid] = Date.now();
            this.todos = this.todos.filter((t) => t.uid !== item.uid);
            this.completedTodos = [
              {
                ...item,
                status: "completed",
                completed: new Date().toISOString(),
              },
              ...this.completedTodos.filter((t) => t.uid !== item.uid),
            ];
            this.notify("Checked off.");
            this.undoItem = item;
          }
          this.saveCompletionTimes();
        },
        entity!,
        focused,
      );
    } catch {
      this.notify("Couldn’t update the list. Try again.");
    } finally {
      this.busy = false;
      this.todoMutating = false;
      if (this.todoRefreshPending && this.isConnected) void this.loadTodos();
    }
  }
  private async addTodo(event: Event) {
    event.preventDefault();
    const item = this.draft.trim();
    if (!item || this.busy || !this.todoSupports(1)) return;
    const entity = this.todoEntity;
    if (!entity) return;
    this.busy = true;
    try {
      await this.hass.callService("todo", "add_item", {
        entity_id: entity,
        item,
      });
      if (entity !== this.todoEntity) return;
      this.draft = "";
      await this.loadTodos();
    } catch {
      this.notify("Couldn’t add that item. Try again.");
    } finally {
      this.busy = false;
    }
  }
  private chooseAppearance(mode: Appearance) {
    if (!appearanceModes.includes(mode)) return;
    try {
      localStorage.setItem(this.appearanceKey, mode);
    } catch {
      /* Optional preference storage. */
    }
    this.config = { ...this.config, appearance: mode };
    this.applyAppearance();
  }
  private navigate(id: string) {
    if (id !== this.tab) history.pushState(history.state, "", `#signal/${id}`);
    this.tab = id;
    this.resetScroll();
  }
  private resetScroll() {
    void this.updateComplete.then(() =>
      this.renderRoot.querySelector("main")?.scrollTo({ top: 0 }),
    );
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
  private climate(detail = false) {
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
          ?hidden=${detail}
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
  private weather(detail = false) {
    const e = this.state(this.config.weather);
    const ready = available(e);
    const a = e?.attributes || {};
    const unit =
      a.temperature_unit || this.hass?.config?.unit_system?.temperature || "°";
    return html`<section class="panel lilac weather">
      <div class="panel-top">
        <span class="panel-label">${icon("sun")} Outside</span
        >${this.config.weather && !detail ? html`<button class="icon-button" aria-label="Weather details" @click=${() => this.moreInfo(this.config.weather)}>${icon("arrow")}</button>` : nothing}
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
  private get canDeleteTodo() {
    return this.todoSupports(2);
  }
  private todoSupports(feature: number) {
    const state = this.hass.states[this.todoEntity || ""];
    return (
      available(state) &&
      !!(Number(state?.attributes.supported_features) & feature)
    );
  }
  private todoRow(item: Todo, completed = false) {
    return html`<div
      class=${`todo-row ${completed ? "completed-row" : ""}`}
      data-todo-uid=${item.uid}
      data-todo-motion=${`row:${item.uid}`}
    >
      <button
        class="check-button"
        ?disabled=${this.busy || !this.todoSupports(4)}
        aria-label=${`${completed ? "Restore" : "Complete"} ${item.summary}`}
        @click=${() => this.complete(item, completed)}
      >
        <span class="check-box">${completed ? icon("check") : nothing}</span>
      </button>
      <span class="todo-label">${item.summary}</span>
      <button
        class="todo-trash"
        ?disabled=${this.busy || !this.canDeleteTodo}
        aria-label=${`Delete ${item.summary}`}
        title="Delete permanently"
        @click=${() => this.askDelete(item)}
      >
        ${icon("trash")}
      </button>
    </div>`;
  }
  private todoListPicker() {
    if (this.todoLists.length < 2) return nothing;
    return html`<div
      class="list-switcher"
      role="group"
      aria-label="Your to-do lists"
    >
      ${this.todoLists.map(
        (entity) =>
          html`<button
            aria-label=${`Open list ${this.listName(entity.entity_id)}`}
            aria-pressed=${entity.entity_id === this.todoEntity}
            ?disabled=${this.busy}
            @click=${() => this.chooseTodo(entity.entity_id)}
          >
            ${icon("list")}<span>${this.listName(entity.entity_id)}</span>
            <small>${available(entity) ? entity.state : "Offline"}</small>
          </button>`,
      )}
    </div>`;
  }
  private grocery(detail = false) {
    return html`<section class="panel apricot groceries">
      <div class="panel-top">
        <span class="panel-label">${icon("list")} ${this.todoName}</span
        >${detail ? html`<button class="icon-button" aria-label="Refresh list" @click=${() => this.loadTodos()}>${icon("list")}</button>` : html`<button class="icon-button" aria-label="Open to-do lists" @click=${() => this.navigate("lists")}>${icon("arrow")}</button>`}
      </div>
      ${
        !this.todoEntity
          ? html`<p class="empty">
              No to-do lists are available. Add a list in Home Assistant and it
              will appear here.
            </p>`
          : this.todoError
            ? html`<button class="text-button" @click=${() => this.loadTodos()}>
                ${this.todoError}
              </button>`
            : html`<div class="list-preview">
                ${
                  this.todos.length
                    ? repeat(
                        detail ? this.todos : this.todos.slice(0, 2),
                        (item) => item.uid,
                        (item) => this.todoRow(item),
                      )
                    : html`<div class="empty">
                        ${this.todoLoading ? "Loading your list…" : "All caught up. Room for something good."}
                      </div>`
                }
              </div>`
      }
      ${detail && this.todoEntity ? html`<form class="todo-form" data-todo-motion="form" @submit=${this.addTodo}><input aria-label="New task" placeholder="Add something good…" maxlength="255" ?disabled=${!this.todoSupports(1)} .value=${this.draft} @input=${(e: Event) => (this.draft = (e.target as HTMLInputElement).value)} /><button aria-label="Add task" ?disabled=${this.busy || !this.draft.trim() || !this.todoSupports(1)}>${icon("plus")}</button></form>` : html`<button class="text-button" @click=${() => this.navigate("lists")}>${this.todos.length ? `${this.todos.length} things on your list` : "Open your list"} ${icon("arrow")}</button>`}
      ${detail && !this.todoError ? this.completedList() : nothing}
    </section>`;
  }
  private completedList() {
    if (!this.completedTodos.length) return nothing;
    const cutoff = Date.now() - 86400000;
    const sorted = [...this.completedTodos].sort(
      (a, b) => this.completedAt(b) - this.completedAt(a),
    );
    const recent = sorted.filter((item) => this.completedAt(item) > cutoff);
    const older = sorted.filter((item) => this.completedAt(item) <= cutoff);
    const rows = (items: Todo[]) =>
      repeat(
        items,
        (item) => item.uid,
        (item) => this.todoRow(item, true),
      );
    return html`<div class="completed-list">
      <h3 data-todo-motion="completed-heading">
        Recently completed <span>${recent.length}</span>
      </h3>
      <p data-todo-motion="completed-help">
        Tap a check to put it back. After 24 hours, items move to Older
        completed.
      </p>
      ${this.config.completed_retention_days && this.todoEntity === this.config.todo ? html`<p data-todo-motion="retention">HA automatically deletes timestamped completed items after ${this.config.completed_retention_days} days. Restore anything you still need before then.</p>` : nothing}
      ${rows(recent)}
      ${
        older.length
          ? html`<details>
              <summary data-todo-motion="older-heading">
                Older completed · ${older.length}
              </summary>
              ${rows(older)}
            </details>`
          : nothing
      }
      ${sorted.some((item) => !item.completed || !Number.isFinite(Date.parse(item.completed))) ? html`<small>For items without a completion time, the 24 hours starts when this device first sees them completed.</small>` : nothing}
    </div>`;
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
          return html`<signal-control
            .hass=${this.hass}
            .configuration=${{ type: "custom:signal-control", entity: id, appearance: this.dark ? "dark" : "light" }}
          ></signal-control>`;
        })}
      </div>`;
  }
  private graphs() {
    if (!this.config.graphs?.length) return nothing;
    return html`<div class="section-top">
        <h2>The bigger picture</h2>
        <small>Explore your history.</small>
      </div>
      <div class="grid">
        ${this.config.graphs.map((entry, index) => {
          const graph = typeof entry === "string" ? { entity: entry } : entry;
          return html`<signal-graph
            .hass=${this.hass}
            .configuration=${{ ...graph, type: "custom:signal-graph", accent: index % 2 ? "mint" : "lilac", appearance: this.dark ? "dark" : "light" }}
          ></signal-graph>`;
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
        </div>
        ${this.graphs()}`;
    if (this.tab === "safety")
      return html`${this.safety()}
        <div class="notice" style="margin-top:20px">
          ${this.safetySummary.alarm ? "A sensor is reporting an active state. Open it for details." : this.safetySummary.unknown ? "An unavailable sensor cannot confirm the condition of its space." : "Tap any sensor for its history and details."}
        </div>`;
    if (this.tab === "lists")
      return html`<div style="max-width:740px">
        ${this.todoListPicker()}${this.grocery(true)}
      </div>`;
    if (this.narrow) return this.pocketOverview();
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
  private pocketOverview() {
    const climate = this.state(this.config.climate);
    const c = climate?.attributes || {};
    const climateReady = available(climate);
    const weather = this.state(this.config.weather);
    const w = weather?.attributes || {};
    const weatherReady = available(weather);
    const tempUnit = this.hass.config?.unit_system?.temperature || "°";
    const humidity = number(
      this.state(this.config.humidity)?.state ?? c.current_humidity,
    );
    const summary = this.safetySummary;
    const target = !climateReady
      ? this.config.climate
        ? "Controls unavailable"
        : "Choose a climate entity in the editor"
      : climate.state === "off"
        ? "Climate is off"
        : climate.state === "heat_cool"
          ? `Heat ${this.format(c.target_temp_low)}° · Cool ${this.format(c.target_temp_high)}°`
          : `${modeLabels[climate.state] || words(climate.state)} · Target ${this.format(c.temperature)}°`;
    const todo = this.state(this.todoEntity);
    const count = available(todo) ? number(todo.state) : undefined;
    return html`<div class="pocket-overview">
      <button
        class="pocket-tile comfort-tile mint"
        aria-label="Climate details"
        ?disabled=${!this.config.climate}
        @click=${() => this.moreInfo(this.config.climate)}
      >
        <span class="tile-top"
          ><span class="tile-label">${icon("climate")} Inside</span
          ><span class="live-chip"
            >${climateReady ? words(c.hvac_action || climate.state) : "Unavailable"}</span
          ></span
        >
        <span class="comfort-reading"
          ><span class="pocket-temperature"
            >${climateReady ? this.format(c.current_temperature) : "—"}<small
              >${tempUnit}</small
            ></span
          ><span class="comfort-orbit" aria-hidden="true"
            ><i></i><i></i><span>${icon("home")}</span></span
          ></span
        >
        <span class="tile-bottom"
          ><span
            ><strong>${target}</strong
            ><small
              >${humidity !== undefined ? `${this.format(humidity)}% humidity` : "Humidity unavailable"}</small
            ></span
          ><span class="tile-arrow">${icon("arrow")}</span></span
        >
      </button>
      <div class="pocket-pair">
        <button
          class="pocket-tile outside-tile lilac"
          aria-label="Weather details"
          ?disabled=${!this.config.weather}
          @click=${() => this.moreInfo(this.config.weather)}
        >
          <span class="tile-top"
            ><span class="tile-label">Outside</span
            >${icon(weather?.state === "clear-night" ? "moon" : weather?.state === "sunny" ? "sun" : weather?.state?.includes("rain") ? "drop" : weather?.state?.includes("wind") ? "wind" : "cloud")}</span
          >
          <span class="pocket-reading"
            >${weatherReady ? this.format(w.temperature) : "—"}<small
              >${w.temperature_unit || tempUnit}</small
            ></span
          ><span class="tile-bottom"
            ><span class="tile-caption"
              >${weatherReady ? words(weather.state) : this.config.weather ? "Unavailable" : "Choose weather in editor"}</span
            >${icon("arrow")}</span
          >
        </button>
        <button
          class="pocket-tile list-tile apricot"
          aria-label="Open to-do lists"
          @click=${() => this.navigate("lists")}
        >
          <span class="tile-top"
            ><span class="tile-label">${this.todoName}</span
            >${icon("list")}</span
          ><span class="pocket-reading"
            >${count === undefined ? "—" : count}<small
              >${count === 1 ? "item" : "items"}</small
            ></span
          ><span class="tile-bottom"
            ><span class="tile-caption"
              >${this.todoError ? "Tap to retry" : count === undefined ? "Open your list" : count === 0 ? "All caught up" : this.todos[0]?.summary || "Ready when you are"}</span
            >${icon("arrow")}</span
          >
        </button>
      </div>
      <button
        class=${`home-signal ${summary.alarm ? "attention" : summary.unknown ? "uncertain" : ""}`}
        @click=${() => this.navigate("safety")}
        aria-label=${`Home status: ${summary.text}`}
      >
        <span class="signal-symbol"
          >${icon(summary.alarm || summary.unknown ? "warn" : "shield")}</span
        ><span
          ><strong>${summary.text}</strong
          ><small
            >${summary.alarm ? "Take a closer look" : summary.unknown ? "Some spaces cannot be checked" : this.sensors.length ? "Your sensors, together" : "Choose sensors in the editor"}</small
          ></span
        >${icon("arrow")}
      </button>
      ${this.favorites()}
      <div class="section-top">
        <h2>Around the house</h2>
        <small>${this.sensors.length} sensors</small>
      </div>
      ${this.safety()}
    </div>`;
  }
  private appHeader(time: Date) {
    const hour = homeHour(time, this.hass.config?.time_zone);
    const greeting = `Good ${hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening"}.`;
    return html`<header
      class=${`app-header ${this.contentScrolled ? "scrolled" : ""}`}
    >
      <div class="header-context">
        <span class="header-title"
          >${this.config.header_label || greeting}</span
        >
        <span class="header-subtitle"
          >${this.config.title || "Home"} ·
          ${time.toLocaleDateString(this.hass.locale?.language || undefined, { weekday: "short", month: "short", day: "numeric", timeZone: this.hass.config?.time_zone })}</span
        >
      </div>
      <div class="header-right">
        <button
          class="icon-button"
          aria-label="Open Signal menu"
          @click=${() => (this.menuOpen = true)}
        >
          ${icon("settings")}
        </button>
      </div>
    </header>`;
  }
  render() {
    if (!this.hass)
      return html`<div class="notice" role="status">Connecting to home…</div>`;
    const time = new Date();
    const welcome = this.config.greeting || "Home, at a glance.";
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
    const recovery = new URL(location.href);
    recovery.searchParams.set("disable_km", "");
    recovery.hash = "";
    const sensor = this.sensors.find((s) => s.entity === this.detailEntity);
    return html`<div
      class=${`app ${this.dark ? "dark" : ""} ${this.immersive ? "immersive" : ""} ${this.tab === "home" ? "overview-page" : ""}`}
    >
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
      ${this.narrow ? this.appHeader(time) : nothing}
      <main @scroll=${this.onContentScroll}>
        ${!this.narrow ? this.appHeader(time) : nothing}
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
          >
        </footer>
      </main>
      ${this.nav(true)}${this.message ? html`<div class="toast" role="status"><span>${this.message}</span>${this.undoItem ? html`<button ?disabled=${this.busy} @click=${() => this.undoItem && this.complete(this.undoItem, true)}>Undo</button>` : nothing}</div>` : nothing}
      <signal-sheet
        .open=${this.menuOpen}
        heading="Your place. Your way."
        .dark=${this.dark}
        @signal-close=${() => (this.menuOpen = false)}
      >
        <div class="signal-menu">
          <p class="menu-intro">
            Signed in as ${this.hass.user?.name || "you"}. Your home is still
            powered by Home Assistant.
          </p>
          <label class="appearance-setting"
            >Appearance
            <select
              aria-label="Appearance"
              .value=${this.appearance}
              @change=${(event: Event) => this.chooseAppearance((event.target as HTMLSelectElement).value as Appearance)}
            >
              <option value="auto">Auto · day / night</option>
              <option value="system">System · device default</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
            <small
              >Auto: light 7am–7pm, dark overnight
              (${this.hass.config?.time_zone || "device time"}). Saved on this
              device.</small
            >
          </label>
          <a href="/profile"
            >${icon("home")}<span
              >Account & sign out<small>Your profile and session</small></span
            >${icon("arrow")}</a
          >
          ${
            this.hass.user?.is_admin
              ? html`<a href="/config/dashboard"
                  >${icon("settings")}<span
                    >Home Assistant settings<small
                      >Devices, integrations, and administration</small
                    ></span
                  >${icon("arrow")}</a
                >`
              : nothing
          }
          <a
            href=${recovery.pathname + recovery.search}
            @click=${(event: MouseEvent) => {
              event.preventDefault();
              event.stopPropagation();
              // Kiosk Mode reads its recovery flag at page load. HA otherwise
              // intercepts same-dashboard anchors as client-side navigation.
              window.location.assign(recovery.pathname + recovery.search);
            }}
            >${icon("arrow")}<span
              >Open standard Home Assistant<small
                >Restore the header, sidebar, and dashboard editor</small
              ></span
            ></a
          >
          <p class="menu-footnote">
            Need a recovery route? Add <code>?disable_km</code> to this
            dashboard’s address. Your login and permissions stay with Home
            Assistant.
          </p>
        </div>
      </signal-sheet>
      <signal-sheet
        id="delete-sheet"
        .compact=${true}
        .open=${!!this.deleteTarget}
        heading="Delete permanently?"
        .dark=${this.dark}
        @signal-close=${() => {
          const deleted =
            this.deleteTarget &&
            ![...this.todos, ...this.completedTodos].some(
              (item) => item.uid === this.deleteTarget!.item.uid,
            );
          this.deleteTarget = undefined;
          this.deleteError = "";
          if (deleted && this.tab === "lists")
            this.renderRoot
              .querySelector<HTMLButtonElement>('[aria-label="Refresh list"]')
              ?.focus({ preventScroll: true });
        }}
      >
        <div class="delete-confirmation">
          <div class="delete-symbol" aria-hidden="true">${icon("trash")}</div>
          <p class="delete-item">${this.deleteTarget?.item.summary}</p>
          <p class="delete-list-name">
            ${this.deleteTarget ? this.listName(this.deleteTarget.entity) : ""}
          </p>
          <p>
            This removes the item from the shared list for everyone. It can’t be
            undone.
          </p>
          ${this.deleteError ? html`<p class="delete-error" role="alert">${this.deleteError}</p>` : nothing}
          <div class="delete-actions">
            <button ?disabled=${this.busy} @click=${this.closeDelete}>
              Keep item
            </button>
            <button
              class="delete-accept"
              ?disabled=${this.busy}
              @click=${this.deleteTodo}
            >
              ${this.busy ? "Deleting…" : "Delete permanently"}
            </button>
          </div>
        </div>
      </signal-sheet>
      <signal-details
        .hass=${this.hass}
        .entity=${this.detailEntity}
        .dark=${this.dark}
        .name=${this.detailEntity === this.config.climate ? "Climate" : this.detailEntity === this.config.weather ? "Weather" : sensor?.name || ""}
        .battery=${sensor?.battery || ""}
        .custom=${!!this.detailEntity && [this.config.climate, this.config.weather].includes(this.detailEntity)}
        @signal-close=${() => (this.detailEntity = "")}
      >
        ${
          this.detailEntity === this.config.climate
            ? html`<div class="sheet-custom">
                ${this.climate(true)}${this.message ? html`<p role="status">${this.message}</p>` : nothing}${this.graphs()}
              </div>`
            : this.detailEntity === this.config.weather
              ? html`<div class="sheet-custom">
                  ${this.weather(true)}
                  <p class="intro">
                    Current conditions from your weather provider.
                  </p>
                </div>`
              : nothing
        }
      </signal-details>
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
registry.customCards.push(
  {
    type: "signal-control",
    name: "Signal Control",
    description:
      "Tactile switches, dimmers, media, covers, fans, scenes, locks, and numeric/select controls.",
    preview: true,
    documentationURL: "https://github.com/gkgkgkgk/signal-home",
  },
  {
    type: "signal-graph",
    name: "Signal Graph",
    description:
      "Interactive recorded history with a cursor, time ranges, and honest data gaps.",
    preview: true,
    documentationURL: "https://github.com/gkgkgkgk/signal-home",
  },
  {
    type: "signal-metric",
    name: "Signal Metric",
    description: "A bold sensor readout with an optional range meter.",
    preview: true,
    documentationURL: "https://github.com/gkgkgkgk/signal-home",
  },
);
