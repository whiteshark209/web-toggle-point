# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.2] - 2024-12-26

### Fixed

- updated some errant JSDoc namespaces

## [0.4.1] - 2024-12-17

### Removed

- `eslint-plugin-markdownlint` (not used with update to ESLint 9, and was causing issues using `html-react-parser`)

## [0.4.0] - 2024-12-06

### Changed

- updated `withTogglePointFactory` and `withToggledHookFactory` to make then agnostic of React Context
- updated "decisions" to "activeFeatures" nomenclature, throughout (more agnostic of experiment toggle type)
- updated `withTogglePointFactory` to accept a `variantKey`, allowing override a default of `bucket` terminology (which is somewhat "experiment toggle")

## [0.3.1] - 2024-11-27

### Changed

- fixed some typos in docs

## [0.3.0] - 2024-11-27

### Changed

- Updated the factories to accept:
  - a `Map` of features (de-coupling from a webpack-specific data structure)
  - a [javascript module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), rather than its `default` export (preparing for support of named exports)
- updated to `react@18.3.1`, set minimum required react to `17`
  - technically a breaking change, but `jsx-runtime` already introduced in [version 0.1.0](#010---2023-09-05)... so was already broken, oops.
- moved package to `"type": "module"` and renamed commonJs exports to have `.cjs` extension to prevent `[ERR_REQUIRE_ESM]` errors in consumers that aren't `"type": "module"`

### Fixed

- Added missing documentation change for plugin interface

## [0.2.1] - 2024-11-25

### Changed

- updates to import attributes from import assertions (Node 22 change in monorepo root)

## [0.2.0] - 2024-10-02

### Changed

- Moved `withTogglePoint` and `withToggledHook` to a plugin interface, de-coupling with experiment activation explicitly

### Fixed

- Added a typedef for the external webpack `RequireContext` to improve documentation
- Removed "plp" nomenclature from the `getMatchedVariants` tests
- Fixed display name for `withErrorBoundary` Higher-Order Component
- Added test case to cover display names (previously excluded due to being dev-only concern, but added now for completeness)

## [0.1.2] - 2024-02-05

### Fixed

- Ensured that react components that are having refs forwarded to them pass that ref down to varied components

## [0.1.1] - 2023-11-16

### Fixed

- Make the fallback "main" entry in package.json be commonJs, since in-case used, this will be old Node
- Make the features package an explicit peer dependency (used to provide activation hook, decisions/audience context)
- Make the webpack package an explicit peer dependency (used to provide requireContext, injection point for point cuts)

## [0.1.0] - 2023-09-05

### Changed

- Re-factored package from `asos-web-toggle-point-app` v1.1.1
- Move to [exports](https://nodejs.org/api/packages.html#exports) in `package.json` (but still fallback to `"main"`, despite not being necessary after Node 12+, due to [this issue](https://github.com/import-js/eslint-plugin-import/issues/1810))
- No longer include corejs in bundle

## [Unreleased] - 2022-02-14

### Fixed

- Corrected docs for output type of `withToggledHook`

## [Unreleased] - 2022-02-10

### Added

- `withToggledHookFactory` to allow toggling of react hooks

## [Unreleased] - 2022-12-20

### Changed

- Removed fuzzy-match on feature name, since no longer a requirement with new Optimizely UI

## [Unreleased] - 2022-10-26

### Added

- Initial commit.
