// node_modules/@primeuix/utils/dist/object/index.mjs
var ce = Object.defineProperty;
var $ = Object.getOwnPropertySymbols;
var pe = Object.prototype.hasOwnProperty;
var ge = Object.prototype.propertyIsEnumerable;
var q = (e, t2, n) => t2 in e ? ce(e, t2, { enumerable: true, configurable: true, writable: true, value: n }) : e[t2] = n;
var E = (e, t2) => {
  for (var n in t2 || (t2 = {})) pe.call(t2, n) && q(e, n, t2[n]);
  if ($) for (var n of $(t2)) ge.call(t2, n) && q(e, n, t2[n]);
  return e;
};
function p(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function O(e, t2, n) {
  if (e === t2 || e !== e && t2 !== t2) return true;
  if (!e || !t2 || typeof e != "object" || typeof t2 != "object") return false;
  n || (n = /* @__PURE__ */ new WeakMap());
  let r = n.get(e);
  if (r != null && r.has(t2)) return true;
  r || n.set(e, r = /* @__PURE__ */ new WeakSet()), r.add(t2);
  let o = Array.isArray(e), u2 = Array.isArray(t2), i2 = true;
  if (o && u2) {
    if (e.length !== t2.length) i2 = false;
    else for (let f = e.length; f-- !== 0; ) if (!O(e[f], t2[f], n)) {
      i2 = false;
      break;
    }
  } else if (o !== u2) i2 = false;
  else {
    let f = e instanceof Date, a = t2 instanceof Date;
    if (f !== a) i2 = false;
    else if (f && a) i2 = e.getTime() === t2.getTime();
    else {
      let y3 = e instanceof RegExp, k2 = t2 instanceof RegExp;
      if (y3 !== k2) i2 = false;
      else if (y3 && k2) i2 = e.toString() === t2.toString();
      else if (e instanceof Map || t2 instanceof Map) {
        if (!(e instanceof Map && t2 instanceof Map) || e.size !== t2.size) i2 = false;
        else for (let [g2, w] of e) if (!t2.has(g2) || !O(w, t2.get(g2), n)) {
          i2 = false;
          break;
        }
      } else if (e instanceof Set || t2 instanceof Set) {
        if (!(e instanceof Set && t2 instanceof Set) || e.size !== t2.size) i2 = false;
        else for (let g2 of e) if (!t2.has(g2)) {
          i2 = false;
          break;
        }
      } else {
        let g2 = Object.keys(e), w = g2.length;
        if (w !== Object.keys(t2).length) i2 = false;
        else {
          for (let h = w; h-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(t2, g2[h])) {
            i2 = false;
            break;
          }
          if (i2) for (let h = w; h-- !== 0; ) {
            let M = g2[h];
            if (!O(e[M], t2[M], n)) {
              i2 = false;
              break;
            }
          }
        }
      }
    }
  }
  return i2 || r.delete(t2), i2;
}
function R(e, t2) {
  return O(e, t2);
}
function m(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function l(e) {
  return !p(e);
}
function d(e, t2) {
  if (!e || !t2) return null;
  let n = e;
  try {
    let r = n[t2];
    if (l(r)) return r;
  } catch (r) {
  }
  if (Object.keys(n).length) {
    if (m(t2)) return t2(e);
    if (t2.indexOf(".") === -1) return n[t2];
    {
      let r = t2.split("."), o = e;
      for (let u2 = 0, i2 = r.length; u2 < i2; ++u2) {
        if (o == null) return null;
        o = o[r[u2]];
      }
      return o;
    }
  }
  return null;
}
function b(e, t2, n) {
  return n ? d(e, n) === d(t2, n) : R(e, t2);
}
function s(e, t2 = true) {
  return e instanceof Object && e.constructor === Object && (t2 || Object.keys(e).length !== 0);
}
var me = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
function S(e, t2, n, r = /* @__PURE__ */ new WeakSet()) {
  let o = E({}, e);
  Object.keys(o).length === 0 && !n.has(t2) && n.set(t2, o);
  let u2 = !r.has(t2);
  return u2 && r.add(t2), Object.keys(t2).forEach((i2) => {
    var y3, k2;
    if (me.has(i2)) return;
    let f = i2, a = t2[f];
    s(a) && f in e && s(e[f]) ? o[f] = r.has(a) ? (y3 = n.get(a)) != null ? y3 : S({}, a, n, r) : S(e[f], a, n, r) : s(a) ? o[f] = (k2 = n.get(a)) != null ? k2 : S({}, a, n, r) : o[f] = a;
  }), u2 && r.delete(t2), o;
}
function F(...e) {
  return e.reduce((t2, n) => S(t2, n || {}, /* @__PURE__ */ new WeakMap()), {});
}
function x(e, ...t2) {
  return m(e) ? e(...t2) : e;
}
function c(e, t2 = true) {
  return typeof e == "string" && (t2 || e !== "");
}
function C(e) {
  return c(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function K(e, t2 = "", n = {}) {
  let r = C(t2).split("."), o = r.shift();
  if (o) {
    if (s(e) || Array.isArray(e)) {
      let u2 = Object.keys(e).find((i2) => C(i2) === o) || "";
      return K(x(e[u2], n), r.join("."), n);
    }
    return;
  }
  return x(e, n);
}
function A(e, t2 = true) {
  return Array.isArray(e) && (t2 || e.length !== 0);
}
function Z(e) {
  return l(e) && !isNaN(e);
}
function H(e, t2) {
  if (t2) {
    t2.lastIndex = 0;
    let n = t2.test(e);
    return t2.lastIndex = 0, n;
  }
  return false;
}
function Q(...e) {
  return F(...e);
}
function de(e, t2) {
  let n = 0;
  for (; t2 - 1 - n >= 0 && e[t2 - 1 - n] === "\\"; ) n++;
  return n % 2 === 1;
}
function X(e) {
  return e.replace(/[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":");
}
function B(e) {
  if (!e) return e;
  let t2 = "", n = "", r = 0;
  for (; r < e.length; ) {
    let o = e[r];
    if (o === "/" && e[r + 1] === "*") {
      let u2 = e.indexOf("*/", r + 2);
      r = u2 === -1 ? e.length : u2 + 2;
    } else if (o === '"' || o === "'") {
      t2 += X(n), n = "";
      let u2 = r + 1;
      for (; u2 < e.length && (e[u2] !== o || de(e, u2)); ) u2++;
      t2 += e.slice(r, Math.min(u2 + 1, e.length)), r = u2 + 1;
    } else n += o, r++;
  }
  return (t2 + X(n)).trim();
}
function N(e = {}, t2 = "") {
  return Object.entries(e).reduce((n, [r, o]) => {
    let u2 = t2 ? `${t2}.${r}` : r;
    return s(o) ? n = n.concat(N(o, u2)) : n.push(u2), n;
  }, []);
}
var xe = /[\xC0-\xFF\u0100-\u017E]/;
var j = { A: /[\xC0-\xC5\u0100\u0102\u0104]/g, AE: /[\xC6]/g, C: /[\xC7\u0106\u0108\u010A\u010C]/g, D: /[\xD0\u010E\u0110]/g, E: /[\xC8-\xCB\u0112\u0114\u0116\u0118\u011A]/g, G: /[\u011C\u011E\u0120\u0122]/g, H: /[\u0124\u0126]/g, I: /[\xCC-\xCF\u0128\u012A\u012C\u012E\u0130]/g, IJ: /[\u0132]/g, J: /[\u0134]/g, K: /[\u0136]/g, L: /[\u0139\u013B\u013D\u013F\u0141]/g, N: /[\xD1\u0143\u0145\u0147\u014A]/g, O: /[\xD2-\xD6\xD8\u014C\u014E\u0150]/g, OE: /[\u0152]/g, R: /[\u0154\u0156\u0158]/g, S: /[\u015A\u015C\u015E\u0160]/g, T: /[\u0162\u0164\u0166]/g, U: /[\xD9-\xDC\u0168\u016A\u016C\u016E\u0170\u0172]/g, W: /[\u0174]/g, Y: /[\xDD\u0176\u0178]/g, Z: /[\u0179\u017B\u017D]/g, a: /[\xE0-\xE5\u0101\u0103\u0105]/g, ae: /[\xE6]/g, c: /[\xE7\u0107\u0109\u010B\u010D]/g, d: /[\u010F\u0111]/g, e: /[\xE8-\xEB\u0113\u0115\u0117\u0119\u011B]/g, g: /[\u011D\u011F\u0121\u0123]/g, i: /[\xEC-\xEF\u0129\u012B\u012D\u012F\u0131]/g, ij: /[\u0133]/g, j: /[\u0135]/g, k: /[\u0137,\u0138]/g, l: /[\u013A\u013C\u013E\u0140\u0142]/g, n: /[\xF1\u0144\u0146\u0148\u014B]/g, p: /[\xFE]/g, o: /[\xF2-\xF6\xF8\u014D\u014F\u0151]/g, oe: /[\u0153]/g, r: /[\u0155\u0157\u0159]/g, s: /[\u015B\u015D\u015F\u0161]/g, t: /[\u0163\u0165\u0167]/g, u: /[\xF9-\xFC\u0169\u016B\u016D\u016F\u0171\u0173]/g, w: /[\u0175]/g, y: /[\xFD\xFF\u0177]/g, z: /[\u017A\u017C\u017E]/g };
function ee(e) {
  if (e && xe.test(e)) for (let t2 in j) e = e.replace(j[t2], t2);
  return e;
}
function fe(e) {
  return c(e) ? e.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : e;
}
function ae(e) {
  return c(e) ? e.replace(/[A-Z]/g, (t2, n) => n === 0 ? t2 : "." + t2.toLowerCase()).toLowerCase() : e;
}

// node_modules/@primeuix/utils/dist/eventbus/index.mjs
function v() {
  let s3 = /* @__PURE__ */ new Map(), r = { on(n, t2) {
    let e = s3.get(n);
    return e ? e.push(t2) : e = [t2], s3.set(n, e), r;
  }, off(n, t2) {
    let e = s3.get(n);
    if (e) {
      let o = e.indexOf(t2);
      o !== -1 && e.splice(o, 1);
    }
    return r;
  }, emit(n, ...t2) {
    let e = s3.get(n);
    e && e.forEach((o) => {
      o(t2[0]);
    });
  }, clear() {
    s3.clear();
  } };
  return r;
}

// node_modules/@primeuix/utils/dist/dom/index.mjs
function I(t2, e) {
  return t2 ? t2.classList ? t2.classList.contains(e) : new RegExp("(^| )" + e + "( |$)", "gi").test(t2.className) : false;
}
function R2(t2, e) {
  if (t2 && e) {
    let o = (n) => {
      I(t2, n) || (t2.classList ? t2.classList.add(n) : t2.className += " " + n);
    };
    [e].flat().filter(Boolean).forEach((n) => n.split(" ").forEach(o));
  }
}
function W(t2, e) {
  if (t2 && e) {
    let o = (n) => {
      t2.classList ? t2.classList.remove(n) : t2.className = t2.className.replace(new RegExp("(^|\\b)" + n.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [e].flat().filter(Boolean).forEach((n) => n.split(" ").forEach(o));
  }
}
function E2(t2) {
  if (typeof document == "undefined") return null;
  for (let e of Array.from(document.styleSheets || [])) try {
    for (let o of Array.from(e.cssRules || [])) {
      let n = o.style;
      if (n) {
        for (let r of Array.from(n)) if (t2.lastIndex = 0, t2.test(r)) return { name: r, value: n.getPropertyValue(r).trim() };
      }
    }
  } catch (o) {
    continue;
  }
  return null;
}
function S2(t2) {
  return t2 ? Math.abs(t2.scrollLeft) : 0;
}
var pe2 = /expression\s*\(|url\s*\(\s*['"]?\s*(?:javascript|vbscript):|@import\s+['"]?\s*(?:javascript|vbscript|data):/i;
var bt = /url\s*\(\s*['"]?\s*(data:[^'")]*)/gi;
var ce2 = /* @__PURE__ */ new Set(["href", "src", "xlink:href", "action", "formaction"]);
var me2 = /* @__PURE__ */ new Set(["http", "https", "mailto", "tel", "sms", "ftp", "ftps", "blob"]);
var yt = /^data:image\/(?:png|gif|jpeg|jpg|webp|bmp|avif);base64,[a-z0-9+/=\s]+$/i;
function _(t2) {
  if (typeof t2 != "string") return false;
  if (pe2.test(t2)) return true;
  bt.lastIndex = 0;
  let e;
  for (; e = bt.exec(t2); ) if (!yt.test(e[1].trim())) return true;
  return false;
}
function ge2(t2) {
  let e = "";
  for (let o of t2) {
    let n = o.charCodeAt(0);
    n <= 31 || n === 127 || /\s/.test(o) || (e += o);
  }
  return e;
}
function he(t2, e) {
  var i2, s3;
  let o = ge2(t2), n = e.toLowerCase();
  if (o.startsWith("#") || o.startsWith("/") || o.startsWith("./") || o.startsWith("../") || o.startsWith("?")) return true;
  let r = (s3 = (i2 = o.match(/^([a-z][a-z0-9+.-]*):/i)) == null ? void 0 : i2[1]) == null ? void 0 : s3.toLowerCase();
  return r ? r === "data" ? (n === "src" || n === "xlink:href") && yt.test(t2.trim()) : me2.has(r) : true;
}
function P(t2, e) {
  return typeof e == "string" && ce2.has(t2.toLowerCase()) && !he(e, t2);
}
function O2(t2, e) {
  return t2.toLowerCase() === "srcdoc" && typeof e == "string" && /<\s*script\b|on\w+\s*=|javascript:|data:text\/html/i.test(e);
}
function ye(t2) {
  return t2.startsWith("--") ? t2 : t2.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function X2(t2, e, o = {}) {
  o.clear && (t2.style.cssText = ""), e.forEach((n) => {
    let r = n.indexOf(":");
    if (r < 0) return;
    let i2 = n.slice(0, r).trim(), s3 = n.slice(r + 1).trim();
    if (!i2 || _(s3)) return;
    let l3 = "";
    /!\s*important$/i.test(s3) && (s3 = s3.replace(/!\s*important$/i, "").trim(), l3 = "important"), t2.style.setProperty(i2, s3, l3);
  });
}
function xe2(t2, e) {
  let o = 0;
  for (; e - 1 - o >= 0 && t2[e - 1 - o] === "\\"; ) o++;
  return o % 2 === 1;
}
function we(t2) {
  let e = [], o = 0, n = "", r = 0;
  for (let i2 = 0; i2 < t2.length; i2++) {
    let s3 = t2[i2];
    n ? s3 === n && !xe2(t2, i2) && (n = "") : s3 === "'" || s3 === '"' ? n = s3 : s3 === "(" ? r++ : s3 === ")" ? r = Math.max(0, r - 1) : s3 === ";" && r === 0 && (e.push(t2.slice(o, i2)), o = i2 + 1);
  }
  return e.push(t2.slice(o)), e;
}
function v2(t2, e, o = {}) {
  if (typeof e == "string") {
    let n = we(e);
    X2(t2, n, o);
    return;
  }
  o.clear && (t2.style.cssText = ""), Object.entries(e).forEach(([n, r]) => {
    if (r == null || _(r)) return;
    let i2 = String(r), s3 = "";
    /!\s*important$/i.test(i2) && (i2 = i2.replace(/!\s*important$/i, "").trim(), s3 = "important"), t2.style.setProperty(ye(n), i2, s3);
  });
}
function C2(t2, e) {
  if (t2 instanceof HTMLElement) {
    let o = t2.offsetWidth;
    if (e) {
      let n = getComputedStyle(t2);
      o += parseFloat(n.marginLeft) + parseFloat(n.marginRight);
    }
    return o;
  }
  return 0;
}
function p2(t2) {
  return typeof Element != "undefined" ? t2 instanceof Element : t2 !== null && typeof t2 == "object" && t2.nodeType === 1 && typeof t2.nodeName == "string";
}
function A2(t2, e, o) {
  if (typeof o != "function" && !(typeof o == "object" && o !== null && "handleEvent" in o)) return;
  let n = t2, r = n._pListeners || (n._pListeners = []), i2 = false;
  for (let s3 = r.length - 1; s3 >= 0; s3--) r[s3][0] === e && (r[s3][1] === o ? i2 = true : (t2.removeEventListener(e, r[s3][1]), r.splice(s3, 1)));
  i2 || (t2.addEventListener(e, o), r.push([e, o]));
}
function N2(t2, e = {}) {
  if (p2(t2)) {
    let o = t2 == null ? void 0 : t2.$attrs, n = (s3, l3) => {
      let a = o != null && o[s3] ? [o[s3]] : [];
      return [l3].flat().reduce((f, u2) => {
        if (u2 != null) {
          let c4 = typeof u2;
          if (c4 === "string" || c4 === "number") f.push(u2);
          else if (c4 === "object") {
            let d3 = Array.isArray(u2) ? n(s3, u2) : Object.entries(u2).map(([g2, w]) => s3 === "style" && (w || w === 0) ? `${g2.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${w}` : w ? g2 : void 0);
            f = d3.length ? f.concat(d3.filter((g2) => !!g2)) : f;
          }
        }
        return f;
      }, a);
    }, r = (s3) => {
      let l3 = n("style", s3);
      X2(t2, l3);
    }, i2 = t2;
    Object.entries(e).forEach(([s3, l3]) => {
      if (l3 != null) {
        let a = s3.match(/^on(.+)/);
        if (a) A2(t2, a[1].toLowerCase(), l3);
        else if (s3 === "p-bind" || s3 === "pBind") N2(t2, l3);
        else if (s3 === "style") r(l3), i2.$attrs = i2.$attrs || {}, i2.$attrs[s3] = t2.style.cssText;
        else {
          if (P(s3, l3) || O2(s3, l3)) return;
          l3 = s3 === "class" ? [...new Set(n("class", l3))].join(" ").trim() : l3, i2.$attrs = i2.$attrs || {}, i2.$attrs[s3] = l3, t2.setAttribute(s3, l3);
        }
      }
    });
  }
}
function G(t2) {
  return String(t2).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function J(t2, e = {}) {
  return t2 ? `<style${Object.entries(e).reduce((o, [n, r]) => o + ` ${n}="${G(r)}"`, "")}>${t2}</style>` : "";
}
function Pt(t2) {
  if (t2) {
    let e = t2.offsetHeight, o = getComputedStyle(t2);
    return e -= parseFloat(o.paddingTop) + parseFloat(o.paddingBottom) + parseFloat(o.borderTopWidth) + parseFloat(o.borderBottomWidth), e;
  }
  return 0;
}
function st(t2) {
  if (t2) {
    let e = t2.getBoundingClientRect();
    return { top: e.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: e.left + (window.pageXOffset || S2(document.documentElement) || S2(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function k(t2, e) {
  if (t2) {
    let o = t2.offsetHeight;
    if (e) {
      let n = getComputedStyle(t2);
      o += parseFloat(n.marginTop) + parseFloat(n.marginBottom);
    }
    return o;
  }
  return 0;
}
function jt(t2) {
  if (t2) {
    let e = t2.offsetWidth, o = getComputedStyle(t2);
    return e -= parseFloat(o.paddingLeft) + parseFloat(o.paddingRight) + parseFloat(o.borderLeftWidth) + parseFloat(o.borderRightWidth), e;
  }
  return 0;
}
function ie(t2) {
  var e;
  t2 && ("remove" in Element.prototype ? t2.remove() : (e = t2.parentNode) == null || e.removeChild(t2));
}
function de2(t2, e = "", o) {
  if (p2(t2) && o !== null && o !== void 0) {
    let n = e.toLowerCase();
    if (/^on[a-z]/.test(n)) {
      A2(t2, n.slice(2), o);
      return;
    }
    if (n === "style") {
      typeof o == "string" ? v2(t2, o, { clear: true }) : typeof o == "object" && v2(t2, o);
      return;
    }
    if (P(e, o) || O2(e, o)) return;
    t2.setAttribute(e, o);
  }
}

// node_modules/@primeuix/utils/dist/classnames/index.mjs
function c2(...e) {
  let t2 = [];
  for (let s3 = 0; s3 < e.length; s3++) {
    let n = e[s3];
    if (!n) continue;
    let r = typeof n;
    if (r === "string" || r === "number") t2.push(n);
    else if (r === "object") {
      let o = Array.isArray(n) ? [c2(...n)] : Object.entries(n).map(([i2, u2]) => u2 ? i2 : void 0);
      t2 = o.length ? t2.concat(o.filter((i2) => !!i2)) : t2;
    }
  }
  return t2.join(" ").trim();
}

// node_modules/@primeuix/utils/dist/mergeprops/index.mjs
var c3 = Object.defineProperty;
var d2 = Object.getOwnPropertySymbols;
var x2 = Object.prototype.hasOwnProperty;
var y = Object.prototype.propertyIsEnumerable;
var m2 = (t2, o, e) => o in t2 ? c3(t2, o, { enumerable: true, configurable: true, writable: true, value: e }) : t2[o] = e;
var l2 = (t2, o) => {
  for (var e in o || (o = {})) x2.call(o, e) && m2(t2, e, o[e]);
  if (d2) for (var e of d2(o)) y.call(o, e) && m2(t2, e, o[e]);
  return t2;
};
function i(...t2) {
  let o = [];
  for (let e = 0; e < t2.length; e++) {
    let n = t2[e];
    if (!n) continue;
    let r = typeof n;
    if (r === "string" || r === "number") o.push(n);
    else if (r === "object") {
      let a = Array.isArray(n) ? [i(...n)] : Object.entries(n).map(([s3, f]) => f ? s3 : void 0);
      o = a.length ? o.concat(a.filter((s3) => !!s3)) : o;
    }
  }
  return o.join(" ").trim();
}
function u(t2) {
  return typeof t2 == "function" && "call" in t2 && "apply" in t2;
}
function p3({ skipUndefined: t2 = false }, ...o) {
  return o == null ? void 0 : o.reduce((e, n = {}) => {
    for (let r in n) {
      let a = n[r];
      if (!(t2 && a === void 0)) if (r === "style") e.style = l2(l2({}, e.style), n.style);
      else if (r === "class" || r === "className") e[r] = i(e[r], n[r]);
      else if (u(a)) {
        let s3 = e[r];
        e[r] = s3 ? (...f) => {
          s3(...f), a(...f);
        } : a;
      } else e[r] = a;
    }
    return e;
  }, {});
}
function F2(...t2) {
  return p3({ skipUndefined: false }, ...t2);
}

// node_modules/@primeuix/utils/dist/uuid/index.mjs
var t = {};
function s2(n = "pui_id_") {
  return Object.hasOwn(t, n) || (t[n] = 0), t[n]++, `${n}${t[n]}`;
}

// node_modules/@primeuix/utils/dist/zindex/index.mjs
function g() {
  let r = [], i2 = (e, n, t2 = 999) => {
    let s3 = u2(e, n, t2), o = s3.value + (s3.key === e ? 0 : t2) + 1;
    return r.push({ key: e, value: o }), o;
  }, d3 = (e) => {
    r = r.filter((n) => n.value !== e);
  }, a = (e, n) => u2(e, n).value, u2 = (e, n, t2 = 0) => [...r].reverse().find((s3) => n ? true : s3.key === e) || { key: e, value: t2 }, l3 = (e) => e && parseInt(e.style.zIndex, 10) || 0;
  return { get: l3, set: (e, n, t2) => {
    n && (n.style.zIndex = String(i2(e, true, t2)));
  }, clear: (e) => {
    e && (d3(l3(e)), e.style.zIndex = "");
  }, getCurrent: (e) => a(e, false) };
}
var x3 = g();

// node_modules/@primeuix/styled/dist/index.mjs
var nt = Object.defineProperty;
var ot = Object.defineProperties;
var it = Object.getOwnPropertyDescriptors;
var te = Object.getOwnPropertySymbols;
var Se = Object.prototype.hasOwnProperty;
var Oe = Object.prototype.propertyIsEnumerable;
var ye2 = (e, t2, s3) => t2 in e ? nt(e, t2, { enumerable: true, configurable: true, writable: true, value: s3 }) : e[t2] = s3;
var y2 = (e, t2) => {
  for (var s3 in t2 || (t2 = {})) Se.call(t2, s3) && ye2(e, s3, t2[s3]);
  if (te) for (var s3 of te(t2)) Oe.call(t2, s3) && ye2(e, s3, t2[s3]);
  return e;
};
var C3 = (e, t2) => ot(e, it(t2));
var V = (e, t2) => {
  var s3 = {};
  for (var r in e) Se.call(e, r) && t2.indexOf(r) < 0 && (s3[r] = e[r]);
  if (e != null && te) for (var r of te(e)) t2.indexOf(r) < 0 && Oe.call(e, r) && (s3[r] = e[r]);
  return s3;
};
function xe3(e, ...t2) {
  return F(e, ...t2);
}
var ct = v();
var R3 = ct;
var P2 = /{([^}]*)}/g;
var re = /(\d+\s+[+*/-]\s+\d+)/g;
var ne = /var\([^)]+\)/g;
function K2(e) {
  return c(e) ? e.replace(/[A-Z]/g, (t2, s3) => s3 === 0 ? t2 : "." + t2.toLowerCase()).toLowerCase() : e;
}
function zt(e, t2) {
  A(e) ? e.push(...t2 || []) : s(e) && Object.assign(e, t2);
}
function Pe(e) {
  return s(e) && Object.prototype.hasOwnProperty.call(e, "$value") && Object.prototype.hasOwnProperty.call(e, "$type") ? e.$value : e;
}
function Gt(e, t2 = "") {
  return ["opacity", "z-index", "line-height", "font-weight", "flex", "flex-grow", "flex-shrink", "order"].some((r) => t2.endsWith(r)) ? e : `${e}`.trim().split(" ").map((i2) => Z(i2) ? `${i2}px` : i2).join(" ");
}
function pt(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function oe(e = "", t2 = "") {
  return pt(`${c(e, false) && c(t2, false) ? `${e}-` : e}${t2}`);
}
function ce3(e = "", t2 = "") {
  return `--${oe(e, t2)}`;
}
function gt(e = "") {
  let t2 = (e.match(/{/g) || []).length, s3 = (e.match(/}/g) || []).length;
  return (t2 + s3) % 2 !== 0;
}
function L(e, t2 = "", s3 = "", r = [], o) {
  if (c(e)) {
    let i2 = e.trim();
    if (gt(i2)) return;
    if (H(i2, P2)) {
      let n = i2.replaceAll(P2, (u2) => {
        let a = u2.replace(/{|}/g, "").split(".").filter((l3) => !r.some((c4) => H(l3, c4)));
        return `var(${ce3(s3, fe(a.join("-")))}${l(o) ? `, ${o}` : ""})`;
      });
      return H(n.replace(ne, "0"), re) ? `calc(${n})` : n;
    }
    return i2;
  } else if (Z(e)) return e;
}
function It(e = {}, t2) {
  if (c(t2)) {
    let s3 = t2.trim();
    return H(s3, P2) ? s3.replaceAll(P2, (r) => K(e, r.replace(/{|}/g, ""))) : s3;
  } else if (Z(t2)) return t2;
}
function $e(e, t2, s3) {
  c(t2, false) && e.push(`${t2}:${s3};`);
}
function j2(e, t2) {
  return e ? `${e}{${t2}}` : "";
}
function ue(e, t2) {
  if (e.indexOf("dt(") === -1) return e;
  function s3(n, u2) {
    let m3 = [], a = 0, l3 = "", c4 = null, p4 = 0;
    for (; a <= n.length; ) {
      let g2 = n[a];
      if ((g2 === '"' || g2 === "'" || g2 === "`") && n[a - 1] !== "\\" && (c4 = c4 === g2 ? null : g2), !c4 && (g2 === "(" && p4++, g2 === ")" && p4--, (g2 === "," || a === n.length) && p4 === 0)) {
        let f = l3.trim();
        f.startsWith("dt(") ? m3.push(ue(f, u2)) : m3.push(r(f)), l3 = "", a++;
        continue;
      }
      g2 !== void 0 && (l3 += g2), a++;
    }
    return m3;
  }
  function r(n) {
    let u2 = n[0];
    if ((u2 === '"' || u2 === "'" || u2 === "`") && n[n.length - 1] === u2) return n.slice(1, -1);
    let m3 = Number(n);
    return isNaN(m3) ? n : m3;
  }
  let o = [], i2 = [];
  for (let n = 0; n < e.length; n++) if (e[n] === "d" && e.slice(n, n + 3) === "dt(") i2.push(n), n += 2;
  else if (e[n] === ")" && i2.length > 0) {
    let u2 = i2.pop();
    i2.length === 0 && o.push([u2, n]);
  }
  if (!o.length) return e;
  for (let n = o.length - 1; n >= 0; n--) {
    let [u2, m3] = o[n], a = e.slice(u2 + 3, m3), l3 = s3(a, t2), c4 = t2(...l3);
    e = e.slice(0, u2) + c4 + e.slice(m3 + 1);
  }
  return e;
}
function ve(e) {
  return e.length === 4 ? `#${e[1]}${e[1]}${e[2]}${e[2]}${e[3]}${e[3]}` : e;
}
function Ce(e) {
  let t2 = parseInt(e.substring(1), 16), s3 = t2 >> 16 & 255, r = t2 >> 8 & 255, o = t2 & 255;
  return { r: s3, g: r, b: o };
}
function ft(e, t2, s3) {
  return `#${e.toString(16).padStart(2, "0")}${t2.toString(16).padStart(2, "0")}${s3.toString(16).padStart(2, "0")}`;
}
var Ve = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
var X3 = (e, t2, s3) => {
  if (!Ve.test(e) || !Ve.test(t2)) return t2;
  e = ve(e), t2 = ve(t2);
  let i2 = (s3 / 100 * 2 - 1 + 1) / 2, n = 1 - i2, u2 = Ce(e), m3 = Ce(t2), a = Math.round(u2.r * i2 + m3.r * n), l3 = Math.round(u2.g * i2 + m3.g * n), c4 = Math.round(u2.b * i2 + m3.b * n);
  return ft(a, l3, c4);
};
var de3 = (e, t2) => X3("#000000", e, t2);
var me3 = (e, t2) => X3("#ffffff", e, t2);
var Re = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
var Tt = (e) => {
  if (H(e, P2)) {
    let t2 = e.replace(/{|}/g, "");
    return Re.reduce((s3, r) => (s3[r] = `{${t2}.${r}}`, s3), {});
  }
  return Re.reduce((t2, s3, r) => (t2[s3] = r <= 5 ? me3(e, (5 - r) * 19) : de3(e, (r - 5) * 15), t2), {});
};
var St = (e, t2) => {
  let s3 = e.split("."), r = "";
  for (let o = 0; o < s3.length; o++) {
    let i2 = K2(s3[o]);
    t2.lastIndex = 0, !t2.test(i2) && (r = r ? `${r}.${i2}` : i2);
  }
  return r;
};
var he2 = (e, t2, s3, r, o) => {
  if (typeof e != "string") return e != null ? e : S3.getTokenValue(t2);
  if (P2.lastIndex = 0, !P2.test(e)) return e;
  let i2 = t2.slice(0, t2.indexOf(".")), n = e.replace(P2, (u2) => {
    let m3 = u2.slice(1, -1), a = m3.indexOf(".");
    if ((a === -1 ? m3 : m3.slice(0, a)) !== i2) return u2;
    let l3 = S3.getTokenValue(m3);
    return l3 == null ? u2 : `${l3}`;
  });
  return L(n, void 0, s3, [r], o);
};
var Ot = (e, t2, s3, r) => {
  var l3, c4, p4, g2;
  let o = St(e, s3), i2 = S3.tokens, n = i2.__strictCache;
  n || (n = /* @__PURE__ */ new Map(), Object.defineProperty(i2, "__strictCache", { value: n, enumerable: false, configurable: true }));
  let u2 = r == null || typeof r != "object", m3 = u2 && r != null ? `${t2}|${o}|${r}` : `${t2}|${o}`, a = u2 ? n.get(m3) : void 0;
  if (a === void 0 && (!u2 || !n.has(m3))) {
    let f = (l3 = i2[o]) == null ? void 0 : l3.paths, h = f == null ? void 0 : f.find((k2) => k2.scheme === "none"), d3 = (c4 = f == null ? void 0 : f.find((k2) => k2.scheme === "light")) != null ? c4 : h, T = (p4 = f == null ? void 0 : f.find((k2) => k2.scheme === "dark")) != null ? p4 : h;
    if (d3 && T && d3 !== T) {
      let k2 = he2(d3.value, o, t2, s3, r), b2 = he2(T.value, o, t2, s3, r);
      a = k2 === b2 ? k2 : `light-dark(${k2},${b2})`;
    } else a = he2((g2 = d3 != null ? d3 : T) == null ? void 0 : g2.value, o, t2, s3, r);
    u2 && n.set(m3, a);
  }
  return S3.hasScopedTokenPath(o) ? L(`{${o}}`, void 0, t2, [s3], a) : a;
};
var us = (e) => {
  var i2, n, u2;
  let t2 = S3.getTheme(), s3 = `${(i2 = pe3(t2, e, void 0, "variable")) != null ? i2 : ""}`, r = (u2 = (n = s3.match(/--[\w-]+/g)) == null ? void 0 : n[0]) != null ? u2 : "", o = pe3(t2, e, void 0, "value");
  return { name: r, variable: s3, value: o };
};
var N3 = (e, t2, s3) => pe3(S3.getTheme(), e, t2, s3);
var pe3 = (e = {}, t2, s3, r) => {
  var m3, a, l3, c4, p4, g2, f, h, d3, T;
  if (!t2) return "";
  let o = (m3 = S3.defaults) == null ? void 0 : m3.variable, i2 = (p4 = (a = e == null ? void 0 : e.options) == null ? void 0 : a.prefix) != null ? p4 : (c4 = (l3 = S3.defaults) == null ? void 0 : l3.options) == null ? void 0 : c4.prefix, n = (T = (d3 = (g2 = e == null ? void 0 : e.options) == null ? void 0 : g2.cssVariables) != null ? d3 : (h = (f = S3.defaults) == null ? void 0 : f.options) == null ? void 0 : h.cssVariables) != null ? T : true;
  if (r === "value") return S3.getTokenValue(t2);
  if (p(r) && !n) return Ot(t2, i2, o.excludedKeyRegex, s3);
  let u2 = H(t2, P2) ? t2 : `{${t2}}`;
  return L(u2, void 0, i2, [o.excludedKeyRegex], s3);
};
var xt = (...e) => {
  var t2;
  return `${(t2 = N3(...e)) != null ? t2 : ""}`;
};
function gs(e, ...t2) {
  if (e instanceof Array) {
    let s3 = e.reduce((r, o, i2) => {
      var n;
      return r + o + ((n = x(t2[i2], { dt: N3 })) != null ? n : "");
    }, "");
    return ue(s3, xt);
  }
  return x(e, { dt: N3 });
}
var A3 = (e = {}) => {
  let { preset: t2, options: s3 } = e;
  return { preset(r) {
    return t2 = t2 ? Q(t2, r) : r, this;
  }, options(r) {
    return s3 = s3 ? y2(y2({}, s3), r) : r, this;
  }, primaryPalette(r) {
    let { semantic: o } = t2 || {};
    return t2 = C3(y2({}, t2), { semantic: C3(y2({}, o), { primary: r }) }), this;
  }, surfacePalette(r) {
    var m3, a, l3;
    let o = (m3 = t2 == null ? void 0 : t2.semantic) != null ? m3 : {}, i2 = r && Object.hasOwn(r, "light") ? r.light : r, n = r && Object.hasOwn(r, "dark") ? r.dark : r, u2 = { colorScheme: { light: y2(y2({}, (a = o.colorScheme) == null ? void 0 : a.light), !!i2 && { surface: i2 }), dark: y2(y2({}, (l3 = o.colorScheme) == null ? void 0 : l3.dark), !!n && { surface: n }) } };
    return t2 = C3(y2({}, t2), { semantic: y2(y2({}, o), u2) }), this;
  }, define({ useDefaultPreset: r = false, useDefaultOptions: o = false } = {}) {
    return { preset: r ? S3.getPreset() : t2, options: o ? S3.getOptions() : s3 };
  }, update({ mergePresets: r = true, mergeOptions: o = true } = {}) {
    let i2 = { preset: r ? Q(S3.getPreset(), t2 != null ? t2 : {}) : t2, options: o ? y2(y2({}, S3.getOptions()), s3) : s3 };
    return S3.setTheme(i2), i2;
  }, use(r) {
    let o = this.define(r);
    return S3.setTheme(o), o;
  } };
};
function ge3(e, t2 = {}) {
  let s3 = S3.defaults.variable, { prefix: r = s3.prefix, selector: o = s3.selector, excludedKeyRegex: i2 = s3.excludedKeyRegex } = t2, n = [], u2 = [], m3 = [{ node: e, path: r }];
  for (; m3.length; ) {
    let { node: l3, path: c4 } = m3.pop();
    for (let p4 in l3) {
      let g2 = l3[p4], f = Pe(g2), d3 = H(p4, i2) ? oe(c4) : oe(c4, fe(p4));
      if (s(f)) m3.push({ node: f, path: d3 });
      else {
        let T = ce3(d3), k2 = L(f, d3, r, [i2]);
        $e(u2, T, k2 == null ? k2 : `${k2}`);
        let b2 = d3;
        r && b2.startsWith(r + "-") && (b2 = b2.slice(r.length + 1)), n.push(b2.replace(/-/g, "."));
      }
    }
  }
  let a = u2.join("");
  return { value: u2, tokens: n, declarations: a, css: j2(o, a) };
}
var $2 = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(e) {
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
  let t2 = Object.keys(this.rules).filter((s3) => s3 !== "custom").map((s3) => this.rules[s3]);
  return [e].flat().map((s3) => {
    var r;
    return (r = t2.map((o) => o.resolve(s3)).find((o) => o.matched)) != null ? r : this.rules.custom.resolve(s3);
  });
} }, _toVariables(e, t2) {
  return ge3(e, { prefix: t2 == null ? void 0 : t2.prefix });
}, getCommon({ name: e = "", theme: t2 = {}, params: s3, set: r, defaults: o }) {
  var k2, b2, O3, v3, E3, _2, w;
  let { preset: i2, options: n } = t2, u2, m3, a, l3, c4, p4, g2;
  if (l(i2)) {
    let { primitive: z, semantic: G2, extend: I2 } = i2, f = G2 || {}, { colorScheme: ae2 } = f, U = V(f, ["colorScheme"]), h = I2 || {}, { colorScheme: H2 } = h, M = V(h, ["colorScheme"]), d3 = ae2 || {}, { dark: B2 } = d3, W2 = V(d3, ["dark"]), T = H2 || {}, { dark: q2 } = T, F3 = V(T, ["dark"]), Z2 = l(z) ? this._toVariables({ primitive: z }, n) : {}, J2 = l(U) ? this._toVariables({ semantic: U }, n) : {}, Q2 = l(W2) ? this._toVariables({ light: W2 }, n) : {}, Y = l(B2) ? this._toVariables({ dark: B2 }, n) : {}, ee2 = l(M) ? this._toVariables({ semantic: M }, n) : {}, Te = l(F3) ? this._toVariables({ light: F3 }, n) : {}, be = l(q2) ? this._toVariables({ dark: q2 }, n) : {}, [Ke, Xe] = [(k2 = Z2.declarations) != null ? k2 : "", Z2.tokens], [ze, Ge] = [(b2 = J2.declarations) != null ? b2 : "", J2.tokens || []], [Ie, Ue] = [(O3 = Q2.declarations) != null ? O3 : "", Q2.tokens || []], [He, We] = [(v3 = Y.declarations) != null ? v3 : "", Y.tokens || []], [qe, Fe] = [(E3 = ee2.declarations) != null ? E3 : "", ee2.tokens || []], [Ze, Je] = [(_2 = Te.declarations) != null ? _2 : "", Te.tokens || []], [Qe, Ye] = [(w = be.declarations) != null ? w : "", be.tokens || []];
    u2 = this.transformCSS(e, Ke, "light", "variable", n, r, o), m3 = Xe;
    let et = this.transformCSS(e, `${ze}${Ie}`, "light", "variable", n, r, o), tt = this.transformCSS(e, `${He}`, "dark", "variable", n, r, o);
    a = `${et}${tt}`, l3 = [.../* @__PURE__ */ new Set([...Ge, ...Ue, ...We])];
    let st2 = this.transformCSS(e, `${qe}${Ze}color-scheme:light`, "light", "variable", n, r, o), rt = this.transformCSS(e, `${Qe}color-scheme:dark`, "dark", "variable", n, r, o);
    c4 = `${st2}${rt}`, p4 = [.../* @__PURE__ */ new Set([...Fe, ...Je, ...Ye])], g2 = x(i2.css, { dt: N3 });
  }
  return { primitive: { css: u2, tokens: m3 }, semantic: { css: a, tokens: l3 }, global: { css: c4, tokens: p4 }, style: g2 };
}, getPreset({ name: e = "", preset: t2 = {}, options: s3, params: r, set: o, defaults: i2, selector: n, isScopedTokenPaths: u2 }) {
  var c4, d3, T, k2;
  let m3, a, l3;
  if (l(t2) && ((c4 = s3 == null ? void 0 : s3.cssVariables) == null || c4 || u2)) {
    let b2 = e.replace("-directive", ""), p4 = t2, { colorScheme: O3, extend: v3, css: E3 } = p4, _2 = V(p4, ["colorScheme", "extend", "css"]), g2 = v3 || {}, { colorScheme: w } = g2, z = V(g2, ["colorScheme"]), f = O3 || {}, { dark: G2 } = f, I2 = V(f, ["dark"]), h = w || {}, { dark: ae2 } = h, U = V(h, ["dark"]), H2 = l(_2) ? this._toVariables({ [b2]: y2(y2({}, _2), z) }, s3) : {}, M = l(I2) ? this._toVariables({ [b2]: y2(y2({}, I2), U) }, s3) : {}, B2 = l(G2) ? this._toVariables({ [b2]: y2(y2({}, G2), ae2) }, s3) : {}, [W2, q2] = [(d3 = H2.declarations) != null ? d3 : "", H2.tokens || []], [F3, Z2] = [(T = M.declarations) != null ? T : "", M.tokens || []], [J2, Q2] = [(k2 = B2.declarations) != null ? k2 : "", B2.tokens || []], Y = this.transformCSS(b2, `${W2}${F3}`, "light", "variable", s3, o, i2, n), ee2 = this.transformCSS(b2, J2, "dark", "variable", s3, o, i2, n);
    m3 = `${Y}${ee2}`, a = [.../* @__PURE__ */ new Set([...q2, ...Z2, ...Q2])], l3 = x(E3, { dt: N3 });
  }
  return { css: m3, tokens: a, style: l3 };
}, getScopedSelector(e, t2) {
  if (!(!(t2 != null && t2.scoped) || !e)) return `[data-styled="${e}"]`;
}, getPresetC({ name: e = "", theme: t2 = {}, params: s3, set: r, defaults: o }) {
  var a;
  let { preset: i2, options: n } = t2, u2 = (a = i2 == null ? void 0 : i2.components) == null ? void 0 : a[e], m3 = this.getScopedSelector(e, n);
  return this.getPreset({ name: e, preset: u2, options: n, params: s3, set: r, defaults: o, selector: m3 });
}, getPresetD({ name: e = "", theme: t2 = {}, params: s3, set: r, defaults: o }) {
  var l3, c4;
  let i2 = e.replace("-directive", ""), { preset: n, options: u2 } = t2, m3 = ((l3 = n == null ? void 0 : n.components) == null ? void 0 : l3[i2]) || ((c4 = n == null ? void 0 : n.directives) == null ? void 0 : c4[i2]), a = this.getScopedSelector(i2, u2);
  return this.getPreset({ name: i2, preset: m3, options: u2, params: s3, set: r, defaults: o, selector: a });
}, applyDarkColorScheme(e) {
  let t2 = e.darkModeSelector;
  return !(t2 === "none" || t2 === false);
}, getColorSchemeOption(e, t2) {
  var s3;
  return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === true ? t2.options.darkModeSelector : (s3 = e.darkModeSelector) != null ? s3 : t2.options.darkModeSelector) : [];
}, getLayerOrder(e, t2 = {}, s3, r) {
  let { cssLayer: o } = t2;
  return o ? `@layer ${x(o.order || o.name || "primeui", s3)}` : "";
}, getCommonStyleSheet({ name: e = "", theme: t2 = {}, params: s3, props: r = {}, set: o, defaults: i2 }) {
  let n = this.getCommon({ name: e, theme: t2, params: s3, set: o, defaults: i2 }), u2 = Object.entries(r).reduce((m3, [a, l3]) => (m3.push(`${a}="${G(l3)}"`), m3), []).join(" ");
  return Object.entries(n || {}).reduce((m3, [a, l3]) => {
    if (s(l3) && Object.hasOwn(l3, "css")) {
      let c4 = B(l3.css), p4 = `${a}-variables`;
      m3.push(`<style type="text/css" data-primevue-style-id="${p4}" ${u2}>${c4}</style>`);
    }
    return m3;
  }, []).join("");
}, getStyleSheet({ name: e = "", theme: t2 = {}, params: s3, props: r = {}, set: o, defaults: i2 }) {
  var a;
  let n = { name: e, theme: t2, params: s3, set: o, defaults: i2 }, u2 = (a = e.includes("-directive") ? this.getPresetD(n) : this.getPresetC(n)) == null ? void 0 : a.css, m3 = Object.entries(r).reduce((l3, [c4, p4]) => (l3.push(`${c4}="${G(p4)}"`), l3), []).join(" ");
  return u2 ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${m3}>${B(u2)}</style>` : "";
}, createTokens(e = {}, t2, s3 = "", r = "", o = {}) {
  let i2 = function(a, l3, c4, p4) {
    return a.replace(P2, (g2) => {
      var T;
      let f = g2.slice(1, -1), h = this.tokens[f];
      if (!h) return console.warn(`Token not found for path: ${f}`), "__UNRESOLVED__";
      let d3 = h.computed(l3, c4, p4);
      if (Array.isArray(d3) && d3.length === 2) {
        let k2 = d3[0].value, b2 = d3[1].value;
        return k2 === b2 ? k2 != null ? k2 : "__UNRESOLVED__" : `light-dark(${k2},${b2})`;
      }
      return (T = d3 == null ? void 0 : d3.value) != null ? T : "__UNRESOLVED__";
    });
  }, n = function(a, l3, c4, p4) {
    if (a.indexOf("light-dark(") === -1) return a;
    let g2 = [], f = a.length, h = 0;
    for (; h < f; ) {
      let d3 = a.indexOf("light-dark(", h);
      if (d3 === -1) {
        g2.push(a.slice(h));
        break;
      }
      g2.push(a.slice(h, d3));
      let T = 1, k2 = d3 + 11, b2 = -1;
      for (; k2 < f && T > 0; ) {
        let _2 = a.charCodeAt(k2);
        _2 === 40 ? T++ : _2 === 41 ? T-- : _2 === 44 && T === 1 && b2 === -1 && (b2 = k2), k2++;
      }
      if (T !== 0 || b2 === -1) {
        g2.push(a.slice(d3));
        break;
      }
      let O3 = a.slice(d3 + 11, b2).trim(), v3 = a.slice(b2 + 1, k2 - 1).trim(), E3 = l3 && l3 !== "none" ? l3 : null;
      if (E3 === "light") g2.push(n.call(this, O3, "light", c4, p4));
      else if (E3 === "dark") g2.push(n.call(this, v3, "dark", c4, p4));
      else {
        let _2 = i2.call(this, n.call(this, O3, "light", c4, p4), "light", c4, p4), w = i2.call(this, n.call(this, v3, "dark", c4, p4), "dark", c4, p4);
        g2.push(_2 === w ? _2 : `light-dark(${_2},${w})`);
      }
      h = k2;
    }
    return g2.join("");
  }, u2 = function(a, l3 = {}, c4 = []) {
    if (c4.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: a, path: this.path, paths: l3, value: void 0 };
    c4.push(this.path), l3.name = this.path, l3.binding || (l3.binding = {});
    let p4 = this.value;
    if (typeof this.value == "string") {
      let g2 = this.value.trim(), f = g2.indexOf("light-dark(") !== -1, h = g2.indexOf("{") !== -1;
      if (f || h) {
        let d3 = f ? n.call(this, g2, a, l3, c4) : g2, T = d3.indexOf("{") !== -1 ? i2.call(this, d3, a, l3, c4) : d3;
        re.lastIndex = 0, ne.lastIndex = 0, p4 = re.test(T.replace(ne, "0")) ? `calc(${T})` : T;
      }
    }
    return p(l3.binding) && delete l3.binding, c4.pop(), { colorScheme: a, path: this.path, paths: l3, value: typeof p4 == "string" && p4.indexOf("__UNRESOLVED__") !== -1 ? void 0 : p4 };
  }, m3 = (a, l3, c4) => {
    Object.entries(a).forEach(([p4, g2]) => {
      let f = H(p4, t2.variable.excludedKeyRegex) ? l3 : l3 ? `${l3}.${K2(p4)}` : K2(p4), h = c4 ? `${c4}.${p4}` : p4;
      s(g2) ? m3(g2, f, h) : (o[f] || (o[f] = { paths: [], computed: (d3, T = {}, k2 = []) => {
        let b2 = o[f].paths;
        if (b2.length === 1) {
          let O3 = b2[0], v3 = O3.scheme !== "none" ? O3.scheme : d3;
          return O3.computed(v3, T.binding, k2);
        } else if (d3 && d3 !== "none") for (let O3 = 0; O3 < b2.length; O3++) {
          let v3 = b2[O3];
          if (v3.scheme === d3) return v3.computed(d3, T.binding, k2);
        }
        return b2.map((O3) => O3.computed(O3.scheme, T[O3.scheme], k2));
      } }), o[f].paths.push({ path: h, value: g2, scheme: h.includes("colorScheme.light") ? "light" : h.includes("colorScheme.dark") ? "dark" : "none", computed: u2, tokens: o }));
    });
  };
  return m3(e, s3, r), o;
}, getTokenValue(e, t2, s3) {
  var p4, g2, f;
  let r = e.__cache;
  r || (r = /* @__PURE__ */ new Map(), Object.defineProperty(e, "__cache", { value: r, enumerable: false, configurable: true }));
  let o = r.get(t2);
  if (o !== void 0 || r.has(t2)) return o;
  let i2 = s3.variable.excludedKeyRegex, n = t2.split("."), u2 = [];
  for (let h = 0; h < n.length; h++) {
    let d3 = n[h];
    i2.lastIndex = 0, i2.test(d3.toLowerCase()) || u2.push(d3);
  }
  let m3 = u2.join("."), a = t2.indexOf("colorScheme.light") !== -1 ? "light" : t2.indexOf("colorScheme.dark") !== -1 ? "dark" : void 0, l3 = e[m3];
  if (!l3) {
    r.set(t2, void 0);
    return;
  }
  let c4;
  if (a) {
    let h = l3.computed(a);
    if (Array.isArray(h)) {
      for (let d3 = 0; d3 < h.length; d3++) if (((p4 = h[d3]) == null ? void 0 : p4.colorScheme) === a) {
        c4 = h[d3].value;
        break;
      }
    } else c4 = h == null ? void 0 : h.value;
  } else {
    let h = l3.computed("light"), d3 = l3.computed("dark"), T, k2;
    if (Array.isArray(h)) {
      for (let b2 = 0; b2 < h.length; b2++) if (((g2 = h[b2]) == null ? void 0 : g2.colorScheme) === "light") {
        T = h[b2].value;
        break;
      }
    } else T = h == null ? void 0 : h.value;
    if (Array.isArray(d3)) {
      for (let b2 = 0; b2 < d3.length; b2++) if (((f = d3[b2]) == null ? void 0 : f.colorScheme) === "dark") {
        k2 = d3[b2].value;
        break;
      }
    } else k2 = d3 == null ? void 0 : d3.value;
    T === void 0 && k2 === void 0 ? c4 = void 0 : T === void 0 ? c4 = k2 : k2 === void 0 || T === k2 ? c4 = T : c4 = `light-dark(${T},${k2})`;
  }
  return r.set(t2, c4), c4;
}, getSelectorRule(e, t2, s3, r, o = ":root,:host") {
  return s3 === "class" || s3 === "attr" ? j2(l(t2) ? `${e}${t2},${e} ${t2}` : e, r) : j2(e, j2(t2 != null ? t2 : o, r));
}, transformCSS(e, t2, s3, r, o = {}, i2, n, u2) {
  var m3, a;
  if (l(t2)) {
    let { cssLayer: l3 } = o;
    if (r !== "style") {
      let c4 = this.getColorSchemeOption(o, n), p4 = (a = (m3 = n == null ? void 0 : n.variable) == null ? void 0 : m3.selector) != null ? a : ":root,:host";
      t2 = s3 === "dark" ? c4.reduce((g2, { type: f, selector: h }) => (l(h) && (g2 += h.includes("[CSS]") ? h.replace("[CSS]", t2) : this.getSelectorRule(h, u2, f, t2, p4)), g2), "") : j2(u2 != null ? u2 : p4, t2);
    }
    if (l3) {
      let c4 = { name: "primeui", order: "primeui" };
      s(l3) && (c4.name = x(l3.name, { name: e, type: r })), l(c4.name) && (t2 = j2(`@layer ${c4.name}`, t2), i2 == null || i2.layerNames(c4.name));
    }
    return t2;
  }
  return "";
} };
var S3 = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: false, cssVariables: true, scoped: false } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, _scopedTokenPaths: /* @__PURE__ */ new Set(), update(e = {}) {
  let { theme: t2 } = e;
  t2 && (this._theme = C3(y2({}, t2), { options: y2(y2({}, this.defaults.options), t2.options) }), this._tokens = $2.createTokens(this.preset, this.defaults), this.resetCaches());
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
  let t2 = false;
  return e && Object.keys(e).length && N(e).forEach((s3) => {
    let r = ae(s3);
    this._scopedTokenPaths.has(r) || (this._scopedTokenPaths.add(r), t2 = true);
  }), t2;
}, clearScopedTokenPaths() {
  this._scopedTokenPaths.clear();
}, getTheme() {
  return this.theme;
}, setTheme(e) {
  this.update({ theme: e }), R3.emit("theme:change", e);
}, getPreset() {
  return this.preset;
}, setPreset(e) {
  this._theme = C3(y2({}, this.theme), { preset: e }), this._tokens = $2.createTokens(e, this.defaults), this.resetCaches(), R3.emit("preset:change", e), R3.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(e) {
  this._theme = C3(y2({}, this.theme), { options: e }), this.resetStyleCaches(), R3.emit("options:change", e), R3.emit("theme:change", this.theme);
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
  return $2.getTokenValue(this.tokens, e, this.defaults);
}, getCommon(e = "", t2) {
  return $2.getCommon({ name: e, theme: this.theme, params: t2, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(e = "", t2) {
  let s3 = { name: e, theme: this.theme, params: t2, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return $2.getPresetC(s3);
}, getDirective(e = "", t2) {
  let s3 = { name: e, theme: this.theme, params: t2, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return $2.getPresetD(s3);
}, getCustomPreset(e = "", t2, s3, r) {
  let o = { name: e, preset: t2, options: this.options, selector: s3, params: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) }, isScopedTokenPaths: true };
  return $2.getPreset(o);
}, getLayerOrderCSS(e = "") {
  return $2.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(e = "", t2, s3 = "style", r) {
  return $2.transformCSS(e, t2, r, s3, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(e = "", t2, s3 = {}) {
  return $2.getCommonStyleSheet({ name: e, theme: this.theme, params: t2, props: s3, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(e, t2, s3 = {}) {
  return $2.getStyleSheet({ name: e, theme: this.theme, params: t2, props: s3, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(e) {
  this._loadingStyles.add(e);
}, onStyleUpdated(e) {
  this._loadingStyles.add(e);
}, onStyleLoaded(e, { name: t2 }) {
  this._loadingStyles.size && (this._loadingStyles.delete(t2), R3.emit(`theme:${t2}:load`, e), this._loadingStyles.size || R3.emit("theme:load"));
} };
function De(...e) {
  let t2 = F(S3.getPreset(), ...e);
  return S3.setPreset(t2), t2;
}
function Le(e) {
  return A3().primaryPalette(e != null ? e : {}).update().preset;
}
function Ae(e) {
  return A3().surfacePalette(e != null ? e : {}).update().preset;
}
function Me(e, ...t2) {
  let s3 = F(e, ...t2);
  return S3.setPreset(s3), s3;
}
function Be(e) {
  return A3(e).update({ mergePresets: false, mergeOptions: false });
}
var ke = class {
  constructor({ attrs: t2 } = {}) {
    this._styles = /* @__PURE__ */ new Map(), this._attrs = t2 || {};
  }
  get(t2) {
    return this._styles.get(t2);
  }
  has(t2) {
    return this._styles.has(t2);
  }
  delete(t2) {
    this._styles.delete(t2);
  }
  clear() {
    this._styles.clear();
  }
  add(t2, s3) {
    if (l(s3)) {
      let r = { name: t2, css: s3, attrs: this._attrs, markup: J(s3, this._attrs) };
      this._styles.set(t2, C3(y2({}, r), { element: this.createStyleElement(r) }));
    }
  }
  update() {
  }
  getStyles() {
    return this._styles;
  }
  getAllCSS() {
    return [...this._styles.values()].map((t2) => t2.css).filter((t2) => !!t2);
  }
  getAllMarkup() {
    return [...this._styles.values()].map((t2) => t2.markup).filter((t2) => !!t2);
  }
  getAllElements() {
    return [...this._styles.values()].map((t2) => t2.element);
  }
  createStyleElement(t2 = {}) {
  }
};
var Dt = ke;

export {
  p,
  m,
  l,
  d,
  b,
  x,
  c,
  C,
  K,
  A,
  B,
  ee,
  R2 as R,
  W,
  E2 as E,
  C2,
  N2 as N,
  Pt,
  st,
  k,
  jt,
  ie,
  de2 as de,
  c2,
  F2 as F,
  s2 as s,
  xe3 as xe,
  R3 as R2,
  P2 as P,
  re,
  ne,
  K2,
  zt,
  Pe,
  Gt,
  pt,
  oe,
  ce3 as ce,
  gt,
  L,
  It,
  $e,
  j2 as j,
  ue,
  X3 as X,
  de3 as de2,
  me3 as me,
  Tt,
  us,
  N3 as N2,
  pe3 as pe,
  gs,
  A3 as A2,
  ge3 as ge,
  $2 as $,
  S3 as S,
  De,
  Le,
  Ae,
  Me,
  Be,
  Dt
};
//# sourceMappingURL=chunk-6Q7RQFXE.js.map
