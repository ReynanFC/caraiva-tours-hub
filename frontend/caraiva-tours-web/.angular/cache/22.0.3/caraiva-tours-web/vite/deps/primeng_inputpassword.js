import {
  InputText
} from "./chunk-4GALJQ4K.js";
import "./chunk-KNTG7XPQ.js";
import "./chunk-V3IAQIPP.js";
import {
  BaseComponent,
  PARENT_INSTANCE
} from "./chunk-PG6XWJJ4.js";
import {
  BaseStyle
} from "./chunk-NETSQRFO.js";
import "./chunk-UANOYDBT.js";
import "./chunk-6JVMDVTH.js";
import "./chunk-LZ5MMXQW.js";
import "./chunk-P76MA2VQ.js";
import "./chunk-OOBH3RC4.js";
import {
  Directive,
  Injectable,
  Input,
  NgModule,
  Output,
  inject,
  model,
  setClassMetadata,
  ɵɵHostDirectivesFeature,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵgetInheritedFactory
} from "./chunk-IFQMPNEI.js";
import "./chunk-GOMI4DH3.js";

// node_modules/@primeuix/styles/dist/password/index.mjs
var style = "\n    .p-password {\n        display: inline-flex;\n        position: relative;\n    }\n\n    .p-password .p-password-overlay {\n        min-width: 100%;\n    }\n\n    .p-password-meter {\n        height: dt('password.meter.height');\n        background: dt('password.meter.background');\n        border-radius: dt('password.meter.border.radius');\n    }\n\n    .p-password-meter-label {\n        height: 100%;\n        width: 0;\n        transition: width 1s ease-in-out;\n        border-radius: dt('password.meter.border.radius');\n    }\n\n    .p-password-meter-weak {\n        background: dt('password.strength.weak.background');\n    }\n\n    .p-password-meter-medium {\n        background: dt('password.strength.medium.background');\n    }\n\n    .p-password-meter-strong {\n        background: dt('password.strength.strong.background');\n    }\n\n    .p-password-meter-text {\n        font-weight: dt('password.meter.text.font.weight');\n        font-size: dt('password.meter.text.font.size');\n    }\n\n    .p-password-fluid {\n        display: flex;\n    }\n\n    .p-password-fluid .p-password-input {\n        width: 100%;\n    }\n\n    .p-password-input::-ms-reveal,\n    .p-password-input::-ms-clear {\n        display: none;\n    }\n\n    .p-password-overlay {\n        padding: dt('password.overlay.padding');\n        background: dt('password.overlay.background');\n        color: dt('password.overlay.color');\n        border: 1px solid dt('password.overlay.border.color');\n        box-shadow: dt('password.overlay.shadow');\n        border-radius: dt('password.overlay.border.radius');\n    }\n\n    .p-password-content {\n        display: flex;\n        flex-direction: column;\n        gap: dt('password.content.gap');\n    }\n\n    .p-password-toggle-mask-icon {\n        inset-inline-end: dt('form.field.padding.x');\n        color: dt('password.icon.color');\n        position: absolute;\n        top: 50%;\n        margin-top: calc(-1 * calc(dt('icon.size') / 2));\n        width: dt('icon.size');\n        height: dt('icon.size');\n    }\n\n    .p-password-clear-icon {\n        position: absolute;\n        top: 50%;\n        margin-top: calc(-1 * dt('icon.size') / 2);\n        cursor: pointer;\n        inset-inline-end: dt('form.field.padding.x');\n        color: dt('form.field.icon.color');\n    }\n\n    .p-password:has(.p-password-toggle-mask-icon) .p-password-input {\n        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));\n    }\n\n    .p-password:has(.p-password-toggle-mask-icon) .p-password-clear-icon {\n        inset-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));\n    }\n\n    .p-password:has(.p-password-clear-icon) .p-password-input {\n        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));\n    }\n\n    .p-password:has(.p-password-clear-icon):has(.p-password-toggle-mask-icon)  .p-password-input {\n        padding-inline-end: calc((dt('form.field.padding.x') * 3) + calc(dt('icon.size') * 2));\n    }\n\n";

