# AGENTS.md

This repository is **esboot-react-mp**, an esboot 4.x React and TypeScript starter for building PC and mobile applications that run in browser and native bridge environments.

## Project Shape

- esboot configuration lives in `.esbootrc.ts`; platform-specific build and runtime configuration lives under `config/`.
- Shared application code lives under `src/`, including APIs, constants, helpers, hooks, higher-order components, localization resources, styles, types, and utilities.
- Platform implementations live under `src/platforms/pc/` and `src/platforms/mobile/`, with `_browser/` and `_native/` variants where behavior differs by runtime.
- Page scaffolding tools and templates live under `dev/tools/` and are exposed through the `create-page` package script.
- Generated production assets live under `dist/`; do not edit them by hand.

## esboot Skill

- For any esboot-related work, use the `esboot` skill.
- If the skill is unavailable, install it with `npx skills add https://skillhub.dztec.net/api/skills/esboot/download`, then use it.

## Common Commands

- `pnpm install` installs dependencies using the pinned pnpm version and lockfile.
- `pnpm dev` starts the esboot development server.
- `pnpm dev:rspack` starts development with Rspack selected explicitly.
- `pnpm build` creates the production build through Rspack.
- `pnpm test` runs the test suite through the esboot Vitest plugin.
- `pnpm bridge-mock` starts the native bridge mock tooling.
- `pnpm docs:dev` starts the documentation development server.
- `pnpm docs:build` builds the documentation site.
- `pnpm create-page` runs the local page scaffolding tool.

## Working Rules

- Use `pnpm`; keep `pnpm-lock.yaml` synchronized with dependency changes.
- Follow existing TypeScript, React, and SCSS patterns in the nearest platform or shared module.
- Put shared behavior in `src/` and introduce platform-specific code only when browser/native or PC/mobile behavior differs.
- Preserve the existing platform matrix and naming conventions rather than adding runtime fallbacks that hide unsupported environments.
- Treat `.env` and `.env.local` values as environment-specific; do not commit secrets or expose their contents in logs or documentation.
- Do not edit generated files under `dist/` or esboot-managed cache files under `node_modules/.cache/esboot/`.

## Verification

- Use TDD for behavior changes: add or update a focused test, confirm it fails for the intended reason, then implement the smallest passing change.
- Run `pnpm test` after behavior changes.
- Run `pnpm build` after build, configuration, dependency, platform, or production-path changes.
- Run both `pnpm test` and `pnpm build` before concluding broad or release-facing changes.
- Report any checks that could not be run and the reason; do not claim unverified results.
