const path = require("path");
const json = require("rollup-plugin-json");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const babel = require("rollup-plugin-babel");
const { terser } = require("rollup-plugin-terser");
const packageJson = require(path.resolve(process.cwd(), "package.json"));
const { getConfigFilepath } = require("../utils");

const extensions = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".es6",
  ".mjs",
  ".cjs",
  ".json",
];

module.exports = {
  input: "src/main.ts",
  output: [
    {
      file: path.resolve(process.cwd(), packageJson.main),
      format: "cjs",
    },
  ],
  plugins: [
    json(),
    commonjs(),
    resolve({
      extensions,
    }),
    babel({
      exclude: "node_modules/**",
      extensions,
      configFile: getConfigFilepath("babel.config.js"),
    }),
    terser(),
  ],
  external: packageJson.dependencies || [],
};
