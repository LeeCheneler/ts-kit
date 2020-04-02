const jest = require("jest");
const glob = require("glob-promise");
const { getPackageSourceDirectory } = require("../utils");
const { createJestConfig } = require("../config/createJestConfig");
const { writeErrorLog } = require("../logging");

module.exports.test = async (parsedArgs, rawArgs) => {
  // Ensure envs are set
  process.env.BABEL_ENV = "test";
  process.env.NODE_ENV = "test";

  // Ensure config option is applied last to it can not be overwritten
  await jest.run([...rawArgs, "--config", JSON.stringify(createJestConfig())]);

  return Promise.resolve();
};
