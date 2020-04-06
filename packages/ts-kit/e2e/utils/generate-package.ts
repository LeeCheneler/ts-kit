import path from "path";
import fs from "fs-extra";
import { spawnSync } from "child_process";
import {
  getToolPackageDir,
  getToolPackageJson,
} from "../../src/utils/tool-package";

export interface CreatePackageOptions {
  name: string;
  testSuite: boolean;
}

export const getPackageDir = (name: string): string => {
  return path.resolve(getToolPackageDir(), "..", name);
};

export const createPackage = async (
  options: CreatePackageOptions
): Promise<void> => {
  // Create the package directory
  const packageDir = getPackageDir(options.name);
  await fs.ensureDir(packageDir);

  // Write package.json file
  const toolPackageJson = getToolPackageJson();
  await fs.writeJSON(
    path.resolve(packageDir, "package.json"),
    {
      name: options.name,
      version: "1.0.0",
      license: "MIT",
      devDependencies: JSON.parse(
        `{"${toolPackageJson.name}": "${toolPackageJson.version}"}`
      ),
    },
    { spaces: 2 }
  );

  // Install dependencies
  spawnSync("yarn", { cwd: packageDir });

  if (options.testSuite) {
    // Create test suite
    await fs.writeFile(
      path.resolve(packageDir, "example.test.ts"),
      "it('should pass', () => { expect(1 + 2).toBe(3) });"
    );
  }
};

export const destroyPackage = async (name: string): Promise<void> => {
  await fs.remove(getPackageDir(name));
};
