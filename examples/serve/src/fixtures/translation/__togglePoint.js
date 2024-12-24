import featuresStore from "./__featuresStore.js";

export default (joinPoint, featuresMap) => {
  const language = featuresStore.getFeatures();
  if (featuresMap.has(language)) {
    return featuresMap.get(language);
  }
  return joinPoint;
};
