import { LitElement, css, html, type PropertyValues } from "lit";
import type { Hass } from "./types";
import { icon } from "./icons";
import "./camera-event";
import "./camera-grid";

type CameraCard = HTMLElement & { hass: Hass; setConfig(config: object): void };
// The doorbell speaker feeds its own microphone, so talking is half-duplex: inbound audio
// stays muted while the button is held and until the echo of the last words has returned.
const ECHO_TAIL_MS = 2000;
// Alarm states in which alarm-only cameras run (matches the HA automation that wakes them).
const WATCH_STATES = ["armed_night", "armed_away", "armed_home", "armed_vacation", "armed_custom_bypass", "pending", "triggered"];

export class SignalCameras extends LitElement {
  static properties = {
    hass: { attribute: false }, cameras: { attribute: false }, alarmCameras: { attribute: false }, alarmEntity: { attribute: false },
    eventId: { state: true }, eventCamera: { state: true }, eventInstance: { state: true }, eventKind: { state: true },
    selected: { state: true }, error: { state: true }, ready: { state: true },
    voiceActive: { state: true }, talking: { state: true },
  };
  declare hass: Hass;
  cameras: string[] = [];
  alarmCameras: string[] = [];
  alarmEntity = "";
  private eventId = "";
  private eventCamera = "";
  private eventInstance = "frigate";
  private eventKind = "event";
  private selected = "";
  private error = "";
  private ready = false;
  private voiceActive = false;
  private talking = false;
  private liveCard?: CameraCard;
  private liveSignature = "";
  private connection?: object;
  private user?: string;
  private generation = 0;
  private timer?: ReturnType<typeof setTimeout>;
  private echoTimer?: ReturnType<typeof setTimeout>;

