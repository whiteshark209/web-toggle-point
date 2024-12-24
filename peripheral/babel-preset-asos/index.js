const { declare } = require("@babel/helper-plugin-utils");

const MINIMUM_BABEL_VERSION = "^7.0.0";

const DEFAULT_COREJS = "3.24";
const DEFAULT_USE_BUILT_INS = "usage";
const DEFAULT_MODULES_OPTION = "auto";
const DEFAULT_REACT_RUNTIME = "classic";
const DEFAULT_TRANSFORM_RUNTIME = false;

function getCorejsOptions(options) {
  if (options.corejs === false) {
    return {
      useBuiltIns: false,
    };
  }

  return {
    corejs: options.corejs || DEFAULT_COREJS,
    useBuiltIns: options.useBuiltIns || DEFAULT_USE_BUILT_INS,
  };
}

function getDevelopmentOption(api, options) {
  return typeof options.development === "boolean"
    ? options.development
    : api.cache.using(() => process.env.NODE_ENV === "development");
}

function getModulesOption(options) {
  return typeof options.modules !== "undefined"
    ? options.modules
    : DEFAULT_MODULES_OPTION;
}

function getReactRuntimeOption(options) {
  return options.reactRuntime || DEFAULT_REACT_RUNTIME;
}

function getTargetsOption(options) {
  return options.targets;
}

function getTransformRuntimeOption(options) {
  return typeof options.transformRuntime === "boolean"
    ? options.transformRuntime
    : DEFAULT_TRANSFORM_RUNTIME;
}

/**
 * @external Babel
 * @see Babel Documentation: {@link https://babeljs.io/}.
 */
/**
 * @typedef
 * @name BabelAPI
 * @memberof external:Babel
 * @see {@link https://babeljs.io/docs/en/config-files#config-function-api|BabelAPI}
 * @see {@link https://github.com/babel/babel/tree/main/packages/babel-helper-plugin-utils|@babel/helper-plugin-utils}
 */
/**
 * @typedef
 * @name PluginObj
 * @memberof external:Babel
 * @see {@link https://babeljs.io/docs/en/presets|PluginObj}
 */

/**
 * @module @asos/babel-preset-asos
 * @description Shared {@link https://babeljs.io/|Babel} preset for transforming your JavaScript the ASOS way.
 */

/**
 * @function generatePreset
 * @description Generates the ASOS Babel preset. Expects a minimum Babel version of <code>^7.0.0</code>.
 * @memberof module:@asos/babel-preset-asos
 * @param {external:Babel.BabelAPI} api An object that exposes everything Babel itself exposes from its index module, along with config-file specific APIs
 * @param {Object} [options] ASOS Babel config options.
 * @param {string|Object|false} [options.corejs] corejs version string or object to use for injected polyfills. See {@link https://babeljs.io/docs/en/babel-preset-env#corejs|<code>@babel/preset-env#corejs</code>}. Additionally also accept the value of `false`, in which case polyfills / corejs will not be added. Default <code>"3.22"</code>.
 * @param {boolean} [options.development] Toggles behaviour specific to development. Defaults to honouring the <code>NODE_ENV</code> value.
 * @param {string|boolean} [options.modules] Enable transformation of ES module syntax to another module type. Defaults to <code>"auto"</code>. See {@link https://babeljs.io/docs/en/babel-preset-env#modules|<code>@babel/preset-env#modules</code>}.
 * @param {string} [options.reactRuntime] Toggles which React runtime to use. <code>automatic</code> auto imports the functions that JSX transpiles to. <code>classic</code> does not automatic import anything. See {@link https://babeljs.io/docs/en/babel-preset-react|<code>@babel/preset-react</code>}.
 * @param {string} [options.targets] Describes the environments you support / target for your project. This can either be a {@link https://github.com/browserslist/browserslist|browserslist-compatible} query (with {@link https://babeljs.io/docs/en/babel-preset-env#ineffective-browserslist-queries|caveats}), or an object of minimum environment versions to support. See {@link https://babeljs.io/docs/en/babel-preset-env#targets|<code>@babel/preset-env#targets</code>}.
 * @param {boolean} [options.transformRuntime] Toggles whether {@link https://babeljs.io/docs/en/babel-plugin-transform-runtime|<code>@babel/plugin-transform-runtime</code>} is used to enable the re-use of babel's injected helper code to save on code size.
 * @param {string} [options.useBuiltIns] Configures how polyfills are handled. Can be one of <code>"usage"</code> or <code>"entry"</code> See {@link https://babeljs.io/docs/en/babel-preset-env#usebuiltins|<code>@babel/preset-env#usebuiltins</code>}. Not that if `corejs` is set to `false` this option will not be considered and polyfills / corejs will not be added. Default <code>"usage"</code>.
 * @returns {external:Babel.PluginObj} ASOS Babel preset.
 */
module.exports = declare((api, options) => {
  api.assertVersion(MINIMUM_BABEL_VERSION);

  const corejsOptions = getCorejsOptions(options);
  const development = getDevelopmentOption(api, options);
  const modules = getModulesOption(options);
  const reactRuntime = getReactRuntimeOption(options);
  const targets = getTargetsOption(options);
  const transformRuntime = getTransformRuntimeOption(options);

  return {
    plugins: [
      development
        ? null
        : [
            require("babel-plugin-transform-react-remove-prop-types"),
            {
              removeImport: true,
            },
          ],
      transformRuntime ? [require("@babel/plugin-transform-runtime")] : null,
    ].filter(Boolean),
    presets: [
      [
        require("@babel/preset-env"),
        {
          ...corejsOptions,
          modules,
          shippedProposals: true,
          targets,
        },
      ],
      [
        require("@babel/preset-react"),
        {
          development,
          runtime: reactRuntime,
        },
      ],
    ],
  };
});
