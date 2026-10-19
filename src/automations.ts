import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { available, type Hass } from "./types";
import { icon } from "./icons";

interface RegistryEntry {
  entity_id: string;
  platform: string;
  labels?: string[];
  categories?: Record<string, string>;
  disabled_by?: string | null;
}
interface Category {
  category_id: string;
  name: string;
}
export interface AutomationGroup {
  id: string;
  name: string;
  entities: string[];
}

/**
 * Automations carrying `label`, paired by their Home Assistant automation
 * category: one group per category, and one per uncategorized automation. A
 * category with a single shared automation shows as that automation alone.
 */
export function automationGroups(
  entries: RegistryEntry[],
  categories: Category[],
  label: string,
  name: (entity: string) => string,
): AutomationGroup[] {
  const categoryNames = new Map(categories.map((c) => [c.category_id, c.name]));
  const paired = new Map<string, string[]>();
  const groups: AutomationGroup[] = [];
  for (const entry of entries) {
    if (entry.platform !== "automation" || entry.disabled_by || !entry.labels?.includes(label)) continue;
    const category = entry.categories?.automation;
    if (category && categoryNames.has(category))
      paired.set(category, [...(paired.get(category) || []), entry.entity_id]);
    else groups.push({ id: entry.entity_id, name: name(entry.entity_id), entities: [entry.entity_id] });
  }
  for (const [category, entities] of paired)
    groups.push(
      entities.length > 1
        ? { id: `category:${category}`, name: categoryNames.get(category)!, entities: entities.sort((a, b) => name(a).localeCompare(name(b))) }
        : { id: entities[0], name: name(entities[0]), entities },
    );
  return groups.sort((a, b) => a.name.localeCompare(b.name));
}

export class SignalAutomations extends LitElement {
  static properties = {
    hass: { attribute: false },
    label: {},
    groups: { state: true },
    loading: { state: true },
    loadError: { state: true },
    pending: { state: true },
    error: { state: true },
  };
  declare hass: Hass;
  label = "show_in_signal";
  private groups: AutomationGroup[] = [];
  private loading = false;
  private loaded = false;
  private loadError = "";
  private pending = "";
  private error = "";
  static styles = css`
    :host {
      display: block;
      color: var(--ink);
      max-width: 740px;
    }
    * {
      box-sizing: border-box;
    }
    svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    button {
      font: inherit;
      color: inherit;
      cursor: pointer;
    }
    button:disabled {
      cursor: default;
      opacity: 0.5;
    }
    button:focus-visible {
      outline: 3px solid var(--ink);
      outline-offset: 4px;
    }
    .list {
      border: 1px solid var(--line);
      border-radius: 28px;
      background: var(--surface);
      padding: 6px 24px;
    }
    .automation {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 18px 0;
    }
    .automation + .automation {
      border-top: 1px solid var(--line);
    }
    .mark {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 16px;
      background: var(--line);
      color: var(--muted);
      transition: background 0.3s, color 0.3s;
    }
    .on .mark {
      background: var(--mint);
      /* Mint stays light in both themes, so the mark keeps dark ink. */
      color: #24402f;
    }
    .copy {
      flex: 1;
      min-width: 0;
    }
    h2 {
      font-size: 17px;
      margin: 0 0 4px;
      overflow-wrap: anywhere;
    }
    p {
      margin: 0;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.45;
    }
    .switch {
      flex: none;
      width: 64px;
      height: 38px;
      border: 0;
      background: var(--line);
      border-radius: 30px;
      padding: 4px;
    }
    .switch span {
      display: block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: var(--surface);
      box-shadow: 0 2px 5px #0002;
      transition: transform 0.25s;
    }
    .switch[aria-checked="true"] {
      background: var(--accent);
    }
    .switch[aria-checked="true"] span {
      transform: translateX(26px);
    }
    .switch[aria-checked="mixed"] span {
      transform: translateX(13px);
    }
    .note {
      margin-top: 16px;
    }
    .retry {
      min-height: 44px;
      margin-top: 12px;
      border: 1px solid var(--line);
      border-radius: 15px;
      padding: 10px 16px;
      background: var(--surface);
    }
    .error {
      color: var(--danger, #b33b36);
      margin-top: 16px;
    }
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        transition: none !important;
      }
    }
  `;
  protected updated(changed: PropertyValues) {
    if ((changed.has("hass") || changed.has("label")) && this.hass && !this.loaded && !this.loading) void this.load();
  }
  private name(entity: string) {
    return this.hass.states[entity]?.attributes.friendly_name || entity.replace(/^automation\./, "").replaceAll("_", " ");
  }
  private async load() {
    this.loading = true;
    this.loadError = "";
    try {
      const [entries, categories] = await Promise.all([
        this.hass.callWS<RegistryEntry[]>({ type: "config/entity_registry/list" }),
        this.hass.callWS<Category[]>({ type: "config/category_registry/list", scope: "automation" }),
      ]);
      this.groups = automationGroups(entries, categories, this.label, (entity) => this.name(entity));
      this.loaded = true;
    } catch {
      this.loadError = "Couldn’t load automations from Home Assistant.";
    } finally {
      this.loading = false;
    }
  }
  private async toggle(group: AutomationGroup, turnOn: boolean) {
    if (this.pending) return;
    this.pending = group.id;
    this.error = "";
    try {
      await this.hass.callService("automation", turnOn ? "turn_on" : "turn_off", { entity_id: group.entities });
    } catch {
      this.error = `${group.name} didn’t switch ${turnOn ? "on" : "off"}. Try again.`;
    } finally {
      this.pending = "";
    }
  }
  private row(group: AutomationGroup) {
    const states = group.entities.map((id) => this.hass.states[id]);
    const ready = states.filter(available);
    const on = ready.filter((e) => e.state === "on").length;
    const all = on > 0 && on === states.length;
    const status = !ready.length
      ? "Unavailable"
      : all ? "On" : on ? `${on} of ${states.length} on` : ready.length < states.length ? "Off · some unavailable" : "Off";
    const members = group.entities.length > 1 ? group.entities.map((id) => this.name(id)).join(" · ") : "";
    return html`<div class=${`automation ${on ? "on" : ""}`} aria-busy=${this.pending === group.id}>
      <span class="mark" aria-hidden="true">${icon("clock")}</span>
      <div class="copy">
        <h2>${group.name}</h2>
        ${members ? html`<p>${members}</p>` : nothing}
        <p role="status">${status}${this.pending === group.id ? " · Sending…" : ""}</p>
      </div>
      <button
        class="switch"
        role="switch"
        aria-label=${group.name}
        aria-checked=${all ? "true" : on ? "mixed" : "false"}
        ?disabled=${!!this.pending || !ready.length || this.hass.connection?.connected === false}
        @click=${() => this.toggle(group, !all)}
      ><span></span></button>
    </div>`;
  }
  render() {
    if (!this.hass) return nothing;
    if (this.loadError)
      return html`<p class="error" role="alert">${this.loadError}</p>
        <button class="retry" ?disabled=${this.loading} @click=${() => this.load()}>Try again</button>`;
    if (!this.loaded) return html`<p role="status">Loading automations…</p>`;
    if (!this.groups.length)
      return html`<p>No automations are shared with Signal yet. In Home Assistant, add the label “${this.label === "show_in_signal" ? "Show in Signal" : this.label}” to an automation to show it here.</p>`;
    return html`<div class="list">${this.groups.map((group) => this.row(group))}</div>
      <p class="note">Automations in the same Home Assistant category switch on and off together.</p>
      ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}`;
  }
}
customElements.define("signal-automations", SignalAutomations);
