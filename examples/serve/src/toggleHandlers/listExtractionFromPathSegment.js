export default ({ togglePoint, joinPoint, variants }) => {
  const featuresMap = variants.keys().reduce((map, key) => {
    const [, , value] = key.split("/");
    const list = value.split(",");
    for (const value of list) {
      map.set(value, variants(key));
    }
    return map;
  }, new Map());
  return togglePoint(joinPoint, featuresMap);
};
