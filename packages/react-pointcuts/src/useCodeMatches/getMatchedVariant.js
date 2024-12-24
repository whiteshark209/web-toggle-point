const getMatchedVariant = ({ matchedFeatures, featuresMap, variantKey }) => {
  for (const [
    feature,
    { [variantKey]: variant, ...variables }
  ] of matchedFeatures) {
    const codeRequest = featuresMap.get(feature)?.get(variant);
    if (codeRequest) {
      return {
        codeRequest,
        variables
      };
    }
  }

  return null;
};

export default getMatchedVariant;
