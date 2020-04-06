import parseArgs from "minimist";
import chalk from "chalk";
import type { CliArgs } from "./types";
import { getToolPackageJson } from "./utils/packageJson";
import { print, printError } from "./utils/print";

export const run = (): Promise<void> => {
  const [, , command, ...args] = process.argv;
  const parsedArgs = parseArgs<CliArgs>(args);
  const toolPackageJson = getToolPackageJson();
  const commands = {};

  if (parsedArgs["disable-colors"]) {
    // Disable chalk colors, useful for tests and some CI envs
    chalk.level = 0;
  }

  if (["--version", "-v"].includes(command)) {
    // Handle top level tool options
    print(toolPackageJson.version);

    return Promise.resolve();
  }

  if (["--help", "-h"].includes(command)) {
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

  if (!Object.keys(commands).includes(command)) {
    // Notify command doesn't exist via stderr logs
    printError(`Command '${command}' does not exist`);
    print();

    printError("Run 'ts-kit --help' to see available commands");
    print();

    // Reject to ensure the project exits with status 1
    return Promise.reject();
  }

  return Promise.resolve();
};
