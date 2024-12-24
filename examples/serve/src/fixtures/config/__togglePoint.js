import featuresStore from "./__featuresStore.js";

export default (joinPoint, featuresMap) => {
  const site = featuresStore.getFeatures();
  if (featuresMap.has(site)) {
    return featuresMap.get(site).default;
  }
  return joinPoint.default;
};
