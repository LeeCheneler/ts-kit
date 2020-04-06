#!/usr/bin/env node

const minimist = require("minimist");
const chalk = require("chalk");
const { build } = require("./commands/build");
const { lint } = require("./commands/lint");
const { test } = require("./commands/test");
const { typecheck } = require("./commands/typecheck");
const {
  colors,
  writeEmptyLine,
  writeErrorLog,
  writePaddedLog,
} = require("./logging");

const [, , command, ...rawArgs] = process.argv;

const run = async () => {
  const parsedArgs = minimist(rawArgs);

  if (parsedArgs["disable-colors"]) {
    chalk.level = 0;
  }

  try {
    switch (command) {
      case "build": {
        await build(parsedArgs, rawArgs);
        break;
      }
      case "lint": {
        await lint(parsedArgs, rawArgs);
        break;
      }
      case "test": {
        await test(parsedArgs, rawArgs);
        break;
      }
      case "typecheck": {
        await typecheck(parsedArgs, rawArgs);
        break;
      }
      default: {
        writePaddedLog(
          colors.warning(`Command '${command}' not found`),
          console.warn
        );
      }
    }
  } catch (error) {
    // Don't log anything if the command has told us to exit silently
    if (!error.silentExit) {
      writeErrorLog(error);
    }

    process.exit(1);
  }
};

run();
