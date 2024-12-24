import { resolve, basename, dirname, posix } from "path";
import externals from "webpack-node-externals";
import { TogglePointInjection } from "@asos/web-toggle-point-webpack/plugins";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { fileURLToPath } from "url";

const configPointCutConfig = {
  name: "configuration variants",
  variantGlob: "./src/routes/config/__variants__/*/*/*.jsx",
  togglePointModule: "/src/routes/config/togglePoint.js"
};

const common = {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  }
};

const config = [
  {
    entry: "./src/index.js",
    target: "node",
    output: {
      path: resolve(dirname(fileURLToPath(import.meta.url)), "bin"),
      filename: "server.cjs",
      clean: true,
      chunkFormat: "module"
    },
    externals: [externals()],
    ...common,
    plugins: [
      new MiniCssExtractPlugin(),
      new TogglePointInjection({
        pointCuts: [
          configPointCutConfig,
          {
            name: "animal apis by version",
            variantGlob: "./src/routes/animals/api/**/v[1-9]*([0-9])/*.js",
            joinPointResolver: (variantPath) =>
              posix.resolve(
                variantPath,
                ...Array(3).fill(".."),
                basename(variantPath)
              ),
            togglePointModule: "/src/routes/animals/togglePoint.js"
          }
        ]
      })
    ]
  },
  {
    entry: "./src/routes/config/client.js",
    target: "web",
    output: {
      path: resolve(dirname(fileURLToPath(import.meta.url)), "public"),
      filename: "main.js"
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new TogglePointInjection({ pointCuts: [configPointCutConfig] })
    ],
    ...common
  }
];

export default config;
