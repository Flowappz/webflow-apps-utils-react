# Conversion Work Log — @finsweet/webflow-apps-utils → React

Source: `@finsweet/webflow-apps-utils@1.1.0` (Svelte 5, private repo — converted from the npm tarball, which ships full `.svelte` source + stories).
Target: `@finsweet/webflow-apps-utils-react` — React 19 + TypeScript, Vitest + Testing Library, Storybook (react-vite).

## Status legend
- [ ] not started · [~] in progress · [x] done · [v] done + verified (typecheck/tests/storybook)

## Phase 0 — Analysis (2026-09-03)
- [x] Located package; GitHub repo is private, no public forks or existing React ports exist (searched GitHub + npm).
- [x] Downloaded tarball, inventoried 696 files: ~25 UI components, ~100 SVG icons, providers (global context), custom router, svelte stores (incl. Zod FormManager), framework-agnostic `utils/` tree, global CSS + Inter font.
- [x] Key porting decisions:
  - Svelte runes (`$state/$derived`) → React state/`useMemo`; legacy `$:` → derived consts.
  - Snippets/slots → `children` / render-prop props (`ReactNode` or component props).
  - Svelte stores → tiny framework-agnostic store (`writable/derived/get`) + `useStore` hook (`useSyncExternalStore`), so `FormManager` and app-level stores port ~1:1 and stay usable outside React.
  - Scoped `<style>` blocks → co-located plain `.css` files (classes are already BEM-namespaced); global `src/ui/styles/index.css` copied as-is.
  - `svelte-routing`-style router → small React context router with the same public API (`RouterProvider`, `Route`, `Link`, hooks).
  - Icons: `.svelte` SVG files → typed React function components (mechanical).
  - Dropped deps: `svelte`, `svelte-routing`, `overlayscrollbars-svelte`, `motion` (CSS animations used instead where the Svelte code used transitions), `logrocket`, `swiper`, `clipboard` (unused by shipped code).

## Phase 1 — Scaffold
- [v] Project structure, package.json, tsconfig (TS 7), vitest config (Vitest 5 + jsdom), Storybook 10 react-vite config, test setup. React 19.2.
- [v] Store primitive `src/ui/stores/store.ts` (`writable/derived/get/readonly` + `useStore` via useSyncExternalStore) — svelte/store-compatible API.
- [v] Exemplar: Loader (tsx + css + CSF3 story + 4 tests). Verified end-to-end: `tsc --noEmit` clean, `vitest --run` 4/4 pass, `storybook build` succeeds.
- Note: Loader's generic `.wrapper` class renamed to `.fs-loader-wrapper` (Svelte scoping is gone); Button's `:global(.wrapper)` selector must target `.fs-loader-wrapper`.

