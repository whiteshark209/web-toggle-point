/**
 * Code expected in the host application
 * @external HostApplication
 */
/**
 * A factory for SDKs; should return an instance of asos-web-features when called with "features"
 * @callback external:HostApplication.sdkInstanceProvider
 * @async
 * @type {Function}
 * @param {string} sdkName Name of the SDK to access; will be passed "features"
 * @returns {external:asos-web-features}
 * @see SiteChrome SDK interface {@link https://asoscom.atlassian.net/wiki/spaces/WEB/pages/593592455/SCP+-+Interface+Definition#SDK-Instances|SDK Instances}
 * @example
 * const sdkInstance = await sdkInstanceProvider("features");
 */
/**
 * A delegate passed to log a warning
 * @callback external:HostApplication.logWarning
 * @type {Function}
 * @param {string} message A message to log as a warning
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
