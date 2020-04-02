const json = require("rollup-plugin-json");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const babel = require("rollup-plugin-babel");
const { terser } = require("rollup-plugin-terser");
const { getPackageJson } = require("../utils");

module.exports.createRollupInputConfig = () => {
  return {
    input: "src/main.ts",
    plugins: [
      json(),
      commonjs(),
      resolve({
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }),
      babel({
        exclude: "node_modules/**",
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        configFile: require.resolve("./files/babel.config.js"),
      }),
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
