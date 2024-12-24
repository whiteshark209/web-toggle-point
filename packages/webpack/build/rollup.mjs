import pkg from "../package.json" with { type: "json" };
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-auto-external";
import commonjs from "@rollup/plugin-commonjs";
import keepExternalComments from "./keepExternalComments.mjs";
import copy from "rollup-plugin-copy";
import json from "@rollup/plugin-json";

export default {
  input: "./src/index.js",
  output: [
    {
      file: pkg.exports["./plugins"].require,
      format: "cjs",
      sourcemap: true
    },
    {
      file: pkg.exports["./plugins"].import,
      format: "es",
      sourcemap: true
    }
  ],
  plugins: [
    keepExternalComments,
    copy({
      targets: [
        { src: ["./src/toggleHandlers/*", "!**/*.test.*"], dest: "lib" }
      ]
    }),
    babel({
      exclude: [/node_modules/],
      babelHelpers: "runtime"
    }),
    resolve({
      preferBuiltins: true
    }),
    json(),
    commonjs(),
    external()
  ]
};
