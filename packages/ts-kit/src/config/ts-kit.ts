import path from "path";

const defaultTsKitConfig = {
  entryFilename: "main.ts",
  extensions: ["js", "jsx", "ts", "tsx", "json", "es6", "mjs", "cjs"],
  outputDir: "dist",
  outputFilename: "main.js",
  srcDir: "src",
};

export const getTsKitConfig = () => {
  const config = {
    ...defaultTsKitConfig,
  };

  return {
    entryFilename: path.join(config.srcDir, config.entryFilename),
    extensions: config.extensions,
    outputDir: config.outputDir,
    outputFilename: path.join(config.outputDir, config.outputFilename),
    srcDir: config.srcDir,
  };
};
