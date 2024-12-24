import examplesConfig from "../eslint.config.mjs";
import asosConfigBrowser from "../../peripheral/eslint-config-asosconfig/browser.js";

export default [
  ...asosConfigBrowser.map((config) => ({
    files: ["**/*.js"],
    ...config
  })),
  ...examplesConfig
];
