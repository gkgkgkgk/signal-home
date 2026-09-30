const V = globalThis, ot = V.ShadowRoot && (V.ShadyCSS === void 0 || V.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, nt = /* @__PURE__ */ Symbol(), mt = /* @__PURE__ */ new WeakMap();
let Ht = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== nt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (ot && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = mt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && mt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Bt = (o) => new Ht(typeof o == "string" ? o : o + "", void 0, nt), S = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((i, s, n) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + o[n + 1], o[0]);
  return new Ht(e, o, nt);
}, Ft = (o, t) => {
  if (ot) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = V.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, o.appendChild(i);
  }
}, gt = ot ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Bt(e);
})(o) : o;
const { is: Yt, defineProperty: Wt, getOwnPropertyDescriptor: Zt, getOwnPropertyNames: Vt, getOwnPropertySymbols: Kt, getPrototypeOf: Gt } = Object, X = globalThis, ft = X.trustedTypes, Xt = ft ? ft.emptyScript : "", Jt = X.reactiveElementPolyfillSupport, F = (o, t) => o, at = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? Xt : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, t) {
  let e = o;
  switch (t) {
    case Boolean:
      e = o !== null;
      break;
    case Number:
      e = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(o);
      } catch {
        e = null;
      }
  }
  return e;
} }, Lt = (o, t) => !Yt(o, t), bt = { attribute: !0, type: String, converter: at, reflect: !1, useDefault: !1, hasChanged: Lt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), X.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let L = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = bt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && Wt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: n } = Zt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: s, set(a) {
      const d = s?.call(this);
      n?.call(this, a), this.requestUpdate(t, d, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? bt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(F("elementProperties"))) return;
    const t = Gt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(F("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(F("properties"))) {
      const e = this.properties, i = [...Vt(e), ...Kt(e)];
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
      for (const s of i) e.unshift(gt(s));
    } else t !== void 0 && e.push(gt(t));
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
    return Ft(t, this.constructor.elementStyles), t;
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
      const n = (i.converter?.toAttribute !== void 0 ? i.converter : at).toAttribute(e, i.type);
      this._$Em = t, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const n = i.getPropertyOptions(s), a = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : at;
      this._$Em = s;
      const d = a.fromAttribute(e, n.type);
      this[s] = d ?? this._$Ej?.get(s) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, n) {
    if (t !== void 0) {
      const a = this.constructor;
      if (s === !1 && (n = this[t]), i ??= a.getPropertyOptions(t), !((i.hasChanged ?? Lt)(n, e) || i.useDefault && i.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: n }, a) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), n !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [s, n] of this._$Ep) this[s] = n;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, n] of i) {
        const { wrapped: a } = n, d = this[s];
        a !== !0 || this._$AL.has(s) || d === void 0 || this.C(s, void 0, n, d);
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
L.elementStyles = [], L.shadowRootOptions = { mode: "open" }, L[F("elementProperties")] = /* @__PURE__ */ new Map(), L[F("finalized")] = /* @__PURE__ */ new Map(), Jt?.({ ReactiveElement: L }), (X.reactiveElementVersions ??= []).push("2.1.2");
const rt = globalThis, xt = (o) => o, K = rt.trustedTypes, vt = K ? K.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, Dt = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, Ut = "?" + C, Qt = `<${Ut}>`, H = document, Y = () => H.createComment(""), W = (o) => o === null || typeof o != "object" && typeof o != "function", lt = Array.isArray, te = (o) => lt(o) || typeof o?.[Symbol.iterator] == "function", et = `[ 	
\f\r]`, q = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, yt = /-->/g, $t = />/g, T = RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), wt = /'/g, kt = /"/g, It = /^(?:script|style|textarea|title)$/i, Nt = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), r = Nt(1), D = Nt(2), _ = /* @__PURE__ */ Symbol.for("lit-noChange"), h = /* @__PURE__ */ Symbol.for("lit-nothing"), _t = /* @__PURE__ */ new WeakMap(), O = H.createTreeWalker(H, 129);
function Pt(o, t) {
  if (!lt(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return vt !== void 0 ? vt.createHTML(t) : t;
}
const ee = (o, t) => {
  const e = o.length - 1, i = [];
  let s, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = q;
  for (let d = 0; d < e; d++) {
    const l = o[d];
    let p, u, c = -1, m = 0;
    for (; m < l.length && (a.lastIndex = m, u = a.exec(l), u !== null); ) m = a.lastIndex, a === q ? u[1] === "!--" ? a = yt : u[1] !== void 0 ? a = $t : u[2] !== void 0 ? (It.test(u[2]) && (s = RegExp("</" + u[2], "g")), a = T) : u[3] !== void 0 && (a = T) : a === T ? u[0] === ">" ? (a = s ?? q, c = -1) : u[1] === void 0 ? c = -2 : (c = a.lastIndex - u[2].length, p = u[1], a = u[3] === void 0 ? T : u[3] === '"' ? kt : wt) : a === kt || a === wt ? a = T : a === yt || a === $t ? a = q : (a = T, s = void 0);
    const f = a === T && o[d + 1].startsWith("/>") ? " " : "";
    n += a === q ? l + Qt : c >= 0 ? (i.push(p), l.slice(0, c) + Dt + l.slice(c) + C + f) : l + C + (c === -2 ? d : f);
  }
  return [Pt(o, n + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Z {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let n = 0, a = 0;
    const d = t.length - 1, l = this.parts, [p, u] = ee(t, e);
    if (this.el = Z.createElement(p, i), O.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = O.nextNode()) !== null && l.length < d; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(Dt)) {
          const m = u[a++], f = s.getAttribute(c).split(C), v = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: n, name: v[2], strings: f, ctor: v[1] === "." ? se : v[1] === "?" ? ae : v[1] === "@" ? oe : J }), s.removeAttribute(c);
        } else c.startsWith(C) && (l.push({ type: 6, index: n }), s.removeAttribute(c));
        if (It.test(s.tagName)) {
          const c = s.textContent.split(C), m = c.length - 1;
          if (m > 0) {
            s.textContent = K ? K.emptyScript : "";
            for (let f = 0; f < m; f++) s.append(c[f], Y()), O.nextNode(), l.push({ type: 2, index: ++n });
            s.append(c[m], Y());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Ut) l.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(C, c + 1)) !== -1; ) l.push({ type: 7, index: n }), c += C.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const i = H.createElement("template");
    return i.innerHTML = t, i;
  }
}
function I(o, t, e = o, i) {
  if (t === _) return t;
  let s = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const n = W(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== n && (s?._$AO?.(!1), n === void 0 ? s = void 0 : (s = new n(o), s._$AT(o, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = s : e._$Cl = s), s !== void 0 && (t = I(o, s._$AS(o, t.values), s, i)), t;
}
class ie {
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
    const { el: { content: e }, parts: i } = this._$AD, s = (t?.creationScope ?? H).importNode(e, !0);
    O.currentNode = s;
    let n = O.nextNode(), a = 0, d = 0, l = i[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let p;
        l.type === 2 ? p = new N(n, n.nextSibling, this, t) : l.type === 1 ? p = new l.ctor(n, l.name, l.strings, this, t) : l.type === 6 && (p = new ne(n, this, t)), this._$AV.push(p), l = i[++d];
      }
      a !== l?.index && (n = O.nextNode(), a++);
    }
    return O.currentNode = H, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class N {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
    t = I(this, t, e), W(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== _ && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : te(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && W(this._$AH) ? this._$AA.nextSibling.data = t : this.T(H.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Z.createElement(Pt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(e);
    else {
      const n = new ie(s, this), a = n.u(this.options);
      n.p(e), this.T(a), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = _t.get(t.strings);
    return e === void 0 && _t.set(t.strings, e = new Z(t)), e;
  }
  k(t) {
    lt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const n of t) s === e.length ? e.push(i = new N(this.O(Y()), this.O(Y()), this, this.options)) : i = e[s], i._$AI(n), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = xt(t).nextSibling;
      xt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class J {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, n) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = h;
  }
  _$AI(t, e = this, i, s) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) t = I(this, t, e, 0), a = !W(t) || t !== this._$AH && t !== _, a && (this._$AH = t);
    else {
      const d = t;
      let l, p;
      for (t = n[0], l = 0; l < n.length - 1; l++) p = I(this, d[i + l], e, l), p === _ && (p = this._$AH[l]), a ||= !W(p) || p !== this._$AH[l], p === h ? t = h : t !== h && (t += (p ?? "") + n[l + 1]), this._$AH[l] = p;
    }
    a && !s && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class se extends J {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class ae extends J {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class oe extends J {
  constructor(t, e, i, s, n) {
    super(t, e, i, s, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = I(this, t, e, 0) ?? h) === _) return;
    const i = this._$AH, s = t === h && i !== h || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== h && (i === h || s);
    s && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ne {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    I(this, t);
  }
}
const re = { I: N }, le = rt.litHtmlPolyfillSupport;
le?.(Z, N), (rt.litHtmlVersions ??= []).push("3.3.3");
const de = (o, t, e) => {
  const i = e?.renderBefore ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const n = e?.renderBefore ?? null;
    i._$litPart$ = s = new N(t.insertBefore(Y(), n), n, void 0, e ?? {});
  }
  return s._$AI(o), s;
};
const dt = globalThis;
let A = class extends L {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = de(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return _;
  }
};
A._$litElement$ = !0, A.finalized = !0, dt.litElementHydrateSupport?.({ LitElement: A });
const ce = dt.litElementPolyfillSupport;
ce?.({ LitElement: A });
(dt.litElementVersions ??= []).push("4.2.2");
const R = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, ct = (o) => (...t) => ({ _$litDirective$: o, values: t });
let ht = class {
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
const { I: he } = re, At = (o) => o, pe = (o) => o.strings === void 0, St = () => document.createComment(""), j = (o, t, e) => {
  const i = o._$AA.parentNode, s = t === void 0 ? o._$AB : t._$AA;
  if (e === void 0) {
    const n = i.insertBefore(St(), s), a = i.insertBefore(St(), s);
    e = new he(n, a, o, o.options);
  } else {
    const n = e._$AB.nextSibling, a = e._$AM, d = a !== o;
    if (d) {
      let l;
      e._$AQ?.(o), e._$AM = o, e._$AP !== void 0 && (l = o._$AU) !== a._$AU && e._$AP(l);
    }
    if (n !== s || d) {
      let l = e._$AA;
      for (; l !== n; ) {
        const p = At(l).nextSibling;
        At(i).insertBefore(l, s), l = p;
      }
    }
  }
  return e;
}, M = (o, t, e = o) => (o._$AI(t, e), o), ue = {}, pt = (o, t = ue) => o._$AH = t, me = (o) => o._$AH, it = (o) => {
  o._$AR(), o._$AA.remove();
};
const Et = ct(class extends ht {
  constructor() {
    super(...arguments), this.key = h;
  }
  render(o, t) {
    return this.key = o, t;
  }
  update(o, [t, e]) {
    return t !== this.key && (pt(o), this.key = t), e;
  }
});
const U = ct(class extends ht {
  constructor(o) {
    if (super(o), o.type !== R.PROPERTY && o.type !== R.ATTRIBUTE && o.type !== R.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!pe(o)) throw Error("`live` bindings can only contain a single expression");
  }
  render(o) {
    return o;
  }
  update(o, [t]) {
    if (t === _ || t === h) return t;
    const e = o.element, i = o.name;
    if (o.type === R.PROPERTY) {
      if (t === e[i]) return _;
    } else if (o.type === R.BOOLEAN_ATTRIBUTE) {
      if (!!t === e.hasAttribute(i)) return _;
    } else if (o.type === R.ATTRIBUTE && e.getAttribute(i) === t + "") return _;
    return pt(o), t;
  }
});
const Ct = (o, t, e) => {
  const i = /* @__PURE__ */ new Map();
  for (let s = t; s <= e; s++) i.set(o[s], s);
  return i;
}, Tt = ct(class extends ht {
  constructor(o) {
    if (super(o), o.type !== R.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(o, t, e) {
    let i;
    e === void 0 ? e = t : t !== void 0 && (i = t);
    const s = [], n = [];
    let a = 0;
    for (const d of o) s[a] = i ? i(d, a) : a, n[a] = e(d, a), a++;
    return { values: n, keys: s };
  }
  render(o, t, e) {
    return this.dt(o, t, e).values;
  }
  update(o, [t, e, i]) {
    const s = me(o), { values: n, keys: a } = this.dt(t, e, i);
    if (!Array.isArray(s)) return this.ut = a, n;
    const d = this.ut ??= [], l = [];
    let p, u, c = 0, m = s.length - 1, f = 0, v = n.length - 1;
    for (; c <= m && f <= v; ) if (s[c] === null) c++;
    else if (s[m] === null) m--;
    else if (d[c] === a[f]) l[f] = M(s[c], n[f]), c++, f++;
    else if (d[m] === a[v]) l[v] = M(s[m], n[v]), m--, v--;
    else if (d[c] === a[v]) l[v] = M(s[c], n[v]), j(o, l[v + 1], s[c]), c++, v--;
    else if (d[m] === a[f]) l[f] = M(s[m], n[f]), j(o, s[c], s[m]), m--, f++;
    else if (p === void 0 && (p = Ct(a, f, v), u = Ct(d, c, m)), p.has(d[c])) if (p.has(d[m])) {
      const b = u.get(a[f]), x = b !== void 0 ? s[b] : null;
      if (x === null) {
        const w = j(o, s[c]);
        M(w, n[f]), l[f] = w;
      } else l[f] = M(x, n[f]), j(o, s[c], x), s[b] = null;
      f++;
    } else it(s[m]), m--;
    else it(s[c]), c++;
    for (; f <= v; ) {
      const b = j(o, l[v + 1]);
      M(b, n[f]), l[f++] = b;
    }
    for (; c <= m; ) {
      const b = s[c++];
      b !== null && it(b);
    }
    return this.ut = a, pt(o, l), _;
  }
}), ge = S`
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
  .sheet-custom .value-in {
    animation: none;
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
`, fe = S`
  .list-tile .tile-label {
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
    flex: 1;
  }
  .groceries .panel-label {
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .groceries .panel-top > button {
    flex-shrink: 0;
  }
  .list-switcher {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 0 0 18px;
  }
  .list-switcher button {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 48px;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--ink);
    padding: 12px 14px;
    border-radius: 18px;
    max-width: 100%;
    font-size: 13px;
  }
  .list-switcher button[aria-pressed="true"] {
    background: var(--ink);
    color: var(--paper);
    border-color: var(--ink);
  }
  .list-switcher button > span {
    overflow-wrap: anywhere;
    text-align: left;
    font-weight: 650;
  }
  .list-switcher svg {
    width: 18px;
    height: 18px;
  }
  .list-switcher small {
    border-radius: 8px;
    padding: 2px 7px;
    background: #899a8924;
    white-space: nowrap;
  }
  .delete-confirmation .delete-list-name {
    margin-top: 0;
    font-size: 12px;
  }
  .groceries {
    overflow-anchor: none;
  }
  .todo-label {
    flex: 1;
    min-width: 0;
    padding: 12px 0;
  }
  .todo-trash {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 14px;
    background: transparent;
    color: inherit;
    opacity: 0.65;
    transition:
      background 160ms ease,
      opacity 160ms ease,
      transform 160ms ease;
  }
  .todo-trash svg {
    width: 18px;
    height: 18px;
  }
  .todo-trash:not(:disabled):hover,
  .todo-trash:focus-visible {
    background: #51352012;
    opacity: 1;
  }
  .todo-trash:not(:disabled):active {
    background: #51352020;
    transform: scale(0.9);
  }
  .delete-confirmation {
    color: var(--ink);
  }
  .delete-symbol {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 16px;
    color: #9c342c;
    background: #f9d8d1;
  }
  .delete-symbol svg {
    width: 24px;
    height: 24px;
  }
  .delete-confirmation p {
    font-size: 14px;
    line-height: 1.55;
    color: var(--muted);
  }
  .delete-confirmation .delete-item {
    color: var(--ink);
    font-size: 21px;
    font-weight: 650;
    line-height: 1.3;
    overflow-wrap: anywhere;
    margin: 18px 0 8px;
  }
  .delete-actions {
    display: flex;
    gap: 10px;
    margin-top: 24px;
  }
  .delete-actions button {
    min-height: 48px;
    flex: 1;
    padding: 10px 14px;
    border-radius: 16px;
    border: 1px solid var(--line);
    background: transparent;
    color: var(--ink);
    font-size: 13px;
    font-weight: 650;
  }
  .delete-actions .delete-accept {
    background: #a53730;
    border-color: #a53730;
    color: #fff7f3;
  }
  .delete-confirmation .delete-error {
    color: #a53730;
  }
  .dark .delete-actions .delete-accept {
    background: #f6a99d;
    border-color: #f6a99d;
    color: #4a1c19;
  }
  .dark .delete-confirmation .delete-error {
    color: #f6a99d;
  }
  .header-context {
    min-width: 0;
    flex: 1;
  }
  .header-title {
    display: block;
    font-size: 17px;
    font-weight: 650;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .header-subtitle {
    display: block;
    font-size: 11px;
    color: var(--muted);
    margin-top: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .appearance-setting {
    display: grid;
    gap: 10px;
    padding: 16px 0;
    font-weight: 600;
  }
  .appearance-setting select {
    min-height: 48px;
    border-radius: 14px;
    border: 1px solid var(--line);
    padding: 12px;
    background: var(--surface);
    color: var(--ink);
    font: inherit;
    width: 100%;
    max-width: none;
  }
  .appearance-setting small {
    font-size: 12px;
    font-weight: 400;
    color: var(--muted);
    line-height: 1.5;
  }
  .completed-list {
    margin-top: 24px;
    border-top: 1px solid #51352025;
    padding-top: 18px;
  }
  .completed-list h3 {
    font-size: 16px;
    margin: 0;
  }
  .completed-list h3 span {
    font-size: 12px;
    font-weight: 400;
    margin-left: 8px;
  }
  .completed-list p,
  .completed-list > small {
    font-size: 12px;
    line-height: 1.5;
  }
  .completed-row > span {
    text-decoration: line-through;
    opacity: 0.7;
  }
  .completed-row .check-box {
    display: grid;
    place-items: center;
    background: #513520;
    color: #f7cfac;
  }
  .completed-row svg {
    width: 15px;
    height: 15px;
  }
  .completed-list summary {
    cursor: pointer;
    min-height: 48px;
    align-content: center;
    font-size: 13px;
    font-weight: 600;
  }
  .toast {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .toast button {
    background: transparent;
    border: 0;
    color: inherit;
    font: inherit;
    font-weight: 700;
    text-decoration: underline;
    min-height: 44px;
    padding: 0 8px;
  }
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
      box-shadow: 0 1px 0 color-mix(in srgb, var(--line) 45%, transparent);
    }
    header::after {
      content: "";
      position: absolute;
      inset: 100% 0 auto;
      height: 24px;
      background: linear-gradient(
        to bottom,
        var(--paper),
        color-mix(in srgb, var(--paper) 65%, transparent) 35%,
        transparent
      );
      opacity: 0;
      pointer-events: none;
      transition: opacity 180ms ease;
    }
    header.scrolled::after {
      opacity: 1;
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
    header::after,
    .nav-indicator {
      transition: none !important;
    }
    .pocket-tile:active:not(:disabled),
    .pocket-tile:hover {
      transform: none !important;
    }
  }
`, Q = S`
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
`, be = S`
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
let B;
class xe {
  constructor() {
    this.metas = /* @__PURE__ */ new Map(), this.color = "", this.frame = 0;
  }
  sync(t, e) {
    if (B && B !== this) return;
    B = this;
    const i = t ? "#1a2320" : "#f4f3ee", s = this.color !== i || this.bridge !== e;
    if (this.bridge = e, this.style || (this.style = document.createElement("style"), this.style.dataset.signalChrome = "", document.head.append(this.style), this.observer = new MutationObserver(() => this.syncMeta()), this.observer.observe(document.head, {
      subtree: !0,
      childList: !0,
      attributes: !0,
      attributeFilter: ["content", "name", "media"]
    })), !s) return;
    this.color = i;
    const n = t ? "#f0f2e9" : "#222b28";
    this.style.textContent = `html {
      --app-header-background-color: ${i} !important;
      --app-header-text-color: ${n} !important;
      --app-theme-color: ${i} !important;
      --primary-background-color: ${i} !important;
    }
    html, body { background-color: ${i} !important; }`, this.syncMeta(), this.notify();
  }
  syncMeta() {
    if (!this.style) return;
    let t = [
      ...document.head.querySelectorAll(
        'meta[name="theme-color"]'
      )
    ];
    t.length || (this.createdMeta = document.createElement("meta"), this.createdMeta.name = "theme-color", document.head.append(this.createdMeta), t = [this.createdMeta]);
    for (const e of t) {
      const i = this.metas.get(e), s = !i || e.content !== i.applied ? e.getAttribute("content") : i.previous;
      this.metas.set(e, { previous: s, applied: this.color }), e.content !== this.color && (e.content = this.color);
    }
  }
  notify() {
    cancelAnimationFrame(this.frame), this.frame = requestAnimationFrame(() => {
      try {
        this.bridge?.fireMessage({ type: "theme-update" });
      } catch {
      }
    });
  }
  release() {
    if (B === this) {
      B = void 0, this.observer?.disconnect(), this.style?.remove(), this.style = void 0;
      for (const [t, { previous: e }] of this.metas)
        t.content === this.color && (e === null ? t.removeAttribute("content") : t.content = e);
      this.createdMeta?.remove(), this.createdMeta = void 0, this.metas.clear(), this.color = "", this.notify();
    }
  }
}
const Mt = [
  "auto",
  "system",
  "light",
  "dark"
];
function qt(o, t) {
  try {
    return Number(
      new Intl.DateTimeFormat("en-GB", {
        hour: "numeric",
        hourCycle: "h23",
        timeZone: t
      }).format(o)
    );
  } catch {
    return o.getHours();
  }
}
function ve(o, t, e, i) {
  if (o === "system") return t;
  if (o !== "auto") return o === "dark";
  const s = qt(e, i);
  return s < 7 || s >= 19;
}
const zt = {
  trash: "M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6",
  music: "M9 18V5l12-3v13M9 7l12-3M9 18a3 3 0 1 1-3-3c1.5 0 3 1 3 3ZM21 15a3 3 0 1 1-3-3c1.5 0 3 1 3 3Z",
  cover: "M4 3h16v18H4ZM4 7h16M4 11h16M4 15h16",
  lock: "M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5ZM12 14v3",
  up: "m6 15 6-6 6 6",
  down: "m6 9 6 6 6-6",
  stop: "M6 6h12v12H6Z",
  play: "m8 4 12 8-12 8Z",
  pause: "M8 4v16M16 4v16",
  previous: "M5 4v16M19 4 7 12l12 8Z",
  next: "M19 4v16M5 4l12 8-12 8Z",
  graph: "M3 3v18h18M5 16l5-6 4 3 6-8",
  home: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
  climate: "M9 14.5V5a3 3 0 0 1 6 0v9.5a5 5 0 1 1-6 0ZM12 9v9",
  shield: "M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7ZM8 12l3 3 5-6",
  list: "M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  sun: "M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  moon: "M20 14a9 9 0 0 1-10-10A9 9 0 1 0 20 14Z",
  cloud: "M6 19a4 4 0 0 1-1-7.87A7 7 0 0 1 18.7 10a4.5 4.5 0 0 1-.2 9Z",
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
}, g = (o) => D`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${zt[o] || zt.home}></path></svg>`, $ = (o) => !!o && !["unknown", "unavailable"].includes(o.state), y = (o) => o != null && o !== "" && Number.isFinite(Number(o)) ? Number(o) : void 0, k = (o) => o === "partlycloudy" ? "Partly cloudy" : (o || "Unavailable").replaceAll("_", " ").replaceAll("-", " "), Rt = (o) => typeof o == "string" ? { entity: o } : o;
class ye extends A {
  constructor() {
    super(...arguments), this.config = { type: "custom:signal-home" };
  }
  static {
    this.properties = { hass: { attribute: !1 }, config: { state: !0 } };
  }
  static {
    this.styles = S`
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
      { name: "header_label", selector: { text: {} } },
      {
        name: "appearance",
        selector: {
          select: {
            options: [
              { value: "auto", label: "Auto · light 7am–7pm, dark overnight" },
              { value: "system", label: "System · device default" },
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
    return r`<p>
        <strong>Welcome to Signal.</strong> Select your entities below. For the
        full experience, use this card in a <strong>Panel</strong> view.
        Appearance can also be changed in Signal's settings menu. The header
        label can be a home nickname or address; leave it empty for a time-based
        greeting.
      </p>
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${t}
        .computeLabel=${(e) => ({ todo: "Default to-do list (all lists are available)", greeting: "Custom greeting (optional)", favorites: "Shortcut entities", humidity: "Humidity sensor (optional)" })[e.name] || e.name[0].toUpperCase() + e.name.slice(1)}
        @value-changed=${(e) => this.change({ ...this.config, ...e.detail.value })}
      ></ha-form>
      <details>
        <summary>History graphs</summary>
        <p>Add numeric sensor histories to the Climate view.</p>
        <ha-form
          .hass=${this.hass}
          .data=${{ graph_entities: (this.config.graphs || []).map((e) => typeof e == "string" ? e : e.entity) }}
          .schema=${[{ name: "graph_entities", selector: { entity: { domain: "sensor", multiple: !0 } } }]}
          .computeLabel=${() => "History sensors"}
          @value-changed=${(e) => this.change({ ...this.config, graphs: (e.detail.value.graph_entities || []).map((i) => (this.config.graphs || []).find((s) => (typeof s == "string" ? s : s.entity) === i) || i) })}
        ></ha-form>
      </details>
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
            (n) => (typeof n == "string" ? n : n.entity) === s
          ) || s
        )
      });
    }}
        ></ha-form>
      </details>`;
  }
}
customElements.get("signal-home-editor") || customElements.define("signal-home-editor", ye);
const ut = S`
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
class $e extends A {
  constructor() {
    super(...arguments), this.open = !1, this.heading = "Details", this.dark = !1, this.compact = !1, this.sheetId = `signal-sheet-${Date.now()}-${Math.random().toString(36).slice(2)}`, this.closing = !1, this.closeRequested = !1, this.startY = 0, this.entryTransform = "translateY(12px)", this.mobileSheet = !1, this.motionSequence = 0, this.pop = () => {
      this.open && history.state?.signalSheet !== this.sheetId && this.finish();
    };
  }
  static {
    this.properties = {
      open: { type: Boolean },
      heading: { type: String },
      dark: { type: Boolean },
      compact: { type: Boolean }
    };
  }
  static {
    this.styles = [
      S`
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
      Q
    ];
  }
  cancelMotion() {
    this.motionSequence++, this.entryAnimation?.cancel(), this.backdropAnimation?.cancel(), this.exitAnimation?.cancel();
  }
  fadeBackdrop(t, e, i, s, n) {
    this.backdropAnimation?.cancel(), this.backdropAnimation = t.animate(
      [{ opacity: e }, { opacity: i }],
      {
        pseudoElement: "::backdrop",
        duration: s,
        easing: n,
        fill: "both"
      }
    );
  }
  trapTab(t) {
    if (t.key !== "Tab") return;
    const e = [], i = (a) => {
      a instanceof HTMLElement && a.matches("button,a[href],input,select,textarea,[tabindex]") && !a.matches(':disabled,[tabindex="-1"],[hidden]') && a.getClientRects().length && e.push(a), (a instanceof HTMLSlotElement ? a.assignedElements({ flatten: !0 }) : a.shadowRoot ? Array.from(a.shadowRoot.children) : Array.from(a.children)).forEach(i);
    };
    if (i(this.renderRoot.querySelector("dialog")), !e.length) return;
    const s = t.composedPath()[0], n = e.indexOf(s);
    t.shiftKey && n <= 0 ? (t.preventDefault(), e.at(-1).focus()) : !t.shiftKey && (n === e.length - 1 || n === -1) && (t.preventDefault(), e[0].focus());
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("popstate", this.pop);
  }
  disconnectedCallback() {
    if (super.disconnectedCallback(), window.removeEventListener("popstate", this.pop), this.cancelMotion(), this.renderRoot.querySelector("dialog")?.close(), history.state?.signalSheet === this.sheetId) {
      const t = { ...history.state };
      delete t.signalSheet, history.replaceState(t, "");
    }
  }
  updated(t) {
    if (t.has("open")) {
      const e = this.renderRoot.querySelector("dialog");
      if (this.open && !e.open) {
        this.cancelMotion();
        const i = this.motionSequence;
        this.closing = !1, this.closeRequested = !1, this.mobileSheet = !this.compact && matchMedia("(max-width: 600px)").matches, this.entryTransform = this.mobileSheet ? "translateY(100%)" : "translateY(12px)", e.showModal(), history.pushState({ ...history.state, signalSheet: this.sheetId }, "");
        const s = () => {
          i === this.motionSequence && this.open && !this.closeRequested && !this.closing && this.dispatchEvent(
            new CustomEvent("signal-opened", {
              bubbles: !0,
              composed: !0
            })
          );
        };
        if (matchMedia("(prefers-reduced-motion: reduce)").matches)
          s();
        else {
          const n = "cubic-bezier(.2,.8,.2,1)";
          this.fadeBackdrop(e, "0", "1", 280, n), this.entryAnimation = e.animate(
            [
              {
                opacity: this.mobileSheet ? 1 : 0,
                transform: this.entryTransform
              },
              { opacity: 1, transform: "none" }
            ],
            { duration: 280, easing: n }
          ), this.entryAnimation.finished.then(s, () => {
          });
        }
      } else !this.open && e.open && (this.cancelMotion(), this.closing = !1, e.close());
    }
  }
  requestClose() {
    this.closing || this.closeRequested || (this.closeRequested = !0, history.state?.signalSheet === this.sheetId ? history.back() : this.finish());
  }
  async finish() {
    if (this.closing) return;
    this.closing = !0;
    const t = this.renderRoot.querySelector("dialog"), e = getComputedStyle(t), i = { opacity: e.opacity, transform: e.transform }, s = getComputedStyle(t, "::backdrop").opacity, n = ++this.motionSequence;
    if (this.entryAnimation?.cancel(), t.open && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const a = "cubic-bezier(.4,0,1,1)";
      this.fadeBackdrop(t, s, "0", 200, a), this.exitAnimation = t.animate(
        [
          i,
          { opacity: this.mobileSheet ? 1 : 0, transform: this.entryTransform }
        ],
        { duration: 200, easing: a, fill: "both" }
      ), await this.exitAnimation.finished.catch(() => {
      });
    }
    n !== this.motionSequence || !this.isConnected || (t.close(), this.cancelMotion(), this.closing = !1, this.dispatchEvent(
      new CustomEvent("signal-close", { bubbles: !0, composed: !0 })
    ));
  }
  render() {
    return r`<dialog
      @keydown=${this.trapTab}
      class=${[this.dark ? "dark" : "", this.compact ? "compact" : ""].filter(Boolean).join(" ")}
      aria-labelledby="sheet-heading"
      @cancel=${(t) => {
      t.preventDefault(), this.requestClose();
    }}
      @click=${(t) => {
      const e = t.currentTarget, i = e.getBoundingClientRect();
      t.target === e && (t.clientX < i.left || t.clientX > i.right || t.clientY < i.top || t.clientY > i.bottom) && this.requestClose();
    }}
    >
      <header
        @pointerdown=${(t) => {
      t.target.closest("button") || (this.startY = t.clientY, t.currentTarget.setPointerCapture(t.pointerId));
    }}
        @pointerup=${(t) => {
      t.currentTarget.hasPointerCapture(t.pointerId) && t.clientY - this.startY > 70 && this.requestClose();
    }}
      >
        <span class="handle" aria-hidden="true"></span>
        <h2 id="sheet-heading">${this.heading}</h2>
        <button aria-label="Close details" @click=${() => this.requestClose()}>
          ${g("close")}
        </button>
      </header>
      <div class="body"><slot></slot></div>
    </dialog>`;
  }
}
customElements.define("signal-sheet", $e);
class we extends A {
  constructor() {
    super(...arguments), this.entity = "", this.dark = !1, this.name = "", this.custom = !1, this.battery = "", this.advanced = !1, this.records = [], this.loading = !1, this.loadError = "", this.sequence = 0;
  }
  static {
    this.properties = {
      hass: { attribute: !1 },
      entity: { type: String },
      dark: { type: Boolean },
      name: { type: String },
      custom: { type: Boolean },
      battery: { type: String },
      records: { state: !0 },
      loading: { state: !0 },
      loadError: { state: !0 }
    };
  }
  static {
    this.styles = S`
    :host {
      display: block;
    }
    .content {
      color: #222b28;
      font-family: var(--signal-font, system-ui, sans-serif);
    }
    .content.dark {
      color: #f0f2e9;
    }
    .summary {
      background: #e0edb3;
      color: #354225;
      padding: 24px;
      border-radius: 22px;
      margin-bottom: 16px;
    }
    .summary.unavailable {
      background: #e7e5df;
      color: #575c56;
    }
    .summary.alert {
      background: #f7cfac;
      color: #513520;
    }
    .value {
      font-size: 40px;
      letter-spacing: -1.5px;
      margin: 8px 0;
      overflow-wrap: anywhere;
    }
    .caption {
      font-size: 12px;
      opacity: 0.8;
    }
    .facts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin: 16px 0;
    }
    .fact {
      padding: 16px;
      border: 1px solid #81948755;
      border-radius: 18px;
      font-size: 13px;
    }
    .fact span {
      display: block;
      opacity: 0.7;
      font-size: 11px;
      margin-bottom: 6px;
    }
    .advanced {
      width: 100%;
      border: 1px solid #81948766;
      color: inherit;
      background: transparent;
      border-radius: 15px;
      min-height: 46px;
      margin-top: 20px;
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    .hint {
      font-size: 13px;
      line-height: 1.6;
      opacity: 0.7;
    }
    .records {
      margin-top: 20px;
    }
    .records h3 {
      font-size: 14px;
      font-weight: 600;
    }
    .record {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      padding: 13px 4px;
      border-bottom: 1px solid #81948744;
      font-size: 13px;
    }
    .record small {
      display: block;
      font-size: 11px;
      opacity: 0.7;
      margin-top: 4px;
    }
    .record strong {
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    .retry {
      min-height: 44px;
      background: transparent;
      color: inherit;
      border: 1px solid #81948766;
      border-radius: 12px;
      padding: 10px 16px;
      cursor: pointer;
    }
    signal-control,
    signal-graph {
      display: block;
      margin-bottom: 16px;
    }
  `;
  }
  updated(t) {
    t.has("entity") && (this.records = [], this.loadError = "", this.sequence++, this.entity && this.hass && this.load());
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.sequence++;
  }
  async load() {
    const t = this.entity, e = t.split(".")[0];
    if (!["weather", "binary_sensor"].includes(e)) return;
    const i = ++this.sequence;
    this.loading = !0, this.loadError = "";
    try {
      if (e === "weather") {
        const s = y(this.hass.states[t]?.attributes.supported_features) || 0, n = s & 1 ? "daily" : s & 2 ? "hourly" : s & 4 ? "twice_daily" : "daily", a = await this.hass.callWS({
          type: "call_service",
          domain: "weather",
          service: "get_forecasts",
          service_data: { entity_id: t, type: n },
          return_response: !0
        });
        i === this.sequence && (this.records = (a.response?.[t]?.forecast || []).slice(
          0,
          7
        ));
      } else {
        const s = await this.hass.callWS({
          type: "history/history_during_period",
          start_time: new Date(Date.now() - 864e5).toISOString(),
          end_time: (/* @__PURE__ */ new Date()).toISOString(),
          entity_ids: [t],
          minimal_response: !0,
          no_attributes: !0,
          significant_changes_only: !0
        });
        i === this.sequence && (this.records = (s[t] || []).filter(
          (n, a, d) => a === 0 || (n.s ?? n.state) !== (d[a - 1].s ?? d[a - 1].state)
        ).slice(-10).reverse());
      }
    } catch {
      i === this.sequence && (this.loadError = e === "weather" ? "Forecast could not be loaded." : "Recent history could not be loaded.");
    } finally {
      i === this.sequence && (this.loading = !1);
    }
  }
  historyLabel(t) {
    const e = this.hass.states[this.entity]?.attributes.device_class === "moisture";
    return t === "on" ? e ? "Water detected" : "Active" : t === "off" ? e ? "Dry" : "Clear" : k(t);
  }
  native() {
    this.advanced = !0, this.renderRoot.querySelector("signal-sheet").requestClose();
  }
  closed(t) {
    t.stopPropagation();
    const e = this.entity;
    this.dispatchEvent(
      new CustomEvent("signal-close", { bubbles: !0, composed: !0 })
    ), this.advanced && (this.advanced = !1, this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: e },
        bubbles: !0,
        composed: !0
      })
    ));
  }
  render() {
    const t = this.hass?.states[this.entity], e = t?.attributes || {}, i = this.entity.split(".")[0], s = $(t), n = i === "binary_sensor", a = e.device_class === "moisture", d = s ? n ? t.state === "on" ? a ? "Water detected" : "Active" : a ? "Dry" : "Clear" : k(t.state) : "Unavailable", l = [
      "light",
      "switch",
      "fan",
      "input_boolean",
      "cover",
      "media_player",
      "scene",
      "script",
      "button",
      "input_button",
      "number",
      "input_number",
      "select",
      "input_select",
      "lock"
    ].includes(i), p = i === "sensor" && (y(t?.state) !== void 0 || !!e.unit_of_measurement), u = this.hass?.states[this.battery];
    return r`<signal-sheet
      .open=${!!this.entity}
      .heading=${this.name || e.friendly_name || "Device details"}
      .dark=${this.dark}
      @signal-close=${this.closed}
      ><div class=${`content ${this.dark ? "dark" : ""}`}>
        ${this.custom ? r`<slot></slot>` : l ? r`<signal-control
                  .hass=${this.hass}
                  .configuration=${{ type: "custom:signal-control", entity: this.entity, name: this.name || void 0, appearance: this.dark ? "dark" : "light", detail: !0 }}
                ></signal-control>` : r`<div
                    class=${`summary ${s ? n && t.state === "on" ? "alert" : "" : "unavailable"}`}
                  >
                    <div class="caption">
                      ${n ? "LIVE SENSOR STATUS" : "CURRENT READING"}
                    </div>
                    <div class="value">
                      ${p ? s ? t.state : "—" : d}
                      ${p && e.unit_of_measurement || ""}
                    </div>
                    <div class="caption">
                      ${s ? n && t.state === "on" ? "Check this area. Open advanced details for more information." : "Reported by Home Assistant" : "This device cannot currently confirm its state."}
                    </div>
                  </div>
                  ${u ? r`<div class="fact"><span>Battery</span>${$(u) ? u.state + "%" : "Unavailable"}</div>` : h}${p ? r`<signal-graph .hass=${this.hass} .configuration=${{ type: "custom:signal-graph", entity: this.entity, appearance: this.dark ? "dark" : "light" }}></signal-graph>` : h}${!l && !n && !p ? r`<p class="hint">Additional controls for this device are available in advanced details.</p>` : h}`}
        ${["weather", "binary_sensor"].includes(i) ? r`<section class="records">
                <h3>
                  ${i === "weather" ? "The days ahead" : "Recent history · 24 hours"}
                </h3>
                ${this.loading ? r`<p class="hint" role="status">Loading…</p>` : this.loadError ? r`<p class="hint" role="status">${this.loadError}</p>
                          <button class="retry" @click=${this.load}>
                            Try again
                          </button>` : this.records.length ? this.records.map((c) => {
      const m = c.datetime ?? c.lu ?? c.last_updated ?? c.lc ?? c.last_changed, f = new Date(
        typeof m == "number" ? m * 1e3 : m
      );
      return r`<div class="record">
                              <div>
                                ${i === "weather" ? f.toLocaleDateString(this.hass.locale?.language, { weekday: "short", month: "short", day: "numeric" }) : this.historyLabel(c.s ?? c.state)}<small
                                  >${i === "weather" ? k(c.condition) : f.toLocaleString(this.hass.locale?.language, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</small
                                >
                              </div>
                              ${i === "weather" ? r`<strong>${y(c.temperature) ?? "—"}° ${c.templow !== void 0 ? r`<small>Low ${c.templow}°</small>` : h}</strong>` : h}
                            </div>`;
    }) : r`<p class="hint">
                            ${i === "weather" ? "No forecast is available from this provider." : "No recorded history in this period."}
                          </p>`}
              </section>` : h}
        <button class="advanced" @click=${this.native}>
          Advanced in Home Assistant ↗
        </button>
      </div></signal-sheet
    >`;
  }
}
customElements.define("signal-details", we);
class ke extends A {
  constructor() {
    super(...arguments), this.config = { type: "custom:signal-control", entity: "" }, this.pending = !1, this.acknowledged = !1, this.detailsOpen = !1, this.error = "", this.confirmUnlock = !1, this.preview = {};
  }
  static {
    this.properties = {
      hass: { attribute: !1 },
      config: { state: !0 },
      pending: { state: !0 },
      error: { state: !0 },
      confirmUnlock: { state: !0 },
      preview: { state: !0 },
      detailsOpen: { state: !0 },
      acknowledged: { state: !0 }
    };
  }
  static {
    this.styles = [
      ut,
      S`
      .control-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }
      .entity-icon {
        width: 44px;
        height: 44px;
        display: grid;
        place-items: center;
        border-radius: 15px;
        background: var(--tint);
        color: var(--accent-ink);
        transition:
          background 0.3s,
          transform 0.4s;
      }
      .on .entity-icon {
        transform: rotate(-7deg);
      }
      .dark .entity-icon {
        color: var(--accent);
      }
      .dark.on .state-dot {
        background: var(--accent);
      }
      @media (prefers-color-scheme: dark) {
        .auto .entity-icon {
          color: var(--accent);
        }
        .auto.on .state-dot {
          background: var(--accent);
        }
      }
      .switch {
        border: 0;
        background: var(--track);
        border-radius: 40px;
        width: 72px;
        height: 44px;
        padding: 4px;
        position: relative;
        transition: background 240ms;
        flex-shrink: 0;
      }
      .switch[aria-checked="true"] {
        background: var(--accent);
      }
      .thumb {
        position: absolute;
        top: 5px;
        left: 5px;
        width: 34px;
        height: 34px;
        background: var(--card);
        color: var(--text);
        border-radius: 50%;
        display: grid;
        place-items: center;
        box-shadow: 0 2px 5px #0002;
        transition: transform 400ms cubic-bezier(0.2, 1.35, 0.35, 1);
      }
      .switch[aria-checked="true"] .thumb {
        transform: translateX(28px);
        background: var(--accent-ink);
        color: var(--accent);
      }
      .thumb svg {
        width: 17px;
        height: 17px;
      }
      .switch:active .thumb {
        scale: 0.92;
      }
      h2 {
        margin: 20px 0 3px;
      }
      .state-line {
        display: flex;
        align-items: center;
        gap: 7px;
        font-size: 13px;
        color: var(--subtle);
        min-height: 20px;
      }
      .command-feedback {
        margin-left: auto;
        font-size: 11px;
        white-space: nowrap;
      }
      .command-feedback svg {
        width: 13px;
        height: 13px;
        vertical-align: -2px;
      }
      .acknowledged .entity-icon {
        animation: signal-ack 320ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      @keyframes signal-ack {
        50% {
          scale: 1.08;
        }
      }
      .switch:disabled {
        opacity: 0.8;
      }
      .state-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--subtle);
      }
      .on .state-dot {
        background: var(--accent-ink);
      }
      .slider-block {
        margin-top: 24px;
      }
      .slider-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 9px;
        font-size: 12px;
      }
      .slider-value {
        font-weight: 700;
        font-variant-numeric: tabular-nums;
      }
      .range {
        --fill: 0%;
        appearance: none;
        -webkit-appearance: none;
        width: 100%;
        height: 44px;
        margin: 0;
        cursor: pointer;
        border-radius: 14px;
        background: linear-gradient(
          to right,
          var(--accent) 0 var(--fill),
          var(--track) var(--fill) 100%
        );
        color: var(--accent-ink);
        touch-action: pan-y;
      }
      .range::-webkit-slider-thumb {
        appearance: none;
        -webkit-appearance: none;
        width: 7px;
        height: 25px;
        background: var(--accent-ink);
        border-radius: 6px;
        box-shadow: 0 0 0 7px transparent;
      }
      .range::-moz-range-thumb {
        width: 7px;
        height: 25px;
        border: 0;
        background: var(--accent-ink);
        border-radius: 6px;
      }
      .range:disabled {
        opacity: 0.4;
        cursor: default;
      }
      .button-row {
        display: flex;
        gap: 8px;
        margin-top: 20px;
      }
      .button-row button {
        flex: 1;
      }
      .action {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: 0;
        border-radius: 14px;
        min-height: 44px;
        padding: 10px 14px;
        background: var(--accent);
        color: var(--accent-ink);
        font-weight: 650;
      }
      .secondary {
        background: var(--track);
        color: var(--text);
      }
      .action:active {
        box-shadow: inset 0 2px 4px #0002;
      }
      .cover-window {
        display: block;
        width: 100%;
        height: 92px;
        border: 2px solid var(--border);
        border-radius: 14px;
        margin-top: 20px;
        overflow: hidden;
        background: var(--tint);
      }
      .cover-blind {
        height: var(--closed);
        background: repeating-linear-gradient(
          0deg,
          var(--accent-ink) 0 2px,
          var(--accent) 2px 12px
        );
        border-bottom: 3px solid var(--accent-ink);
        transition: height 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .art {
        width: 64px;
        height: 64px;
        border-radius: 17px;
        object-fit: cover;
        background: var(--tint);
      }
      .track-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .media-meta {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-top: 20px;
      }
      .media-meta > div {
        min-width: 0;
      }
      .media-meta h2 {
        margin: 0 0 5px;
      }
      .color-control {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 15px;
        font-size: 12px;
      }
      .color-control input {
        width: 48px;
        height: 44px;
        border: 0;
        background: transparent;
        cursor: pointer;
        padding: 3px;
      }
      .lock-confirm {
        padding: 14px;
        border: 1px solid var(--border);
        border-radius: 15px;
        margin-top: 18px;
        font-size: 13px;
      }
      .lock-confirm p {
        margin: 0;
      }
      .select {
        width: 100%;
        margin-top: 20px;
        min-height: 44px;
        border-radius: 14px;
        border: 1px solid var(--border);
        background: var(--track);
        color: var(--text);
        padding: 10px;
      }
      @media (prefers-reduced-motion: reduce) {
        .thumb,
        .entity-icon,
        .cover-blind {
          transition: none !important;
        }
      }
    `,
      Q
    ];
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearTimeout(this.feedbackTimer), this.acknowledged = !1;
  }
  setConfig(t) {
    if (!t.entity || typeof t.entity != "string")
      throw new Error("Choose an entity.");
    this.config = { ...t }, clearTimeout(this.feedbackTimer), this.acknowledged = !1, this.preview = {};
  }
  set configuration(t) {
    JSON.stringify(t) !== JSON.stringify(this.config) && this.setConfig(t);
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: !0, selector: { entity: {} } },
        { name: "name", selector: { text: {} } },
        {
          name: "accent",
          selector: {
            select: { options: ["mint", "lilac", "apricot", "lime"] }
          }
        },
        {
          name: "appearance",
          selector: { select: { options: ["auto", "light", "dark"] } }
        }
      ]
    };
  }
  static getStubConfig(t) {
    return {
      entity: Object.keys(t.states).find((e) => e.startsWith("light.")) || Object.keys(t.states).find((e) => e.startsWith("switch."))
    };
  }
  getCardSize() {
    return 4;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 9 };
  }
  more() {
    this.detailsOpen = !0;
  }
  isReady() {
    const t = this.hass?.states[this.config.entity];
    return !!(["scene", "button", "input_button", "script"].includes(
      this.config.entity.split(".")[0]
    ) && t?.state === "unknown") || $(t);
  }
  async send(t, e = {}) {
    if (this.pending || !this.isReady()) return;
    this.pending = !0, this.acknowledged = !1, clearTimeout(this.feedbackTimer), this.error = "";
    const i = this.config.entity, [s, n] = t.split(".");
    try {
      await this.hass.callService(s, n, {
        entity_id: i,
        ...e
      }), i === this.config.entity && this.isConnected && (this.confirmUnlock = !1, this.acknowledged = !0, this.feedbackTimer = setTimeout(
        () => this.acknowledged = !1,
        1600
      ));
    } catch {
      i === this.config.entity && this.isConnected && (this.error = "Couldn’t reach this device. Try again.");
    } finally {
      this.pending = !1, this.preview = {};
    }
  }
  slider(t, e, i, s, n, a, d, l, p = !1) {
    const u = this.preview[e] ?? i, c = n - s, m = u === void 0 || c <= 0 ? 0 : Math.max(0, Math.min(100, (u - s) / c * 100));
    return r`<div class="slider-block">
      <div class="slider-heading">
        <span>${t}</span
        ><span class="slider-value"
          >${u === void 0 ? "—" : Math.round(u * 10) / 10}${d}</span
        >
      </div>
      <input
        class="range"
        type="range"
        aria-label=${t}
        min=${s}
        max=${n}
        step=${a}
        .value=${U(String(u ?? s))}
        style=${`--fill:${m}%`}
        ?disabled=${p || this.pending}
        @input=${(f) => this.preview = { ...this.preview, [e]: Number(f.target.value) }}
        @change=${(f) => l(Math.max(s, Math.min(n, Number(f.target.value))))}
      />
    </div>`;
  }
  render() {
    if (!this.hass) return r`<div class="widget">Connecting…</div>`;
    const t = this.hass.states[this.config.entity], e = this.isReady(), i = t?.attributes || {}, s = this.config.entity.split(".")[0], n = t?.state === "on", a = y(i.supported_features) ?? 0, d = ["light", "switch", "fan", "input_boolean"].includes(
      s
    ), l = s === "media_player", p = s === "cover", u = s === "light" ? "bulb" : p ? "cover" : l ? "music" : s === "lock" ? "lock" : s === "fan" ? "wind" : "power", c = Array.isArray(i.supported_color_modes) ? i.supported_color_modes : [], m = s === "light" && (i.brightness !== void 0 || c.some((b) => !["onoff", "unknown"].includes(b))), v = "#" + (Array.isArray(i.rgb_color) ? i.rgb_color : [255, 255, 255]).map((b) => Math.round(b).toString(16).padStart(2, "0")).join("");
    return r`<article
        class=${`widget ${this.config.appearance || "auto"} ${this.config.accent || "mint"} ${n ? "on" : ""} ${this.acknowledged ? "acknowledged" : ""}`}
        aria-busy=${this.pending}
      >
        <div class="control-top">
          ${this.config.detail ? r`<span class="entity-icon">${g(u)}</span>` : r`<button
                  class="entity-icon"
                  aria-label="Device details"
                  @click=${this.more}
                >
                  ${g(u)}
                </button>`}
          ${d ? r`<button class="switch" role="switch" aria-label=${this.config.name || i.friendly_name || this.config.entity} aria-checked=${n} ?disabled=${!e || this.pending} @click=${() => this.send(`${s}.${n ? "turn_off" : "turn_on"}`)}><span class="thumb">${g(n ? "check" : "power")}</span></button>` : this.config.detail ? h : r`<button class="icon-button" aria-label="Open full controls" @click=${this.more}>${g("arrow")}</button>`}
        </div>
        <h2>${this.config.name || i.friendly_name || this.config.entity}</h2>
        <div class="state-line">
          <span class="state-dot"></span
          >${e ? k(t.state) : "Unavailable"}<span
            class="command-feedback"
            role="status"
            >${this.pending ? "Sending…" : this.acknowledged ? r`${g("check")} Sent` : h}</span
          >
        </div>
        ${m ? this.slider("Brightness", "brightness", n ? (y(i.brightness) ?? 0) / 255 * 100 : 0, 0, 100, 1, "%", (b) => this.send(b === 0 ? "light.turn_off" : "light.turn_on", b ? { brightness_pct: Math.round(b) } : {}), !e) : h}
        ${s === "light" && c.includes("color_temp") && y(i.min_color_temp_kelvin) !== void 0 && y(i.max_color_temp_kelvin) !== void 0 ? this.slider("Color temperature", "kelvin", y(i.color_temp_kelvin), Number(i.min_color_temp_kelvin), Number(i.max_color_temp_kelvin), 50, " K", (b) => this.send("light.turn_on", { color_temp_kelvin: b }), !e) : h}
        ${s === "light" && c.some(
      (b) => ["rgb", "rgbw", "rgbww", "hs", "xy"].includes(b)
    ) ? r`<label class="color-control"
                >Light color<input
                  type="color"
                  aria-label="Light color"
                  .value=${U(v)}
                  ?disabled=${!e || this.pending}
                  @change=${(b) => {
      const x = b.target.value;
      this.send("light.turn_on", {
        rgb_color: [1, 3, 5].map(
          (w) => parseInt(x.slice(w, w + 2), 16)
        )
      });
    }}
              /></label>` : h}
        ${s === "fan" && a & 1 ? this.slider("Fan speed", "speed", y(i.percentage), 0, 100, y(i.percentage_step) || 1, "%", (b) => this.send("fan.set_percentage", { percentage: Math.round(b) }), !e) : h}
        ${p ? r`<div class="cover-window" aria-hidden="true">
                  <div
                    class="cover-blind"
                    style=${`--closed:${100 - (y(i.current_position) ?? (t?.state === "closed" ? 0 : 100))}%`}
                  ></div>
                </div>
                <div class="button-row">
                  ${a & 1 ? r`<button class="action" ?disabled=${!e || this.pending} aria-label="Open cover" @click=${() => this.send("cover.open_cover")}>${g("up")}</button>` : h}${a & 8 ? r`<button class="action secondary" ?disabled=${!e || this.pending} aria-label="Stop cover" @click=${() => this.send("cover.stop_cover")}>${g("stop")}</button>` : h}${a & 2 ? r`<button class="action" ?disabled=${!e || this.pending} aria-label="Close cover" @click=${() => this.send("cover.close_cover")}>${g("down")}</button>` : h}
                </div>
                ${a & 4 ? this.slider("Cover position", "cover", y(i.current_position), 0, 100, 1, "%", (b) => this.send("cover.set_cover_position", { position: Math.round(b) }), !e) : h}` : h}
        ${l ? r`<div class="media-meta">
                  ${i.entity_picture ? r`<img class="art" src=${i.entity_picture} alt="" loading="lazy" />` : h}
                  <div>
                    <h2 class="track-title" title=${i.media_title || ""}>
                      ${i.media_title || "Nothing playing"}
                    </h2>
                    <span class="subtle"
                      >${i.media_artist || i.source || ""}</span
                    >
                  </div>
                </div>
                <div class="button-row">
                  ${a & 16 ? r`<button class="action secondary" aria-label="Previous track" ?disabled=${!e || this.pending} @click=${() => this.send("media_player.media_previous_track")}>${g("previous")}</button>` : h}${a & 16385 ? r`<button class="action" aria-label=${t?.state === "playing" ? "Pause" : "Play"} ?disabled=${!e || this.pending || (t?.state === "playing" ? !(a & 1) : !(a & 16384))} @click=${() => this.send(`media_player.${t?.state === "playing" ? "media_pause" : "media_play"}`)}>${g(t?.state === "playing" ? "pause" : "play")}</button>` : h}${a & 32 ? r`<button class="action secondary" aria-label="Next track" ?disabled=${!e || this.pending} @click=${() => this.send("media_player.media_next_track")}>${g("next")}</button>` : h}
                </div>
                ${a & 4 ? this.slider("Volume", "volume", y(i.volume_level) === void 0 ? void 0 : Number(i.volume_level) * 100, 0, 100, 1, "%", (b) => this.send("media_player.volume_set", { volume_level: b / 100 }), !e) : h}` : h}
        ${["number", "input_number"].includes(s) ? this.slider("Value", "number", y(t?.state), y(i.min) ?? 0, y(i.max) ?? 100, y(i.step) || 1, i.unit_of_measurement || "", (b) => this.send(`${s}.set_value`, { value: b }), !e) : h}
        ${["select", "input_select"].includes(s) ? r`<select
                class="select"
                aria-label=${this.config.name || i.friendly_name || "Option"}
                .value=${U(t?.state || "")}
                ?disabled=${!e || this.pending}
                @change=${(b) => this.send(`${s}.select_option`, { option: b.target.value })}
              >
                ${(i.options || []).map((b) => r`<option value=${b} .selected=${U(t?.state === b)}>${b}</option>`)}
              </select>` : h}
        ${["scene", "button", "input_button", "script"].includes(s) ? r`<div class="button-row"><button class="action" ?disabled=${!e || this.pending} @click=${() => this.send(`${s}.${s.includes("button") ? "press" : "turn_on"}`)}>${g("play")} ${s.includes("button") ? "Press" : s === "scene" ? "Activate" : "Run"}</button></div>` : h}
        ${s === "lock" ? r`<div class="button-row">
                  <button
                    class="action"
                    ?disabled=${!e || this.pending}
                    @click=${() => t.state === "locked" ? this.confirmUnlock = !0 : this.send("lock.lock")}
                  >
                    ${g("lock")}
                    ${t?.state === "locked" ? "Unlock…" : "Lock"}
                  </button>
                </div>
                ${this.confirmUnlock ? r`<div class="lock-confirm">
                        <p>
                          Unlock
                          ${this.config.name || i.friendly_name || "this lock"}?
                        </p>
                        <div class="button-row">
                          <button
                            class="action secondary"
                            @click=${() => this.confirmUnlock = !1}
                          >
                            Cancel</button
                          ><button
                            class="action"
                            ?disabled=${this.pending}
                            @click=${() => this.send("lock.unlock")}
                          >
                            Unlock
                          </button>
                        </div>
                      </div>` : h}` : h}
        ${this.error ? r`<p class="error" role="alert">${this.error}</p>` : h}
      </article>
      ${this.config.detail ? h : r`<signal-details .hass=${this.hass} .entity=${this.detailsOpen ? this.config.entity : ""} .name=${this.config.name || ""} .dark=${this.config.appearance === "dark" || this.config.appearance !== "light" && matchMedia("(prefers-color-scheme: dark)").matches} @signal-close=${() => this.detailsOpen = !1}></signal-details>`}`;
  }
}
customElements.define("signal-control", ke);
function _e(o) {
  return o.map((t) => {
    const e = t.lu ?? t.last_updated ?? t.lc ?? t.last_changed;
    return { time: typeof e == "number" ? e * 1e3 : Date.parse(String(e)), value: y(t.s ?? t.state) ?? null };
  }).filter((t) => Number.isFinite(t.time)).sort((t, e) => t.time - e.time);
}
function Ae(o, t = 600) {
  if (o.length <= t) return o;
  const e = Math.ceil(o.length / (t / 4)), i = [];
  for (let s = 0; s < o.length; s += e) {
    const n = o.slice(s, s + e), a = n.filter((p) => p.value !== null), d = /* @__PURE__ */ new Set([n[0], n[n.length - 1]]);
    a.length && (d.add(a.reduce((p, u) => p.value < u.value ? p : u)), d.add(a.reduce((p, u) => p.value > u.value ? p : u)));
    const l = n.find((p) => p.value === null);
    l && d.add(l), i.push(...[...d].sort((p, u) => p.time - u.time));
  }
  return i;
}
const st = /* @__PURE__ */ new WeakMap();
class Se extends A {
  constructor() {
    super(...arguments), this.suspended = !1, this.config = { type: "custom:signal-graph", entity: "" }, this.points = [], this.loading = !1, this.error = "", this.hours = 24, this.displayedHours = 24, this.sequence = 0, this.queried = "", this.cacheUser = "", this.restored = "", this.end = Date.now(), this.start = this.end - 864e5;
  }
  static {
    this.properties = {
      hass: { attribute: !1 },
      config: { state: !0 },
      points: { state: !0 },
      loading: { state: !0 },
      error: { state: !0 },
      hours: { state: !0 },
      cursor: { state: !0 },
      suspended: { type: Boolean }
    };
  }
  static {
    this.styles = [
      ut,
      S`
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }
      .periods {
        display: flex;
        gap: 3px;
        background: var(--track);
        border-radius: 13px;
        padding: 3px;
      }
      .periods button {
        min-height: 44px;
        min-width: 40px;
        border-radius: 10px;
        background: transparent;
        font-size: 11px;
      }
      .periods button[aria-pressed="true"] {
        background: var(--accent);
        color: var(--accent-ink);
      }
      .reading {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 15px;
        margin: 24px 0 16px;
      }
      .plot {
        min-height: 190px;
      }
      .history-status {
        min-height: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        font-size: 11px;
        color: var(--subtle);
      }
      .history-status .retry {
        margin: 0;
        padding: 4px 10px;
        min-height: 32px;
        font-size: 11px;
      }
      .value {
        font-size: 42px;
        font-weight: 600;
        letter-spacing: -2px;
        line-height: 1.15;
      }
      .value small {
        font-size: 18px;
        letter-spacing: -0.5px;
        margin-left: 4px;
      }
      .time {
        font-size: 11px;
        color: var(--subtle);
        margin-top: 7px;
      }
      .chart {
        height: 165px;
        position: relative;
        cursor: crosshair;
        border-radius: 8px;
        touch-action: pan-y;
      }
      .chart svg {
        width: 100%;
        height: 100%;
        overflow: visible;
      }
      .line {
        stroke: var(--accent-ink);
        fill: none;
        stroke-width: 2.5;
        stroke-linejoin: round;
        stroke-linecap: round;
        vector-effect: non-scaling-stroke;
      }
      .widget.dark .line {
        stroke: var(--accent);
      }
      .fill {
        fill: var(--accent);
        opacity: 0.3;
      }
      .grid-line {
        stroke: var(--border);
        stroke-dasharray: 3 5;
        stroke-width: 1;
        vector-effect: non-scaling-stroke;
      }
      .cursor-line {
        stroke: var(--subtle);
        stroke-width: 1;
        stroke-dasharray: 3 4;
        vector-effect: non-scaling-stroke;
      }
      .cursor-dot {
        fill: var(--accent-ink);
        stroke: var(--card);
        stroke-width: 3;
        vector-effect: non-scaling-stroke;
      }
      .dark .cursor-dot {
        fill: var(--accent);
      }
      .bounds {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: var(--subtle);
        margin-top: 10px;
      }
      .stats {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin-top: 22px;
        border-top: 1px solid var(--border);
        padding-top: 15px;
        font-size: 11px;
        color: var(--subtle);
      }
      .stats strong {
        display: block;
        color: var(--text);
        font-size: 15px;
        margin-top: 4px;
      }
      .skeleton {
        height: 165px;
        border-radius: 16px;
        background: linear-gradient(
          110deg,
          var(--track),
          var(--card),
          var(--track)
        );
        background-size: 200% 100%;
        animation: shimmer 1.2s 3;
      }
      .header-title {
        display: flex;
        gap: 9px;
        align-items: center;
        font-size: 13px;
        font-weight: 650;
      }
      .empty {
        height: 165px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
      }
      .widget.auto .line {
        stroke: var(--signal-graph-stroke, var(--accent-ink));
      }
      @keyframes shimmer {
        to {
          background-position: -200% 0;
        }
      }
      @media (prefers-color-scheme: dark) {
        .widget.auto .line {
          stroke: var(--accent);
        }
      }
    `,
      Q
    ];
  }
  setConfig(t) {
    if (!t.entity || typeof t.entity != "string")
      throw new Error("Choose a numeric sensor entity.");
    if (t.hours !== void 0 && (!Number.isFinite(t.hours) || t.hours < 1 || t.hours > 168))
      throw new Error("History hours must be between 1 and 168.");
    const e = t.entity !== this.config.entity || (t.hours || 24) !== (this.config.hours || 24);
    this.config = { ...t }, e && (this.hours = t.hours || 24, this.displayedHours = this.hours, this.queried = "", this.restored = "", this.points = [], this.sequence++);
  }
  set configuration(t) {
    JSON.stringify(t) !== JSON.stringify(this.config) && this.setConfig(t);
  }
  static getConfigForm() {
    return {
      schema: [
        {
          name: "entity",
          required: !0,
          selector: { entity: { domain: "sensor" } }
        },
        { name: "name", selector: { text: {} } },
        {
          name: "hours",
          selector: { number: { min: 1, max: 168, mode: "box" } }
        },
        {
          name: "accent",
          selector: {
            select: { options: ["mint", "lilac", "apricot", "lime"] }
          }
        },
        {
          name: "appearance",
          selector: { select: { options: ["auto", "light", "dark"] } }
        }
      ]
    };
  }
  static getStubConfig(t) {
    return {
      entity: Object.keys(t.states).find(
        (e) => e.startsWith("sensor.") && y(t.states[e].state) !== void 0
      )
    };
  }
  getCardSize() {
    return 6;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 9 };
  }
  connectedCallback() {
    super.connectedCallback(), this.timer = setInterval(() => {
      document.hidden || this.fetchHistory();
    }, 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this.timer), this.sequence++, this.queried = "";
  }
  updated(t) {
    if (this.hass) {
      const e = this.hass.connection || this.hass.callWS, i = this.hass.user?.id || this.hass.user?.name || "";
      (e !== this.cacheOwner || i !== this.cacheUser) && (this.cacheOwner = e, this.cacheUser = i, this.sequence++, this.queried = this.restored = "", this.points = [], this.loading = !1, this.error = "");
      const s = `${this.config.entity}:${this.hours}`;
      if (this.restored !== s) {
        this.restored = s;
        const n = st.get(e)?.get(`${i}:${s}`);
        n && Date.now() - n.end < 6e4 && (this.points = n.points, this.start = n.start, this.end = n.end, this.displayedHours = n.hours, this.queried = s);
      }
    }
    this.hass && (t.has("hass") || t.has("config") || t.has("suspended")) && this.queried !== `${this.config.entity}:${this.hours}` && this.fetchHistory();
  }
  async fetchHistory() {
    if (!this.hass || !this.config.entity || !this.isConnected || this.suspended)
      return;
    const t = ++this.sequence;
    this.queried = `${this.config.entity}:${this.hours}`, this.loading = !0, this.error = "", this.cursor = void 0;
    const e = Date.now(), i = this.hours, s = e - i * 36e5;
    try {
      const n = await this.hass.callWS({
        type: "history/history_during_period",
        start_time: new Date(s).toISOString(),
        end_time: new Date(e).toISOString(),
        entity_ids: [this.config.entity],
        minimal_response: !0,
        no_attributes: !0,
        significant_changes_only: !1
      });
      if (t === this.sequence) {
        this.points = _e(n[this.config.entity] || []), this.start = s, this.end = e, this.displayedHours = i;
        const a = this.hass.connection || this.hass.callWS;
        let d = st.get(a);
        d || st.set(a, d = /* @__PURE__ */ new Map());
        const l = `${this.cacheUser}:${this.queried}`;
        d.delete(l), d.set(l, { points: this.points, start: s, end: e, hours: i }), d.size > 16 && d.delete(d.keys().next().value);
      }
    } catch {
      t === this.sequence && (this.error = "History couldn’t be loaded.");
    } finally {
      t === this.sequence && (this.loading = !1);
    }
  }
  period(t) {
    t !== this.hours && (this.hours = t, this.fetchHistory());
  }
  pointer(t) {
    const e = t.currentTarget.getBoundingClientRect(), i = this.start + Math.max(0, Math.min(1, (t.clientX - e.left) / e.width)) * (this.end - this.start);
    let s = 0;
    for (let n = 1; n < this.points.length; n++)
      Math.abs(this.points[n].time - i) < Math.abs(this.points[s].time - i) && (s = n);
    this.cursor = s;
  }
  keyboard(t) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(t.key)) return;
    t.preventDefault();
    const e = this.cursor ?? this.points.length - 1;
    this.cursor = t.key === "Home" ? 0 : t.key === "End" ? this.points.length - 1 : Math.max(
      0,
      Math.min(
        this.points.length - 1,
        e + (t.key === "ArrowLeft" ? -1 : 1)
      )
    );
  }
  format(t) {
    const e = y(t);
    return e === void 0 ? "—" : new Intl.NumberFormat(this.hass?.locale?.language || void 0, {
      maximumFractionDigits: 1
    }).format(e);
  }
  render() {
    const t = this.hass?.states[this.config.entity], e = t?.attributes.unit_of_measurement || "", i = this.points.filter((x) => x.value !== null), s = i.map((x) => x.value), n = s.length ? s.reduce((x, w) => Math.min(x, w), 1 / 0) : 0, a = s.length ? s.reduce((x, w) => Math.max(x, w), -1 / 0) : 1, d = Math.max((a - n) * 0.16, 1), l = n - d, p = a + d, u = (x) => Math.max(
      0,
      Math.min(600, (x.time - this.start) / (this.end - this.start) * 600)
    ), c = (x) => 150 - (x.value - l) / (p - l) * 150, m = [];
    let f = [];
    for (const x of Ae(this.points))
      x.value === null ? (f.length && m.push(f), f = []) : f.push(x);
    f.length && m.push(f);
    const v = this.cursor !== void 0 ? this.points[this.cursor] : void 0, b = v ? v.value : $(t) ? t.state : void 0;
    return r`<article
      class=${`widget ${this.config.appearance || "auto"} ${this.config.accent || "lilac"}`}
    >
      <div class="top">
        <span class="header-title"
          >${g("graph")}${this.config.name || t?.attributes.friendly_name || this.config.entity}</span
        >
        <div class="periods" aria-label="History period">
          ${[6, 24, 168].map((x) => r`<button aria-pressed=${this.hours === x} @click=${() => this.period(x)}>${x === 168 ? "7d" : `${x}h`}</button>`)}
        </div>
      </div>
      <div class="reading">
        <div>
          <div class="value numeric">
            ${this.format(b)}<small>${e}</small>
          </div>
          <div class="time">
            ${v ? new Date(v.time).toLocaleString(this.hass?.locale?.language || void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : $(t) ? "Right now" : "Current reading unavailable"}
          </div>
        </div>
        <span class="subtle"
          >${this.displayedHours === 168 ? "7 days" : this.displayedHours + " hours"}
          of history</span
        >
      </div>
      <div class="plot" aria-busy=${this.loading || this.suspended}>
        ${(this.loading || this.suspended) && !this.points.length ? r`<div
                class="skeleton"
                style=${this.suspended ? "animation: none" : ""}
                role="status"
                aria-label="Loading history"
              ></div>` : i.length ? r`<div
                    class="chart"
                    tabindex="0"
                    role="slider"
                    aria-label="History cursor"
                    aria-valuemin="0"
                    aria-valuemax=${Math.max(0, this.points.length - 1)}
                    aria-valuenow=${this.cursor ?? this.points.length - 1}
                    aria-valuetext=${`${this.format(b)} ${e}`}
                    @pointermove=${this.pointer}
                    @pointerdown=${this.pointer}
                    @pointerleave=${() => this.cursor = void 0}
                    @keydown=${this.keyboard}
                    @blur=${() => this.cursor = void 0}
                  >
                    <svg
                      viewBox="0 0 600 160"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      ${[25, 75, 125].map((x) => D`<line class="grid-line" x1="0" y1=${x} x2="600" y2=${x}/>`)}${m.map(
      (x) => {
        const w = x.map(
          (P, E) => `${E ? "L" : "M"}${u(P).toFixed(2)},${c(P).toFixed(2)}`
        ).join(" ");
        return D`<path class="fill" d=${`${w} L${u(x[x.length - 1])},160 L${u(x[0])},160 Z`}/><path class="line" d=${w}/>${x.length === 1 ? D`<circle cx=${u(x[0])} cy=${c(x[0])} r="3" fill="var(--accent-ink)"/>` : h}`;
      }
    )}${v ? D`<line class="cursor-line" x1=${u(v)} x2=${u(v)} y1="0" y2="160"/>${v.value !== null ? D`<circle class="cursor-dot" cx=${u(v)} cy=${c(v)} r="5"/>` : h}` : h}
                    </svg>
                  </div>
                  <div class="bounds">
                    <span
                      >${new Date(this.start).toLocaleString(void 0, { weekday: this.displayedHours > 24 ? "short" : void 0, hour: "numeric", minute: "2-digit" })}</span
                    ><span
                      >${new Date(this.end).toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" })}</span
                    >
                  </div>` : r`<div class="empty">
                  ${this.error ? "History is unavailable." : "No numeric history in this period."}
                </div>`}
      </div>
      <div class="history-status" role="status">
        <span
          >${this.error ? `${this.error}${this.points.length ? " Showing previous data." : ""}` : this.loading ? "Updating history…" : ""}</span
        >
        ${this.error ? r`<button class="retry" @click=${() => this.fetchHistory()}>Try again</button>` : h}
      </div>
      <div class="stats">
        <span
          >Low<strong
            >${s.length ? this.format(n) : "—"} ${e}</strong
          ></span
        ><span
          >High<strong
            >${s.length ? this.format(a) : "—"} ${e}</strong
          ></span
        ><span>Samples<strong>${i.length}</strong></span>
      </div>
    </article>`;
  }
}
customElements.define("signal-graph", Se);
class Ee extends A {
  constructor() {
    super(...arguments), this.detailsOpen = !1, this.config = { type: "custom:signal-metric", entity: "" };
  }
  static {
    this.properties = {
      hass: { attribute: !1 },
      config: { state: !0 },
      detailsOpen: { state: !0 }
    };
  }
  static {
    this.styles = [
      ut,
      S`
      .widget {
        cursor: pointer;
        transition: transform 0.2s;
      }
      .widget:active {
        transform: scale(0.98);
      }
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .metric {
        font-size: 48px;
        letter-spacing: -2px;
        line-height: 1.1;
        margin: 24px 0 12px;
        font-weight: 600;
      }
      .metric small {
        font-size: 21px;
        letter-spacing: 0;
      }
      .meter {
        height: 7px;
        border-radius: 8px;
        background: var(--track);
        overflow: hidden;
        margin-top: 20px;
      }
      .meter span {
        display: block;
        height: 100%;
        background: var(--accent-ink);
        border-radius: 8px;
        transition: width 600ms cubic-bezier(0.16, 1, 0.3, 1);
      }
      .dark .meter span {
        background: var(--accent);
      }
      .symbol {
        color: var(--accent-ink);
        background: var(--accent);
        border-radius: 14px;
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
      }
    `
    ];
  }
  setConfig(t) {
    if (!t.entity) throw new Error("Choose an entity.");
    if (t.min !== void 0 && t.max !== void 0 && t.min >= t.max)
      throw new Error("Maximum must exceed minimum.");
    this.config = { ...t };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: !0, selector: { entity: {} } },
        { name: "name", selector: { text: {} } },
        { name: "min", selector: { number: { mode: "box" } } },
        { name: "max", selector: { number: { mode: "box" } } },
        {
          name: "accent",
          selector: {
            select: { options: ["mint", "lilac", "apricot", "lime"] }
          }
        },
        {
          name: "appearance",
          selector: { select: { options: ["auto", "light", "dark"] } }
        }
      ]
    };
  }
  static getStubConfig(t) {
    return {
      entity: Object.keys(t.states).find((e) => e.startsWith("sensor."))
    };
  }
  getCardSize() {
    return 3;
  }
  getGridOptions() {
    return { columns: 6, min_columns: 6 };
  }
  more() {
    this.detailsOpen = !0;
  }
  render() {
    const t = this.hass?.states[this.config.entity], e = $(t), i = e ? y(t.state) : void 0, s = i === void 0 ? 0 : Math.max(
      0,
      Math.min(
        100,
        (i - (this.config.min ?? 0)) / ((this.config.max ?? 100) - (this.config.min ?? 0)) * 100
      )
    );
    return r`<div
        class=${`widget ${this.config.appearance || "auto"} ${this.config.accent || "lime"}`}
        role="button"
        tabindex="0"
        @click=${this.more}
        @keydown=${(n) => {
      ["Enter", " "].includes(n.key) && (n.preventDefault(), this.more());
    }}
      >
        <div class="top">
          <h2>
            ${this.config.name || t?.attributes.friendly_name || this.config.entity}
          </h2>
          <span class="symbol"
            >${g(t?.attributes.device_class === "humidity" ? "drop" : t?.attributes.device_class === "temperature" ? "climate" : "graph")}</span
          >
        </div>
        <div class="metric numeric">
          ${e ? i === void 0 ? k(t.state) : new Intl.NumberFormat(this.hass?.locale?.language || void 0, { maximumFractionDigits: 1 }).format(i) : "—"}<small>
            ${t?.attributes.unit_of_measurement || ""}</small
          >
        </div>
        <span class="subtle">${e ? "Tap for details" : "Unavailable"}</span
        >${this.config.max !== void 0 ? r`<div class="meter" aria-hidden="true"><span style=${`width:${s}%`}></span></div>` : ""}
      </div>
      <signal-details
        .hass=${this.hass}
        .entity=${this.detailsOpen ? this.config.entity : ""}
        .name=${this.config.name || ""}
        .dark=${this.config.appearance === "dark" || this.config.appearance !== "light" && matchMedia("(prefers-color-scheme: dark)").matches}
        @signal-close=${() => this.detailsOpen = !1}
      ></signal-details>`;
  }
}
customElements.define("signal-metric", Ee);
const z = [
  { id: "home", name: "Overview", icon: "home" },
  { id: "climate", name: "Climate", icon: "climate" },
  { id: "safety", name: "Safety", icon: "shield" },
  { id: "lists", name: "Lists", icon: "list" }
], Ot = {
  off: "Off",
  heat: "Heat",
  cool: "Cool",
  heat_cool: "Auto",
  auto: "Auto",
  dry: "Dry",
  fan_only: "Fan"
};
class Ce extends A {
  constructor() {
    super(...arguments), this.config = { type: "custom:signal-home" }, this.tab = "home", this.pageTravel = 0, this.pendingTodo = "", this.messageTone = "neutral", this.dark = !1, this.appearance = "auto", this.completedTodos = [], this.completionTimes = {}, this.deleteError = "", this.todoMutating = !1, this.todoRefreshPending = !1, this.todoOrder = /* @__PURE__ */ new Map(), this.selectedTodo = "", this.loadedTodo = "", this.discoveredTodos = [], this.detailEntity = "", this.detailReady = !1, this.menuOpen = !1, this.contentScrolled = !1, this.onContentScroll = (t) => {
      this.contentScrolled = t.currentTarget.scrollTop > 4;
    }, this.chrome = new xe(), this.chromePath = "", this.syncChrome = () => {
      this.isConnected && this.immersive && location.pathname === this.chromePath ? this.chrome.sync(this.dark, this.hass?.auth?.external) : this.chrome.release();
    }, this.phone = window.matchMedia("(max-width: 760px)"), this.narrow = this.phone.matches, this.resize = () => {
      this.narrow = this.phone.matches;
    }, this.todos = [], this.rangeSide = "low", this.syncRoute = () => {
      const t = location.hash.replace("#signal/", ""), e = z.some((i) => i.id === t) ? t : "home";
      e !== this.tab && (this.pageTravel = z.findIndex((i) => i.id === e) > z.findIndex((i) => i.id === this.tab) ? 12 : -12, this.tab = e, this.resetScroll());
    }, this.todoError = "", this.busy = !1, this.message = "", this.draft = "", this.todoSequence = 0, this.todoSignature = "", this.todoLoading = !1, this.todoLoaded = !1, this.media = window.matchMedia("(prefers-color-scheme: dark)"), this.applyAppearance = () => {
      let t = null;
      try {
        t = localStorage.getItem(this.appearanceKey);
      } catch {
      }
      const e = t || this.config.appearance || "auto";
      this.appearance = Mt.includes(e) ? e : "auto", this.dark = ve(
        this.appearance,
        this.media.matches,
        /* @__PURE__ */ new Date(),
        this.hass?.config?.time_zone
      );
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
      rangeSide: { state: !0 },
      detailEntity: { state: !0 },
      detailReady: { state: !0 },
      menuOpen: { state: !0 },
      narrow: { state: !0 },
      contentScrolled: { state: !0 },
      appearance: { state: !0 },
      completedTodos: { state: !0 },
      undoItem: { state: !0 },
      deleteTarget: { state: !0 },
      deleteError: { state: !0 },
      selectedTodo: { state: !0 },
      todoLoading: { state: !0 },
      pendingTodo: { state: !0 },
      messageTone: { state: !0 }
    };
  }
  static {
    this.styles = [ge, fe, be, Q];
  }
  get todoLists() {
    return this.todoListStates === this.hass?.states ? this.discoveredTodos : (this.todoListStates = this.hass?.states, this.discoveredTodos = Object.entries(this.hass?.states || {}).filter(([t]) => t.startsWith("todo.")).map(([t, e]) => ({ ...e, entity_id: t })).sort(
      (t, e) => this.listName(t.entity_id).localeCompare(this.listName(e.entity_id))
    ), this.discoveredTodos);
  }
  listName(t) {
    return this.hass?.states[t]?.attributes.friendly_name || k(t.replace(/^todo\./, ""));
  }
  get todoEntity() {
    const t = this.todoLists;
    return t.find((e) => e.entity_id === this.selectedTodo)?.entity_id || t.find((e) => e.entity_id === this.config.todo)?.entity_id || t[0]?.entity_id;
  }
  get todoName() {
    return this.todoEntity ? this.listName(this.todoEntity) : "To-do lists";
  }
  chooseTodo(t) {
    this.busy || t === this.todoEntity || (this.selectedTodo = t, this.resetTodoState());
  }
  resetTodoState() {
    this.closeDelete(), this.deleteTarget = void 0, this.loadedTodo = this.todoEntity || "", this.todoSignature = "", this.todoSequence++, this.todos = [], this.completedTodos = [], this.todoOrder.clear(), this.undoItem = void 0, this.message = "", this.draft = "", this.todoError = "", this.todoLoaded = !1;
    try {
      const t = JSON.parse(
        localStorage.getItem(this.completionKey) || "{}"
      );
      this.completionTimes = t && typeof t == "object" && !Array.isArray(t) ? t : {};
    } catch {
      this.completionTimes = {};
    }
  }
  get immersive() {
    return !!this.config.immersive && !new URLSearchParams(location.search).has("disable_km");
  }
  get appearanceKey() {
    return `signal-home-appearance-v2:${this.config.title || "Home"}`;
  }
  connectedCallback() {
    super.connectedCallback(), this.chromePath = location.pathname, window.addEventListener("location-changed", this.syncChrome), window.addEventListener("popstate", this.syncChrome), this.syncRoute(), window.addEventListener("popstate", this.syncRoute), window.addEventListener("hashchange", this.syncRoute), this.media.addEventListener("change", this.applyAppearance), document.addEventListener("visibilitychange", this.applyAppearance), this.phone.addEventListener("change", this.resize), this.resize(), this.applyAppearance(), this.clock = setInterval(() => {
      this.applyAppearance(), this.requestUpdate(), this.todoEntity && this.loadTodos();
    }, 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("location-changed", this.syncChrome), window.removeEventListener("popstate", this.syncChrome), this.chrome.release(), window.removeEventListener("popstate", this.syncRoute), window.removeEventListener("hashchange", this.syncRoute), this.media.removeEventListener("change", this.applyAppearance), document.removeEventListener("visibilitychange", this.applyAppearance), this.phone.removeEventListener("change", this.resize), clearInterval(this.clock), clearTimeout(this.timer), this.todoSequence++;
  }
  setConfig(t) {
    if (!t || typeof t != "object")
      throw new Error("Signal Home needs a configuration.");
    for (const e of ["climate", "weather", "todo", "humidity"])
      if (t[e] && typeof t[e] != "string")
        throw new Error(`${e} must be an entity ID.`);
    if (t.sensors && (!Array.isArray(t.sensors) || t.sensors.some(
      (e) => !e || typeof Rt(e).entity != "string"
    )))
      throw new Error(
        "Sensors must be entity IDs or objects containing entity."
      );
    if (t.favorites && (!Array.isArray(t.favorites) || t.favorites.some((e) => typeof e != "string")))
      throw new Error("Favorites must be entity IDs.");
    if (t.graphs && (!Array.isArray(t.graphs) || t.graphs.some(
      (e) => !e || typeof e != "string" && (typeof e.entity != "string" || e.hours !== void 0 && (!Number.isFinite(e.hours) || e.hours < 1 || e.hours > 168))
    )))
      throw new Error(
        "Graphs need an entity ID and optional hours between 1 and 168."
      );
    this.config = { ...t }, this.selectedTodo = "", this.resetTodoState(), this.applyAppearance();
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
    if (t.has("hass") && this.applyAppearance(), this.syncChrome(), (t.has("hass") || t.has("config") || t.has("selectedTodo")) && this.hass) {
      (this.todoEntity || "") !== this.loadedTodo && this.resetTodoState();
      const e = `${this.todoEntity}:${this.hass.states[this.todoEntity || ""]?.state}`;
      e !== this.todoSignature && (this.todoSignature = e, this.loadTodos());
    }
  }
  state(t) {
    return t ? this.hass?.states[t] : void 0;
  }
  format(t, e = 0) {
    const i = y(t);
    return i === void 0 ? "—" : new Intl.NumberFormat(this.hass?.locale?.language || void 0, {
      maximumFractionDigits: e
    }).format(i);
  }
  notify(t, e = "neutral") {
    this.message = t, this.messageTone = e, this.undoItem = void 0, clearTimeout(this.timer), this.timer = setTimeout(() => {
      this.message = "", this.undoItem = void 0;
    }, 8e3);
  }
  async service(t, e, i, s) {
    if (!(this.busy || !this.hass)) {
      this.busy = !0;
      try {
        await this.hass.callService(t, e, i), s && this.notify(s, "success");
      } catch {
        this.notify(
          "That didn’t go through. Check the connection and try again.",
          "error"
        );
      } finally {
        this.busy = !1;
      }
    }
  }
  moreInfo(t) {
    t && (this.detailReady = !1, this.detailEntity = t);
  }
  async loadTodos() {
    const t = this.todoEntity;
    if (!t || !this.hass) return;
    if (this.todoMutating || this.todoLoading) {
      this.todoRefreshPending = !0;
      return;
    }
    this.todoRefreshPending = !1, this.todoLoading = !0;
    const e = ++this.todoSequence;
    try {
      const i = await this.hass.callWS({
        type: "call_service",
        domain: "todo",
        service: "get_items",
        service_data: { entity_id: t },
        return_response: !0
      });
      if (e === this.todoSequence && t === this.todoEntity) {
        const s = i.response?.[t]?.items;
        if (!Array.isArray(s)) throw new Error("Missing list response");
        this.todoOrder = new Map(s.map((a, d) => [a.uid, d])), this.todos = s.filter((a) => a.status === "needs_action"), this.completedTodos = s.filter(
          (a) => a.status === "completed"
        );
        const n = new Set(this.completedTodos.map((a) => a.uid));
        for (const a of Object.keys(this.completionTimes))
          n.has(a) || delete this.completionTimes[a];
        for (const a of s)
          a.status !== "completed" ? delete this.completionTimes[a.uid] : Number.isFinite(this.completionTimes[a.uid]) || (this.completionTimes[a.uid] = Date.now());
        this.saveCompletionTimes(), this.todoError = "", this.todoLoaded = !0;
      }
    } catch {
      e === this.todoSequence && (this.todoError = "Your list couldn’t be loaded. Tap to retry.");
    } finally {
      this.todoLoading = !1, this.todoRefreshPending && !this.todoMutating && this.isConnected && this.loadTodos();
    }
  }
  get completionKey() {
    return `signal-completed:${this.todoEntity || ""}`;
  }
  saveCompletionTimes() {
    try {
      localStorage.setItem(
        this.completionKey,
        JSON.stringify(this.completionTimes)
      );
    } catch {
    }
  }
  completedAt(t) {
    const e = t.completed ? Date.parse(t.completed) : NaN;
    return Number.isFinite(e) ? e : this.completionTimes[t.uid] || Date.now();
  }
  motionRows() {
    return Array.from(
      this.renderRoot.querySelectorAll("[data-todo-motion]")
    ).filter((t) => t.getClientRects().length);
  }
  /** Commit only after HA accepts the change; keep refreshes out of the transition. */
  async moveTodo(t, e, i, s = !1) {
    const n = matchMedia("(prefers-reduced-motion: reduce)").matches, a = this.motionRows(), d = a.find((c) => c.dataset.todoUid === t);
    if (d && !n && await d.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: "translateX(10px) scale(.98)" }
      ],
      { duration: 150, easing: "ease-in", fill: "forwards" }
    ).finished.catch(() => {
    }), i !== this.todoEntity || !this.isConnected) return;
    const l = new Map(
      a.map((c) => [
        c.dataset.todoMotion,
        c.getBoundingClientRect().top
      ])
    );
    e(), await this.updateComplete;
    const p = this.motionRows(), u = [];
    if (!n)
      for (const c of p) {
        const m = l.get(c.dataset.todoMotion), f = c.dataset.todoUid === t, v = m === void 0 || f ? 12 : m - c.getBoundingClientRect().top;
        !v && !f || u.push(
          c.animate(
            [
              {
                transform: `translateY(${v}px)`,
                opacity: m === void 0 || f ? 0 : 1
              },
              { transform: "none", opacity: 1 }
            ],
            { duration: 300, easing: "cubic-bezier(.2,.8,.2,1)" }
          )
        );
      }
    if (await Promise.all(
      u.map((c) => c.finished.catch(() => {
      }))
    ), s && this.tab === "lists" && !this.deleteTarget && !this.menuOpen && !this.detailEntity) {
      const m = p.find((f) => f.dataset.todoUid === t)?.querySelector(".check-button");
      requestAnimationFrame(() => {
        m?.isConnected && !m.disabled ? m.focus({ preventScroll: !0 }) : this.tab === "lists" && this.renderRoot.querySelector('[aria-label="Refresh list"]')?.focus({ preventScroll: !0 });
      });
    }
  }
  closeDelete() {
    this.deleteTarget && this.renderRoot.querySelector("#delete-sheet")?.requestClose();
  }
  askDelete(t) {
    this.busy || !this.todoEntity || !this.canDeleteTodo || (this.deleteError = "", this.deleteTarget = { item: t, entity: this.todoEntity });
  }
  async deleteTodo() {
    const t = this.deleteTarget;
    if (!(!t || this.busy || t.entity !== this.todoEntity || !this.canDeleteTodo)) {
      this.busy = !0, this.todoMutating = !0, this.todoSequence++;
      try {
        if (await this.hass.callService("todo", "remove_item", {
          entity_id: t.entity,
          item: t.item.uid
        }), t.entity !== this.todoEntity || !this.isConnected) return;
        await this.moveTodo(
          t.item.uid,
          () => {
            this.todos = this.todos.filter(
              (e) => e.uid !== t.item.uid
            ), this.completedTodos = this.completedTodos.filter(
              (e) => e.uid !== t.item.uid
            ), delete this.completionTimes[t.item.uid], this.saveCompletionTimes(), this.notify("Permanently deleted.");
          },
          t.entity
        ), this.deleteTarget === t && this.closeDelete();
      } catch {
        this.deleteTarget === t ? this.deleteError = "Couldn’t delete this item. Check your connection and try again." : this.notify("Couldn’t delete this item. Try again.");
      } finally {
        this.busy = !1, this.todoMutating = !1, this.todoRefreshPending && this.isConnected && this.loadTodos();
      }
    }
  }
  async complete(t, e = !1) {
    if (this.busy || !this.todoSupports(4)) return;
    const i = this.todoEntity, s = this.shadowRoot?.activeElement, n = !!s?.matches(":focus-visible") && s.closest("[data-todo-uid]")?.dataset.todoUid === t.uid;
    this.busy = !0, this.pendingTodo = t.uid, this.todoMutating = !0, this.todoSequence++;
    try {
      if (await this.hass.callService("todo", "update_item", {
        entity_id: i,
        item: t.uid,
        status: e ? "needs_action" : "completed"
      }), i !== this.todoEntity) return;
      await this.moveTodo(
        t.uid,
        () => {
          e ? (delete this.completionTimes[t.uid], this.completedTodos = this.completedTodos.filter(
            (a) => a.uid !== t.uid
          ), this.todos.some((a) => a.uid === t.uid) || (this.todos = [
            ...this.todos,
            { ...t, status: "needs_action", completed: null }
          ].sort(
            (a, d) => (this.todoOrder.get(a.uid) ?? 1 / 0) - (this.todoOrder.get(d.uid) ?? 1 / 0)
          )), this.notify("Back on your list.", "success")) : (this.completionTimes[t.uid] = Date.now(), this.todos = this.todos.filter((a) => a.uid !== t.uid), this.completedTodos = [
            {
              ...t,
              status: "completed",
              completed: (/* @__PURE__ */ new Date()).toISOString()
            },
            ...this.completedTodos.filter((a) => a.uid !== t.uid)
          ], this.notify("Checked off.", "success"), this.undoItem = t), this.saveCompletionTimes();
        },
        i,
        n
      );
    } catch {
      this.notify("Couldn’t update the list. Try again.", "error");
    } finally {
      this.busy = !1, this.pendingTodo = "", this.todoMutating = !1, this.todoRefreshPending && this.isConnected && this.loadTodos();
    }
  }
  async addTodo(t) {
    t.preventDefault();
    const e = this.draft.trim();
    if (!e || this.busy || !this.todoSupports(1)) return;
    const i = this.todoEntity;
    if (i) {
      this.busy = !0;
      try {
        if (await this.hass.callService("todo", "add_item", {
          entity_id: i,
          item: e
        }), i !== this.todoEntity || (this.draft = "", await this.loadTodos(), i !== this.todoEntity || !this.isConnected)) return;
        this.notify("Added to your list.", "success");
      } catch {
        this.notify("Couldn’t add that item. Try again.", "error");
      } finally {
        this.busy = !1;
      }
    }
  }
  chooseAppearance(t) {
    if (Mt.includes(t)) {
      try {
        localStorage.setItem(this.appearanceKey, t);
      } catch {
      }
      this.config = { ...this.config, appearance: t }, this.applyAppearance();
    }
  }
  navigate(t) {
    t !== this.tab && (this.pageTravel = z.findIndex((e) => e.id === t) > z.findIndex((e) => e.id === this.tab) ? 12 : -12, t !== this.tab && history.pushState(history.state, "", `#signal/${t}`), this.tab = t, this.resetScroll());
  }
  resetScroll() {
    this.updateComplete.then(
      () => this.renderRoot.querySelector("main")?.scrollTo({ top: 0 })
    );
  }
  nav(t = !1) {
    return r`<nav
      class=${t ? "bottom-nav" : ""}
      style=${`--active: ${z.findIndex((e) => e.id === this.tab)}`}
      aria-label=${t ? "Mobile navigation" : "Dashboard navigation"}
    >
      ${t ? r`<span class="nav-indicator" aria-hidden="true"></span>` : h}
      ${z.map((e) => r`<button aria-current=${this.tab === e.id ? "page" : h} @click=${() => this.navigate(e.id)}>${g(e.icon)}<span>${e.name}</span></button>`)}
    </nav>`;
  }
  get sensors() {
    return (this.config.sensors || []).map(Rt);
  }
  get safetySummary() {
    const t = this.sensors, e = t.filter(
      (s) => this.state(s.entity)?.state === "on"
    ).length, i = t.filter((s) => !$(this.state(s.entity))).length;
    return {
      alarm: e,
      unknown: i,
      text: e ? `${e} sensor${e > 1 ? "s" : ""} need attention` : i ? `${i} sensor${i > 1 ? "s" : ""} unavailable` : t.length ? "Sensors clear" : "Make yourself at home"
    };
  }
  climate(t = !1) {
    const e = this.state(this.config.climate);
    if (!this.config.climate)
      return r`<section class="panel mint climate">
        <div class="panel-label">${g("climate")} Climate</div>
        <h2 style="margin-top:40px">Comfort starts here.</h2>
        <p>
          Choose a climate entity in the card editor to bring your home’s
          temperature into focus.
        </p>
      </section>`;
    const i = $(e), s = e?.attributes || {}, n = y(s.current_temperature), a = y(s.target_temp_low), d = y(s.target_temp_high), l = i && e.state === "heat_cool" && a !== void 0 && d !== void 0 && ((y(s.supported_features) ?? 0) & 2) !== 0, p = l ? this.rangeSide === "low" ? a : d : y(s.temperature), u = l && this.rangeSide === "high" ? a : y(s.min_temp) ?? 7, c = l && this.rangeSide === "low" ? d : y(s.max_temp) ?? 35, m = y(s.target_temp_step) || (this.hass?.config?.unit_system?.temperature === "°F" ? 1 : 0.5), f = this.hass?.config?.unit_system?.temperature || "°", v = p ?? n, b = v === void 0 ? 0 : Math.max(
      0,
      Math.min(
        1,
        (v - (y(s.min_temp) ?? 7)) / Math.max(
          1,
          (y(s.max_temp) ?? 35) - (y(s.min_temp) ?? 7)
        )
      )
    ), x = i && p !== void 0 && (l || ((y(s.supported_features) ?? 0) & 1) !== 0) && e.state !== "off", w = (E) => {
      if (!x || p === void 0) return;
      const tt = Number(
        Math.max(u, Math.min(c, p + E)).toFixed(2)
      ), jt = l ? {
        target_temp_low: this.rangeSide === "low" ? tt : a,
        target_temp_high: this.rangeSide === "high" ? tt : d
      } : { temperature: tt };
      this.service("climate", "set_temperature", {
        entity_id: this.config.climate,
        ...jt
      });
    }, P = Array.isArray(s.hvac_modes) ? s.hvac_modes : [];
    return r`<section
      class="panel mint climate"
      aria-label="Climate control"
    >
      <div class="panel-top">
        <span class="panel-label">${g("climate")} Home climate</span
        ><button
          class="icon-button"
          aria-label="Climate details"
          ?hidden=${t}
          @click=${() => this.moreInfo(this.config.climate)}
        >
          ${g("arrow")}
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
            stroke-dasharray=${`${b * 476} 635`}
            stroke-linecap="round"
            class="dial-fill"
          />
        </svg>
        <div class="dial-center">
          <div class="dial-mode">
            ${i ? k(s.hvac_action || e.state) : "Unavailable"}
          </div>
          <div class="dial-value" aria-live="polite">
            ${Et(v, r`<span class="value-in">${i ? this.format(v, 1) : "—"}</span>`)}<sup
              >${f}</sup
            >
          </div>
          <div class="dial-caption">
            ${i ? l ? this.rangeSide === "low" ? "Heat below" : "Cool above" : p !== void 0 ? "Target temperature" : "Current temperature" : "Waiting for your thermostat"}
          </div>
        </div>
      </div>
      <div class="stepper">
        <button
          aria-label="Decrease target temperature"
          ?disabled=${!x || this.busy || p <= u}
          @click=${() => w(-m)}
        >
          ${g("minus")}</button
        ><span
          >${i ? `${this.format(n, 1)}${f} inside` : "No reading"}</span
        ><button
          aria-label="Increase target temperature"
          ?disabled=${!x || this.busy || p >= c}
          @click=${() => w(m)}
        >
          ${g("plus")}
        </button>
      </div>
      ${l ? r`<div class="range-tabs" aria-label="Temperature range"><button aria-pressed=${this.rangeSide === "low"} @click=${() => this.rangeSide = "low"}>Heat ${this.format(a, 1)}°</button><button aria-pressed=${this.rangeSide === "high"} @click=${() => this.rangeSide = "high"}>Cool ${this.format(d, 1)}°</button></div>` : h}
      <div class="climate-foot">
        <span
          >${g("drop")}
          ${this.format(this.state(this.config.humidity)?.state ?? s.current_humidity)}%
          humidity</span
        >${P.length ? r`<select
                aria-label="HVAC mode"
                .value=${U(e?.state || "")}
                ?disabled=${!i || this.busy}
                @change=${(E) => this.service("climate", "set_hvac_mode", { entity_id: this.config.climate, hvac_mode: E.target.value })}
              >
                ${P.map((E) => r`<option value=${E} .selected=${U(E === e?.state)}>${Ot[E] || k(E)}</option>`)}
              </select>` : h}
      </div>
    </section>`;
  }
  weather(t = !1) {
    const e = this.state(this.config.weather), i = $(e), s = e?.attributes || {}, n = s.temperature_unit || this.hass?.config?.unit_system?.temperature || "°";
    return r`<section class="panel lilac weather">
      <div class="panel-top">
        <span class="panel-label">${g("sun")} Outside</span
        >${this.config.weather && !t ? r`<button class="icon-button" aria-label="Weather details" @click=${() => this.moreInfo(this.config.weather)}>${g("arrow")}</button>` : h}
      </div>
      <div class="weather-content">
        <div>
          <div class="weather-temp">
            ${i ? this.format(s.temperature) : "—"}<span
              style="font-size:27px;vertical-align:top;position:relative;top:9px;letter-spacing:-1px"
              >${n}</span
            >
          </div>
          <div class="weather-condition">
            ${i ? k(e.state) : "Weather unavailable"}
          </div>
        </div>
        <div
          class=${`weather-art ${e?.state === "clear-night" ? "night" : ""} ${e?.state?.includes("rain") ? "rain" : ""}`}
          aria-hidden="true"
        >
          <div class="sun-disc"></div>
          ${["sunny", "clear-night"].includes(e?.state || "") ? h : r`<div class="cloud"></div>`}
        </div>
      </div>
      <div class="weather-details">
        <span>Humidity ${i ? this.format(s.humidity) : "—"}%</span
        ><span
          >Wind ${i ? this.format(s.wind_speed) : "—"}
          ${s.wind_speed_unit || ""}</span
        >
      </div>
    </section>`;
  }
  get canDeleteTodo() {
    return this.todoSupports(2);
  }
  todoSupports(t) {
    const e = this.hass.states[this.todoEntity || ""];
    return $(e) && !!(Number(e?.attributes.supported_features) & t);
  }
  todoRow(t, e = !1) {
    return r`<div
      class=${`todo-row ${e ? "completed-row" : ""}`}
      data-todo-uid=${t.uid}
      aria-busy=${this.pendingTodo === t.uid}
      data-todo-motion=${`row:${t.uid}`}
    >
      <button
        class="check-button"
        ?disabled=${this.busy || !this.todoSupports(4)}
        aria-label=${`${e ? "Restore" : "Complete"} ${t.summary}`}
        @click=${() => this.complete(t, e)}
      >
        <span class="check-box">${e ? g("check") : h}</span>
      </button>
      <span class="todo-label">${t.summary}</span>
      <button
        class="todo-trash"
        ?disabled=${this.busy || !this.canDeleteTodo}
        aria-label=${`Delete ${t.summary}`}
        title="Delete permanently"
        @click=${() => this.askDelete(t)}
      >
        ${g("trash")}
      </button>
    </div>`;
  }
  todoListPicker() {
    return this.todoLists.length < 2 ? h : r`<div
      class="list-switcher"
      role="group"
      aria-label="Your to-do lists"
    >
      ${this.todoLists.map(
      (t) => r`<button
            aria-label=${`Open list ${this.listName(t.entity_id)}`}
            aria-pressed=${t.entity_id === this.todoEntity}
            ?disabled=${this.busy}
            @click=${() => this.chooseTodo(t.entity_id)}
          >
            ${g("list")}<span>${this.listName(t.entity_id)}</span>
            <small>${$(t) ? t.state : "Offline"}</small>
          </button>`
    )}
    </div>`;
  }
  grocery(t = !1) {
    return r`<section
      class="panel apricot groceries"
      aria-busy=${this.todoLoading}
    >
      <div class="panel-top">
        <span class="panel-label">${g("list")} ${this.todoName}</span
        >${t ? r`<button class="icon-button" aria-label="Refresh list" @click=${() => this.loadTodos()}>${g("list")}</button>` : r`<button class="icon-button" aria-label="Open to-do lists" @click=${() => this.navigate("lists")}>${g("arrow")}</button>`}
      </div>
      ${this.todoEntity ? this.todoError && !this.todoLoaded ? r`<button class="text-button" @click=${() => this.loadTodos()}>
                ${this.todoError}
              </button>` : r`<div class="list-preview">
                ${this.todos.length ? Tt(
      t ? this.todos : this.todos.slice(0, 2),
      (e) => e.uid,
      (e) => this.todoRow(e)
    ) : this.todoLoading && !this.todoLoaded ? r`<div
                          class="list-loading"
                          role="status"
                          aria-label="Loading list"
                        >
                          <div class="loading-row" aria-hidden="true"></div>
                          <div class="loading-row" aria-hidden="true"></div>
                          <div class="loading-row" aria-hidden="true"></div>
                        </div>` : r`<div class="empty">
                          All caught up. Room for something good.
                        </div>`}
              </div>` : r`<p class="empty">
              No to-do lists are available. Add a list in Home Assistant and it
              will appear here.
            </p>`}
      ${t && this.todoEntity ? r`<form class="todo-form" data-todo-motion="form" @submit=${this.addTodo}><input aria-label="New task" placeholder="Add something good…" maxlength="255" ?disabled=${!this.todoSupports(1)} .value=${this.draft} @input=${(e) => this.draft = e.target.value} /><button aria-label="Add task" ?disabled=${this.busy || !this.draft.trim() || !this.todoSupports(1)}>${g("plus")}</button></form>` : r`<button class="text-button" @click=${() => this.navigate("lists")}>${this.todos.length ? `${this.todos.length} things on your list` : "Open your list"} ${g("arrow")}</button>`}
      ${this.todoError && this.todoLoaded ? r`<button class="text-button" @click=${() => this.loadTodos()}>Couldn’t refresh. Showing the last loaded list. Retry</button>` : h}
      ${t && (!this.todoError || this.todoLoaded) ? this.completedList() : h}
    </section>`;
  }
  completedList() {
    if (!this.completedTodos.length) return h;
    const t = Date.now() - 864e5, e = [...this.completedTodos].sort(
      (a, d) => this.completedAt(d) - this.completedAt(a)
    ), i = e.filter((a) => this.completedAt(a) > t), s = e.filter((a) => this.completedAt(a) <= t), n = (a) => Tt(
      a,
      (d) => d.uid,
      (d) => this.todoRow(d, !0)
    );
    return r`<div class="completed-list">
      <h3 data-todo-motion="completed-heading">
        Recently completed <span>${i.length}</span>
      </h3>
      <p data-todo-motion="completed-help">
        Tap a check to put it back. After 24 hours, items move to Older
        completed.
      </p>
      ${this.config.completed_retention_days && this.todoEntity === this.config.todo ? r`<p data-todo-motion="retention">HA automatically deletes timestamped completed items after ${this.config.completed_retention_days} days. Restore anything you still need before then.</p>` : h}
      ${n(i)}
      ${s.length ? r`<details>
              <summary data-todo-motion="older-heading">
                Older completed · ${s.length}
              </summary>
              ${n(s)}
            </details>` : h}
      ${e.some((a) => !a.completed || !Number.isFinite(Date.parse(a.completed))) ? r`<small>For items without a completion time, the 24 hours starts when this device first sees them completed.</small>` : h}
    </div>`;
  }
  safety() {
    return this.sensors.length ? r`<div class="sensors">
      ${this.sensors.map((t) => {
      const e = this.state(t.entity), i = $(e), s = e?.state === "on", n = e?.attributes.device_class, a = i ? s ? n === "moisture" ? "Water detected" : n === "opening" || n === "door" || n === "window" ? "Open" : "Detected" : n === "moisture" ? "Dry" : n === "opening" || n === "door" || n === "window" ? "Closed" : "Clear" : "Unavailable", d = this.state(t.battery), l = $(d) ? y(d.state) : void 0;
      return r`<button
          class="sensor"
          @click=${() => this.moreInfo(t.entity)}
        >
          <div class="sensor-head">
            <span
              class=${`sensor-symbol ${i ? s ? "bad" : "" : "unknown"}`}
              >${g(i ? s ? "warn" : n === "moisture" ? "drop" : "shield" : "warn")}</span
            ><span class="sensor-state">${a}</span>
          </div>
          <div>
            <div class="sensor-name">
              ${t.name || e?.attributes.friendly_name || t.entity}
            </div>
            <div class="sensor-sub">
              ${t.battery ? l !== void 0 ? `${l}% battery${l < 20 ? " · Low battery" : ""}` : "Battery unavailable" : "Tap for details"}
            </div>
          </div>
        </button>`;
    })}
    </div>` : r`<div class="notice">
        Add your water, smoke, or opening sensors in the card editor. Their
        actual state will appear here.
      </div>`;
  }
  favorites() {
    return this.config.favorites?.length ? r`<div class="section-top">
        <h2>Your shortcuts</h2>
        <small>A little less effort.</small>
      </div>
      <div class="favorites">
        ${this.config.favorites.map((t) => r`<signal-control
            .hass=${this.hass}
            .configuration=${{ type: "custom:signal-control", entity: t, appearance: this.dark ? "dark" : "light" }}
          ></signal-control>`)}
      </div>` : h;
  }
  graphs(t = !1) {
    return this.config.graphs?.length ? r`<div class="section-top">
        <h2>The bigger picture</h2>
        <small>Explore your history.</small>
      </div>
      <div class="grid">
        ${this.config.graphs.map((e, i) => {
      const s = typeof e == "string" ? { entity: e } : e;
      return r`<signal-graph
            .suspended=${t}
            .hass=${this.hass}
            .configuration=${{ ...s, type: "custom:signal-graph", accent: i % 2 ? "mint" : "lilac", appearance: this.dark ? "dark" : "light" }}
          ></signal-graph>`;
    })}
      </div>` : h;
  }
  content() {
    return this.tab === "climate" ? r`<div class="grid detail-grid">
          ${this.climate()}
          <div class="stack">
            ${this.weather()}
            <section class="panel lime">
              <div class="panel-label">${g("drop")} Inside humidity</div>
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
        </div>
        ${this.graphs()}` : this.tab === "safety" ? r`${this.safety()}
        <div class="notice" style="margin-top:20px">
          ${this.safetySummary.alarm ? "A sensor is reporting an active state. Open it for details." : this.safetySummary.unknown ? "An unavailable sensor cannot confirm the condition of its space." : "Tap any sensor for its history and details."}
        </div>` : this.tab === "lists" ? r`<div style="max-width:740px">
        ${this.todoListPicker()}${this.grocery(!0)}
      </div>` : this.narrow ? this.pocketOverview() : r`<div class="grid">
        ${this.climate()}
        <div class="stack">${this.weather()}${this.grocery()}</div>
      </div>
      ${this.favorites()}
      <div class="section-top">
        <h2>Around the house</h2>
        <button class="text-button" @click=${() => this.navigate("safety")}>
          All sensors ${g("arrow")}
        </button>
      </div>
      ${this.safety()}`;
  }
  pocketOverview() {
    const t = this.state(this.config.climate), e = t?.attributes || {}, i = $(t), s = this.state(this.config.weather), n = s?.attributes || {}, a = $(s), d = this.hass.config?.unit_system?.temperature || "°", l = y(
      this.state(this.config.humidity)?.state ?? e.current_humidity
    ), p = this.safetySummary, u = i ? t.state === "off" ? "Climate is off" : t.state === "heat_cool" ? `Heat ${this.format(e.target_temp_low)}° · Cool ${this.format(e.target_temp_high)}°` : `${Ot[t.state] || k(t.state)} · Target ${this.format(e.temperature)}°` : this.config.climate ? "Controls unavailable" : "Choose a climate entity in the editor", c = this.state(this.todoEntity), m = $(c) ? y(c.state) : void 0;
    return r`<div class="pocket-overview">
      <button
        class="pocket-tile comfort-tile mint"
        aria-label="Climate details"
        ?disabled=${!this.config.climate}
        @click=${() => this.moreInfo(this.config.climate)}
      >
        <span class="tile-top"
          ><span class="tile-label">${g("climate")} Inside</span
          ><span class="live-chip"
            >${i ? k(e.hvac_action || t.state) : "Unavailable"}</span
          ></span
        >
        <span class="comfort-reading"
          ><span class="pocket-temperature"
            >${i ? this.format(e.current_temperature) : "—"}<small
              >${d}</small
            ></span
          ><span class="comfort-orbit" aria-hidden="true"
            ><i></i><i></i><span>${g("home")}</span></span
          ></span
        >
        <span class="tile-bottom"
          ><span
            ><strong>${u}</strong
            ><small
              >${l !== void 0 ? `${this.format(l)}% humidity` : "Humidity unavailable"}</small
            ></span
          ><span class="tile-arrow">${g("arrow")}</span></span
        >
      </button>
      <div class="pocket-pair">
        <button
          class="pocket-tile outside-tile lilac"
          aria-label="Weather details"
          ?disabled=${!this.config.weather}
          @click=${() => this.moreInfo(this.config.weather)}
        >
          <span class="tile-top"
            ><span class="tile-label">Outside</span
            >${g(s?.state === "clear-night" ? "moon" : s?.state === "sunny" ? "sun" : s?.state?.includes("rain") ? "drop" : s?.state?.includes("wind") ? "wind" : "cloud")}</span
          >
          <span class="pocket-reading"
            >${a ? this.format(n.temperature) : "—"}<small
              >${n.temperature_unit || d}</small
            ></span
          ><span class="tile-bottom"
            ><span class="tile-caption"
              >${a ? k(s.state) : this.config.weather ? "Unavailable" : "Choose weather in editor"}</span
            >${g("arrow")}</span
          >
        </button>
        <button
          class="pocket-tile list-tile apricot"
          aria-label="Open to-do lists"
          @click=${() => this.navigate("lists")}
        >
          <span class="tile-top"
            ><span class="tile-label">${this.todoName}</span
            >${g("list")}</span
          ><span class="pocket-reading"
            >${m === void 0 ? "—" : m}<small
              >${m === 1 ? "item" : "items"}</small
            ></span
          ><span class="tile-bottom"
            ><span class="tile-caption"
              >${this.todoError ? "Tap to retry" : m === void 0 ? "Open your list" : m === 0 ? "All caught up" : this.todos[0]?.summary || "Ready when you are"}</span
            >${g("arrow")}</span
          >
        </button>
      </div>
      <button
        class=${`home-signal ${p.alarm ? "attention" : p.unknown ? "uncertain" : ""}`}
        @click=${() => this.navigate("safety")}
        aria-label=${`Home status: ${p.text}`}
      >
        <span class="signal-symbol"
          >${g(p.alarm || p.unknown ? "warn" : "shield")}</span
        ><span
          ><strong>${p.text}</strong
          ><small
            >${p.alarm ? "Take a closer look" : p.unknown ? "Some spaces cannot be checked" : this.sensors.length ? "Your sensors, together" : "Choose sensors in the editor"}</small
          ></span
        >${g("arrow")}
      </button>
      ${this.favorites()}
      <div class="section-top">
        <h2>Around the house</h2>
        <small>${this.sensors.length} sensors</small>
      </div>
      ${this.safety()}
    </div>`;
  }
  appHeader(t) {
    const e = qt(t, this.hass.config?.time_zone), i = `Good ${e < 12 ? "morning" : e < 18 ? "afternoon" : "evening"}.`;
    return r`<header
      class=${`app-header ${this.contentScrolled ? "scrolled" : ""}`}
    >
      <div class="header-context">
        <span class="header-title"
          >${this.config.header_label || i}</span
        >
        <span class="header-subtitle"
          >${this.config.title || "Home"} ·
          ${t.toLocaleDateString(this.hass.locale?.language || void 0, { weekday: "short", month: "short", day: "numeric", timeZone: this.hass.config?.time_zone })}</span
        >
      </div>
      <div class="header-right">
        <button
          class="icon-button"
          aria-label="Open Signal menu"
          @click=${() => this.menuOpen = !0}
        >
          ${g("settings")}
        </button>
      </div>
    </header>`;
  }
  render() {
    if (!this.hass)
      return r`<div class="notice" role="status">Connecting to home…</div>`;
    const t = /* @__PURE__ */ new Date(), e = this.config.greeting || "Home, at a glance.", i = this.tab === "home" ? e : this.tab === "climate" ? "Just your temperature." : this.tab === "safety" ? "Peace of mind." : "Good things, listed.", s = this.tab === "home" ? "Your home, at a glance." : this.tab === "climate" ? "Find your comfortable." : this.tab === "safety" ? "A clear view of the things that matter." : "A little space for everyday essentials.", n = this.safetySummary, a = new URL(location.href);
    a.searchParams.set("disable_km", ""), a.hash = "";
    const d = this.sensors.find((l) => l.entity === this.detailEntity);
    return r`<div
      class=${`app ${this.dark ? "dark" : ""} ${this.immersive ? "immersive" : ""} ${this.tab === "home" ? "overview-page" : ""}`}
    >
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
      ${this.narrow ? this.appHeader(t) : h}
      <main @scroll=${this.onContentScroll}>
        ${this.narrow ? h : this.appHeader(t)}
        <div class="page-heading">
          <div>
            <h1>${i}</h1>
            <p class="intro">${s}</p>
          </div>
          <div class=${`status-pill ${n.alarm ? "alert" : ""}`}>
            <span class="dot"></span>${n.text}
          </div>
        </div>
        ${Et(this.tab, r`<div class="page" style=${`--page-travel:${this.pageTravel}px`}>${this.content()}</div>`)}
        <footer class="footer">
          <span
            >Signal Home <span style="opacity:.5">/</span> made for living</span
          >
        </footer>
      </main>
      ${this.nav(!0)}${this.message ? r`<div class=${`toast ${this.messageTone}`} role="status">${this.messageTone !== "neutral" ? r`<span class="toast-mark" aria-hidden="true">${g(this.messageTone === "success" ? "check" : "warn")}</span>` : h}<span class="toast-copy">${this.message}</span>${this.undoItem ? r`<button ?disabled=${this.busy} @click=${() => this.undoItem && this.complete(this.undoItem, !0)}>Undo</button>` : h}</div>` : h}
      <signal-sheet
        .open=${this.menuOpen}
        heading="Your place. Your way."
        .dark=${this.dark}
        @signal-close=${() => this.menuOpen = !1}
      >
        <div class="signal-menu">
          <p class="menu-intro">
            Signed in as ${this.hass.user?.name || "you"}. Your home is still
            powered by Home Assistant.
          </p>
          <label class="appearance-setting"
            >Appearance
            <select
              aria-label="Appearance"
              .value=${this.appearance}
              @change=${(l) => this.chooseAppearance(l.target.value)}
            >
              <option value="auto">Auto · day / night</option>
              <option value="system">System · device default</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
            <small
              >Auto: light 7am–7pm, dark overnight
              (${this.hass.config?.time_zone || "device time"}). Saved on this
              device.</small
            >
          </label>
          <a href="/profile"
            >${g("home")}<span
              >Account & sign out<small>Your profile and session</small></span
            >${g("arrow")}</a
          >
          ${this.hass.user?.is_admin ? r`<a href="/config/dashboard"
                  >${g("settings")}<span
                    >Home Assistant settings<small
                      >Devices, integrations, and administration</small
                    ></span
                  >${g("arrow")}</a
                >` : h}
          <a
            href=${a.pathname + a.search}
            @click=${(l) => {
      l.preventDefault(), l.stopPropagation(), window.location.assign(a.pathname + a.search);
    }}
            >${g("arrow")}<span
              >Open standard Home Assistant<small
                >Restore the header, sidebar, and dashboard editor</small
              ></span
            ></a
          >
          <p class="menu-footnote">
            Need a recovery route? Add <code>?disable_km</code> to this
            dashboard’s address. Your login and permissions stay with Home
            Assistant.
          </p>
        </div>
      </signal-sheet>
      <signal-sheet
        id="delete-sheet"
        .compact=${!0}
        .open=${!!this.deleteTarget}
        heading="Delete permanently?"
        .dark=${this.dark}
        @signal-close=${() => {
      const l = this.deleteTarget && ![...this.todos, ...this.completedTodos].some(
        (p) => p.uid === this.deleteTarget.item.uid
      );
      this.deleteTarget = void 0, this.deleteError = "", l && this.tab === "lists" && this.renderRoot.querySelector('[aria-label="Refresh list"]')?.focus({ preventScroll: !0 });
    }}
      >
        <div class="delete-confirmation">
          <div class="delete-symbol" aria-hidden="true">${g("trash")}</div>
          <p class="delete-item">${this.deleteTarget?.item.summary}</p>
          <p class="delete-list-name">
            ${this.deleteTarget ? this.listName(this.deleteTarget.entity) : ""}
          </p>
          <p>
            This removes the item from the shared list for everyone. It can’t be
            undone.
          </p>
          ${this.deleteError ? r`<p class="delete-error" role="alert">${this.deleteError}</p>` : h}
          <div class="delete-actions">
            <button ?disabled=${this.busy} @click=${this.closeDelete}>
              Keep item
            </button>
            <button
              class="delete-accept"
              ?disabled=${this.busy}
              @click=${this.deleteTodo}
            >
              ${this.busy ? "Deleting…" : "Delete permanently"}
            </button>
          </div>
        </div>
      </signal-sheet>
      <signal-details
        .hass=${this.hass}
        .entity=${this.detailEntity}
        .dark=${this.dark}
        .name=${this.detailEntity === this.config.climate ? "Climate" : this.detailEntity === this.config.weather ? "Weather" : d?.name || ""}
        .battery=${d?.battery || ""}
        .custom=${!!this.detailEntity && [this.config.climate, this.config.weather].includes(this.detailEntity)}
        @signal-opened=${() => this.detailReady = !0}
        @signal-close=${() => {
      this.detailEntity = "", this.detailReady = !1;
    }}
      >
        ${this.detailEntity === this.config.climate ? r`<div class="sheet-custom">
                ${this.climate(!0)}${this.message ? r`<p role="status">${this.message}</p>` : h}${this.graphs(!this.detailReady)}
              </div>` : this.detailEntity === this.config.weather ? r`<div class="sheet-custom">
                  ${this.weather(!0)}
                  <p class="intro">
                    Current conditions from your weather provider.
                  </p>
                </div>` : h}
      </signal-details>
    </div>`;
  }
}
customElements.get("signal-home") || customElements.define("signal-home", Ce);
const G = window;
G.customCards = G.customCards || [];
G.customCards.push({
  type: "signal-home",
  name: "Signal Home",
  description: "A colorful, fluid home dashboard with climate, weather, groceries and safety.",
  preview: !0,
  documentationURL: "https://github.com/gkgkgkgk/signal-home"
});
G.customCards.push(
  {
    type: "signal-control",
    name: "Signal Control",
    description: "Tactile switches, dimmers, media, covers, fans, scenes, locks, and numeric/select controls.",
    preview: !0,
    documentationURL: "https://github.com/gkgkgkgk/signal-home"
  },
  {
    type: "signal-graph",
    name: "Signal Graph",
    description: "Interactive recorded history with a cursor, time ranges, and honest data gaps.",
    preview: !0,
    documentationURL: "https://github.com/gkgkgkgk/signal-home"
  },
  {
    type: "signal-metric",
    name: "Signal Metric",
    description: "A bold sensor readout with an optional range meter.",
    preview: !0,
    documentationURL: "https://github.com/gkgkgkgk/signal-home"
  }
);
export {
  Ce as SignalHome
};
