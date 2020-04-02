const ts = require("typescript");
const glob = require("glob-promise");
const { getSourceFilepaths } = require("../utils");
const { createTypeScriptConfig } = require("../config/createTypeScriptConfig");
const { colors, writePaddedLog, writeErrorLog } = require("../logging");

module.exports.typecheck = async (parsedArgs, rawArgs) => {
  writePaddedLog(`Checking types with ${colors.tool("TypeScript")}`);

  let program = ts.createProgram(
    await getSourceFilepaths(),
    createTypeScriptConfig({
      emitDeclarationOnly: parsedArgs.emit,
      noEmit: !parsedArgs.emit,
    })
  );

  let emitResult = program.emit();

  let allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  if (allDiagnostics.length > 0) {
    const diagnosticMessages = allDiagnostics.map((diagnostic) => {
      if (diagnostic.file) {
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
          diagnostic.start
        );
        let message = ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          "\n"
        );

        return `${colors.filepath(
          `${diagnostic.file.fileName} (${line + 1},${character + 1})`
        )}: ${message}`;
      } else {
        return ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n", 2);
      }
    });

    writePaddedLog(
      `Found ${colors.warning(diagnosticMessages.length)} type issues:`
    );
    writePaddedLog(diagnosticMessages, console.warn);
  }

  if (
    (parsedArgs.emit && emitResult.emitSkipped) ||
    allDiagnostics.length > 0
  ) {
    // Want the tool to exit with exit code 1 but don't want to log anything else
    return Promise.reject({ silentExit: true });
  }

  writePaddedLog(`Found ${colors.warning("0")} type issues`);

  // There were no type issues
  return Promise.resolve();
};
