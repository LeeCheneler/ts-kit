import "./test-utils/extend-expect";
import { runCliCommand } from "./test-utils/run-cli-command";

describe("unknown command", () => {
  it("exits with status 1 on unknown command", async () => {
    const runner = runCliCommand("yarn run ts-kit unknown");

    // Expect tool to exist with correct status code
    const status = await runner.waitForStatusCode();
    expect(status).toBe(1);

    // Expect correct output
    expect(runner.stderrLines).toContainInOrder([
      "Command 'unknown' does not exist",
      "Run 'ts-kit --help' to see available commands",
    ]);
  });
});
