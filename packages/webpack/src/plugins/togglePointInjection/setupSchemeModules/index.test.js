import { PLUGIN_NAME, POINT_CUTS, JOIN_POINTS, SCHEME } from "../constants.js";
import generateJoinPoint from "./generateJoinPoint.js";
import generatePointCut from "./generatePointCut.js";
import setupSchemeModules from "./index.js";

jest.mock("../constants", () => ({
  PLUGIN_NAME: "test-plugin-name",
  POINT_CUTS: "test-point-cuts",
  JOIN_POINTS: "test-join-points",
  SCHEME: "test-scheme"
}));
jest.mock("./generateJoinPoint", () => jest.fn());
jest.mock("./generatePointCut", () => jest.fn());

describe("setupSchemeModules", () => {
  const tap = jest.fn();
  const compilationHooks = {
    readResource: { for: jest.fn(() => ({ tap })) }
  };
  const NormalModule = {
    getCompilationHooks: jest.fn(() => compilationHooks)
  };
  const compilation = Symbol("test-compilation");
  const joinPointFiles = Symbol("test-join-point-files");
  const pointCuts = Symbol("test-point-cuts");

  beforeEach(() => {
    setupSchemeModules({
      NormalModule,
      compilation,
      joinPointFiles,
      pointCuts
    });
  });

  it("should get the compilation hooks for the NormalModule", () => {
    expect(NormalModule.getCompilationHooks).toHaveBeenCalledWith(compilation);
  });

  it("should tap into the readResource hook for the scheme", () => {
    expect(compilationHooks.readResource.for).toHaveBeenCalledWith(SCHEME);
    expect(tap).toHaveBeenCalledWith(PLUGIN_NAME, expect.any(Function));
  });

  describe("when a resource is read for the scheme", () => {
    let result;

    describe("and the resource is prefixed with the point cuts type", () => {
      const path = "test-point-cut-name";
      const output = Symbol("test-output");

      beforeEach(() => {
        const [, callback] = tap.mock.lastCall;
        generatePointCut.mockReturnValue(output);
        result = callback({ resourcePath: `${SCHEME}:${POINT_CUTS}:${path}` });
      });

      it("should generate the point cut and return the generated module to the read resource hook", () => {
        expect(generatePointCut).toHaveBeenCalledWith({ pointCuts, path });
        expect(result).toBe(output);
      });
    });

    describe("and the resource is prefixed with the join points type", () => {
      const path = "test-path";
      const output = Symbol("test-output");

      beforeEach(() => {
        const [, callback] = tap.mock.lastCall;
        generateJoinPoint.mockReturnValue(output);
        result = callback({ resourcePath: `${SCHEME}:${JOIN_POINTS}:${path}` });
      });

      it("should generate a join point and return the generated module to the read resource hook", () => {
        expect(generateJoinPoint).toHaveBeenCalledWith({
          joinPointFiles,
          path
        });
        expect(result).toBe(output);
      });
    });
  });
});
