import { SCHEME, JOIN_POINTS } from "../../constants";
import getIssuerModule from "./getIssuerModule";
import resourceProxyExistsInRequestChain from "./resourceProxyExistsInRequestChain";

const handleJoinPointMatch = ({ resource, compilation, resolveData }) => {
  const proxyResource = `${SCHEME}:${JOIN_POINTS}:${resource}`;
  const issuerModule = getIssuerModule({
    compilation,
    resolveData
  });
  if (issuerModule) {
    const { moduleGraph } = compilation;
    if (
      resourceProxyExistsInRequestChain({
        moduleGraph,
        issuerModule,
        proxyResource
      })
    ) {
      return;
    }
  }

  resolveData.request = proxyResource;
};

export default handleJoinPointMatch;
