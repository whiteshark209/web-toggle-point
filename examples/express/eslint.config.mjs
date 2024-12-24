import examplesConfig from "../eslint.config.mjs";
import asosConfigReact from "../../peripheral/eslint-config-asosconfig/react.js";
import asosConfigServer from "../../peripheral/eslint-config-asosconfig/server.js";

export default [
  ...[...asosConfigReact, ...asosConfigServer].map((config) => ({
    files: ["**/*.js"],
    ...config,
    settings: {
      react: {
        version: "detect"
      }
    }
  })),
  ...examplesConfig,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "testing-library/no-render-in-lifecycle": "off",
      "no-console": "off"
    }
  }
];
