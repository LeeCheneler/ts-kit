import path from "path";
import glob from "glob-promise";

export interface PackageJson {
  name: string;
  description: string;
  repository: {
    url: string;
  };
  version: string;
}

export interface Package {
  dir: string;
  json: PackageJson;
  srcDir: string;
  srcFilepaths: string[];
}

export const getToolPackage = async (): Promise<Package> => {
  const dir = path.resolve(__dirname, "../..");

  return {
    dir,
    json: require(path.resolve(dir, "package.json")) as PackageJson,
    srcDir: path.resolve(dir, "src"),
    srcFilepaths: await glob("src/**/*.{js,jsx,ts,tsx}", {
      root: path.resolve(dir),
    }),
  };
};

export const getConsumerPackage = async (): Promise<Package> => {
  const dir = process.cwd();

  return {
    dir,
    json: require(path.resolve(dir, "package.json")) as PackageJson,
    srcDir: path.resolve(dir, "src"),
    srcFilepaths: await glob("src/**/*.{js,jsx,ts,tsx}", {
      root: path.resolve(dir),
    }),
  };
};
