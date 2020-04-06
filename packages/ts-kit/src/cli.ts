import chalk from "chalk";
import type { Command } from "./types";
import { getToolPackageJson } from "./utils/tool-package";
import { print, printError } from "./utils/print";
import { test } from "./commands/test-command";

export const run = async (): Promise<void> => {
  const [, , commandName, ...args] = process.argv;
  const toolPackageJson = getToolPackageJson();
  const commands: Command<unknown>[] = [test];

  if (["--version", "-v"].includes(commandName)) {
    // Handle top level tool options
    print(toolPackageJson.version);

    return Promise.resolve();
  }

  if (["--help", "-h"].includes(commandName)) {
    // Print out helpful infomation
    print(
      `${toolPackageJson.name} (${chalk.blueBright(
        toolPackageJson.repository.url
      )})`
    );
    print();

    print(toolPackageJson.description);
    print();

    print(chalk.bold("--version, -v"));
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
  return command.run(args);
};
