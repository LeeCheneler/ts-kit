const path = require("path");
const glob = require("glob-promise");

module.exports.getPackageSourceDirectory = () => {
  return path.resolve(process.cwd(), "src");
};

module.exports.getSourceFilepaths = async () => {
  return glob("src/**/*.{js,jsx,ts,tsx}", {
    root: path.resolve(module.exports.getPackageSourceDirectory()),
  });
};

module.exports.getPackageJson = () => {
  return require(path.resolve(process.cwd(), "package.json"));
};
