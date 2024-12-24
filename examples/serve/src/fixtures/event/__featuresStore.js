import { globalFeaturesStoreFactory as featuresStoreFactory } from "@asos/web-toggle-point-features";

const featuresStore = featuresStoreFactory();

const getEvent = () => {
  const dateString = new Intl.DateTimeFormat("en-GB").format(new Date());
  if (dateString.slice(0, 5) === "31/10") {
    return "halloween";
  }
  if (dateString.slice(0, 5) === "17/03") {
    return "st-patrick's-day";
  }
  if (dateString === "05/07/2025") {
    return "pride";
  }
};

featuresStore.useValue({ value: getEvent() });

export default featuresStore;
