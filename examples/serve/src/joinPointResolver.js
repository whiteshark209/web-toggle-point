import { posix } from "path";
const { resolve, basename } = posix;

const joinPointResolver = (variantPath) =>
  resolve(variantPath, "../../..", basename(variantPath));

export default joinPointResolver;
