import {
  TestType,
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions
} from "@playwright/test";

import { Experiments, Decision } from "./experiments";

const setExperimentHeaders = (
  test: TestType<
    PlaywrightTestArgs & PlaywrightTestOptions,
    PlaywrightWorkerArgs & PlaywrightWorkerOptions
  >,
  decisions: {
    [feature: string]: Decision;
  } = { ["test-feature"]: { bucket: "test-variant" } },
  audience = "test-audience"
) => {
  const experiments: Experiments = {
    decisions,
    audience
  };

  test.use({
    extraHTTPHeaders: {
      experiments: JSON.stringify(experiments)
    }
  });

  return { decisions, audience };
};

export default setExperimentHeaders;
