import {
  Ripple,
  Spinner
} from "./chunk-IKJBIBEI.js";
import {
  AutoFocus
} from "./chunk-JJBFR52L.js";
import {
  Fluid
} from "./chunk-V7NQNLRP.js";
import {
  BaseComponent,
  PARENT_INSTANCE
} from "./chunk-3KTBS3JL.js";
import {
  Bind
} from "./chunk-RBNGSEBV.js";
import {
  BaseStyle
} from "./chunk-ZQICQ6EM.js";
import {
  SharedModule
} from "./chunk-HLLH2L5P.js";
import {
  l,
  p
} from "./chunk-RB5ZFJAO.js";
import {
  NgTemplateOutlet
} from "./chunk-KX2I6PVZ.js";
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  Injectable,
  Input,
  NgModule,
  Output,
  ViewEncapsulation,
  booleanAttribute,
  contentChild,
  input,
  numberAttribute,
  output,
  setClassMetadata,
  ɵɵHostDirectivesFeature,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuerySignal,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryAdvance,
  ɵɵstyleMap,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-N3JMXNJE.js";
import {
  InjectionToken,
  computed,
  effect,
  forwardRef,
  inject,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵnamespaceSVG
} from "./chunk-QAPLPPA7.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// node_modules/@primeuix/styles/dist/button/index.mjs
var style = `
    .p-button {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        color: dt('button.primary.color');
        background: dt('button.primary.background');
        border: 1px solid dt('button.primary.border.color');
        padding: dt('button.padding.y') dt('button.padding.x');
        font-size: dt('button.font.size');
        font-weight: dt('button.label.font.weight');
        transition:
            background dt('button.transition.duration'),
            color dt('button.transition.duration'),
            border-color dt('button.transition.duration'),
            outline-color dt('button.transition.duration'),
            box-shadow dt('button.transition.duration');
        border-radius: dt('button.border.radius');
        outline-color: transparent;
        gap: dt('button.gap');
    }

    .p-button:disabled {
        cursor: default;
    }

    .p-button-icon-right {
        order: 1;
    }

    .p-button-icon-right:dir(rtl) {
        order: -1;
    }

    .p-button:not(.p-button-vertical) .p-button-icon:not(.p-button-icon-right):dir(rtl) {
        order: 1;
    }

    .p-button-icon-bottom {
        order: 2;
    }

    .p-button-icon-only {
        width: dt('button.icon.only.width');
        padding-inline-start: 0;
        padding-inline-end: 0;
        gap: 0;
    }

    .p-button-icon-only.p-button-rounded {
        border-radius: 50%;
        height: dt('button.icon.only.width');
    }

    .p-button-icon-only .p-button-label {
        visibility: hidden;
        width: 0;
    }

    .p-button-icon-only::after {
        content: " ";
        visibility: hidden;
        width: 0;
    }

    .p-button-sm {
        font-size: dt('button.sm.font.size');
        padding: dt('button.sm.padding.y') dt('button.sm.padding.x');
    }

    .p-button-sm .p-button-icon {
        font-size: dt('button.sm.font.size');
    }

    .p-button-sm.p-button-icon-only {
        width: dt('button.sm.icon.only.width');
    }

    .p-button-sm.p-button-icon-only.p-button-rounded {
        height: dt('button.sm.icon.only.width');
    }

    .p-button-lg {
        font-size: dt('button.lg.font.size');
        padding: dt('button.lg.padding.y') dt('button.lg.padding.x');
    }

    .p-button-lg .p-button-icon {
        font-size: dt('button.lg.font.size');
    }

    .p-button-lg.p-button-icon-only {
        width: dt('button.lg.icon.only.width');
    }

    .p-button-lg.p-button-icon-only.p-button-rounded {
        height: dt('button.lg.icon.only.width');
    }

    .p-button-vertical {
        flex-direction: column;
    }

    .p-button-label {
        font-weight: dt('button.label.font.weight');
    }

    .p-button-fluid {
        width: 100%;
    }

    .p-button-fluid.p-button-icon-only {
        width: dt('button.icon.only.width');
    }

    .p-button:not(:disabled):hover {
        background: dt('button.primary.hover.background');
        border: 1px solid dt('button.primary.hover.border.color');
        color: dt('button.primary.hover.color');
    }

    .p-button:not(:disabled):active {
        background: dt('button.primary.active.background');
        border: 1px solid dt('button.primary.active.border.color');
        color: dt('button.primary.active.color');
    }

    .p-button:focus-visible {
        box-shadow: dt('button.primary.focus.ring.shadow');
        outline: dt('button.focus.ring.width') dt('button.focus.ring.style') dt('button.primary.focus.ring.color');
        outline-offset: dt('button.focus.ring.offset');
    }

    .p-button .p-badge {
        min-width: dt('button.badge.size');
        height: dt('button.badge.size');
        line-height: dt('button.badge.size');
    }

    .p-button-raised {
        box-shadow: dt('button.raised.shadow');
    }

    .p-button-rounded {
        border-radius: dt('button.rounded.border.radius');
    }

    .p-button-secondary {
        background: dt('button.secondary.background');
        border: 1px solid dt('button.secondary.border.color');
        color: dt('button.secondary.color');
    }

    .p-button-secondary:not(:disabled):hover {
        background: dt('button.secondary.hover.background');
        border: 1px solid dt('button.secondary.hover.border.color');
        color: dt('button.secondary.hover.color');
    }

    .p-button-secondary:not(:disabled):active {
        background: dt('button.secondary.active.background');
        border: 1px solid dt('button.secondary.active.border.color');
        color: dt('button.secondary.active.color');
    }

    .p-button-secondary:focus-visible {
        outline-color: dt('button.secondary.focus.ring.color');
        box-shadow: dt('button.secondary.focus.ring.shadow');
    }

    .p-button-success {
        background: dt('button.success.background');
        border: 1px solid dt('button.success.border.color');
        color: dt('button.success.color');
    }

    .p-button-success:not(:disabled):hover {
        background: dt('button.success.hover.background');
        border: 1px solid dt('button.success.hover.border.color');
        color: dt('button.success.hover.color');
    }

    .p-button-success:not(:disabled):active {
        background: dt('button.success.active.background');
        border: 1px solid dt('button.success.active.border.color');
        color: dt('button.success.active.color');
    }

    .p-button-success:focus-visible {
        outline-color: dt('button.success.focus.ring.color');
        box-shadow: dt('button.success.focus.ring.shadow');
    }

    .p-button-info {
        background: dt('button.info.background');
        border: 1px solid dt('button.info.border.color');
        color: dt('button.info.color');
    }

    .p-button-info:not(:disabled):hover {
        background: dt('button.info.hover.background');
        border: 1px solid dt('button.info.hover.border.color');
        color: dt('button.info.hover.color');
    }

    .p-button-info:not(:disabled):active {
        background: dt('button.info.active.background');
        border: 1px solid dt('button.info.active.border.color');
        color: dt('button.info.active.color');
    }

    .p-button-info:focus-visible {
        outline-color: dt('button.info.focus.ring.color');
        box-shadow: dt('button.info.focus.ring.shadow');
    }

    .p-button-warn {
        background: dt('button.warn.background');
        border: 1px solid dt('button.warn.border.color');
        color: dt('button.warn.color');
    }

    .p-button-warn:not(:disabled):hover {
        background: dt('button.warn.hover.background');
        border: 1px solid dt('button.warn.hover.border.color');
        color: dt('button.warn.hover.color');
    }

    .p-button-warn:not(:disabled):active {
        background: dt('button.warn.active.background');
        border: 1px solid dt('button.warn.active.border.color');
        color: dt('button.warn.active.color');
    }

    .p-button-warn:focus-visible {
        outline-color: dt('button.warn.focus.ring.color');
        box-shadow: dt('button.warn.focus.ring.shadow');
    }

    .p-button-help {
        background: dt('button.help.background');
        border: 1px solid dt('button.help.border.color');
        color: dt('button.help.color');
    }

    .p-button-help:not(:disabled):hover {
        background: dt('button.help.hover.background');
        border: 1px solid dt('button.help.hover.border.color');
        color: dt('button.help.hover.color');
    }

    .p-button-help:not(:disabled):active {
        background: dt('button.help.active.background');
        border: 1px solid dt('button.help.active.border.color');
        color: dt('button.help.active.color');
    }

    .p-button-help:focus-visible {
        outline-color: dt('button.help.focus.ring.color');
        box-shadow: dt('button.help.focus.ring.shadow');
    }

    .p-button-danger {
        background: dt('button.danger.background');
        border: 1px solid dt('button.danger.border.color');
        color: dt('button.danger.color');
    }

    .p-button-danger:not(:disabled):hover {
        background: dt('button.danger.hover.background');
        border: 1px solid dt('button.danger.hover.border.color');
        color: dt('button.danger.hover.color');
    }

    .p-button-danger:not(:disabled):active {
        background: dt('button.danger.active.background');
        border: 1px solid dt('button.danger.active.border.color');
        color: dt('button.danger.active.color');
    }

    .p-button-danger:focus-visible {
        outline-color: dt('button.danger.focus.ring.color');
        box-shadow: dt('button.danger.focus.ring.shadow');
    }

    .p-button-contrast {
        background: dt('button.contrast.background');
        border: 1px solid dt('button.contrast.border.color');
        color: dt('button.contrast.color');
    }

    .p-button-contrast:not(:disabled):hover {
        background: dt('button.contrast.hover.background');
        border: 1px solid dt('button.contrast.hover.border.color');
        color: dt('button.contrast.hover.color');
    }

    .p-button-contrast:not(:disabled):active {
        background: dt('button.contrast.active.background');
        border: 1px solid dt('button.contrast.active.border.color');
        color: dt('button.contrast.active.color');
    }

    .p-button-contrast:focus-visible {
        outline-color: dt('button.contrast.focus.ring.color');
        box-shadow: dt('button.contrast.focus.ring.shadow');
    }

    .p-button-outlined {
        background: transparent;
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined:not(:disabled):hover {
        background: dt('button.outlined.primary.hover.background');
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined:not(:disabled):active {
        background: dt('button.outlined.primary.active.background');
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined.p-button-secondary {
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-secondary:not(:disabled):hover {
        background: dt('button.outlined.secondary.hover.background');
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-secondary:not(:disabled):active {
        background: dt('button.outlined.secondary.active.background');
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-success {
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-success:not(:disabled):hover {
        background: dt('button.outlined.success.hover.background');
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-success:not(:disabled):active {
        background: dt('button.outlined.success.active.background');
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-info {
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-info:not(:disabled):hover {
        background: dt('button.outlined.info.hover.background');
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-info:not(:disabled):active {
        background: dt('button.outlined.info.active.background');
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-warn {
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-warn:not(:disabled):hover {
        background: dt('button.outlined.warn.hover.background');
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-warn:not(:disabled):active {
        background: dt('button.outlined.warn.active.background');
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-help {
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-help:not(:disabled):hover {
        background: dt('button.outlined.help.hover.background');
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-help:not(:disabled):active {
        background: dt('button.outlined.help.active.background');
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-danger {
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-danger:not(:disabled):hover {
        background: dt('button.outlined.danger.hover.background');
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-danger:not(:disabled):active {
        background: dt('button.outlined.danger.active.background');
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-contrast {
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-contrast:not(:disabled):hover {
        background: dt('button.outlined.contrast.hover.background');
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-contrast:not(:disabled):active {
        background: dt('button.outlined.contrast.active.background');
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-plain {
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-outlined.p-button-plain:not(:disabled):hover {
        background: dt('button.outlined.plain.hover.background');
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-outlined.p-button-plain:not(:disabled):active {
        background: dt('button.outlined.plain.active.background');
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-text {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text:not(:disabled):hover {
        background: dt('button.text.primary.hover.background');
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text:not(:disabled):active {
        background: dt('button.text.primary.active.background');
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text.p-button-secondary {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-secondary:not(:disabled):hover {
        background: dt('button.text.secondary.hover.background');
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-secondary:not(:disabled):active {
        background: dt('button.text.secondary.active.background');
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-success {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-success:not(:disabled):hover {
        background: dt('button.text.success.hover.background');
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-success:not(:disabled):active {
        background: dt('button.text.success.active.background');
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-info {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-info:not(:disabled):hover {
        background: dt('button.text.info.hover.background');
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-info:not(:disabled):active {
        background: dt('button.text.info.active.background');
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-warn {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-warn:not(:disabled):hover {
        background: dt('button.text.warn.hover.background');
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-warn:not(:disabled):active {
        background: dt('button.text.warn.active.background');
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-help {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-help:not(:disabled):hover {
        background: dt('button.text.help.hover.background');
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-help:not(:disabled):active {
        background: dt('button.text.help.active.background');
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-danger {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-danger:not(:disabled):hover {
        background: dt('button.text.danger.hover.background');
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-danger:not(:disabled):active {
        background: dt('button.text.danger.active.background');
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-contrast {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-contrast:not(:disabled):hover {
        background: dt('button.text.contrast.hover.background');
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-contrast:not(:disabled):active {
        background: dt('button.text.contrast.active.background');
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-plain {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-text.p-button-plain:not(:disabled):hover {
        background: dt('button.text.plain.hover.background');
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-text.p-button-plain:not(:disabled):active {
        background: dt('button.text.plain.active.background');
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-link {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.color');
    }

    .p-button-link:not(:disabled):hover {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.hover.color');
    }

    .p-button-link:not(:disabled):hover .p-button-label {
        text-decoration: underline;
    }

    .p-button-link:not(:disabled):active {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.active.color');
    }
`;

