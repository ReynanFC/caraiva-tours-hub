import {
  e
} from "./chunk-QZPWBGZN.js";
import {
  BaseComponent
} from "./chunk-3KTBS3JL.js";
import {
  BaseStyle
} from "./chunk-ZQICQ6EM.js";
import {
  C2 as C,
  Pt,
  R,
  W,
  ie,
  jt,
  k,
  st
} from "./chunk-RB5ZFJAO.js";
import {
  isPlatformBrowser
} from "./chunk-KX2I6PVZ.js";
import {
  CoreIcon,
  ICON_TEMPLATE
} from "./chunk-Y5JDOCLT.js";
import {
  Component,
  Directive,
  Injectable,
  NgModule,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineNgModule,
  ɵɵdomElement,
  ɵɵgetInheritedFactory,
  ɵɵnextContext,
  ɵɵrepeater,
  ɵɵrepeaterCreate
} from "./chunk-N3JMXNJE.js";
import {
  effect,
  inject,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵnamespaceSVG
} from "./chunk-QAPLPPA7.js";

// node_modules/@primeuix/styles/dist/ripple/index.mjs
var style = "\n    .p-ink {\n        display: block;\n        position: absolute;\n        background: dt('ripple.background');\n        border-radius: 100%;\n        transform: scale(0);\n        pointer-events: none;\n    }\n\n    .p-ink-active {\n        animation: ripple 0.4s linear;\n    }\n\n    @keyframes ripple {\n        100% {\n            opacity: 0;\n            transform: scale(2.5);\n        }\n    }\n";

// node_modules/primeng/fesm2022/primeng-ripple.mjs
var style2 = (
  /*css*/
  `
    ${style}

    /* For PrimeNG */
    .p-ripple {
        overflow: hidden;
        position: relative;
    }

    .p-ripple-disabled .p-ink {
        display: none !important;
    }

    @keyframes ripple {
        100% {
            opacity: 0;
            transform: scale(2.5);
        }
    }
`
);
var classes = {
  root: "p-ink"
};
var RippleStyle = class _RippleStyle extends BaseStyle {
  name = "ripple";
  style = style2;
  classes = classes;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵRippleStyle_BaseFactory;
    return function RippleStyle_Factory(__ngFactoryType__) {
      return (ɵRippleStyle_BaseFactory || (ɵRippleStyle_BaseFactory = ɵɵgetInheritedFactory(_RippleStyle)))(__ngFactoryType__ || _RippleStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _RippleStyle,
    factory: _RippleStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RippleStyle, [{
    type: Injectable
  }], null, null);
})();
var RippleClasses;
(function(RippleClasses2) {
  RippleClasses2["root"] = "p-ink";
})(RippleClasses || (RippleClasses = {}));
var Ripple = class _Ripple extends BaseComponent {
  componentName = "Ripple";
  _componentStyle = inject(RippleStyle);
  animationListener;
  mouseDownListener;
  timeout;
  constructor() {
    super();
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        if (this.config.ripple()) {
          this.create();
          this.mouseDownListener = this.renderer.listen(this.el.nativeElement, "mousedown", this.onMouseDown.bind(this));
        } else {
          this.remove();
        }
      }
    });
  }
  onMouseDown(event) {
    let ink = this.getInk();
    if (!ink || this.document.defaultView?.getComputedStyle(ink, null).display === "none") {
      return;
    }
    !this.$unstyled() && W(ink, "p-ink-active");
    ink.setAttribute("data-p-ink-active", "false");
    if (!Pt(ink) && !jt(ink)) {
      let d = Math.max(C(this.el.nativeElement), k(this.el.nativeElement));
      ink.style.height = d + "px";
      ink.style.width = d + "px";
    }
    const offset = st(this.el.nativeElement);
    let x = event.pageX - offset.left + this.document.body.scrollTop - jt(ink) / 2;
    let y = event.pageY - offset.top + this.document.body.scrollLeft - Pt(ink) / 2;
    this.renderer.setStyle(ink, "top", y + "px");
    this.renderer.setStyle(ink, "left", x + "px");
    !this.$unstyled() && R(ink, "p-ink-active");
    ink.setAttribute("data-p-ink-active", "true");
    this.timeout = setTimeout(() => {
      let ink2 = this.getInk();
      if (ink2) {
        !this.$unstyled() && W(ink2, "p-ink-active");
        ink2.setAttribute("data-p-ink-active", "false");
      }
    }, 401);
  }
  getInk() {
    const children = this.el.nativeElement.children;
    for (let i = 0; i < children.length; i++) {
      if (typeof children[i].className === "string" && children[i].className.indexOf("p-ink") !== -1) {
        return children[i];
      }
    }
    return null;
  }
  resetInk() {
    let ink = this.getInk();
    if (ink) {
      !this.$unstyled() && W(ink, "p-ink-active");
      ink.setAttribute("data-p-ink-active", "false");
    }
  }
  onAnimationEnd(event) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    !this.$unstyled() && W(event.currentTarget, "p-ink-active");
    event.currentTarget.setAttribute("data-p-ink-active", "false");
  }
  create() {
    let ink = this.renderer.createElement("span");
    this.renderer.addClass(ink, "p-ink");
    this.renderer.appendChild(this.el.nativeElement, ink);
    this.renderer.setAttribute(ink, "data-p-ink", "true");
    this.renderer.setAttribute(ink, "data-p-ink-active", "false");
    this.renderer.setAttribute(ink, "aria-hidden", "true");
    this.renderer.setAttribute(ink, "role", "presentation");
    if (!this.animationListener) {
      this.animationListener = this.renderer.listen(ink, "animationend", this.onAnimationEnd.bind(this));
    }
  }
  remove() {
    let ink = this.getInk();
    if (ink) {
      this.mouseDownListener && this.mouseDownListener();
      this.animationListener && this.animationListener();
      this.mouseDownListener = null;
      this.animationListener = null;
      ie(ink);
    }
  }
  onDestroy() {
    if (this.config && this.config.ripple()) {
      this.remove();
    }
  }
  static ɵfac = function Ripple_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Ripple)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _Ripple,
    selectors: [["", "pRipple", ""]],
    hostAttrs: [1, "p-ripple"],
    features: [ɵɵProvidersFeature([RippleStyle]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Ripple, [{
    type: Directive,
    args: [{
      selector: "[pRipple]",
      host: {
        class: "p-ripple"
      },
      standalone: true,
      providers: [RippleStyle]
    }]
  }], () => [], null);
})();
var RippleModule = class _RippleModule {
  static ɵfac = function RippleModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RippleModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _RippleModule,
    imports: [Ripple],
    exports: [Ripple]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RippleModule, [{
    type: NgModule,
    args: [{
      imports: [Ripple],
      exports: [Ripple]
    }]
  }], null, null);
})();

