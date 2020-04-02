#!/usr/bin/env node

const minimist = require("minimist");
const { build } = require("./commands/build");
const { lint } = require("./commands/lint");
const { test } = require("./commands/test");
const { typecheck } = require("./commands/typecheck");

const [, , command, ...rawArgs] = process.argv;

const run = async () => {
  const parsedArgs = minimist(rawArgs);

  try {
    switch (command) {
      case "build": {
        await build(parsedArgs);
        break;
      }
      case "lint": {
        await lint(parsedArgs);
        break;
      }
      case "test": {
        await test(parsedArgs);
        break;
      }
      case "typecheck": {
        await typecheck(parsedArgs);
        break;
      }
      default: {
        console.warn(`Command "${command}" not found! 🤔`);
        return Promise.resolve();
      }
    }
  } catch {
    process.exit(1);
  }
  process.exit(0);
};

run();
