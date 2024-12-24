import { defineConfig, PlaywrightTestConfig } from "@playwright/test";
import baseConfig from "../../test/automation/base.config";

const THREE_MINUTES = 3 * 60 * 1000;

const config: PlaywrightTestConfig = {
  ...baseConfig,
  testDir: "./src/app/fixtures",
  use: {
    baseURL: "http://localhost:3000/fixtures/"
  },
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    timeout: THREE_MINUTES,
    ...baseConfig.webServer
  }
};

export default defineConfig(config);
