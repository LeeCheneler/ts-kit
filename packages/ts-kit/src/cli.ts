#!/usr/bin/env node

import chalk from "chalk";
import type { Command } from "./types";
import { getToolPackage } from "./utils/package";
import { print, printError } from "./utils/print";
import { build } from "./commands/build";
import { lint } from "./commands/lint";
import { test } from "./commands/_test";
import { typecheck } from "./commands/typecheck";

const run = async (): Promise<void> => {
  const [, , commandName, ...args] = process.argv;
  const toolPackage = await getToolPackage();
  const commands: Command<unknown>[] = [build, lint, test, typecheck];

  if (commandName === "--version") {
    // Handle top level tool options
    print(toolPackage.json.version);

    return Promise.resolve();
  }

  if (commandName == "--help") {
    // Print out helpful infomation
    print(
      `${toolPackage.json.name} (${chalk.blueBright(
        toolPackage.json.repository.url
      )})`
    );
    print();

    print(toolPackage.json.description);
    print();

    print(chalk.bold("--version"));
    print("Print version.");
    print();

    return Promise.resolve();
  }

  const command = commands.find((c) => c.name === commandName);
  if (!command) {
    // Notify command doesn't exist via stderr logs
    printError(`Command '${commandName}' does not exist`);
    print();

    printError("Run 'ts-kit --help' to see available commands");
    print();

    // Reject to ensure the project exits with status 1
    return Promise.reject();
  }

  // Run the command
  try {
    await command.run(args);
  } catch (error) {
    printError(error);
    return Promise.reject();
  }
};

// Run immediately
run()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
