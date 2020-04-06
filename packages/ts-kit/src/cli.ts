import parseArgs from "minimist";
import chalk from "chalk";
import type { CliArgs } from "./types";
import { getToolPackageJson } from "./utils/packageJson";
import { print } from "./utils/print";

export const run = (): Promise<void> => {
  const [, , command, ...args] = process.argv;
  const parsedArgs = parseArgs<CliArgs>(args);
  const toolPackageJson = getToolPackageJson();

  if (parsedArgs["disable-colors"]) {
    // Disable chalk colors, useful for tests and some CI envs
    chalk.level = 0;
  }

  if (["--version", "-v"].includes(command)) {
    // Handle top level tool options
    print(toolPackageJson.version);
  }

  if (["--help", "-h"].includes(command)) {
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
  }

  return Promise.resolve();
};
