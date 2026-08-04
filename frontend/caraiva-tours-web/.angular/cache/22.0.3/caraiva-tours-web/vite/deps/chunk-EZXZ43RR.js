// node_modules/@primeuix/utils/dist/classnames/index.mjs
function c(...e) {
  let t = [];
  for (let s = 0; s < e.length; s++) {
    let n = e[s];
    if (!n) continue;
    let r = typeof n;
    if (r === "string" || r === "number") t.push(n);
    else if (r === "object") {
      let o = Array.isArray(n) ? [c(...n)] : Object.entries(n).map(([i, u]) => u ? i : void 0);
      t = o.length ? t.concat(o.filter((i) => !!i)) : t;
    }
  }
  return t.join(" ").trim();
}

export {
  c
};
//# sourceMappingURL=chunk-EZXZ43RR.js.map
