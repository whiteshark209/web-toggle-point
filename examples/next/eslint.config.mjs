import examplesConfig from "../eslint.config.mjs";
import asosConfigReact from "../../peripheral/eslint-config-asosconfig/react.js";
import pluginNext from "@next/eslint-plugin-next";
import parser from "@typescript-eslint/parser";
import * as mdx from "eslint-plugin-mdx";

const scripts = ["**/*.{js,mjs,cjs,ts,jsx,tsx}"];

export default [
  ...asosConfigReact.map((config) => ({
    files: scripts,
    ...config,
    rules: {
      "prettier/prettier": [
        "error",
        {
          trailingComma: "none",
          endOfLine: "auto"
        }
      ]
    }
  })),
  ...examplesConfig,
  {
    files: ["**/*.mdx"],
    ...mdx.flat
  },
  {
    files: scripts,
    rules: {
      ...pluginNext.configs.recommended.rules,
      "no-console": "off",
      "react/react-in-jsx-scope": "off"
    },
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      "@next/next": pluginNext
    },
    settings: {
      "import/resolver": {
        alias: {
          map: [["@/components", "./components/*"]]
        },
        node: {
          extensions: [".js", ".jsx", ".tsx", ".ts"]
        }
      },
      react: {
        version: "detect"
      }
    }
  }
];
