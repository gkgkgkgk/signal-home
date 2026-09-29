import { css } from "lit";
export const widgetStyles = css`
  :host {
    display: block;
    height: 100%;
    font-family: var(
      --signal-font,
      "Inter",
      "Aptos",
      "Segoe UI",
      system-ui,
      sans-serif
    );
    --signal-card: #fffefa;
    --signal-text: #222b28;
    --signal-subtle: #606963;
    --signal-border: #dedfd6;
    --signal-track: #eeefe8;
  }
  * {
    box-sizing: border-box;
  }
  button,
  input,
  select {
    font: inherit;
  }
  button,
  input,
  select {
    outline-offset: 4px;
  }
  *:focus-visible {
    outline: 3px solid #4a72c1;
  }
  button {
    cursor: pointer;
    touch-action: manipulation;
    transition:
      transform 150ms,
      background 200ms;
    border: 0;
    color: inherit;
  }
  button:active:not(:disabled) {
    transform: scale(0.955);
  }
  button:disabled,
  input:disabled {
    opacity: 0.45;
    cursor: default;
  }
  svg {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }
  .widget {
    --card: var(--signal-card);
    --text: var(--signal-text);
    --subtle: var(--signal-subtle);
    --border: var(--signal-border);
    --track: var(--signal-track);
    --accent: #c7e8d5;
    --accent-ink: #233c2e;
    --tint: #e8f2e9;
    background: var(--card);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 22px;
    height: 100%;
    min-width: 0;
    background-image: linear-gradient(145deg, #ffffff0b, transparent 60%);
    box-shadow:
      inset 0 1px 0 #ffffff18,
      0 8px 20px -18px #0008;
  }
  .widget.lilac {
    --accent: #dce0fa;
    --accent-ink: #2d3659;
    --tint: #f0f1fb;
  }
  .widget.apricot {
    --accent: #f7cfac;
    --accent-ink: #513520;
    --tint: #fcf0e3;
  }
  .widget.lime {
    --accent: #e0edb3;
    --accent-ink: #354225;
    --tint: #f0f5df;
  }
  .widget.dark {
    --card: #25322c;
    --text: #f0f2e9;
    --subtle: #b0bcb2;
    --border: #425248;
    --track: #36483f;
    --tint: #33473a;
  }
  @media (prefers-color-scheme: dark) {
    .widget.auto {
      --card: #25322c;
      --text: #f0f2e9;
      --subtle: #b0bcb2;
      --border: #425248;
      --track: #36483f;
      --tint: #33473a;
    }
  }
  h2 {
    font-size: 18px;
    letter-spacing: -0.5px;
    line-height: 1.3;
    font-weight: 650;
    margin: 0;
  }
  .subtle {
    color: var(--subtle);
    font-size: 12px;
  }
  .icon-button {
    width: 44px;
    height: 44px;
    border: 1px solid var(--border);
    border-radius: 50%;
    background: transparent;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }
  .error {
    font-size: 13px;
    background: #f7d4cc;
    color: #752b21;
    border-radius: 12px;
    padding: 12px;
    margin: 15px 0 0;
  }
  .label {
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-weight: 700;
  }
  .empty {
    padding: 22px 0;
    color: var(--subtle);
    font-size: 13px;
  }
  .numeric {
    font-variant-numeric: tabular-nums;
  }
  .retry {
    padding: 10px 16px;
    min-height: 44px;
    background: var(--accent);
    color: var(--accent-ink);
    border-radius: 12px;
    margin-top: 12px;
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
    }
    button:active {
      transform: none !important;
    }
  }
`;
