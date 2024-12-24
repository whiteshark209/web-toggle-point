import asosConfigRTL from "../../peripheral/eslint-config-asosconfig/rtl.js";
import packagesConfig from "../eslint.config.mjs";

export default [
  ...asosConfigRTL.map((config) => ({
    files: ["**/*.js"],
    ignores: ["**/docs/**"],
    ...config
  })),
  ...packagesConfig,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "testing-library/no-render-in-lifecycle": "off"
    },
    languageOptions: {
      globals: {
        CLIENT: "writable"
      }
    }
  }
];
