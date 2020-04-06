#!/usr/bin/env node

require("ts-node").register();

const cli = require("./cli");

cli.run().catch(() => process.exit(1));
