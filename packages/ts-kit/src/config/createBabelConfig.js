const {
  getConfigFilepath,
  getSupportedSourceFileExtensions,
} = require("../utils");

module.exports.createBabelConfig = () => {
  return {
    exclude: "node_modules/**",
    extensions: getSupportedSourceFileExtensions(),
    configFile: getConfigFilepath("babel.config.js"),
  };
};
