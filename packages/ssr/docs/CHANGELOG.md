# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2024-12-26

### Fixed

- updated some errant JSDoc namespaces

## [0.2.0] - 2024-12-17

### Removed

- `JSONScript`, replace with a `serializationFactory` to support reading/writing outside of the react render, where appropriate.
- `eslint-plugin-markdownlint` (not used with update to ESLint 9, and was causing issues using `html-react-parser`)

### Changes

- made [`jsesc`](https://github.com/mathiasbynens/jsesc) a dependency (as it should be), not a peerDependency.  From a time before proper use of [externals](https://github.com/stevenbenisek/rollup-plugin-auto-external).

## [0.1.7] - 2024-12-09

### Changed

- properly support reactive `withJsonIsomorphism` scripts, rather than one-time hydration

### Fixed

- resolved testing issue with SSR json script

## [0.1.6] - 2024-12-06

### Changed

- changed some `decisions` to `features` nomenclature 

## [0.1.5] - 2024-11-29

### Changed

- changed casing of `JsonScript` to `JSONScript`

## [0.1.4] - 2024-11-27

### Changed

- fixed some typos in docs

## [0.1.3] - 2024-12-06

### Changed

- updated to latest `@testing-library/react` to remove errant warning about import of `act`
- updated to `react@18.3.1`, set minimum required react to `17`
  - technically a breaking change, but `jsx-runtime` already introduced in [version 0.1.0](#010---2023-09-05)... so was already broken, oops.
- renamed commonJs exports to have `.cjs` extension to prevent `[ERR_REQUIRE_ESM]` errors in consumers that aren't `"type": "module"`

## [0.1.2] - 2024-12-06

### Changed

- casing of `JsonScript` to be `JSONScript`

## [0.1.1] - 2024-11-25

### Changed

- updates to import attributes from import assertions (Node 22 change in monorepo root)

## [0.1.0] - 2023-09-05

### Changed

- Re-factored package from `asos-web-toggle-point-app` v1.1.1
- Move to [exports](https://nodejs.org/api/packages.html#exports) in `package.json`
- No longer include corejs in bundle

## [Unreleased] - 2022-01-18

### Fixed

- Ensured `tryGetJson` doesn't coerce `null` to `{}` needlessly - causes a hydration warning (but doesn't materially affect current consumers...)

## [Unreleased] - 2022-10-26

### Added

- Initial commit.
