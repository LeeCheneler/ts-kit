const ts = require("typescript");
const glob = require("glob-promise");
const { getSourceFilesGlob, getPackageSourceDirectory } = require("../utils");

module.exports.typecheck = async () => {
  const fileNames = await glob(getSourceFilesGlob(), {
    root: getPackageSourceDirectory(),
  });

  let program = ts.createProgram(fileNames, {
    noEmit: true,
    declaration: true,
    emitDeclarationOnly: true,
    esModuleInterop: true,
    jsx: "react",
    lib: ["esnext", "dom"],
    resolveJsonModule: true,
    skipLibCheck: true,
    strict: true,
  });

  let emitResult = program.emit();

  let allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start
      );
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      console.log(
        ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
      );
    }
  });

  return emitResult.emitSkipped ? Promise.reject(1) : Promise.resolve(0);
};
