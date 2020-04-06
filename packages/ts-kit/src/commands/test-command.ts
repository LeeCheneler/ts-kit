import chalk from "chalk";
import type { Command } from "../types";
import { print } from "../utils/print";

const createConfig = () => {
  return {
    testURL: "http://localhost",
    transform: {
      ".(js|jsx|ts|tsx)$": require.resolve("../tool-files/jestPreprocessor"),
    },
  };
};

export interface TestCommandOptions {}

export const test: Command<TestCommandOptions> = {
  name: "test",
  description: `Run tests using ${chalk.blueBright("Jest")}`,
  options: [],
  run: async (args: string[]) => {
    // Announce tool
    print(`Running tests with ${chalk.blueBright("Jest")}`);
    print();

    // Ensure envs are set
    process.env.BABEL_ENV = "test";
    process.env.NODE_ENV = "test";

    require("jest").run([...args, "--config", JSON.stringify(createConfig())]);
  },
};
