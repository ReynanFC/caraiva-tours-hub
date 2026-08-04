import {
  CommonModule
} from "./chunk-5VJJ3J2A.js";
import {
  B,
  N,
  N2,
  R2 as R,
  S,
  b,
  d,
  de,
  ee,
  gs,
  x
} from "./chunk-AEO4L2CH.js";
import {
  Component,
  Directive,
  Injectable,
  Input,
  NgModule,
  TemplateRef,
  provideAppInitializer,
  setClassMetadata,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵgetInheritedFactory,
  ɵɵprojection,
  ɵɵprojectionDef
} from "./chunk-N3JMXNJE.js";
import {
  DOCUMENT,
  InjectionToken,
  PLATFORM_ID,
  effect,
  inject,
  makeEnvironmentProviders,
  signal,
  untracked,
  ɵɵdefineInjectable,
  ɵɵdefineInjector
} from "./chunk-QAPLPPA7.js";
import {
  Subject
} from "./chunk-RSS3ODKE.js";
import {
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// node_modules/primeng/fesm2022/primeng-api.mjs
var _c0 = ["*"];
var ConfirmEventType;
(function(ConfirmEventType2) {
  ConfirmEventType2[ConfirmEventType2["ACCEPT"] = 0] = "ACCEPT";
  ConfirmEventType2[ConfirmEventType2["REJECT"] = 1] = "REJECT";
  ConfirmEventType2[ConfirmEventType2["CANCEL"] = 2] = "CANCEL";
})(ConfirmEventType || (ConfirmEventType = {}));
var ConfirmationService = class _ConfirmationService {
  requireConfirmationSource = new Subject();
  acceptConfirmationSource = new Subject();
  requireConfirmation$ = this.requireConfirmationSource.asObservable();
  accept = this.acceptConfirmationSource.asObservable();
  /**
   * Callback to invoke on confirm.
   * @param {Confirmation} confirmation - Represents a confirmation dialog configuration.
   * @group Method
   */
  confirm(confirmation) {
    this.requireConfirmationSource.next(confirmation);
    return this;
  }
  /**
   * Closes the dialog.
   * @group Method
   */
  close() {
    this.requireConfirmationSource.next(null);
    return this;
  }
  /**
   * Accepts the dialog.
   * @group Method
   */
  onAccept() {
    this.acceptConfirmationSource.next(null);
  }
  static ɵfac = function ConfirmationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ConfirmationService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ConfirmationService,
    factory: _ConfirmationService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConfirmationService, [{
    type: Injectable
  }], null, null);
})();
var ContextMenuService = class _ContextMenuService {
  activeItemKeyChange = new Subject();
  activeItemKeyChange$ = this.activeItemKeyChange.asObservable();
  activeItemKey;
  changeKey(key) {
    this.activeItemKey = key;
    this.activeItemKeyChange.next(this.activeItemKey);
  }
  reset() {
    this.activeItemKey = null;
    this.activeItemKeyChange.next(this.activeItemKey);
  }
  static ɵfac = function ContextMenuService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ContextMenuService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ContextMenuService,
    factory: _ContextMenuService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContextMenuService, [{
    type: Injectable
  }], null, null);
})();
var FilterMatchMode = class {
  static STARTS_WITH = "startsWith";
  static CONTAINS = "contains";
  static NOT_CONTAINS = "notContains";
  static ENDS_WITH = "endsWith";
  static EQUALS = "equals";
  static NOT_EQUALS = "notEquals";
  static IN = "in";
  static LESS_THAN = "lt";
  static LESS_THAN_OR_EQUAL_TO = "lte";
  static GREATER_THAN = "gt";
  static GREATER_THAN_OR_EQUAL_TO = "gte";
  static BETWEEN = "between";
  static IS = "is";
  static IS_NOT = "isNot";
  static BEFORE = "before";
  static AFTER = "after";
  static DATE_IS = "dateIs";
  static DATE_IS_NOT = "dateIsNot";
  static DATE_BEFORE = "dateBefore";
  static DATE_AFTER = "dateAfter";
};
var FilterService = class _FilterService {
  filter(value, fields, filterValue, filterMatchMode, filterLocale) {
    let filteredItems = [];
    if (value) {
      for (let item of value) {
        for (let field of fields) {
          let fieldValue = d(item, field);
          if (this.filters[filterMatchMode](fieldValue, filterValue, filterLocale)) {
            filteredItems.push(item);
            break;
          }
        }
      }
    }
    return filteredItems;
  }
  filters = {
    startsWith: (value, filter, filterLocale) => {
      if (filter === void 0 || filter === null || typeof filter === "string" && filter.trim() === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      let filterValue = ee(filter.toString()).toLocaleLowerCase(filterLocale);
      let stringValue = ee(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.slice(0, filterValue.length) === filterValue;
    },
    contains: (value, filter, filterLocale) => {
      if (filter === void 0 || filter === null || typeof filter === "string" && filter.trim() === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      let filterValue = ee(filter.toString()).toLocaleLowerCase(filterLocale);
      let stringValue = ee(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.indexOf(filterValue) !== -1;
    },
    notContains: (value, filter, filterLocale) => {
      if (filter === void 0 || filter === null || typeof filter === "string" && filter.trim() === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      let filterValue = ee(filter.toString()).toLocaleLowerCase(filterLocale);
      let stringValue = ee(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.indexOf(filterValue) === -1;
    },
    endsWith: (value, filter, filterLocale) => {
      if (filter === void 0 || filter === null || typeof filter === "string" && filter.trim() === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      let filterValue = ee(filter.toString()).toLocaleLowerCase(filterLocale);
      let stringValue = ee(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.indexOf(filterValue, stringValue.length - filterValue.length) !== -1;
    },
    equals: (value, filter, filterLocale) => {
      if (filter === void 0 || filter === null || typeof filter === "string" && filter.trim() === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter.getTime) return value.getTime() === filter.getTime();
      else if (value == filter) return true;
      else return ee(value.toString()).toLocaleLowerCase(filterLocale) == ee(filter.toString()).toLocaleLowerCase(filterLocale);
    },
    notEquals: (value, filter, filterLocale) => {
      if (filter === void 0 || filter === null || typeof filter === "string" && filter.trim() === "") {
        return false;
      }
      if (value === void 0 || value === null) {
        return true;
      }
      if (value.getTime && filter.getTime) return value.getTime() !== filter.getTime();
      else if (value == filter) return false;
      else return ee(value.toString()).toLocaleLowerCase(filterLocale) != ee(filter.toString()).toLocaleLowerCase(filterLocale);
    },
    in: (value, filter) => {
      if (filter === void 0 || filter === null || filter.length === 0) {
        return true;
      }
      for (let i2 = 0; i2 < filter.length; i2++) {
        if (b(value, filter[i2])) {
          return true;
        }
      }
      return false;
    },
    between: (value, filter) => {
      if (filter == null || filter[0] == null || filter[1] == null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime) return filter[0].getTime() <= value.getTime() && value.getTime() <= filter[1].getTime();
      else return filter[0] <= value && value <= filter[1];
    },
    lt: (value, filter, filterLocale) => {
      if (filter === void 0 || filter === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter.getTime) return value.getTime() < filter.getTime();
      else return value < filter;
    },
    lte: (value, filter, filterLocale) => {
      if (filter === void 0 || filter === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter.getTime) return value.getTime() <= filter.getTime();
      else return value <= filter;
    },
    gt: (value, filter, filterLocale) => {
      if (filter === void 0 || filter === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter.getTime) return value.getTime() > filter.getTime();
      else return value > filter;
    },
    gte: (value, filter, filterLocale) => {
      if (filter === void 0 || filter === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter.getTime) return value.getTime() >= filter.getTime();
      else return value >= filter;
    },
    is: (value, filter, filterLocale) => {
      return this.filters.equals(value, filter, filterLocale);
    },
    isNot: (value, filter, filterLocale) => {
      return this.filters.notEquals(value, filter, filterLocale);
    },
    before: (value, filter, filterLocale) => {
      return this.filters.lt(value, filter, filterLocale);
    },
    after: (value, filter, filterLocale) => {
      return this.filters.gt(value, filter, filterLocale);
    },
    dateIs: (value, filter) => {
      if (filter === void 0 || filter === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      return value.toDateString() === filter.toDateString();
    },
    dateIsNot: (value, filter) => {
      if (filter === void 0 || filter === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      return value.toDateString() !== filter.toDateString();
    },
    dateBefore: (value, filter) => {
      if (filter === void 0 || filter === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      return value.getTime() < filter.getTime();
    },
    dateAfter: (value, filter) => {
      if (filter === void 0 || filter === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      value.setHours(0, 0, 0, 0);
      return value.getTime() > filter.getTime();
    }
  };
  register(rule, fn) {
    this.filters[rule] = fn;
  }
  static ɵfac = function FilterService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FilterService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FilterService,
    factory: _FilterService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FilterService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var MessageService = class _MessageService {
  messageSource = new Subject();
  clearSource = new Subject();
  messageObserver = this.messageSource.asObservable();
  clearObserver = this.clearSource.asObservable();
  /**
   * Inserts single message.
   * @param {ToastMessageOptions} message - Message to be added.
   * @group Method
   */
  add(message) {
    if (message) {
      this.messageSource.next(message);
    }
  }
  /**
   * Inserts new messages.
   * @param {Message[]} messages - Messages to be added.
   * @group Method
   */
  addAll(messages) {
    if (messages && messages.length) {
      this.messageSource.next(messages);
    }
  }
  /**
   * Clears the message with the given key.
   * @param {string} key - Key of the message to be cleared.
   * @group Method
   */
  clear(key) {
    this.clearSource.next(key || null);
  }
  static ɵfac = function MessageService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MessageService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _MessageService,
    factory: _MessageService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MessageService, [{
    type: Injectable
  }], null, null);
})();
var OverlayService = class _OverlayService {
  clickSource = new Subject();
  parentDragSource = new Subject();
  clickObservable = this.clickSource.asObservable();
  parentDragObservable = this.parentDragSource.asObservable();
  add(event) {
    if (event) {
      this.clickSource.next(event);
    }
  }
  emitParentDrag(container) {
    this.parentDragSource.next(container);
  }
  static ɵfac = function OverlayService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OverlayService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _OverlayService,
    factory: _OverlayService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var Header = class _Header {
  static ɵfac = function Header_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Header)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _Header,
    selectors: [["p-header"]],
    standalone: false,
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function Header_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Header, [{
    type: Component,
    args: [{
      selector: "p-header",
      template: "<ng-content></ng-content>",
      standalone: false
    }]
  }], null, null);
})();
var Footer = class _Footer {
  static ɵfac = function Footer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Footer)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _Footer,
    selectors: [["p-footer"]],
    standalone: false,
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function Footer_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Footer, [{
    type: Component,
    args: [{
      selector: "p-footer",
      template: "<ng-content></ng-content>",
      standalone: false
    }]
  }], null, null);
})();
var PrimeTemplate = class _PrimeTemplate {
  template;
  type;
  name;
  constructor(template) {
    this.template = template;
  }
  getType() {
    return this.name;
  }
  static ɵfac = function PrimeTemplate_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PrimeTemplate)(ɵɵdirectiveInject(TemplateRef));
  };
  static ɵdir = ɵɵdefineDirective({
    type: _PrimeTemplate,
    selectors: [["", "pTemplate", ""]],
    inputs: {
      type: "type",
      name: [0, "pTemplate", "name"]
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PrimeTemplate, [{
    type: Directive,
    args: [{
      selector: "[pTemplate]",
      standalone: true
    }]
  }], () => [{
    type: TemplateRef
  }], {
    type: [{
      type: Input
    }],
    name: [{
      type: Input,
      args: ["pTemplate"]
    }]
  });
})();
var SharedModule = class _SharedModule {
  static ɵfac = function SharedModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SharedModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _SharedModule,
    declarations: [Header, Footer],
    imports: [CommonModule, PrimeTemplate],
    exports: [Header, Footer, PrimeTemplate]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [CommonModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SharedModule, [{
    type: NgModule,
    args: [{
      imports: [CommonModule, PrimeTemplate],
      exports: [Header, Footer, PrimeTemplate],
      declarations: [Header, Footer]
    }]
  }], null, null);
})();
var TreeDragDropService = class _TreeDragDropService {
  dragStartSource = new Subject();
  dragStopSource = new Subject();
  dragStart$ = this.dragStartSource.asObservable();
  dragStop$ = this.dragStopSource.asObservable();
  startDrag(event) {
    this.dragStartSource.next(event);
  }
  stopDrag(event) {
    this.dragStopSource.next(event);
  }
  static ɵfac = function TreeDragDropService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TreeDragDropService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _TreeDragDropService,
    factory: _TreeDragDropService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TreeDragDropService, [{
    type: Injectable
  }], null, null);
})();

// node_modules/@primeuix/styles/dist/base/index.mjs
var style = "\n    *,\n    ::before,\n    ::after {\n        box-sizing: border-box;\n    }\n\n    .p-component {\n        font-family: dt('typography.font.family');\n        font-feature-settings: inherit;\n        line-height: dt('typography.line.height');\n    }\n\n    .p-collapsible-enter-active {\n        animation: p-animate-collapsible-expand 0.2s ease-out;\n        overflow: hidden;\n    }\n\n    .p-collapsible-leave-active {\n        animation: p-animate-collapsible-collapse 0.2s ease-out;\n        overflow: hidden;\n    }\n\n    @keyframes p-animate-collapsible-expand {\n        from {\n            grid-template-rows: 0fr;\n        }\n        to {\n            grid-template-rows: 1fr;\n        }\n    }\n\n    @keyframes p-animate-collapsible-collapse {\n        from {\n            grid-template-rows: 1fr;\n        }\n        to {\n            grid-template-rows: 0fr;\n        }\n    }\n\n    .p-disabled,\n    .p-disabled * {\n        cursor: default;\n        pointer-events: none;\n        user-select: none;\n    }\n\n    .p-disabled,\n    .p-component:disabled {\n        opacity: dt('disabled.opacity');\n    }\n\n    .pi {\n        font-size: dt('icon.size');\n    }\n\n    .p-icon {\n        width: var(--px-icon-size, dt('icon.size'));\n        height: var(--px-icon-size, dt('icon.size'));\n        flex-shrink: 0;\n    }\n\n    .p-icon-spin {\n        -webkit-animation: p-icon-spin 2s infinite linear;\n        animation: p-icon-spin 2s infinite linear;\n    }\n\n    @-webkit-keyframes p-icon-spin {\n        0% {\n            -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n        }\n        100% {\n            -webkit-transform: rotate(359deg);\n            transform: rotate(359deg);\n        }\n    }\n\n    @keyframes p-icon-spin {\n        0% {\n            -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n        }\n        100% {\n            -webkit-transform: rotate(359deg);\n            transform: rotate(359deg);\n        }\n    }\n\n    .p-overlay-mask {\n        background: var(--px-mask-background, dt('mask.background'));\n        color: dt('mask.color');\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n    }\n\n    .p-overlay-mask-enter-active {\n        animation: p-animate-overlay-mask-enter dt('mask.transition.duration') forwards;\n    }\n\n    .p-overlay-mask-leave-active {\n        animation: p-animate-overlay-mask-leave dt('mask.transition.duration') forwards;\n    }\n\n    @keyframes p-animate-overlay-mask-enter {\n        from {\n            background: transparent;\n        }\n        to {\n            background: var(--px-mask-background, dt('mask.background'));\n        }\n    }\n    @keyframes p-animate-overlay-mask-leave {\n        from {\n            background: var(--px-mask-background, dt('mask.background'));\n        }\n        to {\n            background: transparent;\n        }\n    }\n\n    .p-anchored-overlay-enter-active {\n        animation: p-animate-anchored-overlay-enter 300ms cubic-bezier(.19,1,.22,1);\n    }\n\n    .p-anchored-overlay-leave-active {\n        animation: p-animate-anchored-overlay-leave 300ms cubic-bezier(.19,1,.22,1);\n    }\n\n    @keyframes p-animate-anchored-overlay-enter {\n        from {\n            opacity: 0;\n            transform: scale(0.93);\n        }\n    }\n\n    @keyframes p-animate-anchored-overlay-leave {\n        to {\n            opacity: 0;\n            transform: scale(0.93);\n        }\n    }\n";

// node_modules/primeng/fesm2022/primeng-usestyle.mjs
var _id = 0;
var UseStyle = class _UseStyle {
  document = inject(DOCUMENT);
  use(css2, options = {}) {
    let isLoaded = false;
    let cssRef = css2;
    let styleRef = null;
    const {
      immediate = true,
      manual = false,
      name = `style_${++_id}`,
      id = void 0,
      media = void 0,
      nonce = void 0,
      first = false,
      props = {}
    } = options;
    if (!this.document) return;
    styleRef = this.document.querySelector(`style[data-primeng-style-id="${name}"]`) || id && this.document.getElementById(id) || this.document.createElement("style");
    if (styleRef) {
      if (!styleRef.isConnected) {
        cssRef = css2;
        const HEAD = this.document.head;
        de(styleRef, "nonce", nonce);
        first && HEAD.firstChild ? HEAD.insertBefore(styleRef, HEAD.firstChild) : HEAD.appendChild(styleRef);
        N(styleRef, {
          type: "text/css",
          media,
          nonce,
          "data-primeng-style-id": name
        });
      }
      if (styleRef.textContent !== cssRef) {
        styleRef.textContent = cssRef;
      }
    }
    return {
      id,
      name,
      el: styleRef,
      css: cssRef
    };
  }
  static ɵfac = function UseStyle_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UseStyle)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _UseStyle,
    factory: _UseStyle.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UseStyle, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// node_modules/primeng/fesm2022/primeng-base.mjs
var base = {
  _loadedStyleNames: /* @__PURE__ */ new Set(),
  getLoadedStyleNames() {
    return this._loadedStyleNames;
  },
  isStyleNameLoaded(name) {
    return this._loadedStyleNames.has(name);
  },
  setLoadedStyleName(name) {
    this._loadedStyleNames.add(name);
  },
  deleteLoadedStyleName(name) {
    this._loadedStyleNames.delete(name);
  },
  clearLoadedStyleNames() {
    this._loadedStyleNames.clear();
  }
};
var css = (
  /*css*/
  `
.p-hidden-accessible {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
}

.p-hidden-accessible input,
.p-hidden-accessible select {
    transform: scale(0);
}

.p-overflow-hidden {
    overflow: hidden;
    padding-right: dt('scrollbar.width');
}
`
);
var BaseStyle = class _BaseStyle {
  name = "base";
  useStyle = inject(UseStyle);
  css = void 0;
  style = void 0;
  classes = {};
  inlineStyles = {};
  load = (style2, options = {}, transform = (cs) => cs) => {
    const computedStyle = transform(gs`${x(style2, {
      dt: N2
    })}`);
    return computedStyle ? this.useStyle.use(B(computedStyle), __spreadValues({
      name: this.name
    }, options)) : {};
  };
  loadCSS = (options = {}) => {
    return this.load(this.css, options);
  };
  loadStyle = (options = {}, style2 = "") => {
    return this.load(this.style, options, (computedStyle = "") => S.transformCSS(options.name || this.name, `${computedStyle}${gs`${style2}`}`));
  };
  loadBaseCSS = (options = {}) => {
    return this.load(css, options);
  };
  loadBaseStyle = (options = {}, style$1 = "") => {
    return this.load(style, options, (computedStyle = "") => S.transformCSS(options.name || this.name, `${computedStyle}${gs`${style$1}`}`));
  };
  getCommonTheme = (params) => {
    return S.getCommon(this.name, params);
  };
  getComponentTheme = (params) => {
    return S.getComponent(this.name, params);
  };
  getPresetTheme = (preset, selector, params) => {
    return S.getCustomPreset(this.name, preset, selector, params);
  };
  getLayerOrderThemeCSS = () => {
    return S.getLayerOrderCSS(this.name);
  };
  getStyleSheet = (extendedCSS = "", props = {}) => {
    if (this.css) {
      const _css = x(this.css, {
        dt: N2
      });
      const _style = B(gs`${_css}${extendedCSS}`);
      const _props = Object.entries(props).reduce((acc, [k, v2]) => acc.push(`${k}="${v2}"`) && acc, []).join(" ");
      return `<style type="text/css" data-primeng-style-id="${this.name}" ${_props}>${_style}</style>`;
    }
    return "";
  };
  getCommonThemeStyleSheet = (params, props = {}) => {
    return S.getCommonStyleSheet(this.name, params, props);
  };
  getThemeStyleSheet = (params, props = {}) => {
    let css2 = [S.getStyleSheet(this.name, params, props)];
    if (this.style) {
      const name = this.name === "base" ? "global-style" : `${this.name}-style`;
      const _css = gs`${x(this.style, {
        dt: N2
      })}`;
      const _style = B(S.transformCSS(name, _css));
      const _props = Object.entries(props).reduce((acc, [k, v2]) => acc.push(`${k}="${v2}"`) && acc, []).join(" ");
      css2.push(`<style type="text/css" data-primeng-style-id="${name}" ${_props}>${_style}</style>`);
    }
    return css2.join("");
  };
  static ɵfac = function BaseStyle_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BaseStyle)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _BaseStyle,
    factory: _BaseStyle.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BaseStyle, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// node_modules/@noble/ed25519/index.js
var ed25519_CURVE = {
  p: 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedn,
  n: 0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn,
  h: 8n,
  a: 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffecn,
  d: 0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3n,
  Gx: 0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an,
  Gy: 0x6666666666666666666666666666666666666666666666666666666666666658n
};
var { p: P, n: N3, Gx, Gy, a: _a, d: _d } = ed25519_CURVE;
var h = 8n;
var L = 32;
var L2 = 64;
var err = (m2 = "") => {
  throw new Error(m2);
};
var isBig = (n2) => typeof n2 === "bigint";
var isStr = (s) => typeof s === "string";
var isBytes = (a2) => a2 instanceof Uint8Array || ArrayBuffer.isView(a2) && a2.constructor.name === "Uint8Array";
var abytes = (a2, l2) => !isBytes(a2) || typeof l2 === "number" && l2 > 0 && a2.length !== l2 ? err("Uint8Array expected") : a2;
var u8n = (len) => new Uint8Array(len);
var u8fr = (buf) => Uint8Array.from(buf);
var padh = (n2, pad) => n2.toString(16).padStart(pad, "0");
var bytesToHex = (b3) => Array.from(abytes(b3)).map((e) => padh(e, 2)).join("");
var C = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
var _ch = (ch) => {
  if (ch >= C._0 && ch <= C._9)
    return ch - C._0;
  if (ch >= C.A && ch <= C.F)
    return ch - (C.A - 10);
  if (ch >= C.a && ch <= C.f)
    return ch - (C.a - 10);
  return;
};
var hexToBytes = (hex) => {
  const e = "hex invalid";
  if (!isStr(hex))
    return err(e);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    return err(e);
  const array = u8n(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = _ch(hex.charCodeAt(hi));
    const n2 = _ch(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0)
      return err(e);
    array[ai] = n1 * 16 + n2;
  }
  return array;
};
var toU8 = (a2, len) => abytes(isStr(a2) ? hexToBytes(a2) : u8fr(abytes(a2)), len);
var cr = () => globalThis?.crypto;
var subtle = () => cr()?.subtle ?? err("crypto.subtle must be defined");
var concatBytes = (...arrs) => {
  const r = u8n(arrs.reduce((sum, a2) => sum + abytes(a2).length, 0));
  let pad = 0;
  arrs.forEach((a2) => {
    r.set(a2, pad);
    pad += a2.length;
  });
  return r;
};
var randomBytes = (len = L) => {
  const c2 = cr();
  return c2.getRandomValues(u8n(len));
};
var big = BigInt;
var arange = (n2, min, max, msg = "bad number: out of range") => isBig(n2) && min <= n2 && n2 < max ? n2 : err(msg);
var M = (a2, b3 = P) => {
  const r = a2 % b3;
  return r >= 0n ? r : b3 + r;
};
var modN = (a2) => M(a2, N3);
var invert = (num, md) => {
  if (num === 0n || md <= 0n)
    err("no inverse n=" + num + " mod=" + md);
  let a2 = M(num, md), b3 = md, x3 = 0n, y2 = 1n, u2 = 1n, v2 = 0n;
  while (a2 !== 0n) {
    const q = b3 / a2, r = b3 % a2;
    const m2 = x3 - u2 * q, n2 = y2 - v2 * q;
    b3 = a2, a2 = r, x3 = u2, y2 = v2, u2 = m2, v2 = n2;
  }
  return b3 === 1n ? M(x3, md) : err("no inverse");
};
var callHash = (name) => {
  const fn = etc[name];
  if (typeof fn !== "function")
    err("hashes." + name + " not set");
  return fn;
};
var apoint = (p2) => p2 instanceof Point ? p2 : err("Point expected");
var B256 = 2n ** 256n;
var Point = class _Point {
  static BASE;
  static ZERO;
  ex;
  ey;
  ez;
  et;
  constructor(ex, ey, ez, et) {
    const max = B256;
    this.ex = arange(ex, 0n, max);
    this.ey = arange(ey, 0n, max);
    this.ez = arange(ez, 1n, max);
    this.et = arange(et, 0n, max);
    Object.freeze(this);
  }
  static fromAffine(p2) {
    return new _Point(p2.x, p2.y, 1n, M(p2.x * p2.y));
  }
  /** RFC8032 5.1.3: Uint8Array to Point. */
  static fromBytes(hex, zip215 = false) {
    const d3 = _d;
    const normed = u8fr(abytes(hex, L));
    const lastByte = hex[31];
    normed[31] = lastByte & ~128;
    const y2 = bytesToNumLE(normed);
    const max = zip215 ? B256 : P;
    arange(y2, 0n, max);
    const y22 = M(y2 * y2);
    const u2 = M(y22 - 1n);
    const v2 = M(d3 * y22 + 1n);
    let { isValid, value: x3 } = uvRatio(u2, v2);
    if (!isValid)
      err("bad point: y not sqrt");
    const isXOdd = (x3 & 1n) === 1n;
    const isLastByteOdd = (lastByte & 128) !== 0;
    if (!zip215 && x3 === 0n && isLastByteOdd)
      err("bad point: x==0, isLastByteOdd");
    if (isLastByteOdd !== isXOdd)
      x3 = M(-x3);
    return new _Point(x3, y2, 1n, M(x3 * y2));
  }
  /** Checks if the point is valid and on-curve. */
  assertValidity() {
    const a2 = _a;
    const d3 = _d;
    const p2 = this;
    if (p2.is0())
      throw new Error("bad point: ZERO");
    const { ex: X, ey: Y, ez: Z, et: T } = p2;
    const X2 = M(X * X);
    const Y2 = M(Y * Y);
    const Z2 = M(Z * Z);
    const Z4 = M(Z2 * Z2);
    const aX2 = M(X2 * a2);
    const left = M(Z2 * M(aX2 + Y2));
    const right = M(Z4 + M(d3 * M(X2 * Y2)));
    if (left !== right)
      throw new Error("bad point: equation left != right (1)");
    const XY = M(X * Y);
    const ZT = M(Z * T);
    if (XY !== ZT)
      throw new Error("bad point: equation left != right (2)");
    return this;
  }
  /** Equality check: compare points P&Q. */
  equals(other) {
    const { ex: X1, ey: Y1, ez: Z1 } = this;
    const { ex: X2, ey: Y2, ez: Z2 } = apoint(other);
    const X1Z2 = M(X1 * Z2);
    const X2Z1 = M(X2 * Z1);
    const Y1Z2 = M(Y1 * Z2);
    const Y2Z1 = M(Y2 * Z1);
    return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
  }
  is0() {
    return this.equals(I);
  }
  /** Flip point over y coordinate. */
  negate() {
    return new _Point(M(-this.ex), this.ey, this.ez, M(-this.et));
  }
  /** Point doubling. Complete formula. Cost: `4M + 4S + 1*a + 6add + 1*2`. */
  double() {
    const { ex: X1, ey: Y1, ez: Z1 } = this;
    const a2 = _a;
    const A = M(X1 * X1);
    const B2 = M(Y1 * Y1);
    const C2 = M(2n * M(Z1 * Z1));
    const D = M(a2 * A);
    const x1y1 = X1 + Y1;
    const E = M(M(x1y1 * x1y1) - A - B2);
    const G2 = D + B2;
    const F = G2 - C2;
    const H = D - B2;
    const X3 = M(E * F);
    const Y3 = M(G2 * H);
    const T3 = M(E * H);
    const Z3 = M(F * G2);
    return new _Point(X3, Y3, Z3, T3);
  }
  /** Point addition. Complete formula. Cost: `8M + 1*k + 8add + 1*2`. */
  add(other) {
    const { ex: X1, ey: Y1, ez: Z1, et: T1 } = this;
    const { ex: X2, ey: Y2, ez: Z2, et: T2 } = apoint(other);
    const a2 = _a;
    const d3 = _d;
    const A = M(X1 * X2);
    const B2 = M(Y1 * Y2);
    const C2 = M(T1 * d3 * T2);
    const D = M(Z1 * Z2);
    const E = M((X1 + Y1) * (X2 + Y2) - A - B2);
    const F = M(D - C2);
    const G2 = M(D + C2);
    const H = M(B2 - a2 * A);
    const X3 = M(E * F);
    const Y3 = M(G2 * H);
    const T3 = M(E * H);
    const Z3 = M(F * G2);
    return new _Point(X3, Y3, Z3, T3);
  }
  /**
   * Point-by-scalar multiplication. Scalar must be in range 1 <= n < CURVE.n.
   * Uses {@link wNAF} for base point.
   * Uses fake point to mitigate side-channel leakage.
   * @param n scalar by which point is multiplied
   * @param safe safe mode guards against timing attacks; unsafe mode is faster
   */
  multiply(n2, safe = true) {
    if (!safe && (n2 === 0n || this.is0()))
      return I;
    arange(n2, 1n, N3);
    if (n2 === 1n)
      return this;
    if (this.equals(G))
      return wNAF(n2).p;
    let p2 = I;
    let f2 = G;
    for (let d3 = this; n2 > 0n; d3 = d3.double(), n2 >>= 1n) {
      if (n2 & 1n)
        p2 = p2.add(d3);
      else if (safe)
        f2 = f2.add(d3);
    }
    return p2;
  }
  /** Convert point to 2d xy affine point. (X, Y, Z) ∋ (x=X/Z, y=Y/Z) */
  toAffine() {
    const { ex: x3, ey: y2, ez: z } = this;
    if (this.equals(I))
      return { x: 0n, y: 1n };
    const iz = invert(z, P);
    if (M(z * iz) !== 1n)
      err("invalid inverse");
    return { x: M(x3 * iz), y: M(y2 * iz) };
  }
  toBytes() {
    const { x: x3, y: y2 } = this.assertValidity().toAffine();
    const b3 = numTo32bLE(y2);
    b3[31] |= x3 & 1n ? 128 : 0;
    return b3;
  }
  toHex() {
    return bytesToHex(this.toBytes());
  }
  // encode to hex string
  clearCofactor() {
    return this.multiply(big(h), false);
  }
  isSmallOrder() {
    return this.clearCofactor().is0();
  }
  isTorsionFree() {
    let p2 = this.multiply(N3 / 2n, false).double();
    if (N3 % 2n)
      p2 = p2.add(this);
    return p2.is0();
  }
  static fromHex(hex, zip215) {
    return _Point.fromBytes(toU8(hex), zip215);
  }
  get x() {
    return this.toAffine().x;
  }
  get y() {
    return this.toAffine().y;
  }
  toRawBytes() {
    return this.toBytes();
  }
};
var G = new Point(Gx, Gy, 1n, M(Gx * Gy));
var I = new Point(0n, 1n, 1n, 0n);
Point.BASE = G;
Point.ZERO = I;
var numTo32bLE = (num) => hexToBytes(padh(arange(num, 0n, B256), L2)).reverse();
var bytesToNumLE = (b3) => big("0x" + bytesToHex(u8fr(abytes(b3)).reverse()));
var pow2 = (x3, power) => {
  let r = x3;
  while (power-- > 0n) {
    r *= r;
    r %= P;
  }
  return r;
};
var pow_2_252_3 = (x3) => {
  const x22 = x3 * x3 % P;
  const b22 = x22 * x3 % P;
  const b4 = pow2(b22, 2n) * b22 % P;
  const b5 = pow2(b4, 1n) * x3 % P;
  const b10 = pow2(b5, 5n) * b5 % P;
  const b20 = pow2(b10, 10n) * b10 % P;
  const b40 = pow2(b20, 20n) * b20 % P;
  const b80 = pow2(b40, 40n) * b40 % P;
  const b160 = pow2(b80, 80n) * b80 % P;
  const b240 = pow2(b160, 80n) * b80 % P;
  const b250 = pow2(b240, 10n) * b10 % P;
  const pow_p_5_8 = pow2(b250, 2n) * x3 % P;
  return { pow_p_5_8, b2: b22 };
};
var RM1 = 0x2b8324804fc1df0b2b4d00993dfbd7a72f431806ad2fe478c4ee1b274a0ea0b0n;
var uvRatio = (u2, v2) => {
  const v3 = M(v2 * v2 * v2);
  const v7 = M(v3 * v3 * v2);
  const pow = pow_2_252_3(u2 * v7).pow_p_5_8;
  let x3 = M(u2 * v3 * pow);
  const vx2 = M(v2 * x3 * x3);
  const root1 = x3;
  const root2 = M(x3 * RM1);
  const useRoot1 = vx2 === u2;
  const useRoot2 = vx2 === M(-u2);
  const noRoot = vx2 === M(-u2 * RM1);
  if (useRoot1)
    x3 = root1;
  if (useRoot2 || noRoot)
    x3 = root2;
  if ((M(x3) & 1n) === 1n)
    x3 = M(-x3);
  return { isValid: useRoot1 || useRoot2, value: x3 };
};
var modL_LE = (hash) => modN(bytesToNumLE(hash));
var sha512s = (...m2) => callHash("sha512Sync")(...m2);
var hashFinishS = (res) => res.finish(sha512s(res.hashable));
var veriOpts = { zip215: true };
var _verify = (sig, msg, pub, opts = veriOpts) => {
  sig = toU8(sig, L2);
  msg = toU8(msg);
  pub = toU8(pub, L);
  const { zip215 } = opts;
  let A;
  let R2;
  let s;
  let SB;
  let hashable = Uint8Array.of();
  try {
    A = Point.fromHex(pub, zip215);
    R2 = Point.fromHex(sig.slice(0, L), zip215);
    s = bytesToNumLE(sig.slice(L, L2));
    SB = G.multiply(s, false);
    hashable = concatBytes(R2.toBytes(), A.toBytes(), msg);
  } catch (error) {
  }
  const finish = (hashed) => {
    if (SB == null)
      return false;
    if (!zip215 && A.isSmallOrder())
      return false;
    const k = modL_LE(hashed);
    const RkA = R2.add(A.multiply(k, false));
    return RkA.add(SB.negate()).clearCofactor().is0();
  };
  return { hashable, finish };
};
var verify = (s, m2, p2, opts = veriOpts) => hashFinishS(_verify(s, m2, p2, opts));
var etc = {
  sha512Async: async (...messages) => {
    const s = subtle();
    const m2 = concatBytes(...messages);
    return u8n(await s.digest("SHA-512", m2.buffer));
  },
  sha512Sync: void 0,
  bytesToHex,
  hexToBytes,
  concatBytes,
  mod: M,
  invert,
  randomBytes
};
var W = 8;
var scalarBits = 256;
var pwindows = Math.ceil(scalarBits / W) + 1;
var pwindowSize = 2 ** (W - 1);
var precompute = () => {
  const points = [];
  let p2 = G;
  let b3 = p2;
  for (let w2 = 0; w2 < pwindows; w2++) {
    b3 = p2;
    points.push(b3);
    for (let i2 = 1; i2 < pwindowSize; i2++) {
      b3 = b3.add(p2);
      points.push(b3);
    }
    p2 = b3.double();
  }
  return points;
};
var Gpows = void 0;
var ctneg = (cnd, p2) => {
  const n2 = p2.negate();
  return cnd ? n2 : p2;
};
var wNAF = (n2) => {
  const comp = Gpows || (Gpows = precompute());
  let p2 = I;
  let f2 = G;
  const pow_2_w = 2 ** W;
  const maxNum = pow_2_w;
  const mask = big(pow_2_w - 1);
  const shiftBy = big(W);
  for (let w2 = 0; w2 < pwindows; w2++) {
    let wbits = Number(n2 & mask);
    n2 >>= shiftBy;
    if (wbits > pwindowSize) {
      wbits -= maxNum;
      n2 += 1n;
    }
    const off = w2 * pwindowSize;
    const offF = off;
    const offP = off + Math.abs(wbits) - 1;
    const isEven = w2 % 2 !== 0;
    const isNeg = wbits < 0;
    if (wbits === 0) {
      f2 = f2.add(ctneg(isEven, comp[offF]));
    } else {
      p2 = p2.add(ctneg(isNeg, comp[offP]));
    }
  }
  return { p: p2, f: f2 };
};

// node_modules/@noble/hashes/utils.js
function isBytes2(a2) {
  return a2 instanceof Uint8Array || ArrayBuffer.isView(a2) && a2.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a2 && a2.BYTES_PER_ELEMENT === 1;
}
function abytes2(value, length, title = "") {
  const bytes = isBytes2(value);
  const len = value?.length;
  const needsLen = length !== void 0;
  if (!bytes || needsLen && len !== length) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    const message = prefix + "expected Uint8Array" + ofLen + ", got " + got;
    if (!bytes)
      throw new TypeError(message);
    throw new RangeError(message);
  }
  return value;
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes2(out, void 0, "digestInto() output");
  const min = instance.outputLen;
  if (out.length < min) {
    throw new RangeError('"digestInto() output" expected to be of length >=' + min);
  }
}
function clean(...arrays) {
  for (let i2 = 0; i2 < arrays.length; i2++) {
    arrays[i2].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
var isLE = (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
var hasHexBuiltin = (() => (
  // @ts-ignore
  typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
))();
var hexes = Array.from({ length: 256 }, (_, i2) => i2.toString(16).padStart(2, "0"));
function createHasher(hashCons, info = {}) {
  const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
  const tmp = hashCons(void 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.canXOF = tmp.canXOF;
  hashC.create = (opts) => hashCons(opts);
  Object.assign(hashC, info);
  return Object.freeze(hashC);
}
var oidNist = (suffix) => ({
  // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
  // Larger suffix values would need base-128 OID encoding and a different length byte.
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
});

// node_modules/@noble/hashes/_md.js
function Chi(a2, b3, c2) {
  return a2 & b3 ^ ~a2 & c2;
}
function Maj(a2, b3, c2) {
  return a2 & b3 ^ a2 & c2 ^ b3 & c2;
}
var HashMD = class {
  blockLen;
  outputLen;
  canXOF = false;
  padOffset;
  isLE;
  // For partial updates less than block size
  buffer;
  view;
  finished = false;
  length = 0;
  pos = 0;
  destroyed = false;
  constructor(blockLen, outputLen, padOffset, isLE2) {
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE2;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    aexists(this);
    abytes2(data);
    const { view, buffer, blockLen } = this;
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE2 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    clean(this.buffer.subarray(pos));
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i2 = pos; i2 < blockLen; i2++)
      buffer[i2] = 0;
    view.setBigUint64(blockLen - 8, BigInt(this.length * 8), isLE2);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen must be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i2 = 0; i2 < outLen; i2++)
      oview.setUint32(4 * i2, state[i2], isLE2);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to ||= new this.constructor();
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
};
var SHA256_IV = Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA224_IV = Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]);
var SHA384_IV = Uint32Array.from([
  3418070365,
  3238371032,
  1654270250,
  914150663,
  2438529370,
  812702999,
  355462360,
  4144912697,
  1731405415,
  4290775857,
  2394180231,
  1750603025,
  3675008525,
  1694076839,
  1203062813,
  3204075428
]);
var SHA512_IV = Uint32Array.from([
  1779033703,
  4089235720,
  3144134277,
  2227873595,
  1013904242,
  4271175723,
  2773480762,
  1595750129,
  1359893119,
  2917565137,
  2600822924,
  725511199,
  528734635,
  4215389547,
  1541459225,
  327033209
]);

// node_modules/@noble/hashes/_u64.js
var U32_MASK64 = BigInt(2 ** 32 - 1);
var _32n = BigInt(32);
function fromBig(n2, le = false) {
  if (le)
    return { h: Number(n2 & U32_MASK64), l: Number(n2 >> _32n & U32_MASK64) };
  return { h: Number(n2 >> _32n & U32_MASK64) | 0, l: Number(n2 & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i2 = 0; i2 < len; i2++) {
    const { h: h3, l: l2 } = fromBig(lst[i2], le);
    [Ah[i2], Al[i2]] = [h3, l2];
  }
  return [Ah, Al];
}
var shrSH = (h3, _l, s) => h3 >>> s;
var shrSL = (h3, l2, s) => h3 << 32 - s | l2 >>> s;
var rotrSH = (h3, l2, s) => h3 >>> s | l2 << 32 - s;
var rotrSL = (h3, l2, s) => h3 << 32 - s | l2 >>> s;
var rotrBH = (h3, l2, s) => h3 << 64 - s | l2 >>> s - 32;
var rotrBL = (h3, l2, s) => h3 >>> s - 32 | l2 << 64 - s;
function add(Ah, Al, Bh, Bl) {
  const l2 = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l2 / 2 ** 32 | 0) | 0, l: l2 | 0 };
}
var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;

// node_modules/@noble/hashes/sha2.js
var SHA256_K = Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var SHA256_W = new Uint32Array(64);
var SHA2_32B = class extends HashMD {
  constructor(outputLen) {
    super(64, outputLen, 8, false);
  }
  get() {
    const { A, B: B2, C: C2, D, E, F, G: G2, H } = this;
    return [A, B2, C2, D, E, F, G2, H];
  }
  // prettier-ignore
  set(A, B2, C2, D, E, F, G2, H) {
    this.A = A | 0;
    this.B = B2 | 0;
    this.C = C2 | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G2 | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4)
      SHA256_W[i2] = view.getUint32(offset, false);
    for (let i2 = 16; i2 < 64; i2++) {
      const W15 = SHA256_W[i2 - 15];
      const W2 = SHA256_W[i2 - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i2] = s1 + SHA256_W[i2 - 7] + s0 + SHA256_W[i2 - 16] | 0;
    }
    let { A, B: B2, C: C2, D, E, F, G: G2, H } = this;
    for (let i2 = 0; i2 < 64; i2++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G2) + SHA256_K[i2] + SHA256_W[i2] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B2, C2) | 0;
      H = G2;
      G2 = F;
      F = E;
      E = D + T1 | 0;
      D = C2;
      C2 = B2;
      B2 = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B2 = B2 + this.B | 0;
    C2 = C2 + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G2 = G2 + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B2, C2, D, E, F, G2, H);
  }
  roundClean() {
    clean(SHA256_W);
  }
  destroy() {
    this.destroyed = true;
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean(this.buffer);
  }
};
var _SHA256 = class extends SHA2_32B {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  A = SHA256_IV[0] | 0;
  B = SHA256_IV[1] | 0;
  C = SHA256_IV[2] | 0;
  D = SHA256_IV[3] | 0;
  E = SHA256_IV[4] | 0;
  F = SHA256_IV[5] | 0;
  G = SHA256_IV[6] | 0;
  H = SHA256_IV[7] | 0;
  constructor() {
    super(32);
  }
};
var _SHA224 = class extends SHA2_32B {
  A = SHA224_IV[0] | 0;
  B = SHA224_IV[1] | 0;
  C = SHA224_IV[2] | 0;
  D = SHA224_IV[3] | 0;
  E = SHA224_IV[4] | 0;
  F = SHA224_IV[5] | 0;
  G = SHA224_IV[6] | 0;
  H = SHA224_IV[7] | 0;
  constructor() {
    super(28);
  }
};
var K512 = (() => split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n2) => BigInt(n2))))();
var SHA512_Kh = (() => K512[0])();
var SHA512_Kl = (() => K512[1])();
var SHA512_W_H = new Uint32Array(80);
var SHA512_W_L = new Uint32Array(80);
var SHA2_64B = class extends HashMD {
  constructor(outputLen) {
    super(128, outputLen, 16, false);
  }
  // prettier-ignore
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
  }
  // prettier-ignore
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4) {
      SHA512_W_H[i2] = view.getUint32(offset);
      SHA512_W_L[i2] = view.getUint32(offset += 4);
    }
    for (let i2 = 16; i2 < 80; i2++) {
      const W15h = SHA512_W_H[i2 - 15] | 0;
      const W15l = SHA512_W_L[i2 - 15] | 0;
      const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
      const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i2 - 2] | 0;
      const W2l = SHA512_W_L[i2 - 2] | 0;
      const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
      const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
      const SUMl = add4L(s0l, s1l, SHA512_W_L[i2 - 7], SHA512_W_L[i2 - 16]);
      const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i2 - 7], SHA512_W_H[i2 - 16]);
      SHA512_W_H[i2] = SUMh | 0;
      SHA512_W_L[i2] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i2 = 0; i2 < 80; i2++) {
      const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
      const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i2], SHA512_W_L[i2]);
      const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i2], SHA512_W_H[i2]);
      const T1l = T1ll | 0;
      const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
      const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = add3L(T1l, sigma0l, MAJl);
      Ah = add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    clean(SHA512_W_H, SHA512_W_L);
  }
  destroy() {
    this.destroyed = true;
    clean(this.buffer);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var _SHA512 = class extends SHA2_64B {
  Ah = SHA512_IV[0] | 0;
  Al = SHA512_IV[1] | 0;
  Bh = SHA512_IV[2] | 0;
  Bl = SHA512_IV[3] | 0;
  Ch = SHA512_IV[4] | 0;
  Cl = SHA512_IV[5] | 0;
  Dh = SHA512_IV[6] | 0;
  Dl = SHA512_IV[7] | 0;
  Eh = SHA512_IV[8] | 0;
  El = SHA512_IV[9] | 0;
  Fh = SHA512_IV[10] | 0;
  Fl = SHA512_IV[11] | 0;
  Gh = SHA512_IV[12] | 0;
  Gl = SHA512_IV[13] | 0;
  Hh = SHA512_IV[14] | 0;
  Hl = SHA512_IV[15] | 0;
  constructor() {
    super(64);
  }
};
var _SHA384 = class extends SHA2_64B {
  Ah = SHA384_IV[0] | 0;
  Al = SHA384_IV[1] | 0;
  Bh = SHA384_IV[2] | 0;
  Bl = SHA384_IV[3] | 0;
  Ch = SHA384_IV[4] | 0;
  Cl = SHA384_IV[5] | 0;
  Dh = SHA384_IV[6] | 0;
  Dl = SHA384_IV[7] | 0;
  Eh = SHA384_IV[8] | 0;
  El = SHA384_IV[9] | 0;
  Fh = SHA384_IV[10] | 0;
  Fl = SHA384_IV[11] | 0;
  Gh = SHA384_IV[12] | 0;
  Gl = SHA384_IV[13] | 0;
  Hh = SHA384_IV[14] | 0;
  Hl = SHA384_IV[15] | 0;
  constructor() {
    super(48);
  }
};
var T224_IV = Uint32Array.from([
  2352822216,
  424955298,
  1944164710,
  2312950998,
  502970286,
  855612546,
  1738396948,
  1479516111,
  258812777,
  2077511080,
  2011393907,
  79989058,
  1067287976,
  1780299464,
  286451373,
  2446758561
]);
var T256_IV = Uint32Array.from([
  573645204,
  4230739756,
  2673172387,
  3360449730,
  596883563,
  1867755857,
  2520282905,
  1497426621,
  2519219938,
  2827943907,
  3193839141,
  1401305490,
  721525244,
  746961066,
  246885852,
  2177182882
]);
var _SHA512_224 = class extends SHA2_64B {
  Ah = T224_IV[0] | 0;
  Al = T224_IV[1] | 0;
  Bh = T224_IV[2] | 0;
  Bl = T224_IV[3] | 0;
  Ch = T224_IV[4] | 0;
  Cl = T224_IV[5] | 0;
  Dh = T224_IV[6] | 0;
  Dl = T224_IV[7] | 0;
  Eh = T224_IV[8] | 0;
  El = T224_IV[9] | 0;
  Fh = T224_IV[10] | 0;
  Fl = T224_IV[11] | 0;
  Gh = T224_IV[12] | 0;
  Gl = T224_IV[13] | 0;
  Hh = T224_IV[14] | 0;
  Hl = T224_IV[15] | 0;
  constructor() {
    super(28);
  }
};
var _SHA512_256 = class extends SHA2_64B {
  Ah = T256_IV[0] | 0;
  Al = T256_IV[1] | 0;
  Bh = T256_IV[2] | 0;
  Bl = T256_IV[3] | 0;
  Ch = T256_IV[4] | 0;
  Cl = T256_IV[5] | 0;
  Dh = T256_IV[6] | 0;
  Dl = T256_IV[7] | 0;
  Eh = T256_IV[8] | 0;
  El = T256_IV[9] | 0;
  Fh = T256_IV[10] | 0;
  Fl = T256_IV[11] | 0;
  Gh = T256_IV[12] | 0;
  Gl = T256_IV[13] | 0;
  Hh = T256_IV[14] | 0;
  Hl = T256_IV[15] | 0;
  constructor() {
    super(32);
  }
};
var sha256 = createHasher(
  () => new _SHA256(),
  oidNist(1)
);
var sha224 = createHasher(
  () => new _SHA224(),
  oidNist(4)
);
var sha512 = createHasher(
  () => new _SHA512(),
  oidNist(3)
);
var sha384 = createHasher(
  () => new _SHA384(),
  oidNist(2)
);
var sha512_256 = createHasher(
  () => new _SHA512_256(),
  oidNist(6)
);
var sha512_224 = createHasher(
  () => new _SHA512_224(),
  oidNist(5)
);

// node_modules/@primeui/license-manager/dist/index.mjs
var t = Object.defineProperty;
var i = Object.getOwnPropertySymbols;
var n = Object.prototype.hasOwnProperty;
var a = Object.prototype.propertyIsEnumerable;
var o = (e, r, i2) => r in e ? t(e, r, { enumerable: true, configurable: true, writable: true, value: i2 }) : e[r] = i2;
var u = (e, r, t2) => new Promise((i2, n2) => {
  var a2 = (e2) => {
    try {
      u2(t2.next(e2));
    } catch (e3) {
      n2(e3);
    }
  }, o2 = (e2) => {
    try {
      u2(t2.throw(e2));
    } catch (e3) {
      n2(e3);
    }
  }, u2 = (e2) => e2.done ? i2(e2.value) : Promise.resolve(e2.value).then(a2, o2);
  u2((t2 = t2.apply(e, r)).next());
});
function c(e) {
  const r = {};
  for (let e2 = 0; e2 < 64; e2++) r["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"[e2]] = e2;
  const t2 = e.replace(/=+$/, ""), i2 = Math.floor(6 * t2.length / 8), n2 = new Uint8Array(i2);
  let a2 = 0, o2 = 0, u2 = 0;
  for (let e2 = 0; e2 < t2.length; e2++) {
    const i3 = r[t2[e2]];
    if (void 0 === i3) throw new Error("Invalid base64url character");
    a2 = a2 << 6 | i3, o2 += 6, o2 >= 8 && (o2 -= 8, n2[u2++] = a2 >> o2 & 255);
  }
  return n2;
}
var l = "primeui";
var d2 = "primeui-pro:";
var p = { primeui: "primeui", scheduler: "primeui-pro:scheduler", texteditor: "primeui-pro:text-editor", charts: "primeui-pro:charts", diagram: "primeui-pro:diagram", pdfviewer: "primeui-pro:pdf-viewer", taskboard: "primeui-pro:task-board", datagrid: "primeui-pro:datagrid", ganttchart: "primeui-pro:gantt-chart", filemanager: "primeui-pro:file-manager" };
var f = { primeui: "PrimeUI", scheduler: "Scheduler", texteditor: "TextEditor", charts: "Charts", diagram: "Diagram", pdfviewer: "PDF Viewer", taskboard: "Task Board", datagrid: "DataGrid", ganttchart: "Gantt", filemanager: "File Manager" };
function m(e, r = "PrimeUI") {
  switch (e) {
    case "active":
      return `${r} license is active.`;
    case "grace":
      return `${r} license is in its grace period. Renew soon to keep using this version.`;
    case "expired":
      return `${r} license does not cover this version. Renew at primeui.store, or downgrade to a version released within your updates window.`;
    case "tampered":
      return `${r} license signature is invalid.`;
    case "wrong-product":
      return `License does not cover ${r}.`;
    case "missing":
      return `No license key configured for ${r}.`;
    case "invalid":
      return `${r} license is malformed.`;
    case "unconfigured":
      return `${r} license is not configured.`;
    default:
      return `${r} license status unknown.`;
  }
}
var y = 864e5;
function g(e, r, t2 = {}) {
  return ((e2, r2) => {
    for (var t3 in r2 || (r2 = {})) n.call(r2, t3) && o(e2, t3, r2[t3]);
    if (i) for (var t3 of i(r2)) a.call(r2, t3) && o(e2, t3, r2[t3]);
    return e2;
  })({ valid: "active" === e || "grace" === e, status: e, message: m(e, r) }, t2);
}
function v(t2, i2) {
  return u(this, null, function* () {
    var n2, a2;
    const o2 = i2.productLabel;
    if ("string" != typeof t2 || !t2.includes(".")) return g("invalid", o2);
    const u2 = t2.split(".");
    if (2 !== u2.length) return g("invalid", o2);
    const [s, p2] = u2;
    let f2, m2, v2;
    try {
      f2 = (function(e) {
        const r = c(e), t3 = new TextDecoder().decode(r);
        return JSON.parse(t3);
      })(s);
    } catch (e) {
      return g("invalid", o2);
    }
    if (!f2 || "object" != typeof f2 || "string" != typeof f2.product || "string" != typeof f2.type || "number" != typeof f2.exp || "number" != typeof f2.iat || "string" != typeof f2.id) return g("invalid", o2);
    try {
      m2 = c(p2), v2 = new TextEncoder().encode(s);
    } catch (e) {
      return g("invalid", o2);
    }
    const h3 = null != (n2 = i2.publicKeyOverride) ? n2 : "dae75e66b9f59bebf87d4bb29ca6494f37deccfcc2b132b98ee159ee7505373b";
    let b3;
    try {
      b3 = (function(e) {
        if (e.length % 2 != 0) throw new Error("Invalid hex length");
        const r = new Uint8Array(e.length / 2);
        for (let t3 = 0; t3 < r.length; t3++) r[t3] = parseInt(e.substr(2 * t3, 2), 16);
        return r;
      })(h3);
    } catch (e) {
      return g("invalid", o2);
    }
    let w2 = false;
    try {
      etc.sha512Sync || (etc.sha512Sync = (...t3) => sha512(etc.concatBytes(...t3))), w2 = verify(m2, v2, b3);
    } catch (e) {
      return g("tampered", o2, { payload: f2 });
    }
    if (!w2) return g("tampered", o2, { payload: f2 });
    if (!(function(e, r) {
      return e.product === r || !(!r.startsWith(d2) || e.product !== l || "commercial" !== e.tier);
    })(f2, i2.product)) return g("wrong-product", o2, { payload: f2 });
    const x3 = 1e3 * f2.exp, D = Date.now(), O2 = Math.floor((x3 - D) / y), P2 = (function(e) {
      if (void 0 === e) return null;
      if ("number" == typeof e) return 1e3 * e;
      const r = Date.parse(e);
      return Number.isNaN(r) ? null : r;
    })(i2.releaseDate);
    if (null !== P2 && P2 > x3) return g("expired", o2, { daysUntilExpiry: O2, payload: f2 });
    if ((function(e) {
      return "community" === e.tier;
    })(f2)) {
      if (D > x3 + (null != (a2 = i2.graceDays) ? a2 : 30) * y) return g("expired", o2, { daysUntilExpiry: O2, payload: f2 });
      if (D > x3) return g("grace", o2, { daysUntilExpiry: O2, payload: f2 });
    }
    return g("active", o2, { daysUntilExpiry: O2, payload: f2 });
  });
}
function h2(e, r) {
  return { valid: false, status: e, message: m(e, r) };
}
function b2(e, r) {
  const t2 = null == r ? void 0 : r.graceDays, i2 = null == r ? void 0 : r.publicKeyOverride;
  return { verify(r2, n2) {
    return u(this, null, function* () {
      var a2;
      const o2 = p[r2], u2 = null != (a2 = f[r2]) ? a2 : "PrimeUI", c2 = null == n2 ? void 0 : n2.releaseDate;
      if (!o2) return h2("invalid", u2);
      const s = e[r2], l2 = e.primeui;
      if (s) {
        const e2 = yield v(s, { product: o2, productLabel: u2, releaseDate: c2, graceDays: t2, publicKeyOverride: i2 });
        if (e2.valid) return e2;
        if ("wrong-product" !== e2.status) return e2;
      }
      return l2 && "primeui" !== r2 && o2.startsWith(d2) ? v(l2, { product: o2, productLabel: u2, releaseDate: c2, graceDays: t2, publicKeyOverride: i2 }) : h2(s ? "wrong-product" : "missing", u2);
    });
  }, has(r2) {
    const t3 = p[r2];
    return !!t3 && (!!e[r2] || "primeui" !== r2 && t3.startsWith(d2) && !!e.primeui);
  } };
}
var w = null;
function x2(e, r) {
  if (!e) throw new Error("[@primeui/license-manager] registerLicense: keys argument is required.");
  return w = b2(e, r);
}
function O(e, r) {
  var t2;
  if (!w) {
    const r2 = null != (t2 = f[e]) ? t2 : "PrimeUI";
    return Promise.resolve({ valid: false, status: "unconfigured", message: m("unconfigured", r2) });
  }
  return w.verify(e, r);
}

// node_modules/primeng/fesm2022/primeng-license.mjs
function showInvalidLicenseBanner() {
  if (typeof document === "undefined")
    return;
  if (document.getElementById("p-license-host"))
    return;
  const host = document.createElement("div");
  host.id = "p-license-host";
  host.style.cssText = "all:initial;position:fixed;bottom:16px;right:16px;z-index:2147483647;pointer-events:none;";
  const shadow = host.attachShadow({ mode: "closed" });
  shadow.innerHTML = '<div role="alert" style="padding:10px 14px;background:#991b1b;color:#fff;font:600 13px/1.2 system-ui,-apple-system,sans-serif;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.2);">Invalid PrimeUI License</div>';
  document.body.appendChild(host);
}

// node_modules/primeng/fesm2022/primeng-config.mjs
var ThemeProvider = class _ThemeProvider {
  // @todo define type for theme
  theme = signal(
    void 0,
    ...ngDevMode ? [{
      debugName: "theme"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  csp = signal(
    {
      nonce: void 0
    },
    ...ngDevMode ? [{
      debugName: "csp"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  isThemeChanged = false;
  document = inject(DOCUMENT);
  baseStyle = inject(BaseStyle);
  constructor() {
    effect(() => {
      R.on("theme:change", (newTheme) => {
        untracked(() => {
          this.isThemeChanged = true;
          this.theme.set(newTheme);
        });
      });
    });
    effect(() => {
      const themeValue = this.theme();
      if (this.document && themeValue) {
        if (!this.isThemeChanged) {
          this.onThemeChange(themeValue);
        }
        this.isThemeChanged = false;
      }
    });
  }
  ngOnDestroy() {
    S.clearLoadedStyleNames();
    R.clear();
  }
  onThemeChange(value) {
    S.setTheme(value);
    if (this.document) {
      this.loadCommonTheme();
    }
  }
  loadCommonTheme() {
    if (this.theme() === "none") return;
    if (!S.isStyleNameLoaded("common")) {
      const {
        primitive,
        semantic,
        global,
        style: style2
      } = this.baseStyle.getCommonTheme?.() || {};
      const styleOptions = {
        nonce: this.csp?.()?.nonce
      };
      this.baseStyle.load(primitive?.css, __spreadValues({
        name: "primitive-variables"
      }, styleOptions));
      this.baseStyle.load(semantic?.css, __spreadValues({
        name: "semantic-variables"
      }, styleOptions));
      this.baseStyle.load(global?.css, __spreadValues({
        name: "global-variables"
      }, styleOptions));
      this.baseStyle.loadBaseStyle(__spreadValues({
        name: "global-style"
      }, styleOptions), style2);
      S.setLoadedStyleName("common");
    }
  }
  setThemeConfig(config) {
    const {
      theme,
      csp
    } = config || {};
    if (theme) this.theme.set(theme);
    if (csp) this.csp.set(csp);
  }
  static ɵfac = function ThemeProvider_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ThemeProvider)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ThemeProvider,
    factory: _ThemeProvider.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ThemeProvider, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var PrimeNG = class _PrimeNG extends ThemeProvider {
  ripple = signal(
    false,
    ...ngDevMode ? [{
      debugName: "ripple"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  platformId = inject(PLATFORM_ID);
  inputVariant = signal(
    null,
    ...ngDevMode ? [{
      debugName: "inputVariant"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  _verified = signal(
    null,
    ...ngDevMode ? [{
      debugName: "_verified"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  verified = this._verified.asReadonly();
  _setVerified(value) {
    this._verified.set(value);
  }
  overlayAppendTo = signal(
    "self",
    ...ngDevMode ? [{
      debugName: "overlayAppendTo"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  overlayOptions = {};
  csp = signal(
    {
      nonce: void 0
    },
    ...ngDevMode ? [{
      debugName: "csp"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  unstyled = signal(
    void 0,
    ...ngDevMode ? [{
      debugName: "unstyled"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  pt = signal(
    void 0,
    ...ngDevMode ? [{
      debugName: "pt"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  ptOptions = signal(
    void 0,
    ...ngDevMode ? [{
      debugName: "ptOptions"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  filterMatchModeOptions = {
    text: [FilterMatchMode.STARTS_WITH, FilterMatchMode.CONTAINS, FilterMatchMode.NOT_CONTAINS, FilterMatchMode.ENDS_WITH, FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS],
    numeric: [FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS, FilterMatchMode.LESS_THAN, FilterMatchMode.LESS_THAN_OR_EQUAL_TO, FilterMatchMode.GREATER_THAN, FilterMatchMode.GREATER_THAN_OR_EQUAL_TO],
    date: [FilterMatchMode.DATE_IS, FilterMatchMode.DATE_IS_NOT, FilterMatchMode.DATE_BEFORE, FilterMatchMode.DATE_AFTER]
  };
  translation = {
    startsWith: "Starts with",
    contains: "Contains",
    notContains: "Not contains",
    endsWith: "Ends with",
    equals: "Equals",
    notEquals: "Not equals",
    noFilter: "No Filter",
    lt: "Less than",
    lte: "Less than or equal to",
    gt: "Greater than",
    gte: "Greater than or equal to",
    is: "Is",
    isNot: "Is not",
    before: "Before",
    after: "After",
    dateIs: "Date is",
    dateIsNot: "Date is not",
    dateBefore: "Date is before",
    dateAfter: "Date is after",
    clear: "Clear",
    apply: "Apply",
    matchAll: "Match All",
    matchAny: "Match Any",
    addRule: "Add Rule",
    removeRule: "Remove Rule",
    accept: "Yes",
    reject: "No",
    choose: "Choose",
    completed: "Completed",
    upload: "Upload",
    cancel: "Cancel",
    pending: "Pending",
    fileSizeTypes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    chooseYear: "Choose Year",
    chooseMonth: "Choose Month",
    chooseDate: "Choose Date",
    prevDecade: "Previous Decade",
    nextDecade: "Next Decade",
    prevYear: "Previous Year",
    nextYear: "Next Year",
    prevMonth: "Previous Month",
    nextMonth: "Next Month",
    prevHour: "Previous Hour",
    nextHour: "Next Hour",
    prevMinute: "Previous Minute",
    nextMinute: "Next Minute",
    prevSecond: "Previous Second",
    nextSecond: "Next Second",
    am: "am",
    pm: "pm",
    dateFormat: "mm/dd/yy",
    firstDayOfWeek: 0,
    today: "Today",
    weekHeader: "Wk",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    passwordPrompt: "Enter a password",
    emptyMessage: "No results found",
    searchMessage: "Search results are available",
    selectionMessage: "{0} items selected",
    emptySelectionMessage: "No selected item",
    emptySearchMessage: "No results found",
    emptyFilterMessage: "No results found",
    fileChosenMessage: "Files",
    noFileChosenMessage: "No file chosen",
    aria: {
      trueLabel: "True",
      falseLabel: "False",
      nullLabel: "Not Selected",
      star: "1 star",
      stars: "{star} stars",
      selectAll: "All items selected",
      unselectAll: "All items unselected",
      close: "Close",
      previous: "Previous",
      next: "Next",
      navigation: "Navigation",
      scrollTop: "Scroll Top",
      moveTop: "Move Top",
      moveUp: "Move Up",
      moveDown: "Move Down",
      moveBottom: "Move Bottom",
      moveToTarget: "Move to Target",
      moveToSource: "Move to Source",
      moveAllToTarget: "Move All to Target",
      moveAllToSource: "Move All to Source",
      pageLabel: "{page}",
      firstPageLabel: "First Page",
      lastPageLabel: "Last Page",
      nextPageLabel: "Next Page",
      prevPageLabel: "Previous Page",
      rowsPerPageLabel: "Rows per page",
      previousPageLabel: "Previous Page",
      jumpToPageDropdownLabel: "Jump to Page Dropdown",
      jumpToPageInputLabel: "Jump to Page Input",
      selectRow: "Row Selected",
      unselectRow: "Row Unselected",
      expandRow: "Row Expanded",
      collapseRow: "Row Collapsed",
      expand: "Expand",
      collapse: "Collapse",
      showFilterMenu: "Show Filter Menu",
      hideFilterMenu: "Hide Filter Menu",
      filterOperator: "Filter Operator",
      filterConstraint: "Filter Constraint",
      editRow: "Row Edit",
      saveEdit: "Save Edit",
      cancelEdit: "Cancel Edit",
      listView: "List View",
      gridView: "Grid View",
      slide: "Slide",
      slideNumber: "{slideNumber}",
      zoomImage: "Zoom Image",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      rotateRight: "Rotate Right",
      rotateLeft: "Rotate Left",
      listLabel: "Option List",
      selectColor: "Select a color",
      removeLabel: "Remove",
      browseFiles: "Browse Files",
      maximizeLabel: "Maximize",
      minimizeLabel: "Minimize"
    }
  };
  zIndex = {
    modal: 1100,
    overlay: 1e3,
    menu: 1e3,
    tooltip: 1100
  };
  translationSource = new Subject();
  translationObserver = this.translationSource.asObservable();
  getTranslation(key) {
    return this.translation[key];
  }
  setTranslation(value) {
    this.translation = __spreadValues(__spreadValues({}, this.translation), value);
    this.translationSource.next(this.translation);
  }
  setConfig(config) {
    const {
      csp,
      ripple,
      inputVariant,
      theme,
      overlayOptions,
      translation,
      filterMatchModeOptions,
      overlayAppendTo,
      zIndex,
      ptOptions,
      pt,
      unstyled
    } = config || {};
    if (csp) this.csp.set(csp);
    if (overlayAppendTo) this.overlayAppendTo.set(overlayAppendTo);
    if (ripple) this.ripple.set(ripple);
    if (inputVariant) this.inputVariant.set(inputVariant);
    if (overlayOptions) this.overlayOptions = overlayOptions;
    if (translation) this.setTranslation(translation);
    if (filterMatchModeOptions) this.filterMatchModeOptions = filterMatchModeOptions;
    if (zIndex) this.zIndex = zIndex;
    if (pt) this.pt.set(pt);
    if (ptOptions) this.ptOptions.set(ptOptions);
    if (unstyled) this.unstyled.set(unstyled);
    if (theme) this.setThemeConfig({
      theme,
      csp
    });
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵPrimeNG_BaseFactory;
    return function PrimeNG_Factory(__ngFactoryType__) {
      return (ɵPrimeNG_BaseFactory || (ɵPrimeNG_BaseFactory = ɵɵgetInheritedFactory(_PrimeNG)))(__ngFactoryType__ || _PrimeNG);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _PrimeNG,
    factory: _PrimeNG.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PrimeNG, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var PRIME_NG_CONFIG = new InjectionToken("PRIME_NG_CONFIG");
var RELEASE_DATE = "2026-07-15";
function providePrimeNG(...features) {
  const providers = features?.map((feature) => ({
    provide: PRIME_NG_CONFIG,
    useValue: feature,
    multi: false
  }));
  const initializer = provideAppInitializer(() => {
    const PrimeNGConfig = inject(PrimeNG);
    features?.forEach((feature) => PrimeNGConfig.setConfig(feature));
    const license = features?.map((f2) => f2.license).find(Boolean);
    if (license) x2({
      primeui: license
    });
    O("primeui", {
      releaseDate: RELEASE_DATE
    }).then((result) => {
      PrimeNGConfig._setVerified(result.valid);
      if (!result.valid) {
        console.warn(`[PrimeUI] ${result.message}`);
        showInvalidLicenseBanner();
      }
    });
    return;
  });
  return makeEnvironmentProviders([...providers, initializer]);
}

export {
  SharedModule,
  base,
  BaseStyle,
  showInvalidLicenseBanner,
  ThemeProvider,
  PrimeNG,
  PRIME_NG_CONFIG,
  providePrimeNG
};
//# sourceMappingURL=chunk-SH2IBN53.js.map
