import handleJoinPointMatch from ".";
import { SCHEME, JOIN_POINTS } from "../../constants";
import getIssuerModule from "./getIssuerModule";
import resourceProxyExistsInRequestChain from "./resourceProxyExistsInRequestChain";

jest.mock("./getIssuerModule", () => jest.fn());
jest.mock("./resourceProxyExistsInRequestChain", () => jest.fn());
jest.mock("../../constants", () => ({
  SCHEME: "test-scheme",
  JOIN_POINTS: "test-join-points"
}));

describe("handleJoinPointMatch", () => {
  const resource = "test-resource";
  const compilation = {
    moduleGraph: Symbol("test-module-graph")
  };
  const mockOriginalRequest = Symbol("test-original-request");
  let resolveData;

  beforeEach(() => {
    jest.clearAllMocks();
    resolveData = {
      request: mockOriginalRequest
    };
  });

  const makeCommonAssertions = () => {
    it("should get the module that issued the module request in the resolve data", () => {
      expect(getIssuerModule).toHaveBeenCalledWith({
        compilation,
        resolveData
      });
    });
  };

  describe("when the resource has an issuer module", () => {
    const mockIssuerModule = Symbol("test-module");
    beforeEach(() => {
      getIssuerModule.mockReturnValue(mockIssuerModule);
    });

    const makeHasIssuerModuleAssertions = () => {
      it("should check if a resource proxy exists in the request chain of the resource being requested", () => {
        expect(resourceProxyExistsInRequestChain).toHaveBeenCalledWith({
          moduleGraph: compilation.moduleGraph,
          issuerModule: mockIssuerModule,
          proxyResource: `${SCHEME}:${JOIN_POINTS}:${resource}`
        });
      });
    };

    describe("and the resource does not have a proxy (of this resource) in its ancestor dependency chain", () => {
      beforeEach(() => {
        resourceProxyExistsInRequestChain.mockReturnValue(false);
        handleJoinPointMatch({ resource, compilation, resolveData });
      });

      makeCommonAssertions();
      makeHasIssuerModuleAssertions();

      it("should redirect the request to a proxy", () => {
        expect(resolveData.request).toBe(
          `${SCHEME}:${JOIN_POINTS}:${resource}`
        );
      });
    });

    describe("and the resource already has a proxy (of this resource) in its ancestor dependency chain", () => {
      beforeEach(() => {
        resourceProxyExistsInRequestChain.mockReturnValue(true);
        handleJoinPointMatch({ resource, compilation, resolveData });
      });

      makeCommonAssertions();
      makeHasIssuerModuleAssertions();

      it("should not redirect the request to a proxy, leaving the original request on the resolve data", () => {
        expect(resolveData.request).toBe(mockOriginalRequest);
      });
    });
  });

  describe("when the resource has a null issuer module (i.e. it is a root module, or is a varied context module itself)", () => {
    beforeEach(() => {
      getIssuerModule.mockReturnValue(null);
      handleJoinPointMatch({ resource, compilation, resolveData });
    });

    it("should not check if a resource proxy exists in the request chain of the resource being requested", () => {
      expect(resourceProxyExistsInRequestChain).not.toHaveBeenCalled();
    });

    it("should redirect the request to a proxy", () => {
      expect(resolveData.request).toBe(`${SCHEME}:${JOIN_POINTS}:${resource}`);
    });
  });
});
