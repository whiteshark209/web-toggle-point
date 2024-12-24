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

const seenExternals = new Map();
exports.handlers = {
  jsdocCommentFound: function (e) {
    if (e.filename.endsWith("external.js")) {
      const match = e.comment.match(/external:(\S+)/);
      if (match) {
        const [external] = match;
        if (!seenExternals.has(external)) {
          seenExternals.set(external, true);
        } else {
          e.comment = "/**/";
        }
      }
    }
  }
};
