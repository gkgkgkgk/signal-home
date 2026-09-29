const W = globalThis, Q = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, tt = /* @__PURE__ */ Symbol(), nt = /* @__PURE__ */ new WeakMap();
let yt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== tt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Q && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = nt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && nt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Tt = (n) => new yt(typeof n == "string" ? n : n + "", void 0, tt), E = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, s, a) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[a + 1], n[0]);
  return new yt(e, n, tt);
}, Ot = (n, t) => {
  if (Q) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = W.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, n.appendChild(i);
  }
}, rt = Q ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Tt(e);
})(n) : n;
const { is: Rt, defineProperty: Ht, getOwnPropertyDescriptor: Ut, getOwnPropertyNames: Lt, getOwnPropertySymbols: Pt, getPrototypeOf: Nt } = Object, V = globalThis, ot = V.trustedTypes, It = ot ? ot.emptyScript : "", Dt = V.reactiveElementPolyfillSupport, I = (n, t) => n, J = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? It : null;
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
} }, $t = (n, t) => !Rt(n, t), lt = { attribute: !0, type: String, converter: J, reflect: !1, useDefault: !1, hasChanged: $t };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), V.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let R = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = lt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && Ht(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: a } = Ut(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: s, set(r) {
      const p = s?.call(this);
      a?.call(this, r), this.requestUpdate(t, p, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? lt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(I("elementProperties"))) return;
    const t = Nt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(I("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(I("properties"))) {
      const e = this.properties, i = [...Lt(e), ...Pt(e)];
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
      for (const s of i) e.unshift(rt(s));
    } else t !== void 0 && e.push(rt(t));
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
    return Ot(t, this.constructor.elementStyles), t;
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
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : J).toAttribute(e, i.type);
      this._$Em = t, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), r = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : J;
      this._$Em = s;
      const p = r.fromAttribute(e, a.type);
      this[s] = p ?? this._$Ej?.get(s) ?? p, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, a) {
    if (t !== void 0) {
      const r = this.constructor;
      if (s === !1 && (a = this[t]), i ??= r.getPropertyOptions(t), !((i.hasChanged ?? $t)(a, e) || i.useDefault && i.reflect && a === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: a }, r) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), a !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        const { wrapped: r } = a, p = this[s];
        r !== !0 || this._$AL.has(s) || p === void 0 || this.C(s, void 0, a, p);
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
R.elementStyles = [], R.shadowRootOptions = { mode: "open" }, R[I("elementProperties")] = /* @__PURE__ */ new Map(), R[I("finalized")] = /* @__PURE__ */ new Map(), Dt?.({ ReactiveElement: R }), (V.reactiveElementVersions ??= []).push("2.1.2");
const et = globalThis, ct = (n) => n, F = et.trustedTypes, dt = F ? F.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, wt = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, kt = "?" + C, qt = `<${kt}>`, T = document, D = () => T.createComment(""), q = (n) => n === null || typeof n != "object" && typeof n != "function", it = Array.isArray, jt = (n) => it(n) || typeof n?.[Symbol.iterator] == "function", X = `[ 	
\f\r]`, N = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, pt = /-->/g, ht = />/g, M = RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ut = /'/g, gt = /"/g, _t = /^(?:script|style|textarea|title)$/i, At = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), o = At(1), H = At(2), S = /* @__PURE__ */ Symbol.for("lit-noChange"), d = /* @__PURE__ */ Symbol.for("lit-nothing"), mt = /* @__PURE__ */ new WeakMap(), z = T.createTreeWalker(T, 129);
function St(n, t) {
  if (!it(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return dt !== void 0 ? dt.createHTML(t) : t;
}
const Bt = (n, t) => {
  const e = n.length - 1, i = [];
  let s, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = N;
  for (let p = 0; p < e; p++) {
    const l = n[p];
    let c, u, h = -1, x = 0;
    for (; x < l.length && (r.lastIndex = x, u = r.exec(l), u !== null); ) x = r.lastIndex, r === N ? u[1] === "!--" ? r = pt : u[1] !== void 0 ? r = ht : u[2] !== void 0 ? (_t.test(u[2]) && (s = RegExp("</" + u[2], "g")), r = M) : u[3] !== void 0 && (r = M) : r === M ? u[0] === ">" ? (r = s ?? N, h = -1) : u[1] === void 0 ? h = -2 : (h = r.lastIndex - u[2].length, c = u[1], r = u[3] === void 0 ? M : u[3] === '"' ? gt : ut) : r === gt || r === ut ? r = M : r === pt || r === ht ? r = N : (r = M, s = void 0);
    const v = r === M && n[p + 1].startsWith("/>") ? " " : "";
    a += r === N ? l + qt : h >= 0 ? (i.push(c), l.slice(0, h) + wt + l.slice(h) + C + v) : l + C + (h === -2 ? p : v);
  }
  return [St(n, a + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class j {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let a = 0, r = 0;
    const p = t.length - 1, l = this.parts, [c, u] = Bt(t, e);
    if (this.el = j.createElement(c, i), z.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = z.nextNode()) !== null && l.length < p; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(wt)) {
          const x = u[r++], v = s.getAttribute(h).split(C), y = /([.?@])?(.*)/.exec(x);
          l.push({ type: 1, index: a, name: y[2], strings: v, ctor: y[1] === "." ? Wt : y[1] === "?" ? Ft : y[1] === "@" ? Zt : G }), s.removeAttribute(h);
        } else h.startsWith(C) && (l.push({ type: 6, index: a }), s.removeAttribute(h));
        if (_t.test(s.tagName)) {
          const h = s.textContent.split(C), x = h.length - 1;
          if (x > 0) {
            s.textContent = F ? F.emptyScript : "";
            for (let v = 0; v < x; v++) s.append(h[v], D()), z.nextNode(), l.push({ type: 2, index: ++a });
            s.append(h[x], D());
          }
        }
      } else if (s.nodeType === 8) if (s.data === kt) l.push({ type: 2, index: a });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(C, h + 1)) !== -1; ) l.push({ type: 7, index: a }), h += C.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const i = T.createElement("template");
    return i.innerHTML = t, i;
  }
}
function L(n, t, e = n, i) {
  if (t === S) return t;
  let s = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const a = q(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== a && (s?._$AO?.(!1), a === void 0 ? s = void 0 : (s = new a(n), s._$AT(n, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = s : e._$Cl = s), s !== void 0 && (t = L(n, s._$AS(n, t.values), s, i)), t;
}
class Yt {
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
    const { el: { content: e }, parts: i } = this._$AD, s = (t?.creationScope ?? T).importNode(e, !0);
    z.currentNode = s;
    let a = z.nextNode(), r = 0, p = 0, l = i[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let c;
        l.type === 2 ? c = new B(a, a.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(a, l.name, l.strings, this, t) : l.type === 6 && (c = new Vt(a, this, t)), this._$AV.push(c), l = i[++p];
      }
      r !== l?.index && (a = z.nextNode(), r++);
    }
    return z.currentNode = T, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class B {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
    t = L(this, t, e), q(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : jt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && q(this._$AH) ? this._$AA.nextSibling.data = t : this.T(T.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = j.createElement(St(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(e);
    else {
      const a = new Yt(s, this), r = a.u(this.options);
      a.p(e), this.T(r), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = mt.get(t.strings);
    return e === void 0 && mt.set(t.strings, e = new j(t)), e;
  }
  k(t) {
    it(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const a of t) s === e.length ? e.push(i = new B(this.O(D()), this.O(D()), this, this.options)) : i = e[s], i._$AI(a), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = ct(t).nextSibling;
      ct(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class G {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, a) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = d;
  }
  _$AI(t, e = this, i, s) {
    const a = this.strings;
    let r = !1;
    if (a === void 0) t = L(this, t, e, 0), r = !q(t) || t !== this._$AH && t !== S, r && (this._$AH = t);
    else {
      const p = t;
      let l, c;
      for (t = a[0], l = 0; l < a.length - 1; l++) c = L(this, p[i + l], e, l), c === S && (c = this._$AH[l]), r ||= !q(c) || c !== this._$AH[l], c === d ? t = d : t !== d && (t += (c ?? "") + a[l + 1]), this._$AH[l] = c;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Wt extends G {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Ft extends G {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Zt extends G {
  constructor(t, e, i, s, a) {
    super(t, e, i, s, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = L(this, t, e, 0) ?? d) === S) return;
    const i = this._$AH, s = t === d && i !== d || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, a = t !== d && (i === d || s);
    s && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Vt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    L(this, t);
  }
}
const Gt = et.litHtmlPolyfillSupport;
Gt?.(j, B), (et.litHtmlVersions ??= []).push("3.3.3");
const Kt = (n, t, e) => {
  const i = e?.renderBefore ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const a = e?.renderBefore ?? null;
    i._$litPart$ = s = new B(t.insertBefore(D(), a), a, void 0, e ?? {});
  }
  return s._$AI(n), s;
};
const st = globalThis;
let _ = class extends R {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Kt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return S;
  }
};
_._$litElement$ = !0, _.finalized = !0, st.litElementHydrateSupport?.({ LitElement: _ });
const Xt = st.litElementPolyfillSupport;
Xt?.({ LitElement: _ });
(st.litElementVersions ??= []).push("4.2.2");
const O = { ATTRIBUTE: 1, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, Et = (n) => (...t) => ({ _$litDirective$: n, values: t });
let Ct = class {
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
const Jt = (n) => n.strings === void 0, Qt = {}, Mt = (n, t = Qt) => n._$AH = t;
const ft = Et(class extends Ct {
  constructor() {
    super(...arguments), this.key = d;
  }
  render(n, t) {
    return this.key = n, t;
  }
  update(n, [t, e]) {
    return t !== this.key && (Mt(n), this.key = t), e;
  }
});
const U = Et(class extends Ct {
  constructor(n) {
    if (super(n), n.type !== O.PROPERTY && n.type !== O.ATTRIBUTE && n.type !== O.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!Jt(n)) throw Error("`live` bindings can only contain a single expression");
  }
  render(n) {
    return n;
  }
  update(n, [t]) {
    if (t === S || t === d) return t;
    const e = n.element, i = n.name;
    if (n.type === O.PROPERTY) {
      if (t === e[i]) return S;
    } else if (n.type === O.BOOLEAN_ATTRIBUTE) {
      if (!!t === e.hasAttribute(i)) return S;
    } else if (n.type === O.ATTRIBUTE && e.getAttribute(i) === t + "") return S;
    return Mt(n), t;
  }
}), te = E`
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
`, ee = E`
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
      grid-template-rows: minmax(0, 1fr) auto;
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
      padding: 18px 18px 24px;
    }
    .app main::-webkit-scrollbar {
      display: none;
    }
    .app.immersive main {
      padding-top: max(18px, env(safe-area-inset-top));
    }
    header {
      margin-bottom: 19px;
      gap: 10px;
    }
    .eyebrow {
      font-size: 10px;
      letter-spacing: 1.5px;
    }
    .header-right {
      gap: 7px;
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
    .nav-indicator {
      transition: none !important;
    }
    .pocket-tile:active:not(:disabled),
    .pocket-tile:hover {
      transform: none !important;
    }
  }
`, bt = {
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
}, g = (n) => H`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${bt[n] || bt.home}></path></svg>`, $ = (n) => !!n && !["unknown", "unavailable"].includes(n.state), m = (n) => n != null && n !== "" && Number.isFinite(Number(n)) ? Number(n) : void 0, k = (n) => n === "partlycloudy" ? "Partly cloudy" : (n || "Unavailable").replaceAll("_", " ").replaceAll("-", " "), xt = (n) => typeof n == "string" ? { entity: n } : n;
class ie extends _ {
  constructor() {
    super(...arguments), this.config = { type: "custom:signal-home" };
  }
  static {
    this.properties = { hass: { attribute: !1 }, config: { state: !0 } };
  }
  static {
    this.styles = E`
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
    return o`<p>
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
customElements.get("signal-home-editor") || customElements.define("signal-home-editor", ie);
const at = E`
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
class se extends _ {
  constructor() {
    super(...arguments), this.open = !1, this.heading = "Details", this.dark = !1, this.sheetId = `signal-sheet-${Date.now()}-${Math.random().toString(36).slice(2)}`, this.closing = !1, this.closeRequested = !1, this.startY = 0, this.entryTransform = "translateY(24px) scale(.96)", this.pop = () => {
      this.open && history.state?.signalSheet !== this.sheetId && this.finish();
    };
  }
  static {
    this.properties = {
      open: { type: Boolean },
      heading: { type: String },
      dark: { type: Boolean }
    };
  }
  static {
    this.styles = E`
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
  }
  trapTab(t) {
    if (t.key !== "Tab") return;
    const e = [], i = (r) => {
      r instanceof HTMLElement && r.matches("button,a[href],input,select,textarea,[tabindex]") && !r.matches(':disabled,[tabindex="-1"],[hidden]') && r.getClientRects().length && e.push(r), (r instanceof HTMLSlotElement ? r.assignedElements({ flatten: !0 }) : r.shadowRoot ? Array.from(r.shadowRoot.children) : Array.from(r.children)).forEach(i);
    };
    if (i(this.renderRoot.querySelector("dialog")), !e.length) return;
    const s = t.composedPath()[0], a = e.indexOf(s);
    t.shiftKey && a <= 0 ? (t.preventDefault(), e.at(-1).focus()) : !t.shiftKey && (a === e.length - 1 || a === -1) && (t.preventDefault(), e[0].focus());
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("popstate", this.pop);
  }
  disconnectedCallback() {
    if (super.disconnectedCallback(), window.removeEventListener("popstate", this.pop), this.renderRoot.querySelector("dialog")?.close(), history.state?.signalSheet === this.sheetId) {
      const t = { ...history.state };
      delete t.signalSheet, history.replaceState(t, "");
    }
  }
  updated(t) {
    if (t.has("open")) {
      const e = this.renderRoot.querySelector("dialog");
      if (this.open && !e.open) {
        this.closeRequested = !1;
        let i = document.activeElement;
        for (; i?.shadowRoot?.activeElement; )
          i = i.shadowRoot.activeElement;
        const s = i?.getBoundingClientRect();
        e.showModal();
        const a = e.getBoundingClientRect();
        if (s && s.width && s.height) {
          const r = Math.max(
            -48,
            Math.min(
              48,
              (s.x + s.width / 2 - a.x - a.width / 2) * 0.18
            )
          ), p = Math.max(
            -64,
            Math.min(
              64,
              (s.y + s.height / 2 - a.y - a.height / 2) * 0.18
            )
          );
          this.entryTransform = `translate(${r}px,${p}px) scale(.96)`;
        }
        history.pushState({ ...history.state, signalSheet: this.sheetId }, ""), matchMedia("(prefers-reduced-motion: reduce)").matches || e.animate(
          [
            { opacity: 0, transform: this.entryTransform },
            { opacity: 1, transform: "none" }
          ],
          { duration: 280, easing: "cubic-bezier(.16,1,.3,1)" }
        );
      } else !this.open && e.open && e.close();
    }
  }
  requestClose() {
    this.closing || this.closeRequested || (this.closeRequested = !0, history.state?.signalSheet === this.sheetId ? history.back() : this.finish());
  }
  async finish() {
    if (this.closing) return;
    this.closing = !0;
    const t = this.renderRoot.querySelector("dialog");
    t.open && !matchMedia("(prefers-reduced-motion: reduce)").matches && await t.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: this.entryTransform }
      ],
      { duration: 140, easing: "ease-in" }
    ).finished.catch(() => {
    }), t.close(), this.closing = !1, this.dispatchEvent(
      new CustomEvent("signal-close", { bubbles: !0, composed: !0 })
    );
  }
  render() {
    return o`<dialog
      @keydown=${this.trapTab}
      class=${this.dark ? "dark" : ""}
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
customElements.define("signal-sheet", se);
class ae extends _ {
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
    this.styles = E`
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
        const s = m(this.hass.states[t]?.attributes.supported_features) || 0, a = s & 1 ? "daily" : s & 2 ? "hourly" : s & 4 ? "twice_daily" : "daily", r = await this.hass.callWS({
          type: "call_service",
          domain: "weather",
          service: "get_forecasts",
          service_data: { entity_id: t, type: a },
          return_response: !0
        });
        i === this.sequence && (this.records = (r.response?.[t]?.forecast || []).slice(
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
          (a, r, p) => r === 0 || (a.s ?? a.state) !== (p[r - 1].s ?? p[r - 1].state)
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
    const t = this.hass?.states[this.entity], e = t?.attributes || {}, i = this.entity.split(".")[0], s = $(t), a = i === "binary_sensor", r = e.device_class === "moisture", p = s ? a ? t.state === "on" ? r ? "Water detected" : "Active" : r ? "Dry" : "Clear" : k(t.state) : "Unavailable", l = [
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
    ].includes(i), c = i === "sensor" && (m(t?.state) !== void 0 || !!e.unit_of_measurement), u = this.hass?.states[this.battery];
    return o`<signal-sheet
      .open=${!!this.entity}
      .heading=${this.name || e.friendly_name || "Device details"}
      .dark=${this.dark}
      @signal-close=${this.closed}
      ><div class=${`content ${this.dark ? "dark" : ""}`}>
        ${this.custom ? o`<slot></slot>` : l ? o`<signal-control
                  .hass=${this.hass}
                  .configuration=${{ type: "custom:signal-control", entity: this.entity, name: this.name || void 0, appearance: this.dark ? "dark" : "light", detail: !0 }}
                ></signal-control>` : o`<div
                    class=${`summary ${s ? a && t.state === "on" ? "alert" : "" : "unavailable"}`}
                  >
                    <div class="caption">
                      ${a ? "LIVE SENSOR STATUS" : "CURRENT READING"}
                    </div>
                    <div class="value">
                      ${c ? s ? t.state : "—" : p}
                      ${c && e.unit_of_measurement || ""}
                    </div>
                    <div class="caption">
                      ${s ? a && t.state === "on" ? "Check this area. Open advanced details for more information." : "Reported by Home Assistant" : "This device cannot currently confirm its state."}
                    </div>
                  </div>
                  ${u ? o`<div class="fact"><span>Battery</span>${$(u) ? u.state + "%" : "Unavailable"}</div>` : d}${c ? o`<signal-graph .hass=${this.hass} .configuration=${{ type: "custom:signal-graph", entity: this.entity, appearance: this.dark ? "dark" : "light" }}></signal-graph>` : d}${!l && !a && !c ? o`<p class="hint">Additional controls for this device are available in advanced details.</p>` : d}`}
        ${["weather", "binary_sensor"].includes(i) ? o`<section class="records">
                <h3>
                  ${i === "weather" ? "The days ahead" : "Recent history · 24 hours"}
                </h3>
                ${this.loading ? o`<p class="hint" role="status">Loading…</p>` : this.loadError ? o`<p class="hint" role="status">${this.loadError}</p>
                          <button class="retry" @click=${this.load}>
                            Try again
                          </button>` : this.records.length ? this.records.map((h) => {
      const x = h.datetime ?? h.lu ?? h.last_updated ?? h.lc ?? h.last_changed, v = new Date(
        typeof x == "number" ? x * 1e3 : x
      );
      return o`<div class="record">
                              <div>
                                ${i === "weather" ? v.toLocaleDateString(this.hass.locale?.language, { weekday: "short", month: "short", day: "numeric" }) : this.historyLabel(h.s ?? h.state)}<small
                                  >${i === "weather" ? k(h.condition) : v.toLocaleString(this.hass.locale?.language, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</small
                                >
                              </div>
                              ${i === "weather" ? o`<strong>${m(h.temperature) ?? "—"}° ${h.templow !== void 0 ? o`<small>Low ${h.templow}°</small>` : d}</strong>` : d}
                            </div>`;
    }) : o`<p class="hint">
                            ${i === "weather" ? "No forecast is available from this provider." : "No recorded history in this period."}
                          </p>`}
              </section>` : d}
        <button class="advanced" @click=${this.native}>
          Advanced in Home Assistant ↗
        </button>
      </div></signal-sheet
    >`;
  }
}
customElements.define("signal-details", ae);
class ne extends _ {
  constructor() {
    super(...arguments), this.config = { type: "custom:signal-control", entity: "" }, this.pending = !1, this.detailsOpen = !1, this.error = "", this.confirmUnlock = !1, this.preview = {};
  }
  static {
    this.properties = {
      hass: { attribute: !1 },
      config: { state: !0 },
      pending: { state: !0 },
      error: { state: !0 },
      confirmUnlock: { state: !0 },
      preview: { state: !0 },
      detailsOpen: { state: !0 }
    };
  }
  static {
    this.styles = [
      at,
      E`
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
    `
    ];
  }
  setConfig(t) {
    if (!t.entity || typeof t.entity != "string")
      throw new Error("Choose an entity.");
    this.config = { ...t }, this.preview = {};
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
    this.pending = !0, this.error = "";
    const [i, s] = t.split(".");
    try {
      await this.hass.callService(i, s, {
        entity_id: this.config.entity,
        ...e
      }), this.confirmUnlock = !1;
    } catch {
      this.error = "Couldn’t reach this device. Try again.";
    } finally {
      this.pending = !1, this.preview = {};
    }
  }
  slider(t, e, i, s, a, r, p, l, c = !1) {
    const u = this.preview[e] ?? i, h = a - s, x = u === void 0 || h <= 0 ? 0 : Math.max(0, Math.min(100, (u - s) / h * 100));
    return o`<div class="slider-block">
      <div class="slider-heading">
        <span>${t}</span
        ><span class="slider-value"
          >${u === void 0 ? "—" : Math.round(u * 10) / 10}${p}</span
        >
      </div>
      <input
        class="range"
        type="range"
        aria-label=${t}
        min=${s}
        max=${a}
        step=${r}
        .value=${U(String(u ?? s))}
        style=${`--fill:${x}%`}
        ?disabled=${c || this.pending}
        @input=${(v) => this.preview = { ...this.preview, [e]: Number(v.target.value) }}
        @change=${(v) => l(Math.max(s, Math.min(a, Number(v.target.value))))}
      />
    </div>`;
  }
  render() {
    if (!this.hass) return o`<div class="widget">Connecting…</div>`;
    const t = this.hass.states[this.config.entity], e = this.isReady(), i = t?.attributes || {}, s = this.config.entity.split(".")[0], a = t?.state === "on", r = m(i.supported_features) ?? 0, p = ["light", "switch", "fan", "input_boolean"].includes(
      s
    ), l = s === "media_player", c = s === "cover", u = s === "light" ? "bulb" : c ? "cover" : l ? "music" : s === "lock" ? "lock" : s === "fan" ? "wind" : "power", h = Array.isArray(i.supported_color_modes) ? i.supported_color_modes : [], x = s === "light" && (i.brightness !== void 0 || h.some((b) => !["onoff", "unknown"].includes(b))), y = "#" + (Array.isArray(i.rgb_color) ? i.rgb_color : [255, 255, 255]).map((b) => Math.round(b).toString(16).padStart(2, "0")).join("");
    return o`<article
        class=${`widget ${this.config.appearance || "auto"} ${this.config.accent || "mint"} ${a ? "on" : ""}`}
        aria-busy=${this.pending}
      >
        <div class="control-top">
          ${this.config.detail ? o`<span class="entity-icon">${g(u)}</span>` : o`<button
                  class="entity-icon"
                  aria-label="Device details"
                  @click=${this.more}
                >
                  ${g(u)}
                </button>`}
          ${p ? o`<button class="switch" role="switch" aria-label=${this.config.name || i.friendly_name || this.config.entity} aria-checked=${a} ?disabled=${!e || this.pending} @click=${() => this.send(`${s}.${a ? "turn_off" : "turn_on"}`)}><span class="thumb">${g(a ? "check" : "power")}</span></button>` : this.config.detail ? d : o`<button class="icon-button" aria-label="Open full controls" @click=${this.more}>${g("arrow")}</button>`}
        </div>
        <h2>${this.config.name || i.friendly_name || this.config.entity}</h2>
        <div class="state-line">
          <span class="state-dot"></span
          >${this.pending ? "Updating…" : e ? k(t.state) : "Unavailable"}
        </div>
        ${x ? this.slider("Brightness", "brightness", a ? (m(i.brightness) ?? 0) / 255 * 100 : 0, 0, 100, 1, "%", (b) => this.send(b === 0 ? "light.turn_off" : "light.turn_on", b ? { brightness_pct: Math.round(b) } : {}), !e) : d}
        ${s === "light" && h.includes("color_temp") && m(i.min_color_temp_kelvin) !== void 0 && m(i.max_color_temp_kelvin) !== void 0 ? this.slider("Color temperature", "kelvin", m(i.color_temp_kelvin), Number(i.min_color_temp_kelvin), Number(i.max_color_temp_kelvin), 50, " K", (b) => this.send("light.turn_on", { color_temp_kelvin: b }), !e) : d}
        ${s === "light" && h.some(
      (b) => ["rgb", "rgbw", "rgbww", "hs", "xy"].includes(b)
    ) ? o`<label class="color-control"
                >Light color<input
                  type="color"
                  aria-label="Light color"
                  .value=${U(y)}
                  ?disabled=${!e || this.pending}
                  @change=${(b) => {
      const f = b.target.value;
      this.send("light.turn_on", {
        rgb_color: [1, 3, 5].map(
          (w) => parseInt(f.slice(w, w + 2), 16)
        )
      });
    }}
              /></label>` : d}
        ${s === "fan" && r & 1 ? this.slider("Fan speed", "speed", m(i.percentage), 0, 100, m(i.percentage_step) || 1, "%", (b) => this.send("fan.set_percentage", { percentage: Math.round(b) }), !e) : d}
        ${c ? o`<div class="cover-window" aria-hidden="true">
                  <div
                    class="cover-blind"
                    style=${`--closed:${100 - (m(i.current_position) ?? (t?.state === "closed" ? 0 : 100))}%`}
                  ></div>
                </div>
                <div class="button-row">
                  ${r & 1 ? o`<button class="action" ?disabled=${!e || this.pending} aria-label="Open cover" @click=${() => this.send("cover.open_cover")}>${g("up")}</button>` : d}${r & 8 ? o`<button class="action secondary" ?disabled=${!e || this.pending} aria-label="Stop cover" @click=${() => this.send("cover.stop_cover")}>${g("stop")}</button>` : d}${r & 2 ? o`<button class="action" ?disabled=${!e || this.pending} aria-label="Close cover" @click=${() => this.send("cover.close_cover")}>${g("down")}</button>` : d}
                </div>
                ${r & 4 ? this.slider("Cover position", "cover", m(i.current_position), 0, 100, 1, "%", (b) => this.send("cover.set_cover_position", { position: Math.round(b) }), !e) : d}` : d}
        ${l ? o`<div class="media-meta">
                  ${i.entity_picture ? o`<img class="art" src=${i.entity_picture} alt="" loading="lazy" />` : d}
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
                  ${r & 16 ? o`<button class="action secondary" aria-label="Previous track" ?disabled=${!e || this.pending} @click=${() => this.send("media_player.media_previous_track")}>${g("previous")}</button>` : d}${r & 16385 ? o`<button class="action" aria-label=${t?.state === "playing" ? "Pause" : "Play"} ?disabled=${!e || this.pending || (t?.state === "playing" ? !(r & 1) : !(r & 16384))} @click=${() => this.send(`media_player.${t?.state === "playing" ? "media_pause" : "media_play"}`)}>${g(t?.state === "playing" ? "pause" : "play")}</button>` : d}${r & 32 ? o`<button class="action secondary" aria-label="Next track" ?disabled=${!e || this.pending} @click=${() => this.send("media_player.media_next_track")}>${g("next")}</button>` : d}
                </div>
                ${r & 4 ? this.slider("Volume", "volume", m(i.volume_level) === void 0 ? void 0 : Number(i.volume_level) * 100, 0, 100, 1, "%", (b) => this.send("media_player.volume_set", { volume_level: b / 100 }), !e) : d}` : d}
        ${["number", "input_number"].includes(s) ? this.slider("Value", "number", m(t?.state), m(i.min) ?? 0, m(i.max) ?? 100, m(i.step) || 1, i.unit_of_measurement || "", (b) => this.send(`${s}.set_value`, { value: b }), !e) : d}
        ${["select", "input_select"].includes(s) ? o`<select
                class="select"
                aria-label=${this.config.name || i.friendly_name || "Option"}
                .value=${U(t?.state || "")}
                ?disabled=${!e || this.pending}
                @change=${(b) => this.send(`${s}.select_option`, { option: b.target.value })}
              >
                ${(i.options || []).map((b) => o`<option value=${b} .selected=${U(t?.state === b)}>${b}</option>`)}
              </select>` : d}
        ${["scene", "button", "input_button", "script"].includes(s) ? o`<div class="button-row"><button class="action" ?disabled=${!e || this.pending} @click=${() => this.send(`${s}.${s.includes("button") ? "press" : "turn_on"}`)}>${g("play")} ${s.includes("button") ? "Press" : s === "scene" ? "Activate" : "Run"}</button></div>` : d}
        ${s === "lock" ? o`<div class="button-row">
                  <button
                    class="action"
                    ?disabled=${!e || this.pending}
                    @click=${() => t.state === "locked" ? this.confirmUnlock = !0 : this.send("lock.lock")}
                  >
                    ${g("lock")}
                    ${t?.state === "locked" ? "Unlock…" : "Lock"}
                  </button>
                </div>
                ${this.confirmUnlock ? o`<div class="lock-confirm">
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
                      </div>` : d}` : d}
        ${this.error ? o`<p class="error" role="alert">${this.error}</p>` : d}
      </article>
      ${this.config.detail ? d : o`<signal-details .hass=${this.hass} .entity=${this.detailsOpen ? this.config.entity : ""} .name=${this.config.name || ""} .dark=${this.config.appearance === "dark" || this.config.appearance !== "light" && matchMedia("(prefers-color-scheme: dark)").matches} @signal-close=${() => this.detailsOpen = !1}></signal-details>`}`;
  }
}
customElements.define("signal-control", ne);
function re(n) {
  return n.map((t) => {
    const e = t.lu ?? t.last_updated ?? t.lc ?? t.last_changed;
    return { time: typeof e == "number" ? e * 1e3 : Date.parse(String(e)), value: m(t.s ?? t.state) ?? null };
  }).filter((t) => Number.isFinite(t.time)).sort((t, e) => t.time - e.time);
}
function oe(n, t = 600) {
  if (n.length <= t) return n;
  const e = Math.ceil(n.length / (t / 4)), i = [];
  for (let s = 0; s < n.length; s += e) {
    const a = n.slice(s, s + e), r = a.filter((c) => c.value !== null), p = /* @__PURE__ */ new Set([a[0], a[a.length - 1]]);
    r.length && (p.add(r.reduce((c, u) => c.value < u.value ? c : u)), p.add(r.reduce((c, u) => c.value > u.value ? c : u)));
    const l = a.find((c) => c.value === null);
    l && p.add(l), i.push(...[...p].sort((c, u) => c.time - u.time));
  }
  return i;
}
class le extends _ {
  constructor() {
    super(...arguments), this.config = { type: "custom:signal-graph", entity: "" }, this.points = [], this.loading = !1, this.error = "", this.hours = 24, this.sequence = 0, this.queried = "", this.end = Date.now(), this.start = this.end - 864e5;
  }
  static {
    this.properties = {
      hass: { attribute: !1 },
      config: { state: !0 },
      points: { state: !0 },
      loading: { state: !0 },
      error: { state: !0 },
      hours: { state: !0 },
      cursor: { state: !0 }
    };
  }
  static {
    this.styles = [
      at,
      E`
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
        animation: draw-in 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
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
      @keyframes draw-in {
        from {
          opacity: 0;
          transform: translateY(5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
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
    `
    ];
  }
  setConfig(t) {
    if (!t.entity || typeof t.entity != "string")
      throw new Error("Choose a numeric sensor entity.");
    if (t.hours !== void 0 && (!Number.isFinite(t.hours) || t.hours < 1 || t.hours > 168))
      throw new Error("History hours must be between 1 and 168.");
    this.config = { ...t }, this.hours = t.hours || 24, this.queried = "", this.points = [], this.sequence++;
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
        (e) => e.startsWith("sensor.") && m(t.states[e].state) !== void 0
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
    this.hass && (t.has("hass") || t.has("config")) && this.queried !== `${this.config.entity}:${this.hours}` && this.fetchHistory();
  }
  async fetchHistory() {
    if (!this.hass || !this.config.entity || !this.isConnected) return;
    const t = ++this.sequence;
    this.queried = `${this.config.entity}:${this.hours}`, this.loading = !0, this.error = "", this.cursor = void 0, this.end = Date.now(), this.start = this.end - this.hours * 36e5;
    try {
      const e = await this.hass.callWS({
        type: "history/history_during_period",
        start_time: new Date(this.start).toISOString(),
        end_time: new Date(this.end).toISOString(),
        entity_ids: [this.config.entity],
        minimal_response: !0,
        no_attributes: !0,
        significant_changes_only: !1
      });
      t === this.sequence && (this.points = re(e[this.config.entity] || []));
    } catch {
      t === this.sequence && (this.error = "History couldn’t be loaded.", this.points = []);
    } finally {
      t === this.sequence && (this.loading = !1);
    }
  }
  period(t) {
    this.hours = t, this.fetchHistory();
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
    const e = m(t);
    return e === void 0 ? "—" : new Intl.NumberFormat(this.hass?.locale?.language || void 0, {
      maximumFractionDigits: 1
    }).format(e);
  }
  render() {
    const t = this.hass?.states[this.config.entity], e = t?.attributes.unit_of_measurement || "", i = this.points.filter((f) => f.value !== null), s = i.map((f) => f.value), a = s.length ? s.reduce((f, w) => Math.min(f, w), 1 / 0) : 0, r = s.length ? s.reduce((f, w) => Math.max(f, w), -1 / 0) : 1, p = Math.max((r - a) * 0.16, 1), l = a - p, c = r + p, u = (f) => Math.max(
      0,
      Math.min(600, (f.time - this.start) / (this.end - this.start) * 600)
    ), h = (f) => 150 - (f.value - l) / (c - l) * 150, x = [];
    let v = [];
    for (const f of oe(this.points))
      f.value === null ? (v.length && x.push(v), v = []) : v.push(f);
    v.length && x.push(v);
    const y = this.cursor !== void 0 ? this.points[this.cursor] : void 0, b = y ? y.value : $(t) ? t.state : void 0;
    return o`<article
      class=${`widget ${this.config.appearance || "auto"} ${this.config.accent || "lilac"}`}
    >
      <div class="top">
        <span class="header-title"
          >${g("graph")}${this.config.name || t?.attributes.friendly_name || this.config.entity}</span
        >
        <div class="periods" aria-label="History period">
          ${[6, 24, 168].map((f) => o`<button aria-pressed=${this.hours === f} @click=${() => this.period(f)}>${f === 168 ? "7d" : `${f}h`}</button>`)}
        </div>
      </div>
      <div class="reading">
        <div>
          <div class="value numeric">
            ${this.format(b)}<small>${e}</small>
          </div>
          <div class="time">
            ${y ? new Date(y.time).toLocaleString(this.hass?.locale?.language || void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : $(t) ? "Right now" : "Current reading unavailable"}
          </div>
        </div>
        <span class="subtle"
          >${this.loading ? "Updating…" : `${this.hours === 168 ? "7 days" : this.hours + " hours"} of history`}</span
        >
      </div>
      ${this.loading && !this.points.length ? o`<div
              class="skeleton"
              role="status"
              aria-label="Loading history"
            ></div>` : this.error ? o`<div class="empty" role="status">
                ${this.error}<button
                  class="retry"
                  @click=${() => this.fetchHistory()}
                >
                  Try again
                </button>
              </div>` : i.length ? o`<div
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
                      ${[25, 75, 125].map((f) => H`<line class="grid-line" x1="0" y1=${f} x2="600" y2=${f}/>`)}${x.map(
      (f) => {
        const w = f.map(
          (P, A) => `${A ? "L" : "M"}${u(P).toFixed(2)},${h(P).toFixed(2)}`
        ).join(" ");
        return H`<path class="fill" d=${`${w} L${u(f[f.length - 1])},160 L${u(f[0])},160 Z`}/><path class="line" d=${w}/>${f.length === 1 ? H`<circle cx=${u(f[0])} cy=${h(f[0])} r="3" fill="var(--accent-ink)"/>` : d}`;
      }
    )}${y ? H`<line class="cursor-line" x1=${u(y)} x2=${u(y)} y1="0" y2="160"/>${y.value !== null ? H`<circle class="cursor-dot" cx=${u(y)} cy=${h(y)} r="5"/>` : d}` : d}
                    </svg>
                  </div>
                  <div class="bounds">
                    <span
                      >${new Date(this.start).toLocaleString(void 0, { weekday: this.hours > 24 ? "short" : void 0, hour: "numeric", minute: "2-digit" })}</span
                    ><span>Now</span>
                  </div>` : o`<div class="empty">
                  No numeric history in this period.
                </div>`}
      <div class="stats">
        <span
          >Low<strong
            >${s.length ? this.format(a) : "—"} ${e}</strong
          ></span
        ><span
          >High<strong
            >${s.length ? this.format(r) : "—"} ${e}</strong
          ></span
        ><span>Samples<strong>${i.length}</strong></span>
      </div>
    </article>`;
  }
}
customElements.define("signal-graph", le);
class ce extends _ {
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
      at,
      E`
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
    const t = this.hass?.states[this.config.entity], e = $(t), i = e ? m(t.state) : void 0, s = i === void 0 ? 0 : Math.max(
      0,
      Math.min(
        100,
        (i - (this.config.min ?? 0)) / ((this.config.max ?? 100) - (this.config.min ?? 0)) * 100
      )
    );
    return o`<div
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
            >${g(t?.attributes.device_class === "humidity" ? "drop" : t?.attributes.device_class === "temperature" ? "climate" : "graph")}</span
          >
        </div>
        <div class="metric numeric">
          ${e ? i === void 0 ? k(t.state) : new Intl.NumberFormat(this.hass?.locale?.language || void 0, { maximumFractionDigits: 1 }).format(i) : "—"}<small>
            ${t?.attributes.unit_of_measurement || ""}</small
          >
        </div>
        <span class="subtle">${e ? "Tap for details" : "Unavailable"}</span
        >${this.config.max !== void 0 ? o`<div class="meter" aria-hidden="true"><span style=${`width:${s}%`}></span></div>` : ""}
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
customElements.define("signal-metric", ce);
const Y = [
  { id: "home", name: "Overview", icon: "home" },
  { id: "climate", name: "Climate", icon: "climate" },
  { id: "safety", name: "Safety", icon: "shield" },
  { id: "lists", name: "Lists", icon: "list" }
], vt = {
  off: "Off",
  heat: "Heat",
  cool: "Cool",
  heat_cool: "Auto",
  auto: "Auto",
  dry: "Dry",
  fan_only: "Fan"
};
class de extends _ {
  constructor() {
    super(...arguments), this.config = { type: "custom:signal-home" }, this.tab = "home", this.dark = !1, this.detailEntity = "", this.menuOpen = !1, this.phone = window.matchMedia("(max-width: 760px)"), this.narrow = this.phone.matches, this.resize = () => {
      this.narrow = this.phone.matches;
    }, this.todos = [], this.rangeSide = "low", this.syncRoute = () => {
      const t = location.hash.replace("#signal/", ""), e = Y.some((i) => i.id === t) ? t : "home";
      e !== this.tab && (this.tab = e, this.resetScroll());
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
      rangeSide: { state: !0 },
      detailEntity: { state: !0 },
      menuOpen: { state: !0 },
      narrow: { state: !0 }
    };
  }
  static {
    this.styles = [te, ee];
  }
  get appearanceKey() {
    return `signal-home-appearance:${this.config.title || "Home"}`;
  }
  connectedCallback() {
    super.connectedCallback(), this.syncRoute(), window.addEventListener("popstate", this.syncRoute), window.addEventListener("hashchange", this.syncRoute), this.media.addEventListener("change", this.applyAppearance), this.phone.addEventListener("change", this.resize), this.resize(), this.applyAppearance(), this.clock = setInterval(() => {
      this.requestUpdate(), this.config.todo && this.loadTodos();
    }, 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("popstate", this.syncRoute), window.removeEventListener("hashchange", this.syncRoute), this.media.removeEventListener("change", this.applyAppearance), this.phone.removeEventListener("change", this.resize), clearInterval(this.clock), clearTimeout(this.timer), this.todoSequence++;
  }
  setConfig(t) {
    if (!t || typeof t != "object")
      throw new Error("Signal Home needs a configuration.");
    for (const e of ["climate", "weather", "todo", "humidity"])
      if (t[e] && typeof t[e] != "string")
        throw new Error(`${e} must be an entity ID.`);
    if (t.sensors && (!Array.isArray(t.sensors) || t.sensors.some(
      (e) => !e || typeof xt(e).entity != "string"
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
    const i = m(t);
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
    t && (this.detailEntity = t);
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
    t !== this.tab && history.pushState(history.state, "", `#signal/${t}`), this.tab = t, this.resetScroll();
  }
  resetScroll() {
    this.updateComplete.then(
      () => this.renderRoot.querySelector("main")?.scrollTo({ top: 0 })
    );
  }
  nav(t = !1) {
    return o`<nav
      class=${t ? "bottom-nav" : ""}
      style=${`--active: ${Y.findIndex((e) => e.id === this.tab)}`}
      aria-label=${t ? "Mobile navigation" : "Dashboard navigation"}
    >
      ${t ? o`<span class="nav-indicator" aria-hidden="true"></span>` : d}
      ${Y.map((e) => o`<button aria-current=${this.tab === e.id ? "page" : d} @click=${() => this.navigate(e.id)}>${g(e.icon)}<span>${e.name}</span></button>`)}
    </nav>`;
  }
  get sensors() {
    return (this.config.sensors || []).map(xt);
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
      return o`<section class="panel mint climate">
        <div class="panel-label">${g("climate")} Climate</div>
        <h2 style="margin-top:40px">Comfort starts here.</h2>
        <p>
          Choose a climate entity in the card editor to bring your home’s
          temperature into focus.
        </p>
      </section>`;
    const i = $(e), s = e?.attributes || {}, a = m(s.current_temperature), r = m(s.target_temp_low), p = m(s.target_temp_high), l = i && e.state === "heat_cool" && r !== void 0 && p !== void 0 && ((m(s.supported_features) ?? 0) & 2) !== 0, c = l ? this.rangeSide === "low" ? r : p : m(s.temperature), u = l && this.rangeSide === "high" ? r : m(s.min_temp) ?? 7, h = l && this.rangeSide === "low" ? p : m(s.max_temp) ?? 35, x = m(s.target_temp_step) || (this.hass?.config?.unit_system?.temperature === "°F" ? 1 : 0.5), v = this.hass?.config?.unit_system?.temperature || "°", y = c ?? a, b = y === void 0 ? 0 : Math.max(
      0,
      Math.min(
        1,
        (y - (m(s.min_temp) ?? 7)) / Math.max(
          1,
          (m(s.max_temp) ?? 35) - (m(s.min_temp) ?? 7)
        )
      )
    ), f = i && c !== void 0 && (l || ((m(s.supported_features) ?? 0) & 1) !== 0) && e.state !== "off", w = (A) => {
      if (!f || c === void 0) return;
      const K = Number(
        Math.max(u, Math.min(h, c + A)).toFixed(2)
      ), zt = l ? {
        target_temp_low: this.rangeSide === "low" ? K : r,
        target_temp_high: this.rangeSide === "high" ? K : p
      } : { temperature: K };
      this.service("climate", "set_temperature", {
        entity_id: this.config.climate,
        ...zt
      });
    }, P = Array.isArray(s.hvac_modes) ? s.hvac_modes : [];
    return o`<section
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
            ${ft(y, o`<span class="value-in">${i ? this.format(y, 1) : "—"}</span>`)}<sup
              >${v}</sup
            >
          </div>
          <div class="dial-caption">
            ${i ? l ? this.rangeSide === "low" ? "Heat below" : "Cool above" : c !== void 0 ? "Target temperature" : "Current temperature" : "Waiting for your thermostat"}
          </div>
        </div>
      </div>
      <div class="stepper">
        <button
          aria-label="Decrease target temperature"
          ?disabled=${!f || this.busy || c <= u}
          @click=${() => w(-x)}
        >
          ${g("minus")}</button
        ><span
          >${i ? `${this.format(a, 1)}${v} inside` : "No reading"}</span
        ><button
          aria-label="Increase target temperature"
          ?disabled=${!f || this.busy || c >= h}
          @click=${() => w(x)}
        >
          ${g("plus")}
        </button>
      </div>
      ${l ? o`<div class="range-tabs" aria-label="Temperature range"><button aria-pressed=${this.rangeSide === "low"} @click=${() => this.rangeSide = "low"}>Heat ${this.format(r, 1)}°</button><button aria-pressed=${this.rangeSide === "high"} @click=${() => this.rangeSide = "high"}>Cool ${this.format(p, 1)}°</button></div>` : d}
      <div class="climate-foot">
        <span
          >${g("drop")}
          ${this.format(this.state(this.config.humidity)?.state ?? s.current_humidity)}%
          humidity</span
        >${P.length ? o`<select
                aria-label="HVAC mode"
                .value=${U(e?.state || "")}
                ?disabled=${!i || this.busy}
                @change=${(A) => this.service("climate", "set_hvac_mode", { entity_id: this.config.climate, hvac_mode: A.target.value })}
              >
                ${P.map((A) => o`<option value=${A} .selected=${U(A === e?.state)}>${vt[A] || k(A)}</option>`)}
              </select>` : d}
      </div>
    </section>`;
  }
  weather(t = !1) {
    const e = this.state(this.config.weather), i = $(e), s = e?.attributes || {}, a = s.temperature_unit || this.hass?.config?.unit_system?.temperature || "°";
    return o`<section class="panel lilac weather">
      <div class="panel-top">
        <span class="panel-label">${g("sun")} Outside</span
        >${this.config.weather && !t ? o`<button class="icon-button" aria-label="Weather details" @click=${() => this.moreInfo(this.config.weather)}>${g("arrow")}</button>` : d}
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
            ${i ? k(e.state) : "Weather unavailable"}
          </div>
        </div>
        <div
          class=${`weather-art ${e?.state === "clear-night" ? "night" : ""} ${e?.state?.includes("rain") ? "rain" : ""}`}
          aria-hidden="true"
        >
          <div class="sun-disc"></div>
          ${["sunny", "clear-night"].includes(e?.state || "") ? d : o`<div class="cloud"></div>`}
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
  grocery(t = !1) {
    return o`<section class="panel apricot groceries">
      <div class="panel-top">
        <span class="panel-label">${g("list")} Groceries</span
        >${t ? o`<button class="icon-button" aria-label="Refresh groceries" @click=${() => this.loadTodos()}>${g("list")}</button>` : o`<button class="icon-button" aria-label="Open groceries" @click=${() => this.navigate("lists")}>${g("arrow")}</button>`}
      </div>
      ${this.config.todo ? this.todoError ? o`<button class="text-button" @click=${() => this.loadTodos()}>
                ${this.todoError}
              </button>` : o`<div class="list-preview">
                ${this.todos.length ? (t ? this.todos : this.todos.slice(0, 2)).map(
      (e) => o`<div class="todo-row">
                            <button
                              class="check-button"
                              ?disabled=${this.busy}
                              aria-label=${`Complete ${e.summary}`}
                              @click=${() => this.complete(e)}
                            >
                              <span class="check-box"></span></button
                            ><span>${e.summary}</span>
                          </div>`
    ) : o`<div class="empty">
                        ${this.todoLoading ? "Loading your list…" : "All caught up. Room for something good."}
                      </div>`}
              </div>` : o`<p class="empty">
              Select your to-do list in the card editor.
            </p>`}
      ${t && this.config.todo ? o`<form class="todo-form" @submit=${this.addTodo}><input aria-label="New grocery item" placeholder="Add something good…" maxlength="255" .value=${this.draft} @input=${(e) => this.draft = e.target.value} /><button aria-label="Add grocery item" ?disabled=${this.busy || !this.draft.trim()}>${g("plus")}</button></form>` : o`<button class="text-button" @click=${() => this.navigate("lists")}>${this.todos.length ? `${this.todos.length} things on your list` : "Open your list"} ${g("arrow")}</button>`}
    </section>`;
  }
  safety() {
    return this.sensors.length ? o`<div class="sensors">
      ${this.sensors.map((t) => {
      const e = this.state(t.entity), i = $(e), s = e?.state === "on", a = e?.attributes.device_class, r = i ? s ? a === "moisture" ? "Water detected" : a === "opening" || a === "door" || a === "window" ? "Open" : "Detected" : a === "moisture" ? "Dry" : a === "opening" || a === "door" || a === "window" ? "Closed" : "Clear" : "Unavailable", p = this.state(t.battery), l = $(p) ? m(p.state) : void 0;
      return o`<button
          class="sensor"
          @click=${() => this.moreInfo(t.entity)}
        >
          <div class="sensor-head">
            <span
              class=${`sensor-symbol ${i ? s ? "bad" : "" : "unknown"}`}
              >${g(i ? s ? "warn" : a === "moisture" ? "drop" : "shield" : "warn")}</span
            ><span class="sensor-state">${r}</span>
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
    </div>` : o`<div class="notice">
        Add your water, smoke, or opening sensors in the card editor. Their
        actual state will appear here.
      </div>`;
  }
  favorites() {
    return this.config.favorites?.length ? o`<div class="section-top">
        <h2>Your shortcuts</h2>
        <small>A little less effort.</small>
      </div>
      <div class="favorites">
        ${this.config.favorites.map((t) => o`<signal-control
            .hass=${this.hass}
            .configuration=${{ type: "custom:signal-control", entity: t, appearance: this.dark ? "dark" : "light" }}
          ></signal-control>`)}
      </div>` : d;
  }
  graphs() {
    return this.config.graphs?.length ? o`<div class="section-top">
        <h2>The bigger picture</h2>
        <small>Explore your history.</small>
      </div>
      <div class="grid">
        ${this.config.graphs.map((t, e) => {
      const i = typeof t == "string" ? { entity: t } : t;
      return o`<signal-graph
            .hass=${this.hass}
            .configuration=${{ ...i, type: "custom:signal-graph", accent: e % 2 ? "mint" : "lilac", appearance: this.dark ? "dark" : "light" }}
          ></signal-graph>`;
    })}
      </div>` : d;
  }
  content() {
    return this.tab === "climate" ? o`<div class="grid detail-grid">
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
        ${this.graphs()}` : this.tab === "safety" ? o`${this.safety()}
        <div class="notice" style="margin-top:20px">
          ${this.safetySummary.alarm ? "A sensor is reporting an active state. Open it for details." : this.safetySummary.unknown ? "An unavailable sensor cannot confirm the condition of its space." : "Tap any sensor for its history and details."}
        </div>` : this.tab === "lists" ? o`<div style="max-width:740px">${this.grocery(!0)}</div>` : this.narrow ? this.pocketOverview() : o`<div class="grid">
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
    const t = this.state(this.config.climate), e = t?.attributes || {}, i = $(t), s = this.state(this.config.weather), a = s?.attributes || {}, r = $(s), p = this.hass.config?.unit_system?.temperature || "°", l = m(
      this.state(this.config.humidity)?.state ?? e.current_humidity
    ), c = this.safetySummary, u = i ? t.state === "off" ? "Climate is off" : t.state === "heat_cool" ? `Heat ${this.format(e.target_temp_low)}° · Cool ${this.format(e.target_temp_high)}°` : `${vt[t.state] || k(t.state)} · Target ${this.format(e.temperature)}°` : this.config.climate ? "Controls unavailable" : "Choose a climate entity in the editor", h = this.state(this.config.todo), x = $(h) ? m(h.state) : void 0;
    return o`<div class="pocket-overview">
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
              >${p}</small
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
            >${r ? this.format(a.temperature) : "—"}<small
              >${a.temperature_unit || p}</small
            ></span
          ><span class="tile-bottom"
            ><span class="tile-caption"
              >${r ? k(s.state) : this.config.weather ? "Unavailable" : "Choose weather in editor"}</span
            >${g("arrow")}</span
          >
        </button>
        <button
          class="pocket-tile list-tile apricot"
          aria-label="Open groceries"
          @click=${() => this.navigate("lists")}
        >
          <span class="tile-top"
            ><span class="tile-label">Groceries</span>${g("list")}</span
          ><span class="pocket-reading"
            >${x === void 0 ? "—" : x}<small
              >${x === 1 ? "item" : "items"}</small
            ></span
          ><span class="tile-bottom"
            ><span class="tile-caption"
              >${this.todoError ? "Tap to retry" : x === void 0 ? "Open your list" : x === 0 ? "All caught up" : this.todos[0]?.summary || "Ready when you are"}</span
            >${g("arrow")}</span
          >
        </button>
      </div>
      <button
        class=${`home-signal ${c.alarm ? "attention" : c.unknown ? "uncertain" : ""}`}
        @click=${() => this.navigate("safety")}
        aria-label=${`Home status: ${c.text}`}
      >
        <span class="signal-symbol"
          >${g(c.alarm || c.unknown ? "warn" : "shield")}</span
        ><span
          ><strong>${c.text}</strong
          ><small
            >${c.alarm ? "Take a closer look" : c.unknown ? "Some spaces cannot be checked" : this.sensors.length ? "Your sensors, together" : "Choose sensors in the editor"}</small
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
  render() {
    if (!this.hass)
      return o`<div class="notice" role="status">Connecting to home…</div>`;
    const t = /* @__PURE__ */ new Date(), e = t.getHours(), i = this.config.greeting || `Good ${e < 12 ? "morning" : e < 18 ? "afternoon" : "evening"}.`, s = this.tab === "home" ? i : this.tab === "climate" ? "Just your temperature." : this.tab === "safety" ? "Peace of mind." : "Good things, listed.", a = this.tab === "home" ? "Your home, at a glance." : this.tab === "climate" ? "Find your comfortable." : this.tab === "safety" ? "A clear view of the things that matter." : "A little space for everyday essentials.", r = this.safetySummary, p = new URL(location.href);
    p.searchParams.set("disable_km", ""), p.hash = "";
    const l = this.sensors.find((c) => c.entity === this.detailEntity);
    return o`<div
      class=${`app ${this.dark ? "dark" : ""} ${this.config.immersive && !new URLSearchParams(location.search).has("disable_km") ? "immersive" : ""} ${this.tab === "home" ? "overview-page" : ""}`}
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
      <main>
        <header>
          <div class="eyebrow">
            ${this.config.title || "Home"}
            <span style="color:var(--muted);font-weight:400"
              >/ ${Y.find((c) => c.id === this.tab)?.name}</span
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
              ${g(this.dark ? "sun" : "moon")}
            </button>
            <button
              class="icon-button"
              aria-label="Open Signal menu"
              @click=${() => this.menuOpen = !0}
            >
              ${g("settings")}
            </button>
          </div>
        </header>
        <div class="page-heading">
          <div>
            <h1>${s}</h1>
            <p class="intro">${a}</p>
          </div>
          <div class=${`status-pill ${r.alarm ? "alert" : ""}`}>
            <span class="dot"></span>${r.text}
          </div>
        </div>
        ${ft(this.tab, o`<div class="page">${this.content()}</div>`)}
        <footer class="footer">
          <span
            >Signal Home <span style="opacity:.5">/</span> made for living</span
          ><button @click=${this.resetAppearance}>Reset appearance</button>
        </footer>
      </main>
      ${this.nav(!0)}${this.message ? o`<div class="toast" role="status">${this.message}</div>` : d}
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
          <button @click=${this.toggleAppearance}>
            ${g(this.dark ? "sun" : "moon")}<span
              >${this.dark ? "Light appearance" : "Dark appearance"}<small
                >Make yourself comfortable</small
              ></span
            >
          </button>
          <a href="/profile"
            >${g("home")}<span
              >Account & sign out<small>Your profile and session</small></span
            >${g("arrow")}</a
          >
          ${this.hass.user?.is_admin ? o`<a href="/config/dashboard"
                  >${g("settings")}<span
                    >Home Assistant settings<small
                      >Devices, integrations, and administration</small
                    ></span
                  >${g("arrow")}</a
                >` : d}
          <a
            href=${p.pathname + p.search}
            @click=${(c) => {
      c.preventDefault(), c.stopPropagation(), window.location.assign(p.pathname + p.search);
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
      <signal-details
        .hass=${this.hass}
        .entity=${this.detailEntity}
        .dark=${this.dark}
        .name=${this.detailEntity === this.config.climate ? "Climate" : this.detailEntity === this.config.weather ? "Weather" : l?.name || ""}
        .battery=${l?.battery || ""}
        .custom=${!!this.detailEntity && [this.config.climate, this.config.weather].includes(this.detailEntity)}
        @signal-close=${() => this.detailEntity = ""}
      >
        ${this.detailEntity === this.config.climate ? o`<div class="sheet-custom">
                ${this.climate(!0)}${this.message ? o`<p role="status">${this.message}</p>` : d}${this.graphs()}
              </div>` : this.detailEntity === this.config.weather ? o`<div class="sheet-custom">
                  ${this.weather(!0)}
                  <p class="intro">
                    Current conditions from your weather provider.
                  </p>
                </div>` : d}
      </signal-details>
    </div>`;
  }
}
customElements.get("signal-home") || customElements.define("signal-home", de);
const Z = window;
Z.customCards = Z.customCards || [];
Z.customCards.push({
  type: "signal-home",
  name: "Signal Home",
  description: "A colorful, fluid home dashboard with climate, weather, groceries and safety.",
  preview: !0,
  documentationURL: "https://github.com/gkgkgkgk/signal-home"
});
Z.customCards.push(
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
  de as SignalHome
};
