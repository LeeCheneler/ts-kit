const json = require("rollup-plugin-json");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const babel = require("rollup-plugin-babel");
const { terser } = require("rollup-plugin-terser");
const {
  getPackageJson,
  getSupportedSourceFileExtensions,
} = require("../utils");
const { createBabelConfig } = require("./createBabelConfig");

module.exports.createRollupInputConfig = () => {
  return {
    input: "src/main.ts",
    plugins: [
      json(),
      commonjs(),
      resolve({
        extensions: getSupportedSourceFileExtensions(),
      }),
      babel(createBabelConfig()),
      terser(),
    ],
    external: getPackageJson().dependencies || [],
  };
};

module.exports.createRollupOutputConfig = () => {
  return {
    file: "dist/main.js",
    format: "cjs",
  };
};

module.exports.createRollupWatchConfig = () => {
  return {
    ...module.exports.createRollupInputConfig(),
    output: module.exports.createRollupOutputConfig(),
  };
};