// node_modules/@primeicons/angular/fesm2022/primeicons-angular-spinner.mjs
var _forTrack0 = ($index, $item) => $item[1]["key"] || $index;
function Spinner_For_1_Case_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "path");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("d", node_r1[1]["d"])("fill", node_r1[1]["fill"])("fill-opacity", node_r1[1]["fillOpacity"])("fill-rule", node_r1[1]["fillRule"])("clip-rule", node_r1[1]["clipRule"])("stroke", node_r1[1]["stroke"])("stroke-width", node_r1[1]["strokeWidth"])("stroke-opacity", node_r1[1]["strokeOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function Spinner_For_1_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "circle");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("cx", node_r1[1]["cx"])("cy", node_r1[1]["cy"])("r", node_r1[1]["r"])("fill", node_r1[1]["fill"])("fill-opacity", node_r1[1]["fillOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function Spinner_For_1_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "rect");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("x", node_r1[1]["x"])("y", node_r1[1]["y"])("width", node_r1[1]["width"])("height", node_r1[1]["height"])("rx", node_r1[1]["rx"])("ry", node_r1[1]["ry"])("fill", node_r1[1]["fill"])("fill-opacity", node_r1[1]["fillOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function Spinner_For_1_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "line");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("x1", node_r1[1]["x1"])("y1", node_r1[1]["y1"])("x2", node_r1[1]["x2"])("y2", node_r1[1]["y2"])("stroke", node_r1[1]["stroke"])("stroke-opacity", node_r1[1]["strokeOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function Spinner_For_1_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "polyline");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("points", node_r1[1]["points"])("fill", node_r1[1]["fill"])("fill-opacity", node_r1[1]["fillOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function Spinner_For_1_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "polygon");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("points", node_r1[1]["points"])("fill", node_r1[1]["fill"])("fill-opacity", node_r1[1]["fillOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function Spinner_For_1_Case_6_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "ellipse");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("cx", node_r1[1]["cx"])("cy", node_r1[1]["cy"])("rx", node_r1[1]["rx"])("ry", node_r1[1]["ry"])("fill", node_r1[1]["fill"])("fill-opacity", node_r1[1]["fillOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function Spinner_For_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, Spinner_For_1_Case_0_Template, 1, 9, ":svg:path")(1, Spinner_For_1_Case_1_Template, 1, 6, ":svg:circle")(2, Spinner_For_1_Case_2_Template, 1, 9, ":svg:rect")(3, Spinner_For_1_Case_3_Template, 1, 7, ":svg:line")(4, Spinner_For_1_Case_4_Template, 1, 4, ":svg:polyline")(5, Spinner_For_1_Case_5_Template, 1, 4, ":svg:polygon")(6, Spinner_For_1_Case_6_Template, 1, 7, ":svg:ellipse");
  }
  if (rf & 2) {
    let tmp_10_0;
    const node_r1 = ctx.$implicit;
    ɵɵconditional((tmp_10_0 = node_r1[0]) === "path" ? 0 : tmp_10_0 === "circle" ? 1 : tmp_10_0 === "rect" ? 2 : tmp_10_0 === "line" ? 3 : tmp_10_0 === "polyline" ? 4 : tmp_10_0 === "polygon" ? 5 : tmp_10_0 === "ellipse" ? 6 : -1);
  }
}
var Spinner = class _Spinner extends CoreIcon {
  constructor() {
    super();
    this._icon = e;
  }
  static ɵfac = function Spinner_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Spinner)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _Spinner,
    selectors: [["svg", "data-p-icon", "spinner"]],
    features: [ɵɵInheritDefinitionFeature],
    decls: 2,
    vars: 0,
    template: function Spinner_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵrepeaterCreate(0, Spinner_For_1_Template, 7, 1, null, null, _forTrack0);
      }
      if (rf & 2) {
        ɵɵrepeater(ctx.iconNodes());
      }
    },
    encapsulation: 2,
    changeDetection: 1
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Spinner, [{
    type: Component,
    args: [{
      selector: 'svg[data-p-icon="spinner"]',
      standalone: true,
      template: ICON_TEMPLATE
    }]
  }], () => [], null);
})();

export {
  Ripple,
  Spinner
};
//# sourceMappingURL=chunk-IKJBIBEI.js.map
