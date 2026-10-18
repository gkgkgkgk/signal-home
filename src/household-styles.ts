import { css } from "lit";
export const householdStyles = css`
  .more-links {display:grid;gap:12px;padding:0 6px 16px;}
  .more-links button {display:flex;align-items:center;gap:14px;min-height:60px;padding:16px;border:1px solid var(--line);border-radius:16px;color:var(--ink);background:var(--surface);font:inherit;cursor:pointer;}
  .more-links button span {flex:1;text-align:left;}
  .more-links svg {width:22px;height:22px;}
  button.status-pill {font:inherit;font-size:12px;cursor:pointer;color:var(--ink);background:var(--surface);}
  button.status-pill.alert {color:#b73c30;}
  button.status-pill.review {color:#78541f;border-color:#bd965c;background:color-mix(in srgb,var(--surface) 88%,#e8bb70);}
  .dark button.status-pill.review {color:#f2cf98;border-color:#9b7847;background:color-mix(in srgb,var(--surface) 90%,#9b7847);}
  .security-mode {border:1px solid var(--line);border-radius:28px;background:var(--surface);padding:24px;margin-bottom:20px;}
  .security-mode-head {display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px;}
  .security-mode-head h2 {font-size:24px;margin:6px 0 0;letter-spacing:-.6px;}
  .mode-context {font-size:12px;color:var(--muted);text-align:right;max-width:180px;line-height:1.45;}
  .alarm-state-badge {flex:none;border-radius:999px;padding:8px 12px;font-size:12px;font-weight:800;letter-spacing:.02em;text-transform:uppercase;}
  .alarm-state-badge.on {color:#8a381c;background:#fbe4d4;}
  .alarm-state-badge.off {color:#32634d;background:#def0e4;}
  .alarm-mode-detail {margin:0 0 18px;color:var(--muted);font-size:14px;line-height:1.5;}
  .alarm-countdown {display:grid;grid-template-columns:1fr auto;gap:8px 12px;margin:0 0 18px;padding:14px 16px;border-radius:16px;background:#fff0da;color:#713b1d;}
  .alarm-countdown strong {font-size:22px;line-height:1;}
  .alarm-progress {grid-column:1/-1;height:8px;overflow:hidden;border-radius:999px;background:#ead4b6;}
  .alarm-progress span {display:block;height:100%;border-radius:inherit;background:#a45e2c;transition:width .8s linear;}
  .security-mode[data-alarm-state=pending] .alarm-countdown {background:#ffe5df;color:#922e23;}
  .security-mode[data-alarm-state=pending] .alarm-progress span {background:#d23d31;}
  .security-mode[data-alarm-state=triggered] {border-color:#c6463c;box-shadow:0 0 0 2px #c6463c33;}
  .security-mode-options {display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;}
  .security-mode-option {position:relative;display:flex;flex-direction:column;align-items:start;gap:7px;min-height:128px;padding:15px;border:2px solid transparent;border-radius:18px;color:#26332e;font:inherit;text-align:left;cursor:pointer;overflow:hidden;transition:transform .2s,background .2s,border-color .2s,box-shadow .2s;}
  .security-mode-option:active:not(:disabled) {transform:scale(.97)}
  .security-mode-option:focus-visible {outline:3px solid var(--ink);outline-offset:3px}
  .security-mode-option:disabled {cursor:default;opacity:.6}
  .security-mode-option strong {font-size:16px;line-height:1.2}
  .security-mode-option small {font-size:11px;line-height:1.3;opacity:.78}
  .security-mode-option .mode-icon {display:grid;place-items:center;width:30px;height:30px;border-radius:10px;background:#ffffff78}
  .security-mode-option svg {width:19px;height:19px}
  .mode-home {background:#e1f0e3}.mode-home[aria-pressed=true]{background:#b8dfc1;border-color:#4c9a6e;box-shadow:0 5px 18px #458e6433}
  .mode-sleeping {background:#e6e8fa}.mode-sleeping[aria-pressed=true]{background:#c5c9f2;border-color:#656ebc;box-shadow:0 5px 18px #5b68ba33}
  .mode-away {background:#f8e8d8}.mode-away[aria-pressed=true]{background:#f0c89b;border-color:#bd8242;box-shadow:0 5px 18px #bd824233}
  .mode-check {position:absolute;right:10px;top:10px;opacity:.8}
  .mode-check:empty {display:none}
  .mode-progress {position:absolute;bottom:0;left:0;height:5px;background:#594da9;transition:width .8s linear;}
  .mode-away .mode-progress {background:#a45e2c;}
  .alarm-control {display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px;padding:16px;border:1px solid var(--line);border-radius:18px;background:color-mix(in srgb,var(--surface) 82%,var(--ink));}
  .alarm-control>div {display:grid;gap:4px;}
  .alarm-control strong {font-size:14px;}
  .alarm-control span {font-size:12px;color:var(--muted);}
  .alarm-control button {flex:none;border:0;border-radius:12px;padding:11px 14px;background:#b33a31;color:#fff;font:inherit;font-size:13px;font-weight:700;cursor:pointer;}
  .alarm-control button:disabled {background:#c7cfca;color:#52635b;cursor:default;}
  .dark .security-mode-option {color:#22312b}
  .sensor-sections {display:grid;gap:26px;}
  .sensor-section h2 {font-size:17px;letter-spacing:-.35px;margin:0 0 12px 2px;}
  .climate { transition:box-shadow .4s,background .4s; }
  .climate[data-activity=heating] { background:color-mix(in srgb,var(--surface) 74%,#ffa85c); box-shadow:inset 0 0 55px #fa9c4533,0 5px 30px #fa9c4518; }
  .climate[data-activity=cooling] { background:color-mix(in srgb,var(--surface) 74%,#80c8ff); box-shadow:inset 0 0 55px #59baff33,0 5px 30px #59baff18; }
  .climate[data-activity=fan] { background:color-mix(in srgb,var(--surface) 74%,#99dec6); box-shadow:inset 0 0 55px #72d5b333; }
  .climate[data-activity=heating] .dial-fill { stroke:#b85818; }
  .climate[data-activity=cooling] .dial-fill { stroke:#227aba; }
  .climate[data-activity=fan] .dial-fill { stroke:#31866c; }
  .stepper>span { font-size:15px; }
  @media(max-width:760px) {
    .security-mode {padding:18px;}
    .security-mode-options {gap:6px;}
    .security-mode-option {min-height:120px;padding:10px;gap:7px;}
    .security-mode-option strong {font-size:13px;}
    .security-mode-option small {font-size:10px;}
    .mode-context {font-size:10px;max-width:150px;}
    .alarm-control {align-items:stretch;flex-direction:column;}
    .alarm-control button {width:100%;}

    .bottom-nav { gap:2px; padding:6px; width:min(calc(100% - 16px),470px); }
    .bottom-nav button { min-width:0; font-size:10px; }
    .nav-indicator { top:6px; bottom:6px; left:6px; width:calc((100% - 12px - (var(--tab-count,6) - 1)*2px)/var(--tab-count,6)); transform:translateX(calc(var(--active)*(100% + 2px))); }
  }
  @media(prefers-reduced-motion:reduce) { .climate,.security-mode-option { transition:none; } }
`;
