const path = require("path");
const rollup = require("rollup");
const chalk = require("chalk");
const {
  createRollupInputConfig,
  createRollupOutputConfig,
  createRollupWatchConfig,
} = require("../config/createRollupConfig");
const { writePaddedLog, writeLog, colors } = require("../logging");

module.exports.build = async (parsedArgs, rawArgs) => {
  writeLog(`Building with ${chalk.blueBright("Rollup")}`);

  if (parsedArgs.w === true || parsedArgs.watch === true) {
    const watchConfig = createRollupWatchConfig();
    const watcher = rollup.watch(watchConfig);
    return new Promise((resolve, reject) => {
      watcher.on("event", (event) => {
        switch (event.code) {
          case "START": {
            writeLog(
              `Writing output to ${colors.filepath(watchConfig.output.file)}`
            );
            break;
          }
          case "END": {
            writeLog(colors.watching("Watching for changes..."));
            break;
          }
          case "ERROR": {
            logError(event.error);
            watcher.close();
            break;
          }
          default: {
            break;
          }
        }
      });
    });
  } else {
    const inputConfig = createRollupInputConfig();
    const outputConfig = createRollupOutputConfig();
    const bundle = await rollup.rollup(inputConfig);
    writeLog(`Writing output to ${colors.filepath(outputConfig.file)}`);
    const result = await bundle.write(outputConfig);
  }

  return Promise.resolve();
};
