import path from "path";
import glob from "glob-promise";

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
  srcDir: string;
  srcFilepaths: string[];
}

export const getToolPackage = (): Package => {
  const dir = path.resolve(__dirname, "../..");

  return {
    dir,
    json: require(path.resolve(dir, "package.json")) as PackageJson,
    srcDir: path.resolve(dir, "src"),
    srcFilepaths: glob.sync("src/**/*.{js,jsx,ts,tsx}", {
      root: path.resolve(dir),
    }),
  };
};

export const getConsumerPackage = (): Package => {
  const dir = process.cwd();

  return {
    dir,
    json: require(path.resolve(dir, "package.json")) as PackageJson,
    srcDir: path.resolve(dir, "src"),
    srcFilepaths: glob.sync("src/**/*.{js,jsx,ts,tsx}", {
      root: path.resolve(dir),
    }),
  };
};
