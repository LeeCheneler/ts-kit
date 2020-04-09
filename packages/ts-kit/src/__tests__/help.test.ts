import { runTsKit } from "./test-utils/run";
import { getToolPackage } from "../utils/package";

describe("help option", () => {
  it("should print basic tool info", async () => {
    const toolPackage = await getToolPackage();
    const result = runTsKit("--help");

    expect(result.status).toBe(0);

    // <name> (https://repoUrl)
    expect(result.stdoutLines).toContain(
      `${toolPackage.json.name} (${toolPackage.json.repository.url})`
    );

    // <tool_description>
    expect(result.stdoutLines).toContain(toolPackage.json.description);

    // --version
    // Print version.
    expect(result.stdoutLines).toContain("--version");
    expect(result.stdoutLines).toContain("Print version.");
  });

  it.skip(`should print command info`, () => {});
});
