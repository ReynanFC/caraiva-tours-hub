import {
  CoreIcon,
  ICON_TEMPLATE
} from "./chunk-Y5JDOCLT.js";
import "./chunk-EZXZ43RR.js";
import {
  Component,
  Input,
  input,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵnextContext,
  ɵɵrepeater,
  ɵɵrepeaterCreate
} from "./chunk-N3JMXNJE.js";
import {
  effect,
  ɵɵnamespaceSVG
} from "./chunk-QAPLPPA7.js";
import "./chunk-RSS3ODKE.js";
import "./chunk-GOMI4DH3.js";

// node_modules/@primeicons/core/dist/esm/loaders.mjs
var e = { "address-book": () => import("./address-book-XJWCNLDH.js").then((t) => t.addressBook), "align-center": () => import("./align-center-5P5HDDFM.js").then((t) => t.alignCenter), "align-justify": () => import("./align-justify-ZCFOA5SN.js").then((t) => t.alignJustify), "align-left": () => import("./align-left-6B5CG36F.js").then((t) => t.alignLeft), "align-right": () => import("./align-right-PLJEFXE2.js").then((t) => t.alignRight), amazon: () => import("./amazon-ZKKDVWVN.js").then((t) => t.amazon), android: () => import("./android-EUWJWKHP.js").then((t) => t.android), "angle-double-down": () => import("./angle-double-down-U52UO5CW.js").then((t) => t.angleDoubleDown), "angle-double-left": () => import("./angle-double-left-LJISEMHP.js").then((t) => t.angleDoubleLeft), "angle-double-right": () => import("./angle-double-right-ALDRKELD.js").then((t) => t.angleDoubleRight), "angle-double-up": () => import("./angle-double-up-TDKZ6CUJ.js").then((t) => t.angleDoubleUp), "angle-down": () => import("./angle-down-P545FD4I.js").then((t) => t.angleDown), "angle-left": () => import("./angle-left-NOR7AHOS.js").then((t) => t.angleLeft), "angle-right": () => import("./angle-right-F3EHPH5U.js").then((t) => t.angleRight), "angle-up": () => import("./angle-up-QNNGMTDW.js").then((t) => t.angleUp), apple: () => import("./apple-EFQEDEMZ.js").then((t) => t.apple), "arrow-circle-down": () => import("./arrow-circle-down-TTINKKOP.js").then((t) => t.arrowCircleDown), "arrow-circle-left": () => import("./arrow-circle-left-U4IBFXYE.js").then((t) => t.arrowCircleLeft), "arrow-circle-right": () => import("./arrow-circle-right-QIU3TBYO.js").then((t) => t.arrowCircleRight), "arrow-circle-up": () => import("./arrow-circle-up-J4PUUO52.js").then((t) => t.arrowCircleUp), "arrow-down-left-and-arrow-up-right-to-center": () => import("./arrow-down-left-and-arrow-up-right-to-center-2MPFR5QN.js").then((t) => t.arrowDownLeftAndArrowUpRightToCenter), "arrow-down-left": () => import("./arrow-down-left-VFYHPPAH.js").then((t) => t.arrowDownLeft), "arrow-down-right": () => import("./arrow-down-right-EGXZ3273.js").then((t) => t.arrowDownRight), "arrow-down": () => import("./arrow-down-XJSSUXJZ.js").then((t) => t.arrowDown), "arrow-left": () => import("./arrow-left-GCHO2Z7Z.js").then((t) => t.arrowLeft), "arrow-right-arrow-left": () => import("./arrow-right-arrow-left-BRSHP4TW.js").then((t) => t.arrowRightArrowLeft), "arrow-right": () => import("./arrow-right-3XQBXO2U.js").then((t) => t.arrowRight), "arrow-u-turn-up-left": () => import("./arrow-u-turn-up-left-D7X5YKY7.js").then((t) => t.arrowUTurnUpLeft), "arrow-u-turn-up-right": () => import("./arrow-u-turn-up-right-P3JJB7PB.js").then((t) => t.arrowUTurnUpRight), "arrow-up-left": () => import("./arrow-up-left-KH3DC2S5.js").then((t) => t.arrowUpLeft), "arrow-up-right-and-arrow-down-left-from-center": () => import("./arrow-up-right-and-arrow-down-left-from-center-WBAOH66N.js").then((t) => t.arrowUpRightAndArrowDownLeftFromCenter), "arrow-up-right": () => import("./arrow-up-right-AH7WUCJX.js").then((t) => t.arrowUpRight), "arrow-up": () => import("./arrow-up-PFVZQIDA.js").then((t) => t.arrowUp), "arrows-alt": () => import("./arrows-alt-LQPMBX2F.js").then((t) => t.arrowsAlt), "arrows-h": () => import("./arrows-h-V7CSI3KK.js").then((t) => t.arrowsH), "arrows-v": () => import("./arrows-v-WBPBMZ57.js").then((t) => t.arrowsV), asterisk: () => import("./asterisk-VNDDGIKZ.js").then((t) => t.asterisk), at: () => import("./at-QWZ2OLWW.js").then((t) => t.at), backward: () => import("./backward-J5GBWCFB.js").then((t) => t.backward), ban: () => import("./ban-U7UAMCT6.js").then((t) => t.ban), barcode: () => import("./barcode-67FKC6KO.js").then((t) => t.barcode), bars: () => import("./bars-7M5EUMQ3.js").then((t) => t.bars), "bell-slash": () => import("./bell-slash-6BQHCOP2.js").then((t) => t.bellSlash), bell: () => import("./bell-SYORLERH.js").then((t) => t.bell), bitcoin: () => import("./bitcoin-YVQHDT5N.js").then((t) => t.bitcoin), blank: () => import("./blank-FVJWRX2K.js").then((t) => t.blank), "block-quote": () => import("./block-quote-OBOBXJI7.js").then((t) => t.blockQuote), bold: () => import("./bold-32AQJ5WL.js").then((t) => t.bold), bolt: () => import("./bolt-UKJ42CYU.js").then((t) => t.bolt), book: () => import("./book-TJXGRDWN.js").then((t) => t.book), "bookmark-fill": () => import("./bookmark-fill-YVL2FR2Z.js").then((t) => t.bookmarkFill), bookmark: () => import("./bookmark-DBOFCZYD.js").then((t) => t.bookmark), box: () => import("./box-3IMAX2Q6.js").then((t) => t.box), briefcase: () => import("./briefcase-LW5ZI3ZS.js").then((t) => t.briefcase), "building-columns": () => import("./building-columns-NVZCHOW5.js").then((t) => t.buildingColumns), building: () => import("./building-ECAEQ3HD.js").then((t) => t.building), bullseye: () => import("./bullseye-YU4XYFQQ.js").then((t) => t.bullseye), calculator: () => import("./calculator-WAXY7ASF.js").then((t) => t.calculator), "calendar-clock": () => import("./calendar-clock-GWFXGCPD.js").then((t) => t.calendarClock), "calendar-minus": () => import("./calendar-minus-EV27NGOF.js").then((t) => t.calendarMinus), "calendar-plus": () => import("./calendar-plus-NVP3HZAN.js").then((t) => t.calendarPlus), "calendar-times": () => import("./calendar-times-HHBXBF4D.js").then((t) => t.calendarTimes), calendar: () => import("./calendar-QXBMVL62.js").then((t) => t.calendar), camera: () => import("./camera-TCFAEE3R.js").then((t) => t.camera), car: () => import("./car-BGJW7ZSZ.js").then((t) => t.car), "caret-down": () => import("./caret-down-OO2M5B7S.js").then((t) => t.caretDown), "caret-left": () => import("./caret-left-QUXMV2GD.js").then((t) => t.caretLeft), "caret-right": () => import("./caret-right-ZXDWTNNP.js").then((t) => t.caretRight), "caret-up": () => import("./caret-up-NJ4MR3J7.js").then((t) => t.caretUp), "cart-arrow-down": () => import("./cart-arrow-down-NGUPEJBD.js").then((t) => t.cartArrowDown), "cart-minus": () => import("./cart-minus-EMKQP3XC.js").then((t) => t.cartMinus), "cart-plus": () => import("./cart-plus-TQDALCQ3.js").then((t) => t.cartPlus), "case-sensitive": () => import("./case-sensitive-QWZX2XLO.js").then((t) => t.caseSensitive), "chart-bar": () => import("./chart-bar-IFFSHI5X.js").then((t) => t.chartBar), "chart-line": () => import("./chart-line-54TPDCH6.js").then((t) => t.chartLine), "chart-pie": () => import("./chart-pie-SL7XHRU5.js").then((t) => t.chartPie), "chart-scatter": () => import("./chart-scatter-IGVA3OM7.js").then((t) => t.chartScatter), "check-circle": () => import("./check-circle-OK4WMHKB.js").then((t) => t.checkCircle), "check-square": () => import("./check-square-Q4PRW2RC.js").then((t) => t.checkSquare), check: () => import("./check-MWGEGXRB.js").then((t) => t.check), "chevron-circle-down": () => import("./chevron-circle-down-LIPWSZFW.js").then((t) => t.chevronCircleDown), "chevron-circle-left": () => import("./chevron-circle-left-V7X7EZM3.js").then((t) => t.chevronCircleLeft), "chevron-circle-right": () => import("./chevron-circle-right-34SUKYMG.js").then((t) => t.chevronCircleRight), "chevron-circle-up": () => import("./chevron-circle-up-ALJIDOOZ.js").then((t) => t.chevronCircleUp), "chevron-down": () => import("./chevron-down-P4LNHZGR.js").then((t) => t.chevronDown), "chevron-left": () => import("./chevron-left-V46GDYIZ.js").then((t) => t.chevronLeft), "chevron-right": () => import("./chevron-right-KLFHAM5F.js").then((t) => t.chevronRight), "chevron-up": () => import("./chevron-up-TMZAZ4PT.js").then((t) => t.chevronUp), "circle-fill": () => import("./circle-fill-6PUQNVFA.js").then((t) => t.circleFill), circle: () => import("./circle-V6VNSOI6.js").then((t) => t.circle), clipboard: () => import("./clipboard-R73OUXHX.js").then((t) => t.clipboard), clock: () => import("./clock-LXWQVM3O.js").then((t) => t.clock), clone: () => import("./clone-K7KIXZZU.js").then((t) => t.clone), "cloud-download": () => import("./cloud-download-DFZYZBMV.js").then((t) => t.cloudDownload), "cloud-upload": () => import("./cloud-upload-OYQV3HAK.js").then((t) => t.cloudUpload), cloud: () => import("./cloud-XDTVQ6TL.js").then((t) => t.cloud), "code-branch": () => import("./code-branch-LSGGZEZV.js").then((t) => t.codeBranch), code: () => import("./code-7AXF27PV.js").then((t) => t.code), cog: () => import("./cog-GWZHN2PI.js").then((t) => t.cog), "columns-2": () => import("./columns-2-ACFIEOJC.js").then((t) => t.columns2), comment: () => import("./comment-G5KPZUDM.js").then((t) => t.comment), comments: () => import("./comments-DJNCC2KS.js").then((t) => t.comments), compass: () => import("./compass-J6MUMTDR.js").then((t) => t.compass), compress: () => import("./compress-J7CX7CSQ.js").then((t) => t.compress), copy: () => import("./copy-V5PH3TIX.js").then((t) => t.copy), "credit-card": () => import("./credit-card-QYFYQFRT.js").then((t) => t.creditCard), crown: () => import("./crown-STAJPKYP.js").then((t) => t.crown), database: () => import("./database-5M7IUKP6.js").then((t) => t.database), "delete-left": () => import("./delete-left-EBXL4ZLC.js").then((t) => t.deleteLeft), desktop: () => import("./desktop-3IHQYZU4.js").then((t) => t.desktop), "directions-alt": () => import("./directions-alt-PTH375O7.js").then((t) => t.directionsAlt), directions: () => import("./directions-FGY6Q54O.js").then((t) => t.directions), discord: () => import("./discord-3JJ7BRXG.js").then((t) => t.discord), dollar: () => import("./dollar-NI6U6FSA.js").then((t) => t.dollar), dot: () => import("./dot-PF7G5DPR.js").then((t) => t.dot), download: () => import("./download-AKYQACT3.js").then((t) => t.download), eject: () => import("./eject-Q6TV4CAE.js").then((t) => t.eject), "ellipsis-h": () => import("./ellipsis-h-TAJJTGXO.js").then((t) => t.ellipsisH), "ellipsis-v": () => import("./ellipsis-v-VLEJ6725.js").then((t) => t.ellipsisV), envelope: () => import("./envelope-NWUQOZ4G.js").then((t) => t.envelope), equals: () => import("./equals-2UZ2IOGH.js").then((t) => t.equals), eraser: () => import("./eraser-MRLFEMT2.js").then((t) => t.eraser), ethereum: () => import("./ethereum-FEPABEXY.js").then((t) => t.ethereum), euro: () => import("./euro-X7GA4SMG.js").then((t) => t.euro), "exclamation-circle": () => import("./exclamation-circle-5TMT77Z5.js").then((t) => t.exclamationCircle), "exclamation-triangle": () => import("./exclamation-triangle-HUNEE5MW.js").then((t) => t.exclamationTriangle), expand: () => import("./expand-IYAZIY3D.js").then((t) => t.expand), "external-link": () => import("./external-link-4YSGNGCZ.js").then((t) => t.externalLink), "eye-dropper": () => import("./eye-dropper-O5WMX3LY.js").then((t) => t.eyeDropper), "eye-slash": () => import("./eye-slash-EKFIETDH.js").then((t) => t.eyeSlash), eye: () => import("./eye-IMODZROA.js").then((t) => t.eye), "face-smile": () => import("./face-smile-6R5W6FRL.js").then((t) => t.faceSmile), facebook: () => import("./facebook-32C5S6SI.js").then((t) => t.facebook), "fast-backward": () => import("./fast-backward-F2BZSUVA.js").then((t) => t.fastBackward), "fast-forward": () => import("./fast-forward-IY5LFAU7.js").then((t) => t.fastForward), "file-arrow-up": () => import("./file-arrow-up-2GOT2HEW.js").then((t) => t.fileArrowUp), "file-check": () => import("./file-check-6FUZZ67V.js").then((t) => t.fileCheck), "file-edit": () => import("./file-edit-OTBEXVU6.js").then((t) => t.fileEdit), "file-excel": () => import("./file-excel-Z6DT33PV.js").then((t) => t.fileExcel), "file-export": () => import("./file-export-W2KXXJ7L.js").then((t) => t.fileExport), "file-import": () => import("./file-import-K5E6TYC4.js").then((t) => t.fileImport), "file-o": () => import("./file-o-SUMQKBYN.js").then((t) => t.fileO), "file-pdf": () => import("./file-pdf-QVT5BJFR.js").then((t) => t.filePdf), "file-plus": () => import("./file-plus-RNAUHMHI.js").then((t) => t.filePlus), "file-word": () => import("./file-word-24GQ3TXI.js").then((t) => t.fileWord), file: () => import("./file-DXJTVKF7.js").then((t) => t.file), "filter-fill": () => import("./filter-fill-JREN26E2.js").then((t) => t.filterFill), "filter-slash": () => import("./filter-slash-DND5HGQK.js").then((t) => t.filterSlash), filter: () => import("./filter-O7HGDD7K.js").then((t) => t.filter), "flag-fill": () => import("./flag-fill-HJXZK6IE.js").then((t) => t.flagFill), flag: () => import("./flag-ZPPAIH3R.js").then((t) => t.flag), "folder-open": () => import("./folder-open-XJST3WVT.js").then((t) => t.folderOpen), "folder-plus": () => import("./folder-plus-IGBBCJOC.js").then((t) => t.folderPlus), folder: () => import("./folder-W5A36FBR.js").then((t) => t.folder), forward: () => import("./forward-JXXQ763E.js").then((t) => t.forward), gauge: () => import("./gauge-Z4QMNZDG.js").then((t) => t.gauge), gift: () => import("./gift-5CN4SKDH.js").then((t) => t.gift), github: () => import("./github-Z3SSP4KW.js").then((t) => t.github), globe: () => import("./globe-IIU7BPCN.js").then((t) => t.globe), google: () => import("./google-NH3MNTHA.js").then((t) => t.google), "graduation-cap": () => import("./graduation-cap-2VFG7OYP.js").then((t) => t.graduationCap), "grid-2": () => import("./grid-2-3REFUOK5.js").then((t) => t.grid2), "grip-horizontal": () => import("./grip-horizontal-2VFAXWXI.js").then((t) => t.gripHorizontal), "grip-vertical": () => import("./grip-vertical-N2W5NMZP.js").then((t) => t.gripVertical), grip: () => import("./grip-URB2AAQQ.js").then((t) => t.grip), hammer: () => import("./hammer-TCBBPCG2.js").then((t) => t.hammer), hashtag: () => import("./hashtag-UOKLX2B4.js").then((t) => t.hashtag), "heading-1": () => import("./heading-1-52LIPOGB.js").then((t) => t.heading1), "heading-2": () => import("./heading-2-NJWA3OW7.js").then((t) => t.heading2), "heading-3": () => import("./heading-3-ROX4YDLY.js").then((t) => t.heading3), "heading-4": () => import("./heading-4-VHOO5YUY.js").then((t) => t.heading4), "heading-5": () => import("./heading-5-CUH3S5UC.js").then((t) => t.heading5), "heading-6": () => import("./heading-6-YXZIVXAP.js").then((t) => t.heading6), heading: () => import("./heading-JLNU5MO3.js").then((t) => t.heading), headphones: () => import("./headphones-TQ2453OA.js").then((t) => t.headphones), "heart-fill": () => import("./heart-fill-L4M37U7U.js").then((t) => t.heartFill), heart: () => import("./heart-Q3S2BTUT.js").then((t) => t.heart), highlighter: () => import("./highlighter-NYQOVO2W.js").then((t) => t.highlighter), history: () => import("./history-APDZZPKA.js").then((t) => t.history), home: () => import("./home-NNPG4AVQ.js").then((t) => t.home), "horizontal-rule": () => import("./horizontal-rule-OJ3OKT3G.js").then((t) => t.horizontalRule), hourglass: () => import("./hourglass-MLSBZYQO.js").then((t) => t.hourglass), "id-card": () => import("./id-card-4KYDCVJ2.js").then((t) => t.idCard), image: () => import("./image-IEBCDHKX.js").then((t) => t.image), images: () => import("./images-5ZW2CUYY.js").then((t) => t.images), inbox: () => import("./inbox-KUVRSVRL.js").then((t) => t.inbox), indent: () => import("./indent-3MKCRJXG.js").then((t) => t.indent), "indian-rupee": () => import("./indian-rupee-VC7ULB2F.js").then((t) => t.indianRupee), "info-circle": () => import("./info-circle-OOKIQ24K.js").then((t) => t.infoCircle), info: () => import("./info-FVVPSD2K.js").then((t) => t.info), instagram: () => import("./instagram-3GLS2U7D.js").then((t) => t.instagram), italic: () => import("./italic-7BNHCRAQ.js").then((t) => t.italic), key: () => import("./key-R6QHF7RC.js").then((t) => t.key), language: () => import("./language-H37TIIWO.js").then((t) => t.language), lightbulb: () => import("./lightbulb-G5V4QTG5.js").then((t) => t.lightbulb), link: () => import("./link-JOWXEY5Y.js").then((t) => t.link), linkedin: () => import("./linkedin-2JVU5LU7.js").then((t) => t.linkedin), "list-check": () => import("./list-check-G5SSON4Y.js").then((t) => t.listCheck), "list-ol": () => import("./list-ol-FDZGU4CE.js").then((t) => t.listOl), "list-tree": () => import("./list-tree-7GZHIJAI.js").then((t) => t.listTree), list: () => import("./list-6ZCWY6GL.js").then((t) => t.list), "lock-open": () => import("./lock-open-NSCNRXWH.js").then((t) => t.lockOpen), lock: () => import("./lock-LFUH3TOM.js").then((t) => t.lock), "map-marker": () => import("./map-marker-S3GPSJYS.js").then((t) => t.mapMarker), map: () => import("./map-UGPQGBG7.js").then((t) => t.map), mars: () => import("./mars-PYNIFGE7.js").then((t) => t.mars), megaphone: () => import("./megaphone-INB7DTHV.js").then((t) => t.megaphone), "microchip-ai": () => import("./microchip-ai-LSK6DA6N.js").then((t) => t.microchipAi), microchip: () => import("./microchip-URHZF66U.js").then((t) => t.microchip), microphone: () => import("./microphone-VHRP5ELA.js").then((t) => t.microphone), microsoft: () => import("./microsoft-QKCSRYYD.js").then((t) => t.microsoft), "minus-circle": () => import("./minus-circle-N4JG75FH.js").then((t) => t.minusCircle), minus: () => import("./minus-YDDF2RB6.js").then((t) => t.minus), mobile: () => import("./mobile-NHEOTLIP.js").then((t) => t.mobile), "money-bill": () => import("./money-bill-BNQ5ERD6.js").then((t) => t.moneyBill), moon: () => import("./moon-2RAELYPD.js").then((t) => t.moon), "note-sticky": () => import("./note-sticky-WVARBLY4.js").then((t) => t.noteSticky), "objects-column": () => import("./objects-column-UPTY52ZF.js").then((t) => t.objectsColumn), outdent: () => import("./outdent-VJRTQSH5.js").then((t) => t.outdent), palette: () => import("./palette-VTR3BXFY.js").then((t) => t.palette), paperclip: () => import("./paperclip-K5BEVBC6.js").then((t) => t.paperclip), "paragraph-left": () => import("./paragraph-left-EEKEL3CS.js").then((t) => t.paragraphLeft), "paragraph-right": () => import("./paragraph-right-CPJFR6R3.js").then((t) => t.paragraphRight), "pause-circle": () => import("./pause-circle-KQHHFCWK.js").then((t) => t.pauseCircle), pause: () => import("./pause-EPYPTBKY.js").then((t) => t.pause), paypal: () => import("./paypal-BXZKLNQK.js").then((t) => t.paypal), "pen-line": () => import("./pen-line-2I24JJ3H.js").then((t) => t.penLine), "pen-to-square": () => import("./pen-to-square-27UAYVX2.js").then((t) => t.penToSquare), pencil: () => import("./pencil-PMEMRPOS.js").then((t) => t.pencil), percentage: () => import("./percentage-BVBSB4AT.js").then((t) => t.percentage), phone: () => import("./phone-IQF7F7LZ.js").then((t) => t.phone), pinterest: () => import("./pinterest-DH37HOR5.js").then((t) => t.pinterest), "play-circle": () => import("./play-circle-DSUK6RA4.js").then((t) => t.playCircle), play: () => import("./play-YWRMLSTE.js").then((t) => t.play), "plus-circle": () => import("./plus-circle-VRWQGNCG.js").then((t) => t.plusCircle), plus: () => import("./plus-KSEN5WYJ.js").then((t) => t.plus), pound: () => import("./pound-CF55T6GW.js").then((t) => t.pound), "power-off": () => import("./power-off-VQBBADBH.js").then((t) => t.powerOff), prime: () => import("./prime-PFPBJEPS.js").then((t) => t.prime), print: () => import("./print-C6QROSU3.js").then((t) => t.print), qrcode: () => import("./qrcode-CFXQF5N7.js").then((t) => t.qrcode), "question-circle": () => import("./question-circle-3G4FQJLP.js").then((t) => t.questionCircle), question: () => import("./question-LGMQZQNA.js").then((t) => t.question), receipt: () => import("./receipt-WEX3I3BN.js").then((t) => t.receipt), "rectangle-xmark": () => import("./rectangle-xmark-O3Z67WPN.js").then((t) => t.rectangleXmark), reddit: () => import("./reddit-CW5VTLIU.js").then((t) => t.reddit), refresh: () => import("./refresh-L37R6G56.js").then((t) => t.refresh), replay: () => import("./replay-E57EIZWM.js").then((t) => t.replay), reply: () => import("./reply-IT4DPKMY.js").then((t) => t.reply), "rows-2": () => import("./rows-2-UZXA5DUU.js").then((t) => t.rows2), save: () => import("./save-FXXYECYQ.js").then((t) => t.save), "search-minus": () => import("./search-minus-FP3VZ2FY.js").then((t) => t.searchMinus), "search-plus": () => import("./search-plus-NMWYCBRO.js").then((t) => t.searchPlus), search: () => import("./search-KBIUJQ6G.js").then((t) => t.search), send: () => import("./send-PS7B7G4G.js").then((t) => t.send), server: () => import("./server-L226CKV6.js").then((t) => t.server), "share-alt": () => import("./share-alt-W7DD46WU.js").then((t) => t.shareAlt), shield: () => import("./shield-FKYMZY3J.js").then((t) => t.shield), shop: () => import("./shop-3XDYMRMQ.js").then((t) => t.shop), "shopping-bag": () => import("./shopping-bag-A4J4VJPZ.js").then((t) => t.shoppingBag), "shopping-cart": () => import("./shopping-cart-2BUZD4QD.js").then((t) => t.shoppingCart), sidebar: () => import("./sidebar-PDIRIUBD.js").then((t) => t.sidebar), "sign-in": () => import("./sign-in-G7WU534U.js").then((t) => t.signIn), "sign-out": () => import("./sign-out-Y5ZAE4M6.js").then((t) => t.signOut), signature: () => import("./signature-CSONGCEJ.js").then((t) => t.signature), sitemap: () => import("./sitemap-QTH2FZE2.js").then((t) => t.sitemap), slack: () => import("./slack-Q3N7HP4T.js").then((t) => t.slack), slash: () => import("./slash-L7VZ3FQH.js").then((t) => t.slash), "sliders-h": () => import("./sliders-h-BA4BZU3K.js").then((t) => t.slidersH), "sliders-v": () => import("./sliders-v-OVXZLCKR.js").then((t) => t.slidersV), "sort-alpha-down-alt": () => import("./sort-alpha-down-alt-ONAAVIIU.js").then((t) => t.sortAlphaDownAlt), "sort-alpha-down": () => import("./sort-alpha-down-Z4GXLGGU.js").then((t) => t.sortAlphaDown), "sort-alpha-up-alt": () => import("./sort-alpha-up-alt-HHOPQSXN.js").then((t) => t.sortAlphaUpAlt), "sort-alpha-up": () => import("./sort-alpha-up-23GOIFJX.js").then((t) => t.sortAlphaUp), "sort-alt-slash": () => import("./sort-alt-slash-HBV3ECRB.js").then((t) => t.sortAltSlash), "sort-alt": () => import("./sort-alt-V7NY3QXE.js").then((t) => t.sortAlt), "sort-amount-down-alt": () => import("./sort-amount-down-alt-PPOVMVXT.js").then((t) => t.sortAmountDownAlt), "sort-amount-down": () => import("./sort-amount-down-YVECOT3U.js").then((t) => t.sortAmountDown), "sort-amount-up-alt": () => import("./sort-amount-up-alt-T4N3W2C2.js").then((t) => t.sortAmountUpAlt), "sort-amount-up": () => import("./sort-amount-up-7KDQA6XC.js").then((t) => t.sortAmountUp), "sort-down-fill": () => import("./sort-down-fill-FV25R3TM.js").then((t) => t.sortDownFill), "sort-down": () => import("./sort-down-EZT3H2A6.js").then((t) => t.sortDown), "sort-numeric-down-alt": () => import("./sort-numeric-down-alt-O4RSDHYB.js").then((t) => t.sortNumericDownAlt), "sort-numeric-down": () => import("./sort-numeric-down-OUOQXUJL.js").then((t) => t.sortNumericDown), "sort-numeric-up-alt": () => import("./sort-numeric-up-alt-LEHTH6UX.js").then((t) => t.sortNumericUpAlt), "sort-numeric-up": () => import("./sort-numeric-up-3TKNLE32.js").then((t) => t.sortNumericUp), "sort-up-fill": () => import("./sort-up-fill-FEKGRVAT.js").then((t) => t.sortUpFill), "sort-up": () => import("./sort-up-OTWWWUCM.js").then((t) => t.sortUp), sort: () => import("./sort-HZHJQJZO.js").then((t) => t.sort), sparkles: () => import("./sparkles-KKIBKFZZ.js").then((t) => t.sparkles), "spinner-dotted": () => import("./spinner-dotted-ZHPWTPVE.js").then((t) => t.spinnerDotted), spinner: () => import("./spinner-SQFM2H3F.js").then((t) => t.spinner), square: () => import("./square-4RGR27BU.js").then((t) => t.square), stamp: () => import("./stamp-PYIMXJ7M.js").then((t) => t.stamp), "star-fill": () => import("./star-fill-NHYK5DPS.js").then((t) => t.starFill), "star-half-fill": () => import("./star-half-fill-UAUOMTZN.js").then((t) => t.starHalfFill), "star-half": () => import("./star-half-CKMYUGUB.js").then((t) => t.starHalf), star: () => import("./star-Z6MIAKGB.js").then((t) => t.star), "step-backward-alt": () => import("./step-backward-alt-3FJDHL55.js").then((t) => t.stepBackwardAlt), "step-backward": () => import("./step-backward-RWJBCA25.js").then((t) => t.stepBackward), "step-forward-alt": () => import("./step-forward-alt-QYVNUM2O.js").then((t) => t.stepForwardAlt), "step-forward": () => import("./step-forward-HJTMVDU3.js").then((t) => t.stepForward), "stop-circle": () => import("./stop-circle-HFBJVXSK.js").then((t) => t.stopCircle), stop: () => import("./stop-5F5XUYYY.js").then((t) => t.stop), stopwatch: () => import("./stopwatch-A63Z3DUH.js").then((t) => t.stopwatch), strikethrough: () => import("./strikethrough-PZHKWV7W.js").then((t) => t.strikethrough), subscript: () => import("./subscript-JPDQURB4.js").then((t) => t.subscript), sun: () => import("./sun-PY72MYO6.js").then((t) => t.sun), superscript: () => import("./superscript-U46B5EPY.js").then((t) => t.superscript), sync: () => import("./sync-GCGDGNAB.js").then((t) => t.sync), table: () => import("./table-AFKRG7WQ.js").then((t) => t.table), tablet: () => import("./tablet-BL6SPM7D.js").then((t) => t.tablet), tag: () => import("./tag-FYEYC6DA.js").then((t) => t.tag), tags: () => import("./tags-FJIXWIUM.js").then((t) => t.tags), telegram: () => import("./telegram-OUXCTSUD.js").then((t) => t.telegram), "text-color": () => import("./text-color-VNW6A32K.js").then((t) => t.textColor), text: () => import("./text-5HZBDNYA.js").then((t) => t.text), "th-large": () => import("./th-large-3K6K6T3M.js").then((t) => t.thLarge), "thumbs-down-fill": () => import("./thumbs-down-fill-KMGFH5B4.js").then((t) => t.thumbsDownFill), "thumbs-down": () => import("./thumbs-down-FQYHK3PI.js").then((t) => t.thumbsDown), "thumbs-up-fill": () => import("./thumbs-up-fill-ILTZQDQZ.js").then((t) => t.thumbsUpFill), "thumbs-up": () => import("./thumbs-up-PMT43B7N.js").then((t) => t.thumbsUp), thumbtack: () => import("./thumbtack-QOSHITWZ.js").then((t) => t.thumbtack), ticket: () => import("./ticket-RULP4VPB.js").then((t) => t.ticket), tiktok: () => import("./tiktok-HTKOK35B.js").then((t) => t.tiktok), "times-circle": () => import("./times-circle-Y5PK5POO.js").then((t) => t.timesCircle), times: () => import("./times-ZIN4YZX6.js").then((t) => t.times), trash: () => import("./trash-TDCP5RIN.js").then((t) => t.trash), trophy: () => import("./trophy-YAMGHQLY.js").then((t) => t.trophy), truck: () => import("./truck-TICEF7WQ.js").then((t) => t.truck), "turkish-lira": () => import("./turkish-lira-EQZAGVGT.js").then((t) => t.turkishLira), twitch: () => import("./twitch-SQ2RCK3B.js").then((t) => t.twitch), twitter: () => import("./twitter-G46D6JL7.js").then((t) => t.twitter), underline: () => import("./underline-NBVGMXYW.js").then((t) => t.underline), undo: () => import("./undo-DNFBDNQN.js").then((t) => t.undo), unlock: () => import("./unlock-JCIHZOL6.js").then((t) => t.unlock), upload: () => import("./upload-EFNVJDHA.js").then((t) => t.upload), "user-edit": () => import("./user-edit-TVCEYU4Z.js").then((t) => t.userEdit), "user-minus": () => import("./user-minus-DLQKEF2Z.js").then((t) => t.userMinus), "user-plus": () => import("./user-plus-IEWJ4PCJ.js").then((t) => t.userPlus), user: () => import("./user-X3VGNL7O.js").then((t) => t.user), users: () => import("./users-QNN6C5QE.js").then((t) => t.users), venus: () => import("./venus-MYY3U4VR.js").then((t) => t.venus), verified: () => import("./verified-CW2WYKVB.js").then((t) => t.verified), video: () => import("./video-BFPQCJRF.js").then((t) => t.video), vimeo: () => import("./vimeo-HEVQAXR3.js").then((t) => t.vimeo), "volume-down": () => import("./volume-down-QJNWKIQW.js").then((t) => t.volumeDown), "volume-off": () => import("./volume-off-UJHX7WLW.js").then((t) => t.volumeOff), "volume-up": () => import("./volume-up-MKJYPRZP.js").then((t) => t.volumeUp), wallet: () => import("./wallet-6ODDBSKF.js").then((t) => t.wallet), warehouse: () => import("./warehouse-TYVGMUXO.js").then((t) => t.warehouse), "wave-pulse": () => import("./wave-pulse-2PFDVDOH.js").then((t) => t.wavePulse), whatsapp: () => import("./whatsapp-KWCRSDT5.js").then((t) => t.whatsapp), wifi: () => import("./wifi-5UTCBWSZ.js").then((t) => t.wifi), "window-maximize": () => import("./window-maximize-NVVI3MB2.js").then((t) => t.windowMaximize), "window-minimize": () => import("./window-minimize-3VG5HQRR.js").then((t) => t.windowMinimize), wrench: () => import("./wrench-2MGPHWH2.js").then((t) => t.wrench), youtube: () => import("./youtube-NXUQB2ZM.js").then((t) => t.youtube) };

