export default {
  name: "keep-external-comments",
  transform(_, id) {
    if (id.endsWith("external.js")) {
      return { moduleSideEffects: "no-treeshake" };
    }
  }
};
