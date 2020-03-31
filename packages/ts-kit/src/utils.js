const path = require("path");

module.exports.getConfigFilepath = (filename) => {
  return path.resolve(__dirname, "config", filename);
};
