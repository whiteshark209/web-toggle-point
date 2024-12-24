import browser from "./browser.js";
import reactPlugin from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import { fixupPluginRules } from "@eslint/compat";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  ...browser,
  {
    ...reactPlugin.configs.flat.recommended
  },
  {
    ...reactPlugin.configs.flat["jsx-runtime"]
  },
  {
    ...jsxA11y.flatConfigs.recommended
  },
  {
    name: "asosconfig/react",
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      "react-hooks": fixupPluginRules(reactHooks)
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/label-has-for": [
        2,
        {
          required: {
            every: ["id"]
          }
        }
      ]
    }
  }
];
