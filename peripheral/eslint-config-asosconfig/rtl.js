import testingLibrary from "eslint-plugin-testing-library";
import react from "./react.js";
import { fixupPluginRules } from "@eslint/compat";

export default [
  ...react,
  {
    name: "asosconfig/rtl",
    settings: {
      react: {
        version: "detect"
      }
    },
    plugins: {
      "testing-library": fixupPluginRules({
        rules: testingLibrary.rules
      })
    },
    rules: {
      ...testingLibrary.configs["flat/react"].rules,
      "testing-library/no-container": "off",
      "testing-library/no-node-access": "off",
      "testing-library/no-render-in-setup": "off"
    }
  }
];
