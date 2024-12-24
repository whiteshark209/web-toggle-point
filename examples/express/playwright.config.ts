import { defineConfig, PlaywrightTestConfig } from "@playwright/test";
import baseConfig from "../../test/automation/base.config";

const config: PlaywrightTestConfig = {
  ...baseConfig,
  webServer: [
    {
      command: "npm run start",
      port: 3002,
      ...baseConfig.webServer
    },
    {
      command: "npm run start:small-env",
      port: 3003,
      ...baseConfig.webServer
    },
    {
      command: "npm run start:large-env",
      port: 3004,
      ...baseConfig.webServer
    }
  ]
};

export default defineConfig(config);
