const N = globalThis, Y = N.ShadowRoot && (N.ShadyCSS === void 0 || N.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Z = /* @__PURE__ */ Symbol(), tt = /* @__PURE__ */ new WeakMap();
let gt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== Z) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Y && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = tt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && tt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Et = (a) => new gt(typeof a == "string" ? a : a + "", void 0, Z), ft = (a, ...t) => {
  const e = a.length === 1 ? a[0] : t.reduce((i, s, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + a[o + 1], a[0]);
  return new gt(e, a, Z);
}, Ct = (a, t) => {
  if (Y) a.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = N.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, a.appendChild(i);
  }
}, et = Y ? (a) => a : (a) => a instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Et(e);
})(a) : a;
const { is: Mt, defineProperty: Tt, getOwnPropertyDescriptor: zt, getOwnPropertyNames: Pt, getOwnPropertySymbols: Ut, getPrototypeOf: Ot } = Object, I = globalThis, it = I.trustedTypes, Ht = it ? it.emptyScript : "", Rt = I.reactiveElementPolyfillSupport, z = (a, t) => a, F = { toAttribute(a, t) {
  switch (t) {
    case Boolean:
      a = a ? Ht : null;
      break;
    case Object:
    case Array:
      a = a == null ? a : JSON.stringify(a);
  }
  return a;
}, fromAttribute(a, t) {
  let e = a;
  switch (t) {
    case Boolean:
      e = a !== null;
      break;
    case Number:
      e = a === null ? null : Number(a);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(a);
      } catch {
        e = null;
      }
  }
  return e;
} }, bt = (a, t) => !Mt(a, t), st = { attribute: !0, type: String, converter: F, reflect: !1, useDefault: !1, hasChanged: bt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), I.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let E = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = st) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && Tt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: o } = zt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: s, set(n) {
      const d = s?.call(this);
      o?.call(this, n), this.requestUpdate(t, d, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? st;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const t = Ot(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const e = this.properties, i = [...Pt(e), ...Ut(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(et(s));
    } else t !== void 0 && e.push(et(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ct(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : F).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const o = i.getPropertyOptions(s), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : F;
      this._$Em = s;
      const d = n.fromAttribute(e, o.type);
      this[s] = d ?? this._$Ej?.get(s) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (s === !1 && (o = this[t]), i ??= n.getPropertyOptions(t), !((i.hasChanged ?? bt)(o, e) || i.useDefault && i.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: o }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [s, o] of this._$Ep) this[s] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, o] of i) {
        const { wrapped: n } = o, d = this[s];
        n !== !0 || this._$AL.has(s) || d === void 0 || this.C(s, void 0, o, d);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[z("elementProperties")] = /* @__PURE__ */ new Map(), E[z("finalized")] = /* @__PURE__ */ new Map(), Rt?.({ ReactiveElement: E }), (I.reactiveElementVersions ??= []).push("2.1.2");
const K = globalThis, at = (a) => a, L = K.trustedTypes, ot = L ? L.createPolicy("lit-html", { createHTML: (a) => a }) : void 0, xt = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, vt = "?" + y, Nt = `<${vt}>`, A = document, P = () => A.createComment(""), U = (a) => a === null || typeof a != "object" && typeof a != "function", G = Array.isArray, Lt = (a) => G(a) || typeof a?.[Symbol.iterator] == "function", W = `[ 	
\f\r]`, T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, nt = /-->/g, rt = />/g, $ = RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), lt = /'/g, dt = /"/g, yt = /^(?:script|style|textarea|title)$/i, $t = (a) => (t, ...e) => ({ _$litType$: a, strings: t, values: e }), l = $t(1), It = $t(2), x = /* @__PURE__ */ Symbol.for("lit-noChange"), p = /* @__PURE__ */ Symbol.for("lit-nothing"), ct = /* @__PURE__ */ new WeakMap(), _ = A.createTreeWalker(A, 129);
function wt(a, t) {
  if (!G(a) || !a.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ot !== void 0 ? ot.createHTML(t) : t;
}
const Dt = (a, t) => {
  const e = a.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = T;
  for (let d = 0; d < e; d++) {
    const r = a[d];
    let h, u, c = -1, b = 0;
    for (; b < r.length && (n.lastIndex = b, u = n.exec(r), u !== null); ) b = n.lastIndex, n === T ? u[1] === "!--" ? n = nt : u[1] !== void 0 ? n = rt : u[2] !== void 0 ? (yt.test(u[2]) && (s = RegExp("</" + u[2], "g")), n = $) : u[3] !== void 0 && (n = $) : n === $ ? u[0] === ">" ? (n = s ?? T, c = -1) : u[1] === void 0 ? c = -2 : (c = n.lastIndex - u[2].length, h = u[1], n = u[3] === void 0 ? $ : u[3] === '"' ? dt : lt) : n === dt || n === lt ? n = $ : n === nt || n === rt ? n = T : (n = $, s = void 0);
    const f = n === $ && a[d + 1].startsWith("/>") ? " " : "";
    o += n === T ? r + Nt : c >= 0 ? (i.push(h), r.slice(0, c) + xt + r.slice(c) + y + f) : r + y + (c === -2 ? d : f);
  }
  return [wt(a, o + (a[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class O {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let o = 0, n = 0;
    const d = t.length - 1, r = this.parts, [h, u] = Dt(t, e);
    if (this.el = O.createElement(h, i), _.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = _.nextNode()) !== null && r.length < d; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(xt)) {
          const b = u[n++], f = s.getAttribute(c).split(y), k = /([.?@])?(.*)/.exec(b);
          r.push({ type: 1, index: o, name: k[2], strings: f, ctor: k[1] === "." ? Bt : k[1] === "?" ? Wt : k[1] === "@" ? qt : D }), s.removeAttribute(c);
        } else c.startsWith(y) && (r.push({ type: 6, index: o }), s.removeAttribute(c));
        if (yt.test(s.tagName)) {
          const c = s.textContent.split(y), b = c.length - 1;
          if (b > 0) {
            s.textContent = L ? L.emptyScript : "";
            for (let f = 0; f < b; f++) s.append(c[f], P()), _.nextNode(), r.push({ type: 2, index: ++o });
            s.append(c[b], P());
          }
        }
      } else if (s.nodeType === 8) if (s.data === vt) r.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(y, c + 1)) !== -1; ) r.push({ type: 7, index: o }), c += y.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = A.createElement("template");
    return i.innerHTML = t, i;
  }
}
function M(a, t, e = a, i) {
  if (t === x) return t;
  let s = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const o = U(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== o && (s?._$AO?.(!1), o === void 0 ? s = void 0 : (s = new o(a), s._$AT(a, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = s : e._$Cl = s), s !== void 0 && (t = M(a, s._$AS(a, t.values), s, i)), t;
}
class jt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, s = (t?.creationScope ?? A).importNode(e, !0);
    _.currentNode = s;
    let o = _.nextNode(), n = 0, d = 0, r = i[0];
    for (; r !== void 0; ) {
      if (n === r.index) {
        let h;
        r.type === 2 ? h = new H(o, o.nextSibling, this, t) : r.type === 1 ? h = new r.ctor(o, r.name, r.strings, this, t) : r.type === 6 && (h = new Ft(o, this, t)), this._$AV.push(h), r = i[++d];
      }
      n !== r?.index && (o = _.nextNode(), n++);
    }
    return _.currentNode = A, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class H {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = M(this, t, e), U(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== x && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Lt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = O.createElement(wt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(e);
    else {
      const o = new jt(s, this), n = o.u(this.options);
      o.p(e), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = ct.get(t.strings);
    return e === void 0 && ct.set(t.strings, e = new O(t)), e;
  }
  k(t) {
    G(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const o of t) s === e.length ? e.push(i = new H(this.O(P()), this.O(P()), this, this.options)) : i = e[s], i._$AI(o), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = at(t).nextSibling;
      at(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class D {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, o) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = p;
  }
  _$AI(t, e = this, i, s) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = M(this, t, e, 0), n = !U(t) || t !== this._$AH && t !== x, n && (this._$AH = t);
    else {
      const d = t;
      let r, h;
      for (t = o[0], r = 0; r < o.length - 1; r++) h = M(this, d[i + r], e, r), h === x && (h = this._$AH[r]), n ||= !U(h) || h !== this._$AH[r], h === p ? t = p : t !== p && (t += (h ?? "") + o[r + 1]), this._$AH[r] = h;
    }
    n && !s && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Bt extends D {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Wt extends D {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class qt extends D {
  constructor(t, e, i, s, o) {
    super(t, e, i, s, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = M(this, t, e, 0) ?? p) === x) return;
    const i = this._$AH, s = t === p && i !== p || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== p && (i === p || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ft {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    M(this, t);
  }
}
const Vt = K.litHtmlPolyfillSupport;
Vt?.(O, H), (K.litHtmlVersions ??= []).push("3.3.3");
const Yt = (a, t, e) => {
  const i = e?.renderBefore ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = e?.renderBefore ?? null;
    i._$litPart$ = s = new H(t.insertBefore(P(), o), o, void 0, e ?? {});
  }
  return s._$AI(a), s;
};
const J = globalThis;
let C = class extends E {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Yt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return x;
  }
};
C._$litElement$ = !0, C.finalized = !0, J.litElementHydrateSupport?.({ LitElement: C });
const Zt = J.litElementPolyfillSupport;
Zt?.({ LitElement: C });
(J.litElementVersions ??= []).push("4.2.2");
const S = { ATTRIBUTE: 1, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, _t = (a) => (...t) => ({ _$litDirective$: a, values: t });
let At = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, i) {
    this._$Ct = t, this._$AM = e, this._$Ci = i;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
};
const Kt = (a) => a.strings === void 0, Gt = {}, kt = (a, t = Gt) => a._$AH = t;
const pt = _t(class extends At {
  constructor() {
    super(...arguments), this.key = p;
  }
  render(a, t) {
    return this.key = a, t;
  }
  update(a, [t, e]) {
    return t !== this.key && (kt(a), this.key = t), e;
  }
});
const ht = _t(class extends At {
  constructor(a) {
    if (super(a), a.type !== S.PROPERTY && a.type !== S.ATTRIBUTE && a.type !== S.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!Kt(a)) throw Error("`live` bindings can only contain a single expression");
  }
  render(a) {
    return a;
  }
  update(a, [t]) {
    if (t === x || t === p) return t;
    const e = a.element, i = a.name;
    if (a.type === S.PROPERTY) {
      if (t === e[i]) return x;
    } else if (a.type === S.BOOLEAN_ATTRIBUTE) {
      if (!!t === e.hasAttribute(i)) return x;
    } else if (a.type === S.ATTRIBUTE && e.getAttribute(i) === t + "") return x;
    return kt(a), t;
  }
}), Jt = ft`
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
    width: 34px;
    height: 34px;
    padding: 7px;
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
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
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
    .bottom-nav button {
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
      background: var(--mint);
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
      min-height: 40px;
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
`, ut = {
  home: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
  climate: "M9 14.5V5a3 3 0 0 1 6 0v9.5a5 5 0 1 1-6 0ZM12 9v9",
  shield: "M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7ZM8 12l3 3 5-6",
  list: "M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  sun: "M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  moon: "M20 14a9 9 0 0 1-10-10A9 9 0 1 0 20 14Z",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  check: "m5 12 4 4L19 6",
  drop: "M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z",
  close: "m6 6 12 12M6 18 18 6",
  power: "M12 2v10M6 5a9 9 0 1 0 12 0",
  bulb: "M9 18h6M9 21h6M8 15a7 7 0 1 1 8 0l-1 3H9Z",
  settings: "M4 7h16M4 17h16M8 4v6M16 14v6",
  wind: "M3 8h13a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h6a3 3 0 1 1-3 3",
  warn: "m12 3 10 18H2ZM12 9v5M12 17v.5"
}, m = (a) => It`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${ut[a] || ut.home}></path></svg>`, w = (a) => !!a && !["unknown", "unavailable"].includes(a.state), g = (a) => a != null && a !== "" && Number.isFinite(Number(a)) ? Number(a) : void 0, R = (a) => a === "partlycloudy" ? "Partly cloudy" : (a || "Unavailable").replaceAll("_", " ").replaceAll("-", " "), mt = (a) => typeof a == "string" ? { entity: a } : a;
class Xt extends C {
  constructor() {
    super(...arguments), this.config = { type: "custom:signal-home" };
  }
  static {
    this.properties = { hass: { attribute: !1 }, config: { state: !0 } };
  }
  static {
    this.styles = ft`
    :host {
      display: block;
    }
    p {
      line-height: 1.6;
      color: var(--secondary-text-color);
    }
    details {
      margin: 18px 0;
    }
    summary {
      cursor: pointer;
      padding: 12px 0;
    }
    textarea {
      width: 100%;
      min-height: 120px;
      font: 13px monospace;
      padding: 12px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 10px;
    }
    .error {
      color: var(--error-color);
    }
  `;
  }
  setConfig(t) {
    this.config = t;
  }
  change(t) {
    this.config = t, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    const t = [
      { name: "title", selector: { text: {} } },
      { name: "greeting", selector: { text: {} } },
      {
        name: "appearance",
        selector: {
          select: {
            options: [
              { value: "auto", label: "Follow system" },
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" }
            ]
          }
        }
      },
      ...["climate", "weather", "todo"].map((e) => ({
        name: e,
        selector: { entity: { domain: e } }
      })),
      { name: "humidity", selector: { entity: { domain: "sensor" } } },
      { name: "favorites", selector: { entity: { multiple: !0 } } }
    ];
    return l`<p>
        <strong>Welcome to Signal.</strong> Select your entities below. For the
        full experience, use this card in a <strong>Panel</strong> view.
        Appearance can also be changed with the dashboard’s sun/moon button.
      </p>
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${t}
        .computeLabel=${(e) => ({ todo: "Grocery list", greeting: "Custom greeting (optional)", favorites: "Shortcut entities", humidity: "Humidity sensor (optional)" })[e.name] || e.name[0].toUpperCase() + e.name.slice(1)}
        @value-changed=${(e) => this.change({ ...this.config, ...e.detail.value })}
      ></ha-form>
      <details>
        <summary>Safety sensors</summary>
        <p>
          Add entity IDs using the selector. Optional display names and battery
          entities can be configured in YAML.
        </p>
        <ha-form
          .hass=${this.hass}
          .data=${{ sensor_entities: (this.config.sensors || []).map((e) => typeof e == "string" ? e : e.entity) }}
          .schema=${[{ name: "sensor_entities", selector: { entity: { domain: "binary_sensor", multiple: !0 } } }]}
          .computeLabel=${() => "Sensors"}
          @value-changed=${(e) => {
      const i = e.detail.value.sensor_entities || [];
      this.change({
        ...this.config,
        sensors: i.map(
          (s) => (this.config.sensors || []).find(
            (o) => (typeof o == "string" ? o : o.entity) === s
          ) || s
        )
      });
    }}
        ></ha-form>
      </details>`;
  }
}
customElements.get("signal-home-editor") || customElements.define("signal-home-editor", Xt);
const q = [
  { id: "home", name: "Overview", icon: "home" },
  { id: "climate", name: "Climate", icon: "climate" },
  { id: "safety", name: "Safety", icon: "shield" },
  { id: "lists", name: "Lists", icon: "list" }
], Qt = {
  off: "Off",
  heat: "Heat",
  cool: "Cool",
  heat_cool: "Auto",
  auto: "Auto",
  dry: "Dry",
  fan_only: "Fan"
};
class te extends C {
  constructor() {
    super(...arguments), this.config = { type: "custom:signal-home" }, this.tab = "home", this.dark = !1, this.todos = [], this.rangeSide = "low", this.syncRoute = () => {
      const t = location.hash.replace("#signal/", "");
      this.tab = q.some((e) => e.id === t) ? t : "home";
    }, this.todoError = "", this.busy = !1, this.message = "", this.draft = "", this.todoSequence = 0, this.todoSignature = "", this.todoLoading = !1, this.media = window.matchMedia("(prefers-color-scheme: dark)"), this.applyAppearance = () => {
      let t = null;
      try {
        t = localStorage.getItem(this.appearanceKey);
      } catch {
      }
      const e = t || this.config.appearance || "auto";
      this.dark = e === "dark" || e === "auto" && this.media.matches;
    };
  }
  static {
    this.properties = {
      hass: { attribute: !1 },
      config: { state: !0 },
      tab: { state: !0 },
      dark: { state: !0 },
      todos: { state: !0 },
      todoError: { state: !0 },
      busy: { state: !0 },
      message: { state: !0 },
      draft: { state: !0 },
      rangeSide: { state: !0 }
    };
  }
  static {
    this.styles = Jt;
  }
  get appearanceKey() {
    return `signal-home-appearance:${this.config.title || "Home"}`;
  }
  connectedCallback() {
    super.connectedCallback(), this.syncRoute(), window.addEventListener("popstate", this.syncRoute), window.addEventListener("hashchange", this.syncRoute), this.media.addEventListener("change", this.applyAppearance), this.applyAppearance(), this.clock = setInterval(() => {
      this.requestUpdate(), this.config.todo && this.loadTodos();
    }, 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("popstate", this.syncRoute), window.removeEventListener("hashchange", this.syncRoute), this.media.removeEventListener("change", this.applyAppearance), clearInterval(this.clock), clearTimeout(this.timer), this.todoSequence++;
  }
  setConfig(t) {
    if (!t || typeof t != "object")
      throw new Error("Signal Home needs a configuration.");
    for (const e of ["climate", "weather", "todo", "humidity"])
      if (t[e] && typeof t[e] != "string")
        throw new Error(`${e} must be an entity ID.`);
    if (t.sensors && (!Array.isArray(t.sensors) || t.sensors.some(
      (e) => !e || typeof mt(e).entity != "string"
    )))
      throw new Error(
        "Sensors must be entity IDs or objects containing entity."
      );
    if (t.favorites && (!Array.isArray(t.favorites) || t.favorites.some((e) => typeof e != "string")))
      throw new Error("Favorites must be entity IDs.");
    this.config = { ...t }, this.todoSignature = "", this.todoSequence++, this.todos = [], this.applyAppearance();
  }
  static getConfigElement() {
    return document.createElement("signal-home-editor");
  }
  static getStubConfig(t) {
    const e = (i) => Object.keys(t.states).find((s) => s.startsWith(`${i}.`));
    return {
      title: "Home",
      climate: e("climate"),
      weather: e("weather"),
      todo: e("todo"),
      appearance: "auto",
      sensors: []
    };
  }
  getCardSize() {
    return 12;
  }
  getGridOptions() {
    return { columns: "full", min_columns: 12 };
  }
  updated(t) {
    if ((t.has("hass") || t.has("config")) && this.config.todo && this.hass) {
      const e = `${this.config.todo}:${this.hass.states[this.config.todo]?.state}`;
      e !== this.todoSignature && (this.todoSignature = e, this.loadTodos());
    }
  }
  state(t) {
    return t ? this.hass?.states[t] : void 0;
  }
  format(t, e = 0) {
    const i = g(t);
    return i === void 0 ? "—" : new Intl.NumberFormat(this.hass?.locale?.language || void 0, {
      maximumFractionDigits: e
    }).format(i);
  }
  notify(t) {
    this.message = t, clearTimeout(this.timer), this.timer = setTimeout(() => this.message = "", 4500);
  }
  async service(t, e, i, s) {
    if (!(this.busy || !this.hass)) {
      this.busy = !0;
      try {
        await this.hass.callService(t, e, i), s && this.notify(s);
      } catch {
        this.notify(
          "That didn’t go through. Check the connection and try again."
        );
      } finally {
        this.busy = !1;
      }
    }
  }
  moreInfo(t) {
    t && this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  async loadTodos() {
    const t = this.config.todo;
    if (!t || !this.hass || this.todoLoading) return;
    this.todoLoading = !0;
    const e = ++this.todoSequence;
    try {
      const i = await this.hass.callWS({
        type: "call_service",
        domain: "todo",
        service: "get_items",
        service_data: { entity_id: t, status: ["needs_action"] },
        return_response: !0
      });
      e === this.todoSequence && (this.todos = i.response?.[t]?.items || [], this.todoError = "");
    } catch {
      e === this.todoSequence && (this.todoError = "Your list couldn’t be loaded. Tap to retry.");
    } finally {
      this.todoLoading = !1;
    }
  }
  async complete(t) {
    if (!this.busy) {
      this.busy = !0;
      try {
        await this.hass.callService("todo", "update_item", {
          entity_id: this.config.todo,
          item: t.uid,
          status: "completed"
        }), this.todos = this.todos.filter((e) => e.uid !== t.uid), this.notify("Checked off. Nicely done.");
      } catch {
        this.notify("Couldn’t update the list. Try again.");
      } finally {
        this.busy = !1;
      }
    }
  }
  async addTodo(t) {
    t.preventDefault();
    const e = this.draft.trim();
    if (!(!e || this.busy)) {
      this.busy = !0;
      try {
        await this.hass.callService("todo", "add_item", {
          entity_id: this.config.todo,
          item: e
        }), this.draft = "", await this.loadTodos();
      } catch {
        this.notify("Couldn’t add that item. Try again.");
      } finally {
        this.busy = !1;
      }
    }
  }
  toggleAppearance() {
    this.dark = !this.dark;
    try {
      localStorage.setItem(this.appearanceKey, this.dark ? "dark" : "light");
    } catch {
    }
  }
  resetAppearance() {
    try {
      localStorage.removeItem(this.appearanceKey);
    } catch {
    }
    this.applyAppearance(), this.notify("Using the dashboard’s appearance setting.");
  }
  navigate(t) {
    t !== this.tab && history.pushState(history.state, "", `#signal/${t}`), this.tab = t;
  }
  nav(t = !1) {
    return l`<nav
      class=${t ? "bottom-nav" : ""}
      aria-label=${t ? "Mobile navigation" : "Dashboard navigation"}
    >
      ${q.map((e) => l`<button aria-current=${this.tab === e.id ? "page" : p} @click=${() => this.navigate(e.id)}>${m(e.icon)}<span>${e.name}</span></button>`)}
    </nav>`;
  }
  get sensors() {
    return (this.config.sensors || []).map(mt);
  }
  get safetySummary() {
    const t = this.sensors, e = t.filter(
      (s) => this.state(s.entity)?.state === "on"
    ).length, i = t.filter((s) => !w(this.state(s.entity))).length;
    return {
      alarm: e,
      unknown: i,
      text: e ? `${e} sensor${e > 1 ? "s" : ""} need attention` : i ? `${i} sensor${i > 1 ? "s" : ""} unavailable` : t.length ? "Water sensors clear" : "Make yourself at home"
    };
  }
  climate() {
    const t = this.state(this.config.climate);
    if (!this.config.climate)
      return l`<section class="panel mint climate">
        <div class="panel-label">${m("climate")} Climate</div>
        <h2 style="margin-top:40px">Comfort starts here.</h2>
        <p>
          Choose a climate entity in the card editor to bring your home’s
          temperature into focus.
        </p>
      </section>`;
    const e = w(t), i = t?.attributes || {}, s = g(i.current_temperature), o = g(i.target_temp_low), n = g(i.target_temp_high), d = e && t.state === "heat_cool" && o !== void 0 && n !== void 0 && ((g(i.supported_features) ?? 0) & 2) !== 0, r = d ? this.rangeSide === "low" ? o : n : g(i.temperature), h = d && this.rangeSide === "high" ? o : g(i.min_temp) ?? 7, u = d && this.rangeSide === "low" ? n : g(i.max_temp) ?? 35, c = g(i.target_temp_step) || (this.hass?.config?.unit_system?.temperature === "°F" ? 1 : 0.5), b = this.hass?.config?.unit_system?.temperature || "°", f = r ?? s, k = f === void 0 ? 0 : Math.max(
      0,
      Math.min(
        1,
        (f - (g(i.min_temp) ?? 7)) / Math.max(
          1,
          (g(i.max_temp) ?? 35) - (g(i.min_temp) ?? 7)
        )
      )
    ), j = e && r !== void 0 && (d || ((g(i.supported_features) ?? 0) & 1) !== 0) && t.state !== "off", X = (v) => {
      if (!j || r === void 0) return;
      const B = Number(
        Math.max(h, Math.min(u, r + v)).toFixed(2)
      ), St = d ? {
        target_temp_low: this.rangeSide === "low" ? B : o,
        target_temp_high: this.rangeSide === "high" ? B : n
      } : { temperature: B };
      this.service("climate", "set_temperature", {
        entity_id: this.config.climate,
        ...St
      });
    }, Q = Array.isArray(i.hvac_modes) ? i.hvac_modes : [];
    return l`<section
      class="panel mint climate"
      aria-label="Climate control"
    >
      <div class="panel-top">
        <span class="panel-label">${m("climate")} Home climate</span
        ><button
          class="icon-button"
          aria-label="Climate details"
          @click=${() => this.moreInfo(this.config.climate)}
        >
          ${m("arrow")}
        </button>
      </div>
      <div class="dial">
        <svg class="dial-svg" viewBox="0 0 240 240" aria-hidden="true">
          <circle
            cx="120"
            cy="120"
            r="101"
            fill="none"
            stroke-width="5"
            stroke-dasharray="476 635"
            stroke-linecap="round"
            class="dial-track"
          />
          <circle
            cx="120"
            cy="120"
            r="101"
            fill="none"
            stroke-width="5"
            stroke-dasharray=${`${k * 476} 635`}
            stroke-linecap="round"
            class="dial-fill"
          />
        </svg>
        <div class="dial-center">
          <div class="dial-mode">
            ${e ? R(i.hvac_action || t.state) : "Unavailable"}
          </div>
          <div class="dial-value" aria-live="polite">
            ${pt(f, l`<span class="value-in">${e ? this.format(f, 1) : "—"}</span>`)}<sup
              >${b}</sup
            >
          </div>
          <div class="dial-caption">
            ${e ? d ? this.rangeSide === "low" ? "Heat below" : "Cool above" : r !== void 0 ? "Target temperature" : "Current temperature" : "Waiting for your thermostat"}
          </div>
        </div>
      </div>
      <div class="stepper">
        <button
          aria-label="Decrease target temperature"
          ?disabled=${!j || this.busy || r <= h}
          @click=${() => X(-c)}
        >
          ${m("minus")}</button
        ><span
          >${e ? `${this.format(s, 1)}${b} inside` : "No reading"}</span
        ><button
          aria-label="Increase target temperature"
          ?disabled=${!j || this.busy || r >= u}
          @click=${() => X(c)}
        >
          ${m("plus")}
        </button>
      </div>
      ${d ? l`<div class="range-tabs" aria-label="Temperature range"><button aria-pressed=${this.rangeSide === "low"} @click=${() => this.rangeSide = "low"}>Heat ${this.format(o, 1)}°</button><button aria-pressed=${this.rangeSide === "high"} @click=${() => this.rangeSide = "high"}>Cool ${this.format(n, 1)}°</button></div>` : p}
      <div class="climate-foot">
        <span
          >${m("drop")}
          ${this.format(this.state(this.config.humidity)?.state ?? i.current_humidity)}%
          humidity</span
        >${Q.length ? l`<select
                aria-label="HVAC mode"
                .value=${ht(t?.state || "")}
                ?disabled=${!e || this.busy}
                @change=${(v) => this.service("climate", "set_hvac_mode", { entity_id: this.config.climate, hvac_mode: v.target.value })}
              >
                ${Q.map((v) => l`<option value=${v} .selected=${ht(v === t?.state)}>${Qt[v] || R(v)}</option>`)}
              </select>` : p}
      </div>
    </section>`;
  }
  weather() {
    const t = this.state(this.config.weather), e = w(t), i = t?.attributes || {}, s = i.temperature_unit || this.hass?.config?.unit_system?.temperature || "°";
    return l`<section class="panel lilac weather">
      <div class="panel-top">
        <span class="panel-label">${m("sun")} Outside</span
        >${this.config.weather ? l`<button class="icon-button" aria-label="Weather details" @click=${() => this.moreInfo(this.config.weather)}>${m("arrow")}</button>` : p}
      </div>
      <div class="weather-content">
        <div>
          <div class="weather-temp">
            ${e ? this.format(i.temperature) : "—"}<span
              style="font-size:27px;vertical-align:top;position:relative;top:9px;letter-spacing:-1px"
              >${s}</span
            >
          </div>
          <div class="weather-condition">
            ${e ? R(t.state) : "Weather unavailable"}
          </div>
        </div>
        <div
          class=${`weather-art ${t?.state === "clear-night" ? "night" : ""} ${t?.state?.includes("rain") ? "rain" : ""}`}
          aria-hidden="true"
        >
          <div class="sun-disc"></div>
          ${["sunny", "clear-night"].includes(t?.state || "") ? p : l`<div class="cloud"></div>`}
        </div>
      </div>
      <div class="weather-details">
        <span>Humidity ${e ? this.format(i.humidity) : "—"}%</span
        ><span
          >Wind ${e ? this.format(i.wind_speed) : "—"}
          ${i.wind_speed_unit || ""}</span
        >
      </div>
    </section>`;
  }
  grocery(t = !1) {
    return l`<section class="panel apricot groceries">
      <div class="panel-top">
        <span class="panel-label">${m("list")} Groceries</span
        >${t ? l`<button class="icon-button" aria-label="Refresh groceries" @click=${() => this.loadTodos()}>${m("list")}</button>` : l`<button class="icon-button" aria-label="Open groceries" @click=${() => this.navigate("lists")}>${m("arrow")}</button>`}
      </div>
      ${this.config.todo ? this.todoError ? l`<button class="text-button" @click=${() => this.loadTodos()}>
                ${this.todoError}
              </button>` : l`<div class="list-preview">
                ${this.todos.length ? (t ? this.todos : this.todos.slice(0, 2)).map(
      (e) => l`<div class="todo-row">
                            <button
                              class="check-button"
                              ?disabled=${this.busy}
                              aria-label=${`Complete ${e.summary}`}
                              @click=${() => this.complete(e)}
                            >
                              <span class="check-box"></span></button
                            ><span>${e.summary}</span>
                          </div>`
    ) : l`<div class="empty">
                        ${this.todoLoading ? "Loading your list…" : "All caught up. Room for something good."}
                      </div>`}
              </div>` : l`<p class="empty">
              Select your to-do list in the card editor.
            </p>`}
      ${t && this.config.todo ? l`<form class="todo-form" @submit=${this.addTodo}><input aria-label="New grocery item" placeholder="Add something good…" maxlength="255" .value=${this.draft} @input=${(e) => this.draft = e.target.value} /><button aria-label="Add grocery item" ?disabled=${this.busy || !this.draft.trim()}>${m("plus")}</button></form>` : l`<button class="text-button" @click=${() => this.navigate("lists")}>${this.todos.length ? `${this.todos.length} things on your list` : "Open your list"} ${m("arrow")}</button>`}
    </section>`;
  }
  safety() {
    return this.sensors.length ? l`<div class="sensors">
      ${this.sensors.map((t) => {
      const e = this.state(t.entity), i = w(e), s = e?.state === "on", o = e?.attributes.device_class, n = i ? s ? o === "moisture" ? "Water detected" : o === "opening" || o === "door" || o === "window" ? "Open" : "Detected" : o === "moisture" ? "Dry" : o === "opening" || o === "door" || o === "window" ? "Closed" : "Clear" : "Unavailable", d = this.state(t.battery), r = w(d) ? g(d.state) : void 0;
      return l`<button
          class="sensor"
          @click=${() => this.moreInfo(t.entity)}
        >
          <div class="sensor-head">
            <span
              class=${`sensor-symbol ${i ? s ? "bad" : "" : "unknown"}`}
              >${m(i ? s ? "warn" : o === "moisture" ? "drop" : "shield" : "warn")}</span
            ><span class="sensor-state">${n}</span>
          </div>
          <div>
            <div class="sensor-name">
              ${t.name || e?.attributes.friendly_name || t.entity}
            </div>
            <div class="sensor-sub">
              ${t.battery ? r !== void 0 ? `${r}% battery${r < 20 ? " · Low battery" : ""}` : "Battery unavailable" : "Tap for details"}
            </div>
          </div>
        </button>`;
    })}
    </div>` : l`<div class="notice">
        Add your water, smoke, or opening sensors in the card editor. Their
        actual state will appear here.
      </div>`;
  }
  favorites() {
    return this.config.favorites?.length ? l`<div class="section-top">
        <h2>Your shortcuts</h2>
        <small>A little less effort.</small>
      </div>
      <div class="favorites">
        ${this.config.favorites.map((t) => {
      const e = this.state(t), i = t.split(".")[0], s = e?.state === "on", o = [
        "light",
        "switch",
        "fan",
        "input_boolean"
      ].includes(i);
      return l`<button
            class=${`favorite ${s ? "on" : ""}`}
            ?disabled=${!w(e) || this.busy}
            @click=${() => o ? this.service(i, "toggle", { entity_id: t }) : i === "scene" ? this.service("scene", "turn_on", { entity_id: t }) : this.moreInfo(t)}
          >
            ${m(i === "light" ? "bulb" : "power")}<strong
              >${e?.attributes.friendly_name || t}</strong
            ><small>${w(e) ? R(e.state) : "Unavailable"}</small>
          </button>`;
    })}
      </div>` : p;
  }
  content() {
    return this.tab === "climate" ? l`<div class="grid detail-grid">
        ${this.climate()}
        <div class="stack">
          ${this.weather()}
          <section class="panel lime">
            <div class="panel-label">${m("drop")} Inside humidity</div>
            <div class="metric">
              ${this.format(this.state(this.config.humidity)?.state ?? this.state(this.config.climate)?.attributes.current_humidity)}<small
                >%</small
              >
            </div>
            <p class="intro" style="color:inherit">
              A little perspective on your home’s comfort.
            </p>
          </section>
        </div>
      </div>` : this.tab === "safety" ? l`${this.safety()}
        <div class="notice" style="margin-top:20px">
          ${this.safetySummary.alarm ? "A sensor is reporting an active state. Open it for details." : this.safetySummary.unknown ? "An unavailable sensor cannot confirm the condition of its space." : "Tap any sensor for its history and details."}
        </div>` : this.tab === "lists" ? l`<div style="max-width:740px">${this.grocery(!0)}</div>` : l`<div class="grid">
        ${this.climate()}
        <div class="stack">${this.weather()}${this.grocery()}</div>
      </div>
      ${this.favorites()}
      <div class="section-top">
        <h2>Around the house</h2>
        <button class="text-button" @click=${() => this.navigate("safety")}>
          All sensors ${m("arrow")}
        </button>
      </div>
      ${this.safety()}`;
  }
  render() {
    if (!this.hass)
      return l`<div class="notice" role="status">Connecting to home…</div>`;
    const t = /* @__PURE__ */ new Date(), e = t.getHours(), i = this.config.greeting || `Good ${e < 12 ? "morning" : e < 18 ? "afternoon" : "evening"}.`, s = this.tab === "home" ? i : this.tab === "climate" ? "Just your temperature." : this.tab === "safety" ? "Peace of mind." : "Good things, listed.", o = this.tab === "home" ? "Your home, at a glance." : this.tab === "climate" ? "Find your comfortable." : this.tab === "safety" ? "A clear view of the things that matter." : "A little space for everyday essentials.", n = this.safetySummary;
    return l`<div class=${`app ${this.dark ? "dark" : ""}`}>
      <aside>
        <div class="sidebar-inner">
          <div class="brand">
            <span class="brand-mark" aria-hidden="true"
              ><i></i><i></i><i></i></span
            >signal<span style="font-weight:400">/</span>
          </div>
          <div class="eyebrow sidebar-label">Your place</div>
          ${this.nav()}
          <div class="sidebar-note">
            A little more connected.<span>A little more you.</span>
          </div>
        </div>
      </aside>
      <main>
        <header>
          <div class="eyebrow">
            ${this.config.title || "Home"}
            <span style="color:var(--muted);font-weight:400"
              >/ ${q.find((d) => d.id === this.tab)?.name}</span
            >
          </div>
          <div class="header-right">
            <span class="date"
              >${t.toLocaleDateString(this.hass.locale?.language || void 0, { weekday: "short", month: "short", day: "numeric" })}</span
            ><button
              class="icon-button"
              aria-label=${this.dark ? "Switch to light mode" : "Switch to dark mode"}
              @click=${this.toggleAppearance}
            >
              ${m(this.dark ? "sun" : "moon")}
            </button>
          </div>
        </header>
        <div class="page-heading">
          <div>
            <h1>${s}</h1>
            <p class="intro">${o}</p>
          </div>
          <div class=${`status-pill ${n.alarm ? "alert" : ""}`}>
            <span class="dot"></span>${n.text}
          </div>
        </div>
        ${pt(this.tab, l`<div class="page">${this.content()}</div>`)}
        <footer class="footer">
          <span
            >Signal Home <span style="opacity:.5">/</span> made for living</span
          ><button @click=${this.resetAppearance}>Reset appearance</button>
        </footer>
      </main>
      ${this.nav(!0)}${this.message ? l`<div class="toast" role="status">${this.message}</div>` : p}
    </div>`;
  }
}
customElements.get("signal-home") || customElements.define("signal-home", te);
const V = window;
V.customCards = V.customCards || [];
V.customCards.push({
  type: "signal-home",
  name: "Signal Home",
  description: "A colorful, fluid home dashboard with climate, weather, groceries and safety.",
  preview: !0,
  documentationURL: "https://github.com/gkgkgkgk/signal-home"
});
export {
  te as SignalHome
};
