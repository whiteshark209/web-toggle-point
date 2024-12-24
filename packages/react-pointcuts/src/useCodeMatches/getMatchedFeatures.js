const getMatchedFeatures = ({ activeFeatures, featuresMap }) => {
  const matchedFeatures = Object.entries(activeFeatures || {}).filter(([key]) =>
    featuresMap.has(key)
  );

  return matchedFeatures;
};

export default getMatchedFeatures;