// node_modules/@primeuix/styles/dist/badge/index.mjs
var style2 = "\n    .p-badge {\n        display: inline-flex;\n        border-radius: dt('badge.border.radius');\n        align-items: center;\n        justify-content: center;\n        padding: dt('badge.padding');\n        background: dt('badge.primary.background');\n        color: dt('badge.primary.color');\n        font-size: dt('badge.font.size');\n        font-weight: dt('badge.font.weight');\n        min-width: dt('badge.min.width');\n        height: dt('badge.height');\n    }\n\n    .p-badge-dot {\n        width: dt('badge.dot.size');\n        min-width: dt('badge.dot.size');\n        height: dt('badge.dot.size');\n        border-radius: 50%;\n        padding: 0;\n    }\n\n    .p-badge-circle {\n        padding: 0;\n        border-radius: 50%;\n    }\n\n    .p-badge-secondary {\n        background: dt('badge.secondary.background');\n        color: dt('badge.secondary.color');\n    }\n\n    .p-badge-success {\n        background: dt('badge.success.background');\n        color: dt('badge.success.color');\n    }\n\n    .p-badge-info {\n        background: dt('badge.info.background');\n        color: dt('badge.info.color');\n    }\n\n    .p-badge-warn {\n        background: dt('badge.warn.background');\n        color: dt('badge.warn.color');\n    }\n\n    .p-badge-danger {\n        background: dt('badge.danger.background');\n        color: dt('badge.danger.color');\n    }\n\n    .p-badge-contrast {\n        background: dt('badge.contrast.background');\n        color: dt('badge.contrast.color');\n    }\n\n    .p-badge-sm {\n        font-size: dt('badge.sm.font.size');\n        min-width: dt('badge.sm.min.width');\n        height: dt('badge.sm.height');\n    }\n\n    .p-badge-lg {\n        font-size: dt('badge.lg.font.size');\n        min-width: dt('badge.lg.min.width');\n        height: dt('badge.lg.height');\n    }\n\n    .p-badge-xl {\n        font-size: dt('badge.xl.font.size');\n        min-width: dt('badge.xl.min.width');\n        height: dt('badge.xl.height');\n    }\n";

