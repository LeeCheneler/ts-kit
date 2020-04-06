#!/usr/bin/env node

require("ts-node").register(require("../tsconfig.json"));

const cli = require("./cli");

cli.run().catch(() => process.exit(1));
