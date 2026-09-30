import { css } from "lit";

/** One restrained motion vocabulary, shared by the dashboard and standalone cards. */
export const motionStyles = css`
  :host {
    --signal-press: 90ms;
    --signal-settle: 240ms;
    --signal-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  button {
    -webkit-tap-highlight-color: transparent;
  }
  button:not(:disabled):active {
    transition-duration: var(--signal-press);
  }
  input,
  select {
    transition:
      border-color 160ms ease,
      box-shadow 160ms ease;
  }
  input:focus-visible,
  select:focus-visible {
    box-shadow: 0 0 0 4px #6d8cce20;
  }
  @media (hover: hover) and (pointer: fine) {
    .icon-button:not(:disabled):hover {
      background: #899a891a;
    }
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
      scale: none !important;
    }
  }
`;

export const polishStyles = css`
  .page {
    animation: signal-page-in 240ms var(--signal-ease) both;
  }
  .sensors .sensor {
    animation: none;
  }
  @keyframes signal-page-in {
    from {
      opacity: 0.35;
      transform: translateX(var(--page-travel, 0px));
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  .nav-indicator {
    transition: transform 300ms var(--signal-ease);
  }
  nav button svg {
    transition: transform 240ms var(--signal-ease);
  }
  nav button[aria-current="page"] svg {
    transform: translateY(-1px);
  }
  .pocket-tile {
    transition:
      transform 240ms var(--signal-ease),
      box-shadow 180ms ease;
  }
  .list-switcher button {
    transition:
      background 180ms ease,
      color 180ms ease,
      transform 180ms var(--signal-ease);
  }
  .check-box {
    transition:
      background 180ms ease,
      border-color 180ms ease,
      transform 180ms var(--signal-ease);
  }
  .check-button:not(:disabled):active .check-box {
    transform: scale(0.88);
  }
  .completed-row .check-box svg {
    animation: signal-tick 220ms var(--signal-ease) both;
  }
  @keyframes signal-tick {
    from {
      opacity: 0;
      transform: scale(0.6);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  .todo-row[aria-busy="true"] .check-box {
    border-style: dotted;
  }
  .list-loading {
    min-height: 132px;
    padding: 10px 0;
  }
  .loading-row {
    display: flex;
    align-items: center;
    gap: 14px;
    height: 44px;
    opacity: 0.4;
  }
  .loading-row::before {
    content: "";
    width: 20px;
    height: 20px;
    margin: 0 12px;
    border-radius: 7px;
    background: currentColor;
  }
  .loading-row::after {
    content: "";
    width: 48%;
    height: 10px;
    border-radius: 9px;
    background: currentColor;
  }
  .loading-row:nth-child(2)::after {
    width: 65%;
  }
  .loading-row:nth-child(3)::after {
    width: 37%;
  }
  .toast {
    gap: 12px;
  }
  .toast-mark {
    width: 24px;
    height: 24px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }
  .toast-mark svg {
    width: 19px;
    height: 19px;
  }
  .toast.success .toast-mark {
    border-radius: 50%;
    background: var(--mint);
    color: #233c2e;
    animation: signal-tick 220ms var(--signal-ease);
  }
  .toast.error .toast-mark {
    color: #ffb9ac;
  }
  .toast > .toast-copy {
    flex: 1;
  }
`;
