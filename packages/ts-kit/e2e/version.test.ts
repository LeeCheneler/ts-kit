import { runTsKit } from "./utils/run";
import { getToolPackageJson } from "../src/utils/tool-package";

describe("version option", () => {
  const toolPackageJson = getToolPackageJson();

  ["--version", "-v"].forEach((option) => {
    it(`should print version (${option})`, () => {
      const result = runTsKit(option);

      expect(result.status).toBe(0);
      expect(result.stdoutLines).toContain(toolPackageJson.version);
    });
  });
});