// node_modules/@primeicons/angular/fesm2022/primeicons-angular-p-icon.mjs
var _forTrack0 = ($index, $item) => $item[1]["key"] || $index;
function PIcon_For_1_Case_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "path");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("d", node_r1[1]["d"])("fill", node_r1[1]["fill"])("fill-opacity", node_r1[1]["fillOpacity"])("fill-rule", node_r1[1]["fillRule"])("clip-rule", node_r1[1]["clipRule"])("stroke", node_r1[1]["stroke"])("stroke-width", node_r1[1]["strokeWidth"])("stroke-opacity", node_r1[1]["strokeOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function PIcon_For_1_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "circle");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("cx", node_r1[1]["cx"])("cy", node_r1[1]["cy"])("r", node_r1[1]["r"])("fill", node_r1[1]["fill"])("fill-opacity", node_r1[1]["fillOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function PIcon_For_1_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "rect");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("x", node_r1[1]["x"])("y", node_r1[1]["y"])("width", node_r1[1]["width"])("height", node_r1[1]["height"])("rx", node_r1[1]["rx"])("ry", node_r1[1]["ry"])("fill", node_r1[1]["fill"])("fill-opacity", node_r1[1]["fillOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function PIcon_For_1_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "line");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("x1", node_r1[1]["x1"])("y1", node_r1[1]["y1"])("x2", node_r1[1]["x2"])("y2", node_r1[1]["y2"])("stroke", node_r1[1]["stroke"])("stroke-opacity", node_r1[1]["strokeOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function PIcon_For_1_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "polyline");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("points", node_r1[1]["points"])("fill", node_r1[1]["fill"])("fill-opacity", node_r1[1]["fillOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function PIcon_For_1_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "polygon");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("points", node_r1[1]["points"])("fill", node_r1[1]["fill"])("fill-opacity", node_r1[1]["fillOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function PIcon_For_1_Case_6_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵdomElement(0, "ellipse");
  }
  if (rf & 2) {
    const node_r1 = ɵɵnextContext().$implicit;
    ɵɵattribute("cx", node_r1[1]["cx"])("cy", node_r1[1]["cy"])("rx", node_r1[1]["rx"])("ry", node_r1[1]["ry"])("fill", node_r1[1]["fill"])("fill-opacity", node_r1[1]["fillOpacity"])("opacity", node_r1[1]["opacity"]);
  }
}
function PIcon_For_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, PIcon_For_1_Case_0_Template, 1, 9, ":svg:path")(1, PIcon_For_1_Case_1_Template, 1, 6, ":svg:circle")(2, PIcon_For_1_Case_2_Template, 1, 9, ":svg:rect")(3, PIcon_For_1_Case_3_Template, 1, 7, ":svg:line")(4, PIcon_For_1_Case_4_Template, 1, 4, ":svg:polyline")(5, PIcon_For_1_Case_5_Template, 1, 4, ":svg:polygon")(6, PIcon_For_1_Case_6_Template, 1, 7, ":svg:ellipse");
  }
  if (rf & 2) {
    let tmp_10_0;
    const node_r1 = ctx.$implicit;
    ɵɵconditional((tmp_10_0 = node_r1[0]) === "path" ? 0 : tmp_10_0 === "circle" ? 1 : tmp_10_0 === "rect" ? 2 : tmp_10_0 === "line" ? 3 : tmp_10_0 === "polyline" ? 4 : tmp_10_0 === "polygon" ? 5 : tmp_10_0 === "ellipse" ? 6 : -1);
  }
}
var PIcon = class _PIcon extends CoreIcon {
  pIcon = input(void 0, ...ngDevMode ? [{
    debugName: "pIcon"
  }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    super();
    effect(async () => {
      const name = this.pIcon();
      if (!name) {
        this._icon = null;
        return;
      }
      const loader = e[name];
      if (!loader) {
        console.warn(`[PIcon] Unknown icon: "${name}"`);
        this._icon = null;
        return;
      }
      try {
        this._icon = await loader();
      } catch (e2) {
        console.error(`[PIcon] Failed to load icon "${name}":`, e2);
        this._icon = null;
      }
    });
  }
  static ɵfac = function PIcon_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PIcon)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _PIcon,
    selectors: [["svg", "pIcon", ""]],
    inputs: {
      pIcon: [1, "pIcon"]
    },
    features: [ɵɵInheritDefinitionFeature],
    decls: 2,
    vars: 0,
    template: function PIcon_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵrepeaterCreate(0, PIcon_For_1_Template, 7, 1, null, null, _forTrack0);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PIcon, [{
    type: Component,
    args: [{
      selector: "svg[pIcon]",
      standalone: true,
      template: ICON_TEMPLATE
    }]
  }], () => [], {
    pIcon: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pIcon",
        required: false
      }]
    }]
  });
})();
export {
  PIcon
};
//# sourceMappingURL=@primeicons_angular_p-icon.js.map
