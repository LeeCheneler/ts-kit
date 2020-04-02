const path = require("path");

module.exports.getConfigFilepath = (filename) => {
  return path.resolve(__dirname, "config/files", filename);
};

module.exports.getPackageSourceDirectory = () => {
  return path.resolve(process.cwd(), "src");
};

module.exports.getSourceFilepaths = async () => {
  return glob("**/*.{js,jsx,ts,tsx}", {
    root: path.resolve(getPackageSourceDirectory()),
  });
};

module.exports.getSupportedSourceFileExtensions = () => [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".es6",
  ".mjs",
  ".cjs",
  ".json",
];

module.exports.getPackageJson = () => {
  return require(path.resolve(process.cwd(), "package.json"));
};
