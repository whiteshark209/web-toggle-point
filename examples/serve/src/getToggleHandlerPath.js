import { posix } from "path";

const getToggleHandlerPath = (...paths) =>
  posix.join("/", "src", "toggleHandlers", ...paths);

export default getToggleHandlerPath;
