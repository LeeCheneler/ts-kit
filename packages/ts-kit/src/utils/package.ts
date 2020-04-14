import path from "path";
import glob from "glob-promise";
import { getTsKitConfig } from "../config/ts-kit-config";

const tsKitConfig = getTsKitConfig();
const extensions = tsKitConfig.extensions.join(",");
const srcGlob = `${tsKitConfig.srcDir}/**/*.{${extensions}}`;

export interface PackageJson {
  name: string;
  description: string;
  repository: {
    url: string;
  };
  version: string;
  dependencies?: {
    [key: string]: string;
  };
}

export interface Package {
  dir: string;
  json: PackageJson;
  srcFilepaths: string[];
}

export const getToolPackage = (): Package => {
  const dir = path.resolve(__dirname, "../..");

  return {
    dir,
    json: require(path.resolve(dir, "package.json")) as PackageJson,
    srcFilepaths: glob.sync(srcGlob, {
      root: path.resolve(dir),
    }),
  };
};

export const getConsumerPackage = (): Package => {
  const dir = process.cwd();

  return {
    dir,
    json: require(path.resolve(dir, "package.json")) as PackageJson,
    srcFilepaths: glob.sync(srcGlob, {
      root: path.resolve(dir),
    }),
  };
};