// node_modules/primeng/fesm2022/primeng-inputpassword.mjs
var classes = {
  root: "p-password p-component"
};
var InputPasswordStyle = class _InputPasswordStyle extends BaseStyle {
  name = "password";
  style = style;
  classes = classes;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵInputPasswordStyle_BaseFactory;
    return function InputPasswordStyle_Factory(__ngFactoryType__) {
      return (ɵInputPasswordStyle_BaseFactory || (ɵInputPasswordStyle_BaseFactory = ɵɵgetInheritedFactory(_InputPasswordStyle)))(__ngFactoryType__ || _InputPasswordStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _InputPasswordStyle,
    factory: _InputPasswordStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InputPasswordStyle, [{
    type: Injectable
  }], null, null);
})();
var InputPasswordClasses;
(function(InputPasswordClasses2) {
  InputPasswordClasses2["root"] = "p-password";
})(InputPasswordClasses || (InputPasswordClasses = {}));
var InputPassword = class _InputPassword extends BaseComponent {
  componentName = "InputPassword";
  /**
   * Whether the password is masked.
   * @defaultValue true
   * @group Props
   */
  mask = model(
    true,
    ...ngDevMode ? [{
      debugName: "mask"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  _componentStyle = inject(InputPasswordStyle);
  /**
   * Toggles the mask state between password and text.
   * @group Methods
   */
  toggleMask() {
    this.mask.set(!this.mask());
  }
  get inputType() {
    return this.mask() ? "password" : "text";
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵInputPassword_BaseFactory;
    return function InputPassword_Factory(__ngFactoryType__) {
      return (ɵInputPassword_BaseFactory || (ɵInputPassword_BaseFactory = ɵɵgetInheritedFactory(_InputPassword)))(__ngFactoryType__ || _InputPassword);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _InputPassword,
    selectors: [["", "pInputPassword", ""]],
    hostVars: 3,
    hostBindings: function InputPassword_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("type", ctx.inputType);
        ɵɵclassMap(ctx.cx("root"));
      }
    },
    inputs: {
      mask: [1, "mask"]
    },
    outputs: {
      mask: "maskChange"
    },
    features: [ɵɵProvidersFeature([InputPasswordStyle, {
      provide: PARENT_INSTANCE,
      useExisting: _InputPassword
    }]), ɵɵHostDirectivesFeature([{
      directive: InputText,
      inputs: ["invalid", "invalid", "variant", "variant", "fluid", "fluid", "pSize", "pSize", "pInputTextPT", "pInputTextPT", "pInputTextUnstyled", "pInputTextUnstyled", "hostName", "hostName"]
    }]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InputPassword, [{
    type: Directive,
    args: [{
      selector: "[pInputPassword]",
      standalone: true,
      host: {
        "[attr.type]": "inputType",
        "[class]": "cx('root')"
      },
      providers: [InputPasswordStyle, {
        provide: PARENT_INSTANCE,
        useExisting: InputPassword
      }],
      hostDirectives: [{
        directive: InputText,
        inputs: ["invalid", "variant", "fluid", "pSize", "pInputTextPT", "pInputTextUnstyled", "hostName"]
      }]
    }]
  }], null, {
    mask: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "mask",
        required: false
      }]
    }, {
      type: Output,
      args: ["maskChange"]
    }]
  });
})();
var InputPasswordModule = class _InputPasswordModule {
  static ɵfac = function InputPasswordModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InputPasswordModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _InputPasswordModule,
    imports: [InputPassword],
    exports: [InputPassword]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InputPasswordModule, [{
    type: NgModule,
    args: [{
      imports: [InputPassword],
      exports: [InputPassword]
    }]
  }], null, null);
})();
export {
  InputPassword,
  InputPasswordClasses,
  InputPasswordModule,
  InputPasswordStyle
};
//# sourceMappingURL=primeng_inputpassword.js.map
