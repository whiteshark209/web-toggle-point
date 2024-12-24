"use client";

import { withTogglePointFactory } from "@asos/web-toggle-point-react-pointcuts";
import featuresStore from "./featuresStore";

const { getFeatures } = featuresStore;
const getActiveFeatures = () => getFeatures().decisions;

const withTogglePoint = withTogglePointFactory({
  getActiveFeatures,
  logError: console.log,
  plugins: [
    {
      onCodeSelected: ({ matchedFeatures }) => {
        if (matchedFeatures?.length) {
          const [[feature]] = matchedFeatures;
          console.log(
            `activated ${feature} with audience ${getFeatures().audience}`
          );
        }
      }
    }
  ]
});

export default withTogglePoint;
