const getIssuerModule = ({
  compilation: { modules },
  resolveData: {
    contextInfo: { issuer }
  }
}) => {
  for (const module of modules) {
    if (module.resource === issuer) {
      return module;
    }
  }
};

export default getIssuerModule;
