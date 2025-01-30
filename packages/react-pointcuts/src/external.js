/**
 * Code expected in the host application
 * @external HostApplication
 */
/**
 * A delegate passed to log an error
 * @callback external:HostApplication.logError
 * @type {Function}
 * @param {string} message A message to log as an error
 */

/**
 * React UI library
 * @external React
 * @see {@link https://reactjs.org/|React}
 */
/**
 * @typedef {import("react").Component} Component
 * @memberof external:React
 * @see {@link https://reactjs.org/docs/react-component.html|React.Component}
 */
/**
 * @typedef {Function} Hook
 * @memberof external:React
 * @see {@link https://reactjs.org/docs/hooks-overview.html|React.Hook}
 */
/**
 * @typedef {import("react").Context} Context
 * @memberof external:React
 * @see {@link https://reactjs.org/docs/context.html|context object}
 */
/**
 * A {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import#module_namespace_object|module namespace object} that exports a {@link external:React.Component|React Component} as its default export
 * @typedef {object} ReactComponentModuleNamespaceObject
 * @property {external:React.Component} default - The default export of the module, which should be a {@link external:React.Component|React Component}.
 */
/**
 * A {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import#module_namespace_object|module namespace object} that exports a function as its default export, that can be a {@link external:React.Hook|React hook}
 * @typedef {object} ReactHookModuleNamespaceObject
 * @property {external:React.Hook} default - The default export of the module, typically a {@link external:React.Hook|React hook}.
 */
