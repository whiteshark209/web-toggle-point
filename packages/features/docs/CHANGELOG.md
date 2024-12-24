# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2024-11-28

### Changed

- extracted optimizely-specific functionality into separate `optimizely` package, preparing this package to be agnostic of experimentation & context-based decisions.
- added `prebuild` script to ensure dependent workspace packages are built, needed for some un-mockable imports & next example linting...  may replace with WireIt.

### Added

- `globalFeaturesStoreFactory` export, a "feature store" factory function, used to store a global features state available throughout an application
- `nodeRequestScopedStoreFactory` export, a "feature store" factory function designed for use within a request-scoped server runtime, e.g. primed within Express middleware
- `reactContextFeaturesStoreFactory` export, a "feature store" factory function, designed to wrap a proportion of a react application with a contextual features state 
- `ssrBackedReactContextFeaturesStoreFactory` export, a "feature store" factory function, designed to wrap a proportion of a react application with a contextual features state, backed by the [`ssr` package](../../ssr/docs/README.md) for use without an SSR-compatible React framework.
...after spending _far too long_ trying to get node `"exports"` with paths working, so that could better create specific node/browser import paths, before giving up (it works, but ESLint doesn't play ball...)

## [0.2.4] - 2024-11-27

### Changed

- fixed some typos in docs

## [0.2.3] - 2024-11-27

### Changed

- updated to latest `@testing-library/react` to remove errant warning about import of `act`
- updated to `react@18.3.1`, set minimum required react to `17`
  - technically a breaking change, but `jsx-runtime` already introduced in [version 1.0.0](#100---2023-09-12)... so was already broken, oops.
- renamed commonJs exports to have `.cjs` extension to prevent `[ERR_REQUIRE_ESM]` errors in consumers that aren't `"type": "module"`

## [0.2.2] - 2024-12-26

### Changed

- used latest `ssr` package

## [0.2.1] - 2024-11-25

### Changed

- updates to import attributes from import assertions (Node 22 change in monorepo root)

## [0.2.0] - 2024-10-02

### Removed

- `useActivation` is no longer exported, replaced with a plugin for the point cuts package

### Added

- `pointCutPluginFactory` returns a plugin suitable for the point cuts package, that activates experiments

## [0.1.2] - 2024-01-11

### Fixed

- Fixup documentation left fallow from package split (0.1.0)

## [0.1.1] - 2023-11-16

### Fixed

- Make the fallback "main" entry in package.json be commonJs, since in-case used, this will be old Node

## [0.1.0] - 2023-09-12

### Changed

- Re-factored package from `asos-web-toggle-point-app` v1.1.1
- Move to [exports](https://nodejs.org/api/packages.html#exports) in `package.json` (but still fallback to `"main"`, despite not being necessary after Node 12+, due to [this issue](https://github.com/import-js/eslint-plugin-import/issues/1810))
- No longer include corejs in bundle

## [Unreleased] - 2023-09-12

### Added

- A `lint:fix` script

## [Unreleased] - 2022-01-05

### Fixed

- Fixed up race condition with multiple features activating: ensure singleton is set atomically after both asynchronous actions with the features SDK are complete, and let others hang off the same combined promise.

## [Unreleased] - 2022-10-26

### Added

- Initial commit.
