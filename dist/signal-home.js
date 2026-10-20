const vt = globalThis, Ht = vt.ShadowRoot && (vt.ShadyCSS === void 0 || vt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Pt = /* @__PURE__ */ Symbol(), Yt = /* @__PURE__ */ new WeakMap();
let fe = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== Pt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Ht && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = Yt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Yt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ae = (n) => new fe(typeof n == "string" ? n : n + "", void 0, Pt), T = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, s, a) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[a + 1], n[0]);
  return new fe(e, n, Pt);
}, Se = (n, t) => {
  if (Ht) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = vt.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, n.appendChild(i);
  }
}, Kt = Ht ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Ae(e);
})(n) : n;
const { is: Ee, defineProperty: Te, getOwnPropertyDescriptor: Ce, getOwnPropertyNames: ze, getOwnPropertySymbols: Me, getPrototypeOf: De } = Object, kt = globalThis, Gt = kt.trustedTypes, Re = Gt ? Gt.emptyScript : "", Le = kt.reactiveElementPolyfillSupport, ct = (n, t) => n, Ot = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? Re : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, be = (n, t) => !Ee(n, t), Xt = { attribute: !0, type: String, converter: Ot, reflect: !1, useDefault: !1, hasChanged: be };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), kt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let et = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Xt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && Te(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: a } = Ce(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: s, set(o) {
      const d = s?.call(this);
      a?.call(this, o), this.requestUpdate(t, d, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Xt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ct("elementProperties"))) return;
    const t = De(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ct("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ct("properties"))) {
      const e = this.properties, i = [...ze(e), ...Me(e)];
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
      for (const s of i) e.unshift(Kt(s));
    } else t !== void 0 && e.push(Kt(t));
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
    return Se(t, this.constructor.elementStyles), t;
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
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : Ot).toAttribute(e, i.type);
      this._$Em = t, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), o = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : Ot;
      this._$Em = s;
      const d = o.fromAttribute(e, a.type);
      this[s] = d ?? this._$Ej?.get(s) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, a) {
    if (t !== void 0) {
      const o = this.constructor;
      if (s === !1 && (a = this[t]), i ??= o.getPropertyOptions(t), !((i.hasChanged ?? be)(a, e) || i.useDefault && i.reflect && a === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: a }, o) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), a !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [s, a] of this._$Ep) this[s] = a;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, a] of i) {
        const { wrapped: o } = a, d = this[s];
        o !== !0 || this._$AL.has(s) || d === void 0 || this.C(s, void 0, a, d);
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
et.elementStyles = [], et.shadowRootOptions = { mode: "open" }, et[ct("elementProperties")] = /* @__PURE__ */ new Map(), et[ct("finalized")] = /* @__PURE__ */ new Map(), Le?.({ ReactiveElement: et }), (kt.reactiveElementVersions ??= []).push("2.1.2");
const Ut = globalThis, Jt = (n) => n, xt = Ut.trustedTypes, Qt = xt ? xt.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, ve = "$lit$", B = `lit$${Math.random().toFixed(9).slice(2)}$`, xe = "?" + B, Oe = `<${xe}>`, J = document, ht = () => J.createComment(""), pt = (n) => n === null || typeof n != "object" && typeof n != "function", qt = Array.isArray, Ne = (n) => qt(n) || typeof n?.[Symbol.iterator] == "function", Mt = `[ 	
\f\r]`, ot = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, te = /-->/g, ee = />/g, Y = RegExp(`>|${Mt}(?:([^\\s"'>=/]+)(${Mt}*=${Mt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ie = /'/g, se = /"/g, ye = /^(?:script|style|textarea|title)$/i, we = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), l = we(1), W = we(2), I = /* @__PURE__ */ Symbol.for("lit-noChange"), p = /* @__PURE__ */ Symbol.for("lit-nothing"), ae = /* @__PURE__ */ new WeakMap(), X = J.createTreeWalker(J, 129);
function $e(n, t) {
  if (!qt(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Qt !== void 0 ? Qt.createHTML(t) : t;
}
const Ie = (n, t) => {
  const e = n.length - 1, i = [];
  let s, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = ot;
  for (let d = 0; d < e; d++) {
    const r = n[d];
    let c, u, h = -1, m = 0;
    for (; m < r.length && (o.lastIndex = m, u = o.exec(r), u !== null); ) m = o.lastIndex, o === ot ? u[1] === "!--" ? o = te : u[1] !== void 0 ? o = ee : u[2] !== void 0 ? (ye.test(u[2]) && (s = RegExp("</" + u[2], "g")), o = Y) : u[3] !== void 0 && (o = Y) : o === Y ? u[0] === ">" ? (o = s ?? ot, h = -1) : u[1] === void 0 ? h = -2 : (h = o.lastIndex - u[2].length, c = u[1], o = u[3] === void 0 ? Y : u[3] === '"' ? se : ie) : o === se || o === ie ? o = Y : o === te || o === ee ? o = ot : (o = Y, s = void 0);
    const f = o === Y && n[d + 1].startsWith("/>") ? " " : "";
    a += o === ot ? r + Oe : h >= 0 ? (i.push(c), r.slice(0, h) + ve + r.slice(h) + B + f) : r + B + (h === -2 ? d : f);
  }
  return [$e(n, a + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class ut {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let a = 0, o = 0;
    const d = t.length - 1, r = this.parts, [c, u] = Ie(t, e);
    if (this.el = ut.createElement(c, i), X.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = X.nextNode()) !== null && r.length < d; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(ve)) {
          const m = u[o++], f = s.getAttribute(h).split(B), x = /([.?@])?(.*)/.exec(m);
          r.push({ type: 1, index: a, name: x[2], strings: f, ctor: x[1] === "." ? Pe : x[1] === "?" ? Ue : x[1] === "@" ? qe : _t }), s.removeAttribute(h);
        } else h.startsWith(B) && (r.push({ type: 6, index: a }), s.removeAttribute(h));
        if (ye.test(s.tagName)) {
          const h = s.textContent.split(B), m = h.length - 1;
          if (m > 0) {
            s.textContent = xt ? xt.emptyScript : "";
            for (let f = 0; f < m; f++) s.append(h[f], ht()), X.nextNode(), r.push({ type: 2, index: ++a });
            s.append(h[m], ht());
          }
        }
      } else if (s.nodeType === 8) if (s.data === xe) r.push({ type: 2, index: a });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(B, h + 1)) !== -1; ) r.push({ type: 7, index: a }), h += B.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const i = J.createElement("template");
    return i.innerHTML = t, i;
  }
}
function st(n, t, e = n, i) {
  if (t === I) return t;
  let s = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const a = pt(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== a && (s?._$AO?.(!1), a === void 0 ? s = void 0 : (s = new a(n), s._$AT(n, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = s : e._$Cl = s), s !== void 0 && (t = st(n, s._$AS(n, t.values), s, i)), t;
}
class He {
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
    const { el: { content: e }, parts: i } = this._$AD, s = (t?.creationScope ?? J).importNode(e, !0);
    X.currentNode = s;
    let a = X.nextNode(), o = 0, d = 0, r = i[0];
    for (; r !== void 0; ) {
      if (o === r.index) {
        let c;
        r.type === 2 ? c = new nt(a, a.nextSibling, this, t) : r.type === 1 ? c = new r.ctor(a, r.name, r.strings, this, t) : r.type === 6 && (c = new je(a, this, t)), this._$AV.push(c), r = i[++d];
      }
      o !== r?.index && (a = X.nextNode(), o++);
    }
    return X.currentNode = J, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class nt {
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
    t = st(this, t, e), pt(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== I && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ne(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && pt(this._$AH) ? this._$AA.nextSibling.data = t : this.T(J.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = ut.createElement($e(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(e);
    else {
      const a = new He(s, this), o = a.u(this.options);
      a.p(e), this.T(o), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = ae.get(t.strings);
    return e === void 0 && ae.set(t.strings, e = new ut(t)), e;
  }
  k(t) {
    qt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const a of t) s === e.length ? e.push(i = new nt(this.O(ht()), this.O(ht()), this, this.options)) : i = e[s], i._$AI(a), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = Jt(t).nextSibling;
      Jt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class _t {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, a) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = p;
  }
  _$AI(t, e = this, i, s) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) t = st(this, t, e, 0), o = !pt(t) || t !== this._$AH && t !== I, o && (this._$AH = t);
    else {
      const d = t;
      let r, c;
      for (t = a[0], r = 0; r < a.length - 1; r++) c = st(this, d[i + r], e, r), c === I && (c = this._$AH[r]), o ||= !pt(c) || c !== this._$AH[r], c === p ? t = p : t !== p && (t += (c ?? "") + a[r + 1]), this._$AH[r] = c;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Pe extends _t {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Ue extends _t {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class qe extends _t {
  constructor(t, e, i, s, a) {
    super(t, e, i, s, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = st(this, t, e, 0) ?? p) === I) return;
    const i = this._$AH, s = t === p && i !== p || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, a = t !== p && (i === p || s);
    s && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class je {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    st(this, t);
  }
}
const Fe = { I: nt }, We = Ut.litHtmlPolyfillSupport;
We?.(ut, nt), (Ut.litHtmlVersions ??= []).push("3.3.3");
const Be = (n, t, e) => {
  const i = e?.renderBefore ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const a = e?.renderBefore ?? null;
    i._$litPart$ = s = new nt(t.insertBefore(ht(), a), a, void 0, e ?? {});
  }
  return s._$AI(n), s;
};
const jt = globalThis;
let C = class extends et {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Be(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return I;
  }
};
C._$litElement$ = !0, C.finalized = !0, jt.litElementHydrateSupport?.({ LitElement: C });
const Ze = jt.litElementPolyfillSupport;
Ze?.({ LitElement: C });
(jt.litElementVersions ??= []).push("4.2.2");
const G = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, Ft = (n) => (...t) => ({ _$litDirective$: n, values: t });
let Wt = class {
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
const { I: Ve } = Fe, ne = (n) => n, Ye = (n) => n.strings === void 0, oe = () => document.createComment(""), rt = (n, t, e) => {
  const i = n._$AA.parentNode, s = t === void 0 ? n._$AB : t._$AA;
  if (e === void 0) {
    const a = i.insertBefore(oe(), s), o = i.insertBefore(oe(), s);
    e = new Ve(a, o, n, n.options);
  } else {
    const a = e._$AB.nextSibling, o = e._$AM, d = o !== n;
    if (d) {
      let r;
      e._$AQ?.(n), e._$AM = n, e._$AP !== void 0 && (r = n._$AU) !== o._$AU && e._$AP(r);
    }
    if (a !== s || d) {
      let r = e._$AA;
      for (; r !== a; ) {
        const c = ne(r).nextSibling;
        ne(i).insertBefore(r, s), r = c;
      }
    }
  }
  return e;
}, K = (n, t, e = n) => (n._$AI(t, e), n), Ke = {}, Bt = (n, t = Ke) => n._$AH = t, Ge = (n) => n._$AH, Dt = (n) => {
  n._$AR(), n._$AA.remove();
};
const re = Ft(class extends Wt {
  constructor() {
    super(...arguments), this.key = p;
  }
  render(n, t) {
    return this.key = n, t;
  }
  update(n, [t, e]) {
    return t !== this.key && (Bt(n), this.key = t), e;
  }
});
const it = Ft(class extends Wt {
  constructor(n) {
    if (super(n), n.type !== G.PROPERTY && n.type !== G.ATTRIBUTE && n.type !== G.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!Ye(n)) throw Error("`live` bindings can only contain a single expression");
  }
  render(n) {
    return n;
  }
  update(n, [t]) {
    if (t === I || t === p) return t;
    const e = n.element, i = n.name;
    if (n.type === G.PROPERTY) {
      if (t === e[i]) return I;
    } else if (n.type === G.BOOLEAN_ATTRIBUTE) {
      if (!!t === e.hasAttribute(i)) return I;
    } else if (n.type === G.ATTRIBUTE && e.getAttribute(i) === t + "") return I;
    return Bt(n), t;
  }
});
const le = (n, t, e) => {
  const i = /* @__PURE__ */ new Map();
  for (let s = t; s <= e; s++) i.set(n[s], s);
  return i;
}, yt = Ft(class extends Wt {
  constructor(n) {
    if (super(n), n.type !== G.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(n, t, e) {
    let i;
    e === void 0 ? e = t : t !== void 0 && (i = t);
    const s = [], a = [];
    let o = 0;
    for (const d of n) s[o] = i ? i(d, o) : o, a[o] = e(d, o), o++;
    return { values: a, keys: s };
  }
  render(n, t, e) {
    return this.dt(n, t, e).values;
  }
  update(n, [t, e, i]) {
    const s = Ge(n), { values: a, keys: o } = this.dt(t, e, i);
    if (!Array.isArray(s)) return this.ut = o, a;
    const d = this.ut ??= [], r = [];
    let c, u, h = 0, m = s.length - 1, f = 0, x = a.length - 1;
    for (; h <= m && f <= x; ) if (s[h] === null) h++;
    else if (s[m] === null) m--;
    else if (d[h] === o[f]) r[f] = K(s[h], a[f]), h++, f++;
    else if (d[m] === o[x]) r[x] = K(s[m], a[x]), m--, x--;
    else if (d[h] === o[x]) r[x] = K(s[h], a[x]), rt(n, r[x + 1], s[h]), h++, x--;
    else if (d[m] === o[f]) r[f] = K(s[m], a[f]), rt(n, s[h], s[m]), m--, f++;
    else if (c === void 0 && (c = le(o, f, x), u = le(d, h, m)), c.has(d[h])) if (c.has(d[m])) {
      const g = u.get(o[f]), A = g !== void 0 ? s[g] : null;
      if (A === null) {
        const v = rt(n, s[h]);
        K(v, a[f]), r[f] = v;
      } else r[f] = K(A, a[f]), rt(n, s[h], A), s[g] = null;
      f++;
    } else Dt(s[m]), m--;
    else Dt(s[h]), h++;
    for (; f <= x; ) {
      const g = rt(n, r[x + 1]);
      K(g, a[f]), r[f++] = g;
    }
    for (; h <= m; ) {
      const g = s[h++];
      g !== null && Dt(g);
    }
    return this.ut = o, Bt(n, r), I;
  }
}), Xe = T`
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
      width: calc((100% - 14px - (var(--tab-count, 4) - 1) * 2px) / var(--tab-count, 4));
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
`, Je = T`
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
  .todo-edit {
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    overflow-wrap: anywhere;
    cursor: text;
  }
  .todo-edit:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
  .todo-edit-form {
    flex: 1;
    min-width: 0;
    display: flex;
  }
  .todo-edit-input {
    width: 100%;
    min-width: 0;
    margin: 3px 0;
    padding: 9px 12px;
    border: 1px solid #51352055;
    border-radius: 12px;
    background: #fffefa88;
    color: inherit;
    font: inherit;
    /* iOS zooms into inputs under 16px. */
    font-size: max(16px, 1em);
  }
  .todo-edit-input:focus {
    outline: 2px solid #513520;
    outline-offset: 1px;
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
      grid-template-rows: auto minmax(0, 1fr);
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
      padding: 19px 18px calc(112px + env(safe-area-inset-bottom, 0px));
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
      position: fixed;
      inset: auto;
      left: 50%;
      bottom: calc(12px + env(safe-area-inset-bottom, 0px));
      transform: translateX(-50%);
      width: min(calc(100% - 24px), 470px);
      max-width: none;
      margin: 0;
      border-radius: 28px;
      background: var(--surface);
      color: var(--muted);
      border: 1px solid var(--line);
      box-shadow: 0 8px 28px #00000020, 0 2px 6px #0000000a;
      padding: 7px;
      gap: 4px;
      min-height: 68px;
      z-index: 30;
      overscroll-behavior: none;
    }
    .nav-indicator {
      top: 7px;
      bottom: 7px;
      left: 7px;
      width: calc((100% - 14px - (var(--tab-count, 4) - 1) * 4px) / var(--tab-count, 4));
      border-radius: 21px;
      background: var(--mint);
      box-shadow: none;
      transform: translateX(calc(var(--active) * (100% + 4px)));
    }
    .bottom-nav button {
      padding: 8px 2px;
      border-radius: 18px;
      font-size: 10px;
      min-height: 52px;
    }
    .bottom-nav button[aria-current="page"] {
      color: #172d27;
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
`, At = T`
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
`, Qe = T`
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
let lt;
class ti {
  constructor() {
    this.metas = /* @__PURE__ */ new Map(), this.color = "", this.frame = 0;
  }
  sync(t, e) {
    if (lt && lt !== this) return;
    lt = this;
    const i = t ? "#1a2320" : "#f4f3ee", s = this.color !== i || this.bridge !== e;
    if (this.bridge = e, this.style || (this.style = document.createElement("style"), this.style.dataset.signalChrome = "", document.head.append(this.style), this.observer = new MutationObserver(() => this.syncMeta()), this.observer.observe(document.head, {
      subtree: !0,
      childList: !0,
      attributes: !0,
      attributeFilter: ["content", "name", "media"]
    })), !s) return;
    this.color = i;
    const a = t ? "#f0f2e9" : "#222b28";
    this.style.textContent = `html {
      --app-header-background-color: ${i} !important;
      --app-header-text-color: ${a} !important;
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
    if (lt === this) {
      lt = void 0, this.observer?.disconnect(), this.style?.remove(), this.style = void 0;
      for (const [t, { previous: e }] of this.metas)
        t.content === this.color && (e === null ? t.removeAttribute("content") : t.content = e);
      this.createdMeta?.remove(), this.createdMeta = void 0, this.metas.clear(), this.color = "", this.notify();
    }
  }
}
const de = [
  "auto",
  "system",
  "light",
  "dark"
];
function wt(n, t) {
  try {
    return Number(
      new Intl.DateTimeFormat("en-GB", {
        hour: "numeric",
        hourCycle: "h23",
        timeZone: t
      }).format(n)
    );
  } catch {
    return n.getHours();
  }
}
function ei(n, t, e, i, s) {
  if (n === "system") return t;
  if (n !== "auto") return n === "dark";
  if (s === "above_horizon") return !1;
  if (s === "below_horizon") return !0;
  const a = wt(e, i);
  return a < 7 || a >= 19;
}
const ce = {
  more: "M4 11h2v2H4ZM11 11h2v2h-2ZM18 11h2v2h-2Z",
  camera: "M3 6h12v12H3ZM15 10l6-4v12l-6-4",
  phone: "M7 3h3l2 5-2 2c1.3 2.5 3.5 4.7 6 6l2-2 5 2v3c0 1.1-.9 2-2 2C11.1 21 3 12.9 3 3c0-1.1.9-2 2-2Z",
  microphone: "M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0ZM5 11v1a7 7 0 0 0 14 0v-1M12 19v3M8 22h8",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6",
  sparkle: "m12 2 2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2Z",
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
  door: "M4 21V3h16v18M7 21V5h10v16M14 13h.01",
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
  warn: "m12 3 10 18H2ZM12 9v5M12 17v.5",
  clock: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18ZM12 7v5l3 2"
}, b = (n) => W`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${ce[n] || ce.home}></path></svg>`, $ = (n) => !!n && !["unknown", "unavailable"].includes(n.state), w = (n) => n != null && n !== "" && Number.isFinite(Number(n)) ? Number(n) : void 0, P = (n) => n === "partlycloudy" ? "Partly cloudy" : (n || "Unavailable").replaceAll("_", " ").replaceAll("-", " "), Nt = (n) => typeof n == "string" ? { entity: n } : n;
function Zt(n, t = Date.now()) {
  if (!$(n)) return;
  const e = Date.parse(String(n.attributes.next_change_at || ""));
  if (!Number.isFinite(e) || e <= t) return;
  const i = n.state.trim();
  return i && i !== "none" ? i : void 0;
}
class ii extends C {
  constructor() {
    super(...arguments), this.config = { type: "custom:signal-home" };
  }
  static {
    this.properties = { hass: { attribute: !1 }, config: { state: !0 } };
  }
  static {
    this.styles = T`
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
              { value: "auto", label: "Auto · light while the sun is up" },
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
      { name: "favorites", selector: { entity: { multiple: !0 } } },
      { name: "cameras", selector: { entity: { domain: "camera", multiple: !0 } } },
      { name: "alarm_cameras", selector: { entity: { domain: "camera", multiple: !0 } } }
    ];
    return l`<p>
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
        .computeLabel=${(e) => ({ todo: "Default to-do list (all lists are available)", greeting: "Custom greeting (optional)", favorites: "Shortcut entities", cameras: "Frigate cameras (live, events, and playback)", alarm_cameras: "Cameras that run only while the alarm is armed", humidity: "Humidity sensor (optional)" })[e.name] || e.name[0].toUpperCase() + e.name.slice(1)}
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
            (a) => (typeof a == "string" ? a : a.entity) === s
          ) || s
        )
      });
    }}
        ></ha-form>
      </details>`;
  }
}
customElements.get("signal-home-editor") || customElements.define("signal-home-editor", ii);
class si extends C {
  constructor() {
    super(...arguments), this.eventId = "", this.kind = "event", this.camera = "", this.instance = "frigate", this.url = "", this.error = "", this.loading = !0, this.signature = "", this.generation = 0, this.load = async () => {
      const t = ++this.generation;
      clearTimeout(this.playerTimer), this.loading = !0, this.error = "", this.url = "", this.event = void 0;
      const e = () => this.isConnected && t === this.generation;
      try {
        if (!/^\d{10}(?:\.\d+)?-[a-zA-Z0-9]+$/.test(this.eventId) || this.eventId.length > 80 || !/^[a-zA-Z0-9_-]+$/.test(this.instance) || !/^[a-z0-9_]+$/.test(this.camera)) throw new Error("invalid_link");
        const i = Number(this.eventId.split("-")[0]), s = await this.hass.callWS({ type: "frigate/reviews/get", instance_id: this.instance, cameras: [this.camera], after: Math.floor(i) - 60, ...this.kind === "review" ? { before: Math.ceil(i) + 1 } : {}, limit: 500 });
        if (!e()) return;
        const a = typeof s == "string" ? JSON.parse(s) : s, o = Array.isArray(a) ? a.find((h) => h.camera === this.camera && (this.kind === "review" ? h.id === this.eventId : h.data?.detections?.includes(this.eventId))) : void 0;
        if (!o) throw new Error("event_missing");
        this.event = o;
        const d = Math.floor(o.start_time - 5), r = o.end_time == null ? Math.floor(Date.now() / 1e3) : Math.floor(o.end_time + 5);
        if (!Number.isFinite(d) || !Number.isFinite(r) || r <= d) throw new Error("invalid_media");
        const c = { url: `/api/frigate/${this.instance}/vod/${this.camera}/start/${d}/end/${r}/index.m3u8` }, u = await this.hass.callWS({ type: "auth/sign_path", path: c.url, expires: 3600 });
        if (!e() || (customElements.get("ha-hls-player") || await Promise.race([
          customElements.whenDefined("ha-hls-player"),
          new Promise((h, m) => {
            this.playerTimer = setTimeout(() => m(new Error("player_missing")), 1e4);
          })
        ]), !e())) return;
        this.url = new URL(u.path, location.origin).href;
      } catch (i) {
        if (!e()) return;
        const s = i instanceof Error ? i.message : "";
        this.error = s === "event_missing" ? "This event is no longer available. Its footage may have expired or been removed." : s === "invalid_link" ? "This event link isn’t valid." : this.event?.end_time === null ? "This event is still recording. Try again in a moment to load the footage." : "We couldn’t load this recording. Check your connection and try again.";
      } finally {
        e() && (clearTimeout(this.playerTimer), this.loading = !1);
      }
    };
  }
  static {
    this.properties = {
      hass: { attribute: !1 },
      eventId: {},
      kind: {},
      camera: {},
      instance: {},
      event: { state: !0 },
      url: { state: !0 },
      error: { state: !0 },
      loading: { state: !0 }
    };
  }
  static {
    this.styles = T`
    :host { display:block; min-width:0; }
    * { box-sizing:border-box; }
    .panel { border:1px solid var(--line); border-radius:26px; overflow:hidden; background:var(--surface); }
    .heading { padding:24px; }
    .badge { display:inline-flex; padding:6px 10px; border-radius:20px; background:color-mix(in srgb,#d19b50 18%,var(--surface)); color:var(--ink); font-size:11px; white-space:nowrap; font-weight:700; letter-spacing:.3px; }
    h2 { margin:14px 0 6px; color:var(--ink); font-size:clamp(21px,3vw,28px); font-weight:600; letter-spacing:-.7px; }
    p { margin:0; color:var(--muted); font-size:13px; line-height:1.6; }
    time { color:var(--ink); font-weight:600; }
    .player { background:#142019; aspect-ratio:4/3; }
    ha-hls-player { display:block; width:100%; height:100%; }
    .footer { padding:16px 24px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
    .notice { padding:44px 24px; min-height:220px; display:grid; align-content:center; gap:12px; text-align:center; border-top:1px solid var(--line); }
    .notice strong { color:var(--ink); font-size:16px; font-weight:600; }
    button { font:inherit; min-height:44px; padding:10px 15px; border:1px solid var(--line); border-radius:12px; background:var(--surface); color:var(--ink); cursor:pointer; }
    button:focus-visible { outline:2px solid var(--ink); outline-offset:3px; }
    .notice button { justify-self:center; }
    @media(max-width:480px) { .heading { padding:18px; } .footer { padding:14px 18px; } .panel { border-radius:22px; } }
  `;
  }
  connectedCallback() {
    super.connectedCallback(), this.signature = "";
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.generation++, clearTimeout(this.playerTimer), this.url = "";
  }
  willUpdate(t) {
    const e = JSON.stringify([this.instance, this.camera, this.kind, this.eventId]);
    this.hass && (e !== this.signature || this.connection !== this.hass.connection || this.user !== this.hass.user?.id) && (this.signature = e, this.connection = this.hass.connection, this.user = this.hass.user?.id, this.load());
  }
  date() {
    const t = this.event?.start_time ?? Number(this.eventId.split("-")[0]);
    return Number.isFinite(t) ? new Intl.DateTimeFormat(this.hass?.locale?.language || void 0, { dateStyle: "medium", timeStyle: "short", timeZone: this.hass?.config?.time_zone }).format(new Date(t * 1e3)) : "";
  }
  render() {
    const t = this.event?.data?.objects?.some((e) => e.startsWith("doorbell")) ? "Doorbell ring" : this.event?.data?.objects?.includes("person") ? "Person detected" : "Recorded event";
    return l`<section class="panel" aria-label="Recorded event">
      <div class="heading"><span class="badge">${this.event?.end_time === null ? "Visit in progress · Recorded footage" : "Recorded event"}</span><h2>${t}</h2><p><time>${this.date()}</time> · ${this.camera.replaceAll("_", " ")}</p>${this.event?.end_time != null ? l`<p>${Math.round(this.event.end_time - this.event.start_time)}-second visit · includes 5s before and 5s after</p>` : ""}</div>
      ${this.loading ? l`<div class="notice" role="status"><strong>Opening this recording…</strong><p>Loading the event from your notification.</p></div>` : this.error ? l`<div class="notice" role="alert"><strong>Recording unavailable</strong><p>${this.error}</p><button @click=${this.load}>Try again</button></div>` : l`<div class="player"><ha-hls-player .hass=${this.hass} .url=${this.url} .controls=${!0} .autoPlay=${!0} .muted=${!0} .playsInline=${!0} .allowExoPlayer=${!1} .aspectRatio=${4 / 3}></ha-hls-player></div>${this.event?.end_time === null ? l`<div class="footer"><button @click=${this.load}>Refresh recording</button></div>` : ""}`}
    </section>`;
  }
}
customElements.get("signal-camera-event") || customElements.define("signal-camera-event", si);
class ai extends C {
  constructor() {
    super(...arguments), this.camera = "", this.events = [], this.loading = !1, this.error = "", this.more = !1, this.limit = 24, this.signature = "", this.generation = 0, this.load = async () => {
      const t = ++this.generation;
      clearTimeout(this.timer), this.loading = !0, this.error = "";
      const e = () => this.isConnected && t === this.generation;
      try {
        if (!/^[a-z0-9_]+$/.test(this.camera)) throw new Error();
        const i = await this.hass.callWS({ type: "frigate/reviews/get", instance_id: "frigate", cameras: [this.camera], after: Date.now() / 1e3 - 3 * 86400, limit: this.limit });
        if (!e()) return;
        const s = typeof i == "string" ? JSON.parse(i) : i;
        if (!Array.isArray(s)) throw new Error();
        this.more = s.length >= this.limit;
        const a = s.filter((d) => d.camera === this.camera && /^\d{10}(?:\.\d+)?-[a-zA-Z0-9]+$/.test(d.id)).sort((d, r) => r.start_time - d.start_time), o = await Promise.all(a.map(async (d) => {
          try {
            const r = await this.hass.callWS({ type: "auth/sign_path", path: `/api/frigate/frigate/notifications/${d.id}/${this.camera}/review_thumbnail.webp`, expires: 3600 });
            return { ...d, image: new URL(r.path, location.origin).href };
          } catch {
            return { ...d, image: void 0 };
          }
        }));
        e() && (this.events = o);
      } catch {
        e() && (this.error = "Events couldn’t load. Tap Refresh to try again.");
      } finally {
        e() && (this.loading = !1, this.scheduleRefresh());
      }
    };
  }
  static {
    this.properties = { hass: { attribute: !1 }, camera: {}, events: { state: !0 }, loading: { state: !0 }, error: { state: !0 }, more: { state: !0 } };
  }
  static {
    this.styles = T`
    :host { display:block; min-width:0; }
    * { box-sizing:border-box; }
    .heading { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:18px; }
    h3 { margin:0; font-size:20px; font-weight:600; letter-spacing:-.5px; color:var(--ink); }
    button { font:inherit; color:var(--ink); cursor:pointer; border:0; background:transparent; min-height:44px; }
    button:focus-visible { outline:2px solid var(--ink); outline-offset:4px; }
    button:disabled { opacity:.5; cursor:default; }
    .refresh,.more { padding:10px 14px; border:1px solid var(--line); border-radius:12px; font-size:12px; }
    .grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px 12px; }
    .tile { display:block; min-width:0; width:100%; padding:0; text-align:left; border-radius:14px; }
    .picture { display:block; aspect-ratio:4/3; position:relative; overflow:hidden; border-radius:14px; background:color-mix(in srgb,var(--line) 50%,var(--surface)); }
    img { display:block; width:100%; height:100%; object-fit:cover; transition:transform .2s; }
    @media(hover:hover) { .tile:hover img { transform:scale(1.035); } }
    .placeholder { position:absolute; inset:0; display:grid; place-items:center; font-size:12px; color:var(--muted); }
    .caption { display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap; gap:3px 8px; padding:9px 2px 0; }
    time { font-size:14px; font-weight:600; color:var(--ink); }
    .date { font-size:11px; color:var(--muted); }
    .status { color:var(--muted); font-size:13px; padding:24px 0; line-height:1.6; }
    .more { display:block; margin:24px auto 0; }
    @media(min-width:1200px) { .grid { grid-template-columns:repeat(3,minmax(0,1fr)); } }
    @media(prefers-reduced-motion:reduce) { img { transition:none; } }
  `;
  }
  connectedCallback() {
    super.connectedCallback(), this.signature = "";
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.generation++, clearTimeout(this.timer);
  }
  willUpdate() {
    this.hass && (this.signature !== this.camera || this.connection !== this.hass.connection || this.user !== this.hass.user?.id) && (this.signature = this.camera, this.connection = this.hass.connection, this.user = this.hass.user?.id, this.events = [], this.limit = 24, this.load());
  }
  scheduleRefresh() {
    this.timer = setTimeout(() => {
      document.visibilityState === "visible" ? this.load() : this.scheduleRefresh();
    }, 6e4);
  }
  format(t, e = !1) {
    return new Intl.DateTimeFormat(this.hass?.locale?.language || void 0, { timeZone: this.hass?.config?.time_zone, ...e ? { month: "short", day: "numeric" } : { hour: "numeric", minute: "2-digit" } }).format(new Date(t.start_time * 1e3));
  }
  duration(t) {
    const e = Math.max(1, Math.round(t.end_time - t.start_time));
    return e < 60 ? `${e}s` : `${Math.floor(e / 60)}m ${e % 60}s`;
  }
  open(t) {
    this.dispatchEvent(new CustomEvent("signal-open-event", { detail: { id: t.id, camera: t.camera }, bubbles: !0, composed: !0 }));
  }
  render() {
    return l`
    <div class="heading"><h3>Recent events</h3><button class="refresh" ?disabled=${this.loading} @click=${this.load} aria-label="Refresh events">Refresh</button></div>
    ${this.error ? l`<p class="status" role="alert">${this.error}</p>` : ""}
    ${this.events.length ? l`<div class="grid">${yt(this.events, (t) => t.id, (t) => l`<button class="tile" aria-label=${`Watch ${t.data?.objects?.some((e) => e.startsWith("doorbell")) ? "doorbell" : "person"} event, ${this.format(t, !0)} at ${this.format(t)}`} @click=${() => this.open(t)}><span class="picture"><span class="placeholder">Preview unavailable</span>${t.image ? l`<img src=${t.image} alt="" loading="lazy" style="position:relative" @error=${(e) => {
      e.target.style.visibility = "hidden";
    }}>` : ""}</span><span class="caption"><time datetime=${new Date(t.start_time * 1e3).toISOString()}>${this.format(t)}</time><span class="date">${this.format(t, !0)} · ${t.end_time == null ? "In progress" : this.duration(t)}</span></span></button>`)}</div>` : l`<p class="status" role="status">${this.loading ? "Loading events…" : this.error ? "" : "No recent events."}</p>`}
    ${this.more ? l`<button class="more" ?disabled=${this.loading} @click=${() => {
      this.limit += 24, this.load();
    }}>Load more events</button>` : ""}`;
  }
}
customElements.get("signal-camera-grid") || customElements.define("signal-camera-grid", ai);
const ni = 2e3, oi = ["armed_night", "armed_away", "armed_home", "armed_vacation", "armed_custom_bypass", "pending", "triggered"];
class ri extends C {
  constructor() {
    super(...arguments), this.cameras = [], this.alarmCameras = [], this.alarmEntity = "", this.eventId = "", this.eventCamera = "", this.eventInstance = "frigate", this.eventKind = "event", this.selected = "", this.error = "", this.ready = !1, this.voiceActive = !1, this.talking = !1, this.liveSignature = "", this.generation = 0, this.toggleVoice = () => {
      if (this.voiceActive) {
        this.stopVoice();
        return;
      }
      this.cardAction("call_start"), this.voiceActive = !0;
    }, this.startTalking = (t) => {
      if (!(!this.voiceActive || this.talking)) {
        t.preventDefault();
        try {
          t.currentTarget.setPointerCapture(t.pointerId);
        } catch {
        }
        clearTimeout(this.echoTimer), this.cardAction("mute"), this.cardAction("microphone_unmute"), this.talking = !0;
      }
    }, this.stopTalking = (t) => {
      this.talking && (t.preventDefault(), this.cardAction("microphone_mute"), this.talking = !1, this.echoTimer = setTimeout(() => {
        this.voiceActive && !this.talking && this.cardAction("unmute");
      }, ni));
    }, this.syncEventRoute = () => {
      const t = new URLSearchParams(location.search), e = t.get("signal_review") || t.get("signal_event") || "", i = t.has("signal_review") ? "review" : "event", s = t.get("signal_camera") || "front_door", a = t.get("signal_instance") || "frigate";
      (i !== this.eventKind || e !== this.eventId || s !== this.eventCamera || a !== this.eventInstance) && (this.releaseViewers(), this.eventId = e, this.eventCamera = s, this.eventInstance = a, this.eventKind = i, e && this.cameras.includes(`camera.${s}`) && (this.selected = `camera.${s}`));
    }, this.openEvent = (t) => {
      const e = new URL(location.href);
      e.searchParams.delete("signal_event"), e.searchParams.set("signal_review", t.detail.id), e.searchParams.set("signal_camera", t.detail.camera), e.searchParams.set("signal_instance", "frigate"), history.pushState(history.state, "", e), this.syncEventRoute(), this.dispatchEvent(new CustomEvent("signal-camera-navigation", { bubbles: !0, composed: !0 }));
    }, this.leaveEvent = () => {
      const t = new URL(location.href);
      for (const e of ["signal_review", "signal_event", "signal_camera", "signal_instance"]) t.searchParams.delete(e);
      history.pushState(history.state, "", t), this.syncEventRoute(), this.dispatchEvent(new CustomEvent("signal-camera-navigation", { bubbles: !0, composed: !0 }));
    }, this.loadViewer = () => {
      const t = ++this.generation;
      clearTimeout(this.timer), this.error = "", this.ready = !!customElements.get("advanced-camera-card"), !this.ready && (this.timer = setTimeout(() => {
        t === this.generation && (this.error = "The camera viewer couldn’t load. Try again or refresh Signal.");
      }, 1e4), customElements.whenDefined("advanced-camera-card").then(() => {
        !this.isConnected || t !== this.generation || (clearTimeout(this.timer), this.error = "", this.ready = !0);
      }));
    }, this.retry = () => {
      this.releaseViewers(), this.loadViewer(), this.requestUpdate();
    };
  }
  static {
    this.properties = {
      hass: { attribute: !1 },
      cameras: { attribute: !1 },
      alarmCameras: { attribute: !1 },
      alarmEntity: { attribute: !1 },
      eventId: { state: !0 },
      eventCamera: { state: !0 },
      eventInstance: { state: !0 },
      eventKind: { state: !0 },
      selected: { state: !0 },
      error: { state: !0 },
      ready: { state: !0 },
      voiceActive: { state: !0 },
      talking: { state: !0 }
    };
  }
  static {
    this.styles = T`
    :host { display:block; min-width:0; color:var(--ink); }
    * { box-sizing:border-box; }
    .event-layout { max-width:900px; margin:0 auto; }
    .event-toolbar { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; }
    .event-toolbar button { border:1px solid var(--line); background:var(--surface); color:var(--ink); }
    .recorded-mode { color:var(--ink); font-size:14px; font-weight:700; }
    .event-toolbar .live-action { background:var(--mint); color:#172d27; border-color:transparent; }
    .layout { display:grid; grid-template-columns:minmax(0,1.15fr) minmax(0,1fr); gap:24px; align-items:start; }
    .camera-panel,.history-panel { min-width:0; border:1px solid var(--line); border-radius:28px; background:var(--surface); overflow:hidden; }
    .camera-heading { padding:22px 24px 18px; display:flex; align-items:center; justify-content:space-between; gap:16px; }
    .identity { display:flex; align-items:center; gap:12px; min-width:0; }
    .camera-icon { display:grid; place-items:center; flex-shrink:0; width:46px; height:46px; border-radius:16px; background:var(--mint); color:#172d27; }
    svg { width:22px; height:22px; }
    h2,p { margin:0; }
    h2 { font-size:20px; letter-spacing:-.6px; line-height:1.3; }
    .eyebrow { display:block; font-size:10px; font-weight:700; letter-spacing:1.6px; text-transform:uppercase; color:var(--muted); margin-bottom:5px; }
    .live-label { display:flex; align-items:center; gap:6px; font-size:11px; font-weight:700; white-space:nowrap; }
    .dot { width:6px; height:6px; border-radius:50%; background:#43886a; }
    .offline .dot { background:var(--muted); }
    .viewer { min-width:0; --ha-card-border-radius:0px; --ha-card-border-width:0px; --ha-card-background:var(--surface); --primary-text-color:var(--ink); --secondary-text-color:var(--muted); --card-background-color:var(--surface); }
    .live-viewer { background:#17231d; }
    .voice-controls { display:grid; grid-template-columns:1fr 1.25fr; gap:10px; padding:14px 18px; border-top:1px solid var(--line); background:var(--surface); }
    .voice-controls button { display:flex; align-items:center; justify-content:center; gap:9px; min-height:52px; padding:12px 14px; border:1px solid var(--line); border-radius:15px; background:var(--surface); color:var(--ink); font-weight:700; touch-action:none; user-select:none; -webkit-touch-callout:none; }
    .voice-controls button svg { width:19px; height:19px; }
    .voice-controls .session.active { background:#fee6e2; border-color:#e8b7ae; color:#802f28; }
    .voice-controls .push { background:var(--mint); border-color:transparent; color:#172d27; }
    .voice-controls .push.talking { background:#246b52; color:white; transform:scale(.985); }
    .voice-controls button:disabled { opacity:.48; cursor:not-allowed; }
    .voice-status { grid-column:1/-1; min-height:18px; margin:0; text-align:center; color:var(--muted); font-size:12px; }
    .talk-help { padding:12px 24px 16px; color:var(--muted); font-size:12px; line-height:1.5; border-top:1px solid var(--line); }
    signal-camera-grid { display:block; padding:22px; }
    nav { display:flex; gap:4px; padding:4px; margin:18px 0 0; border-radius:14px; background:color-mix(in srgb,var(--line) 38%,transparent); }
    button { font:inherit; font-size:13px; color:var(--muted); background:transparent; border:0; border-radius:11px; padding:11px 12px; min-height:44px; cursor:pointer; }
    nav button { flex:1; }
    button[aria-pressed="true"] { background:var(--surface); color:var(--ink); box-shadow:0 2px 6px #00000008; }
    button:focus-visible,select:focus-visible { outline:2px solid var(--ink); outline-offset:3px; }
    .selector { margin-bottom:20px; display:flex; align-items:center; gap:12px; color:var(--muted); font-size:13px; }
    select { font:inherit; font-size:16px; border:1px solid var(--line); border-radius:12px; padding:10px 14px; background:var(--surface); color:var(--ink); max-width:100%; }
    .notice { padding:24px; background:var(--surface); border:1px solid var(--line); border-radius:20px; line-height:1.6; }
    .notice p { margin-bottom:10px; }
    .resting { display:grid; place-items:center; align-content:center; gap:10px; aspect-ratio:16/9; padding:24px; text-align:center; background:color-mix(in srgb,var(--line) 30%,var(--surface)); color:var(--ink); }
    .resting svg { width:30px; height:30px; color:var(--muted); }
    .resting h3 { margin:0; font-size:17px; letter-spacing:-.3px; }
    .resting p { max-width:34ch; color:var(--muted); font-size:13px; line-height:1.5; }
    @media(max-width:1000px) { .layout { grid-template-columns:1fr; gap:22px; } }
    @media(max-width:480px) { .camera-heading { padding:18px; } signal-camera-grid { padding:16px; } .camera-panel,.history-panel { border-radius:22px; } .talk-help { padding:12px 18px 16px; } h2 { font-size:18px; } .camera-icon { width:40px; height:40px; border-radius:13px; } }
  `;
  }
  connectedCallback() {
    super.connectedCallback(), this.syncEventRoute(), this.loadViewer();
    for (const t of ["popstate", "hashchange", "location-changed"]) window.addEventListener(t, this.syncEventRoute);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.generation++, clearTimeout(this.timer), this.releaseViewers();
    for (const t of ["popstate", "hashchange", "location-changed"]) window.removeEventListener(t, this.syncEventRoute);
  }
  cardAction(t) {
    this.liveCard?.dispatchEvent(new CustomEvent("ll-custom", { detail: { action: "fire-dom-event", advanced_camera_card_action: t }, bubbles: !0, composed: !0 }));
  }
  stopVoice() {
    clearTimeout(this.echoTimer), this.talking && this.cardAction("microphone_mute"), this.voiceActive && this.cardAction("call_end"), this.talking = !1, this.voiceActive = !1;
  }
  releaseViewers() {
    this.stopVoice(), this.liveCard = void 0, this.liveSignature = "";
  }
  createViewer() {
    const t = document.createElement("advanced-camera-card");
    t.hass = this.hass;
    const e = this.selected === "camera.front_door" && window.isSecureContext, i = Object.fromEntries(["iris", "live", "clips", "reviews", "recordings", "timeline", "mute", "fullscreen", "call", "microphone", "camera_ui", "cameras", "display_mode", "download", "folders", "gallery", "info", "media_player", "set_review", "substreams"].map((a) => [a, { enabled: a === "mute" || a === "fullscreen" }])), s = [{ camera_entity: this.selected, live_provider: "go2rtc", engine: "frigate", go2rtc: { modes: ["webrtc", "mse"], ...this.selected === "camera.front_door" ? { stream: "front_door" } : {} }, ...e ? { capabilities: { force: ["2-way-audio"] } } : {} }];
    return t.setConfig({
      type: "custom:advanced-camera-card",
      cameras: s,
      view: { default: "live", theme: { overrides: {
        "--advanced-camera-card-menu-override-background": "var(--surface)",
        "--advanced-camera-card-menu-override-button-inactive-color": "var(--muted)",
        "--advanced-camera-card-menu-override-button-background": "transparent",
        "--advanced-camera-card-background": "var(--surface)",
        "--advanced-camera-card-text-color": "var(--ink)",
        "--advanced-camera-card-timeline-tool-color": "var(--ink)",
        "--advanced-camera-card-divider-color": "var(--line)"
      } } },
      live: { auto_play: ["selected", "visible"], auto_pause: ["unselected", "hidden"], auto_mute: ["unselected", "hidden", ...e ? ["call"] : []], auto_unmute: e ? ["call"] : [], microphone: e ? { auto_unmute: [] } : void 0, draggable: !1, controls: { builtin: !0, call: { enabled: !1, lock: !1 }, wheel: !1, next_previous: { style: "none" }, timeline: { mode: "none" }, thumbnails: { mode: "none" } } },
      menu: { style: "outside", position: "bottom", auto_hide: [], buttons: i }
    }), t;
  }
  /** An alarm-only camera is off (turned away, privacy mode, not recording) unless the alarm is armed. */
  resting(t) {
    return this.alarmCameras.includes(t) && !oi.includes(this.hass?.states[this.alarmEntity]?.state || "");
  }
  willUpdate(t) {
    if (this.cameras.includes(this.selected) || (this.selected = this.cameras[0] || ""), (this.connection !== this.hass?.connection || this.user !== this.hass?.user?.id) && (this.releaseViewers(), this.connection = this.hass?.connection, this.user = this.hass?.user?.id), this.eventId || this.resting(this.selected)) {
      this.releaseViewers();
      return;
    }
    if (!(!this.ready || !this.selected || !this.hass))
      try {
        (this.liveSignature !== this.selected || !this.liveCard) && (this.liveCard = this.createViewer(), this.liveSignature = this.selected), this.liveCard && (this.liveCard.hass = this.hass), this.error = "";
      } catch {
        this.releaseViewers(), this.error = "The camera viewer couldn’t open. Try again.";
      }
  }
  name(t) {
    return this.hass?.states[t]?.attributes.friendly_name || t.replace(/^camera\./, "").replaceAll("_", " ");
  }
  render() {
    if (!this.cameras.length) return l`<div class="notice"><p>No cameras added yet.</p>Select your Frigate cameras in Signal’s editor to see them here.</div>`;
    if (this.eventId) return l`<div class="event-layout"><nav class="event-toolbar" aria-label="Event navigation"><span class="recorded-mode">Recorded event</span><button class="live-action" aria-label="Back to live & events" @click=${this.leaveEvent}>← Back to live & events</button></nav>${this.cameras.includes(`camera.${this.eventCamera}`) ? l`<signal-camera-event .hass=${this.hass} .eventId=${this.eventId} .kind=${this.eventKind} .camera=${this.eventCamera} .instance=${this.eventInstance}></signal-camera-event>` : l`<div class="notice" role="alert">This camera isn’t available on this dashboard.</div>`}</div>`;
    if (this.error) return l`<div class="notice" role="alert"><p>${this.error}</p><button @click=${this.retry}>Retry camera viewer</button></div>`;
    const t = this.hass?.states[this.selected]?.state, e = this.resting(this.selected), i = !e && (!t || ["unavailable", "unknown"].includes(t));
    return l`
      ${this.cameras.length > 1 ? l`<label class="selector">Camera<select aria-label="Camera" .value=${this.selected} @change=${(s) => {
      this.selected = s.target.value;
    }}>${this.cameras.map((s) => l`<option value=${s}>${this.name(s)}</option>`)}</select></label>` : ""}
      <div class="layout">
        <section class="camera-panel" aria-label="Live camera">
          <div class="camera-heading"><div class="identity"><span class="camera-icon">${b("camera")}</span><div><h2>${this.name(this.selected)}</h2></div></div><span class="live-label ${i || e ? "offline" : ""}"><span class="dot"></span>${e ? "Off" : i ? "Unavailable" : "LIVE · Now"}</span></div>
          ${e ? l`<div class="resting" role="status">${b("shield")}<h3>Off while you’re home</h3><p>This camera only turns on and records while the alarm is set to Sleeping or Away.</p></div>` : l`<div class="viewer live-viewer">${this.liveCard || l`<div class="notice" role="status">Connecting to camera…</div>`}</div>`}
          ${this.selected === "camera.front_door" ? window.isSecureContext ? l`
            <div class="voice-controls" role="group" aria-label="Doorbell voice controls">
              <button class="session ${this.voiceActive ? "active" : ""}" aria-pressed=${this.voiceActive} @click=${this.toggleVoice}>${b("phone")} ${this.voiceActive ? "End voice" : "Start voice"}</button>
              <button class="push ${this.talking ? "talking" : ""}" ?disabled=${!this.voiceActive} @pointerdown=${this.startTalking} @pointerup=${this.stopTalking} @pointercancel=${this.stopTalking} @lostpointercapture=${this.stopTalking}>${b("microphone")} ${this.talking ? "Speaking…" : "Hold to talk"}</button>
              <p class="voice-status" role="status">${this.voiceActive ? this.talking ? "Your microphone is live" : "Voice connected · hold to speak" : "Start voice, then hold to talk"}</p>
            </div>` : l`<p class="talk-help" role="note">Doorbell talk needs a secure HTTPS connection. Open Signal through your Home Assistant Cloud address to use the microphone.</p>` : ""}
        </section>
        <section class="history-panel" aria-label="Camera history">
          <signal-camera-grid .hass=${this.hass} .camera=${this.selected.replace(/^camera\./, "")} @signal-open-event=${this.openEvent}></signal-camera-grid>
        </section>
      </div>`;
  }
}
customElements.get("signal-cameras") || customElements.define("signal-cameras", ri);
const Vt = T`
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
class li extends C {
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
      T`
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
      At
    ];
  }
  cancelMotion() {
    this.motionSequence++, this.entryAnimation?.cancel(), this.backdropAnimation?.cancel(), this.exitAnimation?.cancel();
  }
  fadeBackdrop(t, e, i, s, a) {
    this.backdropAnimation?.cancel(), this.backdropAnimation = t.animate(
      [{ opacity: e }, { opacity: i }],
      {
        pseudoElement: "::backdrop",
        duration: s,
        easing: a,
        fill: "both"
      }
    );
  }
  trapTab(t) {
    if (t.key !== "Tab") return;
    const e = [], i = (o) => {
      o instanceof HTMLElement && o.matches("button,a[href],input,select,textarea,[tabindex]") && !o.matches(':disabled,[tabindex="-1"],[hidden]') && o.getClientRects().length && e.push(o), (o instanceof HTMLSlotElement ? o.assignedElements({ flatten: !0 }) : o.shadowRoot ? Array.from(o.shadowRoot.children) : Array.from(o.children)).forEach(i);
    };
    if (i(this.renderRoot.querySelector("dialog")), !e.length) return;
    const s = t.composedPath()[0], a = e.indexOf(s);
    t.shiftKey && a <= 0 ? (t.preventDefault(), e.at(-1).focus()) : !t.shiftKey && (a === e.length - 1 || a === -1) && (t.preventDefault(), e[0].focus());
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
          const a = "cubic-bezier(.2,.8,.2,1)";
          this.fadeBackdrop(e, "0", "1", 280, a), this.entryAnimation = e.animate(
            [
              {
                opacity: this.mobileSheet ? 1 : 0,
                transform: this.entryTransform
              },
              { opacity: 1, transform: "none" }
            ],
            { duration: 280, easing: a }
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
    const t = this.renderRoot.querySelector("dialog"), e = getComputedStyle(t), i = { opacity: e.opacity, transform: e.transform }, s = getComputedStyle(t, "::backdrop").opacity, a = ++this.motionSequence;
    if (this.entryAnimation?.cancel(), t.open && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const o = "cubic-bezier(.4,0,1,1)";
      this.fadeBackdrop(t, s, "0", 200, o), this.exitAnimation = t.animate(
        [
          i,
          { opacity: this.mobileSheet ? 1 : 0, transform: this.entryTransform }
        ],
        { duration: 200, easing: o, fill: "both" }
      ), await this.exitAnimation.finished.catch(() => {
      });
    }
    a !== this.motionSequence || !this.isConnected || (t.close(), this.cancelMotion(), this.closing = !1, this.dispatchEvent(
      new CustomEvent("signal-close", { bubbles: !0, composed: !0 })
    ));
  }
  render() {
    return l`<dialog
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
          ${b("close")}
        </button>
      </header>
      <div class="body"><slot></slot></div>
    </dialog>`;
  }
}
customElements.define("signal-sheet", li);
class di extends C {
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
    this.styles = T`
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
        const s = w(this.hass.states[t]?.attributes.supported_features) || 0, a = s & 1 ? "daily" : s & 2 ? "hourly" : s & 4 ? "twice_daily" : "daily", o = await this.hass.callWS({
          type: "call_service",
          domain: "weather",
          service: "get_forecasts",
          service_data: { entity_id: t, type: a },
          return_response: !0
        });
        i === this.sequence && (this.records = (o.response?.[t]?.forecast || []).slice(
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
          (a, o, d) => o === 0 || (a.s ?? a.state) !== (d[o - 1].s ?? d[o - 1].state)
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
    return t === "on" ? e ? "Water detected" : "Active" : t === "off" ? e ? "Dry" : "Clear" : P(t);
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
    const t = this.hass?.states[this.entity], e = t?.attributes || {}, i = this.entity.split(".")[0], s = $(t), a = i === "binary_sensor", o = e.device_class === "moisture", d = s ? a ? t.state === "on" ? o ? "Water detected" : "Active" : o ? "Dry" : "Clear" : P(t.state) : "Unavailable", r = [
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
    ].includes(i), c = i === "sensor" && (w(t?.state) !== void 0 || !!e.unit_of_measurement), u = this.hass?.states[this.battery];
    return l`<signal-sheet
      .open=${!!this.entity}
      .heading=${this.name || e.friendly_name || "Device details"}
      .dark=${this.dark}
      @signal-close=${this.closed}
      ><div class=${`content ${this.dark ? "dark" : ""}`}>
        ${this.custom ? l`<slot></slot>` : r ? l`<signal-control
                  .hass=${this.hass}
                  .configuration=${{ type: "custom:signal-control", entity: this.entity, name: this.name || void 0, appearance: this.dark ? "dark" : "light", detail: !0 }}
                ></signal-control>` : l`<div
                    class=${`summary ${s ? a && t.state === "on" ? "alert" : "" : "unavailable"}`}
                  >
                    <div class="caption">
                      ${a ? "LIVE SENSOR STATUS" : "CURRENT READING"}
                    </div>
                    <div class="value">
                      ${c ? s ? t.state : "—" : d}
                      ${c && e.unit_of_measurement || ""}
                    </div>
                    <div class="caption">
                      ${s ? a && t.state === "on" ? "Check this area. Open advanced details for more information." : "Reported by Home Assistant" : "This device cannot currently confirm its state."}
                    </div>
                  </div>
                  ${u ? l`<div class="fact"><span>Battery</span>${$(u) ? u.state + "%" : "Unavailable"}</div>` : p}${c ? l`<signal-graph .hass=${this.hass} .configuration=${{ type: "custom:signal-graph", entity: this.entity, appearance: this.dark ? "dark" : "light" }}></signal-graph>` : p}${!r && !a && !c ? l`<p class="hint">Additional controls for this device are available in advanced details.</p>` : p}`}
        ${["weather", "binary_sensor"].includes(i) ? l`<section class="records">
                <h3>
                  ${i === "weather" ? "The days ahead" : "Recent history · 24 hours"}
                </h3>
                ${this.loading ? l`<p class="hint" role="status">Loading…</p>` : this.loadError ? l`<p class="hint" role="status">${this.loadError}</p>
                          <button class="retry" @click=${this.load}>
                            Try again
                          </button>` : this.records.length ? this.records.map((h) => {
      const m = h.datetime ?? h.lu ?? h.last_updated ?? h.lc ?? h.last_changed, f = new Date(
        typeof m == "number" ? m * 1e3 : m
      );
      return l`<div class="record">
                              <div>
                                ${i === "weather" ? f.toLocaleDateString(this.hass.locale?.language, { weekday: "short", month: "short", day: "numeric" }) : this.historyLabel(h.s ?? h.state)}<small
                                  >${i === "weather" ? P(h.condition) : f.toLocaleString(this.hass.locale?.language, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</small
                                >
                              </div>
                              ${i === "weather" ? l`<strong>${w(h.temperature) ?? "—"}° ${h.templow !== void 0 ? l`<small>Low ${h.templow}°</small>` : p}</strong>` : p}
                            </div>`;
    }) : l`<p class="hint">
                            ${i === "weather" ? "No forecast is available from this provider." : "No recorded history in this period."}
                          </p>`}
              </section>` : p}
        <button class="advanced" @click=${this.native}>
          Advanced in Home Assistant ↗
        </button>
      </div></signal-sheet
    >`;
  }
}
customElements.define("signal-details", di);
class ci extends C {
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
      Vt,
      T`
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
      .lamp.on { background:color-mix(in srgb,var(--card) 82%,#ffce7b); }
      .lamp.on .entity-icon { background:#ffdc94; color:#604007; box-shadow:0 0 26px #ffc15e65; }
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
      At
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
    const i = this.config.entity, [s, a] = t.split(".");
    try {
      await this.hass.callService(s, a, {
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
  slider(t, e, i, s, a, o, d, r, c = !1) {
    const u = this.preview[e] ?? i, h = a - s, m = u === void 0 || h <= 0 ? 0 : Math.max(0, Math.min(100, (u - s) / h * 100));
    return l`<div class="slider-block">
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
        max=${a}
        step=${o}
        .value=${it(String(u ?? s))}
        style=${`--fill:${m}%`}
        ?disabled=${c || this.pending}
        @input=${(f) => this.preview = { ...this.preview, [e]: Number(f.target.value) }}
        @change=${(f) => r(Math.max(s, Math.min(a, Number(f.target.value))))}
      />
    </div>`;
  }
  render() {
    if (!this.hass) return l`<div class="widget">Connecting…</div>`;
    const t = this.hass.states[this.config.entity], e = this.isReady(), i = t?.attributes || {}, s = this.config.entity.split(".")[0], a = t?.state === "on", o = w(i.supported_features) ?? 0, d = ["light", "switch", "fan", "input_boolean"].includes(
      s
    ), r = s === "media_player", c = s === "cover", u = s === "light" || this.config.lamp ? "bulb" : c ? "cover" : r ? "music" : s === "lock" ? "lock" : s === "fan" ? "wind" : "power", h = Array.isArray(i.supported_color_modes) ? i.supported_color_modes : [], m = s === "light" && (i.brightness !== void 0 || h.some((g) => !["onoff", "unknown"].includes(g))), x = "#" + (Array.isArray(i.rgb_color) ? i.rgb_color : [255, 255, 255]).map((g) => Math.round(g).toString(16).padStart(2, "0")).join("");
    return l`<article
        class=${`widget ${this.config.appearance || "auto"} ${this.config.accent || "mint"} ${a ? "on" : ""} ${s === "light" || this.config.lamp ? "lamp" : ""} ${this.acknowledged ? "acknowledged" : ""}`}
        aria-busy=${this.pending}
      >
        <div class="control-top">
          ${this.config.detail ? l`<span class="entity-icon">${b(u)}</span>` : l`<button
                  class="entity-icon"
                  aria-label="Device details"
                  @click=${this.more}
                >
                  ${b(u)}
                </button>`}
          ${d ? l`<button class="switch" role="switch" aria-label=${this.config.name || i.friendly_name || this.config.entity} aria-checked=${a} ?disabled=${!e || this.pending} @click=${() => this.send(`${s}.${a ? "turn_off" : "turn_on"}`)}><span class="thumb">${b(a ? "check" : "power")}</span></button>` : this.config.detail ? p : l`<button class="icon-button" aria-label="Open full controls" @click=${this.more}>${b("arrow")}</button>`}
        </div>
        <h2>${this.config.name || i.friendly_name || this.config.entity}</h2>
        <div class="state-line">
          <span class="state-dot"></span
          >${e ? P(t.state) : "Unavailable"}<span
            class="command-feedback"
            role="status"
            >${this.pending ? "Sending…" : this.acknowledged ? l`${b("check")} Sent` : p}</span
          >
        </div>
        ${m ? this.slider("Brightness", "brightness", a ? (w(i.brightness) ?? 0) / 255 * 100 : 0, 0, 100, 1, "%", (g) => this.send(g === 0 ? "light.turn_off" : "light.turn_on", g ? { brightness_pct: Math.round(g) } : {}), !e) : p}
        ${s === "light" && h.includes("color_temp") && w(i.min_color_temp_kelvin) !== void 0 && w(i.max_color_temp_kelvin) !== void 0 ? this.slider("Color temperature", "kelvin", w(i.color_temp_kelvin), Number(i.min_color_temp_kelvin), Number(i.max_color_temp_kelvin), 50, " K", (g) => this.send("light.turn_on", { color_temp_kelvin: g }), !e) : p}
        ${s === "light" && h.some(
      (g) => ["rgb", "rgbw", "rgbww", "hs", "xy"].includes(g)
    ) ? l`<label class="color-control"
                >Light color<input
                  type="color"
                  aria-label="Light color"
                  .value=${it(x)}
                  ?disabled=${!e || this.pending}
                  @change=${(g) => {
      const A = g.target.value;
      this.send("light.turn_on", {
        rgb_color: [1, 3, 5].map(
          (v) => parseInt(A.slice(v, v + 2), 16)
        )
      });
    }}
              /></label>` : p}
        ${s === "fan" && o & 1 ? this.slider("Fan speed", "speed", w(i.percentage), 0, 100, w(i.percentage_step) || 1, "%", (g) => this.send("fan.set_percentage", { percentage: Math.round(g) }), !e) : p}
        ${c ? l`<div class="cover-window" aria-hidden="true">
                  <div
                    class="cover-blind"
                    style=${`--closed:${100 - (w(i.current_position) ?? (t?.state === "closed" ? 0 : 100))}%`}
                  ></div>
                </div>
                <div class="button-row">
                  ${o & 1 ? l`<button class="action" ?disabled=${!e || this.pending} aria-label="Open cover" @click=${() => this.send("cover.open_cover")}>${b("up")}</button>` : p}${o & 8 ? l`<button class="action secondary" ?disabled=${!e || this.pending} aria-label="Stop cover" @click=${() => this.send("cover.stop_cover")}>${b("stop")}</button>` : p}${o & 2 ? l`<button class="action" ?disabled=${!e || this.pending} aria-label="Close cover" @click=${() => this.send("cover.close_cover")}>${b("down")}</button>` : p}
                </div>
                ${o & 4 ? this.slider("Cover position", "cover", w(i.current_position), 0, 100, 1, "%", (g) => this.send("cover.set_cover_position", { position: Math.round(g) }), !e) : p}` : p}
        ${r ? l`<div class="media-meta">
                  ${i.entity_picture ? l`<img class="art" src=${i.entity_picture} alt="" loading="lazy" />` : p}
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
                  ${o & 16 ? l`<button class="action secondary" aria-label="Previous track" ?disabled=${!e || this.pending} @click=${() => this.send("media_player.media_previous_track")}>${b("previous")}</button>` : p}${o & 16385 ? l`<button class="action" aria-label=${t?.state === "playing" ? "Pause" : "Play"} ?disabled=${!e || this.pending || (t?.state === "playing" ? !(o & 1) : !(o & 16384))} @click=${() => this.send(`media_player.${t?.state === "playing" ? "media_pause" : "media_play"}`)}>${b(t?.state === "playing" ? "pause" : "play")}</button>` : p}${o & 32 ? l`<button class="action secondary" aria-label="Next track" ?disabled=${!e || this.pending} @click=${() => this.send("media_player.media_next_track")}>${b("next")}</button>` : p}
                </div>
                ${o & 4 ? this.slider("Volume", "volume", w(i.volume_level) === void 0 ? void 0 : Number(i.volume_level) * 100, 0, 100, 1, "%", (g) => this.send("media_player.volume_set", { volume_level: g / 100 }), !e) : p}` : p}
        ${["number", "input_number"].includes(s) ? this.slider("Value", "number", w(t?.state), w(i.min) ?? 0, w(i.max) ?? 100, w(i.step) || 1, i.unit_of_measurement || "", (g) => this.send(`${s}.set_value`, { value: g }), !e) : p}
        ${["select", "input_select"].includes(s) ? l`<select
                class="select"
                aria-label=${this.config.name || i.friendly_name || "Option"}
                .value=${it(t?.state || "")}
                ?disabled=${!e || this.pending}
                @change=${(g) => this.send(`${s}.select_option`, { option: g.target.value })}
              >
                ${(i.options || []).map((g) => l`<option value=${g} .selected=${it(t?.state === g)}>${g}</option>`)}
              </select>` : p}
        ${["scene", "button", "input_button", "script"].includes(s) ? l`<div class="button-row"><button class="action" ?disabled=${!e || this.pending} @click=${() => this.send(`${s}.${s.includes("button") ? "press" : "turn_on"}`)}>${b("play")} ${s.includes("button") ? "Press" : s === "scene" ? "Activate" : "Run"}</button></div>` : p}
        ${s === "lock" ? l`<div class="button-row">
                  <button
                    class="action"
                    ?disabled=${!e || this.pending}
                    @click=${() => t.state === "locked" ? this.confirmUnlock = !0 : this.send("lock.lock")}
                  >
                    ${b("lock")}
                    ${t?.state === "locked" ? "Unlock…" : "Lock"}
                  </button>
                </div>
                ${this.confirmUnlock ? l`<div class="lock-confirm">
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
                      </div>` : p}` : p}
        ${this.error ? l`<p class="error" role="alert">${this.error}</p>` : p}
      </article>
      ${this.config.detail ? p : l`<signal-details .hass=${this.hass} .entity=${this.detailsOpen ? this.config.entity : ""} .name=${this.config.name || ""} .dark=${this.config.appearance === "dark" || this.config.appearance !== "light" && matchMedia("(prefers-color-scheme: dark)").matches} @signal-close=${() => this.detailsOpen = !1}></signal-details>`}`;
  }
}
customElements.define("signal-control", ci);
class hi extends C {
  constructor() {
    super(...arguments), this.rooms = [], this.dark = !1, this.selected = "", this.pending = !1, this.error = "";
  }
  static {
    this.properties = {
      hass: { attribute: !1 },
      rooms: { attribute: !1 },
      dark: { type: Boolean },
      selected: { state: !0 },
      pending: { state: !0 },
      error: { state: !0 }
    };
  }
  static {
    this.styles = T`
    :host {
      display: block;
      color: var(--ink);
    }
    * {
      box-sizing: border-box;
    }
    svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    button {
      font: inherit;
      color: inherit;
      cursor: pointer;
    }
    button:disabled {
      cursor: default;
      opacity: 0.5;
    }
    button:focus-visible {
      outline: 3px solid var(--ink);
      outline-offset: 4px;
    }
    .rooms,
    .individual {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
      gap: 18px;
    }
    .room {
      position: relative;
      border: 1px solid var(--line);
      background: var(--surface);
      padding: 0;
      border-radius: 28px;
      transition:
        background 0.3s,
        box-shadow 0.3s;
    }
    .room.on {
      background: color-mix(in srgb, var(--surface) 80%, #ffc56b);
      box-shadow: inset 0 0 45px #ffc56b18;
    }
    .room-open {
      display: block;
      width: 100%;
      text-align: left;
      padding: 24px;
      background: transparent;
      border: 0;
      border-radius: 28px;
      min-height: 180px;
    }
    .room-open h2 {
      padding-right: 72px;
    }
    .room-open .hint {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--muted);
      margin-top: 18px;
    }
    .room > .switch {
      position: absolute;
      right: 24px;
      top: 34px;
    }
    .room-detail {
      padding: 24px;
    }
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }
    .bulb {
      display: grid;
      place-items: center;
      width: 68px;
      height: 68px;
      border-radius: 24px;
      background: var(--line);
      color: var(--muted);
      transition:
        background 0.3s,
        box-shadow 0.3s;
    }
    .on .bulb {
      background: #ffdc94;
      color: #604007;
      box-shadow: 0 0 30px #ffc15e65;
    }
    .bulb svg {
      width: 36px;
      height: 36px;
    }
    h2 {
      font-size: 24px;
      margin: 20px 0 6px;
    }
    p {
      color: var(--muted);
      line-height: 1.5;
    }
    .switch {
      width: 76px;
      height: 44px;
      border: 0;
      background: var(--line);
      border-radius: 30px;
      padding: 5px;
    }
    .switch span {
      display: block;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--surface);
      box-shadow: 0 2px 5px #0002;
      transition: transform 0.25s;
    }
    .switch[aria-checked="true"] {
      background: #d6a240;
    }
    .switch[aria-checked="true"] span {
      transform: translateX(32px);
    }
    .details,
    .back,
    .scene {
      min-height: 44px;
      border: 1px solid var(--line);
      border-radius: 15px;
      padding: 12px 16px;
      background: var(--surface);
      display: inline-flex;
      gap: 10px;
      align-items: center;
    }
    .details {
      width: 100%;
      justify-content: space-between;
      margin-top: 12px;
    }
    .back {
      margin-bottom: 18px;
    }
    .scenes {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 16px 0 24px;
    }
    .note {
      font-size: 14px;
    }
    .error {
      color: var(--danger, #b33b36);
    }
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        transition: none !important;
      }
    }
  `;
  }
  async run(t) {
    if (!this.pending) {
      this.pending = !0, this.error = "";
      try {
        await this.hass.callService(t.split(".")[0], "turn_on", {
          entity_id: t
        });
      } catch {
        this.error = "That didn’t go through. Try again.";
      } finally {
        this.pending = !1;
      }
    }
  }
  note(t) {
    const e = Zt(
      this.hass.states[t.automation_note_entity || ""]
    );
    return e ? l`<p class="note">${e}</p>` : p;
  }
  roomCard(t, e = !1) {
    const i = t.entities.map((h) => this.hass.states[h]), s = i.filter((h) => h?.state === "on").length, a = i.filter((h) => !$(h)).length, o = a === i.length ? "Unavailable" : s ? `${s} of ${i.length} on` : a ? "Available lights off" : "All off", d = s ? t.off_script : t.on_script, r = l`<button
      class="switch"
      role="switch"
      aria-label=${`${t.name} lights`}
      aria-checked=${s > 0}
      ?disabled=${this.pending || a === i.length || !$(this.hass.states[d]) || this.hass.connection?.connected === !1}
      @click=${() => this.run(d)}
    >
      <span></span>
    </button>`, c = l`<div class="bulb" aria-hidden="true">
      ${b("bulb")}
    </div>`, u = l`<h2>${t.name}</h2>
      <p role="status">
        ${o}${a && a !== i.length ? ` · ${a} unavailable` : ""}${this.pending ? " · Sending…" : ""}
      </p>
      ${this.note(t)}`;
    return e ? l`<article
          class=${`room room-detail ${s ? "on" : ""}`}
          aria-busy=${this.pending}
        >
          <div class="top">${c}${r}</div>
          ${u}
        </article>` : l`<article
          class=${`room ${s ? "on" : ""}`}
          aria-busy=${this.pending}
        >
          <button
            class="room-open"
            aria-label=${`Open ${t.name}`}
            @click=${() => {
      this.selected = t.id, this.error = "";
    }}
          >
            ${c}${u}<span class="hint"
              >Lights${t.scenes?.length ? " & scenes" : ""}
              ${b("arrow")}</span
            ></button
          >${r}
        </article>`;
  }
  render() {
    if (!this.hass) return p;
    const t = this.rooms.find((e) => e.id === this.selected);
    return l`${t ? l`<button
              class="back"
              @click=${() => {
      this.selected = "", this.error = "";
    }}
            >
              ← All lighting</button
            >${this.roomCard(t, !0)}
            ${t.scenes?.length ? l`<h2>Scenes</h2>
                    <div class="scenes">
                      ${t.scenes.map((e) => l`<button class="scene" ?disabled=${this.pending || !this.hass.states[e.entity] || this.hass.states[e.entity].state === "unavailable"} @click=${() => this.run(e.entity)}>${b("play")} ${e.name}</button>`)}
                    </div>` : p}
            <h2>Individual lights</h2>
            <div class="individual">
              ${t.entities.map((e) => l`<signal-control .hass=${this.hass} .configuration=${{ type: "custom:signal-control", entity: e, name: this.hass.states[e]?.attributes.friendly_name?.replace(/ \(Smart Outlet\)$/, ""), appearance: this.dark ? "dark" : "light", accent: "apricot", lamp: !0 }}></signal-control>`)}
            </div>` : l`<div class="rooms">
              ${this.rooms.map((e) => this.roomCard(e))}
            </div>
            ${this.rooms.length ? p : l`<p>No rooms configured yet.</p>`}`}
    ${this.error ? l`<p class="error" role="alert">${this.error}</p>` : p}`;
  }
}
customElements.define("signal-lights", hi);
const dt = (n) => {
  const t = n.map((e) => e?.last_reported || e?.last_updated).filter((e) => !!e && Number.isFinite(Date.parse(e)));
  return t.length === n.length && t.length ? t.sort((e, i) => Date.parse(e) - Date.parse(i))[0] : void 0;
}, pi = (n, t) => n?.attributes.friendly_name || t;
function ui(n, t, e, i = /* @__PURE__ */ new Date()) {
  const s = n.states, a = (t.sensors || []).map(Nt).map((y) => ({
    id: y.entity,
    name: y.name || pi(s[y.entity], y.entity),
    e: s[y.entity],
    unverified: !!y.unverified
  })), o = a.filter(
    (y) => ["door", "window", "opening", "garage_door"].includes(
      y.e?.attributes.device_class
    ) || y.id.startsWith("lock.")
  ), d = a.filter(
    (y) => y.e?.attributes.device_class === "moisture"
  ), r = a.filter(
    (y) => !o.includes(y) && !d.includes(y)
  ), c = [], u = (y, M, L, j, U, Tt) => {
    const F = L.filter((S) => !$(S.e)), V = L.filter(
      (S) => S.id.startsWith("lock.") ? $(S.e) && S.e.state !== "locked" : S.e?.state === "on"
    ), Ct = V.map(
      (S) => `${S.name} ${y === "water" ? "reports water" : S.id.startsWith("lock.") ? S.e.state : y === "doors" ? "open" : "active"}`
    ).join("; "), zt = F.map((S) => `${S.name} offline`).join("; "), H = L.filter((S) => S.unverified && $(S.e) && !V.includes(S)), _e = H.length ? `${H.map((S) => S.name).join(" and ")} ${H.length === 1 ? "needs" : "need"} verification (last reported ${H.every((S) => S.e?.state === "off") ? "closed" : "state only"})` : "";
    c.push({
      id: y,
      label: M,
      text: [Ct, zt, _e].filter(Boolean).join(" · ") || (L.length ? j : U),
      route: "safety",
      icon: Tt,
      priority: V.length ? y === "water" ? 100 : 90 : F.length ? 80 : H.length ? 65 : L.length ? 15 : 1,
      tone: V.length ? "alert" : F.length || H.length ? "notice" : void 0,
      stamp: dt(L.map((S) => S.e)),
      timeLabel: H.length ? "Last report" : void 0
    });
  }, h = o.filter((y) => y.id.startsWith("lock.")), m = o.filter((y) => !y.id.startsWith("lock.")), f = m.some((y) => y.e?.attributes.device_class === "window");
  u(
    "doors",
    "Doors & windows",
    o,
    h.length && m.length ? "All monitored doors closed and locks locked" : h.length ? "All monitored locks locked" : f ? "All monitored doors & windows closed" : "All monitored doors closed",
    "No door or lock sensors connected",
    "lock"
  ), u(
    "water",
    "Water",
    d,
    "All monitored sensors dry",
    "No water sensors connected",
    "drop"
  ), r.length && u(
    "sensors",
    "Other sensors",
    r,
    "No active sensors",
    "No sensors connected",
    "shield"
  );
  const x = s[t.alarm_entity || ""], g = t.alarm_entity ? x : s[t.home_mode || ""], A = {
    disarmed: "Home · alarm disarmed",
    armed_night: "Sleeping · alarm armed",
    armed_away: "Away · alarm armed",
    arming: `${x?.attributes.arm_mode === "armed_night" ? "Sleeping" : "Away"} · arming`,
    pending: `${x?.attributes.arm_mode === "armed_night" ? "Sleeping" : "Away"} · door opened; siren countdown`,
    triggered: "Alarm sounding"
  };
  c.push({
    id: "mode",
    label: t.alarm_entity ? "Alarm mode" : "Household mode",
    text: $(g) ? t.alarm_entity ? A[g.state] || g.state : `${g.state} · saved preference` : t.alarm_entity ? "Alarm unavailable" : "Mode unavailable · saved preference",
    route: "safety",
    icon: "home",
    priority: $(g) ? g.state === "triggered" || g.state === "pending" ? 95 : 10 : 45,
    stamp: dt([g])
  });
  const v = [
    ...new Set((t.light_rooms || []).flatMap((y) => y.entities))
  ], _ = v.map((y) => s[y]), E = _.filter((y) => y?.state === "on").length, D = _.filter((y) => !$(y)).length, O = (t.light_rooms || []).filter(
    (y) => y.entities.some((M) => s[M]?.state === "on")
  ), tt = wt(i, n.config?.time_zone) >= 22 || wt(i, n.config?.time_zone) < 6, z = new Set(
    (t.light_rooms || []).filter((y) => !y.outdoor).flatMap((y) => y.entities).filter((y) => s[y]?.state === "on")
  ).size > 0 && ((t.alarm_entity ? ["armed_night", "armed_away", "arming", "pending"].includes(g?.state || "") : ["Sleeping", "Away"].includes(g?.state || "")) || tt);
  c.push({
    id: "lights",
    label: "Lighting",
    text: v.length ? `${E ? `${E} ${E === 1 ? "light" : "lights"} on${O.length === 1 ? " in " + O[0].name : ""}` : D ? "Available lights off" : "All lights off"}${D ? ` · ${D} unavailable` : ""}` : "No lights connected",
    route: "rooms",
    icon: "bulb",
    priority: D ? 70 : z ? 50 : 12,
    tone: D || z ? "notice" : void 0,
    stamp: dt(_),
    action: z && t.all_lights_off ? "lights" : void 0
  });
  const R = s[t.climate || ""], k = R?.attributes || {}, Z = w(k.current_temperature), ke = typeof k.hvac_action == "string" ? k.hvac_action.replaceAll("_", " ") : R?.state === "off" ? "off" : "activity unknown";
  c.push({
    id: "climate",
    label: "Climate",
    text: $(R) ? `${Z === void 0 ? "Temperature unavailable" : `${Z}°`}, ${ke}` : "Thermostat unavailable",
    route: "climate",
    icon: "climate",
    priority: !$(R) || Z === void 0 ? 65 : 11,
    tone: !$(R) || Z === void 0 ? "notice" : void 0,
    stamp: dt([R]),
    action: $(R) ? "climate" : void 0
  });
  const mt = Object.values(s).filter(
    (y) => y.entity_id.startsWith("todo.")
  ), gt = mt.filter((y) => !$(y)), St = mt.reduce(
    (y, M) => y + ($(M) && w(M.state) || 0),
    0
  );
  c.push({
    id: "lists",
    label: "Lists",
    text: mt.length ? gt.length ? `${gt.length} ${gt.length === 1 ? "list" : "lists"} unavailable` : St ? `${St} ${St === 1 ? "task" : "tasks"} on your lists` : "Nothing left on your lists" : "No lists connected",
    route: "lists",
    icon: "list",
    priority: gt.length ? 35 : 5,
    stamp: dt(mt)
  });
  const Et = t.doorbell;
  if (Et) {
    const y = Date.parse(
      s[Et.activity_entity || ""]?.attributes.last_triggered || ""
    ), M = e.review, L = M ? M.start_time * 1e3 : NaN, j = Math.max(
      Number.isFinite(y) ? y : 0,
      Number.isFinite(L) ? L : 0
    ), U = j > 0 && j <= i.getTime() && i.getTime() - j < 2 * 36e5, Tt = s[Et.entity], F = !$(Tt), V = Math.max(0, Math.floor((i.getTime() - j) / 6e4)), Ct = V < 1 ? "just now" : `${V} min ago`, zt = y >= L || !Number.isFinite(L) && Number.isFinite(y) || M?.doorbell, H = !!M && (L >= y || y >= L && y <= (M.end_time ? M.end_time * 1e3 : i.getTime()) + 1e4);
    c.push({
      id: "doorbell",
      label: "Front door",
      text: U ? `${zt ? "Doorbell rang" : "Activity detected"} ${Ct}${F ? " · camera unavailable" : ""}` : F ? "Camera unavailable" : e.error ? "Recent activity unavailable" : e.checked ? j ? "No activity in the last 2 hours" : "No activity recorded in the last 24 hours" : "Checking recent activity…",
      route: "cameras",
      icon: "camera",
      priority: U ? 75 : F || e.error ? 60 : 8,
      tone: U || F || e.error ? "notice" : void 0,
      stamp: U ? new Date(j).toISOString() : e.checked,
      timeLabel: U ? "At" : "Checked",
      image: U && H ? M?.image : void 0,
      review: U && H ? M?.id : void 0
    });
  }
  return c.sort((y, M) => M.priority - y.priority);
}
function mi(n, t = !0) {
  if (!t) return "Connection lost. Showing last received states.";
  const e = n.find((u) => u.tone === "alert");
  if (e) return e.text + ".";
  const i = n.find((u) => /offline|unavailable/i.test(u.text));
  if (i) return i.text + ".";
  const s = n.find((u) => u.id === "doorbell" && u.priority === 75);
  if (s) return s.text + ".";
  if (n.find((u) => u.id === "doors" && /\bneeds? verification\b/.test(u.text))) return "Door sensor status needs verification.";
  const o = n.find((u) => u.id === "climate"), d = n.find((u) => u.id === "lights"), r = d?.text.match(/^\d+ lights? on/)?.[0] || (d?.text === "All lights off" ? "lights off" : ""), c = o?.text.replace(", ", " and ") || "";
  return `Quiet.${[r, c].filter(Boolean).length ? " " + [r, c].filter(Boolean).join(", ") + "." : ""}`;
}
const Q = (n) => new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).format(n), he = Q, It = (n, t) => {
  const e = /* @__PURE__ */ new Date(`${Q(n)}T12:00:00Z`);
  return e.setUTCDate(e.getUTCDate() + t), Q(e);
}, gi = (n, t = "15217") => {
  const e = Q(n), i = It(n, 30);
  return `https://www.hebcal.com/hebcal?${new URLSearchParams({
    v: "1",
    cfg: "json",
    start: e,
    end: i,
    maj: "on",
    min: "on",
    mod: "on",
    ss: "on",
    s: "on",
    leyning: "off",
    c: "on",
    M: "on",
    geo: "zip",
    zip: t,
    i: "off"
  })}`;
};
function fi(n, t) {
  if (!$(n)) return [];
  if (Array.isArray(n.attributes.events)) {
    const s = Q(t);
    return n.attributes.events.flatMap((a) => !a || typeof a.date != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(a.date) || a.date < s || !["trash", "recycling", "yard"].includes(a.kind) ? [] : [{
      id: `pghst-${a.kind}-${a.date}`,
      date: a.date,
      title: a.kind === "trash" ? "Trash pickup" : a.kind === "recycling" ? "Recycling pickup" : "Yard pickup",
      kind: a.kind,
      source: "pghst",
      url: "https://pgh.st/"
    }]);
  }
  const e = [
    ["next_pickup_date", "Trash pickup", "trash"],
    ["next_recycling_date", "Recycling pickup", "recycling"],
    ["next_yard_date", "Yard pickup", "yard"]
  ], i = Q(t);
  return e.flatMap(([s, a, o]) => {
    const d = s === "next_pickup_date" ? n.state : n.attributes[s];
    if (typeof d != "string" || !/^\d{1,2}-\d{1,2}-\d{4}$/.test(d)) return [];
    const [r, c, u] = d.split("-").map(Number), h = `${u}-${String(r).padStart(2, "0")}-${String(c).padStart(2, "0")}`;
    return Number.isNaN(Date.parse(`${h}T12:00:00Z`)) || h < i ? [] : [{ id: `pghst-${o}-${h}`, date: h, title: a, kind: o, source: "pghst", url: "https://pgh.st/" }];
  });
}
function bi(n, t) {
  if (!n || typeof n != "object" || !Array.isArray(n.items)) return [];
  const e = Q(t);
  return n.items.flatMap((i) => {
    if (!i || typeof i.title != "string" || typeof i.date != "string") return [];
    const s = i.date.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || s < e) return [];
    const a = i.category === "candles" ? "candles" : i.category === "havdalah" ? "havdalah" : i.category === "parashat" ? "shabbat" : i.category === "holiday" ? "holiday" : null;
    if (!a) return [];
    const o = a === "candles" ? "Candle lighting" : a === "havdalah" ? "Havdalah" : a === "shabbat" ? "Shabbat" : i.title, d = /T\d{2}:\d{2}/.test(i.date) ? i.date : void 0;
    return [{
      id: `hebcal-${a}-${s}-${i.title}`,
      date: s,
      title: o,
      detail: a === "shabbat" ? i.title : a === "candles" && i.memo ? i.memo : void 0,
      kind: a,
      source: "hebcal",
      time: d,
      url: typeof i.link == "string" && i.link.startsWith("https://") ? i.link : "https://www.hebcal.com/shabbat?geo=zip&zip=15217"
    }];
  });
}
function vi(n) {
  return [...n].sort((t, e) => t.date.localeCompare(e.date) || (t.time || "").localeCompare(e.time || "") || t.title.localeCompare(e.title));
}
const pe = /* @__PURE__ */ new Map(), xi = {
  trash: "trash",
  recycling: "recycling",
  yard: "yard",
  candles: "candles",
  havdalah: "havdalah",
  shabbat: "shabbat",
  holiday: "holiday"
}, yi = (n) => n === "trash" || n === "recycling" || n === "yard" ? "trash" : n === "candles" ? "sun" : n === "havdalah" ? "moon" : "sparkle";
class wi extends C {
  constructor() {
    super(...arguments), this.config = { type: "custom:signal-home" }, this.events = [], this.status = "loading", this.now = /* @__PURE__ */ new Date(), this.expanded = !1, this.requestKey = "", this.requestedAt = 0, this.onVisibility = () => {
      document.visibilityState === "visible" && (this.now = /* @__PURE__ */ new Date(), this.refresh());
    };
  }
  static {
    this.properties = {
      hass: { attribute: !1 },
      config: { attribute: !1 },
      events: { state: !0 },
      status: { state: !0 },
      now: { state: !0 },
      expanded: { state: !0 }
    };
  }
  static {
    this.styles = T`
    :host { display:block; margin-top:28px; }
    * { box-sizing:border-box; }
    .heading { display:flex; align-items:baseline; justify-content:space-between; gap:12px; margin:0 2px 13px; }
    h2 { margin:0; font-size:20px; font-weight:650; letter-spacing:-.5px; }
    .heading small { color:var(--muted); font-size:11px; }
    .shell { border:1px solid var(--line); border-radius:24px; overflow:hidden; background:var(--surface); }
    .range { display:flex; align-items:center; justify-content:center; gap:7px; width:100%; min-height:48px; padding:9px 16px; border:0; border-top:1px solid var(--line); background:color-mix(in srgb,var(--surface) 95%,var(--lilac)); color:var(--ink); font:inherit; font-size:12px; font-weight:650; cursor:pointer; }
    .range:hover { background:color-mix(in srgb,var(--surface) 87%,var(--lilac)); }
    .range svg { width:15px; height:15px; }
    .empty { margin:0; padding:23px; color:var(--muted); font-size:13px; line-height:1.5; }
    .day { padding:10px 17px 8px; background:color-mix(in srgb,var(--surface) 94%,var(--lilac)); color:var(--muted); font-size:10px; font-weight:700; letter-spacing:1.1px; text-transform:uppercase; }
    .event { display:flex; align-items:center; gap:13px; min-height:68px; padding:10px 16px; color:var(--ink); text-decoration:none; border-top:1px solid var(--line); transition:background .18s,transform .18s; }
    .event:first-child { border-top:0; }
    .event:hover { background:color-mix(in srgb,var(--surface) 91%,var(--lilac)); }
    .event:focus-visible,.range:focus-visible,.credit a:focus-visible { outline:3px solid var(--ink); outline-offset:-3px; }
    .glyph { display:grid; place-items:center; width:40px; height:40px; flex:none; border-radius:13px; }
    .glyph svg { width:20px; height:20px; }
    .trash .glyph { background:#d3eadf; color:#22654c; }
    .recycling .glyph { background:#cae7f0; color:#1a667a; }
    .yard .glyph { background:#def0c5; color:#4d6e29; }
    .candles .glyph { background:#ffdfaa; color:#8c4d10; }
    .havdalah .glyph { background:#dbd5f8; color:#574494; }
    .shabbat .glyph,.holiday .glyph { background:#eedcf4; color:#794b8a; }
    .copy { flex:1; min-width:0; }
    .title { display:block; font-size:14px; font-weight:650; line-height:1.3; }
    .detail { display:block; color:var(--muted); font-size:11px; line-height:1.4; margin-top:3px; }
    .time { flex:none; font-size:13px; font-weight:700; font-variant-numeric:tabular-nums; }
    .credit { display:flex; flex-wrap:wrap; gap:4px 12px; margin:10px 3px 0; color:var(--muted); font-size:10px; line-height:1.5; }
    .credit a { color:inherit; text-underline-offset:2px; }
    @media(max-width:450px) { .heading small { display:none; } .event { min-height:62px; } }
    @media(prefers-reduced-motion:reduce) { * { transition:none !important; } }
  `;
  }
  connectedCallback() {
    super.connectedCallback(), this.refresh(), this.timer = setInterval(() => {
      this.now = /* @__PURE__ */ new Date(), this.refresh();
    }, 5 * 6e4), document.addEventListener("visibilitychange", this.onVisibility);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this.timer), document.removeEventListener("visibilitychange", this.onVisibility);
  }
  updated(t) {
    t.has("config") && this.refresh();
  }
  refresh() {
    const t = this.config.upcoming?.hebcal_zip || "15217", e = `${he(this.now)}:${t}`;
    if (e === this.requestKey && Date.now() - this.requestedAt < (this.status === "error" ? 15 * 6e4 : 6 * 36e5)) return;
    const i = pe.get(e);
    if (i && Date.now() - i.fetched < 6 * 36e5) {
      this.requestKey = e, this.events = i.events, this.status = "ready";
      return;
    }
    this.requestKey = e, this.requestedAt = Date.now(), this.status = "loading";
    const s = new AbortController(), a = setTimeout(() => s.abort(), 1e4);
    fetch(gi(this.now, t), { signal: s.signal }).then((o) => {
      if (!o.ok) throw new Error("Hebcal unavailable");
      return o.json();
    }).then((o) => {
      this.requestKey === e && (this.events = bi(o, this.now), pe.set(e, { fetched: Date.now(), events: this.events }), this.status = "ready");
    }).catch(() => {
      this.requestKey === e && (this.status = "error");
    }).finally(() => clearTimeout(a));
  }
  dateLabel(t) {
    const e = he(this.now);
    return t === e ? "Today" : t === It(this.now, 1) ? "Tomorrow" : new Intl.DateTimeFormat(this.hass?.locale?.language || "en-US", {
      timeZone: "America/New_York",
      weekday: "long",
      month: "short",
      day: "numeric"
    }).format(/* @__PURE__ */ new Date(`${t}T12:00:00Z`));
  }
  timeLabel(t) {
    return t ? new Intl.DateTimeFormat(this.hass?.locale?.language || "en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit"
    }).format(new Date(t)) : "";
  }
  render() {
    const t = this.config.upcoming?.waste_entity ? this.hass?.states[this.config.upcoming.waste_entity] : void 0, e = vi([...fi(t, this.now), ...this.events]), i = It(this.now, this.expanded ? 30 : 7), s = e.filter((c) => c.date <= i), a = t?.attributes.checked_at || t?.last_reported || t?.last_updated, o = a && Date.now() - Date.parse(a) > 36 * 36e5, d = this.config.upcoming?.waste_entity ? $(t) ? o ? "Collection schedule may be out of date" : "" : "Collection schedule unavailable" : "Collection schedule not connected", r = this.status === "error" ? "Jewish calendar unavailable" : "";
    return l`<section aria-labelledby="upcoming-title">
      <div class="heading"><h2 id="upcoming-title">Coming up</h2><small>Pittsburgh · next ${this.expanded ? "30" : "7"} days</small></div>
      <div class="shell">
        <div id="upcoming-events">${s.length ? s.map((c, u) => l`
          ${u === 0 || s[u - 1].date !== c.date ? l`<div class="day">${this.dateLabel(c.date)}</div>` : p}
          <a class=${`event ${xi[c.kind]}`} href=${c.url} target="_blank" rel="noopener noreferrer" aria-label=${`${c.title}, ${this.dateLabel(c.date)}${c.time ? ` at ${this.timeLabel(c.time)}` : ""}; source ${c.source === "pghst" ? "PGH.ST" : "Hebcal"}`}>
            <span class="glyph">${b(yi(c.kind))}</span>
            <span class="copy"><span class="title">${c.title}</span><span class="detail">${c.detail ? `${c.detail} · ` : ""}${c.source === "pghst" ? "City collection" : "Jewish calendar"}</span></span>
            ${c.time ? l`<span class="time">${this.timeLabel(c.time)}</span>` : p}
          </a>`) : l`<p class="empty">${this.status === "loading" ? "Finding what’s next…" : "Nothing on the calendar in this window."}</p>`}</div>
        <button class="range" type="button" aria-expanded=${String(this.expanded)} aria-controls="upcoming-events" @click=${() => {
      this.expanded = !this.expanded;
    }}>${this.expanded ? "Show next week" : "Show next month"} ${b(this.expanded ? "up" : "down")}</button>
      </div>
      <div class="credit">
        ${d ? l`<span>${d}</span>` : p}
        ${r ? l`<span>${r}</span>` : p}
        ${this.expanded && $(t) && !Array.isArray(t.attributes.events) ? l`<span>PGH.ST currently supplies only the next pickup of each kind.</span>` : p}
        <span>Sources: <a href="https://pgh.st/" target="_blank" rel="noopener noreferrer">PGH.ST</a> and <a href="https://www.hebcal.com/" target="_blank" rel="noopener noreferrer">Hebcal</a> (CC BY 4.0)</span>
      </div>
    </section>`;
  }
}
customElements.define("signal-upcoming", wi);
const at = 864e5;
function ue(n, t) {
  const e = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: t,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    }).formatToParts(new Date(n)).map((s) => [s.type, s.value])
  );
  return Date.UTC(
    +e.year,
    +e.month - 1,
    +e.day,
    +e.hour,
    +e.minute,
    +e.second
  ) - Math.floor(n / 1e3) * 1e3;
}
function me(n, t) {
  const e = ue(n, t), i = Math.floor((n + e) / at) * at;
  return i - ue(i - e, t);
}
function ft(n, t) {
  const e = Date.parse(n.states[`sensor.sun_next_${t}`]?.state || "");
  if (Number.isFinite(e)) return e;
  const i = Date.parse(
    String(n.states["sun.sun"]?.attributes[`next_${t}`] || "")
  );
  return Number.isFinite(i) ? i : void 0;
}
function bt(n, t, e) {
  if (n === void 0) return;
  let i = n;
  for (; i >= e; ) i -= at;
  for (; i < t; ) i += at;
  return i;
}
const N = 62, $i = 50, ki = 26;
function ge(n, t, e) {
  if (n >= t && n <= e)
    return N - $i * Math.sin(Math.PI * (n - t) / (e - t));
  const i = n < t ? e - at : e, s = n < t ? t : t + at;
  return N + ki * Math.sin(Math.PI * (n - i) / (s - i));
}
function Rt(n) {
  const t = Math.max(0, Math.round(n / 6e4)), e = Math.floor(t / 60);
  return e ? `${e}h ${t % 60}m` : `${t}m`;
}
class _i extends C {
  constructor() {
    super(...arguments), this.now = /* @__PURE__ */ new Date();
  }
  static {
    this.properties = {
      hass: { attribute: !1 },
      now: { attribute: !1 }
    };
  }
  static {
    this.styles = T`
    :host {
      display: block;
      margin-bottom: 18px;
    }
    .sun {
      border: 1px solid var(--line);
      border-radius: 24px;
      background: var(--surface);
      padding: 18px 18px 10px;
      overflow: hidden;
      transition: background 0.6s;
    }
    .sun.night {
      background: color-mix(in srgb, var(--surface) 90%, #34406b);
    }
    .head {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 6px 16px;
    }
    .eyebrow {
      display: block;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.8px;
      color: var(--muted);
    }
    .headline {
      display: block;
      margin: 6px 0 2px;
      font-size: 26px;
      font-weight: 750;
      letter-spacing: -0.5px;
      font-variant-numeric: tabular-nums;
    }
    .sub {
      font-size: 13px;
      color: var(--muted);
    }
    .sky,
    .rail {
      position: relative;
      margin: 0 -18px;
    }
    .sky {
      height: 104px;
      margin-top: 8px;
    }
    svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .mark,
    .disc {
      position: absolute;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
    .mark {
      width: 7px;
      height: 7px;
      background: var(--muted);
    }
    .disc {
      width: 22px;
      height: 22px;
      background: #ffc56b;
      box-shadow:
        0 0 0 6px #ffc56b38,
        0 0 28px #ffb44aa0;
      animation: settle 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }
    .disc.down {
      width: 14px;
      height: 14px;
      background: var(--surface);
      border: 2px solid var(--muted);
      box-shadow: none;
    }
    .rail {
      height: 20px;
      font-size: 11px;
      color: var(--muted);
      font-variant-numeric: tabular-nums;
    }
    .rail span {
      position: absolute;
      top: 2px;
      transform: translateX(-50%);
      white-space: nowrap;
    }
    @keyframes settle {
      from {
        opacity: 0;
        transform: translate(-50%, -20%) scale(0.5);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .disc {
        animation: none;
      }
      .sun {
        transition: none;
      }
    }
  `;
  }
  render() {
    if (!this.hass) return p;
    const t = this.hass.config?.time_zone, e = this.now.getTime(), i = ft(this.hass, "rising"), s = ft(this.hass, "setting");
    if (i === void 0 || s === void 0) return p;
    const a = me(e, t), o = me(a + 30 * 36e5, t), d = bt(i, a, o), r = bt(s, a, o);
    if (r <= d) return p;
    const c = bt(ft(this.hass, "dawn"), a, o), u = bt(ft(this.hass, "dusk"), a, o), h = this.hass.states["sun.sun"]?.state, m = h ? h === "above_horizon" : e >= d && e < r, f = (z) => new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: t
    }).format(new Date(z)), x = i < s ? i : s, g = `${x === i ? "Sunrise" : "Sunset"} ${f(x)}`, A = x === s ? `${Rt(x - e)} of daylight left` : `in ${Rt(x - e)}`, v = (z) => (z - a) / (o - a) * 1e3, _ = 144, E = Array.from({ length: _ + 1 }, (z, R) => {
      const k = a + (o - a) * R / _;
      return `${R ? "L" : "M"}${v(k).toFixed(1)} ${ge(k, d, r).toFixed(2)}`;
    }).join(" "), D = `${E} L1000 ${N} L0 ${N} Z`, O = v(e), tt = (z) => Math.min(88, Math.max(12, v(z) / 10)), q = (z, R) => R !== void 0 ? W`<ellipse cx=${v(z)} cy=${N} rx=${Math.max(Math.abs(v(z) - v(R)) * 2.2, 30)} ry="16" fill="url(#twilight)" />` : p;
    return l`<section class=${`sun ${m ? "day" : "night"}`} aria-label="Daylight">
      <div class="head">
        <div>
          <span class="eyebrow">Daylight</span>
          <strong class="headline">${g}</strong>
          <span class="sub">${A} · ${Rt(r - d)} today</span>
        </div>
      </div>
      <div
        class="sky"
        role="img"
        aria-label=${`Sunrise ${f(d)}, sunset ${f(r)}. The sun is ${m ? "up" : "down"}.`}
      >
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="daylight" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2=${N}>
              <stop offset="0" style="stop-color: var(--lilac); stop-opacity: 0.95" />
              <stop offset="1" style="stop-color: var(--apricot); stop-opacity: 0.75" />
            </linearGradient>
            <radialGradient id="twilight">
              <stop offset="0" style="stop-color: var(--apricot); stop-opacity: 0.9" />
              <stop offset="1" style="stop-color: var(--apricot); stop-opacity: 0" />
            </radialGradient>
            <clipPath id="above"><rect x="0" y="-20" width="1000" height=${N + 20} /></clipPath>
            <clipPath id="below"><rect x="0" y=${N} width="1000" height="60" /></clipPath>
            <clipPath id="past"><rect x="-10" y="-20" width=${O + 10} height="140" /></clipPath>
            <clipPath id="future"><rect x=${O} y="-20" width=${1010 - O} height="140" /></clipPath>
          </defs>
          ${q(d, c)} ${q(r, u)}
          <path d=${D} fill="url(#daylight)" clip-path="url(#above)" />
          <path d=${D} style=${`fill: ${m ? "var(--ink)" : "#34406b"}; fill-opacity: ${m ? 0.05 : 0.16}`} clip-path="url(#below)" />
          <line x1="0" x2="1000" y1=${N} y2=${N} style="stroke: var(--line)" stroke-width="1.5" vector-effect="non-scaling-stroke" />
          <path d=${E} fill="none" style="stroke: var(--ink); stroke-opacity: 0.55" stroke-width="2" vector-effect="non-scaling-stroke" clip-path="url(#past)" />
          <path d=${E} fill="none" style="stroke: var(--muted); stroke-opacity: 0.8" stroke-width="1.5" stroke-dasharray="3 5" vector-effect="non-scaling-stroke" clip-path="url(#future)" />
        </svg>
        ${[d, r].map(
      (z) => l`<span class="mark" style=${`left:${v(z) / 10}%;top:${N}%`}></span>`
    )}
        <span
          class=${`disc ${m ? "" : "down"}`}
          style=${`left:${O / 10}%;top:${ge(e, d, r)}%`}
        ></span>
      </div>
      <div class="rail" aria-hidden="true">
        <span style=${`left:${tt(d)}%`}>↑ ${f(d)}</span>
        <span style=${`left:${tt(r)}%`}>↓ ${f(r)}</span>
      </div>
    </section>`;
  }
}
customElements.define("signal-sun", _i);
class Ai extends C {
  constructor() {
    super(...arguments), this.config = { type: "custom:signal-home" }, this.front = {}, this.pending = "", this.error = "", this.now = /* @__PURE__ */ new Date(), this.signature = "", this.generation = 0, this.resume = () => {
      document.visibilityState === "visible" && (this.now = /* @__PURE__ */ new Date(), this.loadFront());
    };
  }
  static {
    this.properties = {
      hass: { attribute: !1 },
      config: { attribute: !1 },
      front: { state: !0 },
      pending: { state: !0 },
      error: { state: !0 },
      now: { state: !0 }
    };
  }
  static {
    this.styles = T`
    :host {
      display: block;
      color: var(--ink);
      max-width: 960px;
      margin: 0 auto;
    }
    * {
      box-sizing: border-box;
    }
    h1,
    p {
      margin: 0;
    }
    button,
    a {
      font: inherit;
      color: inherit;
    }
    button {
      cursor: pointer;
    }
    button:disabled {
      opacity: 0.45;
      cursor: default;
    }
    button:focus-visible,
    a:focus-visible {
      outline: 3px solid var(--ink);
      outline-offset: 3px;
    }
    svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    .digest-heading {
      padding: 6px 0 22px;
    }
    .eyebrow {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.8px;
      color: var(--muted);
      margin-bottom: 12px;
    }
    h1 {
      font-size: clamp(26px, 3vw, 38px);
      line-height: 1.22;
      letter-spacing: -1.1px;
      font-weight: 620;
      max-width: 760px;
      text-wrap: balance;
    }
    .digest-heading p {
      font-size: 12px;
      line-height: 1.5;
      color: var(--muted);
      margin-top: 12px;
    }
    .digest-list {
      display: flex;
      flex-direction: column;
      gap: 1px;
      background: var(--line);
      border: 1px solid var(--line);
      border-radius: 24px;
      overflow: hidden;
    }
    .row {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0 12px;
      padding: 0 18px;
      background: var(--surface);
      min-width: 0;
      transition: background 0.25s;
    }
    .row.alert {
      background: color-mix(in srgb, var(--surface) 90%, #df7461);
      border-left: 4px solid #bb503c;
      padding-left: 14px;
    }
    .row.notice {
      background: color-mix(in srgb, var(--surface) 95%, #dfb45c);
    }
    .row.notable {
      padding-top: 12px;
      padding-bottom: 12px;
    }
    .row:not(.notable) .label {
      display: inline;
      font-size: 12px;
      text-transform: none;
      letter-spacing: 0;
    }
    .row:not(.notable) .label::after {
      content: " · ";
    }
    .row:not(.notable) .text {
      display: inline;
      font-size: 13px;
    }
    .row-link {
      display: flex;
      align-items: center;
      gap: 13px;
      flex: 1 1 100%;
      min-width: 0;
      text-decoration: none;
      padding: 12px 0;
      text-align: left;
    }
    .symbol {
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      flex-shrink: 0;
      border-radius: 10px;
      color: var(--muted);
    }
    .alert .symbol {
      background: #b54a3420;
      color: #b34b36;
    }
    .notice .symbol {
      background: #b58b2f14;
    }
    .copy {
      min-width: 0;
      flex: 1;
    }
    .label {
      display: block;
      font-size: 10px;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 3px;
    }
    .text {
      display: block;
      font-size: 14px;
      line-height: 1.45;
      overflow-wrap: anywhere;
      font-weight: 500;
    }
    .notable .text {
      font-size: 17px;
      font-weight: 600;
    }
    .timestamp {
      display: block;
      color: var(--muted);
      font-size: 10px;
      line-height: 1.4;
      margin-top: 3px;
      font-weight: 400;
    }
    .chevron {
      color: var(--muted);
      width: 16px;
    }
    .picture {
      width: 100%;
      margin: 0 0 10px 45px;
      max-width: 350px;
      aspect-ratio: 16/9;
      border-radius: 14px;
      overflow: hidden;
      background: var(--line);
      position: relative;
    }
    .picture img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: relative;
    }
    .picture span {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      color: var(--muted);
      font-size: 12px;
    }
    .inline-action {
      background: transparent;
      border: 1px solid var(--line);
      border-radius: 12px;
      min-height: 44px;
      padding: 8px 12px;
      font-size: 12px;
      margin: 0 0 12px 45px;
    }
    .mode-options {
      display: flex;
      gap: 4px;
      margin: 0 0 14px 45px;
      width: calc(100% - 45px);
      max-width: 360px;
      padding: 3px;
      border: 1px solid var(--line);
      border-radius: 13px;
    }
    .mode-option {
      flex: 1;
      border: 0;
      border-radius: 9px;
      background: transparent;
      font-size: 12px;
      min-height: 40px;
      padding: 8px;
    }
    .mode-option[aria-pressed="true"] {
      background: var(--mint);
      color: #17372c;
      font-weight: 600;
    }
    .target {
      display: flex;
      align-items: center;
      gap: 4px;
      margin: 0 0 12px 45px;
      font-size: 11px;
      color: var(--muted);
    }
    .target span {
      padding-right: 8px;
    }
    .target button {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: transparent;
    }
    .target svg {
      width: 15px;
      height: 15px;
    }
    @media (max-width: 649px) {
      .row[data-row="climate"] .row-link {
        flex: 1;
        min-width: 140px;
      }
      .row[data-row="climate"] .target {
        display: grid;
        grid-template-columns: 40px 40px;
        gap: 3px;
        margin: 8px 0;
      }
      .row[data-row="climate"] .target span {
        grid-column: 1/-1;
        font-size: 10px;
        padding: 0;
        text-align: center;
      }
      .row[data-row="climate"] .target button {
        width: 40px;
        height: 44px;
      }
      .mode-options {
        margin-bottom: 10px;
      }
      .row[data-row="mode"] .row-link {
        padding-bottom: 8px;
      }
    }
    .feedback {
      font-size: 13px;
      line-height: 1.5;
      margin: 12px 0;
    }
    .error {
      color: #ba4935;
    }
    .note {
      width: 100%;
      margin: 0 0 12px 45px;
      font-size: 11px;
      color: var(--muted);
    }
    @media (min-width: 650px) {
      .row-link {
        flex: 1;
        min-width: 200px;
      }
      .target,
      .inline-action {
        margin: 0;
      }
      .row:not(.notable) .row-link {
        padding: 17px 0;
      }
      .mode-options {
        margin: 0;
        width: 260px;
      }
      .picture {
        max-width: 260px;
        margin-left: 45px;
        margin-bottom: 10px;
      }
      .row {
        padding-left: 22px;
        padding-right: 22px;
      }
      .row.alert {
        padding-left: 18px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      * {
        transition: none !important;
      }
    }
  `;
  }
  connectedCallback() {
    super.connectedCallback(), this.signature = "", this.timer = setInterval(() => {
      this.now = /* @__PURE__ */ new Date(), document.visibilityState === "visible" && this.loadFront();
    }, 6e4), document.addEventListener("visibilitychange", this.resume);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.generation++, clearInterval(this.timer), document.removeEventListener("visibilitychange", this.resume);
  }
  willUpdate() {
    const t = JSON.stringify([
      this.config.doorbell,
      this.hass?.user?.id
    ]);
    this.hass && (t !== this.signature || this.connection !== this.hass.connection) && (this.signature = t, this.connection = this.hass.connection, this.front = {}, this.loadFront());
  }
  async loadFront() {
    const t = this.config.doorbell;
    if (!t || !this.hass || this.hass.connection?.connected === !1) return;
    const e = ++this.generation, i = () => this.isConnected && e === this.generation, s = async (a) => {
      let o;
      try {
        return await Promise.race([
          this.hass.callWS(a),
          new Promise((d, r) => {
            o = setTimeout(() => r(new Error("timeout")), 1e4);
          })
        ]);
      } finally {
        clearTimeout(o);
      }
    };
    try {
      const a = await s({
        type: "frigate/reviews/get",
        instance_id: t.instance || "frigate",
        cameras: [t.camera],
        after: Date.now() / 1e3 - 86400,
        limit: 1
      });
      if (!i()) return;
      const o = typeof a == "string" ? JSON.parse(a) : a;
      if (!Array.isArray(o)) throw new Error();
      const d = o[0];
      let r;
      if (d) {
        if (d.camera !== t.camera || !/^\d{10}(?:\.\d+)?-[a-zA-Z0-9]+$/.test(d.id) || !Number.isFinite(d.start_time) || d.start_time > Date.now() / 1e3 + 5)
          throw new Error();
        if (r = {
          id: d.id,
          start_time: d.start_time,
          end_time: d.end_time,
          doorbell: d.data?.objects?.some(
            (c) => c.startsWith("doorbell")
          )
        }, Date.now() / 1e3 - d.start_time < 7200)
          try {
            const c = await s({
              type: "auth/sign_path",
              path: `/api/frigate/${t.instance || "frigate"}/notifications/${d.id}/${t.camera}/review_thumbnail.webp`,
              expires: 300
            });
            r.image = new URL(c.path, location.origin).href;
          } catch {
          }
      }
      i() && (this.front = { checked: (/* @__PURE__ */ new Date()).toISOString(), review: r });
    } catch {
      i() && (this.front = { ...this.front, error: !0 });
    }
  }
  go(t, e) {
    e?.preventDefault(), this.dispatchEvent(
      new CustomEvent("signal-digest-navigation", {
        detail: { route: t.route, review: t.review },
        bubbles: !0,
        composed: !0
      })
    );
  }
  async send(t, e, i, s) {
    if (!(this.pending || this.hass.connection?.connected === !1)) {
      this.pending = t, this.error = "";
      try {
        await this.hass.callService(e, i, s);
      } catch {
        this.error = "That didn’t go through. Check the connection and try again.";
      } finally {
        this.pending = "";
      }
    }
  }
  time(t) {
    if (!t.stamp)
      return t.text.startsWith("No ") && t.text.endsWith("connected") ? "Not configured" : "Update time unavailable";
    const e = new Date(t.stamp), i = {
      hour: "numeric",
      minute: "2-digit",
      timeZone: this.hass.config?.time_zone
    };
    return this.now.getTime() - e.getTime() > 864e5 && (i.month = "short", i.day = "numeric"), `${t.timeLabel || "Updated"} ${e.toLocaleString(this.hass.locale?.language || void 0, i)}`;
  }
  target() {
    const t = this.hass.states[this.config.climate || ""];
    if (!$(t) || t.state === "off") return p;
    const e = t.attributes, i = w(e.supported_features) || 0;
    if (t.state === "heat_cool" && (!(i & 2) || w(e.target_temp_low) === void 0 || w(e.target_temp_high) === void 0))
      return p;
    const s = t.state === "heat_cool" && !!(i & 2), a = s && e.hvac_action === "cooling", o = s ? a ? "target_temp_high" : "target_temp_low" : "temperature", d = w(e[o]);
    if (d === void 0 || !s && !(i & 1)) return p;
    const r = w(e.min_temp) ?? 7, c = w(e.max_temp) ?? 35, u = s && a ? Math.max(r, w(e.target_temp_low) ?? r) : r, h = s && !a ? Math.min(c, w(e.target_temp_high) ?? c) : c, m = w(e.target_temp_step) || (this.hass.config?.unit_system?.temperature === "°F" ? 1 : 0.5), f = s ? a ? "Cool above" : "Heat below" : "Target", x = (g) => {
      this.send("climate", "climate", "set_temperature", {
        entity_id: this.config.climate,
        [o]: Math.max(
          u,
          Math.min(h, Math.round((d + g * m) * 10) / 10)
        ),
        ...s ? {
          [a ? "target_temp_low" : "target_temp_high"]: e[a ? "target_temp_low" : "target_temp_high"]
        } : {}
      });
    };
    return l`<div class="target">
      <span>${f} ${d}°</span
      ><button
        aria-label=${`Decrease ${f.toLowerCase()} temperature`}
        ?disabled=${!!this.pending || this.hass.connection?.connected === !1 || d <= u}
        @click=${() => x(-1)}
      >
        ${b("minus")}</button
      ><button
        aria-label=${`Increase ${f.toLowerCase()} temperature`}
        ?disabled=${!!this.pending || this.hass.connection?.connected === !1 || d >= h}
        @click=${() => x(1)}
      >
        ${b("plus")}
      </button>
    </div>`;
  }
  row(t) {
    const e = !!t.tone, i = l`<span class="symbol">${b(t.icon)}</span
      ><span class="copy"
        ><span class="label">${t.label}</span
        ><span class="text">${t.text}</span
        ><span class="timestamp"
          >${this.time(t)}${t.id === "doorbell" && this.front.error ? " · refresh failed" : ""}</span
        ></span
      >${b("arrow")}`;
    return l`<section
      class=${`row ${t.tone || ""} ${e ? "notable" : ""}`}
      data-row=${t.id}
      aria-label=${t.label}
    >
      <a class="row-link" href=${`#signal/${t.route}`} @click=${(s) => this.go(t, s)}>${i}</a>
      ${t.image ? l`<a class="picture" aria-label="View front door event" href="#signal/cameras" @click=${(s) => this.go(t, s)}><span>Preview unavailable</span><img src=${t.image} alt="Recorded front-door activity" @error=${(s) => s.target.style.visibility = "hidden"} /></a>` : p}
      ${t.action === "lights" ? l`<button class="inline-action" ?disabled=${!!this.pending || !$(this.hass.states[this.config.all_lights_off || ""]) || this.hass.connection?.connected === !1} @click=${() => this.send("lights", "script", "turn_on", { entity_id: this.config.all_lights_off })}>Turn all off</button>` : p}
      ${t.action === "climate" ? this.target() : p}
      ${t.id === "lights" ? (this.config.light_rooms || []).map((s) => {
      const a = Zt(
        this.hass.states[s.automation_note_entity || ""]
      );
      return a ? l`<p class="note">${s.name} · ${a}</p>` : p;
    }) : p}
    </section>`;
  }
  render() {
    if (!this.hass) return p;
    const t = this.hass.connection?.connected !== !1, e = ui(this.hass, this.config, this.front, this.now);
    return l`<header class="digest-heading">
        <div class="eyebrow">Your home</div>
        <h1>${mi(e, t)}</h1>
        ${t ? p : l`<p>Reconnect to see current conditions.</p>`}
      </header>
      ${this.config.sun !== !1 ? l`<signal-sun .hass=${this.hass} .now=${this.now}></signal-sun>` : p}
      <div class="digest-list">
        ${yt(
      e,
      (i) => i.id,
      (i) => this.row(i)
    )}
      </div>
      <signal-upcoming .hass=${this.hass} .config=${this.config}></signal-upcoming>
      ${this.pending ? l`<p class="feedback" role="status">Sending…</p>` : p}${this.error ? l`<p class="feedback error" role="alert">${this.error}</p>` : p}`;
  }
}
customElements.define("signal-digest", Ai);
const Si = T`
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
  .alarm-schedule-note {margin:-12px 0 18px;color:var(--muted);font-size:12px;line-height:1.4;opacity:.85;}
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
function Ei(n) {
  return n.map((t) => {
    const e = t.lu ?? t.last_updated ?? t.lc ?? t.last_changed;
    return { time: typeof e == "number" ? e * 1e3 : Date.parse(String(e)), value: w(t.s ?? t.state) ?? null };
  }).filter((t) => Number.isFinite(t.time)).sort((t, e) => t.time - e.time);
}
function Ti(n, t = 600) {
  if (n.length <= t) return n;
  const e = Math.ceil(n.length / (t / 4)), i = [];
  for (let s = 0; s < n.length; s += e) {
    const a = n.slice(s, s + e), o = a.filter((c) => c.value !== null), d = /* @__PURE__ */ new Set([a[0], a[a.length - 1]]);
    o.length && (d.add(o.reduce((c, u) => c.value < u.value ? c : u)), d.add(o.reduce((c, u) => c.value > u.value ? c : u)));
    const r = a.find((c) => c.value === null);
    r && d.add(r), i.push(...[...d].sort((c, u) => c.time - u.time));
  }
  return i;
}
function Ci(n, t, e) {
  const i = new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: e }), s = (r) => {
    const c = Number(i.format(new Date(r)));
    return c >= 6 && c < 18;
  }, a = [];
  let o = n, d = s(n);
  for (let r = Math.min(n + 30 * 6e4, t); r <= t; r = Math.min(r + 30 * 6e4, t)) {
    const c = s(r);
    if (c !== d) {
      let u = r - 18e5, h = r;
      for (; h - u > 6e4; ) {
        const m = Math.floor((u + h) / 2);
        s(m) === d ? u = m : h = m;
      }
      a.push({ start: o, end: h, day: d }), o = h, d = c;
    }
    if (r === t) break;
  }
  return a.push({ start: o, end: t, day: d }), a;
}
const Lt = /* @__PURE__ */ new WeakMap();
class zi extends C {
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
      Vt,
      T`
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
      .time-band.day { fill: #efc77f; opacity: .15; }
      .time-band.night { fill: #657ba9; opacity: .18; }
      .widget.dark .time-band.day { opacity: .1; }
      .widget.dark .time-band.night { opacity: .22; }
      .day-night-key { display:flex; justify-content:flex-end; align-items:center; gap:12px; color:var(--subtle); font-size:10px; margin-top:7px; }
      .day-night-key span { display:inline-flex; align-items:center; gap:5px; }
      .day-night-key i { display:inline-block; width:10px; height:10px; border-radius:3px; background:#efc77f; }
      .day-night-key .night i { background:#657ba9; }
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
      At
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
        (e) => e.startsWith("sensor.") && w(t.states[e].state) !== void 0
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
        const a = Lt.get(e)?.get(`${i}:${s}`);
        a && Date.now() - a.end < 6e4 && (this.points = a.points, this.start = a.start, this.end = a.end, this.displayedHours = a.hours, this.queried = s);
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
      const a = await this.hass.callWS({
        type: "history/history_during_period",
        start_time: new Date(s).toISOString(),
        end_time: new Date(e).toISOString(),
        entity_ids: [this.config.entity],
        minimal_response: !0,
        no_attributes: !0,
        significant_changes_only: !1
      });
      if (t === this.sequence) {
        this.points = Ei(a[this.config.entity] || []), this.start = s, this.end = e, this.displayedHours = i;
        const o = this.hass.connection || this.hass.callWS;
        let d = Lt.get(o);
        d || Lt.set(o, d = /* @__PURE__ */ new Map());
        const r = `${this.cacheUser}:${this.queried}`;
        d.delete(r), d.set(r, { points: this.points, start: s, end: e, hours: i }), d.size > 16 && d.delete(d.keys().next().value);
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
    for (let a = 1; a < this.points.length; a++)
      Math.abs(this.points[a].time - i) < Math.abs(this.points[s].time - i) && (s = a);
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
    const e = w(t);
    return e === void 0 ? "—" : new Intl.NumberFormat(this.hass?.locale?.language || void 0, {
      maximumFractionDigits: 1
    }).format(e);
  }
  render() {
    const t = this.hass?.states[this.config.entity], e = t?.attributes.unit_of_measurement || "", i = this.points.filter((v) => v.value !== null), s = i.map((v) => v.value), a = s.length ? s.reduce((v, _) => Math.min(v, _), 1 / 0) : 0, o = s.length ? s.reduce((v, _) => Math.max(v, _), -1 / 0) : 1, d = Math.max((o - a) * 0.16, 1), r = a - d, c = o + d, u = (v) => Math.max(
      0,
      Math.min(600, (v.time - this.start) / (this.end - this.start) * 600)
    ), h = (v) => 150 - (v.value - r) / (c - r) * 150, m = [];
    let f = [];
    for (const v of Ti(this.points))
      v.value === null ? (f.length && m.push(f), f = []) : f.push(v);
    f.length && m.push(f);
    const x = this.cursor !== void 0 ? this.points[this.cursor] : void 0, g = Ci(this.start, this.end, this.hass?.config?.time_zone), A = x ? x.value : $(t) ? t.state : void 0;
    return l`<article
      class=${`widget ${this.config.appearance || "auto"} ${this.config.accent || "lilac"}`}
    >
      <div class="top">
        <span class="header-title"
          >${b("graph")}${this.config.name || t?.attributes.friendly_name || this.config.entity}</span
        >
        <div class="periods" aria-label="History period">
          ${[6, 24, 168].map((v) => l`<button aria-pressed=${this.hours === v} @click=${() => this.period(v)}>${v === 168 ? "7d" : `${v}h`}</button>`)}
        </div>
      </div>
      <div class="reading">
        <div>
          <div class="value numeric">
            ${this.format(A)}<small>${e}</small>
          </div>
          <div class="time">
            ${x ? new Date(x.time).toLocaleString(this.hass?.locale?.language || void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : $(t) ? "Right now" : "Current reading unavailable"}
          </div>
        </div>
        <span class="subtle"
          >${this.displayedHours === 168 ? "7 days" : this.displayedHours + " hours"}
          of history</span
        >
      </div>
      <div class="plot" aria-busy=${this.loading || this.suspended}>
        ${(this.loading || this.suspended) && !this.points.length ? l`<div
                class="skeleton"
                style=${this.suspended ? "animation: none" : ""}
                role="status"
                aria-label="Loading history"
              ></div>` : i.length ? l`<div
                    class="chart"
                    tabindex="0"
                    role="slider"
                    aria-label="History cursor"
                    aria-valuemin="0"
                    aria-valuemax=${Math.max(0, this.points.length - 1)}
                    aria-valuenow=${this.cursor ?? this.points.length - 1}
                    aria-valuetext=${`${this.format(A)} ${e}`}
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
                      ${g.map((v) => W`<rect class=${`time-band ${v.day ? "day" : "night"}`} x=${Math.max(0, (v.start - this.start) / (this.end - this.start) * 600)} y="0" width=${Math.max(0, (v.end - v.start) / (this.end - this.start) * 600)} height="160"/>`)}
                      ${[25, 75, 125].map((v) => W`<line class="grid-line" x1="0" y1=${v} x2="600" y2=${v}/>`)}${m.map(
      (v) => {
        const _ = v.map(
          (E, D) => `${D ? "L" : "M"}${u(E).toFixed(2)},${h(E).toFixed(2)}`
        ).join(" ");
        return W`<path class="fill" d=${`${_} L${u(v[v.length - 1])},160 L${u(v[0])},160 Z`}/><path class="line" d=${_}/>${v.length === 1 ? W`<circle cx=${u(v[0])} cy=${h(v[0])} r="3" fill="var(--accent-ink)"/>` : p}`;
      }
    )}${x ? W`<line class="cursor-line" x1=${u(x)} x2=${u(x)} y1="0" y2="160"/>${x.value !== null ? W`<circle class="cursor-dot" cx=${u(x)} cy=${h(x)} r="5"/>` : p}` : p}
                    </svg>
                  </div>
                  <div class="bounds">
                    <span
                      >${new Date(this.start).toLocaleString(void 0, { weekday: this.displayedHours > 24 ? "short" : void 0, hour: "numeric", minute: "2-digit" })}</span
                    ><span
                      >${new Date(this.end).toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" })}</span
                    >
                  </div>` : l`<div class="empty">
                  ${this.error ? "History is unavailable." : "No numeric history in this period."}
                </div>`}
        ${i.length ? l`<div class="day-night-key" aria-label="Time shading: daytime 6 AM to 6 PM, nighttime 6 PM to 6 AM"><span><i></i>Day · 6–18</span><span class="night"><i></i>Night · 18–6</span></div>` : p}
      </div>
      <div class="history-status" role="status">
        <span
          >${this.error ? `${this.error}${this.points.length ? " Showing previous data." : ""}` : this.loading ? "Updating history…" : ""}</span
        >
        ${this.error ? l`<button class="retry" @click=${() => this.fetchHistory()}>Try again</button>` : p}
      </div>
      <div class="stats">
        <span
          >Low<strong
            >${s.length ? this.format(a) : "—"} ${e}</strong
          ></span
        ><span
          >High<strong
            >${s.length ? this.format(o) : "—"} ${e}</strong
          ></span
        ><span>Samples<strong>${i.length}</strong></span>
      </div>
    </article>`;
  }
}
customElements.define("signal-graph", zi);
class Mi extends C {
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
      Vt,
      T`
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
    const t = this.hass?.states[this.config.entity], e = $(t), i = e ? w(t.state) : void 0, s = i === void 0 ? 0 : Math.max(
      0,
      Math.min(
        100,
        (i - (this.config.min ?? 0)) / ((this.config.max ?? 100) - (this.config.min ?? 0)) * 100
      )
    );
    return l`<div
        class=${`widget ${this.config.appearance || "auto"} ${this.config.accent || "lime"}`}
        role="button"
        tabindex="0"
        @click=${this.more}
        @keydown=${(a) => {
      ["Enter", " "].includes(a.key) && (a.preventDefault(), this.more());
    }}
      >
        <div class="top">
          <h2>
            ${this.config.name || t?.attributes.friendly_name || this.config.entity}
          </h2>
          <span class="symbol"
            >${b(t?.attributes.device_class === "humidity" ? "drop" : t?.attributes.device_class === "temperature" ? "climate" : "graph")}</span
          >
        </div>
        <div class="metric numeric">
          ${e ? i === void 0 ? P(t.state) : new Intl.NumberFormat(this.hass?.locale?.language || void 0, { maximumFractionDigits: 1 }).format(i) : "—"}<small>
            ${t?.attributes.unit_of_measurement || ""}</small
          >
        </div>
        <span class="subtle">${e ? "Tap for details" : "Unavailable"}</span
        >${this.config.max !== void 0 ? l`<div class="meter" aria-hidden="true"><span style=${`width:${s}%`}></span></div>` : ""}
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
customElements.define("signal-metric", Mi);
function Di(n, t, e, i) {
  const s = new Map(t.map((d) => [d.category_id, d.name])), a = /* @__PURE__ */ new Map(), o = [];
  for (const d of n) {
    if (d.platform !== "automation" || d.disabled_by || !d.labels?.includes(e)) continue;
    const r = d.categories?.automation;
    r && s.has(r) ? a.set(r, [...a.get(r) || [], d.entity_id]) : o.push({ id: d.entity_id, name: i(d.entity_id), entities: [d.entity_id] });
  }
  for (const [d, r] of a)
    o.push(
      r.length > 1 ? { id: `category:${d}`, name: s.get(d), entities: r.sort((c, u) => i(c).localeCompare(i(u))) } : { id: r[0], name: i(r[0]), entities: r }
    );
  return o.sort((d, r) => d.name.localeCompare(r.name));
}
class Ri extends C {
  constructor() {
    super(...arguments), this.label = "show_in_signal", this.groups = [], this.loading = !1, this.loaded = !1, this.loadError = "", this.pending = "", this.error = "";
  }
  static {
    this.properties = {
      hass: { attribute: !1 },
      label: {},
      groups: { state: !0 },
      loading: { state: !0 },
      loadError: { state: !0 },
      pending: { state: !0 },
      error: { state: !0 }
    };
  }
  static {
    this.styles = T`
    :host {
      display: block;
      color: var(--ink);
      max-width: 740px;
    }
    * {
      box-sizing: border-box;
    }
    svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    button {
      font: inherit;
      color: inherit;
      cursor: pointer;
    }
    button:disabled {
      cursor: default;
      opacity: 0.5;
    }
    button:focus-visible {
      outline: 3px solid var(--ink);
      outline-offset: 4px;
    }
    .list {
      border: 1px solid var(--line);
      border-radius: 28px;
      background: var(--surface);
      padding: 6px 24px;
    }
    .automation {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 18px 0;
    }
    .automation + .automation {
      border-top: 1px solid var(--line);
    }
    .mark {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 16px;
      background: var(--line);
      color: var(--muted);
      transition: background 0.3s, color 0.3s;
    }
    .on .mark {
      background: var(--mint);
      /* Mint stays light in both themes, so the mark keeps dark ink. */
      color: #24402f;
    }
    .copy {
      flex: 1;
      min-width: 0;
    }
    h2 {
      font-size: 17px;
      margin: 0 0 4px;
      overflow-wrap: anywhere;
    }
    p {
      margin: 0;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.45;
    }
    .switch {
      flex: none;
      width: 64px;
      height: 38px;
      border: 0;
      background: var(--line);
      border-radius: 30px;
      padding: 4px;
    }
    .switch span {
      display: block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: var(--surface);
      box-shadow: 0 2px 5px #0002;
      transition: transform 0.25s;
    }
    .switch[aria-checked="true"] {
      background: var(--accent);
    }
    .switch[aria-checked="true"] span {
      transform: translateX(26px);
    }
    .switch[aria-checked="mixed"] span {
      transform: translateX(13px);
    }
    .note {
      margin-top: 16px;
    }
    .retry {
      min-height: 44px;
      margin-top: 12px;
      border: 1px solid var(--line);
      border-radius: 15px;
      padding: 10px 16px;
      background: var(--surface);
    }
    .error {
      color: var(--danger, #b33b36);
      margin-top: 16px;
    }
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        transition: none !important;
      }
    }
  `;
  }
  updated(t) {
    (t.has("hass") || t.has("label")) && this.hass && !this.loaded && !this.loading && this.load();
  }
  name(t) {
    return this.hass.states[t]?.attributes.friendly_name || t.replace(/^automation\./, "").replaceAll("_", " ");
  }
  async load() {
    this.loading = !0, this.loadError = "";
    try {
      const [t, e] = await Promise.all([
        this.hass.callWS({ type: "config/entity_registry/list" }),
        this.hass.callWS({ type: "config/category_registry/list", scope: "automation" })
      ]);
      this.groups = Di(t, e, this.label, (i) => this.name(i)), this.loaded = !0;
    } catch {
      this.loadError = "Couldn’t load automations from Home Assistant.";
    } finally {
      this.loading = !1;
    }
  }
  async toggle(t, e) {
    if (!this.pending) {
      this.pending = t.id, this.error = "";
      try {
        await this.hass.callService("automation", e ? "turn_on" : "turn_off", { entity_id: t.entities });
      } catch {
        this.error = `${t.name} didn’t switch ${e ? "on" : "off"}. Try again.`;
      } finally {
        this.pending = "";
      }
    }
  }
  row(t) {
    const e = t.entities.map((r) => this.hass.states[r]), i = e.filter($), s = i.filter((r) => r.state === "on").length, a = s > 0 && s === e.length, o = i.length ? a ? "On" : s ? `${s} of ${e.length} on` : i.length < e.length ? "Off · some unavailable" : "Off" : "Unavailable", d = t.entities.length > 1 ? t.entities.map((r) => this.name(r)).join(" · ") : "";
    return l`<div class=${`automation ${s ? "on" : ""}`} aria-busy=${this.pending === t.id}>
      <span class="mark" aria-hidden="true">${b("clock")}</span>
      <div class="copy">
        <h2>${t.name}</h2>
        ${d ? l`<p>${d}</p>` : p}
        <p role="status">${o}${this.pending === t.id ? " · Sending…" : ""}</p>
      </div>
      <button
        class="switch"
        role="switch"
        aria-label=${t.name}
        aria-checked=${a ? "true" : s ? "mixed" : "false"}
        ?disabled=${!!this.pending || !i.length || this.hass.connection?.connected === !1}
        @click=${() => this.toggle(t, !a)}
      ><span></span></button>
    </div>`;
  }
  render() {
    return this.hass ? this.loadError ? l`<p class="error" role="alert">${this.loadError}</p>
        <button class="retry" ?disabled=${this.loading} @click=${() => this.load()}>Try again</button>` : this.loaded ? this.groups.length ? l`<div class="list">${this.groups.map((t) => this.row(t))}</div>
      <p class="note">Automations in the same Home Assistant category switch on and off together.</p>
      ${this.error ? l`<p class="error" role="alert">${this.error}</p>` : p}` : l`<p>No automations are shared with Signal yet. In Home Assistant, add the label “${this.label === "show_in_signal" ? "Show in Signal" : this.label}” to an automation to show it here.</p>` : l`<p role="status">Loading automations…</p>` : p;
  }
}
customElements.define("signal-automations", Ri);
const Li = [
  { id: "home", name: "Home", icon: "home" },
  { id: "rooms", name: "Lighting", icon: "bulb" },
  { id: "cameras", name: "Cameras", icon: "camera" },
  { id: "lists", name: "Lists", icon: "list" },
  { id: "safety", name: "Security", icon: "shield" },
  { id: "climate", name: "Climate", icon: "climate" },
  { id: "automations", name: "Automations", icon: "clock" }
], Oi = {
  off: "Off",
  heat: "Heat",
  cool: "Cool",
  heat_cool: "Auto",
  auto: "Auto",
  dry: "Dry",
  fan_only: "Fan"
};
class Ni extends C {
  constructor() {
    super(...arguments), this.config = { type: "custom:signal-home" }, this.tab = "home", this.pageTravel = 0, this.pendingTodo = "", this.editingTodo = "", this.editDraft = "", this.savingEdit = !1, this.messageTone = "neutral", this.dark = !1, this.appearance = "auto", this.completedTodos = [], this.completionTimes = {}, this.deleteError = "", this.todoMutating = !1, this.todoRefreshPending = !1, this.todoOrder = /* @__PURE__ */ new Map(), this.selectedTodo = "", this.loadedTodo = "", this.discoveredTodos = [], this.detailEntity = "", this.detailReady = !1, this.menuOpen = !1, this.moreOpen = !1, this.moreDestination = "", this.contentScrolled = !1, this.onContentScroll = (t) => {
      this.contentScrolled = t.currentTarget.scrollTop > 4;
    }, this.chrome = new ti(), this.chromePath = "", this.syncChrome = () => {
      this.isConnected && this.immersive && location.pathname === this.chromePath ? this.chrome.sync(this.dark, this.hass?.auth?.external) : this.chrome.release();
    }, this.phone = window.matchMedia("(max-width: 760px)"), this.narrow = this.phone.matches, this.resize = () => {
      this.narrow = this.phone.matches;
    }, this.todos = [], this.rangeSide = "low", this.cameraRoute = "", this.syncRoute = () => {
      const t = location.hash.replace("#signal/", ""), e = t === "lights" ? "rooms" : t, i = this.tabs.some((a) => a.id === e) ? e : "home", s = i === "cameras" ? location.search : "";
      s !== this.cameraRoute && (this.cameraRoute = s, this.resetScroll()), i !== this.tab && (this.pageTravel = this.tabs.findIndex((a) => a.id === i) > this.tabs.findIndex((a) => a.id === this.tab) ? 12 : -12, this.tab = i, this.resetScroll());
    }, this.todoError = "", this.busy = !1, this.message = "", this.draft = "", this.todoSequence = 0, this.todoSignature = "", this.todoLoading = !1, this.todoLoaded = !1, this.media = window.matchMedia("(prefers-color-scheme: dark)"), this.applyAppearance = () => {
      let t = null;
      try {
        t = localStorage.getItem(this.appearanceKey);
      } catch {
      }
      const e = t || this.config.appearance || "auto";
      this.appearance = de.includes(e) ? e : "auto", this.dark = ei(
        this.appearance,
        this.media.matches,
        /* @__PURE__ */ new Date(),
        this.hass?.config?.time_zone,
        this.hass?.states["sun.sun"]?.state
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
      moreOpen: { state: !0 },
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
      editingTodo: { state: !0 },
      editDraft: { state: !0 },
      messageTone: { state: !0 }
    };
  }
  static {
    this.styles = [Xe, Je, Qe, At, Si];
  }
  get tabs() {
    return Li;
  }
  get todoLists() {
    return this.todoListStates === this.hass?.states ? this.discoveredTodos : (this.todoListStates = this.hass?.states, this.discoveredTodos = Object.entries(this.hass?.states || {}).filter(([t]) => t.startsWith("todo.")).map(([t, e]) => ({ ...e, entity_id: t })).sort(
      (t, e) => this.listName(t.entity_id).localeCompare(this.listName(e.entity_id))
    ), this.discoveredTodos);
  }
  listName(t) {
    return this.hass?.states[t]?.attributes.friendly_name || P(t.replace(/^todo\./, ""));
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
    this.closeDelete(), this.deleteTarget = void 0, this.loadedTodo = this.todoEntity || "", this.todoSignature = "", this.todoSequence++, this.todos = [], this.completedTodos = [], this.todoOrder.clear(), this.undoItem = void 0, this.message = "", this.draft = "", this.editingTodo = "", this.editDraft = "", this.todoError = "", this.todoLoaded = !1;
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
    super.connectedCallback(), this.chromePath = location.pathname, window.addEventListener("location-changed", this.syncChrome), window.addEventListener("popstate", this.syncChrome), this.syncRoute(), window.addEventListener("popstate", this.syncRoute), window.addEventListener("hashchange", this.syncRoute), window.addEventListener("location-changed", this.syncRoute), this.media.addEventListener("change", this.applyAppearance), document.addEventListener("visibilitychange", this.applyAppearance), this.phone.addEventListener("change", this.resize), this.resize(), this.applyAppearance(), this.clock = setInterval(() => {
      this.applyAppearance(), this.requestUpdate(), this.todoEntity && this.loadTodos();
    }, 6e4), this.alarmClock = setInterval(() => {
      const t = this.state(this.config.alarm_entity)?.state;
      (t === "arming" || t === "pending") && this.requestUpdate();
    }, 1e3);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("location-changed", this.syncChrome), window.removeEventListener("popstate", this.syncChrome), this.chrome.release(), window.removeEventListener("popstate", this.syncRoute), window.removeEventListener("hashchange", this.syncRoute), window.removeEventListener("location-changed", this.syncRoute), this.media.removeEventListener("change", this.applyAppearance), document.removeEventListener("visibilitychange", this.applyAppearance), this.phone.removeEventListener("change", this.resize), clearInterval(this.clock), clearInterval(this.alarmClock), clearTimeout(this.timer), this.todoSequence++;
  }
  setConfig(t) {
    if (!t || typeof t != "object")
      throw new Error("Signal Home needs a configuration.");
    for (const i of ["climate", "weather", "todo", "humidity"])
      if (t[i] && typeof t[i] != "string")
        throw new Error(`${i} must be an entity ID.`);
    if (t.sensors && (!Array.isArray(t.sensors) || t.sensors.some(
      (i) => !i || typeof Nt(i).entity != "string"
    )))
      throw new Error(
        "Sensors must be entity IDs or objects containing entity."
      );
    if (t.favorites && (!Array.isArray(t.favorites) || t.favorites.some((i) => typeof i != "string")))
      throw new Error("Favorites must be entity IDs.");
    if (t.graphs && (!Array.isArray(t.graphs) || t.graphs.some(
      (i) => !i || typeof i != "string" && (typeof i.entity != "string" || i.hours !== void 0 && (!Number.isFinite(i.hours) || i.hours < 1 || i.hours > 168))
    )))
      throw new Error(
        "Graphs need an entity ID and optional hours between 1 and 168."
      );
    for (const i of ["cameras", "alarm_cameras"])
      if (t[i] !== void 0 && (!Array.isArray(t[i]) || t[i].some((s) => typeof s != "string" || !/^camera\.[a-z0-9_]+$/.test(s))))
        throw new Error("Cameras must be Home Assistant camera entity IDs.");
    if (t.home_mode && !/^input_select\.[a-z0-9_]+$/.test(t.home_mode))
      throw new Error("Home mode must be an input_select helper.");
    if (t.alarm_entity && !/^alarm_control_panel\.[a-z0-9_]+$/.test(t.alarm_entity))
      throw new Error("Alarm entity must be a Home Assistant alarm control panel.");
    if (t.alarm_note_entity !== void 0 && !/^sensor\.[a-z0-9_]+$/.test(t.alarm_note_entity))
      throw new Error("Alarm note must be a sensor.");
    const e = (i) => i && typeof i.name == "string" && /^(script|scene)\.[a-z0-9_]+$/.test(i.entity);
    if (t.quick_actions && (!Array.isArray(t.quick_actions) || !t.quick_actions.every(e)))
      throw new Error("Quick actions need a name and script or scene entity.");
    if (t.light_rooms && (!Array.isArray(t.light_rooms) || !t.light_rooms.every((i) => i && typeof i.id == "string" && typeof i.name == "string" && Array.isArray(i.entities) && i.entities.length > 0 && i.entities.every((s) => /^(light|switch)\.[a-z0-9_]+$/.test(s)) && /^script\.[a-z0-9_]+$/.test(i.on_script) && /^script\.[a-z0-9_]+$/.test(i.off_script) && (!i.scenes || Array.isArray(i.scenes) && i.scenes.every(e)) && (i.outdoor === void 0 || typeof i.outdoor == "boolean"))))
      throw new Error("Light rooms need lamp entities and on/off scripts.");
    if (t.automation_label !== void 0 && (typeof t.automation_label != "string" || !/^[a-z0-9_]+$/.test(t.automation_label))) throw new Error("Automation label must be a Home Assistant label ID.");
    if (t.sun !== void 0 && typeof t.sun != "boolean") throw new Error("Sun must be true or false.");
    if (t.all_lights_off && !/^script\.[a-z0-9_]+$/.test(t.all_lights_off)) throw new Error("All lights off must be a script.");
    if (t.doorbell && (!/^camera\.[a-z0-9_]+$/.test(t.doorbell.entity) || !/^[a-z0-9_]+$/.test(t.doorbell.camera) || t.doorbell.instance && !/^[a-z0-9_]+$/.test(t.doorbell.instance))) throw new Error("Doorbell needs valid camera and instance IDs.");
    this.config = { ...t }, this.tabs.some((i) => i.id === this.tab) || (this.tab = "home"), this.selectedTodo = "", this.resetTodoState(), this.applyAppearance();
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
    const i = w(t);
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
        this.todoOrder = new Map(s.map((o, d) => [o.uid, d])), this.todos = s.filter((o) => o.status === "needs_action"), this.completedTodos = s.filter(
          (o) => o.status === "completed"
        );
        const a = new Set(this.completedTodos.map((o) => o.uid));
        for (const o of Object.keys(this.completionTimes))
          a.has(o) || delete this.completionTimes[o];
        for (const o of s)
          o.status !== "completed" ? delete this.completionTimes[o.uid] : Number.isFinite(this.completionTimes[o.uid]) || (this.completionTimes[o.uid] = Date.now());
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
    const a = matchMedia("(prefers-reduced-motion: reduce)").matches, o = this.motionRows(), d = o.find((h) => h.dataset.todoUid === t);
    if (d && !a && await d.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: "translateX(10px) scale(.98)" }
      ],
      { duration: 150, easing: "ease-in", fill: "forwards" }
    ).finished.catch(() => {
    }), i !== this.todoEntity || !this.isConnected) return;
    const r = new Map(
      o.map((h) => [
        h.dataset.todoMotion,
        h.getBoundingClientRect().top
      ])
    );
    e(), await this.updateComplete;
    const c = this.motionRows(), u = [];
    if (!a)
      for (const h of c) {
        const m = r.get(h.dataset.todoMotion), f = h.dataset.todoUid === t, x = m === void 0 || f ? 12 : m - h.getBoundingClientRect().top;
        !x && !f || u.push(
          h.animate(
            [
              {
                transform: `translateY(${x}px)`,
                opacity: m === void 0 || f ? 0 : 1
              },
              { transform: "none", opacity: 1 }
            ],
            { duration: 300, easing: "cubic-bezier(.2,.8,.2,1)" }
          )
        );
      }
    if (await Promise.all(
      u.map((h) => h.finished.catch(() => {
      }))
    ), s && this.tab === "lists" && !this.deleteTarget && !this.menuOpen && !this.detailEntity) {
      const m = c.find((f) => f.dataset.todoUid === t)?.querySelector(".check-button");
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
    const i = this.todoEntity, s = this.shadowRoot?.activeElement, a = !!s?.matches(":focus-visible") && s.closest("[data-todo-uid]")?.dataset.todoUid === t.uid;
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
            (o) => o.uid !== t.uid
          ), this.todos.some((o) => o.uid === t.uid) || (this.todos = [
            ...this.todos,
            { ...t, status: "needs_action", completed: null }
          ].sort(
            (o, d) => (this.todoOrder.get(o.uid) ?? 1 / 0) - (this.todoOrder.get(d.uid) ?? 1 / 0)
          )), this.notify("Back on your list.", "success")) : (this.completionTimes[t.uid] = Date.now(), this.todos = this.todos.filter((o) => o.uid !== t.uid), this.completedTodos = [
            {
              ...t,
              status: "completed",
              completed: (/* @__PURE__ */ new Date()).toISOString()
            },
            ...this.completedTodos.filter((o) => o.uid !== t.uid)
          ], this.notify("Checked off.", "success"), this.undoItem = t), this.saveCompletionTimes();
        },
        i,
        a
      );
    } catch {
      this.notify("Couldn’t update the list. Try again.", "error");
    } finally {
      this.busy = !1, this.pendingTodo = "", this.todoMutating = !1, this.todoRefreshPending && this.isConnected && this.loadTodos();
    }
  }
  async startEdit(t) {
    if (this.busy || !this.todoSupports(4)) return;
    this.editingTodo = t.uid, this.editDraft = t.summary, await this.updateComplete;
    const e = this.renderRoot.querySelector(".todo-edit-input");
    e?.focus({ preventScroll: !0 }), e?.select();
  }
  cancelEdit() {
    const t = this.editingTodo;
    this.editingTodo = "", this.updateComplete.then(
      () => this.renderRoot.querySelector(
        `[data-todo-uid="${CSS.escape(t)}"] .todo-edit`
      )?.focus({ preventScroll: !0 })
    );
  }
  /** Saves on Enter or when the field loses focus; an empty or unchanged name just closes the editor. */
  async saveEdit(t) {
    t?.preventDefault();
    const e = this.editingTodo, i = this.todoEntity;
    if (!e || !i || this.savingEdit) return;
    const s = [...this.todos, ...this.completedTodos].find(
      (o) => o.uid === e
    ), a = this.editDraft.trim();
    if (!s || !a || a === s.summary) {
      this.editingTodo = "";
      return;
    }
    if (!(this.busy || !this.todoSupports(4))) {
      this.savingEdit = !0, this.busy = !0, this.pendingTodo = e, this.todoMutating = !0, this.todoSequence++;
      try {
        if (await this.hass.callService("todo", "update_item", {
          entity_id: i,
          item: e,
          rename: a
        }), i !== this.todoEntity) return;
        const o = (d) => d.map((r) => r.uid === e ? { ...r, summary: a } : r);
        this.todos = o(this.todos), this.completedTodos = o(this.completedTodos), this.editingTodo === e && (this.editingTodo = ""), this.notify("Saved.", "success");
      } catch {
        this.notify("Couldn’t save that change. Try again.", "error");
      } finally {
        this.savingEdit = !1, this.busy = !1, this.pendingTodo = "", this.todoMutating = !1, this.todoRefreshPending && this.isConnected && this.loadTodos();
      }
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
    if (de.includes(t)) {
      try {
        localStorage.setItem(this.appearanceKey, t);
      } catch {
      }
      this.config = { ...this.config, appearance: t }, this.applyAppearance();
    }
  }
  navigate(t) {
    if (t !== this.tab) {
      if (this.pageTravel = this.tabs.findIndex((e) => e.id === t) > this.tabs.findIndex((e) => e.id === this.tab) ? 12 : -12, t !== this.tab) {
        const e = new URL(location.href);
        for (const i of ["signal_review", "signal_event", "signal_camera", "signal_instance"]) e.searchParams.delete(i);
        e.hash = `signal/${t}`, history.pushState(history.state, "", e);
      }
      this.tab = t, this.resetScroll();
    }
  }
  resetScroll() {
    this.updateComplete.then(
      () => this.renderRoot.querySelector("main")?.scrollTo({ top: 0 })
    );
  }
  nav(t = !1) {
    const e = t ? [...this.tabs.filter((s) => ["home", "rooms", "cameras", "lists"].includes(s.id)), { id: "more", name: "More", icon: "more" }] : this.tabs, i = t && ["safety", "climate", "automations"].includes(this.tab) ? "more" : this.tab;
    return l`<nav class=${t ? "bottom-nav" : ""}
      style=${`--active: ${e.findIndex((s) => s.id === i)}; --tab-count: ${e.length}`}
      aria-label=${t ? "Mobile navigation" : "Dashboard navigation"}>
      ${t ? l`<span class="nav-indicator" aria-hidden="true"></span>` : p}
      ${e.map((s) => l`<button aria-current=${i === s.id ? "page" : p} aria-expanded=${s.id === "more" ? this.moreOpen : p} aria-haspopup=${s.id === "more" ? "dialog" : p} @click=${() => {
      s.id === "more" ? this.moreOpen = !0 : this.navigate(s.id);
    }}>${b(s.icon)}<span>${s.name}</span></button>`)}
    </nav>`;
  }
  chooseMore(t) {
    this.moreDestination = t, this.renderRoot.querySelector("#more-sheet")?.requestClose();
  }
  digestNavigation(t) {
    if (this.navigate(t.detail.route), t.detail.review && this.config.doorbell) {
      const e = new URL(location.href);
      e.searchParams.set("signal_review", t.detail.review), e.searchParams.set("signal_camera", this.config.doorbell.camera), e.searchParams.set("signal_instance", this.config.doorbell.instance || "frigate"), history.replaceState(history.state, "", e), window.dispatchEvent(new Event("location-changed"));
    }
  }
  get sensors() {
    return (this.config.sensors || []).map(Nt);
  }
  get safetySummary() {
    if (this.hass?.connection?.connected === !1) return { alarm: 0, unknown: this.sensors.length || 1, unverified: 0, text: "Connection lost" };
    const t = this.sensors, e = t.filter(
      (a) => a.entity.startsWith("lock.") ? $(this.state(a.entity)) && this.state(a.entity)?.state !== "locked" : this.state(a.entity)?.state === "on"
    ).length, i = t.filter((a) => !$(this.state(a.entity))).length, s = t.filter((a) => a.unverified && $(this.state(a.entity)) && this.state(a.entity)?.state !== "on").length;
    return {
      alarm: e,
      unknown: i,
      unverified: s,
      text: e ? `${e} sensor${e > 1 ? "s" : ""} need attention` : i ? `${i} sensor${i > 1 ? "s" : ""} offline` : s ? `${s} sensor${s > 1 ? "s" : ""} need verification` : t.length ? "Sensors clear" : "Make yourself at home"
    };
  }
  climate(t = !1) {
    const e = this.state(this.config.climate);
    if (!this.config.climate)
      return l`<section class="panel mint climate">
        <div class="panel-label">${b("climate")} Climate</div>
        <h2 style="margin-top:40px">Comfort starts here.</h2>
        <p>
          Choose a climate entity in the card editor to bring your home’s
          temperature into focus.
        </p>
      </section>`;
    const i = $(e), s = e?.attributes || {}, a = w(s.current_temperature), o = w(s.target_temp_low), d = w(s.target_temp_high), r = i && e.state === "heat_cool" && o !== void 0 && d !== void 0 && ((w(s.supported_features) ?? 0) & 2) !== 0, c = r ? this.rangeSide === "low" ? o : d : w(s.temperature), u = r && this.rangeSide === "high" ? o : w(s.min_temp) ?? 7, h = r && this.rangeSide === "low" ? d : w(s.max_temp) ?? 35, m = w(s.target_temp_step) || (this.hass?.config?.unit_system?.temperature === "°F" ? 1 : 0.5), f = this.hass?.config?.unit_system?.temperature || "°", x = a, g = x === void 0 ? 0 : Math.max(
      0,
      Math.min(
        1,
        (x - (w(s.min_temp) ?? 7)) / Math.max(
          1,
          (w(s.max_temp) ?? 35) - (w(s.min_temp) ?? 7)
        )
      )
    ), A = i && c !== void 0 && (r || ((w(s.supported_features) ?? 0) & 1) !== 0) && e.state !== "off", v = (E) => {
      if (!A || c === void 0) return;
      const D = Number(
        Math.max(u, Math.min(h, c + E)).toFixed(2)
      ), O = r ? {
        target_temp_low: this.rangeSide === "low" ? D : o,
        target_temp_high: this.rangeSide === "high" ? D : d
      } : { temperature: D };
      this.service("climate", "set_temperature", {
        entity_id: this.config.climate,
        ...O
      });
    }, _ = Array.isArray(s.hvac_modes) ? s.hvac_modes : [];
    return l`<section
      class="panel mint climate"
      data-activity=${i ? s.hvac_action || "idle" : "unavailable"}
      aria-label="Climate control"
    >
      <div class="panel-top">
        <span class="panel-label">${b("climate")} Home climate</span
        ><button
          class="icon-button"
          aria-label="Climate details"
          ?hidden=${t}
          @click=${() => this.moreInfo(this.config.climate)}
        >
          ${b("arrow")}
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
            stroke-dasharray=${`${g * 476} 635`}
            stroke-linecap="round"
            class="dial-fill"
          />
        </svg>
        <div class="dial-center">
          <div class="dial-mode">
            ${i ? P(s.hvac_action || e.state) : "Unavailable"}
          </div>
          <div class="dial-value" aria-live="polite">
            ${re(x, l`<span class="value-in">${i ? this.format(x, 1) : "—"}</span>`)}<sup
              >${f}</sup
            >
          </div>
          <div class="dial-caption">
            ${i ? "Current temperature" : "Waiting for your thermostat"}
          </div>
        </div>
      </div>
      <div class="stepper">
        <button
          aria-label="Decrease target temperature"
          ?disabled=${!A || this.busy || c <= u}
          @click=${() => v(-m)}
        >
          ${b("minus")}</button
        ><span
          >${i ? `${r ? this.rangeSide === "low" ? "Heat below" : "Cool above" : "Target"} ${this.format(c, 1)}${f}` : "No reading"}</span
        ><button
          aria-label="Increase target temperature"
          ?disabled=${!A || this.busy || c >= h}
          @click=${() => v(m)}
        >
          ${b("plus")}
        </button>
      </div>
      ${r ? l`<div class="range-tabs" aria-label="Temperature range"><button aria-pressed=${this.rangeSide === "low"} @click=${() => this.rangeSide = "low"}>Heat ${this.format(o, 1)}°</button><button aria-pressed=${this.rangeSide === "high"} @click=${() => this.rangeSide = "high"}>Cool ${this.format(d, 1)}°</button></div>` : p}
      <div class="climate-foot">
        <span
          >${b("drop")}
          ${this.format(this.state(this.config.humidity)?.state ?? s.current_humidity)}%
          humidity</span
        >${_.length ? l`<select
                aria-label="HVAC mode"
                .value=${it(e?.state || "")}
                ?disabled=${!i || this.busy}
                @change=${(E) => this.service("climate", "set_hvac_mode", { entity_id: this.config.climate, hvac_mode: E.target.value })}
              >
                ${_.map((E) => l`<option value=${E} .selected=${it(E === e?.state)}>${Oi[E] || P(E)}</option>`)}
              </select>` : p}
      </div>
    </section>`;
  }
  weather(t = !1) {
    const e = this.state(this.config.weather), i = $(e), s = e?.attributes || {}, a = s.temperature_unit || this.hass?.config?.unit_system?.temperature || "°";
    return l`<section class="panel lilac weather">
      <div class="panel-top">
        <span class="panel-label">${b("sun")} Outside</span
        >${this.config.weather && !t ? l`<button class="icon-button" aria-label="Weather details" @click=${() => this.moreInfo(this.config.weather)}>${b("arrow")}</button>` : p}
      </div>
      <div class="weather-content">
        <div>
          <div class="weather-temp">
            ${i ? this.format(s.temperature) : "—"}<span
              style="font-size:27px;vertical-align:top;position:relative;top:9px;letter-spacing:-1px"
              >${a}</span
            >
          </div>
          <div class="weather-condition">
            ${i ? P(e.state) : "Weather unavailable"}
          </div>
        </div>
        <div
          class=${`weather-art ${e?.state === "clear-night" ? "night" : ""} ${e?.state?.includes("rain") ? "rain" : ""}`}
          aria-hidden="true"
        >
          <div class="sun-disc"></div>
          ${["sunny", "clear-night"].includes(e?.state || "") ? p : l`<div class="cloud"></div>`}
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
  todoRow(t, e = !1, i = !1) {
    const s = i && this.editingTodo === t.uid;
    return l`<div
      class=${`todo-row ${e ? "completed-row" : ""}`}
      data-todo-uid=${t.uid}
      aria-busy=${this.pendingTodo === t.uid}
      data-todo-motion=${`row:${t.uid}`}
    >
      <button
        class="check-button"
        ?disabled=${this.busy || s || !this.todoSupports(4)}
        aria-label=${`${e ? "Restore" : "Complete"} ${t.summary}`}
        @click=${() => this.complete(t, e)}
      >
        <span class="check-box">${e ? b("check") : p}</span>
      </button>
      ${s ? l`<form class="todo-edit-form" @submit=${this.saveEdit}>
            <input
              class="todo-edit-input"
              aria-label=${`Edit ${t.summary}`}
              maxlength="255"
              enterkeyhint="done"
              .value=${this.editDraft}
              @input=${(a) => this.editDraft = a.target.value}
              @keydown=${(a) => {
      a.key === "Escape" && (a.preventDefault(), a.stopPropagation(), this.cancelEdit());
    }}
              @blur=${() => this.saveEdit()}
            />
          </form>` : i && this.todoSupports(4) ? l`<button
              class="todo-label todo-edit"
              aria-label=${`Edit ${t.summary}`}
              ?disabled=${this.busy}
              @click=${() => this.startEdit(t)}
            >
              ${t.summary}
            </button>` : l`<span class="todo-label">${t.summary}</span>`}
      <button
        class="todo-trash"
        ?disabled=${this.busy || !this.canDeleteTodo}
        aria-label=${`Delete ${t.summary}`}
        title="Delete permanently"
        @click=${() => this.askDelete(t)}
      >
        ${b("trash")}
      </button>
    </div>`;
  }
  todoListPicker() {
    return this.todoLists.length < 2 ? p : l`<div
      class="list-switcher"
      role="group"
      aria-label="Your to-do lists"
    >
      ${this.todoLists.map(
      (t) => l`<button
            aria-label=${`Open list ${this.listName(t.entity_id)}`}
            aria-pressed=${t.entity_id === this.todoEntity}
            ?disabled=${this.busy}
            @click=${() => this.chooseTodo(t.entity_id)}
          >
            ${b("list")}<span>${this.listName(t.entity_id)}</span>
            <small>${$(t) ? t.state : "Offline"}</small>
          </button>`
    )}
    </div>`;
  }
  grocery(t = !1) {
    return l`<section
      class="panel apricot groceries"
      aria-busy=${this.todoLoading}
    >
      <div class="panel-top">
        <span class="panel-label">${b("list")} ${this.todoName}</span
        >${t ? l`<button class="icon-button" aria-label="Refresh list" @click=${() => this.loadTodos()}>${b("list")}</button>` : l`<button class="icon-button" aria-label="Open to-do lists" @click=${() => this.navigate("lists")}>${b("arrow")}</button>`}
      </div>
      ${this.todoEntity ? this.todoError && !this.todoLoaded ? l`<button class="text-button" @click=${() => this.loadTodos()}>
                ${this.todoError}
              </button>` : l`<div class="list-preview">
                ${this.todos.length ? yt(
      t ? this.todos : this.todos.slice(0, 2),
      (e) => e.uid,
      (e) => this.todoRow(e, !1, t)
    ) : this.todoLoading && !this.todoLoaded ? l`<div
                          class="list-loading"
                          role="status"
                          aria-label="Loading list"
                        >
                          <div class="loading-row" aria-hidden="true"></div>
                          <div class="loading-row" aria-hidden="true"></div>
                          <div class="loading-row" aria-hidden="true"></div>
                        </div>` : l`<div class="empty">
                          All caught up. Room for something good.
                        </div>`}
              </div>` : l`<p class="empty">
              No to-do lists are available. Add a list in Home Assistant and it
              will appear here.
            </p>`}
      ${t && this.todoEntity ? l`<form class="todo-form" data-todo-motion="form" @submit=${this.addTodo}><input aria-label="New task" placeholder="Add something good…" maxlength="255" ?disabled=${!this.todoSupports(1)} .value=${this.draft} @input=${(e) => this.draft = e.target.value} /><button aria-label="Add task" ?disabled=${this.busy || !this.draft.trim() || !this.todoSupports(1)}>${b("plus")}</button></form>` : l`<button class="text-button" @click=${() => this.navigate("lists")}>${this.todos.length ? `${this.todos.length} things on your list` : "Open your list"} ${b("arrow")}</button>`}
      ${this.todoError && this.todoLoaded ? l`<button class="text-button" @click=${() => this.loadTodos()}>Couldn’t refresh. Showing the last loaded list. Retry</button>` : p}
      ${t && (!this.todoError || this.todoLoaded) ? this.completedList() : p}
    </section>`;
  }
  completedList() {
    if (!this.completedTodos.length) return p;
    const t = Date.now() - 864e5, e = [...this.completedTodos].sort(
      (o, d) => this.completedAt(d) - this.completedAt(o)
    ), i = e.filter((o) => this.completedAt(o) > t), s = e.filter((o) => this.completedAt(o) <= t), a = (o) => yt(
      o,
      (d) => d.uid,
      (d) => this.todoRow(d, !0, !0)
    );
    return l`<div class="completed-list">
      <h3 data-todo-motion="completed-heading">
        Recently completed <span>${i.length}</span>
      </h3>
      <p data-todo-motion="completed-help">
        Tap a check to put it back. After 24 hours, items move to Older
        completed.
      </p>
      ${this.config.completed_retention_days && this.todoEntity === this.config.todo ? l`<p data-todo-motion="retention">HA automatically deletes timestamped completed items after ${this.config.completed_retention_days} days. Restore anything you still need before then.</p>` : p}
      ${a(i)}
      ${s.length ? l`<details>
              <summary data-todo-motion="older-heading">
                Older completed · ${s.length}
              </summary>
              ${a(s)}
            </details>` : p}
      ${e.some((o) => !o.completed || !Number.isFinite(Date.parse(o.completed))) ? l`<small>For items without a completion time, the 24 hours starts when this device first sees them completed.</small>` : p}
    </div>`;
  }
  securityMode() {
    if (this.config.alarm_entity) {
      const i = this.state(this.config.alarm_entity), s = i?.state, a = i?.attributes.arm_mode, o = this.state(this.config.alarm_siren), d = a === "armed_night" ? "Sleeping" : "Away", r = ["arming", "pending", "triggered"].includes(s || "") ? a : s, c = Number(i?.attributes.delay), u = Date.parse(i?.last_changed || i?.last_updated || ""), h = (s === "arming" || s === "pending") && Number.isFinite(c) && c > 0, m = h ? Math.max(0, Math.ceil(c - (Number.isFinite(u) ? (Date.now() - u) / 1e3 : 0))) : 0, f = h ? Math.min(100, Math.max(0, (c - m) / c * 100)) : 0, x = (this.config.alarm_sensors || []).map((k) => this.state(k)), g = x.filter((k) => !$(k)), A = x.filter((k) => k?.state === "on"), v = (k) => k.map((Z) => Z?.attributes.friendly_name || Z?.entity_id || "A door").join(", "), _ = g.length ? `${v(g)} unavailable` : A.length ? `${v(A)} open` : "", E = s === "disarmed" && i?.attributes.open_sensors && Object.keys(i.attributes.open_sensors).length > 0, D = $(i) ? s === "disarmed" ? "Home · alarm off" : s === "arming" ? `${d} · arming` : s === "pending" ? `${d} · door opened` : s === "triggered" ? `${d} · alarm sounding` : s === "armed_night" ? "Sleeping · armed" : s === "armed_away" ? "Away · armed" : "Alarm state unavailable" : "Alarm unavailable", O = s === "arming" ? `Alarm arms in ${m} seconds. Close the doors before then.` : s === "pending" ? `The siren sounds in ${m} seconds unless you disarm.` : s === "triggered" ? "The alarm has triggered. Disarm to stop the siren." : s === "disarmed" ? E && _ ? `Could not arm: ${_}.` : _ ? `Before arming: ${_}.` : "The alarm is off." : s === "armed_night" || s === "armed_away" ? "The alarm is armed. Opening a monitored door starts a 30-second countdown." : "Check Home Assistant for the current alarm state.", tt = [
        { name: "Home", icon: "home", title: "Home", detail: "Alarm off", service: "alarm_disarm", state: "disarmed" },
        { name: "Sleeping", icon: "moon", title: "Sleeping", detail: "Arm for night", service: "alarm_arm_night", state: "armed_night" },
        { name: "Away", icon: "arrow", title: "Away", detail: "60-second exit", service: "alarm_arm_away", state: "armed_away" }
      ], q = !!s && s !== "disarmed" && $(i), z = s === "disarmed" || s === "armed_night" || s === "armed_away" ? Zt(this.state(this.config.alarm_note_entity)) : void 0, R = s === "triggered" ? "Triggered" : s === "pending" ? "Entry countdown" : s === "arming" ? "Arming" : q ? "Armed" : "Disarmed";
      return l`<section class="security-mode" aria-label="Alarm mode" data-alarm-state=${s || "unavailable"}>
        <div class="security-mode-head"><div><span class="eyebrow">Current mode</span><h2>${D}</h2></div><span class=${`alarm-state-badge ${q ? "on" : "off"}`}>${R}</span></div>
        <p class="alarm-mode-detail" role="status">${O}</p>
        ${z ? l`<p class="alarm-schedule-note">${z}</p>` : p}
        ${h ? l`<div class="alarm-countdown" role="timer" aria-label=${`${m} seconds remaining`}><span>${s === "arming" ? "Arming" : "Before siren"}</span><strong>${m}s</strong><div class="alarm-progress"><span style=${`width:${f}%`}></span></div></div>` : p}
        <div class="security-mode-options">${tt.map((k) => l`<button class=${`security-mode-option mode-${k.name.toLowerCase()} ${r === k.state ? "selected" : ""}`} aria-pressed=${r === k.state} ?disabled=${!$(i) || this.busy || this.hass.connection?.connected === !1 || k.state !== "disarmed" && (["arming", "pending", "triggered"].includes(s || "") || k.state === s || g.length > 0 || k.state === "armed_night" && A.length > 0)} @click=${() => this.service("alarm_control_panel", k.service, { entity_id: this.config.alarm_entity }, `${k.title} requested; waiting for alarm confirmation`)}>
          <span class="mode-icon">${b(k.icon)}</span><strong>${k.title}</strong><small>${k.detail}</small><span class="mode-check" aria-hidden="true">${r === k.state ? b("check") : p}</span>
          ${h && r === k.state ? l`<span class="mode-progress" style=${`width:${f}%`}></span>` : p}
        </button>`)}</div>
        <div class="alarm-control" role="group" aria-label="Alarm controls"><div><strong>Alarm system · ${q ? "on" : "off"}</strong><span>${R}${this.config.alarm_siren ? ` · Siren ${o?.state === "on" ? "on" : "off"}` : ""}</span></div><button ?disabled=${!q || this.busy || this.hass.connection?.connected === !1} @click=${() => this.service("alarm_control_panel", "alarm_disarm", { entity_id: this.config.alarm_entity }, "Disarm requested; waiting for confirmation")}>${s === "triggered" ? "Disarm and silence" : "Turn alarm off"}</button></div>
      </section>`;
    }
    const t = this.state(this.config.home_mode), e = [
      { name: "Home", icon: "home", title: "At home", detail: "Saved household preference" },
      { name: "Sleeping", icon: "moon", title: "Sleeping", detail: "Saved nighttime preference" },
      { name: "Away", icon: "arrow", title: "Away", detail: "Saved out-of-home preference" }
    ];
    return l`<section class="security-mode" aria-label="Household mode">
      <div class="security-mode-head"><div><span class="eyebrow">Household mode</span><h2>${$(t) ? t.state : "Unavailable"}</h2></div><span class="mode-context">Saved preference · alarm not connected</span></div>
      <div class="security-mode-options">${e.map((i) => l`<button class=${`security-mode-option mode-${i.name.toLowerCase()}`} aria-pressed=${t?.state === i.name} ?disabled=${!$(t) || this.busy || this.hass.connection?.connected === !1} @click=${() => this.service("input_select", "select_option", { entity_id: this.config.home_mode, option: i.name }, `${i.name} preference saved`)}>
        <span class="mode-icon">${b(i.icon)}</span><strong>${i.title}</strong><small>${i.detail}</small><span class="mode-check" aria-hidden="true">${t?.state === i.name ? b("check") : p}</span>
      </button>`)}</div>
    </section>`;
  }
  safety() {
    if (!this.sensors.length)
      return l`<div class="notice">
        Add your water, smoke, or opening sensors in the card editor. Their
        actual state will appear here.
      </div>`;
    const t = (d) => this.state(d.entity)?.attributes.device_class, e = this.sensors.filter((d) => d.entity.startsWith("lock.") || ["door", "window", "opening", "garage_door"].includes(t(d))), i = this.sensors.filter((d) => t(d) === "moisture"), s = this.sensors.filter((d) => !e.includes(d) && !i.includes(d)), a = (d, r = d?.last_reported || d?.last_updated) => r && Number.isFinite(Date.parse(r)) ? new Date(r).toLocaleString(this.hass.locale?.language || void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: this.hass.config?.time_zone }) : "time unknown", o = (d) => l`<div class="sensors">${d.map((r) => {
      const c = this.state(r.entity), u = $(c), h = c?.state, m = c?.last_changed, f = !!c, x = r.entity.startsWith("lock.") ? u && c.state !== "locked" : c?.state === "on", g = c?.attributes.device_class, A = u ? r.entity.startsWith("lock.") ? P(c?.state) : x ? g === "moisture" ? "Water detected" : g === "opening" || g === "door" || g === "window" ? "Open" : "Detected" : r.unverified ? "Needs verification" : g === "moisture" ? "Dry" : g === "opening" || g === "door" || g === "window" ? "Closed" : "Clear" : h === "unknown" ? "Unknown" : "Offline", v = this.state(r.battery), _ = $(v) ? w(v.state) : void 0;
      return l`<button
          class="sensor"
          @click=${() => this.moreInfo(r.entity)}
        >
          <div class="sensor-head">
            <span
              class=${`sensor-symbol ${!u || r.unverified && !x ? "unknown" : x ? "bad" : ""}`}
              >${b(["door", "window", "opening", "garage_door"].includes(g) ? "door" : g === "moisture" ? "drop" : !u || x ? "warn" : "shield")}</span
            ><span class="sensor-state">${A}</span>
          </div>
          <div>
            <div class="sensor-name">
              ${r.name || c?.attributes.friendly_name || r.entity}
            </div>
            <div class="sensor-sub">
              ${u ? r.unverified ? `Last reported ${u ? r.entity.startsWith("lock.") ? c.state : c.state === "off" ? "closed" : c.state === "on" ? "open" : c.state : "unavailable"} · ${a(c)}` : r.battery ? _ !== void 0 ? `${_}% battery${_ < 20 ? " · Low battery" : ""}` : "Battery unavailable" : "Tap for details" : f ? `${h === "unknown" ? "State unknown" : "Offline"} since ${a(c, m)}` : "Not found in Home Assistant"}
            </div>
          </div>
        </button>`;
    })}</div>`;
    return l`<div class="sensor-sections">
      ${e.length ? l`<section class="sensor-section" aria-label="Doors"><h2>Doors</h2>${o(e)}</section>` : p}
      ${i.length ? l`<section class="sensor-section" aria-label="Water"><h2>Water</h2>${o(i)}</section>` : p}
      ${s.length ? l`<section class="sensor-section" aria-label="Other sensors"><h2>Other sensors</h2>${o(s)}</section>` : p}
    </div>`;
  }
  favorites() {
    return this.config.favorites?.length ? l`<div class="section-top">
        <h2>Your shortcuts</h2>
        <small>A little less effort.</small>
      </div>
      <div class="favorites">
        ${this.config.favorites.map((t) => l`<signal-control
            .hass=${this.hass}
            .configuration=${{ type: "custom:signal-control", entity: t, appearance: this.dark ? "dark" : "light" }}
          ></signal-control>`)}
      </div>` : p;
  }
  graphs(t = !1) {
    return this.config.graphs?.length ? l`<div class="section-top">
        <h2>The bigger picture</h2>
        <small>Explore your history.</small>
      </div>
      <div class="grid">
        ${this.config.graphs.map((e, i) => {
      const s = typeof e == "string" ? { entity: e } : e;
      return l`<signal-graph
            .suspended=${t}
            .hass=${this.hass}
            .configuration=${{ ...s, type: "custom:signal-graph", accent: i % 2 ? "mint" : "lilac", appearance: this.dark ? "dark" : "light" }}
          ></signal-graph>`;
    })}
      </div>` : p;
  }
  content() {
    return this.tab === "rooms" ? l`<signal-lights .hass=${this.hass} .rooms=${this.config.light_rooms || []} .dark=${this.dark}></signal-lights>` : this.tab === "cameras" ? l`<signal-cameras .hass=${this.hass} .cameras=${this.config.cameras || []} .alarmCameras=${this.config.alarm_cameras || []} .alarmEntity=${this.config.alarm_entity || ""} @signal-camera-navigation=${() => this.resetScroll()}></signal-cameras>` : this.tab === "climate" ? l`<div class="grid detail-grid">
          ${this.climate()}
          <div class="stack">
            ${this.weather()}
            <section class="panel lime">
              <div class="panel-label">${b("drop")} Inside humidity</div>
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
        ${this.graphs()}` : this.tab === "safety" ? l`${this.securityMode()}${this.safety()}
        <div class="notice" style="margin-top:20px">
          ${this.safetySummary.alarm ? "A sensor is reporting an active state. Open it for details." : this.safetySummary.unknown ? "An unavailable sensor cannot confirm the condition of its space." : this.safetySummary.unverified ? "These sensors have not passed a recent physical test. Their last reported states are not confirmed current conditions." : "Tap any sensor for its history and details."}
        </div>` : this.tab === "automations" ? l`<signal-automations .hass=${this.hass} .label=${this.config.automation_label || "show_in_signal"}></signal-automations>` : this.tab === "lists" ? l`<div style="max-width:740px">
        ${this.todoListPicker()}${this.grocery(!0)}
      </div>` : this.householdOverview();
  }
  householdOverview() {
    return l`<signal-digest .hass=${this.hass} .config=${this.config} @signal-digest-navigation=${this.digestNavigation}></signal-digest>`;
  }
  appHeader(t) {
    const e = wt(t, this.hass.config?.time_zone), i = `Good ${e < 12 ? "morning" : e < 18 ? "afternoon" : "evening"}.`;
    return l`<header
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
          ${b("settings")}
        </button>
      </div>
    </header>`;
  }
  render() {
    if (!this.hass)
      return l`<div class="notice" role="status">Connecting to home…</div>`;
    const t = /* @__PURE__ */ new Date(), e = this.config.greeting || "Home, at a glance.", i = this.tab === "home" ? e : this.tab === "rooms" ? "Lighting." : this.tab === "climate" ? "Just your temperature." : this.tab === "safety" ? "Peace of mind." : this.tab === "cameras" ? "Cameras." : this.tab === "automations" ? "Automations." : "Good things, listed.", s = this.tab === "home" ? "Your home, at a glance." : this.tab === "climate" ? "Current temperature and comfort controls." : this.tab === "safety" ? "A clear view of the things that matter." : this.tab === "rooms" ? "Lighting, room by room." : this.tab === "cameras" ? "Live video and recorded activity." : this.tab === "automations" ? "Routines that run on their own, on or off." : "A little space for everyday essentials.", a = this.safetySummary, o = new URL(location.href);
    o.searchParams.set("disable_km", ""), o.hash = "";
    const d = this.sensors.find((r) => r.entity === this.detailEntity);
    return l`<div
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
      ${this.narrow ? this.appHeader(t) : p}
      <main @scroll=${this.onContentScroll}>
        ${this.narrow ? p : this.appHeader(t)}
        ${this.tab !== "home" ? l`<div class="page-heading">
          <div>
            <h1>${i}</h1>
            <p class="intro">${s}</p>
          </div>
          <button class=${`status-pill ${a.alarm ? "alert" : a.unverified ? "review" : ""}`} @click=${() => this.navigate("safety")}>
            <span class="dot"></span>${a.text}
          </button>
        </div>` : p}
        ${re(this.tab, l`<div class="page" style=${`--page-travel:${this.pageTravel}px`}>${this.content()}</div>`)}
        <footer class="footer">
          <span
            >Signal Home <span style="opacity:.5">/</span> made for living</span
          >
        </footer>
      </main>
      ${this.nav(!0)}${this.message ? l`<div class=${`toast ${this.messageTone}`} role="status">${this.messageTone !== "neutral" ? l`<span class="toast-mark" aria-hidden="true">${b(this.messageTone === "success" ? "check" : "warn")}</span>` : p}<span class="toast-copy">${this.message}</span>${this.undoItem ? l`<button ?disabled=${this.busy} @click=${() => this.undoItem && this.complete(this.undoItem, !0)}>Undo</button>` : p}</div>` : p}
      <signal-sheet id="more-sheet" .open=${this.moreOpen} .dark=${this.dark} heading="More" .compact=${!0}
        @signal-close=${() => {
      this.moreOpen = !1;
      const r = this.moreDestination;
      this.moreDestination = "", r && this.navigate(r);
    }}>
        <div class="more-links">${this.tabs.filter((r) => ["safety", "climate", "automations"].includes(r.id)).map((r) => l`<button @click=${() => this.chooseMore(r.id)}>${b(r.icon)}<span>${r.name}</span>${b("arrow")}</button>`)}</div>
      </signal-sheet>
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
              @change=${(r) => this.chooseAppearance(r.target.value)}
            >
              <option value="auto">Auto · day / night</option>
              <option value="system">System · device default</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
            <small
              >Auto: light while the sun is up, dark after sunset
              (${this.hass.config?.time_zone || "device time"}). Saved on this
              device.</small
            >
          </label>
          <a href="/profile"
            >${b("home")}<span
              >Account & sign out<small>Your profile and session</small></span
            >${b("arrow")}</a
          >
          ${this.hass.user?.is_admin ? l`<a href="/config/dashboard"
                  >${b("settings")}<span
                    >Home Assistant settings<small
                      >Devices, integrations, and administration</small
                    ></span
                  >${b("arrow")}</a
                >` : p}
          <a
            href=${o.pathname + o.search}
            @click=${(r) => {
      r.preventDefault(), r.stopPropagation(), window.location.assign(o.pathname + o.search);
    }}
            >${b("arrow")}<span
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
      const r = this.deleteTarget && ![...this.todos, ...this.completedTodos].some(
        (c) => c.uid === this.deleteTarget.item.uid
      );
      this.deleteTarget = void 0, this.deleteError = "", r && this.tab === "lists" && this.renderRoot.querySelector('[aria-label="Refresh list"]')?.focus({ preventScroll: !0 });
    }}
      >
        <div class="delete-confirmation">
          <div class="delete-symbol" aria-hidden="true">${b("trash")}</div>
          <p class="delete-item">${this.deleteTarget?.item.summary}</p>
          <p class="delete-list-name">
            ${this.deleteTarget ? this.listName(this.deleteTarget.entity) : ""}
          </p>
          <p>
            This removes the item from the shared list for everyone. It can’t be
            undone.
          </p>
          ${this.deleteError ? l`<p class="delete-error" role="alert">${this.deleteError}</p>` : p}
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
        ${this.detailEntity === this.config.climate ? l`<div class="sheet-custom">
                ${this.climate(!0)}${this.message ? l`<p role="status">${this.message}</p>` : p}${this.graphs(!this.detailReady)}
              </div>` : this.detailEntity === this.config.weather ? l`<div class="sheet-custom">
                  ${this.weather(!0)}
                  <p class="intro">
                    Current conditions from your weather provider.
                  </p>
                </div>` : p}
      </signal-details>
    </div>`;
  }
}
customElements.get("signal-home") || customElements.define("signal-home", Ni);
const $t = window;
$t.customCards = $t.customCards || [];
$t.customCards.push({
  type: "signal-home",
  name: "Signal Home",
  description: "A colorful, fluid home dashboard with climate, weather, groceries and safety.",
  preview: !0,
  documentationURL: "https://github.com/gkgkgkgk/signal-home"
});
$t.customCards.push(
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
  Ni as SignalHome
};
