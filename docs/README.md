<p align="center">
  <h1 align="center">Web Toggle Point</h1>
</p>
<p align="center">
A library providing a means to toggle or branch web application code.
</p>
<p align="center">
   <a href="https://github.com/ASOS/web-toggle-point/tags/"><img src="https://img.shields.io/github/tag/ASOS/web-toggle-point" alt="Current version" /></a>
   <img src="https://github.com/ASOS/web-toggle-point/workflows/Pull Request Checks/badge.svg" alt="Current test status" />
   <a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs are welcome" /></a>
   <a href="https://github.com/ASOS/web-toggle-point/issues/"><img src="https://img.shields.io/github/issues/ASOS/web-toggle-point" alt="toggle point issues" /></a>
   <img src="https://img.shields.io/github/stars/ASOS/web-toggle-point" alt="toggle point stars" />
   <img src="https://img.shields.io/github/forks/ASOS/web-toggle-point" alt="toggle point forks" />
   <img src="https://img.shields.io/github/license/ASOS/web-toggle-point" alt="toggle point license" />
   <a href="https://github.com/ASOS/web-toggle-point/graphs/commit-activity"><img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" alt="toggle point is maintained" /></a>
</p>

---

## Table of Contents

- [🤝 Introduction](#-introduction)
  - [🐬 Purpose](#-purpose)
  - [🎬 Getting Started](#-getting-started)
- [📦 Packages](#-packages)
- [🎁 Examples](#-examples)
- [🔜 Future Plans](#-future-plans)
- [🔗 Links](#-links)

## 🤝 Introduction

### 🐬 Purpose

This library provides a means to toggle or branch application code. 

It aims to enable low friction feature toggling [aspect/advice](https://en.wikipedia.org/wiki/Advice_(programming))[^1] in a codebase.

It suggests a convention-based approach to storing variant code, aiming to mitigate [boilerplate](https://en.wikipedia.org/wiki/Boilerplate_code) whilst developing new features, and reduce the friction of accepting or rejecting toggled variations, when appropriate.

Originally developed for experiment toggles / flags, it acts only as a means to implement a toggle point, separating any toggle router concern, so is agnostic of the type of toggle or flag.

For a full introduction, please see [some articles on medium.com](https://medium.com/@tomstrepsil/web-feature-toggles-part-1-experimentation-at-asos-756cbfc68a4f)

[^1]: (ab)using some terminology from [aspect-oriented programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming)

### 🎬 Getting Started

There are a few moving parts, and they can be combined in different combinations, depending on use case.  

The bare minimum would be injecting a plugin from the [`webpack package`](../packages/webpack/docs/README.md) into a build process, and connecting it with appropriate target modules.  The other packages are utilities to support that. To consider what's possible, and how you might set things up, see [the examples](../examples/README.md) for inspiration!

Then:

1. Figure out what code modules you'd like to toggle, and see if they are suitable
2. Figure out a filesystem convention to use
   - the default proposes colocating variations of base modules in `./__variants__/<feature name>/<variant name>/` folders, with filename parity for the modules themselves.
2. Implement the [`webpack package`](../packages/webpack/docs/README.md)[^2] into your build process, via configuration of appropriate [`pointcuts`](https://en.wikipedia.org/wiki/Pointcut), targeting code modules for toggling that meet the criteria:
   - A single, default export, that is a function
   - Side-effect free (or, at least, with harmless import side-effects)
   - Resolvable by Webpack
3. Create a feature toggle state store, utilising the [`features package`](../packages/features/docs/README.md), or otherwise, suitable for the dynamism of your toggle type.
   - This needs to get state from an appropriate Toggle Router / runtime state provider.
4. Create a toggle point for the point cuts
   - For a [React](https://react.dev/) application, the `withTogglePointFactory` or `withToggledHookFactory` from the [`react pointcuts package`](../packages/react-pointcuts/docs/README.md) can be used, to construct one.
    - Again, use [the examples](../examples/README.md) as a guide.

[^2]: Currently, only webpack is supported.  See [Issue #7](https://github.com/ASOS/web-toggle-point/issues/7) for plans to introduce a Rollup / Vite equivalent.

## 📦 Packages

This repository is made up of four packages:

1. [@asos/web-toggle-point-features](../packages/features/docs/README.md) - Stores for holding feature toggle state.

2. [@asos/web-toggle-point-react-pointcuts](../packages/react-pointcuts/docs/README.md) - React application code for varying a [component](https://reactjs.org/docs/react-component.html) or [hook](https://reactjs.org/docs/hooks-intro.html), based on a given feature toggle state.

3. [@asos/web-toggle-point-ssr](../packages/ssr/docs/README.md) - Code for serializing [JSON](https://www.json.org/) as part of a server rendering process, to be deserialized in client code into an appropriate feature toggle state store. Includes additional React-specific exports, for use in React applications.

4. [@asos/web-toggle-point-webpack](../packages/webpack/docs/README.md) - Detection and insertion of toggle point code during a [webpack](https://webpack.js.org/) build process.

### 🎁 Examples

Please see separate [examples documentation](../examples/README.md).

### 🔜 Future Plans

Please see [issues](https://github.com/ASOS/web-toggle-point/issues) and please consider contributing!

### 🔗 Links

- [Developer Documentation](https://asos.github.io/web-toggle-point/)
