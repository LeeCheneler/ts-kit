import { config as babelConfig } from "./config-templates/babel.js";
import { config as typescriptConfig } from "./config-templates/typescript.js";
import { config as rollupConfig } from "./config-templates/rollup.js";

export const getConfigFiles = () => {
  return [babelConfig, typescriptConfig, rollupConfig];
};
