import getToggleHandlerPath from "../../getToggleHandlerPath.js";
import joinPointResolver from "../../joinPointResolver.js";

export default {
  name: "configuration",
  togglePointModule: "/src/fixtures/config/__togglePoint.js",
  variantGlob: "./src/fixtures/config/**/sites/*/*.js",
  toggleHandler: getToggleHandlerPath("listExtractionFromPathSegment.js"),
  joinPointResolver
};
