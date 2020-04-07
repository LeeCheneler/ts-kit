import path from "path";
import fs from "fs-extra";
import { runTsKit, runTsKitAsync } from "./utils/run";
import {
  createPackage,
  destroyPackage,
  getPackageDir,
} from "./utils/generate-package";

describe("build command", () => {
  beforeEach(async () => {
    await destroyPackage("@temp/build-command");
  });

  afterAll(async () => {
    await destroyPackage("@temp/build-command");
  });

  it("builds code", async () => {
    const packageDir = await getPackageDir("@temp/build-command");
    await createPackage({
      name: "@temp/build-command",
      mainSrc: true,
    });
    const result = runTsKit("build", {
      cwd: packageDir,
    });

    expect(result.status).toBe(0);
    expect(result.stdoutLines).toContain("Building code with Rollup");
    expect(result.stdoutLines).toContain("src/main.ts ⮕  dist/main.js");
    expect(
      fs.readFileSync(path.resolve(packageDir, "dist/main.js"), {
        encoding: "utf8",
      })
    ).toBe(`"use strict";console.log("Hello world");
`);
  });

  it("watches for code changes and rebuilds when --watch is present", async () => {
    const packageDir = await getPackageDir("@temp/build-command");
    await createPackage({
      name: "@temp/build-command",
      mainSrc: true,
    });
    const runner = runTsKitAsync("build --watch", {
      cwd: packageDir,
    });

    // Check it is initially built
    await runner.waitForStdout("Watching for changes...");
    const firstStdoutLines = runner.getStdoutLines();
    expect(firstStdoutLines).toContain("Building code with Rollup");
    expect(firstStdoutLines).toContain("src/main.ts ⮕  dist/main.js");
    expect(firstStdoutLines).toContain("Watching for changes...");
    expect(
      fs.readFileSync(path.resolve(packageDir, "dist/main.js"), {
        encoding: "utf8",
      })
    ).toBe(`"use strict";console.log("Hello world");
`);

    // Make a change and check it is updated
    fs.writeFileSync(
      path.resolve(packageDir, "src/main.ts"),
      "console.log('Hello world edited');",
      { encoding: "utf8" }
    );
    await runner.waitForStdout("Watching for changes...");
    const secondStdoutLines = runner
      .getStdoutLines()
      .slice(firstStdoutLines.indexOf("Watching for changes...") + 1);
    expect(secondStdoutLines).toContain("src/main.ts ⮕  dist/main.js");
    expect(secondStdoutLines).toContain("Watching for changes...");
    expect(
      fs.readFileSync(path.resolve(packageDir, "dist/main.js"), {
        encoding: "utf8",
      })
    ).toBe(`"use strict";console.log("Hello world edited");
`);

    await runner.kill();
  });
});
