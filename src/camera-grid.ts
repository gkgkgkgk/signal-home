import { LitElement, css, html } from "lit";
import { repeat } from "lit/directives/repeat.js";
import type { Hass } from "./types";

type EventTile = { id: string; camera: string; label?: string; start_time: number; end_time: number|null; data?: {objects?:string[]}; image?: string };

export class SignalCameraGrid extends LitElement {
  static properties = { hass: { attribute:false }, camera: {}, events:{state:true}, loading:{state:true}, error:{state:true}, more:{state:true} };
  declare hass: Hass;
  camera = "";
  private events: EventTile[] = [];
  private loading = false;
  private error = "";
  private more = false;
  private limit = 24;
  private signature = "";
  private connection?: object;
  private user?: string;
  private generation = 0;
  private timer?: ReturnType<typeof setTimeout>;
  static styles = css`
    :host { display:block; min-width:0; }
    * { box-sizing:border-box; }
    .heading { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:18px; }
    h3 { margin:0; font-size:20px; font-weight:600; letter-spacing:-.5px; color:var(--ink); }
    button { font:inherit; color:var(--ink); cursor:pointer; border:0; background:transparent; min-height:44px; }
    button:focus-visible { outline:2px solid var(--ink); outline-offset:4px; }
    button:disabled { opacity:.5; cursor:default; }
    .refresh,.more { padding:10px 14px; border:1px solid var(--line); border-radius:12px; font-size:12px; }
    .grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px 12px; }
    .tile { display:block; min-width:0; width:100%; padding:0; text-align:left; border-radius:14px; }
    .picture { display:block; aspect-ratio:4/3; position:relative; overflow:hidden; border-radius:14px; background:color-mix(in srgb,var(--line) 50%,var(--surface)); }
    img { display:block; width:100%; height:100%; object-fit:cover; transition:transform .2s; }
    @media(hover:hover) { .tile:hover img { transform:scale(1.035); } }
    .placeholder { position:absolute; inset:0; display:grid; place-items:center; font-size:12px; color:var(--muted); }
    .caption { display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap; gap:3px 8px; padding:9px 2px 0; }
    time { font-size:14px; font-weight:600; color:var(--ink); }
    .date { font-size:11px; color:var(--muted); }
    .status { color:var(--muted); font-size:13px; padding:24px 0; line-height:1.6; }
    .more { display:block; margin:24px auto 0; }
    @media(min-width:1200px) { .grid { grid-template-columns:repeat(3,minmax(0,1fr)); } }
    @media(prefers-reduced-motion:reduce) { img { transition:none; } }
  `;
  connectedCallback() { super.connectedCallback(); this.signature=""; }
  disconnectedCallback() { super.disconnectedCallback(); this.generation++; clearTimeout(this.timer); }
  protected willUpdate() {
    if(this.hass && (this.signature!==this.camera || this.connection!==this.hass.connection || this.user!==this.hass.user?.id)) {
      this.signature=this.camera; this.connection=this.hass.connection; this.user=this.hass.user?.id;
      this.events=[]; this.limit=24; void this.load();
    }
  }
  private load = async () => {
    const generation=++this.generation; clearTimeout(this.timer); this.loading=true; this.error="";
    const current=()=>this.isConnected && generation===this.generation;
    try {
      if(!/^[a-z0-9_]+$/.test(this.camera)) throw new Error();
      const raw=await this.hass.callWS<EventTile[]|string>({type:"frigate/reviews/get",instance_id:"frigate",cameras:[this.camera],after:Date.now()/1000-3*86400,limit:this.limit});
      if(!current()) return;
      const result=typeof raw==="string"?JSON.parse(raw):raw;
      if(!Array.isArray(result)) throw new Error();
      this.more=result.length>=this.limit;
      const events=result.filter(e=>e.camera===this.camera && /^\d{10}(?:\.\d+)?-[a-zA-Z0-9]+$/.test(e.id)).sort((a,b)=>b.start_time-a.start_time);
      const tiles=await Promise.all(events.map(async event=>{
        try {
          const signed=await this.hass.callWS<{path:string}>({type:"auth/sign_path",path:`/api/frigate/frigate/notifications/${event.id}/${this.camera}/review_thumbnail.webp`,expires:3600});
          return {...event,image:new URL(signed.path,location.origin).href};
        } catch { return {...event,image:undefined}; }
      }));
      if(current()) this.events=tiles;
    } catch { if(current()) this.error="Events couldn’t load. Tap Refresh to try again."; }
    finally { if(current()) { this.loading=false; this.scheduleRefresh(); } }
  };
  private scheduleRefresh() { this.timer=setTimeout(()=>{ if(document.visibilityState==="visible") void this.load(); else this.scheduleRefresh(); },60000); }
  private format(event:EventTile, date=false) {
    return new Intl.DateTimeFormat(this.hass?.locale?.language||undefined,{timeZone:this.hass?.config?.time_zone,...(date?{month:"short",day:"numeric"} as const:{hour:"numeric",minute:"2-digit"} as const)}).format(new Date(event.start_time*1000));
  }
  private duration(event:EventTile) { const seconds=Math.max(1,Math.round(event.end_time!-event.start_time)); return seconds<60?`${seconds}s`:`${Math.floor(seconds/60)}m ${seconds%60}s`; }
  private open(event:EventTile) { this.dispatchEvent(new CustomEvent("signal-open-event",{detail:{id:event.id,camera:event.camera},bubbles:true,composed:true})); }
  render() { return html`
    <div class="heading"><h3>Recent events</h3><button class="refresh" ?disabled=${this.loading} @click=${this.load} aria-label="Refresh events">Refresh</button></div>
    ${this.error?html`<p class="status" role="alert">${this.error}</p>`:""}
    ${!this.events.length?html`<p class="status" role="status">${this.loading?"Loading events…":this.error?"":"No recent events."}</p>`:html`<div class="grid">${repeat(this.events,e=>e.id,e=>html`<button class="tile" aria-label=${`Watch ${e.data?.objects?.some(o=>o.startsWith('doorbell'))?'doorbell':'person'} event, ${this.format(e,true)} at ${this.format(e)}`} @click=${()=>this.open(e)}><span class="picture"><span class="placeholder">Preview unavailable</span>${e.image?html`<img src=${e.image} alt="" loading="lazy" style="position:relative" @error=${(ev:Event)=>{(ev.target as HTMLImageElement).style.visibility="hidden";}}>`:""}</span><span class="caption"><time datetime=${new Date(e.start_time*1000).toISOString()}>${this.format(e)}</time><span class="date">${this.format(e,true)} · ${e.end_time == null ? "In progress" : this.duration(e)}</span></span></button>`)}</div>`}
    ${this.more?html`<button class="more" ?disabled=${this.loading} @click=${()=>{this.limit+=24;void this.load();}}>Load more events</button>`:""}`; }
}
if(!customElements.get("signal-camera-grid")) customElements.define("signal-camera-grid",SignalCameraGrid);
