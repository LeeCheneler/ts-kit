const eslint = require("eslint");
const glob = require("glob-promise");
const { getSourceFilepaths } = require("../utils");
const { writePaddedLog, writeLog, colors } = require("../logging");
const { createESLintConfig } = require("../config/createESLintConfig");

module.exports.lint = async (parsedArgs) => {
  const cli = new eslint.CLIEngine({
    fix: parsedArgs.fix === true,
    useEslintrc: false,
    baseConfig: createESLintConfig(),
  });

  const fileNames = await getSourceFilepaths();
  const report = cli.executeOnFiles(fileNames);

  writePaddedLog(`Linting with ${colors.tool("ESLint")}`);

  if (report.errorCount > 0 || report.warningCount > 0) {
    writePaddedLog(
      `Found ${colors.error(
        `${report.errorCount} errors (${report.fixableErrorCount} fixable)`
      )} and ${colors.warning(
        `${report.warningCount} warnings (${report.fixableWarningCount} fixable)`
      )}:`
    );
  } else {
    writePaddedLog("Found no issues");
  }

  for (let file of report.results.filter(
    (r) => r.errorCount + r.warningCount > 0
  )) {
    writeLog(`${colors.filepath(file.filePath)}:`);
    writePaddedLog(
      file.messages.map((m) => {
        const prefix =
          m.severity === 2
            ? colors.error(`Error (${m.line}:${m.column})`)
            : colors.warning(`Warning (${m.line}:${m.column})`);
        return `${prefix} ${m.message}`;
      })
    );
  }

  if (report.fixableErrorCount > 0 || report.fixableWarningCount > 0) {
    writePaddedLog(
      `Run again with ${colors.tool("--fix")} to fix fixable issues`
    );
  }

  return Promise.resolve();
};
