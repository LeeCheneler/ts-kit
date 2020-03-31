// const { spawn } = require("child_process");
// const { getConfigFilepath, getPackageDirectory } = require("../utils");

// module.exports.typecheck = async ([...args]) => {
//   return new Promise((resolve, reject) => {
//     const runner = spawn(
//       `yarn`,
//       [
//         "run",
//         "tsc",
//         "--project",
//         getConfigFilepath("tsconfig.json"),
//         "src/*.ts",
//       ],
//       {
//         cwd: process.cwd(),
//         stdio: "inherit",
//       }
//     );

//     runner.on("close", (code) => {
//       code === 0 ? resolve(code) : reject(code);
//     });
//   });
// };
const ts = require("typescript");
const glob = require("glob-promise");
const { getSourceFilesGlob, getPackageSourceDirectory } = require("../utils");

module.exports.typecheck = async () => {
  return new Promise(async (resolve, reject) => {
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
          `${diagnostic.file.fileName} (${line + 1},${
            character + 1
          }): ${message}`
        );
      } else {
        console.log(
          ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
        );
      }
    });

    emitResult.emitSkipped ? reject(1) : resolve(0);
  });
};
