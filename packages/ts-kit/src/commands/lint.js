const eslint = require("eslint");
const glob = require("glob-promise");
const { getSourceFilesGlob, getPackageSourceDirectory } = require("../utils");

module.exports.lint = async () => {
  const fileNames = await glob(getSourceFilesGlob(), {
    root: getPackageSourceDirectory(),
  });

  const cli = new eslint.CLIEngine({
    useEslintrc: false,
    baseConfig: {
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
              "mjs",
              ".cjs",
            ],
          },
        },
      },
    },
  });

  const report = cli.executeOnFiles(fileNames);
  console.log(report);

  for (let file of report.results) {
    for (message of file.messages) {
      console.log(message);
    }
  }

  return Promise.resolve();
};
