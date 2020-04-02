const jest = require("jest");
const glob = require("glob-promise");
const { getPackageSourceDirectory } = require("../utils");

module.exports.test = async () => {
  await jest.runCLI({ watch: false }, [getPackageSourceDirectory()]);

  return Promise.resolve();
};
