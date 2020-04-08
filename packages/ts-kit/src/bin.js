#!/usr/bin/env node

require("ts-node").register(require("../tsconfig.json"));

const cli = require("./cli");

cli
  .run()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
