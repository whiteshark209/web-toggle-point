const baseConfig = require("../jsdoc.conf");

module.exports = {
  ...baseConfig,
  source: {
    include: ["./src"]
  },
  opts: {
    ...baseConfig.opts,
    private: true
  },
  templates: {
    ...baseConfig.templates,
    default: {
      ...baseConfig.templates.default,
      staticFiles: {
        include: ["../../docs/mermaidJsdoc.js"]
      }
    }
  }
};
