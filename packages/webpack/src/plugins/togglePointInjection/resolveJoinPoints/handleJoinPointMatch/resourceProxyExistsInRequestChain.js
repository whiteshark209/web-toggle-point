const resourceProxyExistsInRequestChain = ({
  moduleGraph,
  issuerModule,
  proxyResource
}) => {
  const queue = [issuerModule];
  while (queue.length) {
    const node = queue.shift();
    if (node.resource === proxyResource) {
      return true;
    }

    const incomingConnections = moduleGraph.getIncomingConnections(node);
    queue.push(
      ...new Set(
        [...incomingConnections]
          .map(({ originModule }) => originModule)
          .filter(Boolean)
      )
    );
  }
  return false;
};

export default resourceProxyExistsInRequestChain;
