const issuersMap = new WeakMap();

const createNode = () => ({
  resource: Symbol("test-resource")
});

const createGraph = (node, depth, siblingsAtEachDepthCount) => {
  const issuers =
    depth === 0
      ? []
      : Array.from({ length: siblingsAtEachDepthCount }, createNode);
  issuersMap.set(node, issuers);
  issuers.forEach((parent) =>
    createGraph(parent, depth - 1, siblingsAtEachDepthCount)
  );
};

export const createMockGraph = ({ depth, siblingsAtEachDepthCount }) => {
  const rootNode = createNode();
  createGraph(rootNode, depth, siblingsAtEachDepthCount);

  const getIncomingConnections = jest.fn(function* (module) {
    // eslint-disable-next-line jsdoc/require-jsdoc
    function* traverse(node) {
      if (node.resource === module.resource) {
        yield* issuersMap.get(node).map((node) => ({
          originModule: node
        }));
      }
      for (const issuer of issuersMap.get(node)) {
        yield* traverse(issuer);
      }
    }
    yield* traverse(rootNode);
  });

  return { rootNode, getIncomingConnections };
};
