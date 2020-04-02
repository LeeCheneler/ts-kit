const path = require("path");

module.exports.getPackageSourceDirectory = () => {
  return path.resolve(process.cwd(), "src");
};

module.exports.getSourceFilepaths = async () => {
  return glob("**/*.{js,jsx,ts,tsx}", {
    root: path.resolve(getPackageSourceDirectory()),
  });
};

module.exports.getPackageJson = () => {
  return require(path.resolve(process.cwd(), "package.json"));
};