## Phase 2 — Batch conversion (6 parallel agents, launched 2026-09-03)
- [v] `src/utils/**` + `src/types/**` — all modules merged to .ts (helpers, animations, api+clipboard, browser-storage, custom-code, stores, webflow, webflow-canvas, types). 17 test files / 107 tests pass; tsc clean for scope. Deviations: `animations/factory` reimplemented on Web Animations API (same exported API; `motion` dep dropped); `parseCSV` uses `csv-parse/browser/esm/sync` behind the same Promise signature; svelte/store imports → `src/ui/stores/store.ts`; `utils/stores/router` was a plain writable (no svelte-routing) so ported as-is. Source TODOs carried over verbatim.
- [v] `src/ui/icons/**` — 140 icons converted (129 top-level + 11 apps/), barrel mirrors source exactly, IconsShowcase + CSF3 story (5 variants), 140/140 tests pass, tsc clean for scope. Deviations: TriangleDownIconToggle `rotate` prop typed around SVG's native `rotate` attr; CrossIcon converted but (like source) not exported from barrel; IconsShowcase `bind:value` → useState + prop re-sync.
- [v] components batch A (form core): button, button-group, controlled-buttons, checkbox, switch, input, text, tooltip — 8 components, 121 stories, 97 tests pass, tsc clean for scope. Deviations: Tooltip `hidden`/`isActive` bindables → one-way `hidden` prop + `onIsActiveChange` callback (plus `ref` handle for show/hide/ignoreNextClickEvent); Switch/ButtonGroup bindables → internal state + `onCheckedChange`/`onSelectedChange`; Text's 4x-duplicated Svelte markup factored into one render helper (identical DOM); generic selectors (`.btn`, `.pill`, `Text`'s scoped `*`) prefixed with component classes; Input drops `defaultValue` (React controlled-input conflict); unused source imports (icons in Tooltip/Text/Input) dropped.
- [v] components batch B (overlay/display): select, tags, copy-text, divider, section, progress-bar, notification, modal — 139 stories, 98/98 tests pass, tsc clean for scope. Deviations: Select/TagsInput bindables → controlled prop + `onSelectedChange`/existing `onValueChange`; Select's leaky `init()`/dead-instance code replaced with a proper cleanup effect (unused instance-method export dropped); Select id via `useId()`; ProgressBar `svelte/motion tweened` → rAF tween with ported easings; Modal popover action → effect with same jsdom fallback; generic selectors (`.wrapper`, bare `button`, `.tag*`, `.label/.arrow/.popup`) scoped under component root classes; `style` strings → `React.CSSProperties`; a Section story's source arg bug fixed (sizing args were spread into tooltip config).
- [v] components batch C (layout/misc): layout (+examples/test-helpers), iframe, color-picker (3 components), regions, breakpoints, shared, LoadingScreen + `src/ui/utils` (ui-unique modules ported; api duplicates re-export from `src/utils`) — 13 test files / 91 tests pass; repo-wide tsc clean at completion. Deviations: color bindables → internal state + `onColorChange` string callback (ColorObject `oncolorchange` kept); `.color-picker` root class on ColorSelect renamed `.color-select` (collision); `goto` uses history.pushState + popstate dispatch instead of svelte-routing navigate; ImageUpload `reset` → useImperativeHandle.
- [v] providers + ui/stores + router — 6 test files / 66 tests pass, tsc clean for scope. Global context: rune factory → framework-agnostic factory + React context; context getters are React hooks; `createGlobalContext` additionally exposes a `stateStore` snapshot store; event batching (16ms) kept. Stores: FormManager/FormValidator near 1:1 on store primitive + new `useForm*` hooks; FormDemo's manual refresh dropped (reactive via useStore). Router: history-API Router class with internal writables + 15 reactive hooks; deliberate fix — parameterized routes (`/users/:id`) now activate (source string-compare bug meant they never rendered); `Link` keeps lowercase `onclick`. Story docs ported verbatim (still show Svelte code examples in markdown text).

## Phase 3 — Integration & verification (2026-09-03)
- [v] Barrel exports: `src/ui/components/index.ts` + `src/ui/index.ts` mirror the source barrels (plus `./types`); `src/utils/index.ts` written by utils agent.
- [v] `tsc --noEmit` — clean, zero errors repo-wide.
- [v] Full test suite — **54 files / 603 tests, all passing** (Loader 4, utils 107, icons 140, batch A 97, batch B 98, batch C 91, providers/stores/router 66).
- [v] `storybook build` — succeeds; index contains **353 stories + 29 docs pages** across 29 titles (all source story files ported).
- [v] Storybook dev server verified in a live browser: Button, Select, Modal, Icons (135 svgs), Tooltip, Router example, Form Validation demo, GlobalProvider demo all render without error screens.
- Fix during verification: `index.css` font url `./fonts/…` → `../fonts/…` (CSS was relocated to `styles/`; Inter woff2 404'd, now 200).

## Result
Conversion complete. React 19 + TS strict, 603/603 tests green, Storybook (10, react-vite) builds and runs with all ported stories. See README.md for usage and the deviation summary above for intentional behavior differences.

## Detailed notes
- Story docs for GlobalProvider/Form/Router were ported verbatim and still show Svelte syntax in their markdown code examples (content-only; flagged for optional rewrite).
- jsdom test warnings (canvas getContext, navigation) are benign/expected.
