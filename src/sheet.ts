import { LitElement, html, css, type PropertyValues } from "lit";
import { icon } from "./icons";

/** Native top-layer dialog: focus containment, inert background, and an owned Back entry. */
export class SignalSheet extends LitElement {
  static properties = {
    open: { type: Boolean },
    heading: { type: String },
    dark: { type: Boolean },
  };
  static styles = css`
    :host {
      font-family: var(--signal-font, system-ui, sans-serif);
    }
    * {
      box-sizing: border-box;
    }
    dialog {
      --paper: #f4f3ee;
      --ink: #222b28;
      --muted: #606963;
      --line: #dedfd6;
      background: var(--paper);
      color: var(--ink);
      border: 1px solid var(--line);
      border-radius: 30px;
      padding: 0;
      width: min(580px, calc(100vw - 40px));
      max-height: 88dvh;
      overflow: hidden;
      box-shadow: 0 24px 90px #0003;
    }
    dialog.dark {
      --paper: #1a2320;
      --ink: #f0f2e9;
      --muted: #b0bcb2;
      --line: #425248;
      color-scheme: dark;
    }
    dialog::backdrop {
      background: #101e18a3;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 22px 24px 16px;
      touch-action: none;
    }
    h2 {
      font-size: 24px;
      letter-spacing: -0.8px;
      margin: 0;
      font-weight: 650;
    }
    button {
      display: grid;
      place-items: center;
      border: 1px solid var(--line);
      border-radius: 50%;
      width: 44px;
      height: 44px;
      flex-shrink: 0;
      background: transparent;
      color: var(--ink);
      cursor: pointer;
      touch-action: manipulation;
    }
    button:active {
      transform: scale(0.94);
    }
    button:focus-visible {
      outline: 3px solid #6d8cce;
      outline-offset: 3px;
    }
    svg {
      width: 21px;
      height: 21px;
    }
    .body {
      padding: 0 24px 24px;
      overflow-y: auto;
      max-height: calc(88dvh - 90px);
      overscroll-behavior: contain;
    }
    .handle {
      display: none;
    }
    @media (max-width: 600px) {
      dialog {
        position: fixed;
        inset: auto 0 0;
        margin: 0;
        width: 100%;
        max-width: 100%;
        max-height: 92dvh;
        border-radius: 28px 28px 0 0;
        border-bottom: 0;
      }
      .handle {
        display: block;
        position: absolute;
        width: 34px;
        height: 4px;
        top: 10px;
        left: calc(50% - 17px);
        background: var(--line);
        border-radius: 4px;
      }
      header {
        padding: 26px 20px 16px;
      }
      h2 {
        font-size: 23px;
      }
      .body {
        padding: 0 16px max(24px, env(safe-area-inset-bottom));
        max-height: calc(92dvh - 96px);
      }
    }
  `;
  open = false;
  heading = "Details";
  dark = false;
  // A history marker, not a security token. HA commonly runs on HTTP LAN URLs.
  private sheetId = `signal-sheet-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  private closing = false;
  private closeRequested = false;
  private startY = 0;
  private trapTab(event: KeyboardEvent) {
    if (event.key !== "Tab") return;
    const focusable: HTMLElement[] = [];
    const walk = (node: Element) => {
      if (
        node instanceof HTMLElement &&
        node.matches("button,a[href],input,select,textarea,[tabindex]") &&
        !node.matches(':disabled,[tabindex="-1"],[hidden]') &&
        node.getClientRects().length
      )
        focusable.push(node);
      const children =
        node instanceof HTMLSlotElement
          ? node.assignedElements({ flatten: true })
          : node.shadowRoot
            ? Array.from(node.shadowRoot.children)
            : Array.from(node.children);
      children.forEach(walk);
    };
    walk(this.renderRoot.querySelector("dialog")!);
    if (!focusable.length) return;
    const active = event.composedPath()[0];
    const index = focusable.indexOf(active as HTMLElement);
    if (event.shiftKey && index <= 0) {
      event.preventDefault();
      focusable.at(-1)!.focus();
    } else if (
      !event.shiftKey &&
      (index === focusable.length - 1 || index === -1)
    ) {
      event.preventDefault();
      focusable[0].focus();
    }
  }
  private pop = () => {
    if (this.open && history.state?.signalSheet !== this.sheetId)
      void this.finish();
  };
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("popstate", this.pop);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("popstate", this.pop);
    this.renderRoot.querySelector("dialog")?.close();
    if (history.state?.signalSheet === this.sheetId) {
      const state = { ...history.state };
      delete state.signalSheet;
      history.replaceState(state, "");
    }
  }
  protected updated(changed: PropertyValues) {
    if (changed.has("open")) {
      const dialog = this.renderRoot.querySelector("dialog")!;
      if (this.open && !dialog.open) {
        this.closeRequested = false;
        dialog.showModal();
        history.pushState({ ...history.state, signalSheet: this.sheetId }, "");
        if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
          dialog.animate(
            [
              { opacity: 0, transform: "translateY(35px) scale(.98)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 280, easing: "cubic-bezier(.16,1,.3,1)" },
          );
      } else if (!this.open && dialog.open) dialog.close();
    }
  }
  requestClose() {
    if (this.closing || this.closeRequested) return;
    this.closeRequested = true;
    if (history.state?.signalSheet === this.sheetId) history.back();
    else void this.finish();
  }
  private async finish() {
    if (this.closing) return;
    this.closing = true;
    const dialog = this.renderRoot.querySelector("dialog")!;
    if (dialog.open && !matchMedia("(prefers-reduced-motion: reduce)").matches)
      await dialog
        .animate(
          [
            { opacity: 1, transform: "none" },
            { opacity: 0, transform: "translateY(20px)" },
          ],
          { duration: 140, easing: "ease-in" },
        )
        .finished.catch(() => {});
    dialog.close();
    this.closing = false;
    this.dispatchEvent(
      new CustomEvent("signal-close", { bubbles: true, composed: true }),
    );
  }
  render() {
    return html`<dialog
      @keydown=${this.trapTab}
      class=${this.dark ? "dark" : ""}
      aria-labelledby="sheet-heading"
      @cancel=${(e: Event) => {
        e.preventDefault();
        this.requestClose();
      }}
      @click=${(e: MouseEvent) => {
        const d = e.currentTarget as HTMLDialogElement;
        const r = d.getBoundingClientRect();
        if (
          e.target === d &&
          (e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom)
        )
          this.requestClose();
      }}
    >
      <header
        @pointerdown=${(e: PointerEvent) => {
          if ((e.target as HTMLElement).closest("button")) return;
          this.startY = e.clientY;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        @pointerup=${(e: PointerEvent) => {
          if (
            (e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId) &&
            e.clientY - this.startY > 70
          )
            this.requestClose();
        }}
      >
        <span class="handle" aria-hidden="true"></span>
        <h2 id="sheet-heading">${this.heading}</h2>
        <button aria-label="Close details" @click=${() => this.requestClose()}>
          ${icon("close")}
        </button>
      </header>
      <div class="body"><slot></slot></div>
    </dialog>`;
  }
}
customElements.define("signal-sheet", SignalSheet);
