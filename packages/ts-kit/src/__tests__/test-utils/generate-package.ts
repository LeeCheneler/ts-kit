import path from "path";
import fs from "fs-extra";
import { spawnSync } from "child_process";
import { getToolPackage } from "../../utils/package";

export interface CreatePackageOptions {
  name: string;
  testSuite?: boolean;
  fixableLinting?: boolean;
  unfixableLinting?: boolean;
  mainSrc?: boolean;
  validTypes?: boolean;
  invalidTypes?: boolean;
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
    mainSrc: false,
    validtypes: false,
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

  if (finalOptions.mainSrc) {
    // Write simplest, compilable file
    await fs.writeFile(
      path.resolve(packageDir, "src/main.ts"),
      'console.log("Hello world");'
    );
  }

  if (finalOptions.testSuite) {
    // Write test file
    await fs.ensureDir(path.resolve(packageDir, "src/__tests__"));
    await fs.writeFile(
      path.resolve(packageDir, "src/__tests__/example.test.ts"),
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

  if (finalOptions.validTypes) {
    // Write a file with valid types
    await fs.writeFile(
      path.resolve(packageDir, "src/valid-types.ts"),
      "export const add = (a: number, b: number): number => a + b;"
    );
  }

  if (finalOptions.invalidTypes) {
    // Write a file with valid types
    await fs.writeFile(
      path.resolve(packageDir, "src/valid-types.ts"),
      "export const add = (a: number, b: string): number => a + b;"
    );
  }
};

export const destroyPackage = async (name: string): Promise<void> => {
  await fs.remove(await getPackageDir(name));
};
