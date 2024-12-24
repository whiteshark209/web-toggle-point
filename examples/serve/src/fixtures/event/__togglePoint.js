import featuresStore from "./__featuresStore.js";

export default (joinPoint, featuresMap) => {
  const event = featuresStore.getFeatures();
  if (featuresMap.has(event)) {
    return featuresMap.get(event).default;
  }
  return joinPoint;
};
