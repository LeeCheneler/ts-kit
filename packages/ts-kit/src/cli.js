#!/usr/bin/env node

const { build } = require("./commands/build");
const { typecheck } = require("./commands/typecheck");

const [, , command, ...args] = process.argv;

const run = async () => {
  try {
    switch (command) {
      case "build": {
        await build(args);
        break;
      }
      case "typecheck": {
        await typecheck(args);
        break;
      }
      default: {
        console.warn("Command not found! 🤔");
        return Promise.resolve();
      }
    }
  } catch (code) {
    process.exit(code);
  }
  process.exit(0);
};

run();
