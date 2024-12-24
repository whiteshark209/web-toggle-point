import asosConfigJest from "../peripheral/eslint-config-asosconfig/jest.js";
import rootConfig from "../eslint.config.mjs";
import globals from "globals";

export default [
  ...asosConfigJest,
  ...rootConfig,
  {
    files: ["docs/**/*.js"],
    rules: {
      "prettier/prettier": "off"
    }
  },
  {
    files: ["**/*.test.js"],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ["src/**/*.test.*", "build/**/*.js", "**/rollup.mjs"],
    ignores: ["**/*.snap"],
    rules: {
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: true
        }
      ]
    }
  }
];
