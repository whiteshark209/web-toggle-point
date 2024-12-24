module.exports = {
  plugins: ["jsdoc-tsimport-plugin"],
  opts: {
    encoding: "utf8",
    destination: "docs/html",
    recurse: true,
    verbose: true,
    readme: "./docs/README.md"
  },
  templates: {
    default: {
      outputSourceFiles: false
    }
  }
};
