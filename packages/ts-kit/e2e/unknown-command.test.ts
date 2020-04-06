import { runTsKit } from "./utils/run";
import { getToolPackageJson } from "../src/utils/packageJson";

describe("unknown command", () => {
  const toolPackageJson = getToolPackageJson();

  it("exits with status 1 on unknown command", () => {
    const result = runTsKit("unknown");

    expect(result.status).toBe(1);
    expect(result.stderrLines).toContain("Command 'unknown' does not exist");
    expect(result.stderrLines).toContain(
      "Run 'ts-kit --help' to see available commands"
    );
  });
});
