import jest from "eslint-plugin-jest";
import globals from "globals";
import jestFormatting from "eslint-plugin-jest-formatting";

export default [
  {
    ...jest.configs["flat/recommended"]
  },
  {
    name: "asosconfig/jest",
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    plugins: {
      jest,
      "jest-formatting": jestFormatting
    },
    rules: {
      "jest/no-identical-title": "warn",
      "jest-formatting/padding-around-test-blocks": "error",
      "jest-formatting/padding-around-describe-blocks": "error"
    }
  }
];
