import type { Hass } from "./types";

type Bridge = NonNullable<NonNullable<Hass["auth"]>["external"]>;
let owner: ImmersiveChrome | undefined;

/** Temporary, client-only chrome. Never changes HA's selected/server theme. */
export class ImmersiveChrome {
  private style?: HTMLStyleElement;
  private metas = new Map<
    HTMLMetaElement,
    { previous: string | null; applied: string }
  >();
  private createdMeta?: HTMLMetaElement;
  private observer?: MutationObserver;
  private color = "";
  private bridge?: Bridge;
  private frame = 0;

  sync(dark: boolean, bridge?: Bridge) {
    if (owner && owner !== this) return;
    owner = this;
    const color = dark ? "#1a2320" : "#f4f3ee";
    const changed = this.color !== color || this.bridge !== bridge;
    this.bridge = bridge;
    if (!this.style) {
      this.style = document.createElement("style");
      this.style.dataset.signalChrome = "";
      document.head.append(this.style);
      this.observer = new MutationObserver(() => this.syncMeta());
      this.observer.observe(document.head, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["content", "name", "media"],
      });
    }
    if (!changed) return;
    this.color = color;
    const ink = dark ? "#f0f2e9" : "#222b28";
    // Companion apps read these variables on <html>, outside the card's shadow root.
    // A removable stylesheet leaves HA's own inline theme state untouched.
    this.style.textContent = `html {
      --app-header-background-color: ${color} !important;
      --app-header-text-color: ${ink} !important;
      --app-theme-color: ${color} !important;
      --primary-background-color: ${color} !important;
    }
    html, body { background-color: ${color} !important; }`;
    this.syncMeta();
    this.notify();
  }

  private syncMeta() {
    if (!this.style) return;
    let nodes = [
      ...document.head.querySelectorAll<HTMLMetaElement>(
        'meta[name="theme-color"]',
      ),
    ];
    if (!nodes.length) {
      this.createdMeta = document.createElement("meta");
      this.createdMeta.name = "theme-color";
      document.head.append(this.createdMeta);
      nodes = [this.createdMeta];
    }
    for (const node of nodes) {
      const record = this.metas.get(node);
      const previous =
        !record || node.content !== record.applied
          ? node.getAttribute("content")
          : record.previous;
      this.metas.set(node, { previous, applied: this.color });
      if (node.content !== this.color) node.content = this.color;
    }
  }

  private notify() {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => {
      try {
        // HA owns message IDs and the Android/iOS transport differences.
        this.bridge?.fireMessage({ type: "theme-update" });
      } catch {
        /* Older/closed native bridges must not break the dashboard. */
      }
    });
  }

  release() {
    if (owner !== this) return;
    owner = undefined;
    this.observer?.disconnect();
    this.style?.remove();
    this.style = undefined;
    for (const [node, { previous }] of this.metas) {
      if (node.content !== this.color) continue;
      if (previous === null) node.removeAttribute("content");
      else node.content = previous;
    }
    this.createdMeta?.remove();
    this.createdMeta = undefined;
    this.metas.clear();
    this.color = "";
    this.notify();
  }
}
