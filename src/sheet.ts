import { LitElement, html, css, type PropertyValues } from "lit";
import { icon } from "./icons";
import { motionStyles } from "./motion";

/** Native top-layer dialog: focus containment, inert background, and an owned Back entry. */
export class SignalSheet extends LitElement {
  static properties = {
    open: { type: Boolean },
    heading: { type: String },
    dark: { type: Boolean },
    compact: { type: Boolean },
  };
  static styles = [
    css`
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
      dialog.compact {
        position: fixed;
        inset: 0;
        margin: auto;
        width: min(420px, calc(100vw - 32px));
        border: 1px solid var(--line);
        border-radius: 28px;
      }
      dialog.compact .handle {
        display: none;
      }
      dialog.compact h2 {
        font-size: 22px;
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
        transition: transform 240ms var(--signal-ease);
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
    `,
    motionStyles,
  ];
  open = false;
  heading = "Details";
  dark = false;
  compact = false;
  // A history marker, not a security token. HA commonly runs on HTTP LAN URLs.
  private sheetId = `signal-sheet-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  private closing = false;
  private closeRequested = false;
  private startY = 0;
  private entryTransform = "translateY(12px)";
  private mobileSheet = false;
  private entryAnimation?: Animation;
  private backdropAnimation?: Animation;
  private exitAnimation?: Animation;
  private motionSequence = 0;
  private cancelMotion() {
    this.motionSequence++;
    this.entryAnimation?.cancel();
    this.backdropAnimation?.cancel();
    this.exitAnimation?.cancel();
  }
  private fadeBackdrop(
    dialog: HTMLDialogElement,
    from: string,
    to: string,
    duration: number,
    easing: string,
  ) {
    this.backdropAnimation?.cancel();
    // Keep the native top layer and focus trap; only animate its scrim.
    this.backdropAnimation = dialog.animate(
      [{ opacity: from }, { opacity: to }],
      {
        pseudoElement: "::backdrop",
        duration,
        easing,
        fill: "both",
      },
    );
  }
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
    this.cancelMotion();
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
        this.cancelMotion();
        const sequence = this.motionSequence;
        this.closing = false;
        this.closeRequested = false;
        this.mobileSheet =
          !this.compact && matchMedia("(max-width: 600px)").matches;
        this.entryTransform = this.mobileSheet
          ? "translateY(100%)"
          : "translateY(12px)";
        dialog.showModal();
        history.pushState({ ...history.state, signalSheet: this.sheetId }, "");
        const opened = () => {
          if (
            sequence === this.motionSequence &&
            this.open &&
            !this.closeRequested &&
            !this.closing
          )
            this.dispatchEvent(
              new CustomEvent("signal-opened", {
                bubbles: true,
                composed: true,
              }),
            );
        };
        if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
          const easing = "cubic-bezier(.2,.8,.2,1)";
          this.fadeBackdrop(dialog, "0", "1", 280, easing);
          this.entryAnimation = dialog.animate(
            [
              {
                opacity: this.mobileSheet ? 1 : 0,
                transform: this.entryTransform,
              },
              { opacity: 1, transform: "none" },
            ],
            { duration: 280, easing },
          );
          void this.entryAnimation.finished.then(opened, () => {});
        } else opened();
      } else if (!this.open && dialog.open) {
        this.cancelMotion();
        this.closing = false;
        dialog.close();
      }
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
    const current = getComputedStyle(dialog);
    const start = { opacity: current.opacity, transform: current.transform };
    const backdropOpacity = getComputedStyle(dialog, "::backdrop").opacity;
    const sequence = ++this.motionSequence;
    this.entryAnimation?.cancel();
    if (
      dialog.open &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const easing = "cubic-bezier(.4,0,1,1)";
      this.fadeBackdrop(dialog, backdropOpacity, "0", 200, easing);
      this.exitAnimation = dialog.animate(
        [
          start,
          { opacity: this.mobileSheet ? 1 : 0, transform: this.entryTransform },
        ],
        { duration: 200, easing, fill: "both" },
      );
      await this.exitAnimation.finished.catch(() => {});
    }
    if (sequence !== this.motionSequence || !this.isConnected) return;
    dialog.close();
    this.cancelMotion();
    this.closing = false;
    this.dispatchEvent(
      new CustomEvent("signal-close", { bubbles: true, composed: true }),
    );
  }
  render() {
    return html`<dialog
      @keydown=${this.trapTab}
      class=${[this.dark ? "dark" : "", this.compact ? "compact" : ""].filter(Boolean).join(" ")}
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
