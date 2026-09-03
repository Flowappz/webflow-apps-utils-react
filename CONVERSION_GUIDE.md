# Svelte → React Conversion Guide (read before converting anything)

Source of truth: the extracted Svelte package at
`C:\Users\walid\AppData\Local\Temp\claude\C--flowappz\039b497d-9618-41f1-b5aa-b11e88b673e9\scratchpad\package\dist`
(referred to as `$SRC` below). It contains full `.svelte` sources, `.d.ts` types, compiled `.js` for non-Svelte modules, and stories.

Target: this repo, `src/`. React 19 + TypeScript strict. No new runtime deps beyond package.json.

## File mapping
- `$SRC/ui/components/foo/Foo.svelte` → `src/ui/components/foo/Foo.tsx` + `Foo.css` (the `<style>` block, verbatim; strip `:global(...)` wrappers — keep the inner selector).
- `$SRC/.../types.d.ts` → `src/.../types.ts` (convert Svelte types: `Component` → `React.ComponentType<{ [key: string]: unknown }>` — export alias `IconComponent` from `src/ui/types.ts`; `Snippet` → `React.ReactNode`; a `Snippet` with params → a render function `(args) => React.ReactNode`).
- `$SRC/.../index.js` + `index.d.ts` → `src/.../index.ts` barrel.
- Non-Svelte modules (`.js` + matching `.d.ts`) → merge into one `.ts` file: take the `.js` implementation and re-apply the type annotations/JSDoc from the `.d.ts`. Do not change logic.
- Stories: `*.stories.js` / `*.stories.svelte` → `*.stories.tsx` (CSF3, see below).

## Component conversion rules
1. **Props**: Svelte `interface Props` carries over. Keep every prop name IDENTICAL (including lowercase event handlers like `onclick`, `onshow` — do NOT rename to onClick unless the prop is spread onto a DOM element, in which case map `onclick` → `onClick` internally). `class` prop → `className`; `style?: string` prop stays a string and is applied via the `style` attribute — convert to object or use `<div style={...}>` with a parsed object? NO: keep it simple, apply string styles by merging into a `style` attribute is not possible in React; instead accept `style?: React.CSSProperties` and update stories accordingly, EXCEPT where the Svelte code builds style strings internally — build a `React.CSSProperties` object instead.
2. **Runes**: `$state` → `useState`/`useRef` (element refs → `useRef`); `$derived`/`$derived.by`/`$:` → plain consts or `useMemo`; `$effect`/`onMount`/`onDestroy` → `useEffect`; `$bindable(x)` → controlled prop + `onXChange?` callback pair (keep the original prop name; add `on<Prop>Change`); `tick()` → not needed / `requestAnimationFrame` where ordering matters.
3. **Snippets/slots**: `children?: Snippet` → `children?: React.ReactNode`; named snippets (`target`, `tooltip`, `footer`…) → props of type `React.ReactNode` (or `(args)=>ReactNode` when the snippet takes params). `{@render x()}` → `{x}`.
4. **Component props** (`icon?: Component`) → `icon?: IconComponent` rendered as `<Icon />`.
5. **Events**: Svelte callback props (`onclick`, `onchange`…) keep their names in the public API. Internal DOM listeners become React handlers.
6. **Styles**: copy the `<style>` block verbatim to `Foo.css`, `import './Foo.css'` at the top of the tsx. Svelte scoping is gone — the classes are BEM-ish and unique per component; if a selector is dangerously generic (e.g. `.wrapper`), prefix it with a component class (e.g. `.fs-loader .wrapper`) and update the JSX. `style:x={y}` directives → entries in the element's `style` object.
7. **Transitions** (`transition:fade` etc.) → CSS transitions/keyframes in the component css; acceptable to mount/unmount without animation if complex, but prefer a simple CSS fade.
8. **Svelte stores** in components → `src/ui/stores/store.ts` (`writable`, `derived`, `get`, `useStore` hook — same API as svelte/store). `$store` auto-subscription → `useStore(store)`.
9. **Context** (`setContext`/`getContext`) → React `createContext` + provider + hook.
10. **`bind:this`** → `useRef`. **`bind:value`** → controlled input with internal state fallback (uncontrolled if prop undefined).
11. Preserve ALL logic, class names, aria attributes, data attributes, and CSS variables exactly — pixel parity matters.

## Stories (CSF3, Storybook react-vite)
```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Foo } from './index';

const meta = { title: 'Components/Foo', component: Foo, tags: ['autodocs'], argTypes: {...port from source...} } satisfies Meta<typeof Foo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { ...port from source... } };
```
Port every named export/variant from the source story (`.stories.js` argTypes/args carry over almost verbatim; `.stories.svelte` variants become one named `Story` per `<Story>` block, using `render:` when custom markup is needed). Keep the original `title`.

## Tests (Vitest + Testing Library, jsdom)
For each component write `Foo.test.tsx` next to it: render with defaults, assert key DOM/classes/aria; exercise main interactions (click/change/keyboard) with `@testing-library/user-event`. For util modules write `*.test.ts` with focused unit tests of pure logic. Don't test CSS appearance. `webflow` global: when a module touches the Webflow Designer API, mock `globalThis.webflow` in the test.
Note: `vitest` `globals: true` is on; `@testing-library/jest-dom` matchers are loaded via setup file.

## Imports
- Use relative imports within src (match source layout).
- `import type` for types. No default exports for components except where source `index.ts` re-exports default — mirror the source barrel exactly (many do `export { default as Foo }`; in React use named exports and adjust barrels: `export { Foo } from './Foo'`).
- Icons: named function components `export const CheckIcon = (props: IconProps) => (...)`, `IconProps = React.SVGProps<SVGSVGElement>`, spread `{...props}` on the root `<svg>`. Keep `width="100%" height="100%"` defaults and `currentColor` fills. Convert SVG attributes to camelCase JSX (`stroke-width` → `strokeWidth`, `clip-path` → `clipPath`, `xlink:href` drop).

## Verification (every agent, before reporting done)
```
cd C:\flowappz\webflow-apps-utils-react
npx tsc --noEmit          # must be clean for YOUR files (pre-existing errors in others' files: ignore, report)
npx vitest --run <paths>  # your tests pass
```
Report: files created, deviations from source (anything you had to change semantically), and any TODOs.
