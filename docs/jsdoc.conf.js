const baseConfig = require("../jsdoc.conf");

module.exports = {
  ...baseConfig,
  plugins: [...baseConfig.plugins, "./dedupeExternalJsdocPlugin.js"]
};
