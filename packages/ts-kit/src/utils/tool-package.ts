import path from "path";
import type { PackageJson } from "../types";

/**
 * ts-kit's package directory
 */
export const getToolPackageDir = (): string => {
  return path.resolve(__dirname, "../..");
};

/**
 * ts-kit's package.json file
 */
export const getToolPackageJson = (): PackageJson => {
  return require(path.resolve(__dirname, "../../package.json")) as PackageJson;
};
