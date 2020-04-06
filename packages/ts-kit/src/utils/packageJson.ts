import type { PackageJson } from "../types";

/**
 * ts-kit's package.json file
 */
export const getToolPackageJson = (): PackageJson => {
  return require("../../package.json") as PackageJson;
};
