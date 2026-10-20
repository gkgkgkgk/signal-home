import { LitElement, html, svg, css, nothing } from "lit";
import type { Hass } from "./types";
import {
  HORIZON_Y,
  duration,
  homeDayStart,
  nextSunEvent,
  onDay,
  skyY,
} from "./sun-model";

/** Home's Daylight card: today's sun arc, where the sun is now, and the next sunrise or sunset from HA's sun integration. */
export class SignalSun extends LitElement {
  static properties = {
    hass: { attribute: false },
    now: { attribute: false },
  };
  declare hass: Hass;
  now = new Date();
  static styles = css`
    :host {
      display: block;
      margin-bottom: 18px;
    }
    .sun {
      border: 1px solid var(--line);
      border-radius: 24px;
      background: var(--surface);
      padding: 18px 18px 10px;
      overflow: hidden;
      transition: background 0.6s;
    }
    .sun.night {
      background: color-mix(in srgb, var(--surface) 90%, #34406b);
    }
    .head {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 6px 16px;
    }
    .eyebrow {
      display: block;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.8px;
      color: var(--muted);
    }
    .headline {
      display: block;
      margin: 6px 0 2px;
      font-size: 26px;
      font-weight: 750;
      letter-spacing: -0.5px;
      font-variant-numeric: tabular-nums;
    }
    .sub {
      font-size: 13px;
      color: var(--muted);
    }
    .sky,
    .rail {
      position: relative;
      margin: 0 -18px;
    }
    .sky {
      height: 104px;
      margin-top: 8px;
    }
    svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .mark,
    .disc {
      position: absolute;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
    .mark {
      width: 7px;
      height: 7px;
      background: var(--muted);
    }
    .disc {
      width: 22px;
      height: 22px;
      background: #ffc56b;
      box-shadow:
        0 0 0 6px #ffc56b38,
        0 0 28px #ffb44aa0;
      animation: settle 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }
    .disc.down {
      width: 14px;
      height: 14px;
      background: var(--surface);
      border: 2px solid var(--muted);
      box-shadow: none;
    }
    .rail {
      height: 20px;
      font-size: 11px;
      color: var(--muted);
      font-variant-numeric: tabular-nums;
    }
    .rail span {
      position: absolute;
      top: 2px;
      transform: translateX(-50%);
      white-space: nowrap;
    }
    @keyframes settle {
      from {
        opacity: 0;
        transform: translate(-50%, -20%) scale(0.5);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .disc {
        animation: none;
      }
      .sun {
        transition: none;
      }
    }
  `;
  render() {
    if (!this.hass) return nothing;
    const zone = this.hass.config?.time_zone;
    const now = this.now.getTime();
    const nextRise = nextSunEvent(this.hass, "rising");
    const nextSet = nextSunEvent(this.hass, "setting");
    if (nextRise === undefined || nextSet === undefined) return nothing;
    const start = homeDayStart(now, zone);
    const end = homeDayStart(start + 30 * 3600000, zone);
    const rise = onDay(nextRise, start, end)!;
    const set = onDay(nextSet, start, end)!;
    if (set <= rise) return nothing;
    const dawn = onDay(nextSunEvent(this.hass, "dawn"), start, end);
    const dusk = onDay(nextSunEvent(this.hass, "dusk"), start, end);
    const sun = this.hass.states["sun.sun"]?.state;
    const up = sun ? sun === "above_horizon" : now >= rise && now < set;
    const clock = (time: number) =>
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: zone,
      }).format(new Date(time));
    // The headline is HA's next event itself, so it matches sun-triggered automations exactly.
    const next = nextRise < nextSet ? nextRise : nextSet;
    const label = `${next === nextRise ? "Sunrise" : "Sunset"} ${clock(next)}`;
    const sub =
      next === nextSet
        ? `${duration(next - now)} of daylight left`
        : `in ${duration(next - now)}`;

    const x = (time: number) => ((time - start) / (end - start)) * 1000;
    const steps = 144;
    const path = Array.from({ length: steps + 1 }, (_, i) => {
      const time = start + ((end - start) * i) / steps;
      return `${i ? "L" : "M"}${x(time).toFixed(1)} ${skyY(time, rise, set).toFixed(2)}`;
    }).join(" ");
    const area = `${path} L1000 ${HORIZON_Y} L0 ${HORIZON_Y} Z`;
    const nowX = x(now);
    const edge = (time: number) => Math.min(88, Math.max(12, x(time) / 10));
    // Twilight glows along the horizon around sunrise and sunset, as wide as dawn-to-sunrise (or sunset-to-dusk) on either side.
    const glow = (at: number, edge?: number) =>
      edge !== undefined
        ? svg`<ellipse cx=${x(at)} cy=${HORIZON_Y} rx=${Math.max(Math.abs(x(at) - x(edge)) * 2.2, 30)} ry="16" fill="url(#twilight)" />`
        : nothing;

    return html`<section class=${`sun ${up ? "day" : "night"}`} aria-label="Daylight">
      <div class="head">
        <div>
          <span class="eyebrow">Daylight</span>
          <strong class="headline">${label}</strong>
          <span class="sub">${sub} · ${duration(set - rise)} today</span>
        </div>
      </div>
      <div
        class="sky"
        role="img"
        aria-label=${`Sunrise ${clock(rise)}, sunset ${clock(set)}. The sun is ${up ? "up" : "down"}.`}
      >
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="daylight" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2=${HORIZON_Y}>
              <stop offset="0" style="stop-color: var(--lilac); stop-opacity: 0.95" />
              <stop offset="1" style="stop-color: var(--apricot); stop-opacity: 0.75" />
            </linearGradient>
            <radialGradient id="twilight">
              <stop offset="0" style="stop-color: var(--apricot); stop-opacity: 0.9" />
              <stop offset="1" style="stop-color: var(--apricot); stop-opacity: 0" />
            </radialGradient>
            <clipPath id="above"><rect x="0" y="-20" width="1000" height=${HORIZON_Y + 20} /></clipPath>
            <clipPath id="below"><rect x="0" y=${HORIZON_Y} width="1000" height="60" /></clipPath>
            <clipPath id="past"><rect x="-10" y="-20" width=${nowX + 10} height="140" /></clipPath>
            <clipPath id="future"><rect x=${nowX} y="-20" width=${1010 - nowX} height="140" /></clipPath>
          </defs>
          ${glow(rise, dawn)} ${glow(set, dusk)}
          <path d=${area} fill="url(#daylight)" clip-path="url(#above)" />
          <path d=${area} style=${`fill: ${up ? "var(--ink)" : "#34406b"}; fill-opacity: ${up ? 0.05 : 0.16}`} clip-path="url(#below)" />
          <line x1="0" x2="1000" y1=${HORIZON_Y} y2=${HORIZON_Y} style="stroke: var(--line)" stroke-width="1.5" vector-effect="non-scaling-stroke" />
          <path d=${path} fill="none" style="stroke: var(--ink); stroke-opacity: 0.55" stroke-width="2" vector-effect="non-scaling-stroke" clip-path="url(#past)" />
          <path d=${path} fill="none" style="stroke: var(--muted); stroke-opacity: 0.8" stroke-width="1.5" stroke-dasharray="3 5" vector-effect="non-scaling-stroke" clip-path="url(#future)" />
        </svg>
        ${[rise, set].map(
          (time) => html`<span class="mark" style=${`left:${x(time) / 10}%;top:${HORIZON_Y}%`}></span>`,
        )}
        <span
          class=${`disc ${up ? "" : "down"}`}
          style=${`left:${nowX / 10}%;top:${skyY(now, rise, set)}%`}
        ></span>
      </div>
      <div class="rail" aria-hidden="true">
        <span style=${`left:${edge(rise)}%`}>↑ ${clock(rise)}</span>
        <span style=${`left:${edge(set)}%`}>↓ ${clock(set)}</span>
      </div>
    </section>`;
  }
}
customElements.define("signal-sun", SignalSun);
