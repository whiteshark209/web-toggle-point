import { defineConfig, PlaywrightTestConfig } from "@playwright/test";
import baseConfig from "../../test/automation/base.config";

const config: PlaywrightTestConfig = {
  ...baseConfig,
  testDir: "./src/fixtures",
  use: {
    baseURL: "http://localhost:3001/"
  },
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3001",
    ...baseConfig.webServer
  }
};

export default defineConfig(config);
