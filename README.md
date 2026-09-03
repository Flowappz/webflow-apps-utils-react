# @flowappz/webflow-apps-utils-react

React port of [`@finsweet/webflow-apps-utils`](https://www.npmjs.com/package/@finsweet/webflow-apps-utils) v1.1.0 (a Svelte 5 library; its GitHub repo is private — this port was converted from the shipped npm source).

Shared UI components and utilities for building Webflow Designer Extension apps: 25+ components (Button, Select, Modal, Tooltip, TagsInput, ColorPicker, Layout, RegionSelector, …), 140 SVG icons, a Zod-based form system, a global context provider, a lightweight router, and a framework-agnostic `utils/` tree (Webflow Designer API helpers, custom-code helpers, browser storage, animations, and more).

## Stack

- React 19 + TypeScript (strict)
- Vitest 5 + Testing Library (jsdom) — **603 tests**
- Storybook 10 (react-vite) — **353 stories** ported from the original

## Installation

```sh
npm install @flowappz/webflow-apps-utils-react
```

`react` and `react-dom` (18 or 19) are peer dependencies. If your app uses the Webflow Designer API helpers, also install `@webflow/designer-extension-typings`.

## Usage

```tsx
import { Button, Select, GlobalProvider } from '@flowappz/webflow-apps-utils-react';
import { checkIfAppModeIsDesign, parseCSV } from '@flowappz/webflow-apps-utils-react/utils';
import '@flowappz/webflow-apps-utils-react/index.css'; // global theme (Webflow Designer CSS variables + Inter font)
```

Components import their own CSS files, so your bundler needs CSS handling (Vite, webpack, and other standard app bundlers work out of the box).

Svelte idioms map as follows:

| Svelte source | React port |
|---|---|
| `$props()` / `interface Props` | same prop names (incl. lowercase `onclick`-style callbacks); `class` → `className`; `style` strings → `React.CSSProperties` |
| `$bindable()` two-way props | controlled prop + `on<Prop>Change` callback |
| Snippets / slots (`target`, `footer`, `children`) | `ReactNode` props (render functions when the snippet took arguments) |
| `svelte/store` | `src/ui/stores/store.ts` — same `writable`/`derived`/`get` API + `useStore(store)` React hook |
| `setContext`/`getContext` global context | `<GlobalProvider>` + hooks |
| Router (`RouterProvider`, `Route`, `Link`) | same component/hook names, history-API implementation, zero router deps |

## Scripts

```sh
npm run build           # compile to dist/ (tsc + CSS/font assets)
npm run typecheck       # tsc --noEmit
npm test                # vitest --run (603 tests)
npm run storybook       # Storybook dev server on :6006
npm run build-storybook # static build to storybook-static/
```

Publishing runs `prepublishOnly` (typecheck + tests + build) automatically.

## Conversion documentation

- `WORKLOG.md` — full log of the conversion: phases, per-batch status, verification results, and every semantic deviation from the Svelte source.
- `CONVERSION_GUIDE.md` — the rules used to translate Svelte 5 idioms to React.

Notable intentional deviations (details in `WORKLOG.md`): `motion` replaced with the Web Animations API; ProgressBar's `svelte/motion` tween reimplemented with rAF; a Svelte `Route` matching bug fixed so parameterized routes activate; generic scoped CSS selectors re-scoped under component root classes (Svelte's style scoping doesn't exist in React).

## Credits

- **Original library**: [`@finsweet/webflow-apps-utils`](https://www.npmjs.com/package/@finsweet/webflow-apps-utils) by [Finsweet](https://finsweet.com) — all component designs, APIs, and original implementation.
- **React port**: [FlowAppz](https://flowappz.com) — Svelte 5 → React 19 conversion, test suite, and ongoing maintenance of this package.

This is an unofficial, independent port and is not affiliated with or endorsed by Finsweet.
