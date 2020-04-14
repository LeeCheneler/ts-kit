import chalk from "chalk";
import * as rollup from "rollup";
const json = require("rollup-plugin-json");
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
const babel = require("rollup-plugin-babel");
import { terser } from "rollup-plugin-terser";
import type { Command } from "../types";
import { print, printError } from "../utils/print";
import { getConsumerPackage } from "../utils/package";
import { createBooleanOption, argsToOptions } from "../utils/options";

const createConfig = async () => {
  return {
    input: "src/main.ts",
    output: {
      file: "dist/main.js",
      format: "cjs",
    },
    plugins: [
      json(),
      commonjs(),
      resolve({
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }),
      babel({
        exclude: "node_modules/**",
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        configFile: require.resolve("../tool-files/babel.config.js"),
      }),
      terser(),
    ],
    external: getConsumerPackage().json?.dependencies ?? [],
  };
};

const options = [
  createBooleanOption({
    name: "watch",
    description: "Watch for changes and build on changes",
    isRequired: false,
    defaultValue: false,
  }),
];

export interface BuildCommandOptions {
  watch: boolean;
}
export const build: Command<BuildCommandOptions> = {
  name: "build",
  description: `Build code using ${chalk.blueBright("Rollup")}`,
  options: [],
  run: async (args: string[]) => {
    const parsedOptions = argsToOptions<BuildCommandOptions>(args, options);

    // Announce tool
    print(`Building code with ${chalk.blueBright("Rollup")}`);
    print();

    try {
      const config = await createConfig();
      if (parsedOptions.watch) {
        // Setup watcher
        const watcher = rollup.watch(config as any);

        return new Promise(() => {
          watcher.on("event", (event) => {
            switch (event.code) {
              case "START": {
                print(
                  `${chalk.greenBright(config.input)} ${chalk.blueBright(
                    "⮕"
                  )}  ${chalk.greenBright(config.output.file)}`
                );
                break;
              }
              case "END": {
                print(chalk.grey("Watching for changes..."));
                break;
              }
              case "ERROR": {
                printError(event.error);
                printError();
                break;
              }
              default: {
                break;
              }
            }
          });
        });
      } else {
        // Perform single build and write it out
        const bundle = await rollup.rollup(config as any);
        await bundle.write(config.output as any);
        print(
          `${chalk.greenBright(config.input)} ${chalk.blueBright(
            "⮕"
          )}  ${chalk.greenBright(config.output.file)}`
        );
        print();
      }
    } catch (error) {
      printError(error);
      printError();
      return Promise.reject();
    }
  },
};
