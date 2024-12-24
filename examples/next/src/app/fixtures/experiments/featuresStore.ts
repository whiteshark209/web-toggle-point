"use client";

import { reactContextFeaturesStoreFactory as featuresStoreFactory } from "@asos/web-toggle-point-features";

const reactContextStore = featuresStoreFactory({
  name: "Experiments"
});

export default reactContextStore;
