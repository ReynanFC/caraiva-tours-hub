import {
  c
} from "./chunk-EZXZ43RR.js";
import {
  Directive,
  HostBinding,
  Input,
  input,
  setClassMetadata,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵdefineDirective,
  ɵɵstyleProp
} from "./chunk-N3JMXNJE.js";
import {
  computed,
  signal
} from "./chunk-QAPLPPA7.js";

// node_modules/@primeicons/angular/fesm2022/primeicons-angular-core.mjs
var ICON_TEMPLATE = `
        @for (node of iconNodes(); track node[1]['key'] || $index) {
            @switch (node[0]) {
                @case ('path') {
                    <svg:path
                        [attr.d]="node[1]['d']"
                        [attr.fill]="node[1]['fill']"
                        [attr.fill-opacity]="node[1]['fillOpacity']"
                        [attr.fill-rule]="node[1]['fillRule']"
                        [attr.clip-rule]="node[1]['clipRule']"
                        [attr.stroke]="node[1]['stroke']"
                        [attr.stroke-width]="node[1]['strokeWidth']"
                        [attr.stroke-opacity]="node[1]['strokeOpacity']"
                        [attr.opacity]="node[1]['opacity']"
                    />
                }
                @case ('circle') {
                    <svg:circle
                        [attr.cx]="node[1]['cx']"
                        [attr.cy]="node[1]['cy']"
                        [attr.r]="node[1]['r']"
                        [attr.fill]="node[1]['fill']"
                        [attr.fill-opacity]="node[1]['fillOpacity']"
                        [attr.opacity]="node[1]['opacity']"
                    />
                }
                @case ('rect') {
                    <svg:rect
                        [attr.x]="node[1]['x']"
                        [attr.y]="node[1]['y']"
                        [attr.width]="node[1]['width']"
                        [attr.height]="node[1]['height']"
                        [attr.rx]="node[1]['rx']"
                        [attr.ry]="node[1]['ry']"
                        [attr.fill]="node[1]['fill']"
                        [attr.fill-opacity]="node[1]['fillOpacity']"
                        [attr.opacity]="node[1]['opacity']"
                    />
                }
                @case ('line') {
                    <svg:line
                        [attr.x1]="node[1]['x1']"
                        [attr.y1]="node[1]['y1']"
                        [attr.x2]="node[1]['x2']"
                        [attr.y2]="node[1]['y2']"
                        [attr.stroke]="node[1]['stroke']"
                        [attr.stroke-opacity]="node[1]['strokeOpacity']"
                        [attr.opacity]="node[1]['opacity']"
                    />
                }
                @case ('polyline') {
                    <svg:polyline
                        [attr.points]="node[1]['points']"
                        [attr.fill]="node[1]['fill']"
                        [attr.fill-opacity]="node[1]['fillOpacity']"
                        [attr.opacity]="node[1]['opacity']"
                    />
                }
                @case ('polygon') {
                    <svg:polygon
                        [attr.points]="node[1]['points']"
                        [attr.fill]="node[1]['fill']"
                        [attr.fill-opacity]="node[1]['fillOpacity']"
                        [attr.opacity]="node[1]['opacity']"
                    />
                }
                @case ('ellipse') {
                    <svg:ellipse
                        [attr.cx]="node[1]['cx']"
                        [attr.cy]="node[1]['cy']"
                        [attr.rx]="node[1]['rx']"
                        [attr.ry]="node[1]['ry']"
                        [attr.fill]="node[1]['fill']"
                        [attr.fill-opacity]="node[1]['fillOpacity']"
                        [attr.opacity]="node[1]['opacity']"
                    />
                }
            }
        }
`;
var CoreIcon = class _CoreIcon {
  _iconSignal = signal(null, ...ngDevMode ? [{
    debugName: "_iconSignal"
  }] : (
    /* istanbul ignore next */
    []
  ));
  get _icon() {
    return this._iconSignal();
  }
  set _icon(value) {
    this._iconSignal.set(value);
  }
  size = input(void 0, ...ngDevMode ? [{
    debugName: "size"
  }] : (
    /* istanbul ignore next */
    []
  ));
  color = input(void 0, ...ngDevMode ? [{
    debugName: "color"
  }] : (
    /* istanbul ignore next */
    []
  ));
  styleClass = input(void 0, ...ngDevMode ? [{
    debugName: "styleClass"
  }] : (
    /* istanbul ignore next */
    []
  ));
  spin = input(void 0, ...ngDevMode ? [{
    debugName: "spin"
  }] : (
    /* istanbul ignore next */
    []
  ));
  iconNodes = computed(() => this._iconSignal()?.nodes ?? [], ...ngDevMode ? [{
    debugName: "iconNodes"
  }] : (
    /* istanbul ignore next */
    []
  ));
  computedSize = computed(() => this.size() ?? 20, ...ngDevMode ? [{
    debugName: "computedSize"
  }] : (
    /* istanbul ignore next */
    []
  ));
  computedClass = computed(() => {
    const icon = this._iconSignal();
    return c("p-icon", icon?.name && `p-icon-${icon.name}`, this.spin() && "p-icon-spin", this.styleClass());
  }, ...ngDevMode ? [{
    debugName: "computedClass"
  }] : (
    /* istanbul ignore next */
    []
  ));
  get hostWidth() {
    return this.computedSize();
  }
  get hostHeight() {
    return this.computedSize();
  }
  get hostViewBox() {
    return this._iconSignal()?.svg?.viewBox;
  }
  get hostFill() {
    return this._iconSignal()?.svg?.fill;
  }
  get hostXmlns() {
    return this._iconSignal()?.svg?.xmlns;
  }
  hostAriaHidden = "true";
  get hostClass() {
    return this.computedClass();
  }
  get hostColor() {
    return this.color() || null;
  }
  get hostIconSize() {
    return this.size() ? `${this.size()}px` : null;
  }
  static ɵfac = function CoreIcon_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CoreIcon)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _CoreIcon,
    hostVars: 12,
    hostBindings: function CoreIcon_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("width", ctx.hostWidth)("height", ctx.hostHeight)("viewBox", ctx.hostViewBox)("fill", ctx.hostFill)("xmlns", ctx.hostXmlns)("aria-hidden", ctx.hostAriaHidden);
        ɵɵclassMap(ctx.hostClass);
        ɵɵstyleProp("color", ctx.hostColor)("--px-icon-size", ctx.hostIconSize);
      }
    },
    inputs: {
      size: [1, "size"],
      color: [1, "color"],
      styleClass: [1, "styleClass"],
      spin: [1, "spin"]
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CoreIcon, [{
    type: Directive
  }], null, {
    size: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "size",
        required: false
      }]
    }],
    color: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "color",
        required: false
      }]
    }],
    styleClass: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "styleClass",
        required: false
      }]
    }],
    spin: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "spin",
        required: false
      }]
    }],
    hostWidth: [{
      type: HostBinding,
      args: ["attr.width"]
    }],
    hostHeight: [{
      type: HostBinding,
      args: ["attr.height"]
    }],
    hostViewBox: [{
      type: HostBinding,
      args: ["attr.viewBox"]
    }],
    hostFill: [{
      type: HostBinding,
      args: ["attr.fill"]
    }],
    hostXmlns: [{
      type: HostBinding,
      args: ["attr.xmlns"]
    }],
    hostAriaHidden: [{
      type: HostBinding,
      args: ["attr.aria-hidden"]
    }],
    hostClass: [{
      type: HostBinding,
      args: ["class"]
    }],
    hostColor: [{
      type: HostBinding,
      args: ["style.color"]
    }],
    hostIconSize: [{
      type: HostBinding,
      args: ["style.--px-icon-size"]
    }]
  });
})();

export {
  ICON_TEMPLATE,
  CoreIcon
};
//# sourceMappingURL=chunk-Y5JDOCLT.js.map
