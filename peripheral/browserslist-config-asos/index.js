/**
 * @external Browserslist
 * @see Browserslist Documentation: {@link https://github.com/browserslist/browserslist}.
 */
/**
 * @typedef
 * @name Query
 * @memberof external:Browserslist
 * @see {@link https://github.com/browserslist/browserslist#queries|Query}
 */

/**
 * @module browserslist-config-asos
 * @description Shared {@link https://github.com/browserslist/browserslist|Browserslist} config for transforming your JavaScript the ASOS way.
 */

/**
 * @constant {Array<external:Browserslist.Query>} config ASOS Browserslist config.
 */
module.exports = [
  // iOS Safari 13+
  "iOS >= 13",
  // MacOS Safari 13+
  "Safari >= 13",
  // Chrome Latest and Latest-1, and Yandex Latest
  "last 2 Chrome versions",
  // Mobile Chrome Latest and Latest-1
  "last 2 ChromeAndroid versions",
  // Firefox Latest
  "last 1 Firefox version",
  // Samsung Latest
  "last 1 Samsung version",
  // Edge Chromium Latest
  "last 1 Edge version"
];
