import minimist from "minimist";
import type { ParsedArgs } from "minimist";
import chalk from "chalk";
import type { Option } from "../types";
import { printError } from "./print";

export const argsToOptions = <TOptions>(
  args: string[],
  options: Option<unknown>[]
): ParsedArgs & TOptions => {
  const parsedOptions = minimist<TOptions>(args);

  for (let option of options) {
    if (Object.keys(parsedOptions).includes(option.name)) {
      // @ts-ignore - can trust this assignment
      parsedOptions[option.name] = option.parse(parsedOptions[option.name]);
    } else if (option.isRequired) {
      const missingOptionErrorMessage = `Missing required option '${option.name}'`;
      printError(chalk.redBright(missingOptionErrorMessage));
      throw new Error(missingOptionErrorMessage);
    } else if (option.defaultValue) {
      // @ts-ignore - can trust this assignment
      parsedOptions[option.name] = option.defaultValue;
    }
  }

  return parsedOptions;
};
