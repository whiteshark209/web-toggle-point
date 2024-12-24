import processVariantFiles from "./processVariantFiles/index.js";
import getVariantFiles from "./getVariantFiles.js";
import processPointCuts from "./index.js";
import fillDefaultOptionalValues from "./fillDefaultOptionalValues.js";

jest.mock("./processVariantFiles/index", () => jest.fn());
jest.mock("./getVariantFiles", () =>
  jest.fn(() => Symbol("test-variant-files"))
);
jest.mock("./fillDefaultOptionalValues", () =>
  jest.fn(() => ({
    variantGlob: Symbol("test-variant-glob"),
    joinPointResolver: Symbol("test-join-point-resolver")
  }))
);

describe("processPointCuts", () => {
  const pointCuts = new Map([
    ["test-key-1", Symbol("test-point-cut")],
    ["test-key-2", Symbol("test-point-cut")],
    ["test-key-3", Symbol("test-point-cut")]
  ]);
  const pointCutsValues = Array.from(pointCuts.values());
  const appRoot = Symbol("test-app-root");
  const fileSystem = Symbol("test-file-system");
  let warnings, joinPointFiles;

  beforeEach(async () => {
    jest.clearAllMocks();
    ({ warnings, joinPointFiles } = await processPointCuts({
      appRoot,
      fileSystem,
      options: { pointCuts }
    }));
  });

  it("should fill in default optional values for each point cut", () => {
    for (const pointCut of pointCutsValues) {
      expect(fillDefaultOptionalValues).toHaveBeenCalledWith(pointCut);
    }
  });

  it("should get variant files for each of the point cuts", () => {
    for (const index of pointCutsValues.keys()) {
      const { variantGlob } =
        fillDefaultOptionalValues.mock.results[index].value;
      expect(getVariantFiles).toHaveBeenCalledWith({
        variantGlob,
        appRoot,
        fileSystem
      });
    }
  });

  it("should process the variant files, and keep a shared record of config files found between each point cut", () => {
    for (const [index, pointCut] of pointCutsValues.entries()) {
      const variantFiles = getVariantFiles.mock.results[index].value;
      const { variantGlob, joinPointResolver } =
        fillDefaultOptionalValues.mock.results[index].value;
      expect(processVariantFiles).toHaveBeenCalledWith({
        variantFiles,
        joinPointFiles,
        pointCut,
        joinPointResolver,
        variantGlob,
        warnings,
        configFiles: expect.any(Map),
        fileSystem,
        appRoot
      });
    }
    expect(
      new Set(
        processVariantFiles.mock.calls.map(([{ configFiles }]) => configFiles)
      ).size
    ).toEqual(1);
  });

  it("should return an array of warnings an a map of join point files", () => {
    expect(warnings).toBeInstanceOf(Array);
    expect(joinPointFiles).toBeInstanceOf(Map);
  });
});
