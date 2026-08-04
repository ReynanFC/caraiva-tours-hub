import {
  e
} from "./chunk-BGLX7RGU.js";
import {
  BaseModelHolder
} from "./chunk-5BS7KGIU.js";
import {
  Fluid
} from "./chunk-V7NQNLRP.js";
import {
  CoreIcon,
  ICON_TEMPLATE
} from "./chunk-Y5JDOCLT.js";
import {
  Component,
  Directive,
  Input,
  booleanAttribute,
  input,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdomElement,
  ɵɵgetInheritedFactory,
  ɵɵnextContext,
  ɵɵrepeater,
  ɵɵrepeaterCreate
} from "./chunk-N3JMXNJE.js";
import {
  computed,
  inject,
  signal,
  ɵɵnamespaceSVG
} from "./chunk-QAPLPPA7.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// node_modules/primeng/fesm2022/primeng-baseeditableholder.mjs
var BaseEditableHolder = class _BaseEditableHolder extends BaseModelHolder {
  /**
   * There must be a value (if set).
   * @defaultValue false
   * @group Props
   */
  required = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "required"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * When present, it specifies that the component should have invalid state style.
   * @defaultValue false
   * @group Props
   */
  invalid = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "invalid"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * When present, it specifies that the component should have disabled state style.
   * @defaultValue false
   * @group Props
   */
  disabled = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "disabled"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * When present, it specifies that the name of the input.
   * @defaultValue undefined
   * @group Props
   */
  name = input(
    ...ngDevMode ? [void 0, {
      debugName: "name"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  _disabled = signal(
    false,
    ...ngDevMode ? [{
      debugName: "_disabled"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $disabled = computed(
    () => this.disabled() || this._disabled(),
    ...ngDevMode ? [{
      debugName: "$disabled"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  onModelChange = () => {
  };
  onModelTouched = () => {
  };
  writeDisabledState(value) {
    this._disabled.set(value);
  }
  writeControlValue(value, setModelValue) {
  }
  /**** Angular ControlValueAccessors ****/
  writeValue(value) {
    this.writeControlValue(value, this.writeModelValue.bind(this));
  }
  registerOnChange(fn) {
    this.onModelChange = fn;
  }
  registerOnTouched(fn) {
    this.onModelTouched = fn;
  }
  setDisabledState(val) {
    this.writeDisabledState(val);
    this.cd.markForCheck();
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵBaseEditableHolder_BaseFactory;
    return function BaseEditableHolder_Factory(__ngFactoryType__) {
      return (ɵBaseEditableHolder_BaseFactory || (ɵBaseEditableHolder_BaseFactory = ɵɵgetInheritedFactory(_BaseEditableHolder)))(__ngFactoryType__ || _BaseEditableHolder);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _BaseEditableHolder,
    inputs: {
      required: [1, "required"],
      invalid: [1, "invalid"],
      disabled: [1, "disabled"],
      name: [1, "name"]
    },
    features: [ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BaseEditableHolder, [{
    type: Directive,
    args: [{
      standalone: true
    }]
  }], null, {
    required: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "required",
        required: false
      }]
    }],
    invalid: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "invalid",
        required: false
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "disabled",
        required: false
      }]
    }],
    name: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "name",
        required: false
      }]
    }]
  });
})();

// node_modules/primeng/fesm2022/primeng-baseinput.mjs
var BaseInput = class _BaseInput extends BaseEditableHolder {
  pcFluid = inject(Fluid, {
    optional: true,
    host: true,
    skipSelf: true
  });
  /**
   * Spans 100% width of the container when enabled.
   * @defaultValue false
   * @group Props
   */
  fluid = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "fluid"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Specifies the input variant of the component.
   * @defaultValue 'outlined'
   * @group Props
   */
  variant = input(
    ...ngDevMode ? [void 0, {
      debugName: "variant"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Specifies the size of the component.
   * @defaultValue undefined
   * @group Props
   */
  size = input(
    ...ngDevMode ? [void 0, {
      debugName: "size"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Specifies the visible width of the input element in characters.
   * @defaultValue undefined
   * @group Props
   */
  inputSize = input(
    ...ngDevMode ? [void 0, {
      debugName: "inputSize"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Specifies the value must match the pattern.
   * @defaultValue undefined
   * @group Props
   */
  pattern = input(
    ...ngDevMode ? [void 0, {
      debugName: "pattern"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * The value must be greater than or equal to the value.
   * @defaultValue undefined
   * @group Props
   */
  min = input(
    ...ngDevMode ? [void 0, {
      debugName: "min"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * The value must be less than or equal to the value.
   * @defaultValue undefined
   * @group Props
   */
  max = input(
    ...ngDevMode ? [void 0, {
      debugName: "max"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Unless the step is set to the any literal, the value must be min + an integral multiple of the step.
   * @defaultValue undefined
   * @group Props
   */
  step = input(
    ...ngDevMode ? [void 0, {
      debugName: "step"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * The number of characters (code points) must not be less than the value of the attribute, if non-empty.
   * @defaultValue undefined
   * @group Props
   */
  minlength = input(
    ...ngDevMode ? [void 0, {
      debugName: "minlength"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * The number of characters (code points) must not exceed the value of the attribute.
   * @defaultValue undefined
   * @group Props
   */
  maxlength = input(
    ...ngDevMode ? [void 0, {
      debugName: "maxlength"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $variant = computed(
    () => this.variant() || this.config.inputVariant(),
    ...ngDevMode ? [{
      debugName: "$variant"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $pattern = computed(
    () => {
      const v = this.pattern();
      return typeof v === "string" && v.length > 0 ? v : void 0;
    },
    ...ngDevMode ? [{
      debugName: "$pattern"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  get hasFluid() {
    return this.fluid() ?? !!this.pcFluid;
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵBaseInput_BaseFactory;
    return function BaseInput_Factory(__ngFactoryType__) {
      return (ɵBaseInput_BaseFactory || (ɵBaseInput_BaseFactory = ɵɵgetInheritedFactory(_BaseInput)))(__ngFactoryType__ || _BaseInput);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _BaseInput,
    inputs: {
      fluid: [1, "fluid"],
      variant: [1, "variant"],
      size: [1, "size"],
      inputSize: [1, "inputSize"],
      pattern: [1, "pattern"],
      min: [1, "min"],
      max: [1, "max"],
      step: [1, "step"],
      minlength: [1, "minlength"],
      maxlength: [1, "maxlength"]
    },
    features: [ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BaseInput, [{
    type: Directive,
    args: [{
      standalone: true
    }]
  }], null, {
    fluid: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fluid",
        required: false
      }]
    }],
    variant: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "variant",
        required: false
      }]
    }],
    size: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "size",
        required: false
      }]
    }],
    inputSize: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "inputSize",
        required: false
      }]
    }],
    pattern: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pattern",
        required: false
      }]
    }],
    min: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "min",
        required: false
      }]
    }],
    max: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "max",
        required: false
      }]
    }],
    step: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "step",
        required: false
      }]
    }],
    minlength: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "minlength",
        required: false
      }]
    }],
    maxlength: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "maxlength",
        required: false
      }]
    }]
  });
})();

