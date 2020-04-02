const chalk = require("chalk");

module.exports.colors = {
  directory: chalk.greenBright,
  error: chalk.redBright,
  filepath: chalk.greenBright,
  log: chalk.white,
  tool: chalk.blueBright,
  warning: chalk.yellowBright,
  watching: chalk.grey,
};

module.exports.writeEmptyLine = () => {
  console.log();
};

module.exports.writePaddedLog = (messages, logFunction = console.log) => {
  if (Array.isArray(messages)) {
    messages.forEach((m) => logFunction(m));
  } else {
    logFunction(messages);
  }
  module.exports.writeEmptyLine();
};

module.exports.writeLog = (messages, logFunction = console.log) => {
  if (Array.isArray(messages)) {
    messages.forEach((m) => logFunction(m));
  } else {
    logFunction(messages);
  }
};

module.exports.writeErrorLog = (error) => {
  module.exports.writePaddedLog(
    module.exports.colors.error("An error occurred:")
  );
  module.exports.writePaddedLog(error, console.error);
};