  static styles = css`
    :host { display:block; min-width:0; color:var(--ink); }
    * { box-sizing:border-box; }
    .event-layout { max-width:900px; margin:0 auto; }
    .event-toolbar { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; }
    .event-toolbar button { border:1px solid var(--line); background:var(--surface); color:var(--ink); }
    .recorded-mode { color:var(--ink); font-size:14px; font-weight:700; }
    .event-toolbar .live-action { background:var(--mint); color:#172d27; border-color:transparent; }
    .layout { display:grid; grid-template-columns:minmax(0,1.15fr) minmax(0,1fr); gap:24px; align-items:start; }
    .camera-panel,.history-panel { min-width:0; border:1px solid var(--line); border-radius:28px; background:var(--surface); overflow:hidden; }
    .camera-heading { padding:22px 24px 18px; display:flex; align-items:center; justify-content:space-between; gap:16px; }
    .identity { display:flex; align-items:center; gap:12px; min-width:0; }
    .camera-icon { display:grid; place-items:center; flex-shrink:0; width:46px; height:46px; border-radius:16px; background:var(--mint); color:#172d27; }
    svg { width:22px; height:22px; }
    h2,p { margin:0; }
    h2 { font-size:20px; letter-spacing:-.6px; line-height:1.3; }
    .eyebrow { display:block; font-size:10px; font-weight:700; letter-spacing:1.6px; text-transform:uppercase; color:var(--muted); margin-bottom:5px; }
    .live-label { display:flex; align-items:center; gap:6px; font-size:11px; font-weight:700; white-space:nowrap; }
    .dot { width:6px; height:6px; border-radius:50%; background:#43886a; }
    .offline .dot { background:var(--muted); }
    .viewer { min-width:0; --ha-card-border-radius:0px; --ha-card-border-width:0px; --ha-card-background:var(--surface); --primary-text-color:var(--ink); --secondary-text-color:var(--muted); --card-background-color:var(--surface); }
    .live-viewer { background:#17231d; }
    .voice-controls { display:grid; grid-template-columns:1fr 1.25fr; gap:10px; padding:14px 18px; border-top:1px solid var(--line); background:var(--surface); }
    .voice-controls button { display:flex; align-items:center; justify-content:center; gap:9px; min-height:52px; padding:12px 14px; border:1px solid var(--line); border-radius:15px; background:var(--surface); color:var(--ink); font-weight:700; touch-action:none; user-select:none; -webkit-touch-callout:none; }
    .voice-controls button svg { width:19px; height:19px; }
    .voice-controls .session.active { background:#fee6e2; border-color:#e8b7ae; color:#802f28; }
    .voice-controls .push { background:var(--mint); border-color:transparent; color:#172d27; }
    .voice-controls .push.talking { background:#246b52; color:white; transform:scale(.985); }
    .voice-controls button:disabled { opacity:.48; cursor:not-allowed; }
    .voice-status { grid-column:1/-1; min-height:18px; margin:0; text-align:center; color:var(--muted); font-size:12px; }
    .talk-help { padding:12px 24px 16px; color:var(--muted); font-size:12px; line-height:1.5; border-top:1px solid var(--line); }
    signal-camera-grid { display:block; padding:22px; }
    nav { display:flex; gap:4px; padding:4px; margin:18px 0 0; border-radius:14px; background:color-mix(in srgb,var(--line) 38%,transparent); }
    button { font:inherit; font-size:13px; color:var(--muted); background:transparent; border:0; border-radius:11px; padding:11px 12px; min-height:44px; cursor:pointer; }
    nav button { flex:1; }
    button[aria-pressed="true"] { background:var(--surface); color:var(--ink); box-shadow:0 2px 6px #00000008; }
    button:focus-visible,select:focus-visible { outline:2px solid var(--ink); outline-offset:3px; }
    .selector { margin-bottom:20px; display:flex; align-items:center; gap:12px; color:var(--muted); font-size:13px; }
    select { font:inherit; font-size:16px; border:1px solid var(--line); border-radius:12px; padding:10px 14px; background:var(--surface); color:var(--ink); max-width:100%; }
    .notice { padding:24px; background:var(--surface); border:1px solid var(--line); border-radius:20px; line-height:1.6; }
    .notice p { margin-bottom:10px; }
    .resting { display:grid; place-items:center; align-content:center; gap:10px; aspect-ratio:16/9; padding:24px; text-align:center; background:color-mix(in srgb,var(--line) 30%,var(--surface)); color:var(--ink); }
    .resting svg { width:30px; height:30px; color:var(--muted); }
    .resting h3 { margin:0; font-size:17px; letter-spacing:-.3px; }
    .resting p { max-width:34ch; color:var(--muted); font-size:13px; line-height:1.5; }
    @media(max-width:1000px) { .layout { grid-template-columns:1fr; gap:22px; } }
    @media(max-width:480px) { .camera-heading { padding:18px; } signal-camera-grid { padding:16px; } .camera-panel,.history-panel { border-radius:22px; } .talk-help { padding:12px 18px 16px; } h2 { font-size:18px; } .camera-icon { width:40px; height:40px; border-radius:13px; } }
  `;
  connectedCallback() {
    super.connectedCallback(); this.syncEventRoute(); this.loadViewer();
    for (const event of ["popstate", "hashchange", "location-changed"]) window.addEventListener(event, this.syncEventRoute);
  }
  disconnectedCallback() { super.disconnectedCallback(); this.generation++; clearTimeout(this.timer); this.releaseViewers(); for (const event of ["popstate", "hashchange", "location-changed"]) window.removeEventListener(event, this.syncEventRoute); }
  private cardAction(action:string) {
    this.liveCard?.dispatchEvent(new CustomEvent("ll-custom",{detail:{action:"fire-dom-event",advanced_camera_card_action:action},bubbles:true,composed:true}));
  }
  private stopVoice() {
    clearTimeout(this.echoTimer);
    if(this.talking) this.cardAction("microphone_mute");
    if(this.voiceActive) this.cardAction("call_end");
    this.talking=false;this.voiceActive=false;
  }
  private releaseViewers() { this.stopVoice();this.liveCard=undefined; this.liveSignature=""; }
  private toggleVoice=()=>{
    if(this.voiceActive){this.stopVoice();return;}
    this.cardAction("call_start");this.voiceActive=true;
  };
  private startTalking=(event:PointerEvent)=>{
    if(!this.voiceActive || this.talking) return;
    event.preventDefault();
    try{(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);}catch{}
    clearTimeout(this.echoTimer);
    this.cardAction("mute");this.cardAction("microphone_unmute");this.talking=true;
  };
  private stopTalking=(event:PointerEvent)=>{
    if(!this.talking) return;
    event.preventDefault();this.cardAction("microphone_mute");this.talking=false;
    this.echoTimer=setTimeout(()=>{if(this.voiceActive && !this.talking) this.cardAction("unmute");},ECHO_TAIL_MS);
  };
  private syncEventRoute = () => {
    const params = new URLSearchParams(location.search);
    const id = params.get("signal_review") || params.get("signal_event") || "";
    const kind = params.has("signal_review") ? "review" : "event";
    const camera = params.get("signal_camera") || "front_door";
    const instance = params.get("signal_instance") || "frigate";
    if (kind !== this.eventKind || id !== this.eventId || camera !== this.eventCamera || instance !== this.eventInstance) {
      this.releaseViewers(); this.eventId = id; this.eventCamera = camera; this.eventInstance = instance;
      this.eventKind = kind;
      if (id && this.cameras.includes(`camera.${camera}`)) this.selected = `camera.${camera}`;
    }
  };
  private openEvent = (event: CustomEvent<{id:string;camera:string}>) => {
    const url=new URL(location.href);
    url.searchParams.delete("signal_event");url.searchParams.set("signal_review",event.detail.id);url.searchParams.set("signal_camera",event.detail.camera);url.searchParams.set("signal_instance","frigate");
    history.pushState(history.state,"",url);this.syncEventRoute();
    this.dispatchEvent(new CustomEvent("signal-camera-navigation",{bubbles:true,composed:true}));
  };
  private leaveEvent = () => {
    const url = new URL(location.href);
    for (const key of ["signal_review", "signal_event", "signal_camera", "signal_instance"]) url.searchParams.delete(key);
    history.pushState(history.state, "", url);
    this.syncEventRoute();
    this.dispatchEvent(new CustomEvent("signal-camera-navigation", { bubbles:true, composed:true }));
  };
  private loadViewer = () => {
    const generation=++this.generation; clearTimeout(this.timer); this.error="";
    this.ready=!!customElements.get("advanced-camera-card");
    if(this.ready) return;
    this.timer=setTimeout(()=>{ if(generation===this.generation) this.error="The camera viewer couldn’t load. Try again or refresh Signal."; },10000);
    void customElements.whenDefined("advanced-camera-card").then(()=>{
      if(!this.isConnected || generation!==this.generation) return;
      clearTimeout(this.timer);this.error="";this.ready=true;
    });
  };
  private createViewer(): CameraCard {
    const card=document.createElement("advanced-camera-card") as CameraCard;
    card.hass=this.hass;
    const talk=this.selected==="camera.front_door" && window.isSecureContext;
    const buttons=Object.fromEntries(["iris","live","clips","reviews","recordings","timeline","mute","fullscreen","call","microphone","camera_ui","cameras","display_mode","download","folders","gallery","info","media_player","set_review","substreams"].map(name=>[name,{enabled:name==="mute"||name==="fullscreen"}]));
    const cameras: Record<string, unknown>[]=[{camera_entity:this.selected,live_provider:"go2rtc",engine:"frigate",go2rtc:{modes:["webrtc","mse"],...(this.selected==="camera.front_door"?{stream:"front_door"}:{})},...(talk?{capabilities:{force:["2-way-audio"]}}:{})}];
    card.setConfig({
      type:"custom:advanced-camera-card",
      cameras,
      view:{default:"live",theme:{overrides:{
        "--advanced-camera-card-menu-override-background":"var(--surface)",
        "--advanced-camera-card-menu-override-button-inactive-color":"var(--muted)",
        "--advanced-camera-card-menu-override-button-background":"transparent",
        "--advanced-camera-card-background":"var(--surface)",
        "--advanced-camera-card-text-color":"var(--ink)",
        "--advanced-camera-card-timeline-tool-color":"var(--ink)",
        "--advanced-camera-card-divider-color":"var(--line)",
      }}},
      live:{auto_play:["selected","visible"],auto_pause:["unselected","hidden"],auto_mute:["unselected","hidden",...(talk?["call"]:[])],auto_unmute:talk?["call"]:[],microphone:talk?{auto_unmute:[]}:undefined,draggable:false,controls:{builtin:true,call:{enabled:false,lock:false},wheel:false,next_previous:{style:"none"},timeline:{mode:"none"},thumbnails:{mode:"none"}}},
      menu:{style:"outside",position:"bottom",auto_hide:[],buttons},
    });
    return card;
  }
  /** An alarm-only camera is off (turned away, privacy mode, not recording) unless the alarm is armed. */
  private resting(entity:string){
    return this.alarmCameras.includes(entity) && !WATCH_STATES.includes(this.hass?.states[this.alarmEntity]?.state||"");
  }
  protected willUpdate(_changes: PropertyValues) {
    if(!this.cameras.includes(this.selected)) this.selected=this.cameras[0]||"";
    if(this.connection!==this.hass?.connection || this.user!==this.hass?.user?.id){
      this.releaseViewers();this.connection=this.hass?.connection;this.user=this.hass?.user?.id;
    }
    if(this.eventId || this.resting(this.selected)) { this.releaseViewers(); return; }
    if(!this.ready || !this.selected || !this.hass) return;
    try {
      if(this.liveSignature!==this.selected || !this.liveCard){this.liveCard=this.createViewer();this.liveSignature=this.selected;}
      if(this.liveCard) this.liveCard.hass=this.hass;this.error="";
    }catch{this.releaseViewers();this.error="The camera viewer couldn’t open. Try again.";}
  }
  private retry=()=>{this.releaseViewers();this.loadViewer();this.requestUpdate();};
  private name(entity:string){return this.hass?.states[entity]?.attributes.friendly_name||entity.replace(/^camera\./,"").replaceAll("_"," ");}
  render(){
    if(!this.cameras.length) return html`<div class="notice"><p>No cameras added yet.</p>Select your Frigate cameras in Signal’s editor to see them here.</div>`;
    if(this.eventId) return html`<div class="event-layout"><nav class="event-toolbar" aria-label="Event navigation"><span class="recorded-mode">Recorded event</span><button class="live-action" aria-label="Back to live & events" @click=${this.leaveEvent}>← Back to live & events</button></nav>${this.cameras.includes(`camera.${this.eventCamera}`) ? html`<signal-camera-event .hass=${this.hass} .eventId=${this.eventId} .kind=${this.eventKind} .camera=${this.eventCamera} .instance=${this.eventInstance}></signal-camera-event>` : html`<div class="notice" role="alert">This camera isn’t available on this dashboard.</div>`}</div>`;
    if(this.error) return html`<div class="notice" role="alert"><p>${this.error}</p><button @click=${this.retry}>Retry camera viewer</button></div>`;
    const state=this.hass?.states[this.selected]?.state;
    const resting=this.resting(this.selected);
    const unavailable=!resting&&(!state||["unavailable","unknown"].includes(state));
    return html`
      ${this.cameras.length>1?html`<label class="selector">Camera<select aria-label="Camera" .value=${this.selected} @change=${(e:Event)=>{this.selected=(e.target as HTMLSelectElement).value;}}>${this.cameras.map(entity=>html`<option value=${entity}>${this.name(entity)}</option>`)}</select></label>`:""}
      <div class="layout">
        <section class="camera-panel" aria-label="Live camera">
          <div class="camera-heading"><div class="identity"><span class="camera-icon">${icon("camera")}</span><div><h2>${this.name(this.selected)}</h2></div></div><span class="live-label ${unavailable||resting?"offline":""}"><span class="dot"></span>${resting?"Off":unavailable?"Unavailable":"LIVE · Now"}</span></div>
          ${resting?html`<div class="resting" role="status">${icon("shield")}<h3>Off while you’re home</h3><p>This camera only turns on and records while the alarm is set to Sleeping or Away.</p></div>`:html`<div class="viewer live-viewer">${this.liveCard||html`<div class="notice" role="status">Connecting to camera…</div>`}</div>`}
          ${this.selected==="camera.front_door"?window.isSecureContext?html`
            <div class="voice-controls" role="group" aria-label="Doorbell voice controls">
              <button class="session ${this.voiceActive?"active":""}" aria-pressed=${this.voiceActive} @click=${this.toggleVoice}>${icon("phone")} ${this.voiceActive?"End voice":"Start voice"}</button>
              <button class="push ${this.talking?"talking":""}" ?disabled=${!this.voiceActive} @pointerdown=${this.startTalking} @pointerup=${this.stopTalking} @pointercancel=${this.stopTalking} @lostpointercapture=${this.stopTalking}>${icon("microphone")} ${this.talking?"Speaking…":"Hold to talk"}</button>
              <p class="voice-status" role="status">${this.voiceActive?this.talking?"Your microphone is live":"Voice connected · hold to speak":"Start voice, then hold to talk"}</p>
            </div>`:html`<p class="talk-help" role="note">Doorbell talk needs a secure HTTPS connection. Open Signal through your Home Assistant Cloud address to use the microphone.</p>`:""}
        </section>
        <section class="history-panel" aria-label="Camera history">
          <signal-camera-grid .hass=${this.hass} .camera=${this.selected.replace(/^camera\./,"")} @signal-open-event=${this.openEvent}></signal-camera-grid>
        </section>
      </div>`;
  }
}
if(!customElements.get("signal-cameras"))customElements.define("signal-cameras",SignalCameras);
