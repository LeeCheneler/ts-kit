const ts = require("typescript");
const glob = require("glob-promise");
const { getSourceFilepaths } = require("../utils");
const { createTypeScriptConfig } = require("../config/createTypeScriptConfig");
const {
  colors,
  writePaddedLog,
  writeErrorLog,
  writeLog,
} = require("../logging");

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
    writePaddedLog(`Found ${colors.error(allDiagnostics.length)} type errors:`);

    const composedDiagnostics = allDiagnostics.reduce(
      (acc, next) => {
        if (next.file) {
          let { line, character } = next.file.getLineAndCharacterOfPosition(
            next.start
          );
          let message = ts.flattenDiagnosticMessageText(next.messageText, "\n");

          const composedMessage = `${colors.error(
            `(${line + 1},${character + 1})`
          )}: ${message}`;

          const existingFileDiagnostics = acc.fileDiagnostics.find(
            (d) => d.fileName === next.file.fileName
          );
          if (existingFileDiagnostics) {
            existingFileDiagnostics.messages.push(composedMessage);
          } else {
            acc.fileDiagnostics.push({
              fileName: next.file.fileName,
              messages: [composedMessage],
            });
          }
        } else {
          acc.generalDiagnostics.push(
            ts.flattenDiagnosticMessageText(next.messageText, "\n")
          );
        }

        return acc;
      },
      { fileDiagnostics: [], generalDiagnostics: [] }
    );

    if (composedDiagnostics.fileDiagnostics.length > 0) {
      for (let fileDiagnostic of composedDiagnostics.fileDiagnostics) {
        writeLog(colors.filepath(fileDiagnostic.fileName));
        writePaddedLog(fileDiagnostic.messages);
      }
    }

    if (composedDiagnostics.generalDiagnostics.length > 0) {
      writePaddedLog(composedDiagnostics.generalDiagnostics);
    }
  }

  if (
    (parsedArgs.emit && emitResult.emitSkipped) ||
    allDiagnostics.length > 0
  ) {
    // Want the tool to exit with exit code 1 but don't want to log anything else
    return Promise.reject({ silentExit: true });
  }

  writePaddedLog("Found no issues");

  // There were no type issues
  return Promise.resolve();
};
