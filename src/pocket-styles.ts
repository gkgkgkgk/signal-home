import { css } from "lit";
export const pocketStyles = css`
  /* Light catches edges; opaque materials retain their own color in both themes. */
  .panel,
  .sensor {
    background-image: linear-gradient(145deg, #ffffff16, transparent 58%);
    box-shadow:
      inset 0 1px 0 #ffffff38,
      0 2px 3px #12281d05,
      0 12px 24px -20px #12281d55;
  }
  .stepper button,
  .range-tabs button[aria-pressed="true"] {
    box-shadow:
      inset 0 1px 0 #ffffff26,
      0 3px 5px #12281d28;
  }
  .pocket-overview {
    display: grid;
    gap: 12px;
  }
  .pocket-overview > .section-top {
    margin: 12px 0 0;
  }
  .pocket-overview > .favorites {
    margin: 0;
  }
  .pocket-tile {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    text-align: left;
    border: 1px solid #ffffff28;
    border-radius: 25px;
    padding: 18px;
    overflow: hidden;
    font: inherit;
    background-image: linear-gradient(145deg, #ffffff3d, transparent 70%);
    box-shadow:
      inset 0 1px 0 #ffffff75,
      0 3px 5px #12281d09,
      0 12px 24px -17px #12281d70;
    transition:
      transform 350ms cubic-bezier(0.2, 1.25, 0.35, 1),
      box-shadow 200ms;
    isolation: isolate;
  }
  .pocket-tile:active:not(:disabled) {
    transform: translateY(2px) scale(0.982);
    box-shadow:
      inset 0 2px 6px #12281d18,
      0 2px 4px #12281d10;
    transition-duration: 90ms;
  }
  .tile-top,
  .tile-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
  }
  .tile-label {
    display: flex;
    gap: 7px;
    align-items: center;
    font-size: 12px;
    font-weight: 650;
  }
  .tile-label svg {
    width: 18px;
    height: 18px;
  }
  .live-chip {
    font-size: 10px;
    text-transform: capitalize;
    border: 1px solid #233c2e22;
    border-radius: 30px;
    padding: 4px 9px;
    background: #ffffff22;
  }
  .comfort-tile {
    min-height: 192px;
  }
  .comfort-reading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 87px;
  }
  .pocket-temperature {
    font-size: 68px;
    letter-spacing: -4px;
    font-weight: 600;
    line-height: 1.05;
    font-variant-numeric: tabular-nums;
  }
  .pocket-temperature small {
    font-size: 23px;
    letter-spacing: -1px;
    margin-left: 3px;
    vertical-align: super;
  }
  .tile-bottom strong {
    display: block;
    font-size: 12px;
    font-weight: 600;
  }
  .tile-bottom small {
    display: block;
    font-size: 11px;
    opacity: 0.75;
    margin-top: 4px;
  }
  .tile-arrow {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #ffffff40;
    box-shadow: inset 0 1px 0 #ffffff60;
  }
  .tile-arrow svg {
    width: 18px;
    height: 18px;
  }
  .comfort-orbit {
    position: relative;
    width: 90px;
    height: 90px;
    display: grid;
    place-items: center;
    margin-right: 6px;
    flex-shrink: 0;
  }
  .comfort-orbit i {
    position: absolute;
    inset: 0;
    border: 1px solid #233c2e16;
    border-radius: 50%;
  }
  .comfort-orbit i:nth-child(2) {
    inset: 10px;
    border-color: #ffffff60;
  }
  .comfort-orbit > span {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: linear-gradient(145deg, #edf9e0, #91bca4);
    box-shadow:
      inset 0 1px 1px #ffffffcc,
      0 6px 12px #233c2e20;
    transform: rotate(-8deg);
  }
  .comfort-orbit svg {
    width: 25px;
    height: 25px;
  }
  .pocket-pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .pocket-pair .pocket-tile {
    min-height: 145px;
    padding: 16px;
  }
  .pocket-pair .tile-top > svg {
    width: 20px;
    height: 20px;
    opacity: 0.75;
  }
  .pocket-reading {
    display: block;
    font-size: 42px;
    line-height: 1.15;
    letter-spacing: -2px;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    margin: 12px 0 8px;
  }
  .pocket-reading small {
    font-size: 15px;
    letter-spacing: -0.5px;
    margin-left: 3px;
  }
  .tile-caption {
    font-size: 11px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    text-transform: capitalize;
  }
  .pocket-pair .tile-bottom > svg {
    width: 16px;
    height: 16px;
  }
  .pocket-pair .tile-bottom {
    margin-top: auto;
  }
  .home-signal {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 64px;
    width: 100%;
    padding: 12px 15px;
    border: 1px solid var(--line);
    border-radius: 21px;
    background: var(--surface);
    color: var(--ink);
    text-align: left;
    box-shadow:
      inset 0 1px 0 #ffffff18,
      0 5px 14px -12px #0006;
  }
  .home-signal > span:nth-child(2) {
    flex: 1;
    min-width: 0;
  }
  .home-signal strong {
    font-size: 12px;
    display: block;
  }
  .home-signal small {
    font-size: 10px;
    color: var(--muted);
    display: block;
    margin-top: 3px;
  }
  .home-signal > svg {
    width: 18px;
    height: 18px;
  }
  .signal-symbol {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    background: var(--lime);
    color: #354225;
    display: grid;
    place-items: center;
  }
  .signal-symbol svg {
    width: 19px;
    height: 19px;
  }
  .home-signal.attention,
  .home-signal.uncertain {
    border-color: #b67e49;
  }
  .home-signal.attention .signal-symbol,
  .home-signal.uncertain .signal-symbol {
    background: var(--apricot);
    color: #513520;
  }
  @media (hover: hover) {
    .pocket-tile:hover {
      transform: translateY(-2px);
      box-shadow:
        inset 0 1px 0 #ffffff75,
        0 10px 26px -15px #12281d80;
    }
  }
  @media (max-width: 760px) {
    .app {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto minmax(0, 1fr) auto;
      height: calc(100dvh - var(--signal-header-height, 56px));
      min-height: 0;
      overflow: hidden;
    }
    .app.immersive {
      height: 100dvh;
      min-height: 0;
    }
    .app main {
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior-y: contain;
      scrollbar-width: none;
      padding: 19px 18px 24px;
      scroll-padding-top: 12px;
    }
    .app main::-webkit-scrollbar {
      display: none;
    }
    .app.immersive main {
      padding-top: 19px;
    }
    header {
      --signal-top-padding: 10px;
      min-width: 0;
      position: relative;
      z-index: 10;
      margin: 0;
      padding: var(--signal-top-padding) 18px 10px;
      gap: 10px;
      background: var(--paper);
      transition: box-shadow 180ms ease;
    }
    .app.immersive > header {
      --signal-top-padding: max(10px, env(safe-area-inset-top));
    }
    header.scrolled {
      box-shadow: 0 10px 16px -12px #00000045;
    }
    header .eyebrow {
      min-width: 0;
      flex: 1;
    }
    .header-title {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 16px;
      font-weight: 650;
      text-transform: none;
      letter-spacing: -0.3px;
    }
    .eyebrow {
      font-size: 10px;
      letter-spacing: 1.5px;
    }
    .header-right {
      gap: 7px;
      flex-shrink: 0;
    }
    .header-right .icon-button {
      background: var(--surface);
      box-shadow:
        inset 0 1px 0 #ffffff18,
        0 3px 8px #00000008;
    }
    h1 {
      font-size: 32px;
      letter-spacing: -1.3px;
      margin: 0 0 6px;
    }
    .page-heading {
      margin-bottom: 19px;
    }
    .overview-page .page-heading .intro {
      display: none;
    }
    .intro {
      font-size: 12px;
    }
    .bottom-nav {
      position: relative;
      inset: auto;
      left: auto;
      bottom: auto;
      transform: none;
      width: 100%;
      max-width: none;
      margin: 0;
      border-radius: 0;
      background: var(--paper);
      color: var(--muted);
      border-top: 1px solid var(--line);
      box-shadow: 0 -5px 18px #00000005;
      padding: 8px 18px max(8px, env(safe-area-inset-bottom));
      gap: 4px;
      min-height: 70px;
    }
    .nav-indicator {
      top: 8px;
      bottom: max(8px, env(safe-area-inset-bottom));
      left: 18px;
      width: calc((100% - 48px) / 4);
      border-radius: 18px;
      background: var(--surface);
      box-shadow:
        inset 0 1px 0 #ffffff26,
        0 2px 6px #0000000c;
      transform: translateX(calc(var(--active) * (100% + 4px)));
    }
    .bottom-nav button {
      padding: 8px 2px;
      border-radius: 18px;
      font-size: 10px;
      min-height: 52px;
    }
    .bottom-nav button[aria-current="page"] {
      color: var(--ink);
    }
    .bottom-nav button[aria-current="page"] svg {
      stroke-width: 2;
    }
    .bottom-nav svg {
      width: 20px;
      height: 20px;
    }
    .bottom-nav button:active:not(:disabled) {
      transform: scale(0.93);
    }
    .overview-page .sensor {
      border-radius: 19px;
      padding: 13px 15px;
      min-height: 65px;
    }
    .overview-page .sensor-name {
      font-size: 13px;
    }
    .overview-page .sensor-head {
      gap: 9px;
    }
    .overview-page .section-top h2 {
      font-size: 17px;
    }
    .footer {
      font-size: 10px;
      gap: 12px;
    }
    .toast {
      bottom: 90px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .pocket-tile,
    .home-signal,
    header,
    .nav-indicator {
      transition: none !important;
    }
    .pocket-tile:active:not(:disabled),
    .pocket-tile:hover {
      transform: none !important;
    }
  }
`;
