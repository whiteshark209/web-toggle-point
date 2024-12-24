import processPointCuts from "./processPointCuts/index.js";
import Logger from "./logger.js";
import { PLUGIN_NAME } from "./constants.js";
import resolveJoinPoints from "./resolveJoinPoints/index.js";
import setupSchemeModules from "./setupSchemeModules/index.js";
import TogglePointInjection from "./index.js";
import webpack from "webpack";
import { validate } from "schema-utils";
import schema from "./schema.json";

jest.mock("./logger.js", () =>
  jest.fn(function () {
    this.logWarnings = jest.fn();
    this.logJoinPoints = jest.fn();
  })
);
jest.mock("./constants", () => ({
  PLUGIN_NAME: "test-plugin-name"
}));
jest.mock("./processPointCuts/index.js", () => jest.fn());
jest.mock("./resolveJoinPoints/index.js", () => jest.fn());
jest.mock("./setupSchemeModules/index.js", () => jest.fn());
jest.mock("webpack", () => ({ NormalModule: Symbol("test-normal-module") }));
jest.mock("schema-utils", () => ({ validate: jest.fn() }));
jest.mock("./schema.json", () => Symbol("test-json"));

describe("togglePointInjection", () => {
  let togglePointInjection, compiler, options;
  const pointCuts = [{ name: "test-name", togglePointModule: "test-module" }];

  beforeEach(() => {
    jest.clearAllMocks();
    compiler = {
      context: "test-context",
      inputFileSystem: Symbol("test-input-file-system"),
      hooks: {
        beforeCompile: { tapPromise: jest.fn() },
        compilation: { tap: jest.fn() }
      }
    };
  });

  const makeCommonAssertions = (NormalModule) => {
    it("should validate the supplied options", () => {
      expect(validate).toHaveBeenCalledWith(
        schema,
        options,
        expect.objectContaining({ name: PLUGIN_NAME, baseDataPath: "options" })
      );
    });

    it("should tap into the beforeCompile event, indicating the plugin name", () => {
      expect(compiler.hooks.beforeCompile.tapPromise).toHaveBeenCalledWith(
        PLUGIN_NAME,
        expect.any(Function)
      );
    });

    it("should tap into the compilation event, indicating the plugin name", () => {
      expect(compiler.hooks.compilation.tap).toHaveBeenCalledWith(
        PLUGIN_NAME,
        expect.any(Function)
      );
    });

    describe("when the beforeCompile event is triggered", () => {
      let beforeCompileCallback, resolve, result;
      const warnings = Symbol("test-warnings");
      const compilation = Symbol("test-compilation");
      const normalModuleFactory = Symbol("test-normal-module-factory");

      beforeEach(() => {
        processPointCuts.mockReturnValue(
          new Promise((res) => {
            resolve = res;
          })
        );
        [, beforeCompileCallback] =
          compiler.hooks.beforeCompile.tapPromise.mock.lastCall;
        result = beforeCompileCallback();
      });

      it("should process the supplied point cuts, returning only when processed", () => {
        expect(processPointCuts).toHaveBeenCalledWith({
          appRoot: compiler.context,
          fileSystem: compiler.inputFileSystem,
          options: togglePointInjection.options
        });
      });

      const makeCommonAssertions = () => {
        it("should create a logger for the compilation", () => {
          expect(Logger).toHaveBeenCalledWith(compilation);
        });

        it("should log any warnings", () => {
          expect(Logger.mock.instances[0].logWarnings).toHaveBeenCalledWith(
            warnings
          );
        });
      };

      describe("when the point cuts are processed, and some are found", () => {
        const joinPointFiles = new Set([Symbol("test-join-point-file")]);

        beforeEach(async () => {
          resolve({ joinPointFiles, warnings });
          await result;
        });

        describe("when the compilation event is triggered", () => {
          beforeEach(() => {
            const [, compilationCallback] =
              compiler.hooks.compilation.tap.mock.lastCall;
            compilationCallback(compilation, { normalModuleFactory });
          });

          makeCommonAssertions();

          it("should log the join points", () => {
            expect(Logger.mock.instances[0].logJoinPoints).toHaveBeenCalledWith(
              joinPointFiles
            );
          });

          it("should set up scheme modules", () => {
            expect(setupSchemeModules).toHaveBeenCalledWith({
              NormalModule,
              compilation,
              joinPointFiles,
              pointCuts
            });
          });

          it("should resolve the join points", () => {
            expect(resolveJoinPoints).toHaveBeenCalledWith({
              compilation,
              appRoot: compiler.context,
              normalModuleFactory,
              joinPointFiles
            });
          });
        });
      });

      describe("when the point cuts are processed, and none are found", () => {
        beforeEach(async () => {
          resolve({ joinPointFiles: [], warnings });
          await result;
        });

        describe("when the compilation event is triggered", () => {
          beforeEach(() => {
            const [, compilationCallback] =
              compiler.hooks.compilation.tap.mock.lastCall;
            compilationCallback(compilation, {
              normalModuleFactory
            });
          });

          makeCommonAssertions();
        });
      });
    });
  };

  describe("when a webpackNormalModule option is not supplied", () => {
    beforeEach(() => {
      options = { pointCuts };
      togglePointInjection = new TogglePointInjection(options);
    });

    describe("when applying to a compiler", () => {
      beforeEach(() => {
        togglePointInjection.apply(compiler);
      });

      makeCommonAssertions(webpack.NormalModule);
    });
  });

  describe("when a webpackNormalModule option is supplied (primarily for NextJs users to get around the fact that webpack is pre-bundled)", () => {
    const MockNormalModule = Symbol("test-normal-module");

    beforeEach(() => {
      options = {
        pointCuts,
        webpackNormalModule: async () => MockNormalModule
      };
      togglePointInjection = new TogglePointInjection(options);
    });

    describe("when applying to a compiler", () => {
      beforeEach(() => {
        togglePointInjection.apply(compiler);
      });

      makeCommonAssertions(MockNormalModule);
    });
  });
});
