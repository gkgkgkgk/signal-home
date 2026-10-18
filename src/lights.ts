import { LitElement, html, css, nothing } from "lit";
import { available, type Hass, type LightRoom } from "./types";
import { icon } from "./icons";
import "./control";
import { scheduledNote } from "./automation-note";

export class SignalLights extends LitElement {
  static properties = {
    hass: { attribute: false },
    rooms: { attribute: false },
    dark: { type: Boolean },
    selected: { state: true },
    pending: { state: true },
    error: { state: true },
  };
  declare hass: Hass;
  rooms: LightRoom[] = [];
  dark = false;
  private selected = "";
  private pending = false;
  private error = "";
  static styles = css`
    :host {
      display: block;
      color: var(--ink);
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
    .rooms,
    .individual {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
      gap: 18px;
    }
    .room {
      position: relative;
      border: 1px solid var(--line);
      background: var(--surface);
      padding: 0;
      border-radius: 28px;
      transition:
        background 0.3s,
        box-shadow 0.3s;
    }
    .room.on {
      background: color-mix(in srgb, var(--surface) 80%, #ffc56b);
      box-shadow: inset 0 0 45px #ffc56b18;
    }
    .room-open {
      display: block;
      width: 100%;
      text-align: left;
      padding: 24px;
      background: transparent;
      border: 0;
      border-radius: 28px;
      min-height: 180px;
    }
    .room-open h2 {
      padding-right: 72px;
    }
    .room-open .hint {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--muted);
      margin-top: 18px;
    }
    .room > .switch {
      position: absolute;
      right: 24px;
      top: 34px;
    }
    .room-detail {
      padding: 24px;
    }
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }
    .bulb {
      display: grid;
      place-items: center;
      width: 68px;
      height: 68px;
      border-radius: 24px;
      background: var(--line);
      color: var(--muted);
      transition:
        background 0.3s,
        box-shadow 0.3s;
    }
    .on .bulb {
      background: #ffdc94;
      color: #604007;
      box-shadow: 0 0 30px #ffc15e65;
    }
    .bulb svg {
      width: 36px;
      height: 36px;
    }
    h2 {
      font-size: 24px;
      margin: 20px 0 6px;
    }
    p {
      color: var(--muted);
      line-height: 1.5;
    }
    .switch {
      width: 76px;
      height: 44px;
      border: 0;
      background: var(--line);
      border-radius: 30px;
      padding: 5px;
    }
    .switch span {
      display: block;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--surface);
      box-shadow: 0 2px 5px #0002;
      transition: transform 0.25s;
    }
    .switch[aria-checked="true"] {
      background: #d6a240;
    }
    .switch[aria-checked="true"] span {
      transform: translateX(32px);
    }
    .details,
    .back,
    .scene {
      min-height: 44px;
      border: 1px solid var(--line);
      border-radius: 15px;
      padding: 12px 16px;
      background: var(--surface);
      display: inline-flex;
      gap: 10px;
      align-items: center;
    }
    .details {
      width: 100%;
      justify-content: space-between;
      margin-top: 12px;
    }
    .back {
      margin-bottom: 18px;
    }
    .scenes {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 16px 0 24px;
    }
    .note {
      font-size: 14px;
    }
    .error {
      color: var(--danger, #b33b36);
    }
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        transition: none !important;
      }
    }
  `;
  private async run(entity: string) {
    if (this.pending) return;
    this.pending = true;
    this.error = "";
    try {
      await this.hass.callService(entity.split(".")[0], "turn_on", {
        entity_id: entity,
      });
    } catch {
      this.error = "That didn’t go through. Try again.";
    } finally {
      this.pending = false;
    }
  }
  private note(room: LightRoom) {
    const note = scheduledNote(
      this.hass.states[room.automation_note_entity || ""],
    );
    return note ? html`<p class="note">${note}</p>` : nothing;
  }
  private roomCard(room: LightRoom, detail = false) {
    const states = room.entities.map((id) => this.hass.states[id]);
    const on = states.filter((e) => e?.state === "on").length;
    const unknown = states.filter((e) => !available(e)).length;
    const status =
      unknown === states.length
        ? "Unavailable"
        : on
          ? `${on} of ${states.length} on`
          : unknown
            ? "Available lights off"
            : "All off";
    const script = on ? room.off_script : room.on_script;
    const toggle = html`<button
      class="switch"
      role="switch"
      aria-label=${`${room.name} lights`}
      aria-checked=${on > 0}
      ?disabled=${this.pending || unknown === states.length || !available(this.hass.states[script]) || this.hass.connection?.connected === false}
      @click=${() => this.run(script)}
    >
      <span></span>
    </button>`;
    const bulb = html`<div class="bulb" aria-hidden="true">
      ${icon("bulb")}
    </div>`;
    const copy = html`<h2>${room.name}</h2>
      <p role="status">
        ${status}${unknown && unknown !== states.length ? ` · ${unknown} unavailable` : ""}${this.pending ? " · Sending…" : ""}
      </p>
      ${this.note(room)}`;
    return detail
      ? html`<article
          class=${`room room-detail ${on ? "on" : ""}`}
          aria-busy=${this.pending}
        >
          <div class="top">${bulb}${toggle}</div>
          ${copy}
        </article>`
      : html`<article
          class=${`room ${on ? "on" : ""}`}
          aria-busy=${this.pending}
        >
          <button
            class="room-open"
            aria-label=${`Open ${room.name}`}
            @click=${() => {
              this.selected = room.id;
              this.error = "";
            }}
          >
            ${bulb}${copy}<span class="hint"
              >Lights${room.scenes?.length ? " & scenes" : ""}
              ${icon("arrow")}</span
            ></button
          >${toggle}
        </article>`;
  }
  render() {
    if (!this.hass) return nothing;
    const room = this.rooms.find((r) => r.id === this.selected);
    return html`${
      room
        ? html`<button
              class="back"
              @click=${() => {
                this.selected = "";
                this.error = "";
              }}
            >
              ← All lighting</button
            >${this.roomCard(room, true)}
            ${
              room.scenes?.length
                ? html`<h2>Scenes</h2>
                    <div class="scenes">
                      ${room.scenes.map((scene) => html`<button class="scene" ?disabled=${this.pending || !this.hass.states[scene.entity] || this.hass.states[scene.entity].state === "unavailable"} @click=${() => this.run(scene.entity)}>${icon("play")} ${scene.name}</button>`)}
                    </div>`
                : nothing
            }
            <h2>Individual lights</h2>
            <div class="individual">
              ${room.entities.map((id) => html`<signal-control .hass=${this.hass} .configuration=${{ type: "custom:signal-control", entity: id, name: this.hass.states[id]?.attributes.friendly_name?.replace(/ \(Smart Outlet\)$/, ""), appearance: this.dark ? "dark" : "light", accent: "apricot", lamp: true }}></signal-control>`)}
            </div>`
        : html`<div class="rooms">
              ${this.rooms.map((r) => this.roomCard(r))}
            </div>
            ${!this.rooms.length ? html`<p>No rooms configured yet.</p>` : nothing}`
    }
    ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}`;
  }
}
customElements.define("signal-lights", SignalLights);
