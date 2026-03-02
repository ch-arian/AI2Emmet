# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

emmet-ui is a React library that renders UI from LLM-generated Emmet abbreviations. It takes Emmet strings (e.g., `div.card>h1{Hello}+p{World}`) and produces React components, using ~60% fewer tokens than equivalent JSON. The library targets React 18/19 and ships as both ESM and CJS.

## Commands

- `npm run build` — Build library to dist/ (ES + CJS + .d.ts)
- `npm test` — Run full vitest suite
- `npx vitest src/path/to/file.test.tsx` — Run a single test file
- `npm run test:watch` — Watch mode
- `npm run storybook` — Storybook dev server on port 6006
- `npm run build-storybook` — Build static Storybook

## Architecture

### Core Pipeline: Emmet → HTML → Safe HTML → React

The library processes input through three sequential stages, each a pure function with branded string types for compile-time safety (`EmmetString → HTMLString → SafeHTMLString → ReactNode`):

1. **expand** (`src/pipeline/expand.ts`) — Parses Emmet abbreviation into HTML using the `emmet` package
2. **sanitize** (`src/pipeline/sanitize.ts`) — Strips unsafe content via DOMPurify with an explicit allowlist (`src/config/sanitizer.ts`). Only specific tags and attributes are permitted; `ALLOW_DATA_ATTR: false` means only `data-action` and `data-payload` pass through
3. **hydrate** (`src/pipeline/hydrate.ts`) — Converts safe HTML into React elements via `html-react-parser`, swapping HTML tags for registered React components

`pipeline()` in `src/pipeline/index.ts` orchestrates all three stages.

### Component Registry

`ComponentRegistry` (`src/registry/ComponentRegistry.ts`) maps tag name strings to React components. The `defaultRegistry` comes pre-populated with built-in components (btn, button, card, container, div, h1, p, span). `createReplaceCallback()` creates the html-react-parser replace function that performs the tag-to-component substitution.

`RegistryProvider` / `useRegistry()` expose the registry via React Context for app-wide customization.

### Action System

Elements with `data-action` attributes trigger an `onAction` callback via event delegation. `useActionHandler` (`src/actions/useActionHandler.ts`) attaches a click listener to a container ref and walks up the DOM tree to find `data-action`. `data-payload` is parsed as JSON via `parsePayload()`.

### EmmetRenderer

`EmmetRenderer` (`src/components/EmmetRenderer/`) is the main public component. It wraps the pipeline with loading/error states, retry logic, and action delegation. `useEmmetRenderer` is the headless hook alternative.

### Built-in Components

Located in `src/components/`. All use `tailwind-merge` for className merging. Button supports variant/size props and also detects them from className strings (e.g., `className="primary lg"`).

## Key Conventions

- **Branded types**: Pipeline stages use branded string types (`EmmetString`, `HTMLString`, `SafeHTMLString`) — cast with `as EmmetString` etc.
- **Tests co-located**: Test files live alongside source (e.g., `Button.test.tsx` next to `Button.tsx`)
- **Stories co-located**: Storybook stories sit alongside components; demos live in `src/demos/`
- **Storybook uses Tailwind CDN**: `.storybook/preview-head.html` loads the Tailwind CDN script so utility classes render in stories
- **Vitest globals**: `describe`, `it`, `expect` etc. are globally available (no imports needed)
- **jsdom environment**: Tests run in jsdom with `@testing-library/jest-dom` matchers
