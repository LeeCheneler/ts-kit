import { runTsKit } from "./utils/run";
import {
  createPackage,
  destroyPackage,
  getPackageDir,
} from "./utils/generate-package";

describe("test command", () => {
  beforeEach(async () => {
    await destroyPackage("@temp/test-command");
  });

  afterAll(async () => {
    await destroyPackage("@temp/test-command");
  });

  it("runs jest", async () => {
    await createPackage({
      name: "@temp/test-command",
      testSuite: true,
    });
    const result = runTsKit("test", {
      cwd: await getPackageDir("@temp/test-command"),
    });

    expect(result.status).toBe(0);
    expect(result.stdoutLines).toContain("Running tests with Jest");

    // Jest outputs everything to stderr, always has for some reason
    expect(result.stderrLines).toContain("Test Suites: 1 passed, 1 total");
    expect(result.stderrLines).toContain("Ran all test suites.");
  });

  it("forwards args onto jest", async () => {
    await createPackage({
      name: "@temp/test-command",
      testSuite: false,
    });
    const result = runTsKit("test --passWithNoTests", {
      cwd: await getPackageDir("@temp/test-command"),
    });

    expect(result.status).toBe(0);
  });

  it("forwards jest's status code", async () => {
    await createPackage({
      name: "@temp/test-command",
      testSuite: false,
    });
    const result = runTsKit("test", {
      cwd: await getPackageDir("@temp/test-command"),
    });

    expect(result.status).toBe(1);
  });
});
