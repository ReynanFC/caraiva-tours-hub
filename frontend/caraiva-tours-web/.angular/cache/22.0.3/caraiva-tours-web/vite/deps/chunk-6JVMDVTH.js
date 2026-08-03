import {
  A,
  B,
  F,
  G,
  H,
  J,
  K,
  N,
  Q,
  Z,
  ae,
  c,
  fe,
  l,
  p,
  s,
  v,
  x
} from "./chunk-P76MA2VQ.js";

// node_modules/@primeuix/styled/dist/index.mjs
var nt = Object.defineProperty;
var ot = Object.defineProperties;
var it = Object.getOwnPropertyDescriptors;
var te = Object.getOwnPropertySymbols;
var Se = Object.prototype.hasOwnProperty;
var Oe = Object.prototype.propertyIsEnumerable;
var ye = (e, t, s2) => t in e ? nt(e, t, { enumerable: true, configurable: true, writable: true, value: s2 }) : e[t] = s2;
var y = (e, t) => {
  for (var s2 in t || (t = {})) Se.call(t, s2) && ye(e, s2, t[s2]);
  if (te) for (var s2 of te(t)) Oe.call(t, s2) && ye(e, s2, t[s2]);
  return e;
};
var C = (e, t) => ot(e, it(t));
var V = (e, t) => {
  var s2 = {};
  for (var r in e) Se.call(e, r) && t.indexOf(r) < 0 && (s2[r] = e[r]);
  if (e != null && te) for (var r of te(e)) t.indexOf(r) < 0 && Oe.call(e, r) && (s2[r] = e[r]);
  return s2;
};
function xe(e, ...t) {
  return F(e, ...t);
}
var ct = v();
var R = ct;
var P = /{([^}]*)}/g;
var re = /(\d+\s+[+*/-]\s+\d+)/g;
var ne = /var\([^)]+\)/g;
function K2(e) {
  return c(e) ? e.replace(/[A-Z]/g, (t, s2) => s2 === 0 ? t : "." + t.toLowerCase()).toLowerCase() : e;
}
function zt(e, t) {
  A(e) ? e.push(...t || []) : s(e) && Object.assign(e, t);
}
function Pe(e) {
  return s(e) && Object.prototype.hasOwnProperty.call(e, "$value") && Object.prototype.hasOwnProperty.call(e, "$type") ? e.$value : e;
}
function Gt(e, t = "") {
  return ["opacity", "z-index", "line-height", "font-weight", "flex", "flex-grow", "flex-shrink", "order"].some((r) => t.endsWith(r)) ? e : `${e}`.trim().split(" ").map((i) => Z(i) ? `${i}px` : i).join(" ");
}
function pt(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function oe(e = "", t = "") {
  return pt(`${c(e, false) && c(t, false) ? `${e}-` : e}${t}`);
}
function ce(e = "", t = "") {
  return `--${oe(e, t)}`;
}
function gt(e = "") {
  let t = (e.match(/{/g) || []).length, s2 = (e.match(/}/g) || []).length;
  return (t + s2) % 2 !== 0;
}
function L(e, t = "", s2 = "", r = [], o) {
  if (c(e)) {
    let i = e.trim();
    if (gt(i)) return;
    if (H(i, P)) {
      let n = i.replaceAll(P, (u) => {
        let a = u.replace(/{|}/g, "").split(".").filter((l2) => !r.some((c2) => H(l2, c2)));
        return `var(${ce(s2, fe(a.join("-")))}${l(o) ? `, ${o}` : ""})`;
      });
      return H(n.replace(ne, "0"), re) ? `calc(${n})` : n;
    }
    return i;
  } else if (Z(e)) return e;
}
function It(e = {}, t) {
  if (c(t)) {
    let s2 = t.trim();
    return H(s2, P) ? s2.replaceAll(P, (r) => K(e, r.replace(/{|}/g, ""))) : s2;
  } else if (Z(t)) return t;
}
function $e(e, t, s2) {
  c(t, false) && e.push(`${t}:${s2};`);
}
function j(e, t) {
  return e ? `${e}{${t}}` : "";
}
function ue(e, t) {
  if (e.indexOf("dt(") === -1) return e;
  function s2(n, u) {
    let m = [], a = 0, l2 = "", c2 = null, p2 = 0;
    for (; a <= n.length; ) {
      let g = n[a];
      if ((g === '"' || g === "'" || g === "`") && n[a - 1] !== "\\" && (c2 = c2 === g ? null : g), !c2 && (g === "(" && p2++, g === ")" && p2--, (g === "," || a === n.length) && p2 === 0)) {
        let f = l2.trim();
        f.startsWith("dt(") ? m.push(ue(f, u)) : m.push(r(f)), l2 = "", a++;
        continue;
      }
      g !== void 0 && (l2 += g), a++;
    }
    return m;
  }
  function r(n) {
    let u = n[0];
    if ((u === '"' || u === "'" || u === "`") && n[n.length - 1] === u) return n.slice(1, -1);
    let m = Number(n);
    return isNaN(m) ? n : m;
  }
  let o = [], i = [];
  for (let n = 0; n < e.length; n++) if (e[n] === "d" && e.slice(n, n + 3) === "dt(") i.push(n), n += 2;
  else if (e[n] === ")" && i.length > 0) {
    let u = i.pop();
    i.length === 0 && o.push([u, n]);
  }
  if (!o.length) return e;
  for (let n = o.length - 1; n >= 0; n--) {
    let [u, m] = o[n], a = e.slice(u + 3, m), l2 = s2(a, t), c2 = t(...l2);
    e = e.slice(0, u) + c2 + e.slice(m + 1);
  }
  return e;
}
function ve(e) {
  return e.length === 4 ? `#${e[1]}${e[1]}${e[2]}${e[2]}${e[3]}${e[3]}` : e;
}
function Ce(e) {
  let t = parseInt(e.substring(1), 16), s2 = t >> 16 & 255, r = t >> 8 & 255, o = t & 255;
  return { r: s2, g: r, b: o };
}
function ft(e, t, s2) {
  return `#${e.toString(16).padStart(2, "0")}${t.toString(16).padStart(2, "0")}${s2.toString(16).padStart(2, "0")}`;
}
var Ve = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
var X = (e, t, s2) => {
  if (!Ve.test(e) || !Ve.test(t)) return t;
  e = ve(e), t = ve(t);
  let i = (s2 / 100 * 2 - 1 + 1) / 2, n = 1 - i, u = Ce(e), m = Ce(t), a = Math.round(u.r * i + m.r * n), l2 = Math.round(u.g * i + m.g * n), c2 = Math.round(u.b * i + m.b * n);
  return ft(a, l2, c2);
};
var de = (e, t) => X("#000000", e, t);
var me = (e, t) => X("#ffffff", e, t);
var Re = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
var Tt = (e) => {
  if (H(e, P)) {
    let t = e.replace(/{|}/g, "");
    return Re.reduce((s2, r) => (s2[r] = `{${t}.${r}}`, s2), {});
  }
  return Re.reduce((t, s2, r) => (t[s2] = r <= 5 ? me(e, (5 - r) * 19) : de(e, (r - 5) * 15), t), {});
};
var St = (e, t) => {
  let s2 = e.split("."), r = "";
  for (let o = 0; o < s2.length; o++) {
    let i = K2(s2[o]);
    t.lastIndex = 0, !t.test(i) && (r = r ? `${r}.${i}` : i);
  }
  return r;
};
var he = (e, t, s2, r, o) => {
  if (typeof e != "string") return e != null ? e : S.getTokenValue(t);
  if (P.lastIndex = 0, !P.test(e)) return e;
  let i = t.slice(0, t.indexOf(".")), n = e.replace(P, (u) => {
    let m = u.slice(1, -1), a = m.indexOf(".");
    if ((a === -1 ? m : m.slice(0, a)) !== i) return u;
    let l2 = S.getTokenValue(m);
    return l2 == null ? u : `${l2}`;
  });
  return L(n, void 0, s2, [r], o);
};
var Ot = (e, t, s2, r) => {
  var l2, c2, p2, g;
  let o = St(e, s2), i = S.tokens, n = i.__strictCache;
  n || (n = /* @__PURE__ */ new Map(), Object.defineProperty(i, "__strictCache", { value: n, enumerable: false, configurable: true }));
  let u = r == null || typeof r != "object", m = u && r != null ? `${t}|${o}|${r}` : `${t}|${o}`, a = u ? n.get(m) : void 0;
  if (a === void 0 && (!u || !n.has(m))) {
    let f = (l2 = i[o]) == null ? void 0 : l2.paths, h = f == null ? void 0 : f.find((k) => k.scheme === "none"), d = (c2 = f == null ? void 0 : f.find((k) => k.scheme === "light")) != null ? c2 : h, T = (p2 = f == null ? void 0 : f.find((k) => k.scheme === "dark")) != null ? p2 : h;
    if (d && T && d !== T) {
      let k = he(d.value, o, t, s2, r), b = he(T.value, o, t, s2, r);
      a = k === b ? k : `light-dark(${k},${b})`;
    } else a = he((g = d != null ? d : T) == null ? void 0 : g.value, o, t, s2, r);
    u && n.set(m, a);
  }
  return S.hasScopedTokenPath(o) ? L(`{${o}}`, void 0, t, [s2], a) : a;
};
var us = (e) => {
  var i, n, u;
  let t = S.getTheme(), s2 = `${(i = pe(t, e, void 0, "variable")) != null ? i : ""}`, r = (u = (n = s2.match(/--[\w-]+/g)) == null ? void 0 : n[0]) != null ? u : "", o = pe(t, e, void 0, "value");
  return { name: r, variable: s2, value: o };
};
var N2 = (e, t, s2) => pe(S.getTheme(), e, t, s2);
var pe = (e = {}, t, s2, r) => {
  var m, a, l2, c2, p2, g, f, h, d, T;
  if (!t) return "";
  let o = (m = S.defaults) == null ? void 0 : m.variable, i = (p2 = (a = e == null ? void 0 : e.options) == null ? void 0 : a.prefix) != null ? p2 : (c2 = (l2 = S.defaults) == null ? void 0 : l2.options) == null ? void 0 : c2.prefix, n = (T = (d = (g = e == null ? void 0 : e.options) == null ? void 0 : g.cssVariables) != null ? d : (h = (f = S.defaults) == null ? void 0 : f.options) == null ? void 0 : h.cssVariables) != null ? T : true;
  if (r === "value") return S.getTokenValue(t);
  if (p(r) && !n) return Ot(t, i, o.excludedKeyRegex, s2);
  let u = H(t, P) ? t : `{${t}}`;
  return L(u, void 0, i, [o.excludedKeyRegex], s2);
};
var xt = (...e) => {
  var t;
  return `${(t = N2(...e)) != null ? t : ""}`;
};
function gs(e, ...t) {
  if (e instanceof Array) {
    let s2 = e.reduce((r, o, i) => {
      var n;
      return r + o + ((n = x(t[i], { dt: N2 })) != null ? n : "");
    }, "");
    return ue(s2, xt);
  }
  return x(e, { dt: N2 });
}
var A2 = (e = {}) => {
  let { preset: t, options: s2 } = e;
  return { preset(r) {
    return t = t ? Q(t, r) : r, this;
  }, options(r) {
    return s2 = s2 ? y(y({}, s2), r) : r, this;
  }, primaryPalette(r) {
    let { semantic: o } = t || {};
    return t = C(y({}, t), { semantic: C(y({}, o), { primary: r }) }), this;
  }, surfacePalette(r) {
    var m, a, l2;
    let o = (m = t == null ? void 0 : t.semantic) != null ? m : {}, i = r && Object.hasOwn(r, "light") ? r.light : r, n = r && Object.hasOwn(r, "dark") ? r.dark : r, u = { colorScheme: { light: y(y({}, (a = o.colorScheme) == null ? void 0 : a.light), !!i && { surface: i }), dark: y(y({}, (l2 = o.colorScheme) == null ? void 0 : l2.dark), !!n && { surface: n }) } };
    return t = C(y({}, t), { semantic: y(y({}, o), u) }), this;
  }, define({ useDefaultPreset: r = false, useDefaultOptions: o = false } = {}) {
    return { preset: r ? S.getPreset() : t, options: o ? S.getOptions() : s2 };
  }, update({ mergePresets: r = true, mergeOptions: o = true } = {}) {
    let i = { preset: r ? Q(S.getPreset(), t != null ? t : {}) : t, options: o ? y(y({}, S.getOptions()), s2) : s2 };
    return S.setTheme(i), i;
  }, use(r) {
    let o = this.define(r);
    return S.setTheme(o), o;
  } };
};
function ge(e, t = {}) {
  let s2 = S.defaults.variable, { prefix: r = s2.prefix, selector: o = s2.selector, excludedKeyRegex: i = s2.excludedKeyRegex } = t, n = [], u = [], m = [{ node: e, path: r }];
  for (; m.length; ) {
    let { node: l2, path: c2 } = m.pop();
    for (let p2 in l2) {
      let g = l2[p2], f = Pe(g), d = H(p2, i) ? oe(c2) : oe(c2, fe(p2));
      if (s(f)) m.push({ node: f, path: d });
      else {
        let T = ce(d), k = L(f, d, r, [i]);
        $e(u, T, k == null ? k : `${k}`);
        let b = d;
        r && b.startsWith(r + "-") && (b = b.slice(r.length + 1)), n.push(b.replace(/-/g, "."));
      }
    }
  }
  let a = u.join("");
  return { value: u, tokens: n, declarations: a, css: j(o, a) };
}
var $ = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(e) {
  return { type: "class", selector: e, matched: this.pattern.test(e.trim()) };
} }, attr: { pattern: /^\[(.*)\]$/, resolve(e) {
  return { type: "attr", selector: `:root${e},:host${e}`, matched: this.pattern.test(e.trim()) };
} }, media: { pattern: /^@media (.*)$/, resolve(e) {
  return { type: "media", selector: e, matched: this.pattern.test(e.trim()) };
} }, system: { pattern: /^system$/, resolve(e) {
  return { type: "system", selector: "@media (prefers-color-scheme: dark)", matched: this.pattern.test(e.trim()) };
} }, custom: { resolve(e) {
  return { type: "custom", selector: e, matched: true };
} } }, resolve(e) {
  let t = Object.keys(this.rules).filter((s2) => s2 !== "custom").map((s2) => this.rules[s2]);
  return [e].flat().map((s2) => {
    var r;
    return (r = t.map((o) => o.resolve(s2)).find((o) => o.matched)) != null ? r : this.rules.custom.resolve(s2);
  });
} }, _toVariables(e, t) {
  return ge(e, { prefix: t == null ? void 0 : t.prefix });
}, getCommon({ name: e = "", theme: t = {}, params: s2, set: r, defaults: o }) {
  var k, b, O, v2, E, _, w;
  let { preset: i, options: n } = t, u, m, a, l2, c2, p2, g;
  if (l(i)) {
    let { primitive: z, semantic: G2, extend: I } = i, f = G2 || {}, { colorScheme: ae2 } = f, U = V(f, ["colorScheme"]), h = I || {}, { colorScheme: H2 } = h, M = V(h, ["colorScheme"]), d = ae2 || {}, { dark: B2 } = d, W = V(d, ["dark"]), T = H2 || {}, { dark: q } = T, F2 = V(T, ["dark"]), Z2 = l(z) ? this._toVariables({ primitive: z }, n) : {}, J2 = l(U) ? this._toVariables({ semantic: U }, n) : {}, Q2 = l(W) ? this._toVariables({ light: W }, n) : {}, Y = l(B2) ? this._toVariables({ dark: B2 }, n) : {}, ee = l(M) ? this._toVariables({ semantic: M }, n) : {}, Te = l(F2) ? this._toVariables({ light: F2 }, n) : {}, be = l(q) ? this._toVariables({ dark: q }, n) : {}, [Ke, Xe] = [(k = Z2.declarations) != null ? k : "", Z2.tokens], [ze, Ge] = [(b = J2.declarations) != null ? b : "", J2.tokens || []], [Ie, Ue] = [(O = Q2.declarations) != null ? O : "", Q2.tokens || []], [He, We] = [(v2 = Y.declarations) != null ? v2 : "", Y.tokens || []], [qe, Fe] = [(E = ee.declarations) != null ? E : "", ee.tokens || []], [Ze, Je] = [(_ = Te.declarations) != null ? _ : "", Te.tokens || []], [Qe, Ye] = [(w = be.declarations) != null ? w : "", be.tokens || []];
    u = this.transformCSS(e, Ke, "light", "variable", n, r, o), m = Xe;
    let et = this.transformCSS(e, `${ze}${Ie}`, "light", "variable", n, r, o), tt = this.transformCSS(e, `${He}`, "dark", "variable", n, r, o);
    a = `${et}${tt}`, l2 = [.../* @__PURE__ */ new Set([...Ge, ...Ue, ...We])];
    let st = this.transformCSS(e, `${qe}${Ze}color-scheme:light`, "light", "variable", n, r, o), rt = this.transformCSS(e, `${Qe}color-scheme:dark`, "dark", "variable", n, r, o);
    c2 = `${st}${rt}`, p2 = [.../* @__PURE__ */ new Set([...Fe, ...Je, ...Ye])], g = x(i.css, { dt: N2 });
  }
  return { primitive: { css: u, tokens: m }, semantic: { css: a, tokens: l2 }, global: { css: c2, tokens: p2 }, style: g };
}, getPreset({ name: e = "", preset: t = {}, options: s2, params: r, set: o, defaults: i, selector: n, isScopedTokenPaths: u }) {
  var c2, d, T, k;
  let m, a, l2;
  if (l(t) && ((c2 = s2 == null ? void 0 : s2.cssVariables) == null || c2 || u)) {
    let b = e.replace("-directive", ""), p2 = t, { colorScheme: O, extend: v2, css: E } = p2, _ = V(p2, ["colorScheme", "extend", "css"]), g = v2 || {}, { colorScheme: w } = g, z = V(g, ["colorScheme"]), f = O || {}, { dark: G2 } = f, I = V(f, ["dark"]), h = w || {}, { dark: ae2 } = h, U = V(h, ["dark"]), H2 = l(_) ? this._toVariables({ [b]: y(y({}, _), z) }, s2) : {}, M = l(I) ? this._toVariables({ [b]: y(y({}, I), U) }, s2) : {}, B2 = l(G2) ? this._toVariables({ [b]: y(y({}, G2), ae2) }, s2) : {}, [W, q] = [(d = H2.declarations) != null ? d : "", H2.tokens || []], [F2, Z2] = [(T = M.declarations) != null ? T : "", M.tokens || []], [J2, Q2] = [(k = B2.declarations) != null ? k : "", B2.tokens || []], Y = this.transformCSS(b, `${W}${F2}`, "light", "variable", s2, o, i, n), ee = this.transformCSS(b, J2, "dark", "variable", s2, o, i, n);
    m = `${Y}${ee}`, a = [.../* @__PURE__ */ new Set([...q, ...Z2, ...Q2])], l2 = x(E, { dt: N2 });
  }
  return { css: m, tokens: a, style: l2 };
}, getScopedSelector(e, t) {
  if (!(!(t != null && t.scoped) || !e)) return `[data-styled="${e}"]`;
}, getPresetC({ name: e = "", theme: t = {}, params: s2, set: r, defaults: o }) {
  var a;
  let { preset: i, options: n } = t, u = (a = i == null ? void 0 : i.components) == null ? void 0 : a[e], m = this.getScopedSelector(e, n);
  return this.getPreset({ name: e, preset: u, options: n, params: s2, set: r, defaults: o, selector: m });
}, getPresetD({ name: e = "", theme: t = {}, params: s2, set: r, defaults: o }) {
  var l2, c2;
  let i = e.replace("-directive", ""), { preset: n, options: u } = t, m = ((l2 = n == null ? void 0 : n.components) == null ? void 0 : l2[i]) || ((c2 = n == null ? void 0 : n.directives) == null ? void 0 : c2[i]), a = this.getScopedSelector(i, u);
  return this.getPreset({ name: i, preset: m, options: u, params: s2, set: r, defaults: o, selector: a });
}, applyDarkColorScheme(e) {
  let t = e.darkModeSelector;
  return !(t === "none" || t === false);
}, getColorSchemeOption(e, t) {
  var s2;
  return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === true ? t.options.darkModeSelector : (s2 = e.darkModeSelector) != null ? s2 : t.options.darkModeSelector) : [];
}, getLayerOrder(e, t = {}, s2, r) {
  let { cssLayer: o } = t;
  return o ? `@layer ${x(o.order || o.name || "primeui", s2)}` : "";
}, getCommonStyleSheet({ name: e = "", theme: t = {}, params: s2, props: r = {}, set: o, defaults: i }) {
  let n = this.getCommon({ name: e, theme: t, params: s2, set: o, defaults: i }), u = Object.entries(r).reduce((m, [a, l2]) => (m.push(`${a}="${G(l2)}"`), m), []).join(" ");
  return Object.entries(n || {}).reduce((m, [a, l2]) => {
    if (s(l2) && Object.hasOwn(l2, "css")) {
      let c2 = B(l2.css), p2 = `${a}-variables`;
      m.push(`<style type="text/css" data-primevue-style-id="${p2}" ${u}>${c2}</style>`);
    }
    return m;
  }, []).join("");
}, getStyleSheet({ name: e = "", theme: t = {}, params: s2, props: r = {}, set: o, defaults: i }) {
  var a;
  let n = { name: e, theme: t, params: s2, set: o, defaults: i }, u = (a = e.includes("-directive") ? this.getPresetD(n) : this.getPresetC(n)) == null ? void 0 : a.css, m = Object.entries(r).reduce((l2, [c2, p2]) => (l2.push(`${c2}="${G(p2)}"`), l2), []).join(" ");
  return u ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${m}>${B(u)}</style>` : "";
}, createTokens(e = {}, t, s2 = "", r = "", o = {}) {
  let i = function(a, l2, c2, p2) {
    return a.replace(P, (g) => {
      var T;
      let f = g.slice(1, -1), h = this.tokens[f];
      if (!h) return console.warn(`Token not found for path: ${f}`), "__UNRESOLVED__";
      let d = h.computed(l2, c2, p2);
      if (Array.isArray(d) && d.length === 2) {
        let k = d[0].value, b = d[1].value;
        return k === b ? k != null ? k : "__UNRESOLVED__" : `light-dark(${k},${b})`;
      }
      return (T = d == null ? void 0 : d.value) != null ? T : "__UNRESOLVED__";
    });
  }, n = function(a, l2, c2, p2) {
    if (a.indexOf("light-dark(") === -1) return a;
    let g = [], f = a.length, h = 0;
    for (; h < f; ) {
      let d = a.indexOf("light-dark(", h);
      if (d === -1) {
        g.push(a.slice(h));
        break;
      }
      g.push(a.slice(h, d));
      let T = 1, k = d + 11, b = -1;
      for (; k < f && T > 0; ) {
        let _ = a.charCodeAt(k);
        _ === 40 ? T++ : _ === 41 ? T-- : _ === 44 && T === 1 && b === -1 && (b = k), k++;
      }
      if (T !== 0 || b === -1) {
        g.push(a.slice(d));
        break;
      }
      let O = a.slice(d + 11, b).trim(), v2 = a.slice(b + 1, k - 1).trim(), E = l2 && l2 !== "none" ? l2 : null;
      if (E === "light") g.push(n.call(this, O, "light", c2, p2));
      else if (E === "dark") g.push(n.call(this, v2, "dark", c2, p2));
      else {
        let _ = i.call(this, n.call(this, O, "light", c2, p2), "light", c2, p2), w = i.call(this, n.call(this, v2, "dark", c2, p2), "dark", c2, p2);
        g.push(_ === w ? _ : `light-dark(${_},${w})`);
      }
      h = k;
    }
    return g.join("");
  }, u = function(a, l2 = {}, c2 = []) {
    if (c2.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: a, path: this.path, paths: l2, value: void 0 };
    c2.push(this.path), l2.name = this.path, l2.binding || (l2.binding = {});
    let p2 = this.value;
    if (typeof this.value == "string") {
      let g = this.value.trim(), f = g.indexOf("light-dark(") !== -1, h = g.indexOf("{") !== -1;
      if (f || h) {
        let d = f ? n.call(this, g, a, l2, c2) : g, T = d.indexOf("{") !== -1 ? i.call(this, d, a, l2, c2) : d;
        re.lastIndex = 0, ne.lastIndex = 0, p2 = re.test(T.replace(ne, "0")) ? `calc(${T})` : T;
      }
    }
    return p(l2.binding) && delete l2.binding, c2.pop(), { colorScheme: a, path: this.path, paths: l2, value: typeof p2 == "string" && p2.indexOf("__UNRESOLVED__") !== -1 ? void 0 : p2 };
  }, m = (a, l2, c2) => {
    Object.entries(a).forEach(([p2, g]) => {
      let f = H(p2, t.variable.excludedKeyRegex) ? l2 : l2 ? `${l2}.${K2(p2)}` : K2(p2), h = c2 ? `${c2}.${p2}` : p2;
      s(g) ? m(g, f, h) : (o[f] || (o[f] = { paths: [], computed: (d, T = {}, k = []) => {
        let b = o[f].paths;
        if (b.length === 1) {
          let O = b[0], v2 = O.scheme !== "none" ? O.scheme : d;
          return O.computed(v2, T.binding, k);
        } else if (d && d !== "none") for (let O = 0; O < b.length; O++) {
          let v2 = b[O];
          if (v2.scheme === d) return v2.computed(d, T.binding, k);
        }
        return b.map((O) => O.computed(O.scheme, T[O.scheme], k));
      } }), o[f].paths.push({ path: h, value: g, scheme: h.includes("colorScheme.light") ? "light" : h.includes("colorScheme.dark") ? "dark" : "none", computed: u, tokens: o }));
    });
  };
  return m(e, s2, r), o;
}, getTokenValue(e, t, s2) {
  var p2, g, f;
  let r = e.__cache;
  r || (r = /* @__PURE__ */ new Map(), Object.defineProperty(e, "__cache", { value: r, enumerable: false, configurable: true }));
  let o = r.get(t);
  if (o !== void 0 || r.has(t)) return o;
  let i = s2.variable.excludedKeyRegex, n = t.split("."), u = [];
  for (let h = 0; h < n.length; h++) {
    let d = n[h];
    i.lastIndex = 0, i.test(d.toLowerCase()) || u.push(d);
  }
  let m = u.join("."), a = t.indexOf("colorScheme.light") !== -1 ? "light" : t.indexOf("colorScheme.dark") !== -1 ? "dark" : void 0, l2 = e[m];
  if (!l2) {
    r.set(t, void 0);
    return;
  }
  let c2;
  if (a) {
    let h = l2.computed(a);
    if (Array.isArray(h)) {
      for (let d = 0; d < h.length; d++) if (((p2 = h[d]) == null ? void 0 : p2.colorScheme) === a) {
        c2 = h[d].value;
        break;
      }
    } else c2 = h == null ? void 0 : h.value;
  } else {
    let h = l2.computed("light"), d = l2.computed("dark"), T, k;
    if (Array.isArray(h)) {
      for (let b = 0; b < h.length; b++) if (((g = h[b]) == null ? void 0 : g.colorScheme) === "light") {
        T = h[b].value;
        break;
      }
    } else T = h == null ? void 0 : h.value;
    if (Array.isArray(d)) {
      for (let b = 0; b < d.length; b++) if (((f = d[b]) == null ? void 0 : f.colorScheme) === "dark") {
        k = d[b].value;
        break;
      }
    } else k = d == null ? void 0 : d.value;
    T === void 0 && k === void 0 ? c2 = void 0 : T === void 0 ? c2 = k : k === void 0 || T === k ? c2 = T : c2 = `light-dark(${T},${k})`;
  }
  return r.set(t, c2), c2;
}, getSelectorRule(e, t, s2, r, o = ":root,:host") {
  return s2 === "class" || s2 === "attr" ? j(l(t) ? `${e}${t},${e} ${t}` : e, r) : j(e, j(t != null ? t : o, r));
}, transformCSS(e, t, s2, r, o = {}, i, n, u) {
  var m, a;
  if (l(t)) {
    let { cssLayer: l2 } = o;
    if (r !== "style") {
      let c2 = this.getColorSchemeOption(o, n), p2 = (a = (m = n == null ? void 0 : n.variable) == null ? void 0 : m.selector) != null ? a : ":root,:host";
      t = s2 === "dark" ? c2.reduce((g, { type: f, selector: h }) => (l(h) && (g += h.includes("[CSS]") ? h.replace("[CSS]", t) : this.getSelectorRule(h, u, f, t, p2)), g), "") : j(u != null ? u : p2, t);
    }
    if (l2) {
      let c2 = { name: "primeui", order: "primeui" };
      s(l2) && (c2.name = x(l2.name, { name: e, type: r })), l(c2.name) && (t = j(`@layer ${c2.name}`, t), i == null || i.layerNames(c2.name));
    }
    return t;
  }
  return "";
} };
var S = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: false, cssVariables: true, scoped: false } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, _scopedTokenPaths: /* @__PURE__ */ new Set(), update(e = {}) {
  let { theme: t } = e;
  t && (this._theme = C(y({}, t), { options: y(y({}, this.defaults.options), t.options) }), this._tokens = $.createTokens(this.preset, this.defaults), this.resetCaches());
}, get theme() {
  return this._theme;
}, get preset() {
  var e;
  return ((e = this.theme) == null ? void 0 : e.preset) || {};
}, get options() {
  var e;
  return ((e = this.theme) == null ? void 0 : e.options) || {};
}, get tokens() {
  return this._tokens;
}, hasScopedTokenPath(e) {
  return this._scopedTokenPaths.has(e);
}, getScopedTokenPaths() {
  return [...this._scopedTokenPaths];
}, addScopedToken(e) {
  let t = false;
  return e && Object.keys(e).length && N(e).forEach((s2) => {
    let r = ae(s2);
    this._scopedTokenPaths.has(r) || (this._scopedTokenPaths.add(r), t = true);
  }), t;
}, clearScopedTokenPaths() {
  this._scopedTokenPaths.clear();
}, getTheme() {
  return this.theme;
}, setTheme(e) {
  this.update({ theme: e }), R.emit("theme:change", e);
}, getPreset() {
  return this.preset;
}, setPreset(e) {
  this._theme = C(y({}, this.theme), { preset: e }), this._tokens = $.createTokens(e, this.defaults), this.resetCaches(), R.emit("preset:change", e), R.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(e) {
  this._theme = C(y({}, this.theme), { options: e }), this.resetStyleCaches(), R.emit("options:change", e), R.emit("theme:change", this.theme);
}, resetStyleCaches() {
  this.clearLoadedStyleNames(), this.clearLayerNames();
}, resetCaches() {
  this.resetStyleCaches(), this.clearScopedTokenPaths();
}, getLayerNames() {
  return [...this._layerNames];
}, setLayerNames(e) {
  this._layerNames.add(e);
}, clearLayerNames() {
  this._layerNames.clear();
}, getLoadedStyleNames() {
  return this._loadedStyleNames;
}, isStyleNameLoaded(e) {
  return this._loadedStyleNames.has(e);
}, setLoadedStyleName(e) {
  this._loadedStyleNames.add(e);
}, deleteLoadedStyleName(e) {
  this._loadedStyleNames.delete(e);
}, clearLoadedStyleNames() {
  this._loadedStyleNames.clear();
}, getTokenValue(e) {
  return $.getTokenValue(this.tokens, e, this.defaults);
}, getCommon(e = "", t) {
  return $.getCommon({ name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(e = "", t) {
  let s2 = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return $.getPresetC(s2);
}, getDirective(e = "", t) {
  let s2 = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return $.getPresetD(s2);
}, getCustomPreset(e = "", t, s2, r) {
  let o = { name: e, preset: t, options: this.options, selector: s2, params: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) }, isScopedTokenPaths: true };
  return $.getPreset(o);
}, getLayerOrderCSS(e = "") {
  return $.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(e = "", t, s2 = "style", r) {
  return $.transformCSS(e, t, r, s2, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(e = "", t, s2 = {}) {
  return $.getCommonStyleSheet({ name: e, theme: this.theme, params: t, props: s2, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(e, t, s2 = {}) {
  return $.getStyleSheet({ name: e, theme: this.theme, params: t, props: s2, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(e) {
  this._loadingStyles.add(e);
}, onStyleUpdated(e) {
  this._loadingStyles.add(e);
}, onStyleLoaded(e, { name: t }) {
  this._loadingStyles.size && (this._loadingStyles.delete(t), R.emit(`theme:${t}:load`, e), this._loadingStyles.size || R.emit("theme:load"));
} };
function De(...e) {
  let t = F(S.getPreset(), ...e);
  return S.setPreset(t), t;
}
function Le(e) {
  return A2().primaryPalette(e != null ? e : {}).update().preset;
}
function Ae(e) {
  return A2().surfacePalette(e != null ? e : {}).update().preset;
}
function Me(e, ...t) {
  let s2 = F(e, ...t);
  return S.setPreset(s2), s2;
}
function Be(e) {
  return A2(e).update({ mergePresets: false, mergeOptions: false });
}
var ke = class {
  constructor({ attrs: t } = {}) {
    this._styles = /* @__PURE__ */ new Map(), this._attrs = t || {};
  }
  get(t) {
    return this._styles.get(t);
  }
  has(t) {
    return this._styles.has(t);
  }
  delete(t) {
    this._styles.delete(t);
  }
  clear() {
    this._styles.clear();
  }
  add(t, s2) {
    if (l(s2)) {
      let r = { name: t, css: s2, attrs: this._attrs, markup: J(s2, this._attrs) };
      this._styles.set(t, C(y({}, r), { element: this.createStyleElement(r) }));
    }
  }
  update() {
  }
  getStyles() {
    return this._styles;
  }
  getAllCSS() {
    return [...this._styles.values()].map((t) => t.css).filter((t) => !!t);
  }
  getAllMarkup() {
    return [...this._styles.values()].map((t) => t.markup).filter((t) => !!t);
  }
  getAllElements() {
    return [...this._styles.values()].map((t) => t.element);
  }
  createStyleElement(t = {}) {
  }
};
var Dt = ke;

export {
  xe,
  R,
  P,
  re,
  ne,
  K2 as K,
  zt,
  Pe,
  Gt,
  pt,
  oe,
  ce,
  gt,
  L,
  It,
  $e,
  j,
  ue,
  X,
  de,
  me,
  Tt,
  us,
  N2 as N,
  pe,
  gs,
  A2 as A,
  ge,
  $,
  S,
  De,
  Le,
  Ae,
  Me,
  Be,
  Dt
};
//# sourceMappingURL=chunk-6JVMDVTH.js.map
