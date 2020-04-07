import path from "path";
import fs from "fs-extra";
import { spawnSync } from "child_process";
import { getToolPackage } from "../../src/utils/package";

export interface CreatePackageOptions {
  name: string;
  testSuite?: boolean;
  fixableLinting?: boolean;
  unfixableLinting?: boolean;
}

export const getPackageDir = async (name: string): Promise<string> => {
  return path.resolve((await getToolPackage()).dir, "..", name);
};

export const createPackage = async (
  options: CreatePackageOptions
): Promise<void> => {
  const finalOptions = {
    testSuite: false,
    fixableLinting: false,
    passLinting: true,
    unfixableLinting: false,
    ...options,
  };

  // Create the package directory and src directory
  const packageDir = await getPackageDir(finalOptions.name);
  await fs.ensureDir(packageDir);
  await fs.ensureDir(path.resolve(packageDir, "src"));

  // Write package.json file
  const toolPackageJson = (await getToolPackage()).json;
  await fs.writeJSON(
    path.resolve(packageDir, "package.json"),
    {
      name: finalOptions.name,
      version: "1.0.0",
      license: "MIT",
      devDependencies: JSON.parse(
        `{"${toolPackageJson.name}": "${toolPackageJson.version}"}`
      ),
    },
    { spaces: 2 }
  );

  // Install dependencies
  spawnSync("yarn", { cwd: packageDir, encoding: "utf8" });

  if (finalOptions.testSuite) {
    // Create test suite
    await fs.writeFile(
      path.resolve(packageDir, "src/example.test.ts"),
      "it('should pass', () => { expect(1 + 2).toBe(3) });"
    );
  }

  if (finalOptions.unfixableLinting) {
    // Write a malformed file that eslint cannot fix
    await fs.writeFile(
      path.resolve(packageDir, "src/unfixable-linting.ts"),
      `export const fn = () => {
  return;
  console.log("hello world");
};
`
    );
  }

  if (finalOptions.fixableLinting) {
    // Write a malformed file that eslint can fix
    await fs.writeFile(
      path.resolve(packageDir, "src/fixable-linting.ts"),
      "var a = 1; console.log(a)"
    );
  }
};

export const destroyPackage = async (name: string): Promise<void> => {
  await fs.remove(await getPackageDir(name));
};
