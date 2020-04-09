import path from "path";
import fs from "fs-extra";
import { runTsKit } from "./test-utils/run";
import {
  createPackage,
  destroyPackage,
  getPackageDir,
} from "./test-utils/generate-package";

describe("build command", () => {
  beforeEach(async () => {
    // await destroyPackage("@temp/typecheck-command");
  });

  afterAll(async () => {
    // await destroyPackage("@temp/typecheck-command");
  });

  it("typechecks code", async () => {
    const packageDir = await getPackageDir("@temp/typecheck-command");
    await createPackage({
      name: "@temp/typecheck-command",
      validTypes: true,
    });
    const result = runTsKit("typecheck", {
      cwd: packageDir,
    });

    expect(result.status).toBe(0);
    expect(result.stdoutLines).toContain("Typechecking code with TypeScript");
    expect(result.stdoutLines).toContain("No issues found");
  });

  it("reports type errors", async () => {
    const packageDir = await getPackageDir("@temp/typecheck-command");
    await createPackage({
      name: "@temp/typecheck-command",
      invalidTypes: true,
    });
    const result = runTsKit("typecheck", {
      cwd: packageDir,
    });

    expect(result.status).toBe(1);
    expect(result.stdoutLines).toContain("Typechecking code with TypeScript");
    expect(result.stderrLines).toContain("Found 1 type errors:");
    expect(result.stderrLines).toContain("src/valid-types.ts");
    expect(result.stderrLines).toContain(
      "(1,54): Type 'string' is not assignable to type 'number'."
    );
  });

  it("outputs type definitions", async () => {
    const packageDir = await getPackageDir("@temp/typecheck-command");
    await createPackage({
      name: "@temp/typecheck-command",
      validTypes: true,
    });
    const result = runTsKit("typecheck --emit", {
      cwd: packageDir,
    });

    expect(result.status).toBe(0);
    expect(result.stdoutLines).toContain("Typechecking code with TypeScript");
    expect(result.stdoutLines).toContain("Writing type definitions to dist/");
    expect(
      fs.readFileSync(path.resolve(packageDir, "dist/valid-types.d.ts"), {
        encoding: "utf8",
      })
    ).toBe(`export declare const add: (a: number, b: number) => number;
`);
  });
});
