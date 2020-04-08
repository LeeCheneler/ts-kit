#!/usr/bin/env node

require("ts-node").register({
  compilerOptions: {
    noEmit: false,
    lib: ["ESNext"],
    esModuleInterop: true,
    resolveJsonModule: true,
    skipLibCheck: true,
    strict: true,
    types: ["src/types", "node"],
  },
  include: ["src/**/*"],
  exclude: ["node_modules", "**/*.test.ts"],
});

const cli = require("./cli");

cli
  .run()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
