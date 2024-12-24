import { withTogglePointFactory } from "@asos/web-toggle-point-react-pointcuts";
import featuresStore from "./featuresStore.js";

const { getFeatures: getActiveFeatures } = featuresStore;

const withTogglePoint = withTogglePointFactory({
  getActiveFeatures,
  variantKey: "size",
  logError: console.log
});

export default withTogglePoint;
