import { PLUGIN_NAME, POINT_CUTS, JOIN_POINTS, SCHEME } from "../constants.js";
import generateJoinPoint from "./generateJoinPoint.js";
import generatePointCut from "./generatePointCut.js";

const setupSchemeModules = ({
  NormalModule,
  compilation,
  joinPointFiles,
  pointCuts
}) => {
  NormalModule.getCompilationHooks(compilation)
    .readResource.for(SCHEME)
    .tap(PLUGIN_NAME, ({ resourcePath }) => {
      const [, type, path] = resourcePath.split(/:(.*?):(.*)/, 3);
      switch (type) {
        case POINT_CUTS: {
          return generatePointCut({ pointCuts, path });
        }
        case JOIN_POINTS: {
          return generateJoinPoint({ joinPointFiles, path });
        }
      }
    });
};

export default setupSchemeModules;
