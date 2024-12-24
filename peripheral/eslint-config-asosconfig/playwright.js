import globals from "globals";
import playwright from "eslint-plugin-playwright";
import index from "./index.js";

export default [
  ...index,
  {
    ...playwright.configs["flat/recommended"]
  },
  {
    name: "asosconfig/playwright",
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        page: "readonly",
        browser: "readonly"
      }
    },
    rules: {
      "playwright/missing-playwright-await": ["error"],
      "playwright/no-page-pause": ["error"]
    }
  }
];
