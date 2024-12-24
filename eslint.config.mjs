import asosConfig from "./peripheral/eslint-config-asosconfig/index.js";
import globals from "globals";
import jsdoc from "eslint-plugin-jsdoc";
import markdown from "@eslint/markdown";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const scripts = ["*.{js,mjs}", "**/*.{js,mjs}"];
const markDowns = ["*.md", "**/*.md"];

const compat = new FlatCompat({
  baseDirectory: path.dirname(fileURLToPath(import.meta.url))
});

export default [
  ...compat.extends("plugin:workspaces/recommended"),
  ...asosConfig.map((config) => ({
    files: scripts,
    ignores: ["**/docs/**", "**/danger/**"],
    ...config,
    rules: {
      ...config.rules,
      "prettier/prettier": [
        "error",
        {
          trailingComma: "none",
          endOfLine: "auto"
        }
      ]
    }
  })),
  {
    files: scripts,
    ...jsdoc.configs["flat/recommended"],
    rules: {
      "jsdoc/valid-types": "off" // Needed to allow JSDoc external: types (needed for documentation) in "mode:typescript" (needed for types)
    },
    languageOptions: {
      parserOptions: {
        requireConfigFile: false
      }
    }
  },
  {
    files: ["**/eslint.config.mjs"],
    rules: {
      "workspaces/no-relative-imports": "off",
      "workspaces/require-dependency": "off"
    }
  },
  {
    files: markDowns,
    plugins: { markdown },
    language: "markdown/gfm"
  },
  {
    files: ["dangerfile.js"],
    languageOptions: {
      sourceType: "script",
      globals: globals.node
    }
  }
];
