import {
  R,
  T,
  W,
  se,
  te,
  ue
} from "./chunk-RB5ZFJAO.js";

// node_modules/@primeuix/motion/dist/index.mjs
var J = Object.defineProperty;
var N = Object.getOwnPropertySymbols;
var K = Object.prototype.hasOwnProperty;
var Q = Object.prototype.propertyIsEnumerable;
var S = (t, o, e) => o in t ? J(t, o, { enumerable: true, configurable: true, writable: true, value: e }) : t[o] = e;
var x = (t, o) => {
  for (var e in o || (o = {})) K.call(o, e) && S(t, e, o[e]);
  if (N) for (var e of N(o)) Q.call(o, e) && S(t, e, o[e]);
  return t;
};
var k = (t, o, e) => new Promise((i, u) => {
  var a = (s) => {
    try {
      h(e.next(s));
    } catch (f) {
      u(f);
    }
  }, M = (s) => {
    try {
      h(e.throw(s));
    } catch (f) {
      u(f);
    }
  }, h = (s) => s.done ? i(s.value) : Promise.resolve(s.value).then(a, M);
  h((e = e.apply(t, o)).next());
});
var p = "animation";
var E = "transition";
var Z = ["data-enter-phase", "data-enter-from", "data-enter-to", "data-enter-active", "data-leave-phase", "data-leave-from", "data-leave-to", "data-leave-active"];
function j(t) {
  return t ? t.disabled || !!(t.safe && te()) : false;
}
function V(t, o) {
  return t ? x(x({}, t), Object.entries(o).reduce((e, [i, u]) => {
    var a;
    return e[i] = (a = t[i]) != null ? a : u, e;
  }, {})) : x({}, o);
}
function _(t) {
  let { name: o, enterClass: e, leaveClass: i } = t || {};
  return { enter: { from: (e == null ? void 0 : e.from) || `${o}-enter-from`, to: (e == null ? void 0 : e.to) || `${o}-enter-to`, active: (e == null ? void 0 : e.active) || `${o}-enter-active` }, leave: { from: (i == null ? void 0 : i.from) || `${o}-leave-from`, to: (i == null ? void 0 : i.to) || `${o}-leave-to`, active: (i == null ? void 0 : i.active) || `${o}-leave-active` } };
}
function C(t) {
  return { enter: { onBefore: t == null ? void 0 : t.onBeforeEnter, onStart: t == null ? void 0 : t.onEnter, onAfter: t == null ? void 0 : t.onAfterEnter, onCancelled: t == null ? void 0 : t.onEnterCancelled }, leave: { onBefore: t == null ? void 0 : t.onBeforeLeave, onStart: t == null ? void 0 : t.onLeave, onAfter: t == null ? void 0 : t.onAfterLeave, onCancelled: t == null ? void 0 : t.onLeaveCancelled } };
}
function R2(t, o) {
  let e = window.getComputedStyle(t), i = (d) => {
    let l = e[`${d}Duration`].split(", ").map(se), m = e[`${d}Delay`].split(", ").map(se);
    return m.length < l.length && m.length > 0 && (m = l.map((v, b) => m[b % m.length])), [m, l];
  }, [u, a] = i(E), [M, h] = i(p), s = Math.max(...a.map((d, l) => d + u[l])), f = Math.max(...h.map((d, l) => d + M[l])), r, n = 0, c = 0;
  return o === E ? s > 0 && (r = E, n = s, c = a.length) : o === p ? f > 0 && (r = p, n = f, c = h.length) : (n = Math.max(s, f), r = n > 0 ? s > f ? E : p : void 0, c = r ? r === E ? a.length : h.length : 0), { type: r, timeout: n, count: c };
}
function q(t, o) {
  return typeof t == "number" ? t : t != null && typeof t == "object" && t[o] != null ? t[o] : null;
}
function W2(t, o) {
  return t ? `--${t}-${o}` : `--${o}`;
}
function g(t, o, e) {
  let { autoHeight: i, autoWidth: u, cssVarPrefix: a } = o, M = typeof e == "object";
  i && ue(t, W2(a, "height"), M ? e.height : e), u && ue(t, W2(a, "width"), M ? e.width : e);
}
function P(t, o) {
  if (!o.autoHeight && !o.autoWidth) return;
  let e = t.scrollHeight, i = t.scrollWidth;
  if (!e || !i) {
    let u = T(t);
    e || (e = u.height), i || (i = u.width);
  }
  g(t, o, { height: e + "px", width: i + "px" });
}
function z(t, o) {
  t.setAttribute(`data-${o}-phase`, "");
}
function O(t, o, e) {
  t.removeAttribute("data-enter-from"), t.removeAttribute("data-enter-to"), t.removeAttribute("data-leave-from"), t.removeAttribute("data-leave-to"), t.setAttribute(`data-${o}-${e}`, ""), t.setAttribute(`data-${o}-active`, "");
}
function T2(t) {
  t.removeAttribute("data-enter-phase"), t.removeAttribute("data-leave-phase");
}
function B(t) {
  Z.forEach((o) => t.removeAttribute(o));
}
var tt = Object.freeze({ name: "p", safe: true, disabled: false, enter: true, leave: true, autoHeight: true, autoWidth: true, cssVarPrefix: "" });
function dt(t, o) {
  if (!t) throw new Error("Element is required.");
  let e = {}, i = false, u = {}, a = null, M = {}, h = (r) => {
    for (let n of Object.keys(e)) delete e[n];
    if (Object.assign(e, V(r, tt)), !e.enter && !e.leave) throw new Error("Enter or leave must be true.");
    M = C(e), i = j(e), u = _(e), a = null;
  }, s = (r) => k(null, null, function* () {
    a == null || a();
    let n = t, { onBefore: c, onStart: d, onAfter: l, onCancelled: m } = M[r] || {}, v = { element: t };
    if (z(n, r), i) {
      c == null || c(v), d == null || d(v), l == null || l(v), T2(n), g(n, e, r === "enter" ? "auto" : "0px");
      return;
    }
    let { from: b, active: A, to: H } = u[r] || {};
    return c == null || c(v), r === "enter" ? g(n, e, "0px") : r === "leave" && P(n, e), R(n, b), R(n, A), O(n, r, "from"), n.offsetHeight, r === "enter" ? P(n, e) : r === "leave" && g(n, e, "0px"), W(n, b), R(n, H), O(n, r, "to"), d == null || d(v), new Promise((D) => {
      let U = q(e.duration, r), w = () => {
        W(n, [H, A]), a = null, B(n), T2(n);
      }, G = () => {
        w(), l == null || l(v), D(), r === "enter" ? g(n, e, "auto") : r === "leave" && g(n, e, "0px");
      }, L = () => {
      };
      a = () => {
        L(), w(), m == null || m(v), D();
      }, L = ot(n, e.type, U, G);
    });
  });
  h(o), g(t, e, "0px");
  let f = { enter: () => e.enter ? s("enter") : Promise.resolve(), leave: () => e.leave ? s("leave") : Promise.resolve(), cancel: () => {
    a == null || a(), a = null;
  }, update: (r, n) => {
    if (!r) throw new Error("Element is required.");
    t = r, f.cancel(), n && h(n);
  } };
  return e.appear && f.enter(), f;
}
var et = 0;
function ot(t, o, e, i) {
  let u = t._motionEndId = ++et, a = () => {
    u === t._motionEndId && i();
  };
  if (e != null) {
    let m = setTimeout(a, e);
    return () => clearTimeout(m);
  }
  let { type: M, timeout: h, count: s } = R2(t, o);
  if (!M) return i(), () => {
  };
  let f = M + "end", r = 0, n = () => {
    t.removeEventListener(f, d, true), clearTimeout(l);
  }, c = () => {
    n(), a();
  }, d = (m) => {
    m.target === t && ++r >= s && c();
  };
  t.addEventListener(f, d, { capture: true });
  let l = setTimeout(() => {
    r < s && c();
  }, h + 1);
  return n;
}

export {
  q,
  dt
};
//# sourceMappingURL=chunk-MSLT2XYH.js.map
