const jest = require("jest");
const glob = require("glob-promise");
const { getSourceFilesGlob, getPackageSourceDirectory } = require("../utils");

module.exports.test = async () => {
  const fileNames = await glob(getSourceFilesGlob(), {
    root: getPackageSourceDirectory(),
  });

  await jest.runCLI({ watch: false }, [getPackageSourceDirectory()]);

  return Promise.resolve();
};
