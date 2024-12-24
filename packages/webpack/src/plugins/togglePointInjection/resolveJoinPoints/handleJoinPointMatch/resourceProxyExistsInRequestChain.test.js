import resourceProxyExistsInRequestChain from "./resourceProxyExistsInRequestChain";
import { createMockGraph } from "../../../../../test/test-utils";

const moduleGraph = { getIncomingConnections: jest.fn() };
const proxyResource = Symbol("test-proxy-resource");

describe("resourceProxyExistsInRequestChain", () => {
  let result;

  describe("when the issuer module is the proxy resource", () => {
    beforeEach(() => {
      result = resourceProxyExistsInRequestChain({
        moduleGraph,
        issuerModule: {
          resource: proxyResource
        },
        proxyResource
      });
    });

    it("should not attempt to get incoming connections of issuer module", () => {
      expect(moduleGraph.getIncomingConnections).not.toHaveBeenCalled();
    });

    it("should return true", () => {
      expect(result).toBe(true);
    });
  });

  describe("when the issuer module is not the proxy resource", () => {
    const depth = 3;
    const siblingsAtEachDepthCount = 3;
    let moduleGraph, issuerModule;

    beforeEach(() => {
      const { rootNode, getIncomingConnections } = createMockGraph({
        depth,
        siblingsAtEachDepthCount
      });
      moduleGraph = { getIncomingConnections };
      issuerModule = rootNode;
    });

    describe("and one of the modules that directly imported the issuer module is the proxy resource", () => {
      beforeEach(() => {
        const { value: parent } = moduleGraph
          .getIncomingConnections(issuerModule)
          .next();
        parent.originModule.resource = proxyResource;
        moduleGraph.getIncomingConnections.mockClear();

        result = resourceProxyExistsInRequestChain({
          moduleGraph,
          issuerModule,
          proxyResource
        });
      });

      it("should get the incoming connections of issuer module", () => {
        expect(moduleGraph.getIncomingConnections).toHaveBeenCalledWith(
          issuerModule
        );
      });

      it("should return true", () => {
        expect(result).toBe(true);
      });
    });

    describe("and one of the modules that directly imported the issuer module is the not proxy resource", () => {
      describe("and one of the modules that imported the issuer module was imported by the proxy resource", () => {
        let parentIssuerModules;

        const getNextOriginModule = (connections) =>
          connections.next().value.originModule;

        beforeEach(() => {
          const connections = moduleGraph.getIncomingConnections(issuerModule);
          const firstIssuerModule = getNextOriginModule(connections);
          const secondIssuerModule = getNextOriginModule(connections);
          parentIssuerModules = [firstIssuerModule, secondIssuerModule];

          const grandParentModule = getNextOriginModule(
            moduleGraph.getIncomingConnections(secondIssuerModule)
          );
          grandParentModule.resource = proxyResource;
          moduleGraph.getIncomingConnections.mockClear();

          result = resourceProxyExistsInRequestChain({
            moduleGraph,
            issuerModule,
            proxyResource
          });
        });

        it("should get the incoming connections of issuer module", () => {
          expect(moduleGraph.getIncomingConnections).toHaveBeenNthCalledWith(
            1,
            issuerModule
          );
        });

        it("should get the incoming connections of the modules that directly imported the issuer module, that were not the proxy, using a breadth-first search (hence assuming colocation)", () => {
          for (const [
            index,
            parentIssuerModule
          ] of parentIssuerModules.entries()) {
            expect(moduleGraph.getIncomingConnections).toHaveBeenNthCalledWith(
              index + 2,
              parentIssuerModule
            );
          }
        });

        it("should return true", () => {
          expect(result).toBe(true);
        });
      });

      describe("and one of the modules that imported the issuer module was not imported by the proxy resource", () => {
        let calls;

        beforeEach(() => {
          result = resourceProxyExistsInRequestChain({
            moduleGraph,
            issuerModule,
            proxyResource
          });

          calls = moduleGraph.getIncomingConnections.mock.calls;
        });

        it("should have traversed the whole import tree of the issuer module", () => {
          let expectedCount = 1;
          for (let level = 1; level <= depth; level++) {
            expectedCount += Math.pow(siblingsAtEachDepthCount, level);
          }
          expect(calls.length).toEqual(expectedCount);
        });

        it("should return false", () => {
          expect(result).toBe(false);
        });
      });
    });
  });
});
