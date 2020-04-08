import path from "path";
import fs from "fs-extra";
import { runTsKit } from "./utils/run";
import {
  createPackage,
  destroyPackage,
  getPackageDir,
} from "./utils/generate-package";

describe("lint command", () => {
  beforeEach(async () => {
    await destroyPackage("@temp/lint-command");
  });

  afterAll(async () => {
    await destroyPackage("@temp/lint-command");
  });

  it("runs eslint", async () => {
    await createPackage({
      name: "@temp/lint-command",
    });
    const result = runTsKit("lint", {
      cwd: await getPackageDir("@temp/lint-command"),
    });

    expect(result.status).toBe(0);
    expect(result.stdoutLines).toContain("Linting with ESLint");
    expect(result.stdoutLines).toContain("No issues found");
  });

  it("lints unfixable issues and does not present auto fix option", async () => {
    await createPackage({
      name: "@temp/lint-command",
      unfixableLinting: true,
    });
    const result = runTsKit("lint", {
      cwd: await getPackageDir("@temp/lint-command"),
    });

    expect(result.status).toBe(1);
    expect(result.stdoutLines).toContain("Linting with ESLint");
    expect(result.stderrLines).toContain(
      "Found 1 errors (0 fixable) and 0 warnings (0 fixable)"
    );
    expect(result.stderrLines).toContain("Error (3:3) Unreachable code.");
    expect(result.stderrLines).not.toContain(
      "Rerun with --fix to fix fixable issues"
    );
  });

  it("lints fixable issues and presents auto fix suggestion", async () => {
    await createPackage({
      name: "@temp/lint-command",
      fixableLinting: true,
    });
    const result = runTsKit("lint", {
      cwd: await getPackageDir("@temp/lint-command"),
    });

    expect(result.status).toBe(1);
    expect(result.stdoutLines).toContain("Linting with ESLint");
    expect(result.stderrLines).toContain(
      "Found 2 errors (2 fixable) and 0 warnings (0 fixable)"
    );
    expect(result.stderrLines).toContain(
      "Error (1:1) Unexpected var, use let or const instead."
    );
    expect(result.stderrLines).toContain(
      "Error (1:11) Replace `·console.log(a)` with `⏎console.log(a);⏎`"
    );
    expect(result.stderrLines).toContain(
      "Rerun with --fix to fix fixable issues"
    );
  });

  it("fixes autofixable lint issues when --fix is present", async () => {
    const packageDir = await getPackageDir("@temp/lint-command");
    await createPackage({
      name: "@temp/lint-command",
      fixableLinting: true,
    });
    const result = runTsKit("lint --fix", {
      cwd: packageDir,
    });

    expect(result.status).toBe(0);
    expect(
      fs.readFileSync(path.resolve(packageDir, "src/fixable-linting.ts"), {
        encoding: "utf8",
      })
    ).toBe(`let a = 1;
console.log(a);
`);
  });
});
