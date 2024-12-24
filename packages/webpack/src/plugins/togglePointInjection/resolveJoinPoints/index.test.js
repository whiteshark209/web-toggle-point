import { PLUGIN_NAME } from "../constants";
import handleJoinPointMatch from "./handleJoinPointMatch";
import { sep, join } from "path";
import resolvePointCuts from ".";

jest.mock("../constants", () => ({
  PLUGIN_NAME: "test-plugin-name"
}));
jest.mock("./handleJoinPointMatch", () => jest.fn());

describe("resolveJoinPoints", () => {
  let mockResolvedResource;
  const mockResolve = jest.fn(
    (context, lookupStartPath, request, resolveContext, callback) =>
      callback(null, mockResolvedResource)
  );
  const compilation = {
    resolverFactory: {
      get: jest.fn(() => ({
        resolve: mockResolve
      }))
    }
  };
  const normalModuleFactory = {
    hooks: {
      beforeResolve: {
        tapPromise: jest.fn()
      }
    }
  };
  const appRoot = "/test-app-root";

  const makeCommonAssertions = () => {
    it("should get a resolver for normal modules", () => {
      expect(compilation.resolverFactory.get).toHaveBeenCalledWith("normal", {
        dependencyType: "esm"
      });
    });

    it("should tap into the beforeResolve event, indicating the plugin name", () => {
      expect(
        normalModuleFactory.hooks.beforeResolve.tapPromise
      ).toHaveBeenCalledWith(PLUGIN_NAME, expect.any(Function));
    });
  };

  describe("when there are no join points previously identified", () => {
    const joinPointFiles = new Map();

    beforeEach(() => {
      resolvePointCuts({
        compilation,
        appRoot,
        normalModuleFactory,
        joinPointFiles
      });
    });

    makeCommonAssertions();

    describe("when the beforeResolve event is triggered", () => {
      let beforeResolveCallback;

      beforeEach(() => {
        [, beforeResolveCallback] =
          normalModuleFactory.hooks.beforeResolve.tapPromise.mock.lastCall;
        handleJoinPointMatch.mockClear();
        beforeResolveCallback();
      });

      it("should not try to handle a match", () => {
        expect(handleJoinPointMatch).not.toHaveBeenCalled();
      });
    });
  });

  describe("when there are some join points previously identified", () => {
    const joinPointFile = "/test-folder/test-join-point-file";
    beforeEach(() => {
      resolvePointCuts({
        compilation,
        appRoot,
        normalModuleFactory,
        joinPointFiles: new Map([[joinPointFile, Symbol("test-value")]])
      });
    });

    makeCommonAssertions();

    describe("when the beforeResolve event is triggered", () => {
      let beforeResolveCallback, resolveData;

      beforeEach(() => {
        [, beforeResolveCallback] =
          normalModuleFactory.hooks.beforeResolve.tapPromise.mock.lastCall;
      });

      describe("and the request is for a file outside the app root", () => {
        beforeEach(() => {
          resolveData = {
            context: "test-foreign-context",
            request: "./test-request"
          };
          beforeResolveCallback(resolveData);
        });

        it("should not try to handle a match", () => {
          expect(handleJoinPointMatch).not.toHaveBeenCalled();
        });
      });

      describe("and the request is for a file with a webpack loader", () => {
        beforeEach(() => {
          resolveData = {
            context: appRoot.replaceAll("/", sep),
            request: "test-loader!test-request"
          };
          beforeResolveCallback(resolveData);
        });

        it("should not try to handle a match", () => {
          expect(handleJoinPointMatch).not.toHaveBeenCalled();
        });
      });

      describe("and the request is for a module rather than a file", () => {
        beforeEach(() => {
          resolveData = {
            context: appRoot.replaceAll("/", sep),
            request: "test-request"
          };
          beforeResolveCallback(resolveData);
        });

        it("should not try to handle a match", () => {
          expect(handleJoinPointMatch).not.toHaveBeenCalled();
        });
      });

      describe("and the request is for a file within the app root, without any loaders", () => {
        beforeEach(() => {
          resolveData = {
            context: appRoot.replaceAll("/", sep),
            request: "/test-request"
          };
        });

        const makeCommonAssertions = () => {
          it("should resolve the request to a module file", () => {
            expect(mockResolve).toHaveBeenCalledWith(
              {},
              resolveData.context,
              resolveData.request,
              {},
              expect.any(Function)
            );
          });
        };

        describe("and the file is not a join point", () => {
          beforeEach(() => {
            mockResolvedResource = join(appRoot, "some-other-file");
            beforeResolveCallback(resolveData);
          });

          makeCommonAssertions();

          it("should not try to handle a match", () => {
            expect(handleJoinPointMatch).not.toHaveBeenCalled();
          });
        });

        describe("and the file is a join point", () => {
          beforeEach(() => {
            mockResolvedResource = join(appRoot, joinPointFile);
            handleJoinPointMatch.mockClear();
            beforeResolveCallback(resolveData);
          });

          makeCommonAssertions();

          it("should handle the match", () => {
            expect(handleJoinPointMatch).toHaveBeenCalledWith({
              resource: joinPointFile,
              compilation,
              resolveData
            });
          });
        });
      });
    });
  });
});
