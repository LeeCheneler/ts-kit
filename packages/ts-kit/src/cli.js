#!/usr/bin/env node

import { build } from "./commands/build.js";
import { watch } from "./commands/watch.js";

const [, , command, ...args] = process.argv;

switch (command) {
  case "build": {
    build(args);
    break;
  }
  case "watch": {
    watch(args);
    break;
  }
  default: {
    console.warn("Command not found! 🤔");
  }
}
