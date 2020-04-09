import fs from "fs-extra";
import eslint from "eslint";
import chalk from "chalk";
import type { Command } from "../types";
import { print, printError } from "../utils/print";
import { createBooleanOption, argsToOptions } from "../utils/options";
import { getConsumerPackage } from "../utils/package";

const createConfig = () => {
  return {
    env: {
      browser: true,
      jest: true,
      node: true,
      serviceworker: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:prettier/recommended",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:jest/recommended",
    ],
    globals: {
      console: "readonly",
      document: "readonly",
      fetch: "readonly",
      module: "writable",
      window: "readonly",
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      jsx: true,
      sourceType: "module",
    },
    plugins: ["prettier", "@typescript-eslint", "import", "jest"],
    rules: {
      "prettier/prettier": "error",
      "no-var": "error",
      "@typescript-eslint/no-unused-vars": "error",
      // Safe to disable the following rules as TSC will throw, ESLint doesn't understand interfaces properly,
      // https://github.com/eslint/typescript-eslint-parser/issues/437
      "no-undef": "off",
      "no-unused-vars": "off",
      "import/named": "off",
      "import/no-unresolved": "off",
      // Advanced users are fine importing jest
      "jest/no-jest-import": "off",
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [
            ".js",
            ".jsx",
            ".ts",
            ".tsx",
            ".json",
            ".es6",
            ".mjs",
            ".cjs",
          ],
        },
      },
    },
  };
};

const options = [
  createBooleanOption({
    name: "fix",
    description: "Auto fix fixable linting issues",
    isRequired: false,
    defaultValue: false,
  }),
];

export interface LintCommandOptions {
  fix: boolean;
}

export const lint: Command<LintCommandOptions> = {
  name: "lint",
  description: `Lint with ${chalk.blueBright("ESLint")}`,
  options,
  run: async (args: string[]) => {
    const parsedOptions = argsToOptions<LintCommandOptions>(args, options);

    // Announce tool
    print(`Linting with ${chalk.blueBright("ESLint")}`);
    print();

    // Setup linting engine
    const consumerPackage = await getConsumerPackage();
    const cli = new eslint.CLIEngine({
      fix: parsedOptions.fix,
      useEslintrc: false,
      baseConfig: createConfig(),
      cwd: consumerPackage.dir,
    });

    const report = cli.executeOnFiles(consumerPackage.srcFilepaths);

    if (parsedOptions.fix) {
      // Immediately write fixes to file
      const files = report.results.filter((r) => r.output);

      for (const file of files) {
        await fs.writeFile(file.filePath, file.output, { encoding: "utf8" });
      }
    }

    if (report.errorCount === 0 && report.warningCount === 0) {
      // Early escape if there are no issues found
      print("No issues found");
      print();

      return Promise.resolve();
    }

    // Print summary of issues eg:
    // Found 9 errors (4 fixable) and 4 warnings (2 fixable)
    const errors = `${chalk.redBright(report.errorCount)} errors`;
    const warnings = `${chalk.yellowBright(report.warningCount)} warnings`;
    const fixableErrors = `(${chalk.redBright(
      report.fixableErrorCount
    )} fixable)`;
    const fixableWarnings = `(${chalk.yellowBright(
      report.fixableWarningCount
    )} fixable)`;

    printError(
      `Found ${errors} ${fixableErrors} and ${warnings} ${fixableWarnings}`
    );
    printError();

    // Print out file summaries
    const files = report.results.filter(
      (r) => r.errorCount + r.warningCount > 0
    );

    for (let file of files) {
      printError(chalk.greenBright(file.filePath));

      for (let message of file.messages) {
        const prefix =
          message.severity === 2
            ? chalk.redBright(`Error (${message.line}:${message.column})`)
            : chalk.yellowBright(`Warning (${message.line}:${message.column})`);

        printError(
          `${prefix} ${message.message} (${chalk.grey(message.ruleId)})`
        );
      }

      printError();
    }

    // If anything is fixable mention --fix option
    if (report.fixableErrorCount + report.fixableWarningCount > 0) {
      printError(
        `Rerun with ${chalk.blueBright("--fix")} to fix fixable issues`
      );
      printError();
    }

    // Don't fail if we only have warnings
    return report.errorCount > 0 ? Promise.reject() : Promise.resolve();
  },
};
