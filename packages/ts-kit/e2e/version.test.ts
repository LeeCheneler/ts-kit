import { runTsKit } from "./utils/run";
import { getToolPackage } from "../src/utils/package";

describe("version option", () => {
  it(`should print version`, async () => {
    const toolPackage = await getToolPackage();
    const result = runTsKit("--version");

    expect(result.status).toBe(0);
    expect(result.stdoutLines).toContain(toolPackage.json.version);
  });
});
