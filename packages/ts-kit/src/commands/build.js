const path = require("path");
const rollup = require("rollup");
const chalk = require("chalk");
const {
  getConfigFilepath,
  getSupportedSourceFileExtensions,
  getPackageJson,
} = require("../utils");
const {
  createRollupInputConfig,
  createRollupOutputConfig,
  createRollupWatchConfig,
} = require("../config/createRollupConfig");

const logBuildStarted = () => {
  console.log(`🏗  Running build using ${chalk.blueBright("Rollup")}`);
};

const logBuildCompleted = () => {
  console.log("🎉 Build completed");
};

const logError = (error) => {
  console.warn("❌ Error occurred during build, see below:");
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

const logWritingOutput = () => {
  console.log(
    `✏️  Writing output to ${chalk.greenBright(
      createRollupOutputConfig().file
    )}`
  );
};

const logWatchingForChanges = () => {
  console.log(
    `👀  Watching ${chalk.green(
      createRollupWatchConfig().input
    )} and dependency tree for changes...`
  );
};

module.exports.build = async (parsedArgs, rawArgs) => {
  logBuildStarted();
  try {
    if (parsedArgs.w === true || parsedArgs.watch === true) {
      const watcher = rollup.watch(createRollupWatchConfig());
      return new Promise((resolve, reject) => {
        watcher.on("event", (event) => {
          switch (event.code) {
            case "START": {
              logWritingOutput();
              break;
            }
            case "END": {
              logWatchingForChanges();
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
      const bundle = await rollup.rollup(createRollupInputConfig());
      logWritingOutput();
      const result = await bundle.write(createRollupOutputConfig());
    }
  } catch (error) {
    logError(error);

    return Promise.reject();
  }

  logBuildCompleted();
  return Promise.resolve();
};
