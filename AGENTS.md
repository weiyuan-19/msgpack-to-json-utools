# Repository Guidelines

## Project Structure & Module Organization

This repository contains a small Vite-built uTools plugin for converting Hex-encoded MessagePack to formatted JSON.

- `src/app.js` wires DOM events and uTools clipboard/lifecycle APIs.
- `src/converter.js` parses, decodes, and normalizes MessagePack values.
- `src/styles.css` defines the plugin UI and light/dark theme styles.
- `test/converter.test.js` contains conversion unit tests.
- `public/` holds `plugin.json`, the logo, and third-party notices copied into builds.
- `index.html` is the Vite entry point; `MARKETPLACE.md` contains release copy.
- `plugin/` is generated output. Do not edit or commit it.

## Build, Test, and Development Commands

Use Node.js 20.19+ or 22.12+ and install dependencies with `npm install`.

- `npm run dev` runs Vite in watch mode and continually rebuilds `plugin/` for uTools testing.
- `npm test` runs all `test/*.test.js` files with Node's built-in test runner.
- `npm run build` creates the production plugin bundle in `plugin/`.
- `npm run check` runs tests, then performs a production build; use this before submitting changes.

Load `plugin/plugin.json` in the uTools Developer Tools plugin after the initial build.

## Coding Style & Naming Conventions

Use ES modules, two-space indentation, semicolons, and double quotes in JavaScript. Prefer `const`, small single-purpose functions, and descriptive camelCase names; use uppercase snake case for constants such as `MAX_DEPTH`. Use kebab-case for HTML IDs/classes and CSS custom properties. Keep user-facing text consistent with the existing Chinese interface. No formatter or linter is configured, so match surrounding code carefully.

## Testing Guidelines

Write tests with `node:test` and `node:assert/strict`. Name files `*.test.js` under `test/`, and describe behavior in each `test(...)` title. Cover successful decoding, accepted input variants, malformed input, precision-sensitive values, warnings, and security/resource limits when changing conversion logic. Run `npm run check` after every functional change.

## Commit & Pull Request Guidelines

History currently contains only `Initial commit`, so no established commit convention exists. Use short, imperative subjects such as `Handle nested extension values`. Keep commits focused. Pull requests should explain the behavior changed, list validation performed, and link relevant issues. Include screenshots for visible UI changes and note any updates to `public/plugin.json`, marketplace copy, permissions, or privacy behavior.

## Security & Configuration

The plugin promises local-only processing. Preserve the restrictive Content Security Policy in `index.html`; do not add network access, persistence, or new permissions without documenting the rationale and updating user-facing privacy information.
