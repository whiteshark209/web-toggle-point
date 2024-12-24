import joinPointResolver from "../../joinPointResolver.js";

export default {
  name: "translation",
  togglePointModule: "/src/fixtures/translation/__togglePoint.js",
  variantGlob: "./src/fixtures/translation/languages/*/*.json",
  joinPointResolver
};
