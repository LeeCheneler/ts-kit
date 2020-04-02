const jest = require("jest");
const glob = require("glob-promise");
const { getPackageSourceDirectory } = require("../utils");
const { createJestConfig } = require("../config/createJestConfig");

const logError = (error) => {
  console.warn("❌ Error occurred during test run, see below:");
  console.log(
    chalk.red(
      "================================================================================"
    )
  );
  console.error(error);
  console.log(
    chalk.red(
      "================================================================================"
    )
  );
};

module.exports.test = async (parsedArgs, rawArgs) => {
  process.env.BABEL_ENV = "test";
  process.env.NODE_ENV = "test";

  try {
    await jest.run([
      ...rawArgs,
      "--config",
      JSON.stringify(createJestConfig()),
    ]);
  } catch (error) {
    logError(error);
    return Promise.reject();
  }

  return Promise.resolve();
};
