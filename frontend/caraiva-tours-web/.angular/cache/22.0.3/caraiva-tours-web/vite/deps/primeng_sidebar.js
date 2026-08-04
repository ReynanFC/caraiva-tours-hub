import {
  dt
} from "./chunk-MSLT2XYH.js";
import {
  BaseComponent,
  PARENT_INSTANCE
} from "./chunk-3KTBS3JL.js";
import {
  Bind,
  BindModule
} from "./chunk-RBNGSEBV.js";
import {
  BaseStyle
} from "./chunk-ZQICQ6EM.js";
import "./chunk-HLLH2L5P.js";
import "./chunk-VOEPLAYN.js";
import {
  s2 as s
} from "./chunk-RB5ZFJAO.js";
import {
  isPlatformBrowser
} from "./chunk-KX2I6PVZ.js";
import "./chunk-4ZHAZINZ.js";
import "./chunk-EZXZ43RR.js";
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  HostListener,
  Injectable,
  Input,
  NgModule,
  Output,
  ViewEncapsulation,
  booleanAttribute,
  input,
  model,
  setClassMetadata,
  ɵɵHostDirectivesFeature,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineNgModule,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵstyleProp
} from "./chunk-N3JMXNJE.js";
import {
  InjectionToken,
  computed,
  effect,
  inject,
  signal,
  ɵɵdefineInjectable,
  ɵɵdefineInjector
} from "./chunk-QAPLPPA7.js";
import "./chunk-RSS3ODKE.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// node_modules/@primeuix/styles/dist/sidebar/index.mjs
var style = `
    .p-sidebar-layout {
        display: flex;
        width: 100%;
        min-height: 100svh;
        background: dt('sidebar.layout.background');
    }

    .p-sidebar {
        display: block;
        position: relative;
        z-index: 20;
    }

    .p-sidebar-backdrop {
        z-index: 15;
    }

    .p-sidebar[data-overlay] {
        z-index: 30;
    }

    .p-sidebar[data-collapsible-mode="none"] {
        display: flex;
        width: var(--px-sidebar-width);
        flex-direction: column;
    }

    .p-sidebar-spacer {
        display: block;
        position: relative;
        flex-shrink: 0;
        background: transparent;
        transition: width 250ms cubic-bezier(.4, 0, .2, 1);
    }

    .p-sidebar:not([data-overlay]) > .p-sidebar-spacer {
        width: var(--px-sidebar-width);
    }

    .p-sidebar[data-collapsible="offcanvas"]:not([data-overlay]) > .p-sidebar-spacer {
        width: 0;
    }

    .p-sidebar[data-collapsible="icon"]:not([data-overlay])>.p-sidebar-spacer {
        width: var(--px-sidebar-width-icon);
    }

    .p-sidebar[data-variant="floating"][data-collapsible="icon"]:not([data-overlay])>.p-sidebar-spacer {
        width: calc(var(--px-sidebar-width-icon) + 1rem + 2px);
    }

    .p-sidebar[data-variant="inset"][data-collapsible="icon"]:not([data-overlay])>.p-sidebar-spacer {
        width: calc(var(--px-sidebar-width-icon) + 0.5rem);
    }

    .p-sidebar[data-collapsible-mode="offcanvas"][data-overlay]>.p-sidebar-spacer {
        width: 0;
    }

    .p-sidebar[data-overlay]:not([data-collapsible-mode="offcanvas"])>.p-sidebar-spacer {
        width: var(--px-sidebar-width-icon);
    }

    .p-sidebar[data-overlay][data-variant="floating"]:not([data-collapsible-mode="offcanvas"])>.p-sidebar-spacer {
        width: calc(var(--px-sidebar-width-icon) + 1rem + 2px);
    }

    .p-sidebar[data-overlay][data-variant="inset"]:not([data-collapsible-mode="offcanvas"])>.p-sidebar-spacer {
        width: calc(var(--px-sidebar-width-icon) + 0.5rem);
    }

    .p-sidebar[data-side="right"]>.p-sidebar-spacer {
        transform: rotate(180deg);
    }

    .p-sidebar-aside {
        position: absolute;
        inset-block: 0;
        z-index: 10;
        display: flex;
        height: 100%;
        width: var(--px-sidebar-width);
        transition: left 250ms cubic-bezier(.4, 0, .2, 1), right 250ms cubic-bezier(.4, 0, .2, 1), width 250ms cubic-bezier(.4, 0, .2, 1);
    }

    .p-sidebar[data-overlay] .p-sidebar-aside {
        z-index: 20;
    }

    .p-sidebar[data-side="left"] .p-sidebar-aside {
        left: 0;
    }

    .p-sidebar[data-side="left"][data-collapsible="offcanvas"] .p-sidebar-aside {
        left: calc(var(--px-sidebar-width) * -1);
    }

    .p-sidebar[data-side="right"] .p-sidebar-aside {
        right: 0;
    }

    .p-sidebar[data-side="right"][data-collapsible="offcanvas"] .p-sidebar-aside {
        right: calc(var(--px-sidebar-width) * -1);
    }

    .p-sidebar[data-variant="floating"] .p-sidebar-aside {
        padding: dt('sidebar.aside.padding');
    }

    .p-sidebar[data-variant="inset"] .p-sidebar-aside {
        padding: dt('sidebar.aside.padding');
    }

    .p-sidebar[data-variant="inset"][data-side="left"] .p-sidebar-aside {
        padding-right: 0;
    }

    .p-sidebar[data-variant="inset"][data-side="right"] .p-sidebar-aside {
        padding-left: 0;
    }

    .p-sidebar[data-variant="floating"][data-collapsible="icon"] .p-sidebar-aside {
        width: calc(var(--px-sidebar-width-icon) + 1rem + 2px);
    }

    .p-sidebar[data-variant="inset"][data-collapsible="icon"] .p-sidebar-aside {
        width: calc(var(--px-sidebar-width-icon) + 0.5rem);
    }

    .p-sidebar[data-variant="sidebar"][data-collapsible="icon"] .p-sidebar-aside {
        width: calc(var(--px-sidebar-width-icon));
    }

    .p-sidebar[data-variant="sidebar"][data-side="left"] .p-sidebar-aside {
        border-right: 1px solid dt('sidebar.border.color');
    }

    .p-sidebar[data-variant="sidebar"][data-side="right"] .p-sidebar-aside {
        border-left: 1px solid dt('sidebar.border.color');
    }

    .p-sidebar-panel {
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
        overflow: hidden;
        color: dt('sidebar.panel.color');
    }

    .p-sidebar[data-variant="sidebar"] .p-sidebar-panel {
        background: dt('sidebar.panel.background');
    }

    .p-sidebar[data-variant="floating"] .p-sidebar-panel {
        background: dt('sidebar.panel.background');
        border-radius: dt('sidebar.panel.floating.border.radius');
        border: 1px solid dt('sidebar.border.color');
        box-shadow: dt('sidebar.panel.floating.shadow');
    }

    .p-sidebar[data-variant="inset"] .p-sidebar-panel {
        background: dt('sidebar.layout.background');
    }

    .p-sidebar-header {
        display: flex;
        flex-direction: column;
        gap: dt('sidebar.header.gap');
        padding: dt('sidebar.header.padding');
    }

    .p-sidebar-footer {
        display: flex;
        flex-direction: column;
        gap: dt('sidebar.footer.gap');
        padding: dt('sidebar.footer.padding');
    }

    .p-sidebar-content {
        display: flex;
        min-height: 0;
        flex: 1;
        flex-direction: column;
        gap: dt('sidebar.content.gap');
        overflow: auto;
        scrollbar-width: none;
    }

    .p-sidebar[data-collapsible="icon"] .p-sidebar-content {
        overflow: auto;
        scrollbar-width: none;
    }

    .p-sidebar-group {
        position: relative;
        display: flex;
        width: 100%;
        min-width: 0;
        flex-direction: column;
        padding: dt('sidebar.group.padding');
    }

    .p-sidebar-group-label {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        outline: none;
        height: dt('sidebar.group.label.height');
        border-radius: dt('sidebar.group.label.border.radius');
        padding: dt('sidebar.group.label.padding');
        font-size: dt('sidebar.group.label.font.size');
        font-weight: dt('sidebar.group.label.font.weight');
        color: dt('sidebar.group.label.color');
        transition: translate 250ms cubic-bezier(.4, 0, .2, 1), opacity 250ms cubic-bezier(.4, 0, .2, 1);
    }

    .p-sidebar-group-label:focus-visible {
        outline: dt('sidebar.focus.ring.width') dt('sidebar.focus.ring.style') dt('sidebar.focus.ring.color');
        outline-offset: dt('sidebar.focus.ring.offset');
        box-shadow: dt('sidebar.focus.ring.shadow');
    }

    .p-sidebar[data-collapsible="icon"] .p-sidebar-group-label {
        translate: 0 -0.375rem;
        opacity: 0;
    }

    .p-sidebar-group-action {
        position: absolute;
        display: flex;
        aspect-ratio: 1;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: none;
        background: none;
        outline: none;
        cursor: pointer;
        top: dt('sidebar.group.action.top');
        right: dt('sidebar.group.action.right');
        width: dt('sidebar.group.action.size');
        height: dt('sidebar.group.action.size');
        border-radius: dt('sidebar.group.action.border.radius');
        color: dt('sidebar.group.action.color');
        transition: background 150ms, color 150ms;
    }

    .p-sidebar-group-action svg {
        font-weight: dt('sidebar.group.action.icon.size');
        width: dt('sidebar.group.action.icon.size');
        height: dt('sidebar.group.action.icon.size');
        flex-shrink: 0;
    }

    .p-sidebar-group-action:hover {
        background: dt('sidebar.group.action.focus.background');
        color: dt('sidebar.group.action.focus.color');
    }

    .p-sidebar-group-action:focus-visible {
        outline: dt('sidebar.focus.ring.width') dt('sidebar.focus.ring.style') dt('sidebar.focus.ring.color');
        outline-offset: dt('sidebar.focus.ring.offset');
        box-shadow: dt('sidebar.focus.ring.shadow');
    }

    .p-sidebar[data-collapsible="icon"] .p-sidebar-group-action {
        display: none;
    }

    .p-sidebar-group-content {
        display: block;
        width: 100%;
        font-size: 0.875rem;
    }

    .p-sidebar-menu {
        display: flex;
        width: 100%;
        min-width: 0;
        flex-direction: column;
        list-style: none;
        padding: 0;
        margin: 0;
        gap: dt('sidebar.menu.gap');
    }

    .p-sidebar-menu-item {
        display: block;
        position: relative;
        list-style: none;
    }

    .p-sidebar-menu-button {
        display: flex;
        width: 100%;
        align-items: center;
        overflow: hidden;
        border: none;
        text-align: left;
        background: none;
        outline: none;
        cursor: pointer;
        padding: dt('sidebar.menu.button.padding');
        gap: dt('sidebar.menu.button.gap');
        height: dt('sidebar.menu.button.height');
        border-radius: dt('sidebar.menu.button.border.radius');
        font-size: dt('sidebar.menu.button.font.size');
        font-weight: dt('sidebar.menu.button.font.weight');
        color: dt('sidebar.menu.button.color');
        transition: width 250ms cubic-bezier(.4, 0, .2, 1), height 250ms cubic-bezier(.4, 0, .2, 1), padding 250ms cubic-bezier(.4, 0, .2, 1), background 250ms cubic-bezier(.4, 0, .2, 1), color 250ms cubic-bezier(.4, 0, .2, 1);
    }

    .p-sidebar-menu-button svg {
        color: dt('sidebar.menu.button.icon.color');
        font-weight: dt('sidebar.menu.button.icon.size');
        width: dt('sidebar.menu.button.icon.size');
        height: dt('sidebar.menu.button.icon.size');
        flex-shrink: 0;
    }

    .p-sidebar-menu-button>span:last-child {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .p-sidebar-menu-item:has(> .p-sidebar-menu-action)>.p-sidebar-menu-button {
        padding-inline-end: dt('sidebar.menu.button.with.action.padding.end');
    }

    .p-sidebar[data-collapsible="icon"] .p-sidebar-menu-button {
        width: dt('sidebar.menu.button.icon.only.width');
        height: dt('sidebar.menu.button.icon.only.width');
        padding: dt('sidebar.menu.button.padding');
    }

    .p-sidebar-menu-button:hover svg {
        color: dt('sidebar.menu.button.icon.focus.color');
    }

    .p-sidebar-menu-button:hover {
        background: dt('sidebar.menu.button.focus.background');
        color: dt('sidebar.menu.button.focus.color');
    }

    .p-sidebar-menu-button:focus-visible {
        outline: dt('sidebar.focus.ring.width') dt('sidebar.focus.ring.style') dt('sidebar.focus.ring.color');
        outline-offset: dt('sidebar.focus.ring.offset');
        box-shadow: dt('sidebar.focus.ring.shadow');
    }

    .p-sidebar-menu-button:active {
        background: dt('sidebar.menu.button.focus.background');
        color: dt('sidebar.menu.button.focus.color');
    }

    .p-sidebar-menu-button:disabled,
    .p-sidebar-menu-button[aria-disabled="true"] {
        pointer-events: none;
        opacity: 0.5;
    }

    .p-sidebar-menu-button[data-active="true"] {
        background: dt('sidebar.menu.button.active.background');
        font-weight: dt('sidebar.menu.button.font.weight');
        color: dt('sidebar.menu.button.active.color');
    }

    .p-sidebar-menu-action {
        position: absolute;
        display: flex;
        aspect-ratio: 1;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: none;
        background: none;
        outline: none;
        cursor: pointer;
        top: dt('sidebar.menu.action.top');
        right: dt('sidebar.menu.action.right');
        width: dt('sidebar.menu.action.width');
        border-radius: dt('sidebar.menu.action.border.radius');
        color: dt('sidebar.menu.action.color');
        transition: opacity 150ms, color 150ms, background 150ms;
    }

    .p-sidebar-menu-action svg {
        font-weight: dt('sidebar.menu.action.icon.size');
        width: dt('sidebar.menu.action.icon.size');
        height: dt('sidebar.menu.action.icon.size');
        flex-shrink: 0;
    }

    .p-sidebar-menu-action:hover {
        background: dt('sidebar.menu.action.focus.background');
        color: dt('sidebar.menu.action.focus.color');
    }

    .p-sidebar-menu-action:focus-visible {
        outline: dt('sidebar.focus.ring.width') dt('sidebar.focus.ring.style') dt('sidebar.focus.ring.color');
        outline-offset: dt('sidebar.focus.ring.offset');
        box-shadow: dt('sidebar.focus.ring.shadow');
    }

    .p-sidebar[data-collapsible="icon"] .p-sidebar-menu-action {
        display: none;
    }

    .p-sidebar-menu-action[data-show-on-hover] {
        opacity: 0;
    }

    .p-sidebar-menu-item:hover>.p-sidebar-menu-action[data-show-on-hover],
    .p-sidebar-menu-item:focus-within>.p-sidebar-menu-action[data-show-on-hover] {
        opacity: 1;
    }

    .p-sidebar-menu-badge {
        pointer-events: none;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        font-variant-numeric: tabular-nums;
        user-select: none;
        top: dt('sidebar.menu.badge.top');
        right: dt('sidebar.menu.badge.right');
        height: dt('sidebar.menu.badge.height');
        min-width: dt('sidebar.menu.badge.min.width');
        border-radius: dt('sidebar.menu.badge.border.radius');
        padding: dt('sidebar.menu.badge.padding');
        font-size: dt('sidebar.menu.badge.font.size');
        font-weight: dt('sidebar.menu.badge.font.weight');
        background: dt('sidebar.menu.badge.background');
        border: 1px solid dt('sidebar.menu.badge.border.color');
        color: dt('sidebar.menu.badge.color');
    }

    .p-sidebar[data-collapsible="icon"] .p-sidebar-menu-badge {
        display: none;
    }

    .p-sidebar-menu-sub {
        display: flex;
        min-width: 0;
        width: 100%;
        flex-direction: column;
        list-style: none;
        padding-inline: 0;
        margin: 0;
        gap: dt('sidebar.menu.sub.gap');
        padding-block: dt('sidebar.menu.sub.padding.block');
    }

    .p-sidebar[data-collapsible="icon"] .p-sidebar-menu-sub {
        display: none;
    }

    .p-sidebar-menu-item:not([data-collapsible])>.p-sidebar-menu-sub,
    .p-sidebar-menu-item:not([data-collapsible])>.p-sidebar-menu-sub-content-container>.p-sidebar-menu-sub-content-wrapper>.p-sidebar-menu-sub {
        transform: translateX(1px);
        margin-inline: dt('sidebar.menu.sub.indent.margin');
        padding-inline: dt('sidebar.menu.sub.indent.padding');
        border-left: 1px solid dt('sidebar.border.color');
    }

    .p-sidebar-menu-item[data-collapsible]>.p-sidebar-menu-sub,
    .p-sidebar-menu-item[data-collapsible]>.p-sidebar-menu-sub-content-container>.p-sidebar-menu-sub-content-wrapper>.p-sidebar-menu-sub {
        padding-left: dt('sidebar.menu.sub.collapsible.indent');
        padding-block: 0;
        margin-top: dt('sidebar.menu.sub.collapsible.top.margin');
        border-radius: dt('sidebar.menu.sub.collapsible.border.radius');
        overflow: hidden;
    }

    .p-sidebar-menu-sub-item {
        display: block;
        position: relative;
        width: 100%;
        list-style: none;
    }

    .p-sidebar-menu-sub-button {
        display: flex;
        min-width: 0;
        width: 100%;
        transform: translateX(-1px);
        align-items: center;
        overflow: hidden;
        border: none;
        background: none;
        outline: none;
        cursor: pointer;
        height: dt('sidebar.menu.sub.button.height');
        gap: dt('sidebar.menu.sub.button.gap');
        padding: dt('sidebar.menu.sub.button.padding');
        border-radius: dt('sidebar.menu.sub.button.border.radius');
        font-size: dt('sidebar.menu.sub.button.font.size');
        font-weight: dt('sidebar.menu.sub.button.font.weight');
        color: dt('sidebar.menu.sub.button.color');
        transition: background 150ms, color 150ms;
    }

    .p-sidebar-menu-sub-button>span:last-child {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .p-sidebar-menu-sub-button svg {
        color: dt('sidebar.menu.sub.button.icon.color');
        font-weight: dt('sidebar.menu.sub.button.icon.size');
        width: dt('sidebar.menu.sub.button.icon.size');
        height: dt('sidebar.menu.sub.button.icon.size');
        flex-shrink: 0;
    }

    .p-sidebar-menu-sub-button:hover {
        background: dt('sidebar.menu.sub.button.focus.background');
        color: dt('sidebar.menu.sub.button.focus.color');
    }

    .p-sidebar-menu-sub-button:hover svg {
        color: dt('sidebar.menu.sub.button.icon.focus.color');
    }

    .p-sidebar-menu-sub-button:focus-visible {
        outline: dt('sidebar.focus.ring.width') dt('sidebar.focus.ring.style') dt('sidebar.focus.ring.color');
        outline-offset: dt('sidebar.focus.ring.offset');
        box-shadow: dt('sidebar.focus.ring.shadow');
    }

    .p-sidebar-menu-sub-button:active {
        background: dt('sidebar.menu.sub.button.active.background');
        color: dt('sidebar.menu.sub.button.active.color');
    }

    .p-sidebar-menu-sub-button:disabled,
    .p-sidebar-menu-sub-button[aria-disabled="true"] {
        pointer-events: none;
        opacity: 0.5;
    }

    .p-sidebar-menu-sub-button[data-active="true"] {
        background: dt('sidebar.menu.sub.button.active.background');
        color: dt('sidebar.menu.sub.button.active.color');
    }

    .p-sidebar[data-collapsible="icon"] .p-sidebar-menu-sub-button {
        display: none;
    }

    .p-sidebar-rail {
        position: absolute;
        inset-block: 0;
        z-index: 20;
        display: none;
        border: none;
        background: none;
        padding: 0;
        cursor: pointer;
        width: 1px;
        transition: background 50ms cubic-bezier(.4, 0, .2, 1) 75ms;
    }

    @media (min-width: 640px) {
        .p-sidebar-rail {
            display: flex;
        }
    }

    .p-sidebar-rail::after {
        content: '';
        position: absolute;
        inset-block: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0.5rem;
    }

    .p-sidebar[data-side="left"] .p-sidebar-rail {
        right: 0;
        cursor: w-resize;
    }

    .p-sidebar[data-side="left"][data-state="collapsed"] .p-sidebar-rail {
        cursor: e-resize;
    }

    .p-sidebar[data-side="right"] .p-sidebar-rail {
        left: 0;
        cursor: e-resize;
    }

    .p-sidebar[data-side="right"][data-state="collapsed"] .p-sidebar-rail {
        cursor: w-resize;
    }

    .p-sidebar[data-collapsible="offcanvas"] {
        overflow: visible;
    }

    .p-sidebar[data-collapsible="offcanvas"] .p-sidebar-aside {
        overflow: visible;
    }

    .p-sidebar[data-collapsible="offcanvas"] .p-sidebar-content {
        overflow: visible;
    }

    .p-sidebar[data-collapsible="offcanvas"] .p-sidebar-rail {
        opacity: 0;
        background: dt('sidebar.layout.background');
        transition: opacity 50ms cubic-bezier(.4, 0, .2, 1) 75ms;
    }

    .p-sidebar[data-collapsible="offcanvas"] .p-sidebar-rail:hover {
        opacity: 1;
    }

    .p-sidebar[data-side="left"][data-collapsible="offcanvas"] .p-sidebar-rail {
        right: -1.5px;
    }

    .p-sidebar[data-side="left"][data-collapsible="offcanvas"] .p-sidebar-rail::after {
        left: 100%;
        transform: none;
    }

    .p-sidebar[data-side="right"][data-collapsible="offcanvas"] .p-sidebar-rail {
        left: -1.5px;
    }

    .p-sidebar[data-side="right"][data-collapsible="offcanvas"] .p-sidebar-rail::after {
        left: auto;
        right: 100%;
        transform: none;
    }

    .p-sidebar-main {
        position: relative;
        display: flex;
        width: 100%;
        flex: 1;
        flex-direction: column;
        background: dt('sidebar.main.background');
    }

    .p-sidebar[data-variant="floating"]~.p-sidebar-main {
        background: dt('sidebar.main.floating.background');
    }

    .p-sidebar[data-variant="inset"]~.p-sidebar-main,
    .p-sidebar-main:has(~ .p-sidebar[data-variant="inset"]) {
        background: dt('sidebar.main.inset.background');
        margin: dt('sidebar.main.margin');
        border-radius: dt('sidebar.main.border.radius');
        box-shadow: dt('sidebar.main.shadow');
    }
`;