// node_modules/@primeicons/angular/fesm2022/primeicons-angular-times.mjs
var _forTrack0 = ($index, $item) => $item[1]["key"] || $index;
function Times_For_1_Case_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "path");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("d", node_r1[1]["d"])("fill", node_r1[1]["fill"])("fill-opacity", node_r1[1]["fillOpacity"])("fill-rule", node_r1[1]["fillRule"])("clip-rule", node_r1[1]["clipRule"])("stroke", node_r1[1]["stroke"])("stroke-width", node_r1[1]["strokeWidth"])("stroke-opacity", node_r1[1]["strokeOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function Times_For_1_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "circle");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("cx", node_r1[1]["cx"])("cy", node_r1[1]["cy"])("r", node_r1[1]["r"])("fill", node_r1[1]["fill"])("fill-opacity", node_r1[1]["fillOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function Times_For_1_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "rect");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("x", node_r1[1]["x"])("y", node_r1[1]["y"])("width", node_r1[1]["width"])("height", node_r1[1]["height"])("rx", node_r1[1]["rx"])("ry", node_r1[1]["ry"])("fill", node_r1[1]["fill"])("fill-opacity", node_r1[1]["fillOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function Times_For_1_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "line");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("x1", node_r1[1]["x1"])("y1", node_r1[1]["y1"])("x2", node_r1[1]["x2"])("y2", node_r1[1]["y2"])("stroke", node_r1[1]["stroke"])("stroke-opacity", node_r1[1]["strokeOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function Times_For_1_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "polyline");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("points", node_r1[1]["points"])("fill", node_r1[1]["fill"])("fill-opacity", node_r1[1]["fillOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function Times_For_1_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "polygon");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("points", node_r1[1]["points"])("fill", node_r1[1]["fill"])("fill-opacity", node_r1[1]["fillOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function Times_For_1_Case_6_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "ellipse");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("cx", node_r1[1]["cx"])("cy", node_r1[1]["cy"])("rx", node_r1[1]["rx"])("ry", node_r1[1]["ry"])("fill", node_r1[1]["fill"])("fill-opacity", node_r1[1]["fillOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function Times_For_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, Times_For_1_Case_0_Template, 1, 9, ":svg:path")(1, Times_For_1_Case_1_Template, 1, 6, ":svg:circle")(2, Times_For_1_Case_2_Template, 1, 9, ":svg:rect")(3, Times_For_1_Case_3_Template, 1, 7, ":svg:line")(4, Times_For_1_Case_4_Template, 1, 4, ":svg:polyline")(5, Times_For_1_Case_5_Template, 1, 4, ":svg:polygon")(6, Times_For_1_Case_6_Template, 1, 7, ":svg:ellipse");
  }
  if (rf & 2) {
    let tmp_10_0;
    const node_r1 = ctx.$implicit;
    ɵɵconditional((tmp_10_0 = node_r1[0]) === "path" ? 0 : tmp_10_0 === "circle" ? 1 : tmp_10_0 === "rect" ? 2 : tmp_10_0 === "line" ? 3 : tmp_10_0 === "polyline" ? 4 : tmp_10_0 === "polygon" ? 5 : tmp_10_0 === "ellipse" ? 6 : -1);
  }
}
var Times = class _Times extends CoreIcon {
  constructor() {
    super();
    this._icon = e;
  }
  static ɵfac = function Times_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Times)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _Times,
    selectors: [["svg", "data-p-icon", "times"]],
    features: [ɵɵInheritDefinitionFeature],
    decls: 2,
    vars: 0,
    template: function Times_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵrepeaterCreate(0, Times_For_1_Template, 7, 1, null, null, _forTrack0);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Times, [{
    type: Component,
    args: [{
      selector: 'svg[data-p-icon="times"]',
      standalone: true,
      template: ICON_TEMPLATE
    }]
  }], () => [], null);
})();

export {
  BaseInput,
  Times
};
//# sourceMappingURL=chunk-ZZ5Z72QQ.js.map
