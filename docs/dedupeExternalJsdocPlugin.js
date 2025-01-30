exports.defineTags = function (dictionary) {
  const seen = new Map();
  const patched = dictionary.lookUp("external");

  dictionary
    .defineTag("external-patched", {
      ...patched,
      onTagged: (doclet, tag) => {
        const {
          value: { description }
        } = tag;
        if (!seen.has(description)) {
          seen.set(description, true);
          patched.onTagged(doclet, tag);
        }
      }
    })
    .synonym("external");
};

const seen = new Map();
exports.handlers = {
  jsdocCommentFound: function (e) {
    if (e.filename.endsWith("external.js")) {
      const match = e.comment.match(/(?:[\s\S]*@typedef \{.+\} (?<typedef>.+))?[\s\S]+external:(?<external>\S+)/);
      if (match) {
        const symbol = match.groups.typedef || match.groups.external;
        if (!seen.has(symbol)) {
          seen.set(symbol, true);
        } else {
          e.comment = "/**/";
        }
      }
    }
  }
};
