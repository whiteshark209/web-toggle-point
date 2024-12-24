import pkg from "../package.json" with { type: "json" };
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-auto-external";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import keepExternalComments from "./keepExternalComments.mjs";

export default ({ config_isClient }) => {
  const CLIENT = JSON.parse(config_isClient);
  const [esOutputFile, cjsOutputFile, extraPlugins] = {
    false: [pkg.exports.node.import, pkg.exports.node.require, []],
    true: [pkg.exports.default.import, pkg.exports.default.require, [terser()]]
  }[CLIENT];

  return {
    input: "./src/index.js",
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
        exclude: [/node_modules/],
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
