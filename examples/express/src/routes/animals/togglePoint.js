import featuresStore from "./featuresStore.js";

const cache = new WeakMap();

export default (_, featuresMap) => {
  return function (...args) {
    const { default: Choice } = featuresMap.get(
      `v${featuresStore.getFeatures().version}`
    );
    if (!cache.has(Choice)) {
      cache.set(
        Choice,
        new Proxy(Choice, {
          construct(target, args) {
            return Reflect.construct(target, args, Choice);
          },
          get(...args) {
            console.log("Fetching image url...");
            return Reflect.get(...args);
          }
        })
      );
    }
    const ProxiedFetcher = cache.get(Choice);
    return new ProxiedFetcher(...args);
  };
};
