const path = require("path");

module.exports.getConfigFilepath = (filename) => {
  return path.resolve(__dirname, "config", filename);
};

module.exports.getPackageSourceDirectory = () => {
  return path.resolve(process.cwd(), "src");
};

module.exports.getSourceFilesGlob = () => {
  return "**/*.{js,jsx,ts,tsx}";
};
