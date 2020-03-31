const { spawn } = require("child_process");
const { getConfigFilepath } = require("../utils");

module.exports.build = async ([...args]) => {
  return new Promise((resolve, reject) => {
    const runner = spawn(
      `yarn`,
      ["run", "rollup", "--config", getConfigFilepath("rollup.config.js")],
      {
        cwd: process.cwd(),
        stdio: "inherit",
      }
    );

    runner.on("close", (code) => {
      code === 0 ? resolve(code) : reject(code);
    });
  });
};