// node_modules/primeng/fesm2022/primeng-sidebar.mjs
var _c0 = ["*"];
var SIDEBAR_INSTANCE = new InjectionToken("SIDEBAR_INSTANCE");
var SIDEBAR_LAYOUT_INSTANCE = new InjectionToken("SIDEBAR_LAYOUT_INSTANCE");
var SIDEBAR_ASIDE_INSTANCE = new InjectionToken("SIDEBAR_ASIDE_INSTANCE");
var SIDEBAR_CONTENT_INSTANCE = new InjectionToken("SIDEBAR_CONTENT_INSTANCE");
var SIDEBAR_HEADER_INSTANCE = new InjectionToken("SIDEBAR_HEADER_INSTANCE");
var SIDEBAR_PANEL_INSTANCE = new InjectionToken("SIDEBAR_PANEL_INSTANCE");
var SIDEBAR_FOOTER_INSTANCE = new InjectionToken("SIDEBAR_FOOTER_INSTANCE");
var SIDEBAR_GROUP_INSTANCE = new InjectionToken("SIDEBAR_GROUP_INSTANCE");
var SIDEBAR_MENU_INSTANCE = new InjectionToken("SIDEBAR_MENU_INSTANCE");
var SIDEBAR_MENU_ITEM_INSTANCE = new InjectionToken("SIDEBAR_MENU_ITEM_INSTANCE");
var SIDEBAR_MENU_SUB_INSTANCE = new InjectionToken("SIDEBAR_MENU_SUB_INSTANCE");
var SIDEBAR_MENU_SUB_ITEM_INSTANCE = new InjectionToken("SIDEBAR_MENU_SUB_ITEM_INSTANCE");
var style2 = (
  /*css*/
  `
${style}

/* For PrimeNG */
.p-sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 15;
    background-color: rgb(0 0 0 / 0.4);
}

/* NG uses extra DOM wrappers around .p-sidebar-menu-sub for the Angular animation system */
.p-sidebar-menu-sub-content-container {
    display: grid;
    grid-template-rows: 1fr;
}

.p-sidebar-menu-sub-content-wrapper {
    min-height: 0;
}

.p-sidebar[data-collapsible="icon"] .p-sidebar-menu-item[data-collapsible]>.p-sidebar-menu-sub-content-container {
    display: none;
}

.p-sidebar-menu-sub-enter-from,
.p-sidebar-menu-sub-leave-to {
    height: 0 !important;
    opacity: 0;
}

.p-sidebar-menu-sub-enter-to,
.p-sidebar-menu-sub-leave-from {
    height: var(--px-sidebar-menu-sub-height, auto);
    opacity: 1;
}

.p-sidebar-menu-sub-enter-active,
.p-sidebar-menu-sub-leave-active {
    transition: height 200ms ease-out, opacity 200ms ease-out;
    overflow: hidden;
}
`
);
var classes = {
  root: "p-sidebar p-component",
  layout: "p-sidebar-layout",
  spacer: "p-sidebar-spacer",
  aside: "p-sidebar-aside",
  panel: "p-sidebar-panel",
  header: "p-sidebar-header",
  content: "p-sidebar-content",
  footer: "p-sidebar-footer",
  group: "p-sidebar-group",
  groupLabel: "p-sidebar-group-label",
  groupAction: "p-sidebar-group-action",
  groupContent: "p-sidebar-group-content",
  menu: "p-sidebar-menu",
  menuItem: "p-sidebar-menu-item",
  menuButton: "p-sidebar-menu-button",
  menuAction: "p-sidebar-menu-action",
  menuBadge: "p-sidebar-menu-badge",
  menuSub: "p-sidebar-menu-sub",
  menuSubItem: "p-sidebar-menu-sub-item",
  menuSubButton: "p-sidebar-menu-sub-button",
  trigger: "p-sidebar-trigger",
  rail: "p-sidebar-rail",
  main: "p-sidebar-main",
  backdrop: "p-sidebar-backdrop"
};
var SidebarStyle = class _SidebarStyle extends BaseStyle {
  name = "sidebar";
  style = style2;
  classes = classes;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarStyle_BaseFactory;
    return function SidebarStyle_Factory(__ngFactoryType__) {
      return (ɵSidebarStyle_BaseFactory || (ɵSidebarStyle_BaseFactory = ɵɵgetInheritedFactory(_SidebarStyle)))(__ngFactoryType__ || _SidebarStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _SidebarStyle,
    factory: _SidebarStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarStyle, [{
    type: Injectable
  }], null, null);
})();
var SidebarClasses;
(function(SidebarClasses2) {
  SidebarClasses2["root"] = "p-sidebar";
  SidebarClasses2["layout"] = "p-sidebar-layout";
  SidebarClasses2["spacer"] = "p-sidebar-spacer";
  SidebarClasses2["aside"] = "p-sidebar-aside";
  SidebarClasses2["panel"] = "p-sidebar-panel";
  SidebarClasses2["header"] = "p-sidebar-header";
  SidebarClasses2["content"] = "p-sidebar-content";
  SidebarClasses2["footer"] = "p-sidebar-footer";
  SidebarClasses2["group"] = "p-sidebar-group";
  SidebarClasses2["groupLabel"] = "p-sidebar-group-label";
  SidebarClasses2["groupAction"] = "p-sidebar-group-action";
  SidebarClasses2["groupContent"] = "p-sidebar-group-content";
  SidebarClasses2["menu"] = "p-sidebar-menu";
  SidebarClasses2["menuItem"] = "p-sidebar-menu-item";
  SidebarClasses2["menuButton"] = "p-sidebar-menu-button";
  SidebarClasses2["menuAction"] = "p-sidebar-menu-action";
  SidebarClasses2["menuBadge"] = "p-sidebar-menu-badge";
  SidebarClasses2["menuSub"] = "p-sidebar-menu-sub";
  SidebarClasses2["menuSubItem"] = "p-sidebar-menu-sub-item";
  SidebarClasses2["menuSubButton"] = "p-sidebar-menu-sub-button";
  SidebarClasses2["trigger"] = "p-sidebar-trigger";
  SidebarClasses2["rail"] = "p-sidebar-rail";
  SidebarClasses2["main"] = "p-sidebar-main";
  SidebarClasses2["backdrop"] = "p-sidebar-backdrop";
})(SidebarClasses || (SidebarClasses = {}));
var SidebarBackdrop = class _SidebarBackdrop extends BaseComponent {
  componentName = "SidebarBackdrop";
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(SidebarStyle);
  pcSidebar = inject(SIDEBAR_INSTANCE, {
    optional: true
  });
  layout = inject(SIDEBAR_LAYOUT_INSTANCE, {
    optional: true
  });
  visible = computed(
    () => {
      if (this.pcSidebar) return this.pcSidebar.open();
      return !!this.layout?.isAnyOpen();
    },
    ...ngDevMode ? [{
      debugName: "visible"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  motion;
  isInitialMount = true;
  constructor() {
    super();
    effect(() => {
      const show = this.visible();
      if (!isPlatformBrowser(this.platformId)) return;
      const el = this.el?.nativeElement;
      if (!el) return;
      if (!this.motion) {
        this.motion = dt(el, {
          name: "p-overlay-mask",
          autoHeight: false,
          autoWidth: false
        });
      }
      if (show) {
        el.style.removeProperty("display");
        el.classList.add("p-overlay-mask");
        this.motion.enter();
      } else if (!this.isInitialMount) {
        this.motion.leave().then(() => {
          if (!this.visible() && this.el?.nativeElement) {
            this.el.nativeElement.style.display = "none";
            this.el.nativeElement.classList.remove("p-overlay-mask");
          }
        });
      } else {
        el.style.display = "none";
      }
      this.isInitialMount = false;
    });
  }
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  onClick(event) {
    if (this.pcSidebar) {
      if (this.pcSidebar.dismissable()) this.pcSidebar.collapse(event);
    } else {
      this.layout?.collapseAll(event);
    }
  }
  onDestroy() {
    this.motion?.cancel();
    this.motion = void 0;
  }
  static ɵfac = function SidebarBackdrop_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SidebarBackdrop)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _SidebarBackdrop,
    selectors: [["p-sidebar-backdrop"]],
    hostVars: 2,
    hostBindings: function SidebarBackdrop_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("click", function SidebarBackdrop_click_HostBindingHandler($event) {
          return ctx.onClick($event);
        });
      }
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("backdrop"));
      }
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarBackdrop
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    decls: 0,
    vars: 0,
    template: function SidebarBackdrop_Template(rf, ctx) {
    },
    dependencies: [BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarBackdrop, [{
    type: Component,
    args: [{
      selector: "p-sidebar-backdrop",
      standalone: true,
      imports: [BindModule],
      template: ``,
      host: {
        "[class]": "cx('backdrop')",
        "(click)": "onClick($event)"
      },
      hostDirectives: [Bind],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [SidebarStyle, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarBackdrop
      }]
    }]
  }], () => [], null);
})();
var SidebarContent = class _SidebarContent extends BaseComponent {
  componentName = "SidebarContent";
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(SidebarStyle);
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarContent_BaseFactory;
    return function SidebarContent_Factory(__ngFactoryType__) {
      return (ɵSidebarContent_BaseFactory || (ɵSidebarContent_BaseFactory = ɵɵgetInheritedFactory(_SidebarContent)))(__ngFactoryType__ || _SidebarContent);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _SidebarContent,
    selectors: [["p-sidebar-content"]],
    hostVars: 2,
    hostBindings: function SidebarContent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("content"));
      }
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: SIDEBAR_CONTENT_INSTANCE,
      useExisting: _SidebarContent
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarContent
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function SidebarContent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    dependencies: [BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarContent, [{
    type: Component,
    args: [{
      selector: "p-sidebar-content",
      standalone: true,
      imports: [BindModule],
      template: `<ng-content />`,
      host: {
        "[class]": "cx('content')"
      },
      hostDirectives: [Bind],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [SidebarStyle, {
        provide: SIDEBAR_CONTENT_INSTANCE,
        useExisting: SidebarContent
      }, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarContent
      }]
    }]
  }], null, null);
})();
var SidebarFooter = class _SidebarFooter extends BaseComponent {
  componentName = "SidebarFooter";
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(SidebarStyle);
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarFooter_BaseFactory;
    return function SidebarFooter_Factory(__ngFactoryType__) {
      return (ɵSidebarFooter_BaseFactory || (ɵSidebarFooter_BaseFactory = ɵɵgetInheritedFactory(_SidebarFooter)))(__ngFactoryType__ || _SidebarFooter);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _SidebarFooter,
    selectors: [["p-sidebar-footer"]],
    hostVars: 2,
    hostBindings: function SidebarFooter_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("footer"));
      }
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: SIDEBAR_FOOTER_INSTANCE,
      useExisting: _SidebarFooter
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarFooter
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function SidebarFooter_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    dependencies: [BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarFooter, [{
    type: Component,
    args: [{
      selector: "p-sidebar-footer",
      standalone: true,
      imports: [BindModule],
      template: `<ng-content />`,
      host: {
        "[class]": "cx('footer')"
      },
      hostDirectives: [Bind],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [SidebarStyle, {
        provide: SIDEBAR_FOOTER_INSTANCE,
        useExisting: SidebarFooter
      }, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarFooter
      }]
    }]
  }], null, null);
})();
var SidebarGroup = class _SidebarGroup extends BaseComponent {
  componentName = "SidebarGroup";
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(SidebarStyle);
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarGroup_BaseFactory;
    return function SidebarGroup_Factory(__ngFactoryType__) {
      return (ɵSidebarGroup_BaseFactory || (ɵSidebarGroup_BaseFactory = ɵɵgetInheritedFactory(_SidebarGroup)))(__ngFactoryType__ || _SidebarGroup);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _SidebarGroup,
    selectors: [["p-sidebar-group"]],
    hostVars: 2,
    hostBindings: function SidebarGroup_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("group"));
      }
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: SIDEBAR_GROUP_INSTANCE,
      useExisting: _SidebarGroup
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarGroup
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function SidebarGroup_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    dependencies: [BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarGroup, [{
    type: Component,
    args: [{
      selector: "p-sidebar-group",
      standalone: true,
      imports: [BindModule],
      template: `<ng-content />`,
      host: {
        "[class]": "cx('group')"
      },
      hostDirectives: [Bind],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [SidebarStyle, {
        provide: SIDEBAR_GROUP_INSTANCE,
        useExisting: SidebarGroup
      }, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarGroup
      }]
    }]
  }], null, null);
})();
var SidebarGroupAction = class _SidebarGroupAction extends BaseComponent {
  componentName = "SidebarGroupAction";
  bindDirectiveInstance = inject(Bind, {
    optional: true,
    self: true
  }) ?? void 0;
  _componentStyle = inject(SidebarStyle);
  onAfterViewChecked() {
    this.bindDirectiveInstance?.setAttrs(this.ptm("root"));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarGroupAction_BaseFactory;
    return function SidebarGroupAction_Factory(__ngFactoryType__) {
      return (ɵSidebarGroupAction_BaseFactory || (ɵSidebarGroupAction_BaseFactory = ɵɵgetInheritedFactory(_SidebarGroupAction)))(__ngFactoryType__ || _SidebarGroupAction);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _SidebarGroupAction,
    selectors: [["", "pSidebarGroupAction", ""]],
    hostVars: 2,
    hostBindings: function SidebarGroupAction_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("groupAction"));
      }
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarGroupAction
    }]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarGroupAction, [{
    type: Directive,
    args: [{
      selector: "[pSidebarGroupAction]",
      standalone: true,
      host: {
        "[class]": "cx('groupAction')"
      },
      providers: [SidebarStyle, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarGroupAction
      }]
    }]
  }], null, null);
})();
var SidebarGroupContent = class _SidebarGroupContent extends BaseComponent {
  componentName = "SidebarGroupContent";
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(SidebarStyle);
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarGroupContent_BaseFactory;
    return function SidebarGroupContent_Factory(__ngFactoryType__) {
      return (ɵSidebarGroupContent_BaseFactory || (ɵSidebarGroupContent_BaseFactory = ɵɵgetInheritedFactory(_SidebarGroupContent)))(__ngFactoryType__ || _SidebarGroupContent);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _SidebarGroupContent,
    selectors: [["p-sidebar-group-content"]],
    hostVars: 2,
    hostBindings: function SidebarGroupContent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("groupContent"));
      }
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarGroupContent
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function SidebarGroupContent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    dependencies: [BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarGroupContent, [{
    type: Component,
    args: [{
      selector: "p-sidebar-group-content",
      standalone: true,
      imports: [BindModule],
      template: `<ng-content />`,
      host: {
        "[class]": "cx('groupContent')"
      },
      hostDirectives: [Bind],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [SidebarStyle, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarGroupContent
      }]
    }]
  }], null, null);
})();
var SidebarGroupLabel = class _SidebarGroupLabel extends BaseComponent {
  componentName = "SidebarGroupLabel";
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(SidebarStyle);
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarGroupLabel_BaseFactory;
    return function SidebarGroupLabel_Factory(__ngFactoryType__) {
      return (ɵSidebarGroupLabel_BaseFactory || (ɵSidebarGroupLabel_BaseFactory = ɵɵgetInheritedFactory(_SidebarGroupLabel)))(__ngFactoryType__ || _SidebarGroupLabel);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _SidebarGroupLabel,
    selectors: [["p-sidebar-group-label"]],
    hostVars: 2,
    hostBindings: function SidebarGroupLabel_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("groupLabel"));
      }
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarGroupLabel
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function SidebarGroupLabel_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    dependencies: [BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarGroupLabel, [{
    type: Component,
    args: [{
      selector: "p-sidebar-group-label",
      standalone: true,
      imports: [BindModule],
      template: `<ng-content />`,
      host: {
        "[class]": "cx('groupLabel')"
      },
      hostDirectives: [Bind],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [SidebarStyle, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarGroupLabel
      }]
    }]
  }], null, null);
})();
var SidebarHeader = class _SidebarHeader extends BaseComponent {
  componentName = "SidebarHeader";
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(SidebarStyle);
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarHeader_BaseFactory;
    return function SidebarHeader_Factory(__ngFactoryType__) {
      return (ɵSidebarHeader_BaseFactory || (ɵSidebarHeader_BaseFactory = ɵɵgetInheritedFactory(_SidebarHeader)))(__ngFactoryType__ || _SidebarHeader);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _SidebarHeader,
    selectors: [["p-sidebar-header"]],
    hostVars: 2,
    hostBindings: function SidebarHeader_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("header"));
      }
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: SIDEBAR_HEADER_INSTANCE,
      useExisting: _SidebarHeader
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarHeader
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function SidebarHeader_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    dependencies: [BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarHeader, [{
    type: Component,
    args: [{
      selector: "p-sidebar-header",
      standalone: true,
      imports: [BindModule],
      template: `<ng-content />`,
      host: {
        "[class]": "cx('header')"
      },
      hostDirectives: [Bind],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [SidebarStyle, {
        provide: SIDEBAR_HEADER_INSTANCE,
        useExisting: SidebarHeader
      }, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarHeader
      }]
    }]
  }], null, null);
})();
var SidebarMain = class _SidebarMain extends BaseComponent {
  componentName = "SidebarMain";
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(SidebarStyle);
  layout = inject(SIDEBAR_LAYOUT_INSTANCE, {
    optional: true
  });
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  onClick(event) {
    this.layout?.onMainClick(event);
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarMain_BaseFactory;
    return function SidebarMain_Factory(__ngFactoryType__) {
      return (ɵSidebarMain_BaseFactory || (ɵSidebarMain_BaseFactory = ɵɵgetInheritedFactory(_SidebarMain)))(__ngFactoryType__ || _SidebarMain);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _SidebarMain,
    selectors: [["p-sidebar-main"]],
    hostVars: 2,
    hostBindings: function SidebarMain_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("click", function SidebarMain_click_HostBindingHandler($event) {
          return ctx.onClick($event);
        });
      }
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("main"));
      }
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarMain
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function SidebarMain_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    dependencies: [BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarMain, [{
    type: Component,
    args: [{
      selector: "p-sidebar-main",
      standalone: true,
      imports: [BindModule],
      template: `<ng-content />`,
      host: {
        "[class]": "cx('main')",
        "(click)": "onClick($event)"
      },
      hostDirectives: [Bind],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [SidebarStyle, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarMain
      }]
    }]
  }], null, null);
})();
var SidebarLayout = class _SidebarLayout extends BaseComponent {
  componentName = "SidebarLayout";
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(SidebarStyle);
  sidebars = /* @__PURE__ */ new Map();
  version = signal(
    0,
    ...ngDevMode ? [{
      debugName: "version"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  isAnyOpen = computed(
    () => {
      this.version();
      let open = false;
      this.sidebars.forEach((s2) => {
        if (s2.open()) open = true;
      });
      return open;
    },
    ...ngDevMode ? [{
      debugName: "isAnyOpen"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  registerSidebar(id, sidebar) {
    this.sidebars.set(id, sidebar);
    this.version.update((v) => v + 1);
  }
  unregisterSidebar(id) {
    this.sidebars.delete(id);
    this.version.update((v) => v + 1);
  }
  getSidebar(id) {
    return this.sidebars.get(id);
  }
  toggle(target, event) {
    if (target) {
      this.sidebars.get(target)?.toggle(event);
      return;
    }
    if (this.sidebars.size === 1) {
      this.sidebars.values().next().value?.toggle(event);
    }
  }
  collapseAll(event) {
    this.sidebars.forEach((s2) => s2.collapse(event));
  }
  onMainClick(event) {
    const target = event.target;
    if (target?.closest('[data-scope="sidebar"][data-part="trigger"]')) return;
    this.sidebars.forEach((s2) => {
      if (s2.open() && s2.overlay() && s2.hideOnOutsideClick()) s2.collapse(event);
    });
  }
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarLayout_BaseFactory;
    return function SidebarLayout_Factory(__ngFactoryType__) {
      return (ɵSidebarLayout_BaseFactory || (ɵSidebarLayout_BaseFactory = ɵɵgetInheritedFactory(_SidebarLayout)))(__ngFactoryType__ || _SidebarLayout);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _SidebarLayout,
    selectors: [["p-sidebar-layout"]],
    hostVars: 2,
    hostBindings: function SidebarLayout_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("layout"));
      }
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: SIDEBAR_LAYOUT_INSTANCE,
      useExisting: _SidebarLayout
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarLayout
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function SidebarLayout_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    dependencies: [BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarLayout, [{
    type: Component,
    args: [{
      selector: "p-sidebar-layout",
      standalone: true,
      imports: [BindModule],
      template: `<ng-content />`,
      host: {
        "[class]": "cx('layout')"
      },
      hostDirectives: [Bind],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [SidebarStyle, {
        provide: SIDEBAR_LAYOUT_INSTANCE,
        useExisting: SidebarLayout
      }, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarLayout
      }]
    }]
  }], null, null);
})();
var SidebarMenu = class _SidebarMenu extends BaseComponent {
  componentName = "SidebarMenu";
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(SidebarStyle);
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarMenu_BaseFactory;
    return function SidebarMenu_Factory(__ngFactoryType__) {
      return (ɵSidebarMenu_BaseFactory || (ɵSidebarMenu_BaseFactory = ɵɵgetInheritedFactory(_SidebarMenu)))(__ngFactoryType__ || _SidebarMenu);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _SidebarMenu,
    selectors: [["p-sidebar-menu"]],
    hostAttrs: ["role", "list"],
    hostVars: 2,
    hostBindings: function SidebarMenu_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("menu"));
      }
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: SIDEBAR_MENU_INSTANCE,
      useExisting: _SidebarMenu
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarMenu
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function SidebarMenu_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    dependencies: [BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarMenu, [{
    type: Component,
    args: [{
      selector: "p-sidebar-menu",
      standalone: true,
      imports: [BindModule],
      template: `<ng-content />`,
      host: {
        "[class]": "cx('menu')",
        role: "list"
      },
      hostDirectives: [Bind],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [SidebarStyle, {
        provide: SIDEBAR_MENU_INSTANCE,
        useExisting: SidebarMenu
      }, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarMenu
      }]
    }]
  }], null, null);
})();
var SidebarMenuAction = class _SidebarMenuAction extends BaseComponent {
  componentName = "SidebarMenuAction";
  bindDirectiveInstance = inject(Bind, {
    optional: true,
    self: true
  }) ?? void 0;
  _componentStyle = inject(SidebarStyle);
  /**
   * Hide the action until the parent menu item is hovered / focus-within.
   * @defaultValue false
   * @group Props
   */
  showOnHover = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "showOnHover"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  dataShowOnHover = computed(
    () => this.showOnHover() ? "" : null,
    ...ngDevMode ? [{
      debugName: "dataShowOnHover"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  onAfterViewChecked() {
    this.bindDirectiveInstance?.setAttrs(this.ptm("root"));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarMenuAction_BaseFactory;
    return function SidebarMenuAction_Factory(__ngFactoryType__) {
      return (ɵSidebarMenuAction_BaseFactory || (ɵSidebarMenuAction_BaseFactory = ɵɵgetInheritedFactory(_SidebarMenuAction)))(__ngFactoryType__ || _SidebarMenuAction);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _SidebarMenuAction,
    selectors: [["", "pSidebarMenuAction", ""]],
    hostVars: 3,
    hostBindings: function SidebarMenuAction_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("data-show-on-hover", ctx.dataShowOnHover());
        ɵɵclassMap(ctx.cx("menuAction"));
      }
    },
    inputs: {
      showOnHover: [1, "showOnHover"]
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarMenuAction
    }]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarMenuAction, [{
    type: Directive,
    args: [{
      selector: "[pSidebarMenuAction]",
      standalone: true,
      host: {
        "[class]": "cx('menuAction')",
        "[attr.data-show-on-hover]": "dataShowOnHover()"
      },
      providers: [SidebarStyle, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarMenuAction
      }]
    }]
  }], null, {
    showOnHover: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "showOnHover",
        required: false
      }]
    }]
  });
})();
var SidebarMenuBadge = class _SidebarMenuBadge extends BaseComponent {
  componentName = "SidebarMenuBadge";
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(SidebarStyle);
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarMenuBadge_BaseFactory;
    return function SidebarMenuBadge_Factory(__ngFactoryType__) {
      return (ɵSidebarMenuBadge_BaseFactory || (ɵSidebarMenuBadge_BaseFactory = ɵɵgetInheritedFactory(_SidebarMenuBadge)))(__ngFactoryType__ || _SidebarMenuBadge);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _SidebarMenuBadge,
    selectors: [["p-sidebar-menu-badge"]],
    hostVars: 2,
    hostBindings: function SidebarMenuBadge_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("menuBadge"));
      }
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarMenuBadge
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function SidebarMenuBadge_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    dependencies: [BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarMenuBadge, [{
    type: Component,
    args: [{
      selector: "p-sidebar-menu-badge",
      standalone: true,
      imports: [BindModule],
      template: `<ng-content />`,
      host: {
        "[class]": "cx('menuBadge')"
      },
      hostDirectives: [Bind],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [SidebarStyle, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarMenuBadge
      }]
    }]
  }], null, null);
})();
var SidebarMenuButton = class _SidebarMenuButton extends BaseComponent {
  componentName = "SidebarMenuButton";
  bindDirectiveInstance = inject(Bind, {
    optional: true,
    self: true
  }) ?? void 0;
  _componentStyle = inject(SidebarStyle);
  pcMenuItem = inject(SIDEBAR_MENU_ITEM_INSTANCE, {
    optional: true
  }) ?? void 0;
  /**
   * Whether this button represents the active menu entry.
   * @defaultValue false
   * @group Props
   */
  isActive = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "isActive"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  dataActive = computed(
    () => this.isActive() ? "true" : null,
    ...ngDevMode ? [{
      debugName: "dataActive"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  onAfterViewChecked() {
    this.bindDirectiveInstance?.setAttrs(this.ptm("root"));
  }
  onClick(event) {
    if (this.pcMenuItem?.collapsible()) {
      this.pcMenuItem.toggle();
    }
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarMenuButton_BaseFactory;
    return function SidebarMenuButton_Factory(__ngFactoryType__) {
      return (ɵSidebarMenuButton_BaseFactory || (ɵSidebarMenuButton_BaseFactory = ɵɵgetInheritedFactory(_SidebarMenuButton)))(__ngFactoryType__ || _SidebarMenuButton);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _SidebarMenuButton,
    selectors: [["", "pSidebarMenuButton", ""]],
    hostVars: 3,
    hostBindings: function SidebarMenuButton_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("click", function SidebarMenuButton_click_HostBindingHandler($event) {
          return ctx.onClick($event);
        });
      }
      if (rf & 2) {
        ɵɵattribute("data-active", ctx.dataActive());
        ɵɵclassMap(ctx.cx("menuButton"));
      }
    },
    inputs: {
      isActive: [1, "isActive"]
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarMenuButton
    }]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarMenuButton, [{
    type: Directive,
    args: [{
      selector: "[pSidebarMenuButton]",
      standalone: true,
      host: {
        "[class]": "cx('menuButton')",
        "[attr.data-active]": "dataActive()",
        "(click)": "onClick($event)"
      },
      providers: [SidebarStyle, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarMenuButton
      }]
    }]
  }], null, {
    isActive: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "isActive",
        required: false
      }]
    }]
  });
})();
var SidebarMenuItem = class _SidebarMenuItem extends BaseComponent {
  componentName = "SidebarMenuItem";
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(SidebarStyle);
  /**
   * When enabled, renders a collapsible item that toggles the nested SidebarMenuSub.
   * @defaultValue false
   * @group Props
   */
  collapsible = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "collapsible"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Two-way bound open state for the nested sub-menu (only when `collapsible`).
   * @defaultValue false
   * @group Props
   */
  open = model(
    false,
    ...ngDevMode ? [{
      debugName: "open"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Initial open state applied once on init (like React's defaultOpen). Does not continuously bind.
   * @defaultValue undefined
   * @group Props
   */
  defaultOpen = input(
    void 0,
    ...ngDevMode ? [{
      debugName: "defaultOpen"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Disables interaction within the item.
   * @defaultValue false
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
  isOpen = computed(
    () => this.collapsible() && this.open(),
    ...ngDevMode ? [{
      debugName: "isOpen"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  dataCollapsible = computed(
    () => this.collapsible() ? "" : null,
    ...ngDevMode ? [{
      debugName: "dataCollapsible"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  dataOpen = computed(
    () => this.collapsible() && this.open() ? "" : null,
    ...ngDevMode ? [{
      debugName: "dataOpen"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  dataDisabled = computed(
    () => this.disabled() ? "" : null,
    ...ngDevMode ? [{
      debugName: "dataDisabled"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    super();
    effect(() => {
      const def = this.defaultOpen();
      if (def !== void 0 && !this.defaultApplied) {
        this.defaultApplied = true;
        this.open.set(def);
      }
    });
  }
  defaultApplied = false;
  toggle() {
    if (this.collapsible() && !this.disabled()) {
      this.open.set(!this.open());
    }
  }
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  static ɵfac = function SidebarMenuItem_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SidebarMenuItem)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _SidebarMenuItem,
    selectors: [["p-sidebar-menu-item"]],
    hostAttrs: ["role", "listitem"],
    hostVars: 5,
    hostBindings: function SidebarMenuItem_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("data-collapsible", ctx.dataCollapsible())("data-open", ctx.dataOpen())("data-disabled", ctx.dataDisabled());
        ɵɵclassMap(ctx.cx("menuItem"));
      }
    },
    inputs: {
      collapsible: [1, "collapsible"],
      open: [1, "open"],
      defaultOpen: [1, "defaultOpen"],
      disabled: [1, "disabled"]
    },
    outputs: {
      open: "openChange"
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: SIDEBAR_MENU_ITEM_INSTANCE,
      useExisting: _SidebarMenuItem
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarMenuItem
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function SidebarMenuItem_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    dependencies: [BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarMenuItem, [{
    type: Component,
    args: [{
      selector: "p-sidebar-menu-item",
      standalone: true,
      imports: [BindModule],
      template: `<ng-content />`,
      host: {
        "[class]": "cx('menuItem')",
        role: "listitem",
        "[attr.data-collapsible]": "dataCollapsible()",
        "[attr.data-open]": "dataOpen()",
        "[attr.data-disabled]": "dataDisabled()"
      },
      hostDirectives: [Bind],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [SidebarStyle, {
        provide: SIDEBAR_MENU_ITEM_INSTANCE,
        useExisting: SidebarMenuItem
      }, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarMenuItem
      }]
    }]
  }], () => [], {
    collapsible: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "collapsible",
        required: false
      }]
    }],
    open: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "open",
        required: false
      }]
    }, {
      type: Output,
      args: ["openChange"]
    }],
    defaultOpen: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "defaultOpen",
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
    }]
  });
})();
var SidebarMenuSub = class _SidebarMenuSub extends BaseComponent {
  componentName = "SidebarMenuSub";
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(SidebarStyle);
  pcMenuItem = inject(SIDEBAR_MENU_ITEM_INSTANCE, {
    optional: true
  }) ?? void 0;
  motion;
  isInitialMount = true;
  constructor() {
    super();
    effect(() => {
      const collapsible = this.pcMenuItem?.collapsible() ?? false;
      const visible = collapsible ? this.pcMenuItem.open() : true;
      if (!isPlatformBrowser(this.platformId)) return;
      const el = this.el?.nativeElement;
      if (!el) return;
      if (!collapsible) {
        this.cancel();
        el.style.removeProperty("display");
        return;
      }
      if (!this.motion) {
        this.motion = dt(el, {
          name: "p-sidebar-menu-sub",
          cssVarPrefix: "px-sidebar-menu-sub",
          autoHeight: true,
          duration: 200
        });
      }
      if (this.isInitialMount) {
        if (!visible) el.style.display = "none";
        this.isInitialMount = false;
        return;
      }
      if (visible) {
        el.style.removeProperty("display");
        this.motion.enter();
      } else {
        this.motion.leave().then(() => {
          const stillClosed = this.pcMenuItem?.collapsible() && !this.pcMenuItem?.open();
          if (stillClosed && this.el?.nativeElement) {
            this.el.nativeElement.style.display = "none";
          }
        });
      }
    });
  }
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  onDestroy() {
    this.cancel();
  }
  cancel() {
    this.motion?.cancel();
    this.motion = void 0;
  }
  static ɵfac = function SidebarMenuSub_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SidebarMenuSub)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _SidebarMenuSub,
    selectors: [["p-sidebar-menu-sub"]],
    hostAttrs: ["role", "list"],
    hostVars: 2,
    hostBindings: function SidebarMenuSub_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("menuSub"));
      }
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: SIDEBAR_MENU_SUB_INSTANCE,
      useExisting: _SidebarMenuSub
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarMenuSub
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function SidebarMenuSub_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    dependencies: [BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarMenuSub, [{
    type: Component,
    args: [{
      selector: "p-sidebar-menu-sub",
      standalone: true,
      imports: [BindModule],
      template: `<ng-content />`,
      host: {
        "[class]": "cx('menuSub')",
        role: "list"
      },
      hostDirectives: [Bind],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [SidebarStyle, {
        provide: SIDEBAR_MENU_SUB_INSTANCE,
        useExisting: SidebarMenuSub
      }, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarMenuSub
      }]
    }]
  }], () => [], null);
})();
var SidebarMenuSubButton = class _SidebarMenuSubButton extends BaseComponent {
  componentName = "SidebarMenuSubButton";
  bindDirectiveInstance = inject(Bind, {
    optional: true,
    self: true
  }) ?? void 0;
  _componentStyle = inject(SidebarStyle);
  /**
   * Whether this button represents the active sub-menu entry.
   * @defaultValue false
   * @group Props
   */
  isActive = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "isActive"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    transform: booleanAttribute
  }));
  /**
   * Optional size variant.
   * @group Props
   */
  size = input(
    "md",
    ...ngDevMode ? [{
      debugName: "size"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  dataActive = computed(
    () => this.isActive() ? "true" : null,
    ...ngDevMode ? [{
      debugName: "dataActive"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  dataSize = computed(
    () => this.size() === "sm" ? "sm" : null,
    ...ngDevMode ? [{
      debugName: "dataSize"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  onAfterViewChecked() {
    this.bindDirectiveInstance?.setAttrs(this.ptm("root"));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarMenuSubButton_BaseFactory;
    return function SidebarMenuSubButton_Factory(__ngFactoryType__) {
      return (ɵSidebarMenuSubButton_BaseFactory || (ɵSidebarMenuSubButton_BaseFactory = ɵɵgetInheritedFactory(_SidebarMenuSubButton)))(__ngFactoryType__ || _SidebarMenuSubButton);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _SidebarMenuSubButton,
    selectors: [["", "pSidebarMenuSubButton", ""]],
    hostVars: 4,
    hostBindings: function SidebarMenuSubButton_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("data-active", ctx.dataActive())("data-size", ctx.dataSize());
        ɵɵclassMap(ctx.cx("menuSubButton"));
      }
    },
    inputs: {
      isActive: [1, "isActive"],
      size: [1, "size"]
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarMenuSubButton
    }]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarMenuSubButton, [{
    type: Directive,
    args: [{
      selector: "[pSidebarMenuSubButton]",
      standalone: true,
      host: {
        "[class]": "cx('menuSubButton')",
        "[attr.data-active]": "dataActive()",
        "[attr.data-size]": "dataSize()"
      },
      providers: [SidebarStyle, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarMenuSubButton
      }]
    }]
  }], null, {
    isActive: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "isActive",
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
    }]
  });
})();
var SidebarMenuSubItem = class _SidebarMenuSubItem extends BaseComponent {
  componentName = "SidebarMenuSubItem";
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(SidebarStyle);
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarMenuSubItem_BaseFactory;
    return function SidebarMenuSubItem_Factory(__ngFactoryType__) {
      return (ɵSidebarMenuSubItem_BaseFactory || (ɵSidebarMenuSubItem_BaseFactory = ɵɵgetInheritedFactory(_SidebarMenuSubItem)))(__ngFactoryType__ || _SidebarMenuSubItem);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _SidebarMenuSubItem,
    selectors: [["p-sidebar-menu-sub-item"]],
    hostAttrs: ["role", "listitem"],
    hostVars: 2,
    hostBindings: function SidebarMenuSubItem_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("menuSubItem"));
      }
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: SIDEBAR_MENU_SUB_ITEM_INSTANCE,
      useExisting: _SidebarMenuSubItem
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarMenuSubItem
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function SidebarMenuSubItem_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    dependencies: [BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarMenuSubItem, [{
    type: Component,
    args: [{
      selector: "p-sidebar-menu-sub-item",
      standalone: true,
      imports: [BindModule],
      template: `<ng-content />`,
      host: {
        "[class]": "cx('menuSubItem')",
        role: "listitem"
      },
      hostDirectives: [Bind],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [SidebarStyle, {
        provide: SIDEBAR_MENU_SUB_ITEM_INSTANCE,
        useExisting: SidebarMenuSubItem
      }, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarMenuSubItem
      }]
    }]
  }], null, null);
})();
var SidebarAside = class _SidebarAside extends BaseComponent {
  componentName = "SidebarAside";
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(SidebarStyle);
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarAside_BaseFactory;
    return function SidebarAside_Factory(__ngFactoryType__) {
      return (ɵSidebarAside_BaseFactory || (ɵSidebarAside_BaseFactory = ɵɵgetInheritedFactory(_SidebarAside)))(__ngFactoryType__ || _SidebarAside);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _SidebarAside,
    selectors: [["p-sidebar-aside"]],
    hostVars: 2,
    hostBindings: function SidebarAside_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("aside"));
      }
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: SIDEBAR_ASIDE_INSTANCE,
      useExisting: _SidebarAside
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarAside
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function SidebarAside_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    dependencies: [BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarAside, [{
    type: Component,
    args: [{
      selector: "p-sidebar-aside",
      standalone: true,
      imports: [BindModule],
      template: `<ng-content />`,
      host: {
        "[class]": "cx('aside')"
      },
      hostDirectives: [Bind],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [SidebarStyle, {
        provide: SIDEBAR_ASIDE_INSTANCE,
        useExisting: SidebarAside
      }, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarAside
      }]
    }]
  }], null, null);
})();
var SidebarPanel = class _SidebarPanel extends BaseComponent {
  componentName = "SidebarPanel";
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(SidebarStyle);
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarPanel_BaseFactory;
    return function SidebarPanel_Factory(__ngFactoryType__) {
      return (ɵSidebarPanel_BaseFactory || (ɵSidebarPanel_BaseFactory = ɵɵgetInheritedFactory(_SidebarPanel)))(__ngFactoryType__ || _SidebarPanel);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _SidebarPanel,
    selectors: [["p-sidebar-panel"]],
    hostVars: 2,
    hostBindings: function SidebarPanel_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("panel"));
      }
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: SIDEBAR_PANEL_INSTANCE,
      useExisting: _SidebarPanel
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarPanel
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function SidebarPanel_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    dependencies: [BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarPanel, [{
    type: Component,
    args: [{
      selector: "p-sidebar-panel",
      standalone: true,
      imports: [BindModule],
      template: `<ng-content />`,
      host: {
        "[class]": "cx('panel')"
      },
      hostDirectives: [Bind],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [SidebarStyle, {
        provide: SIDEBAR_PANEL_INSTANCE,
        useExisting: SidebarPanel
      }, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarPanel
      }]
    }]
  }], null, null);
})();
var SidebarRail = class _SidebarRail extends BaseComponent {
  componentName = "SidebarRail";
  bindDirectiveInstance = inject(Bind, {
    optional: true,
    self: true
  }) ?? void 0;
  _componentStyle = inject(SidebarStyle);
  pcSidebar = inject(SIDEBAR_INSTANCE, {
    optional: true
  }) ?? void 0;
  onAfterViewChecked() {
    this.bindDirectiveInstance?.setAttrs(this.ptm("root"));
  }
  onClick(event) {
    this.pcSidebar?.toggle(event);
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarRail_BaseFactory;
    return function SidebarRail_Factory(__ngFactoryType__) {
      return (ɵSidebarRail_BaseFactory || (ɵSidebarRail_BaseFactory = ɵɵgetInheritedFactory(_SidebarRail)))(__ngFactoryType__ || _SidebarRail);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _SidebarRail,
    selectors: [["", "pSidebarRail", ""]],
    hostAttrs: ["aria-label", "Toggle Sidebar", "title", "Toggle Sidebar", "tabindex", "-1", "type", "button"],
    hostVars: 2,
    hostBindings: function SidebarRail_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("click", function SidebarRail_click_HostBindingHandler($event) {
          return ctx.onClick($event);
        });
      }
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("rail"));
      }
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarRail
    }]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarRail, [{
    type: Directive,
    args: [{
      selector: "[pSidebarRail]",
      standalone: true,
      host: {
        "[class]": "cx('rail')",
        "aria-label": "Toggle Sidebar",
        title: "Toggle Sidebar",
        tabindex: "-1",
        type: "button",
        "(click)": "onClick($event)"
      },
      providers: [SidebarStyle, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarRail
      }]
    }]
  }], null, null);
})();
var SidebarSpacer = class _SidebarSpacer extends BaseComponent {
  componentName = "SidebarSpacer";
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(SidebarStyle);
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarSpacer_BaseFactory;
    return function SidebarSpacer_Factory(__ngFactoryType__) {
      return (ɵSidebarSpacer_BaseFactory || (ɵSidebarSpacer_BaseFactory = ɵɵgetInheritedFactory(_SidebarSpacer)))(__ngFactoryType__ || _SidebarSpacer);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _SidebarSpacer,
    selectors: [["p-sidebar-spacer"]],
    hostVars: 2,
    hostBindings: function SidebarSpacer_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("spacer"));
      }
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarSpacer
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    decls: 0,
    vars: 0,
    template: function SidebarSpacer_Template(rf, ctx) {
    },
    dependencies: [BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarSpacer, [{
    type: Component,
    args: [{
      selector: "p-sidebar-spacer",
      standalone: true,
      imports: [BindModule],
      template: ``,
      host: {
        "[class]": "cx('spacer')"
      },
      hostDirectives: [Bind],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [SidebarStyle, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarSpacer
      }]
    }]
  }], null, null);
})();
var SidebarTrigger = class _SidebarTrigger extends BaseComponent {
  componentName = "SidebarTrigger";
  bindDirectiveInstance = inject(Bind, {
    optional: true,
    self: true
  }) ?? void 0;
  _componentStyle = inject(SidebarStyle);
  layout = inject(SIDEBAR_LAYOUT_INSTANCE, {
    optional: true
  });
  ancestorSidebar = inject(SIDEBAR_INSTANCE, {
    optional: true
  });
  /**
   * Id of the target Sidebar within the parent Layout.
   * @group Props
   */
  target = input(
    ...ngDevMode ? [void 0, {
      debugName: "target"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  onAfterViewChecked() {
    this.bindDirectiveInstance?.setAttrs(this.ptm("root"));
  }
  resolveTarget() {
    const id = this.target();
    if (id) return this.layout?.getSidebar(id);
    return this.ancestorSidebar;
  }
  onClick(event) {
    this.resolveTarget()?.toggle(event);
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSidebarTrigger_BaseFactory;
    return function SidebarTrigger_Factory(__ngFactoryType__) {
      return (ɵSidebarTrigger_BaseFactory || (ɵSidebarTrigger_BaseFactory = ɵɵgetInheritedFactory(_SidebarTrigger)))(__ngFactoryType__ || _SidebarTrigger);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _SidebarTrigger,
    selectors: [["", "pSidebarTrigger", ""]],
    hostAttrs: ["data-scope", "sidebar", "data-part", "trigger"],
    hostVars: 4,
    hostBindings: function SidebarTrigger_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("click", function SidebarTrigger_click_HostBindingHandler($event) {
          return ctx.onClick($event);
        });
      }
      if (rf & 2) {
        ɵɵattribute("aria-controls", ctx.resolveTarget()?.id())("aria-expanded", ctx.resolveTarget()?.open());
        ɵɵclassMap(ctx.cx("trigger"));
      }
    },
    inputs: {
      target: [1, "target"]
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: PARENT_INSTANCE,
      useExisting: _SidebarTrigger
    }]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarTrigger, [{
    type: Directive,
    args: [{
      selector: "[pSidebarTrigger]",
      standalone: true,
      host: {
        "[class]": "cx('trigger')",
        "data-scope": "sidebar",
        "data-part": "trigger",
        "[attr.aria-controls]": "resolveTarget()?.id()",
        "[attr.aria-expanded]": "resolveTarget()?.open()",
        "(click)": "onClick($event)"
      },
      providers: [SidebarStyle, {
        provide: PARENT_INSTANCE,
        useExisting: SidebarTrigger
      }]
    }]
  }], null, {
    target: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "target",
        required: false
      }]
    }]
  });
})();
var Sidebar = class _Sidebar extends BaseComponent {
  componentName = "Sidebar";
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  layout = inject(SIDEBAR_LAYOUT_INSTANCE, {
    optional: true
  });
  /**
   * Two-way bound open state.
   * @defaultValue true
   * @group Props
   */
  open = model(
    true,
    ...ngDevMode ? [{
      debugName: "open"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Side the sidebar attaches to.
   * @defaultValue 'left'
   * @group Props
   */
  side = input(
    "left",
    ...ngDevMode ? [{
      debugName: "side"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Visual variant.
   * @defaultValue 'sidebar'
   * @group Props
   */
  variant = input(
    "sidebar",
    ...ngDevMode ? [{
      debugName: "variant"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Collapse mode.
   * @defaultValue 'icon'
   * @group Props
   */
  collapsible = input(
    "icon",
    ...ngDevMode ? [{
      debugName: "collapsible"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * When enabled, the sidebar overlays the inset instead of pushing it.
   * @defaultValue false
   * @group Props
   */
  overlay = input(
    false,
    ...ngDevMode ? [{
      debugName: "overlay"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Clicking the backdrop closes the sidebar when overlay is active.
   * @defaultValue true
   * @group Props
   */
  dismissable = input(
    true,
    ...ngDevMode ? [{
      debugName: "dismissable"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * When overlay is active, clicking inside the SidebarMain area collapses the sidebar. Clicks originating from a [pSidebarTrigger] are excluded so opening via the trigger is not immediately undone.
   * @defaultValue true
   * @group Props
   */
  hideOnOutsideClick = input(
    true,
    ...ngDevMode ? [{
      debugName: "hideOnOutsideClick"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Expanded width (CSS length).
   * @defaultValue '16rem'
   * @group Props
   */
  width = input(
    "16rem",
    ...ngDevMode ? [{
      debugName: "width"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Icon-mode width (CSS length).
   * @defaultValue '3rem'
   * @group Props
   */
  iconWidth = input(
    "3rem",
    ...ngDevMode ? [{
      debugName: "iconWidth"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Open/close the sidebar on pointer enter/leave of the root.
   * @defaultValue false
   * @group Props
   */
  openOnHover = input(
    false,
    ...ngDevMode ? [{
      debugName: "openOnHover"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Delay in ms before opening on hover.
   * @defaultValue 50
   * @group Props
   */
  hoverOpenDelay = input(
    50,
    ...ngDevMode ? [{
      debugName: "hoverOpenDelay"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Delay in ms before closing on hover leave.
   * @defaultValue 100
   * @group Props
   */
  hoverCloseDelay = input(
    100,
    ...ngDevMode ? [{
      debugName: "hoverCloseDelay"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  /**
   * Unique id used by [pSidebarTrigger] target lookup.
   * @group Props
   */
  id = input(
    s("p-sidebar-"),
    ...ngDevMode ? [{
      debugName: "id"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  displayState = computed(
    () => this.open() ? "expanded" : "collapsed",
    ...ngDevMode ? [{
      debugName: "displayState"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  dataCollapsible = computed(
    () => this.displayState() === "collapsed" ? this.collapsible() : null,
    ...ngDevMode ? [{
      debugName: "dataCollapsible"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  dataOverlay = computed(
    () => this.overlay() ? "" : null,
    ...ngDevMode ? [{
      debugName: "dataOverlay"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  _componentStyle = inject(SidebarStyle);
  hoverTimer = null;
  constructor() {
    super();
    effect((onCleanup) => {
      const id = this.id();
      this.layout?.registerSidebar(id, this);
      onCleanup(() => this.layout?.unregisterSidebar(id));
    });
  }
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("root"));
  }
  toggle(event) {
    if (this.collapsible() === "none") return;
    this.open.set(!this.open());
  }
  expand(event) {
    this.open.set(true);
  }
  collapse(event) {
    if (this.collapsible() === "none") return;
    this.open.set(false);
  }
  onPointerEnter(event) {
    if (!this.openOnHover()) return;
    this.clearHoverTimer();
    this.hoverTimer = setTimeout(() => this.expand(event), this.hoverOpenDelay());
  }
  onPointerLeave(event) {
    if (!this.openOnHover()) return;
    this.clearHoverTimer();
    this.hoverTimer = setTimeout(() => this.collapse(event), this.hoverCloseDelay());
  }
  clearHoverTimer() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }
  onDestroy() {
    this.clearHoverTimer();
  }
  onEscape() {
    if (this.overlay() && this.dismissable() && this.open()) {
      this.collapse();
    }
  }
  static ɵfac = function Sidebar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Sidebar)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _Sidebar,
    selectors: [["p-sidebar"]],
    hostVars: 12,
    hostBindings: function Sidebar_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("pointerenter", function Sidebar_pointerenter_HostBindingHandler($event) {
          return ctx.onPointerEnter($event);
        })("pointerleave", function Sidebar_pointerleave_HostBindingHandler($event) {
          return ctx.onPointerLeave($event);
        })("keydown.escape", function Sidebar_keydown_escape_HostBindingHandler() {
          return ctx.onEscape();
        });
      }
      if (rf & 2) {
        ɵɵattribute("data-side", ctx.side())("data-variant", ctx.variant())("data-collapsible", ctx.dataCollapsible())("data-collapsible-mode", ctx.collapsible())("data-overlay", ctx.dataOverlay())("data-state", ctx.displayState());
        ɵɵclassMap(ctx.cx("root"));
        ɵɵstyleProp("--px-sidebar-width", ctx.width())("--px-sidebar-width-icon", ctx.iconWidth());
      }
    },
    inputs: {
      open: [1, "open"],
      side: [1, "side"],
      variant: [1, "variant"],
      collapsible: [1, "collapsible"],
      overlay: [1, "overlay"],
      dismissable: [1, "dismissable"],
      hideOnOutsideClick: [1, "hideOnOutsideClick"],
      width: [1, "width"],
      iconWidth: [1, "iconWidth"],
      openOnHover: [1, "openOnHover"],
      hoverOpenDelay: [1, "hoverOpenDelay"],
      hoverCloseDelay: [1, "hoverCloseDelay"],
      id: [1, "id"]
    },
    outputs: {
      open: "openChange"
    },
    features: [ɵɵProvidersFeature([SidebarStyle, {
      provide: SIDEBAR_INSTANCE,
      useExisting: _Sidebar
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _Sidebar
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function Sidebar_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    dependencies: [BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Sidebar, [{
    type: Component,
    args: [{
      selector: "p-sidebar",
      standalone: true,
      imports: [BindModule],
      template: `<ng-content />`,
      host: {
        "[class]": "cx('root')",
        "[attr.data-side]": "side()",
        "[attr.data-variant]": "variant()",
        "[attr.data-collapsible]": "dataCollapsible()",
        "[attr.data-collapsible-mode]": "collapsible()",
        "[attr.data-overlay]": "dataOverlay()",
        "[attr.data-state]": "displayState()",
        "[style.--px-sidebar-width]": "width()",
        "[style.--px-sidebar-width-icon]": "iconWidth()",
        "(pointerenter)": "onPointerEnter($event)",
        "(pointerleave)": "onPointerLeave($event)"
      },
      hostDirectives: [Bind],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [SidebarStyle, {
        provide: SIDEBAR_INSTANCE,
        useExisting: Sidebar
      }, {
        provide: PARENT_INSTANCE,
        useExisting: Sidebar
      }]
    }]
  }], () => [], {
    open: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "open",
        required: false
      }]
    }, {
      type: Output,
      args: ["openChange"]
    }],
    side: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "side",
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
    collapsible: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "collapsible",
        required: false
      }]
    }],
    overlay: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "overlay",
        required: false
      }]
    }],
    dismissable: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "dismissable",
        required: false
      }]
    }],
    hideOnOutsideClick: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "hideOnOutsideClick",
        required: false
      }]
    }],
    width: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "width",
        required: false
      }]
    }],
    iconWidth: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "iconWidth",
        required: false
      }]
    }],
    openOnHover: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "openOnHover",
        required: false
      }]
    }],
    hoverOpenDelay: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "hoverOpenDelay",
        required: false
      }]
    }],
    hoverCloseDelay: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "hoverCloseDelay",
        required: false
      }]
    }],
    id: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "id",
        required: false
      }]
    }],
    onEscape: [{
      type: HostListener,
      args: ["keydown.escape"]
    }]
  });
})();
var SIDEBAR_PARTS = [Sidebar, SidebarLayout, SidebarSpacer, SidebarAside, SidebarPanel, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarGroupAction, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuAction, SidebarMenuBadge, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarTrigger, SidebarRail, SidebarBackdrop, SidebarMain];
var SidebarModule = class _SidebarModule {
  static ɵfac = function SidebarModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SidebarModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _SidebarModule,
    imports: [Sidebar, SidebarLayout, SidebarSpacer, SidebarAside, SidebarPanel, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarGroupAction, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuAction, SidebarMenuBadge, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarTrigger, SidebarRail, SidebarBackdrop, SidebarMain],
    exports: [Sidebar, SidebarLayout, SidebarSpacer, SidebarAside, SidebarPanel, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarGroupAction, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuAction, SidebarMenuBadge, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarTrigger, SidebarRail, SidebarBackdrop, SidebarMain]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [Sidebar, SidebarLayout, SidebarSpacer, SidebarAside, SidebarPanel, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuBadge, SidebarMenuSub, SidebarMenuSubItem, SidebarBackdrop, SidebarMain]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarModule, [{
    type: NgModule,
    args: [{
      imports: [...SIDEBAR_PARTS],
      exports: [...SIDEBAR_PARTS]
    }]
  }], null, null);
})();
export {
  SIDEBAR_ASIDE_INSTANCE,
  SIDEBAR_CONTENT_INSTANCE,
  SIDEBAR_FOOTER_INSTANCE,
  SIDEBAR_GROUP_INSTANCE,
  SIDEBAR_HEADER_INSTANCE,
  SIDEBAR_INSTANCE,
  SIDEBAR_LAYOUT_INSTANCE,
  SIDEBAR_MENU_INSTANCE,
  SIDEBAR_MENU_ITEM_INSTANCE,
  SIDEBAR_MENU_SUB_INSTANCE,
  SIDEBAR_MENU_SUB_ITEM_INSTANCE,
  SIDEBAR_PANEL_INSTANCE,
  Sidebar,
  SidebarAside,
  SidebarBackdrop,
  SidebarClasses,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarLayout,
  SidebarMain,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarModule,
  SidebarPanel,
  SidebarRail,
  SidebarSpacer,
  SidebarStyle,
  SidebarTrigger
};
//# sourceMappingURL=primeng_sidebar.js.map
