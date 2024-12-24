# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.3] - 2024-12-24

### Changed

- moved from `cataas.com` (which appears to be down) to `api.thecatapi.com`, and mocked response in the playwright tests for reduced brittleness

### Fixed

- fixed up instructions for move to different ports
- removed duplicate `api` routes, redundant since move to `animalsRouter`

## [0.2.2] - 2024-12-19

### Removed

- `eslint-plugin-markdownlint` (not used with update to ESLint 9, and was causing issues using `html-react-parser`)

## [0.2.1] - 2024-12-18

### Fixed

- support windows `endOfLine` in lint setup

## [0.2.0] - 2024-12-06

### Added

- "config" example, utilising updated `react-pointcuts`, `ssr` and `features` packages.
- improved `README.md` for "animals" example

### Changed

- location of "animals" example

## [0.1.0] - 2024-11-25

### Added

- example demonstrating long-lived modules and request-scoped decision context
- playwright test using example as fixture
