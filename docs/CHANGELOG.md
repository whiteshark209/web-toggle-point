# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

N.B. See changelogs for individual packages, where most change will occur:

- [@asos/web-toggle-point-features CHANGELOG](../packages/features/docs/CHANGELOG.md)
- [@asos/web-toggle-point-react-pointcuts CHANGELOG](../packages/react-pointcuts/docs/CHANGELOG.md)
- [@asos/web-toggle-point-ssr CHANGELOG](../packages/ssr/docs/CHANGELOG.md)
- [@asos/web-toggle-point-webpack CHANGELOG](../packages/webpack/docs/CHANGELOG.md)

This log covers the [monorepo](https://en.wikipedia.org/wiki/Monorepo).

## [0.10.3] - 2025-02-27

### Fixed

- GHA pipelines for publishing to public/scoped NPM repository

## [0.10.2] - 2024-12-26

### Fixed

- "Toggle Point" to "Web Toggle Point" in title of `README.md`
- fixed the dedupe external JSDoc plugin, after move to type imports

## [0.10.1] - 2024-12-24

### Fixed

- "toggle point issues" link in HTML preamble of main `README.md`

## [0.10.0] - 2024-12-18

### Changed

- remove playwright install step in pipeline, instead make this a `pre` script so installs for first-use local users, too
- combined `test` script, to align with canonical [`npm test`](https://docs.npmjs.com/cli/v7/commands/npm-test)
- removed the nice 📋 emoji at the start of the "Pull Request Checks" checks workflow, because the github `authorization_suggestions` endpoint throws an exception when trying to find anything that starts with an emoji, evidently (see [discussion](https://github.com/orgs/community/discussions/147494))
- added `windows-latest` to the checks matrix action, to ensure windows support is not regressed

### Fixed

- support windows `endOfLine` in lint setup
- ensured that changes to `package-lock.json` caused by a package adding a dependency doesn't necessarily mean a `CHANGELOG.md` or version bump is required in the monorepo root; since it's not really had any meaningful change itself.

## [0.9.0] - 2024-11-29

### Changed

- reluctantly add `react` and `react-dom` to the repo root `package.json`, despite not being needed by all packages, due to errant npm deduping.
- ingested `peripheral` packages
  - reluctantly convert danger files to cjs (& [exclude from transpilation](https://danger.systems/js/tutorials/transpilation#disabling-transpilation)), since peripheral babel modules added create a circular reference in babel, and ignores don't work in danger due to https://github.com/danger/danger-js/issues/1469
- removed the `optimizely` package, since not ready for open source, replaced with a fake activation plugin
- remove `eslint-plugin-markdownlint`, hangover from move to eslint 9 in version `0.6.0`, which has native markdown support

## [0.8.0] - 2024-11-29

### Changed

- split out `optimizely` package from `features`
- changed the release workflow to not cancel in progress releases
- changed the checks workflow to cancel in progress checks from the same branch
- removed note re: node toggle points from readme, missed from prior update to features package
- remove note re: support for npm in `snyker` after merge of [this snyker update](https://github.com/ASOS/snyker/pull/10)

## [0.7.0] - 2024-11-27

### Changed

- move the checks action to a matrix, added concurrency group
- updated the danger checks to consider private packages (examples)
- removed cancel-in-progress from release (danger of reified packages released without dependents?)
- updated release workflow to use sparse checkout where appropriate

### Added

- examples
- playwright automation, using examples as test fixtures
- `danger:local` script, to help test the danger setup

## [0.6.1] - 2024-11-27

### Fixed

- Removed old `yarn.lock` left over from 0.4.3 update.

## Added

- Support for mermaid in JSDoc html output

## [0.6.0] - 2024-11-25

### Fixed

- Moved to v4 of [`upload-artifact`](https://github.com/actions/upload-artifact) and [`download-artifact`](https://github.com/actions/download-artifact) actions
- Changed nature of pre-release packages to `beta` from `alpha` (better matching the reality of how these pre-releases are used)
- Fixed up contribution guide since version 0.5.0 added the proposed update checks
- Updated to JSDoc 4, issue with factories resolved

### Changed

- Move to Node LTS (22)
- Move to ESLint 9 & associated plugins, plus lift & shifting `@asos/eslint-config-asosconfig`

## [0.5.8] - 2024-10-08

### Fixed

- Fixed up the [`pull_request_template.md`](../.github/pull_request_template.md) for ADO & formatting.
- Ensured JSDoc linting rules do not apply to test code
- Updated deps to remove 1 high and two moderate npm audit failures.

## [0.5.7] - 2024-07-19

### Changed

- Removed Snyk references except ".snyk" file and central security check configuration
- Added documentation for "Vulnerability Scanning" which is consistent with other repositories
- Added Veracode profile for 1st party code scanning
- Updated github actions to use correct references and updated versions

## [0.5.6] - 2024-07-18

### Added

- **Redacted**

## [0.5.5] - 2024-02-22

### Fixed

- used fixed version of Snyk action
- defused JSON schema errors by short-circuiting use of output values; Pre and Post steps don't play nice with expressions

## [0.5.4] - 2024-02-05

### Fixed

- Fixup documentation left fallow from package split (0.5.0)
- Upgrade serialize-javascript to 6.0.2 to avoid [`SNYK-JS-SERIALIZEJAVASCRIPT-614760`](https://security.snyk.io/vuln/SNYK-JS-SERIALIZEJAVASCRIPT-6147607)
- snyk ignore [`SNYK-JS-INFLIGHT-6095116`](https://security.snyk.io/vuln/SNYK-JS-INFLIGHT-6095116)
- move to use asos runner groups

## [0.5.3] - 2024-02-05

### Fixed

- Updated `github-actions-config.yaml` to cater for breaking change in the central pipeline

## [0.5.2] - 2023-11-16

### Fixed

- Ensured that reify workflow step does not error if no alpha updates uploaded to packages artifact
- Remove manual error-throwing workflow step; the `@actions/download-artifact` will do this already if nothing was uploaded

## [0.5.1] - 2023-11-16

### Fixed

- Ensured that when publishing production packages, the pipeline doesn't alpha version
- Fixup this Changelog file for newly split packages!

## [0.5.0] - 2023-10-23

### Changed

- Split the "app" package into separate "ssr", "features" and "react-pointcuts" packages.
- Move to explicit rather than wildcard workspaces, to enable reification of the repo when publishing (waiting on [an issue to resolve](https://github.com/Roaders/workspace-version/issues/3))
- Updated the `dedupeExternalJsdocPlugin` to de-duplicate members of external namespaces, rather than just the namespaces themselves (to ensure we don't duplicate React, HostApplication etc. in the html documentation)
- Updated packages for snyk vulnerabilities, populated policy file
- Removed redundant export fields from workspace `package.json`

### Removed

- `babel-plugin-module-resolver` from direct reference, since unused directly

### Added

- Danger check to ensure that when a package version is updated, any dependent packages also are updated.  Needed since "features" relies on "ssr".
- Added `eslint-plugin-workspaces` with recommended rules

## [0.4.5] - 2023-10-03

### Added

- Danger support, with checks for `CHANGELOG.md` updates and `package-lock.json` updates

### Fixed

- Fixed the `lint:fix` script to work with the monorepo properly

### Changes

- updated `@babel/*`, `babel-plugin-module-resolver` and `jest` packages to resolve snyk vulnerabilities now blocking the pipeline since snyk github action fix has gone live
- update `eslint` with corresponding config changes to play nicely with the above
- parallelize the checks in the checks workflow

## [0.4.4] - 2023-10-02

### Changed

- Moved away from SPN usage to app registrations in the GHA pipelines.

## [0.4.3] - 2023-09-12

### Changed

- Moved to `npm` from `yarn`

## [0.4.2] - 2022-02-09

### Fixed

- Ensured that alpha packages correctly get an alpha tag on NPM, rather than latest (oops)

## [0.4.1] - 2022-01-05

### Fixed

- Ensured that failures (due to no changed version) whilst releasing one package do not prevent other jobs in the publish matrix from running, or from marking the workflow as a whole as a failure.

## [0.4.0] - 2022-12-23

### Added

- Github Actions release pipeline, based on a `workflow_dispatch` workflow (for now)

## [0.3.0] - 2022-12-12

### Added

- Github actions Documentation pipeline, pushing to Github Pages

## [0.2.0] - 2022-12-07

### Added

- Github Actions Test & Lint pipelines

## [0.1.0] - 2022-10-26

### Added

- Initial commit.
