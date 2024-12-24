# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2024-12-18

### Fixed

- install dependencies properly, and include missing `path-exists-cli` dependency in `package.json`

## [0.1.1] - 2024-12-09

### Changed

- ensured `test:express` builds the express server, since that's no longer part of the playwright `webServer` setup, due to the need to run multiple servers on different ports (so can't build each in parallel)

## [0.1.0] - 2024-11-27

### Added

- Initial project with scripts to trigger `next`, `serve` and `express` examples.
