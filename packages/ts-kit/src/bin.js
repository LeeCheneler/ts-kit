#!/usr/bin/env node
const { spawnSync } = require("child_process");
const path = require("path");

// Args to forward onto the ts-kit process
const [, , ...args] = process.argv;

const result = spawnSync(
  require.resolve("ts-node").replace("index", "bin-script"),
  [
    "--project",
    path.resolve(__dirname, "../tsconfig.json"),
    path.resolve(__dirname, "cli.ts"),
    ...args,
  ],
  { stdio: "inherit" }
);

process.exit(result.status);
