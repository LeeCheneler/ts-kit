import "./test-utils/extend-expect";
import { runCliCommand } from "./test-utils/run-cli-command";
import { getToolPackage } from "../utils/package";

describe("help option", () => {
  it("should print basic tool info", async () => {
    const runner = runCliCommand("yarn run ts-kit --help");

    // Expect tool to exist with correct status code
    const status = await runner.waitForStatusCode();
    expect(status).toBe(0);

    // Expect correct output
    const toolPackage = getToolPackage();
    expect(runner.stdoutLines).toContainInOrder([
      `${toolPackage.json.name} (${toolPackage.json.repository.url})`,
      toolPackage.json.description,
      "--version",
      "Print version.",
    ]);
  });
});
