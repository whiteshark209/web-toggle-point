import asosConfigPlaywright from "../peripheral/eslint-config-asosconfig/playwright.js";
import rootConfig from "../eslint.config.mjs";

export default [
  ...rootConfig,
  ...asosConfigPlaywright.map((config) => ({
    files: ["**/playwright.spec.{ts,js}"],
    ...config,
    languageOptions: {
      parserOptions: {
        requireConfigFile: false
      }
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          trailingComma: "none",
          endOfLine: "auto"
        }
      ]
    }
  }))
];
