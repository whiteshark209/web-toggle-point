import { ssrBackedReactContextFeaturesStoreFactory as featuresStoreFactory } from "@asos/web-toggle-point-features";

const featuresStore = featuresStoreFactory({
  name: "config",
  logWarning: console.log
});

export default featuresStore;
