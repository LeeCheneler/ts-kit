module.exports.createTypeScriptConfig = (mergeConfig) => {
  return {
    noEmit: true,
    declaration: true,
    emitDeclarationOnly: false,
    esModuleInterop: true,
    jsx: "react",
    lib: ["lib.esnext.d.ts", "lib.dom.d.ts"],
    resolveJsonModule: true,
    skipLibCheck: true,
    strict: true,
    outDir: "dist",
    ...mergeConfig,
  };
};
