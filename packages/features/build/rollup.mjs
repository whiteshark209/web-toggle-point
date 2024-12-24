import pkg from "../package.json" with { type: "json" };
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-auto-external";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import keepExternalComments from "./keepExternalComments.js";

export default ({ config_isClient }) => {
  const CLIENT = JSON.parse(config_isClient);
  const [input, esOutputFile, cjsOutputFile, extraPlugins] = {
    false: [
      "./src/node.js",
      pkg.exports.node.import,
      pkg.exports.node.require,
      []
    ],
    true: [
      "./src/browser.js",
      pkg.exports.default.import,
      pkg.exports.default.require,
      [terser()]
    ]
  }[CLIENT];
  return {
    input,
    output: [
      {
        file: esOutputFile,
        format: "es",
        sourcemap: true
      },
      {
        file: cjsOutputFile,
        format: "cjs",
        sourcemap: true
      }
    ],
    external: ["react/jsx-runtime"],
    plugins: [
      keepExternalComments,
      babel({
        exclude: /node_modules/,
        babelHelpers: "runtime"
      }),
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      external(),
      ...extraPlugins
    ],
    preserveSymlinks: true
  };
};
