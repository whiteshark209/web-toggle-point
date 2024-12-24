import importPlugin from "eslint-plugin-import";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-plugin-prettier/recommended";
import babelParser from "@babel/eslint-parser";

export default [
  {
    ...js.configs.recommended
  },
  {
    ...importPlugin.flatConfigs.recommended
  },
  {
    ...eslintConfigPrettier
  },
  {
    name: "asosconfig",
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: babelParser
    },
    rules: {
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/*.config.js",
            "**/*.test.js",
            "**/*.spec.js",
            "**/bin/**",
            "**/src/**"
          ]
        }
      ],
      "no-underscore-dangle": [
        "error",
        {
          allow: ["__data"]
        }
      ],
      "no-console": "warn",
      "import/prefer-default-export": "off",
      "import/no-named-as-default": "off",
      "@stylistic/js/linebreak-style": "off",
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto"
        }
      ],
      complexity: ["error", { max: 5 }],
      "import/unambiguous": "off",
      "prefer-const": "error",
      "no-var": "error"
    }
  }
];
