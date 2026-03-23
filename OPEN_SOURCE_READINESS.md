# Open Source Readiness Audit

This document captures why this repository is not yet ready for public open-source release.

## 1) Dependency installation is currently broken

Running a clean install fails with an `ERESOLVE` peer dependency conflict between Storybook's Vitest addon and the pinned Vitest ecosystem major version.

- `@storybook/addon-vitest` requires `@vitest/browser` `^3.0.0 || ^4.0.0`
- The project currently uses Vitest 2.x packages (`vitest`, `@vitest/browser`, `@vitest/coverage-v8`)

Until this is resolved, new contributors cannot reliably install and run the project.

## 2) Project metadata is incomplete for open-source governance

The package is marked as MIT in `package.json`, but there is no standalone `LICENSE` file in the repository root. Most open-source consumers and tooling expect a concrete license text file.

Also missing in-repo community/governance docs typically expected for public OSS projects:

- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md` (or clearly documented vulnerability reporting process)
- Maintainer/support expectations (e.g., support policy or issue triage policy)

## 3) No visible CI automation in-repo

There is no checked-in CI workflow configuration for build/test validation (for example, under `.github/workflows/`).

Without CI:

- contributors cannot see required checks
- maintainers cannot enforce quality gates on PRs
- release confidence drops substantially

## 4) Release/maintenance expectations are unclear

The README provides usage docs, but it does not define release process expectations or project governance details (such as support scope, compatibility policy, and contribution workflow).

## 5) Packaging/versioning signals are still early-stage

The package version is still `0.0.1`, which is generally interpreted as pre-stable/experimental. That is fine technically, but for public OSS this should be paired with explicit stability guarantees and roadmap messaging.

## Recommended minimum bar before public launch

1. Fix dependency alignment so `npm ci` succeeds on a clean clone.
2. Add `LICENSE` file with full MIT text.
3. Add `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and `SECURITY.md`.
4. Add CI workflow(s) that run build + tests on pull requests.
5. Update README with contribution flow, support expectations, and stability statement.
6. Optionally add changelog/release notes process and issue/PR templates.
