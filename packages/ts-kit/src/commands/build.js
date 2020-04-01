const path = require("path");
const rollup = require("rollup");
const json = require("rollup-plugin-json");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const babel = require("rollup-plugin-babel");
const { terser } = require("rollup-plugin-terser");
const packageJson = require(path.resolve(process.cwd(), "package.json"));
const { getConfigFilepath } = require("../utils");

const extensions = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".es6",
  ".mjs",
  ".cjs",
  ".json",
];

module.exports.build = async ([...args]) => {
  const inputOptions = {
    input: "src/main.ts",
    plugins: [
      json(),
      commonjs(),
      resolve({
        extensions,
      }),
      babel({
        exclude: "node_modules/**",
        extensions,
        configFile: getConfigFilepath("babel.config.js"),
      }),
      terser(),
    ],
    external: packageJson.dependencies || [],
  };

  try {
    const bundle = await rollup.rollup(inputOptions);
  } catch (bundleError) {
    console.error(bundleError);
  }

  console.log(bundle.watchFiles); // an array of file names this bundle depends on

  // generate output specific code in-memory
  // you can call this function multiple times on the same bundle object
  const outputOptions = {
    file: path.resolve(process.cwd(), packageJson.main),
    format: "cjs",
  };

  try {
    const { output } = await bundle.generate(outputOptions);

    for (const chunkOrAsset of result.output) {
      if (chunkOrAsset.type === "asset") {
        // For assets, this contains
        // {
        //   fileName: string,              // the asset file name
        //   source: string | Uint8Array    // the asset source
        //   type: 'asset'                  // signifies that this is an asset
        // }
        console.log("Asset", chunkOrAsset);
      } else {
        // For chunks, this contains
        // {
        //   code: string,                  // the generated JS code
        //   dynamicImports: string[],      // external modules imported dynamically by the chunk
        //   exports: string[],             // exported variable names
        //   facadeModuleId: string | null, // the id of a module that this chunk corresponds to
        //   fileName: string,              // the chunk file name
        //   imports: string[],             // external modules imported statically by the chunk
        //   isDynamicEntry: boolean,       // is this chunk a dynamic entry point
        //   isEntry: boolean,              // is this chunk a static entry point
        //   map: string | null,            // sourcemaps if present
        //   modules: {                     // information about the modules in this chunk
        //     [id: string]: {
        //       renderedExports: string[]; // exported variable names that were included
        //       removedExports: string[];  // exported variable names that were removed
        //       renderedLength: number;    // the length of the remaining code in this module
        //       originalLength: number;    // the original length of the code in this module
        //     };
        //   },
        //   name: string                   // the name of this chunk as used in naming patterns
        //   type: 'chunk',                 // signifies that this is a chunk
        // }
        console.log("Chunk", chunkOrAsset.modules);
      }
    }

    // or write the bundle to disk
    await bundle.write(outputOptions);
  } catch (outputError) {
    console.error(outputError);
  }
  return Promise.resolve();
};
