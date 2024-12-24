import { resolve, dirname } from "path";
import externals from "webpack-node-externals";
import audience from "./src/fixtures/audience/__pointCutConfig.js";
import config from "./src/fixtures/config/__pointCutConfig.js";
import translation from "./src/fixtures/translation/__pointCutConfig.js";
import event from "./src/fixtures/event/__pointCutConfig.js";
import { TogglePointInjection } from "@asos/web-toggle-point-webpack/plugins";
import { fileURLToPath } from "url";

export default {
  entry: "./src/index.js",
  mode: "development",
  output: {
    filename: "main.js",
    path: resolve(dirname(fileURLToPath(import.meta.url)), "dist")
  },
  externals: [externals()],
  plugins: [
    new TogglePointInjection({
      pointCuts: [audience, config, translation, event]
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                namedExport: false
              }
            }
          }
        ]
      }
    ]
  }
};
