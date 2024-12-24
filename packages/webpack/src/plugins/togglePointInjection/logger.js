import { PLUGIN_NAME } from "./constants";

class Logger {
  #logger;

  constructor(compilation) {
    this.#logger = compilation.getLogger(PLUGIN_NAME);
  }

  logJoinPoints(joinPointFiles) {
    for (const [
      joinPoint,
      {
        variants,
        pointCut: { name }
      }
    ] of joinPointFiles.entries()) {
      this.#logger.info(
        `Identified '${name}' point cut for join point '${joinPoint}' with potential variants:\n${variants.join(
          "\n"
        )}`
      );
    }
  }

  logWarnings(warnings) {
    if (warnings.length) {
      this.#logger.warn(warnings.join("\n"));
    }
  }
}

export default Logger;