// node_modules/primeng/fesm2022/primeng-badge.mjs
var style3 = (
  /*css*/
  `
    ${style2}
`
);
var classes = {
  root: ({
    instance
  }) => {
    const value = instance.value();
    const size = instance.size();
    const badgeSize = instance.badgeSize();
    const severity = instance.severity();
    return ["p-badge p-component", {
      "p-badge-circle": l(value) && String(value).length === 1,
      "p-badge-dot": p(value),
      "p-badge-sm": size === "small" || badgeSize === "small",
      "p-badge-lg": size === "large" || badgeSize === "large",
      "p-badge-xl": size === "xlarge" || badgeSize === "xlarge",
      "p-badge-info": severity === "info",
      "p-badge-success": severity === "success",
      "p-badge-warn": severity === "warn",
      "p-badge-danger": severity === "danger",
      "p-badge-secondary": severity === "secondary",
      "p-badge-contrast": severity === "contrast"
    }];
  }
};
var BadgeStyle = class _BadgeStyle extends BaseStyle {
  name = "badge";
  style = style3;
  classes = classes;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵBadgeStyle_BaseFactory;
    return function BadgeStyle_Factory(__ngFactoryType__) {
      return (ɵBadgeStyle_BaseFactory || (ɵBadgeStyle_BaseFactory = ɵɵgetInheritedFactory(_BadgeStyle)))(__ngFactoryType__ || _BadgeStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _BadgeStyle,
    factory: _BadgeStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BadgeStyle, [{
    type: Injectable
  }], null, null);
})();
var BadgeClasses;
(function(BadgeClasses2) {
  BadgeClasses2["root"] = "p-badge";
})(BadgeClasses || (BadgeClasses = {}));
var BADGE_INSTANCE = new InjectionToken("BADGE_INSTANCE");
var Badge = class _Badge extends BaseComponent {
  componentName = "Badge";
  $pcBadge = inject(BADGE_INSTANCE, {
    optional: true,
    skipSelf: true
  }) ?? void 0;
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptms(["host", "root"]));
  }
  /**
   * Size of the badge, valid options are "large" and "xlarge".
   * @group Props
   */
  badgeSize = input(
    ...ngDevMode ? [void 0, {
      debugName: "badgeSize"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Size of the badge, valid options are "large" and "xlarge".
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
   * Severity type of the badge.
   * @group Props
   */
  severity = input(
    ...ngDevMode ? [void 0, {
      debugName: "severity"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Value to display inside the badge.
   * @group Props
   */
  value = input(
    ...ngDevMode ? [void 0, {
      debugName: "value"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * When specified, disables the component.
   * @group Props
   */
  badgeDisabled = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "badgeDisabled"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  _componentStyle = inject(BadgeStyle);
  displayStyle = computed(
    () => this.badgeDisabled() ? "none" : null,
    ...ngDevMode ? [{
      debugName: "displayStyle"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  dataP = computed(
    () => {
      const value = this.value();
      const severity = this.severity();
      const size = this.size();
      return this.cn({
        circle: value != null && String(value).length === 1,
        empty: value == null,
        disabled: this.badgeDisabled(),
        [severity]: severity,
        [size]: size
      });
    },
    ...ngDevMode ? [{
      debugName: "dataP"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵBadge_BaseFactory;
    return function Badge_Factory(__ngFactoryType__) {
      return (ɵBadge_BaseFactory || (ɵBadge_BaseFactory = ɵɵgetInheritedFactory(_Badge)))(__ngFactoryType__ || _Badge);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _Badge,
    selectors: [["p-badge"]],
    hostVars: 5,
    hostBindings: function Badge_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("data-p", ctx.dataP());
        ɵɵclassMap(ctx.cx("root"));
        ɵɵstyleProp("display", ctx.displayStyle());
      }
    },
    inputs: {
      badgeSize: [1, "badgeSize"],
      size: [1, "size"],
      severity: [1, "severity"],
      value: [1, "value"],
      badgeDisabled: [1, "badgeDisabled"]
    },
    features: [ɵɵProvidersFeature([BadgeStyle, {
      provide: BADGE_INSTANCE,
      useExisting: _Badge
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _Badge
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    decls: 1,
    vars: 1,
    template: function Badge_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtext(0);
      }
      if (rf & 2) {
        ɵɵtextInterpolate(ctx.value());
      }
    },
    dependencies: [SharedModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Badge, [{
    type: Component,
    args: [{
      selector: "p-badge",
      template: `{{ value() }}`,
      standalone: true,
      imports: [SharedModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [BadgeStyle, {
        provide: BADGE_INSTANCE,
        useExisting: Badge
      }, {
        provide: PARENT_INSTANCE,
        useExisting: Badge
      }],
      host: {
        "[class]": "cx('root')",
        "[style.display]": "displayStyle()",
        "[attr.data-p]": "dataP()"
      },
      hostDirectives: [Bind]
    }]
  }], null, {
    badgeSize: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "badgeSize",
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
    severity: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "severity",
        required: false
      }]
    }],
    value: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "value",
        required: false
      }]
    }],
    badgeDisabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "badgeDisabled",
        required: false
      }]
    }]
  });
})();
var BadgeModule = class _BadgeModule {
  static ɵfac = function BadgeModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BadgeModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _BadgeModule,
    imports: [Badge, SharedModule],
    exports: [Badge, SharedModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [Badge, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BadgeModule, [{
    type: NgModule,
    args: [{
      imports: [Badge, SharedModule],
      exports: [Badge, SharedModule]
    }]
  }], null, null);
})();

// node_modules/primeng/fesm2022/primeng-button.mjs
var _c0 = ["content"];
var _c1 = ["loadingicon"];
var _c2 = ["icon"];
var _c3 = ["*"];
function Button_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function Button_Conditional_3_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 5);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(3);
    ɵɵclassMap(ctx_r0.cn(ctx_r0.cx("loadingIcon"), "pi-spin", ctx_r0.$loadingIcon()));
    ɵɵproperty("pBind", ctx_r0.ptm("loadingIcon"));
    ɵɵattribute("aria-hidden", true);
  }
}
function Button_Conditional_3_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelement(0, "svg", 6);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(3);
    ɵɵclassMap(ctx_r0.cn(ctx_r0.cx("loadingIcon"), ctx_r0.cx("spinnerIcon")));
    ɵɵproperty("spin", true)("pBind", ctx_r0.ptm("loadingIcon"));
    ɵɵattribute("aria-hidden", true);
  }
}
function Button_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, Button_Conditional_3_Conditional_0_Conditional_0_Template, 1, 4, "span", 2)(1, Button_Conditional_3_Conditional_0_Conditional_1_Template, 1, 5, ":svg:svg", 4);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵconditional(ctx_r0.$loadingIcon() ? 0 : 1);
  }
}
function Button_Conditional_3_Conditional_1_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function Button_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, Button_Conditional_3_Conditional_1_ng_container_0_Template, 1, 0, "ng-container", 7);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("ngTemplateOutlet", ctx_r0.loadingIconTemplate())("ngTemplateOutletContext", ctx_r0.getLoadingIconTemplateContext());
  }
}
function Button_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, Button_Conditional_3_Conditional_0_Template, 2, 1)(1, Button_Conditional_3_Conditional_1_Template, 1, 2, "ng-container");
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵconditional(!ctx_r0.loadingIconTemplate() ? 0 : 1);
  }
}
function Button_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 5);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵclassMap(ctx_r0.cn(ctx_r0.cx("icon"), ctx_r0.$icon()));
    ɵɵproperty("pBind", ctx_r0.ptm("icon"));
    ɵɵattribute("data-p", ctx_r0.dataIconP());
  }
}
function Button_Conditional_4_Conditional_1_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function Button_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, Button_Conditional_4_Conditional_1_ng_container_0_Template, 1, 0, "ng-container", 7);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("ngTemplateOutlet", ctx_r0.iconTemplate())("ngTemplateOutletContext", ctx_r0.getIconTemplateContext());
  }
}
function Button_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, Button_Conditional_4_Conditional_0_Template, 1, 4, "span", 2);
    ɵɵconditionalCreate(1, Button_Conditional_4_Conditional_1_Template, 1, 2, "ng-container");
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵconditional(ctx_r0.$icon() && !ctx_r0.iconTemplate() ? 0 : -1);
    ɵɵadvance();
    ɵɵconditional(!ctx_r0.icon() && ctx_r0.iconTemplate() ? 1 : -1);
  }
}
function Button_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 5);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵclassMap(ctx_r0.cx("label"));
    ɵɵproperty("pBind", ctx_r0.ptm("label"));
    ɵɵattribute("aria-hidden", ctx_r0.$icon() && !ctx_r0.$label())("data-p", ctx_r0.dataLabelP());
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.$label());
  }
}
function Button_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "p-badge", 3);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("value", ctx_r0.$badge())("severity", ctx_r0.$badgeSeverity())("pt", ctx_r0.ptm("pcBadge"))("unstyled", ctx_r0.unstyled());
  }
}
var classes2 = {
  root: ({
    instance
  }) => {
    const hasIcon = instance.hasIcon();
    const label = instance.label();
    const buttonProps = instance.buttonProps();
    const loading = instance.loading();
    const link = instance.link();
    const severity = instance.severity();
    const raised = instance.raised();
    const rounded = instance.rounded();
    const text = instance.text();
    const variant = instance.variant();
    const outlined = instance.outlined();
    const size = instance.size();
    const plain = instance.plain();
    const badge = instance.badge();
    const hasFluid = instance.hasFluid();
    const iconPos = instance.iconPos();
    return ["p-button p-component", {
      "p-button-icon-only": hasIcon && !label && !buttonProps?.label && !badge,
      "p-button-vertical": (iconPos === "top" || iconPos === "bottom") && label,
      "p-button-loading": loading || buttonProps?.loading,
      "p-button-link": link || buttonProps?.link,
      [`p-button-${severity || buttonProps?.severity}`]: severity || buttonProps?.severity,
      "p-button-raised": raised || buttonProps?.raised,
      "p-button-rounded": rounded || buttonProps?.rounded,
      "p-button-text": text || variant === "text" || buttonProps?.text || buttonProps?.variant === "text",
      "p-button-outlined": outlined || variant === "outlined" || buttonProps?.outlined || buttonProps?.variant === "outlined",
      "p-button-sm": size === "small" || buttonProps?.size === "small",
      "p-button-lg": size === "large" || buttonProps?.size === "large",
      "p-button-plain": plain || buttonProps?.plain,
      "p-button-fluid": hasFluid
    }];
  },
  loadingIcon: "p-button-loading-icon",
  icon: ({
    instance
  }) => {
    const iconPos = instance.iconPos();
    const buttonProps = instance.buttonProps();
    const label = instance.label();
    const icon = instance.icon();
    return ["p-button-icon", {
      [`p-button-icon-${iconPos || buttonProps?.iconPos}`]: label || buttonProps?.label,
      "p-button-icon-left": (iconPos === "left" || buttonProps?.iconPos === "left") && label || buttonProps?.label,
      "p-button-icon-right": (iconPos === "right" || buttonProps?.iconPos === "right") && label || buttonProps?.label,
      "p-button-icon-top": (iconPos === "top" || buttonProps?.iconPos === "top") && label || buttonProps?.label,
      "p-button-icon-bottom": (iconPos === "bottom" || buttonProps?.iconPos === "bottom") && label || buttonProps?.label
    }, icon, buttonProps?.icon];
  },
  spinnerIcon: ({
    instance
  }) => {
    return Object.entries(instance.cx("icon")).filter(([, value]) => !!value).reduce((acc, [key]) => acc + ` ${key}`, "p-button-loading-icon");
  },
  label: "p-button-label"
};
var ButtonStyle = class _ButtonStyle extends BaseStyle {
  name = "button";
  style = style;
  classes = classes2;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵButtonStyle_BaseFactory;
    return function ButtonStyle_Factory(__ngFactoryType__) {
      return (ɵButtonStyle_BaseFactory || (ɵButtonStyle_BaseFactory = ɵɵgetInheritedFactory(_ButtonStyle)))(__ngFactoryType__ || _ButtonStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _ButtonStyle,
    factory: _ButtonStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ButtonStyle, [{
    type: Injectable
  }], null, null);
})();
var ButtonClasses;
(function(ButtonClasses2) {
  ButtonClasses2["root"] = "p-button";
  ButtonClasses2["loadingIcon"] = "p-button-loading-icon";
  ButtonClasses2["icon"] = "p-button-icon";
  ButtonClasses2["label"] = "p-button-label";
})(ButtonClasses || (ButtonClasses = {}));
var BUTTON_INSTANCE = new InjectionToken("BUTTON_INSTANCE");
var Button = class _Button extends BaseComponent {
  componentName = "Button";
  hostName = input(
    "",
    ...ngDevMode ? [{
      debugName: "hostName"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $pcButton = inject(BUTTON_INSTANCE, {
    optional: true,
    skipSelf: true
  }) ?? void 0;
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(ButtonStyle);
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("host"));
  }
  /**
   * Type of the button.
   * @group Props
   */
  type = input(
    "button",
    ...ngDevMode ? [{
      debugName: "type"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Value of the badge.
   * @group Props
   */
  badge = input(
    ...ngDevMode ? [void 0, {
      debugName: "badge"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * When present, it specifies that the component should be disabled.
   * @group Props
   */
  disabled = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "disabled"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Add a shadow to indicate elevation.
   * @group Props
   */
  raised = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "raised"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Add a circular border radius to the button.
   * @group Props
   */
  rounded = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "rounded"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Add a textual class to the button without a background initially.
   * @group Props
   */
  text = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "text"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Add a plain textual class to the button without a background initially.
   * @group Props
   */
  plain = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "plain"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Add a border class without a background initially.
   * @group Props
   */
  outlined = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "outlined"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Add a link style to the button.
   * @group Props
   */
  link = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "link"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Add a tabindex to the button.
   * @group Props
   */
  tabindex = input(0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "tabindex"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: numberAttribute
  }));
  /**
   * Defines the size of the button.
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
   * Specifies the variant of the component.
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
   * Inline style of the element.
   * @group Props
   */
  style = input(
    ...ngDevMode ? [void 0, {
      debugName: "style"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Class of the element.
   * @group Props
   */
  styleClass = input(
    ...ngDevMode ? [void 0, {
      debugName: "styleClass"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Severity type of the badge.
   * @group Props
   * @defaultValue secondary
   */
  badgeSeverity = input(
    "secondary",
    ...ngDevMode ? [{
      debugName: "badgeSeverity"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Used to define a string that autocomplete attribute the current element.
   * @group Props
   */
  ariaLabel = input(
    ...ngDevMode ? [void 0, {
      debugName: "ariaLabel"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * When present, it specifies that the component should automatically get focus on load.
   * @group Props
   */
  autofocus = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "autofocus"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Position of the icon.
   * @group Props
   */
  iconPos = input(
    "left",
    ...ngDevMode ? [{
      debugName: "iconPos"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Name of the icon.
   * @group Props
   */
  icon = input(
    ...ngDevMode ? [void 0, {
      debugName: "icon"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Text of the button.
   * @group Props
   */
  label = input(
    ...ngDevMode ? [void 0, {
      debugName: "label"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Whether the button is in loading state.
   * @group Props
   */
  loading = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "loading"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Icon to display in loading state.
   * @group Props
   */
  loadingIcon = input(
    ...ngDevMode ? [void 0, {
      debugName: "loadingIcon"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Defines the style of the button.
   * @group Props
   */
  severity = input(
    ...ngDevMode ? [void 0, {
      debugName: "severity"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Used to pass all properties of the ButtonProps to the Button component.
   * @group Props
   */
  buttonProps = input(
    ...ngDevMode ? [void 0, {
      debugName: "buttonProps"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Spans 100% width of the container when enabled.
   * @defaultValue undefined
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
   * Forces icon-only styling regardless of content. When unset, icon-only is inferred from the absence of a label/badge.
   * @group Props
   */
  iconOnly = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "iconOnly"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Callback to execute when button is clicked.
   * This event is intended to be used with the <p-button> component. Using a regular <button> element, use (click).
   * @param {MouseEvent} event - Mouse event.
   * @group Emits
   */
  onClick = output();
  /**
   * Callback to execute when button is focused.
   * This event is intended to be used with the <p-button> component. Using a regular <button> element, use (focus).
   * @param {FocusEvent} event - Focus event.
   * @group Emits
   */
  onFocus = output();
  /**
   * Callback to execute when button loses focus.
   * This event is intended to be used with the <p-button> component. Using a regular <button> element, use (blur).
   * @param {FocusEvent} event - Focus event.
   * @group Emits
   */
  onBlur = output();
  /**
   * Custom content template.
   * @group Templates
   **/
  contentTemplate = contentChild("content", __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "contentTemplate"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    descendants: false
  }));
  /**
   * Custom loading icon template.
   * @group Templates
   **/
  loadingIconTemplate = contentChild("loadingicon", __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "loadingIconTemplate"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    descendants: false
  }));
  /**
   * Custom icon template.
   * @group Templates
   **/
  iconTemplate = contentChild("icon", __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "iconTemplate"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    descendants: false
  }));
  pcFluid = inject(Fluid, {
    optional: true,
    host: true,
    skipSelf: true
  });
  hasFluid = computed(
    () => this.fluid() ?? !!this.pcFluid,
    ...ngDevMode ? [{
      debugName: "hasFluid"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $type = computed(
    () => this.type() || this.buttonProps()?.type,
    ...ngDevMode ? [{
      debugName: "$type"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $ariaLabel = computed(
    () => this.ariaLabel() || this.buttonProps()?.ariaLabel,
    ...ngDevMode ? [{
      debugName: "$ariaLabel"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  mergedStyle = computed(
    () => this.style() || this.buttonProps()?.style,
    ...ngDevMode ? [{
      debugName: "mergedStyle"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $disabled = computed(
    () => this.disabled() || this.loading() || this.buttonProps()?.disabled,
    ...ngDevMode ? [{
      debugName: "$disabled"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $severity = computed(
    () => this.severity() || this.buttonProps()?.severity,
    ...ngDevMode ? [{
      debugName: "$severity"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $tabindex = computed(
    () => this.tabindex() || this.buttonProps()?.tabindex,
    ...ngDevMode ? [{
      debugName: "$tabindex"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $autofocus = computed(
    () => this.autofocus() || this.buttonProps()?.autofocus,
    ...ngDevMode ? [{
      debugName: "$autofocus"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $loading = computed(
    () => this.loading() || this.buttonProps()?.loading,
    ...ngDevMode ? [{
      debugName: "$loading"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $icon = computed(
    () => this.icon() || this.buttonProps()?.icon,
    ...ngDevMode ? [{
      debugName: "$icon"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $label = computed(
    () => this.label() || this.buttonProps()?.label,
    ...ngDevMode ? [{
      debugName: "$label"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $badge = computed(
    () => this.badge() || this.buttonProps()?.badge,
    ...ngDevMode ? [{
      debugName: "$badge"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $loadingIcon = computed(
    () => this.loadingIcon() || this.buttonProps()?.loadingIcon,
    ...ngDevMode ? [{
      debugName: "$loadingIcon"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $badgeSeverity = computed(
    () => this.badgeSeverity() || this.buttonProps()?.badgeSeverity,
    ...ngDevMode ? [{
      debugName: "$badgeSeverity"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  showLabel = computed(
    () => !this.contentTemplate() && this.$label(),
    ...ngDevMode ? [{
      debugName: "showLabel"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  showBadge = computed(
    () => !this.contentTemplate() && this.$badge(),
    ...ngDevMode ? [{
      debugName: "showBadge"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  getLoadingIconTemplateContext() {
    return {
      class: this.cx("loadingIcon"),
      pt: this.ptm("loadingIcon")
    };
  }
  getIconTemplateContext() {
    return {
      class: this.cx("icon"),
      pt: this.ptm("icon")
    };
  }
  hasIcon = computed(
    () => this.$icon() || this.iconTemplate() || this.loadingIcon() || this.loadingIconTemplate(),
    ...ngDevMode ? [{
      debugName: "hasIcon"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $outlined = computed(
    () => this.outlined() || this.variant() === "outlined" || this.buttonProps()?.outlined || this.buttonProps()?.variant === "outlined",
    ...ngDevMode ? [{
      debugName: "$outlined"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $text = computed(
    () => this.text() || this.variant() === "text" || this.buttonProps()?.text || this.buttonProps()?.variant === "text",
    ...ngDevMode ? [{
      debugName: "$text"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $iconOnly = computed(
    () => this.iconOnly() || this.hasIcon() && !this.$label() && !this.$badge(),
    ...ngDevMode ? [{
      debugName: "$iconOnly"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  dataP = computed(
    () => this.cn({
      [this.size()]: this.size(),
      "icon-only": this.$iconOnly(),
      loading: this.$loading(),
      fluid: this.hasFluid(),
      rounded: this.rounded(),
      raised: this.raised(),
      outlined: this.$outlined(),
      text: this.$text(),
      link: this.link(),
      vertical: (this.iconPos() === "top" || this.iconPos() === "bottom") && this.$label()
    }),
    ...ngDevMode ? [{
      debugName: "dataP"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  dataIconP = computed(
    () => this.cn({
      [this.iconPos()]: this.iconPos(),
      [this.size()]: this.size()
    }),
    ...ngDevMode ? [{
      debugName: "dataIconP"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  dataLabelP = computed(
    () => this.cn({
      [this.size()]: this.size(),
      "icon-only": this.$iconOnly()
    }),
    ...ngDevMode ? [{
      debugName: "dataLabelP"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵButton_BaseFactory;
    return function Button_Factory(__ngFactoryType__) {
      return (ɵButton_BaseFactory || (ɵButton_BaseFactory = ɵɵgetInheritedFactory(_Button)))(__ngFactoryType__ || _Button);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _Button,
    selectors: [["p-button"]],
    contentQueries: function Button_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuerySignal(dirIndex, ctx.contentTemplate, _c0, 4)(dirIndex, ctx.loadingIconTemplate, _c1, 4)(dirIndex, ctx.iconTemplate, _c2, 4);
      }
      if (rf & 2) {
        ɵɵqueryAdvance(3);
      }
    },
    inputs: {
      hostName: [1, "hostName"],
      type: [1, "type"],
      badge: [1, "badge"],
      disabled: [1, "disabled"],
      raised: [1, "raised"],
      rounded: [1, "rounded"],
      text: [1, "text"],
      plain: [1, "plain"],
      outlined: [1, "outlined"],
      link: [1, "link"],
      tabindex: [1, "tabindex"],
      size: [1, "size"],
      variant: [1, "variant"],
      style: [1, "style"],
      styleClass: [1, "styleClass"],
      badgeSeverity: [1, "badgeSeverity"],
      ariaLabel: [1, "ariaLabel"],
      autofocus: [1, "autofocus"],
      iconPos: [1, "iconPos"],
      icon: [1, "icon"],
      label: [1, "label"],
      loading: [1, "loading"],
      loadingIcon: [1, "loadingIcon"],
      severity: [1, "severity"],
      buttonProps: [1, "buttonProps"],
      fluid: [1, "fluid"],
      iconOnly: [1, "iconOnly"]
    },
    outputs: {
      onClick: "onClick",
      onFocus: "onFocus",
      onBlur: "onBlur"
    },
    features: [ɵɵProvidersFeature([ButtonStyle, {
      provide: BUTTON_INSTANCE,
      useExisting: _Button
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _Button
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c3,
    decls: 7,
    vars: 18,
    consts: [["pRipple", "", 3, "click", "focus", "blur", "disabled", "pAutoFocus", "pBind"], [4, "ngTemplateOutlet"], [3, "class", "pBind"], [3, "value", "severity", "pt", "unstyled"], ["data-p-icon", "spinner", 3, "class", "spin", "pBind"], [3, "pBind"], ["data-p-icon", "spinner", 3, "spin", "pBind"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"]],
    template: function Button_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵelementStart(0, "button", 0);
        ɵɵlistener("click", function Button_Template_button_click_0_listener($event) {
          return ctx.onClick.emit($event);
        })("focus", function Button_Template_button_focus_0_listener($event) {
          return ctx.onFocus.emit($event);
        })("blur", function Button_Template_button_blur_0_listener($event) {
          return ctx.onBlur.emit($event);
        });
        ɵɵprojection(1);
        ɵɵtemplate(2, Button_ng_container_2_Template, 1, 0, "ng-container", 1);
        ɵɵconditionalCreate(3, Button_Conditional_3_Template, 2, 1);
        ɵɵconditionalCreate(4, Button_Conditional_4_Template, 2, 2);
        ɵɵconditionalCreate(5, Button_Conditional_5_Template, 2, 6, "span", 2);
        ɵɵconditionalCreate(6, Button_Conditional_6_Template, 1, 4, "p-badge", 3);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵstyleMap(ctx.mergedStyle());
        ɵɵclassMap(ctx.cn(ctx.cx("root"), ctx.styleClass(), ctx.buttonProps()?.styleClass));
        ɵɵproperty("disabled", ctx.$disabled())("pAutoFocus", ctx.$autofocus())("pBind", ctx.ptm("root"));
        ɵɵattribute("type", ctx.$type())("aria-label", ctx.$ariaLabel())("tabindex", ctx.$tabindex())("data-p", ctx.dataP())("data-p-disabled", ctx.$disabled())("data-p-severity", ctx.$severity());
        ɵɵadvance(2);
        ɵɵproperty("ngTemplateOutlet", ctx.contentTemplate());
        ɵɵadvance();
        ɵɵconditional(ctx.$loading() ? 3 : -1);
        ɵɵadvance();
        ɵɵconditional(!ctx.$loading() ? 4 : -1);
        ɵɵadvance();
        ɵɵconditional(ctx.showLabel() ? 5 : -1);
        ɵɵadvance();
        ɵɵconditional(ctx.showBadge() ? 6 : -1);
      }
    },
    dependencies: [NgTemplateOutlet, Ripple, AutoFocus, Spinner, BadgeModule, Badge, Bind],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Button, [{
    type: Component,
    args: [{
      selector: "p-button",
      standalone: true,
      imports: [NgTemplateOutlet, Ripple, AutoFocus, Spinner, BadgeModule, Bind],
      template: `
        <button
            [attr.type]="$type()"
            [attr.aria-label]="$ariaLabel()"
            [style]="mergedStyle()"
            [disabled]="$disabled()"
            [class]="cn(cx('root'), styleClass(), buttonProps()?.styleClass)"
            (click)="onClick.emit($event)"
            (focus)="onFocus.emit($event)"
            (blur)="onBlur.emit($event)"
            pRipple
            [attr.tabindex]="$tabindex()"
            [pAutoFocus]="$autofocus()"
            [pBind]="ptm('root')"
            [attr.data-p]="dataP()"
            [attr.data-p-disabled]="$disabled()"
            [attr.data-p-severity]="$severity()"
        >
            <ng-content />
            <ng-container *ngTemplateOutlet="contentTemplate()" />
            @if ($loading()) {
                @if (!loadingIconTemplate()) {
                    @if ($loadingIcon()) {
                        <span [class]="cn(cx('loadingIcon'), 'pi-spin', $loadingIcon())" [pBind]="ptm('loadingIcon')" [attr.aria-hidden]="true"></span>
                    } @else {
                        <svg data-p-icon="spinner" [class]="cn(cx('loadingIcon'), cx('spinnerIcon'))" [spin]="true" [pBind]="ptm('loadingIcon')" [attr.aria-hidden]="true" />
                    }
                } @else {
                    <ng-container *ngTemplateOutlet="loadingIconTemplate(); context: getLoadingIconTemplateContext()" />
                }
            }
            @if (!$loading()) {
                @if ($icon() && !iconTemplate()) {
                    <span [class]="cn(cx('icon'), $icon())" [pBind]="ptm('icon')" [attr.data-p]="dataIconP()"></span>
                }
                @if (!icon() && iconTemplate()) {
                    <ng-container *ngTemplateOutlet="iconTemplate(); context: getIconTemplateContext()" />
                }
            }
            @if (showLabel()) {
                <span [class]="cx('label')" [attr.aria-hidden]="$icon() && !$label()" [pBind]="ptm('label')" [attr.data-p]="dataLabelP()">{{ $label() }}</span>
            }
            @if (showBadge()) {
                <p-badge [value]="$badge()" [severity]="$badgeSeverity()" [pt]="ptm('pcBadge')" [unstyled]="unstyled()" />
            }
        </button>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [ButtonStyle, {
        provide: BUTTON_INSTANCE,
        useExisting: Button
      }, {
        provide: PARENT_INSTANCE,
        useExisting: Button
      }],
      hostDirectives: [Bind]
    }]
  }], null, {
    hostName: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "hostName",
        required: false
      }]
    }],
    type: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "type",
        required: false
      }]
    }],
    badge: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "badge",
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
    raised: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "raised",
        required: false
      }]
    }],
    rounded: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "rounded",
        required: false
      }]
    }],
    text: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "text",
        required: false
      }]
    }],
    plain: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "plain",
        required: false
      }]
    }],
    outlined: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "outlined",
        required: false
      }]
    }],
    link: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "link",
        required: false
      }]
    }],
    tabindex: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "tabindex",
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
    variant: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "variant",
        required: false
      }]
    }],
    style: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "style",
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
    badgeSeverity: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "badgeSeverity",
        required: false
      }]
    }],
    ariaLabel: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "ariaLabel",
        required: false
      }]
    }],
    autofocus: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "autofocus",
        required: false
      }]
    }],
    iconPos: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "iconPos",
        required: false
      }]
    }],
    icon: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "icon",
        required: false
      }]
    }],
    label: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "label",
        required: false
      }]
    }],
    loading: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "loading",
        required: false
      }]
    }],
    loadingIcon: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "loadingIcon",
        required: false
      }]
    }],
    severity: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "severity",
        required: false
      }]
    }],
    buttonProps: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "buttonProps",
        required: false
      }]
    }],
    fluid: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fluid",
        required: false
      }]
    }],
    iconOnly: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "iconOnly",
        required: false
      }]
    }],
    onClick: [{
      type: Output,
      args: ["onClick"]
    }],
    onFocus: [{
      type: Output,
      args: ["onFocus"]
    }],
    onBlur: [{
      type: Output,
      args: ["onBlur"]
    }],
    contentTemplate: [{
      type: ContentChild,
      args: ["content", __spreadProps(__spreadValues({}, {
        descendants: false
      }), {
        isSignal: true
      })]
    }],
    loadingIconTemplate: [{
      type: ContentChild,
      args: ["loadingicon", __spreadProps(__spreadValues({}, {
        descendants: false
      }), {
        isSignal: true
      })]
    }],
    iconTemplate: [{
      type: ContentChild,
      args: ["icon", __spreadProps(__spreadValues({}, {
        descendants: false
      }), {
        isSignal: true
      })]
    }]
  });
})();
var BUTTON_ICON_INSTANCE = new InjectionToken("BUTTON_ICON_INSTANCE");
var ButtonIcon = class _ButtonIcon extends BaseComponent {
  componentName = "ButtonIcon";
  /**
   * Used to pass attributes to DOM elements inside the pButtonIcon.
   * @defaultValue undefined
   * @group Props
   */
  pButtonIconPT = input(
    ...ngDevMode ? [void 0, {
      debugName: "pButtonIconPT"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Indicates whether the component should be rendered without styles.
   * @defaultValue undefined
   * @group Props
   */
  pButtonUnstyled = input(
    ...ngDevMode ? [void 0, {
      debugName: "pButtonUnstyled"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $pcButtonIcon = inject(BUTTON_ICON_INSTANCE, {
    optional: true,
    skipSelf: true
  }) ?? void 0;
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  constructor() {
    super();
    effect(() => {
      const pt = this.pButtonIconPT();
      pt && this.directivePT.set(pt);
    });
    effect(() => {
      this.pButtonUnstyled() && this.directiveUnstyled.set(this.pButtonUnstyled());
    });
  }
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptms(["host", "root"]));
  }
  static ɵfac = function ButtonIcon_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ButtonIcon)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _ButtonIcon,
    selectors: [["", "pButtonIcon", ""]],
    hostVars: 2,
    hostBindings: function ButtonIcon_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("p-button-icon", !ctx.$unstyled() && true);
      }
    },
    inputs: {
      pButtonIconPT: [1, "pButtonIconPT"],
      pButtonUnstyled: [1, "pButtonUnstyled"]
    },
    features: [ɵɵProvidersFeature([ButtonStyle, {
      provide: BUTTON_ICON_INSTANCE,
      useExisting: _ButtonIcon
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _ButtonIcon
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ButtonIcon, [{
    type: Directive,
    args: [{
      selector: "[pButtonIcon]",
      providers: [ButtonStyle, {
        provide: BUTTON_ICON_INSTANCE,
        useExisting: ButtonIcon
      }, {
        provide: PARENT_INSTANCE,
        useExisting: ButtonIcon
      }],
      standalone: true,
      host: {
        "[class.p-button-icon]": "!$unstyled() && true"
      },
      hostDirectives: [Bind]
    }]
  }], () => [], {
    pButtonIconPT: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pButtonIconPT",
        required: false
      }]
    }],
    pButtonUnstyled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pButtonUnstyled",
        required: false
      }]
    }]
  });
})();
var BUTTON_LABEL_INSTANCE = new InjectionToken("BUTTON_LABEL_INSTANCE");
var ButtonLabel = class _ButtonLabel extends BaseComponent {
  componentName = "ButtonLabel";
  /**
   * Used to pass attributes to DOM elements inside the pButtonLabel.
   * @defaultValue undefined
   * @group Props
   */
  pButtonLabelPT = input(
    ...ngDevMode ? [void 0, {
      debugName: "pButtonLabelPT"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Indicates whether the component should be rendered without styles.
   * @defaultValue undefined
   * @group Props
   */
  pButtonLabelUnstyled = input(
    ...ngDevMode ? [void 0, {
      debugName: "pButtonLabelUnstyled"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $pcButtonLabel = inject(BUTTON_LABEL_INSTANCE, {
    optional: true,
    skipSelf: true
  }) ?? void 0;
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  constructor() {
    super();
    effect(() => {
      const pt = this.pButtonLabelPT();
      pt && this.directivePT.set(pt);
    });
    effect(() => {
      this.pButtonLabelUnstyled() && this.directiveUnstyled.set(this.pButtonLabelUnstyled());
    });
  }
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptms(["host", "root"]));
  }
  static ɵfac = function ButtonLabel_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ButtonLabel)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _ButtonLabel,
    selectors: [["", "pButtonLabel", ""]],
    hostVars: 2,
    hostBindings: function ButtonLabel_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("p-button-label", !ctx.$unstyled() && true);
      }
    },
    inputs: {
      pButtonLabelPT: [1, "pButtonLabelPT"],
      pButtonLabelUnstyled: [1, "pButtonLabelUnstyled"]
    },
    features: [ɵɵProvidersFeature([ButtonStyle, {
      provide: BUTTON_LABEL_INSTANCE,
      useExisting: _ButtonLabel
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _ButtonLabel
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ButtonLabel, [{
    type: Directive,
    args: [{
      selector: "[pButtonLabel]",
      providers: [ButtonStyle, {
        provide: BUTTON_LABEL_INSTANCE,
        useExisting: ButtonLabel
      }, {
        provide: PARENT_INSTANCE,
        useExisting: ButtonLabel
      }],
      standalone: true,
      host: {
        "[class.p-button-label]": "!$unstyled() && true"
      },
      hostDirectives: [Bind]
    }]
  }], () => [], {
    pButtonLabelPT: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pButtonLabelPT",
        required: false
      }]
    }],
    pButtonLabelUnstyled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pButtonLabelUnstyled",
        required: false
      }]
    }]
  });
})();
var BUTTON_DIRECTIVE_INSTANCE = new InjectionToken("BUTTON_DIRECTIVE_INSTANCE");
var ButtonDirective = class _ButtonDirective extends BaseComponent {
  componentName = "Button";
  /**
   * Bound configuration object. Fields win over the individual styling inputs
   * (`text`, `raised`, `severity`, …); unset fields fall back to those inputs.
   * @group Props
   */
  pButton = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "pButton"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    alias: "pButton"
  }));
  /**
   * Used to pass attributes to DOM elements inside the Button component.
   * @group Props
   */
  pButtonPT = input(
    ...ngDevMode ? [void 0, {
      debugName: "pButtonPT"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Indicates whether the component should be rendered without styles.
   * @group Props
   */
  pButtonUnstyled = input(
    ...ngDevMode ? [void 0, {
      debugName: "pButtonUnstyled"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * @group Props
   */
  hostName = input(
    "",
    ...ngDevMode ? [{
      debugName: "hostName"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Add a textual class to the button without a background initially.
   * @group Props
   */
  text = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "text"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Add a plain textual class to the button without a background initially.
   * @group Props
   */
  plain = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "plain"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Add a shadow to indicate elevation.
   * @group Props
   */
  raised = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "raised"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Defines the size of the button.
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
   * Add a border class without a background initially.
   * @group Props
   */
  outlined = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "outlined"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Renders the button as a textual link without background or border.
   * @group Props
   */
  link = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "link"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Add a circular border radius to the button.
   * @group Props
   */
  rounded = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "rounded"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Spans 100% width of the container when enabled.
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
   * Visual variant of the button. Equivalent to setting `text` or `outlined` individually.
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
   * Forces icon-only styling regardless of content. Works with any direct icon child
   * (`<svg>`, `<i>`, custom).
   * @group Props
   */
  iconOnly = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "iconOnly"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Whether the button is in loading state.
   * @deprecated Manage loading state with native `disabled` and a child spinner; this input will be removed in a future release.
   * @group Props
   */
  loading = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "loading"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Defines the style of the button.
   * @group Props
   */
  severity = input(
    ...ngDevMode ? [void 0, {
      debugName: "severity"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  $pcButtonDirective = inject(BUTTON_DIRECTIVE_INSTANCE, {
    optional: true,
    skipSelf: true
  }) ?? void 0;
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  pcFluid = inject(Fluid, {
    optional: true,
    host: true,
    skipSelf: true
  });
  _componentStyle = inject(ButtonStyle);
  iconSignal = contentChild(ButtonIcon, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "iconSignal"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    descendants: false
  }));
  labelSignal = contentChild(ButtonLabel, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "labelSignal"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    descendants: false
  }));
  /** @deprecated Use the `iconOnly` input instead. */
  isIconOnly = computed(
    () => !!(!this.labelSignal() && this.iconSignal()),
    ...ngDevMode ? [{
      debugName: "isIconOnly"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  styleClass = computed(
    () => {
      if (this.$unstyled()) return "";
      const v = this.pButton();
      const o = typeof v === "object" && v !== null ? v : {};
      const stringSeverity = typeof v === "string" && v !== "" ? v : void 0;
      const severity = o.severity ?? stringSeverity ?? this.severity();
      const size = o.size ?? this.size();
      const variant = o.variant ?? this.variant();
      const base = this.cn("p-button", "p-component", {
        "p-button-icon-only": this.iconOnly() || o.iconOnly || this.isIconOnly(),
        "p-button-loading": this.loading(),
        "p-disabled": this.loading(),
        "p-button-text": this.text() || variant === "text" || o.text,
        "p-button-outlined": this.outlined() || variant === "outlined" || o.outlined,
        "p-button-link": this.link() || variant === "link" || o.link,
        "p-button-plain": this.plain() || o.plain,
        "p-button-raised": this.raised() || o.raised,
        "p-button-rounded": this.rounded() || o.rounded,
        "p-button-sm": size === "small",
        "p-button-lg": size === "large",
        "p-button-fluid": this.fluid() ?? o.fluid ?? !!this.pcFluid,
        [`p-button-${severity}`]: !!severity
      });
      return o.styleClass ? `${base} ${o.styleClass}` : base;
    },
    ...ngDevMode ? [{
      debugName: "styleClass"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  hostStyle = computed(
    () => {
      const v = this.pButton();
      const o = typeof v === "object" && v !== null ? v : {};
      return o.style ?? null;
    },
    ...ngDevMode ? [{
      debugName: "hostStyle"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    super();
    effect(() => {
      const pt = this.pButtonPT();
      if (pt) this.directivePT.set(pt);
    });
    effect(() => {
      const unstyled = this.pButtonUnstyled();
      if (unstyled !== void 0) this.directiveUnstyled.set(unstyled);
    });
  }
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  static ɵfac = function ButtonDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ButtonDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _ButtonDirective,
    selectors: [["", "pButton", ""]],
    contentQueries: function ButtonDirective_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuerySignal(dirIndex, ctx.iconSignal, ButtonIcon, 4)(dirIndex, ctx.labelSignal, ButtonLabel, 4);
      }
      if (rf & 2) {
        ɵɵqueryAdvance(2);
      }
    },
    hostVars: 4,
    hostBindings: function ButtonDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵstyleMap(ctx.hostStyle());
        ɵɵclassMap(ctx.styleClass());
      }
    },
    inputs: {
      pButton: [1, "pButton"],
      pButtonPT: [1, "pButtonPT"],
      pButtonUnstyled: [1, "pButtonUnstyled"],
      hostName: [1, "hostName"],
      text: [1, "text"],
      plain: [1, "plain"],
      raised: [1, "raised"],
      size: [1, "size"],
      outlined: [1, "outlined"],
      link: [1, "link"],
      rounded: [1, "rounded"],
      fluid: [1, "fluid"],
      variant: [1, "variant"],
      iconOnly: [1, "iconOnly"],
      loading: [1, "loading"],
      severity: [1, "severity"]
    },
    features: [ɵɵProvidersFeature([ButtonStyle, {
      provide: BUTTON_DIRECTIVE_INSTANCE,
      useExisting: _ButtonDirective
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _ButtonDirective
    }]), ɵɵHostDirectivesFeature([Bind, Ripple]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ButtonDirective, [{
    type: Directive,
    args: [{
      selector: "[pButton]",
      standalone: true,
      providers: [ButtonStyle, {
        provide: BUTTON_DIRECTIVE_INSTANCE,
        useExisting: ButtonDirective
      }, {
        provide: PARENT_INSTANCE,
        useExisting: ButtonDirective
      }],
      host: {
        "[class]": "styleClass()",
        "[style]": "hostStyle()"
      },
      hostDirectives: [Bind, Ripple]
    }]
  }], () => [], {
    pButton: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pButton",
        required: false
      }]
    }],
    pButtonPT: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pButtonPT",
        required: false
      }]
    }],
    pButtonUnstyled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pButtonUnstyled",
        required: false
      }]
    }],
    hostName: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "hostName",
        required: false
      }]
    }],
    text: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "text",
        required: false
      }]
    }],
    plain: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "plain",
        required: false
      }]
    }],
    raised: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "raised",
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
    outlined: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "outlined",
        required: false
      }]
    }],
    link: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "link",
        required: false
      }]
    }],
    rounded: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "rounded",
        required: false
      }]
    }],
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
    iconOnly: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "iconOnly",
        required: false
      }]
    }],
    loading: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "loading",
        required: false
      }]
    }],
    severity: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "severity",
        required: false
      }]
    }],
    iconSignal: [{
      type: ContentChild,
      args: [forwardRef(() => ButtonIcon), __spreadProps(__spreadValues({}, {
        descendants: false
      }), {
        isSignal: true
      })]
    }],
    labelSignal: [{
      type: ContentChild,
      args: [forwardRef(() => ButtonLabel), __spreadProps(__spreadValues({}, {
        descendants: false
      }), {
        isSignal: true
      })]
    }]
  });
})();
var ButtonModule = class _ButtonModule {
  static ɵfac = function ButtonModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ButtonModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _ButtonModule,
    imports: [ButtonDirective, Button, ButtonLabel, ButtonIcon],
    exports: [ButtonDirective, Button, ButtonLabel, ButtonIcon]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [Button]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ButtonModule, [{
    type: NgModule,
    args: [{
      imports: [ButtonDirective, Button, ButtonLabel, ButtonIcon],
      exports: [ButtonDirective, Button, ButtonLabel, ButtonIcon]
    }]
  }], null, null);
})();

export {
  ButtonStyle,
  ButtonClasses,
  BUTTON_INSTANCE,
  Button,
  BUTTON_ICON_INSTANCE,
  ButtonIcon,
  BUTTON_LABEL_INSTANCE,
  ButtonLabel,
  ButtonDirective,
  ButtonModule
};
//# sourceMappingURL=chunk-T6ASHIQX.js.map
