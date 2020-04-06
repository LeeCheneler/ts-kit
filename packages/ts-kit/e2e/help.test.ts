import { runTsKit } from "./utils/run";
import { getToolPackageJson } from "../src/utils/packageJson";

describe("help option", () => {
  const toolPackageJson = getToolPackageJson();

  ["--help", "-h"].forEach((option) => {
    it(`should print basic tool info (${option})`, () => {
      const result = runTsKit(option);

      expect(result.status).toBe(0);

      // <name> (https://repoUrl)
      expect(result.stdoutLines).toContain(
        `${toolPackageJson.name} (${toolPackageJson.repository.url})`
      );

      // <tool_description>
      expect(result.stdoutLines).toContain(toolPackageJson.description);

      // --version, -v
      // Print version.
      expect(result.stdoutLines).toContain("--version, -v");
      expect(result.stdoutLines).toContain("Print version.");
    });

    it.skip(`should print command info (${option})`, () => {});
  });
});
