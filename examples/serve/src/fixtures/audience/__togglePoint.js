import featuresStore from "./__featuresStore.js";

export default (joinPoint, featuresMap) => {
  const audience = featuresStore.getFeatures();
  if (audience && featuresMap.has(audience)) {
    return featuresMap.get(audience).default;
  }
  return joinPoint.default;
};
