import { basename, posix } from "path";
import getToggleHandlerPath from "../../getToggleHandlerPath.js";

export default {
  name: "audience",
  togglePointModule: "/src/fixtures/audience/__togglePoint.js",
  variantGlob: "./src/fixtures/audience/**/cohort-[1-9]*([0-9])/*.js",
  toggleHandler: getToggleHandlerPath("singlePathSegment.js"),
  joinPointResolver: (path) =>
    posix.resolve(path, "../..", basename(path).replace("bespoke", "control"))
};
