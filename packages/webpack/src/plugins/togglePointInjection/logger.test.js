import Logger from "./logger";
import { PLUGIN_NAME } from "./constants";

jest.mock("./constants", () => ({
  PLUGIN_NAME: "test-plugin-name"
}));

describe("logger", () => {
  let logger;
  const compilationLogger = { info: jest.fn(), warn: jest.fn() };
  const compilation = { getLogger: jest.fn(() => compilationLogger) };

  beforeEach(() => {
    logger = new Logger(compilation);
  });

  it("should create a compilation logger with the plugin name", () => {
    expect(compilation.getLogger).toHaveBeenCalledWith(PLUGIN_NAME);
  });

  describe("logJoinPoints", () => {
    const pointCut = { name: "test-point-cut" };
    const joinPointName = "test-join-point";
    const variants = ["test-variant-1", "test-variant-2"];
    const joinPointFiles = new Map([
      [
        joinPointName,
        {
          variants,
          pointCut: { name: "test-point-cut" }
        }
      ]
    ]);

    beforeEach(() => {
      logger.logJoinPoints(joinPointFiles);
    });

    it("should log the join points", () => {
      expect(compilationLogger.info).toHaveBeenCalledWith(
        `Identified '${
          pointCut.name
        }' point cut for join point '${joinPointName}' with potential variants:\n${variants.join(
          "\n"
        )}`
      );
    });
  });

  describe("logWarnings", () => {
    const warnings = ["test-warning-1", "test-warning-2"];

    beforeEach(() => {
      logger.logWarnings(warnings);
    });

    it("should log the warnings", () => {
      expect(compilationLogger.warn).toHaveBeenCalledWith(warnings.join("\n"));
    });
  });
});
