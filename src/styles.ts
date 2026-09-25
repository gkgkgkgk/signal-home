import { css } from "lit";
export const styles = css`
  :host {
    display: block;
    --paper: #f4f3ee;
    --surface: #fffefa;
    --ink: #222b28;
    --muted: #606963;
    --line: #dedfd6;
    --mint: #c7e8d5;
    --lilac: #dce0fa;
    --apricot: #f7cfac;
    --lime: #e0edb3;
    --accent: #365b47;
    color: var(--ink);
    font-family: var(
      --signal-font,
      "Inter",
      "Aptos",
      "Segoe UI",
      system-ui,
      sans-serif
    );
    font-size: 15px;
    line-height: 1.45;
    -webkit-tap-highlight-color: transparent;
  }
  * {
    box-sizing: border-box;
  }
  [hidden] {
    display: none !important;
  }
  .app.immersive {
    min-height: 100dvh;
  }
  .immersive main {
    padding-top: max(24px, env(safe-area-inset-top));
  }
  .signal-menu {
    color: var(--ink);
  }
  .menu-intro {
    font-size: 14px;
    line-height: 1.65;
    color: var(--muted);
    margin: 0 0 24px;
  }
  .signal-menu a,
  .signal-menu > button {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 18px 14px;
    border: 1px solid var(--line);
    border-radius: 18px;
    color: var(--ink);
    background: var(--surface);
    text-decoration: none;
    font: inherit;
    text-align: left;
    margin-top: 10px;
    min-height: 64px;
  }
  .signal-menu span {
    flex: 1;
  }
  .signal-menu small {
    display: block;
    font-size: 11px;
    color: var(--muted);
    margin-top: 5px;
  }
  .menu-footnote {
    font-size: 11px;
    line-height: 1.7;
    color: var(--muted);
    margin: 24px 4px 0;
  }
  .sheet-custom .grid {
    grid-template-columns: 1fr;
  }
  .sheet-custom .panel {
    margin-bottom: 16px;
  }
  .sheet-custom .section-top small {
    display: none;
  }
  button,
  input,
  select {
    font: inherit;
  }
  button {
    cursor: pointer;
    color: inherit;
  }
  button:disabled {
    cursor: default;
    opacity: 0.45;
  }
  button {
    touch-action: manipulation;
  }
  button,
  input,
  select {
    outline-offset: 4px;
  }
  :focus-visible {
    outline: 3px solid #4269bd;
  }
  svg {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }
  button {
    transition:
      transform 160ms cubic-bezier(0.2, 0.8, 0.2, 1),
      background 180ms,
      box-shadow 180ms;
  }
  button:not(:disabled):active {
    transform: scale(0.955);
  }
  .app {
    color: var(--ink);
    background: var(--paper);
    min-height: calc(100dvh - 56px);
    position: relative;
    isolation: isolate;
  }
  .app.dark {
    --paper: #1a2320;
    --surface: #25322c;
    --ink: #f0f2e9;
    --muted: #b0bcb2;
    --line: #425248;
    --mint: #acd7bb;
    --lilac: #b9c5f0;
    --apricot: #ecc098;
    --lime: #d0df9e;
    --accent: #b5d4c0;
  }
  aside {
    position: absolute;
    inset: 0 auto 0 0;
    width: 214px;
    border-right: 1px solid var(--line);
    padding: 34px 24px;
  }
  .sidebar-inner {
    position: sticky;
    top: 28px;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -1px;
  }
  .brand-mark {
    width: 34px;
    height: 34px;
    display: flex;
    gap: 4px;
    align-items: center;
    transform: rotate(-12deg);
  }
  .brand-mark i {
    display: block;
    width: 7px;
    background: var(--ink);
    border-radius: 5px;
    height: 19px;
  }
  .brand-mark i:nth-child(2) {
    height: 33px;
  }
  .brand-mark i:nth-child(3) {
    height: 25px;
  }
  .eyebrow {
    font-size: 11px;
    font-weight: 750;
    letter-spacing: 1.8px;
    text-transform: uppercase;
  }
  .sidebar-label {
    margin: 56px 12px 16px;
    color: var(--muted);
  }
  nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  nav button {
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 14px 16px;
    border: 0;
    background: none;
    border-radius: 16px;
    font-weight: 650;
    text-align: left;
  }
  nav button[aria-current="page"] {
    background: var(--ink);
    color: var(--paper);
  }
  nav button:not([aria-current="page"]):hover {
    background: var(--line);
  }
  .sidebar-note {
    margin: 48px 12px;
    color: var(--muted);
    font-size: 12px;
    max-width: 130px;
  }
  .sidebar-note span {
    display: block;
    color: var(--ink);
    font-weight: 650;
    margin-top: 5px;
  }
  main {
    margin-left: 214px;
    padding: 34px 42px 40px;
    max-width: 1550px;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 32px;
  }
  .date {
    color: var(--muted);
    font-size: 12px;
  }
  .header-right {
    display: flex;
    align-items: center;
    gap: 18px;
  }
  .icon-button {
    width: 44px;
    height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--line);
    border-radius: 50%;
    background: transparent;
    padding: 10px;
  }
  .page-heading {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 26px;
  }
  h1 {
    font-size: clamp(32px, 4vw, 54px);
    line-height: 1.08;
    font-weight: 650;
    letter-spacing: -2.4px;
    margin: 7px 0 10px;
  }
  .intro {
    margin: 0;
    color: var(--muted);
    font-size: 14px;
  }
  h2 {
    font-size: 20px;
    font-weight: 650;
    letter-spacing: -0.7px;
    margin: 0;
  }
  h3 {
    font-size: 16px;
    margin: 0;
    letter-spacing: -0.3px;
  }
  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--line);
    border-radius: 30px;
    padding: 9px 14px;
    font-size: 12px;
    white-space: nowrap;
  }
  .dot {
    height: 7px;
    width: 7px;
    border-radius: 50%;
    background: var(--accent);
  }
  .status-pill.alert {
    border-color: #b73c30;
    color: #b73c30;
  }
  .status-pill.alert .dot {
    background: currentColor;
  }
  .grid {
    display: grid;
    grid-template-columns: minmax(0, 1.12fr) minmax(0, 1fr);
    gap: 20px;
  }
  .stack {
    display: grid;
    gap: 20px;
    min-width: 0;
  }
  .panel {
    padding: 25px;
    border-radius: 26px;
    background: var(--surface);
    min-width: 0;
    position: relative;
    overflow: hidden;
  }
  .mint {
    background: var(--mint);
    color: #233c2e;
  }
  .lilac {
    background: var(--lilac);
    color: #2d3659;
  }
  .apricot {
    background: var(--apricot);
    color: #513520;
  }
  .lime {
    background: var(--lime);
    color: #354225;
  }
  .panel-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .panel-label {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 13px;
    font-weight: 650;
  }
  .panel .icon-button {
    border-color: currentColor;
    width: 44px;
    height: 44px;
    padding: 11px;
    opacity: 0.8;
  }
  .panel .icon-button:hover {
    opacity: 1;
  }
  .climate {
    display: flex;
    flex-direction: column;
    min-height: 437px;
  }
  .dial {
    position: relative;
    margin: 12px auto 0;
    width: min(100%, 280px);
    aspect-ratio: 1;
    display: grid;
    place-items: center;
  }
  .dial-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    transform: rotate(135deg);
  }
  .dial-track {
    stroke: currentColor;
    opacity: 0.13;
  }
  .dial-fill {
    stroke: currentColor;
    transition: stroke-dasharray 550ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .dial-center {
    text-align: center;
    padding-top: 5px;
  }
  .dial-value {
    font-size: 70px;
    font-weight: 550;
    letter-spacing: -4px;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
  }
  .dial-value sup {
    font-size: 28px;
    vertical-align: top;
    position: relative;
    top: 13px;
    letter-spacing: -2px;
  }
  .dial-caption {
    font-size: 12px;
    opacity: 0.85;
    margin-top: 7px;
  }
  .dial-mode {
    margin-bottom: 5px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.6px;
    font-weight: 700;
  }
  .stepper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: -20px;
    z-index: 1;
  }
  .stepper button {
    border: 0;
    background: #233c2e;
    color: #e8f4ec;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    display: grid;
    place-items: center;
  }
  .stepper span {
    font-size: 12px;
  }
  .climate-foot {
    margin-top: 20px;
    padding-top: 17px;
    border-top: 1px solid #233c2e30;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 12px;
  }
  .climate-foot > span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .climate-foot svg {
    width: 16px;
    height: 16px;
  }
  select {
    min-height: 44px;
    border: 1px solid currentColor;
    background: transparent;
    color: inherit;
    border-radius: 12px;
    padding: 8px;
    max-width: 145px;
    cursor: pointer;
  }
  select option {
    color: #222b28;
    background: #fffefa;
  }
  .range-tabs {
    display: flex;
    border: 1px solid #233c2e44;
    padding: 4px;
    border-radius: 16px;
    width: fit-content;
    margin: 18px auto 0;
    gap: 4px;
  }
  .range-tabs button {
    border: 0;
    background: transparent;
    color: inherit;
    font-size: 12px;
    padding: 10px 16px;
    border-radius: 12px;
  }
  .range-tabs button[aria-pressed="true"] {
    background: #233c2e;
    color: #e8f4ec;
  }
  .value-in {
    display: inline-block;
    animation: value-in 300ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes value-in {
    from {
      opacity: 0.3;
      transform: translateY(7px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .weather {
    min-height: 218px;
  }
  .weather-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 14px;
    gap: 10px;
  }
  .weather-temp {
    font-size: 64px;
    letter-spacing: -4px;
    font-weight: 550;
    line-height: 1.12;
  }
  .weather-condition {
    text-transform: capitalize;
    font-size: 14px;
    margin: 5px 0;
  }
  .weather-details {
    display: flex;
    gap: 18px;
    font-size: 12px;
    margin-top: 14px;
  }
  .weather-art {
    width: 116px;
    height: 116px;
    position: relative;
    flex-shrink: 0;
    display: grid;
    place-items: center;
  }
  .weather-art .sun-disc {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #f6bc57;
    box-shadow: 0 0 0 12px #f6bc5730;
    animation: sun-enter 1s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .weather-art .cloud {
    position: absolute;
    background: #fffefa;
    width: 81px;
    height: 33px;
    border-radius: 40px;
    bottom: 20px;
    right: 1px;
    box-shadow: 0 4px 0 #8994bd18;
  }
  .cloud:before {
    content: "";
    position: absolute;
    width: 43px;
    height: 43px;
    background: inherit;
    border-radius: 50%;
    bottom: 7px;
    left: 13px;
  }
  .night .sun-disc {
    background: #f8f4d4;
    box-shadow: inset -16px -8px #8f9ed9;
  }
  .rain .cloud:after {
    content: "╲  ╲  ╲";
    position: absolute;
    top: 28px;
    left: 16px;
    color: #476bb7;
    font-weight: bold;
  }
  .groceries {
    min-height: 199px;
  }
  .list-preview {
    margin: 18px 0 10px;
    display: grid;
    gap: 4px;
  }
  .todo-row {
    display: flex;
    align-items: center;
    gap: 11px;
    min-height: 44px;
    border-bottom: 1px solid #51352020;
  }
  .check-button {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border: 0;
    background: transparent;
    flex-shrink: 0;
  }
  .check-box {
    width: 20px;
    height: 20px;
    border: 1.5px solid currentColor;
    border-radius: 7px;
    display: grid;
    place-items: center;
  }
  .check-box svg {
    width: 16px;
    height: 16px;
  }
  .todo-row span {
    overflow-wrap: anywhere;
  }
  .todo-row.done {
    text-decoration: line-through;
    opacity: 0.5;
  }
  .text-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: 0;
    padding: 10px 0;
    font-size: 12px;
    font-weight: 650;
  }
  .text-button svg {
    width: 16px;
    height: 16px;
  }
  .section-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 30px 0 15px;
  }
  .section-top small {
    color: var(--muted);
  }
  .sensors {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }
  .sensor {
    width: 100%;
    border: 1px solid var(--line);
    border-radius: 21px;
    background: var(--surface);
    text-align: left;
    padding: 20px;
  }
  .sensor:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 20px #222b280b;
  }
  .sensor-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 22px;
  }
  .sensor-symbol {
    width: 38px;
    height: 38px;
    border-radius: 13px;
    background: var(--lime);
    color: #354225;
    display: grid;
    place-items: center;
  }
  .sensor-symbol.bad {
    background: #f7b8a9;
    color: #6e2419;
  }
  .sensor-symbol.unknown {
    background: var(--line);
    color: var(--ink);
  }
  .sensor-state {
    font-size: 11px;
    font-weight: 650;
  }
  .sensor-name {
    font-size: 14px;
    font-weight: 650;
  }
  .sensor-sub {
    font-size: 11px;
    color: var(--muted);
    margin-top: 4px;
  }
  .favorites {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 14px;
  }
  .favorite {
    border: 1px solid var(--line);
    border-radius: 20px;
    background: var(--surface);
    padding: 20px;
    text-align: left;
    min-height: 128px;
  }
  .favorite.on {
    background: var(--lime);
    color: #354225;
  }
  .favorite svg {
    display: block;
    margin-bottom: 16px;
  }
  .favorite small {
    display: block;
    margin-top: 4px;
  }
  .page {
    animation: page-in 380ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .sensors .sensor {
    animation: page-in 420ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .sensors .sensor:nth-child(2) {
    animation-delay: 40ms;
  }
  .sensors .sensor:nth-child(3) {
    animation-delay: 80ms;
  }
  .notice {
    background: var(--surface);
    border: 1px solid var(--line);
    padding: 20px;
    border-radius: 20px;
    color: var(--muted);
  }
  .empty {
    font-size: 13px;
    padding: 15px 0;
    opacity: 0.85;
  }
  .wide {
    grid-column: 1/-1;
  }
  .detail-grid {
    max-width: 900px;
  }
  .detail-grid .climate {
    min-height: 450px;
  }
  .metric {
    font-size: 60px;
    letter-spacing: -3px;
    line-height: 1.2;
    margin: 35px 0 20px;
  }
  .metric small {
    font-size: 24px;
    letter-spacing: -1px;
  }
  .todo-form {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  .todo-form input {
    min-width: 0;
    width: 100%;
    border: 1px solid #51352055;
    padding: 13px 16px;
    border-radius: 14px;
    color: inherit;
    background: #fffefa55;
  }
  .todo-form button {
    border: 0;
    border-radius: 14px;
    background: #513520;
    color: #fffefa;
    min-width: 48px;
    display: grid;
    place-items: center;
  }
  .bottom-nav {
    display: none;
  }
  .toast {
    position: fixed;
    z-index: 20;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--ink);
    color: var(--paper);
    border-radius: 18px;
    padding: 14px 20px;
    max-width: min(90vw, 440px);
    box-shadow: 0 10px 35px #0002;
    animation: page-in 200ms;
    font-size: 13px;
  }
  .footer {
    margin-top: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--muted);
    font-size: 11px;
  }
  .footer button {
    background: transparent;
    border: 0;
    padding: 10px;
    color: inherit;
    font-size: 11px;
  }
  @keyframes page-in {
    from {
      opacity: 0;
      translate: 0 10px;
    }
    to {
      opacity: 1;
      translate: 0 0;
    }
  }
  @keyframes sun-enter {
    from {
      transform: scale(0.7) rotate(-30deg);
      opacity: 0;
    }
    to {
      transform: scale(1) rotate(0);
      opacity: 1;
    }
  }
  @media (min-width: 1500px) {
    main {
      margin-right: auto;
    }
  }
  @media (max-width: 1100px) {
    aside {
      width: 170px;
      padding: 30px 16px;
    }
    main {
      margin-left: 170px;
      padding: 28px;
    }
    .brand {
      font-size: 20px;
    }
    .page-heading {
      align-items: start;
    }
    .page-heading > .status-pill {
      display: none;
    }
    .panel {
      padding: 22px;
    }
    .sensors {
      gap: 10px;
    }
    .sensor {
      padding: 16px;
    }
  }
  @media (max-width: 760px) {
    aside {
      display: none;
    }
    main {
      margin: 0;
      padding: 22px 18px calc(108px + env(safe-area-inset-bottom, 0px));
    }
    header {
      margin-bottom: 28px;
    }
    .header-right {
      gap: 9px;
    }
    .date {
      display: none;
    }
    h1 {
      font-size: 40px;
      letter-spacing: -1.8px;
    }
    .grid {
      gap: 14px;
    }
    .stack {
      gap: 14px;
    }
    .panel {
      padding: 20px;
      border-radius: 23px;
    }
    .bottom-nav {
      display: flex;
      position: fixed;
      bottom: calc(16px + env(safe-area-inset-bottom, 0px));
      left: 50%;
      transform: translateX(-50%);
      width: min(calc(100% - 36px), 430px);
      background: var(--ink);
      color: var(--paper);
      border-radius: 26px;
      padding: 7px;
      z-index: 10;
      box-shadow: 0 9px 30px #0002;
      flex-direction: row;
      gap: 2px;
    }
    .nav-indicator {
      position: absolute;
      top: 7px;
      bottom: 7px;
      left: 7px;
      width: calc((100% - 20px) / 4);
      background: var(--mint);
      border-radius: 20px;
      transform: translateX(calc(var(--active) * (100% + 2px)));
      transition: transform 420ms cubic-bezier(0.22, 1.15, 0.36, 1);
      pointer-events: none;
    }
    .bottom-nav button {
      position: relative;
      flex: 1;
      padding: 10px 2px;
      border-radius: 20px;
      justify-content: center;
      gap: 4px;
      flex-direction: column;
      font-size: 10px;
      color: inherit;
    }
    .bottom-nav button[aria-current="page"] {
      background: transparent;
      color: #233c2e;
    }
    .bottom-nav button:not([aria-current="page"]):hover {
      background: #ffffff15;
    }
    .bottom-nav svg {
      width: 22px;
      height: 22px;
    }
    .toast {
      bottom: 110px;
    }
    .footer {
      margin-top: 20px;
    }
  }
  @media (max-width: 560px) {
    .grid {
      grid-template-columns: 1fr;
    }
    .climate {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 112px;
      gap: 10px;
      min-height: 0;
    }
    .climate .panel-top {
      grid-column: 1/-1;
    }
    .climate .dial {
      grid-column: 1;
      grid-row: 2/4;
      width: 100%;
      max-width: 200px;
      margin: 5px 0;
    }
    .climate .dial-value {
      font-size: 48px;
      letter-spacing: -2px;
    }
    .climate .dial-value sup {
      font-size: 19px;
      top: 7px;
      letter-spacing: -1px;
    }
    .climate .dial-mode {
      font-size: 9px;
    }
    .climate .dial-caption {
      font-size: 10px;
    }
    .climate .stepper {
      grid-column: 2;
      grid-row: 2;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      align-self: end;
      margin: 0;
    }
    .climate .stepper span {
      grid-column: 1/-1;
      grid-row: 1;
      text-align: center;
    }
    .climate .stepper button:first-child {
      grid-row: 2;
    }
    .climate .stepper button:last-child {
      grid-row: 2;
    }
    .climate .range-tabs {
      grid-column: 2;
      grid-row: 3;
      margin: 0;
      align-self: start;
      width: 100%;
      flex-direction: column;
      border: 0;
      padding: 0;
    }
    .climate .range-tabs button {
      padding: 8px;
      min-height: 44px;
    }
    .climate .climate-foot {
      grid-column: 1/-1;
      margin-top: 0;
      padding-top: 14px;
    }
    .detail-grid .climate {
      min-height: 0;
    }
    .stack {
      grid-template-columns: 1fr;
    }
    .weather {
      min-height: 205px;
    }
    .groceries {
      min-height: 190px;
    }
    .sensors {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .sensor {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      align-items: center;
      gap: 12px;
      padding: 16px;
    }
    .sensor-head {
      margin: 0;
      flex-direction: row-reverse;
      justify-content: flex-end;
      gap: 12px;
    }
    .sensor-name {
      font-size: 14px;
    }
    .section-top {
      margin-top: 25px;
    }
    .weather-content {
      margin-top: 5px;
    }
    .weather-art {
      margin-right: 10px;
    }
    .page-heading {
      margin-bottom: 24px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
    button:active,
    .sensor:hover {
      transform: none !important;
    }
  }
`;
