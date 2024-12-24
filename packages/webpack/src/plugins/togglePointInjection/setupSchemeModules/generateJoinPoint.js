import { posix } from "path";
import regexgen from "regexgen";
import { POINT_CUTS, SCHEME } from "../constants.js";
const { dirname } = posix;

const generateJoinPoint = ({ joinPointFiles, path }) => {
  const {
    pointCut: { name },
    variants
  } = joinPointFiles.get(path);
  const directory = dirname(path);
  const regex = regexgen(variants);

  return `import pointCut from "${SCHEME}:${POINT_CUTS}:/${name}";
import * as joinPoint from "${path}";
const variants = import.meta.webpackContext("${directory}", { recursive: true, regExp: ${regex} });
export default pointCut({ joinPoint, variants });`;
};

export default generateJoinPoint;
