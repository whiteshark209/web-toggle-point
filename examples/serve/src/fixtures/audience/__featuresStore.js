import { globalFeaturesStoreFactory as featuresStoreFactory } from "@asos/web-toggle-point-features";

const featuresStore = featuresStoreFactory();

const [, audience] = document.cookie.match(/audience=(.+?)(;|$)/) || [];

featuresStore.useValue({ value: audience });

export default featuresStore;
