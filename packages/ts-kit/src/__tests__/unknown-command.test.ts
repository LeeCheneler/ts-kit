import { runTsKit } from "./test-utils/run";

describe("unknown command", () => {
  it("exits with status 1 on unknown command", () => {
    const result = runTsKit("unknown");

    expect(result.status).toBe(1);
    expect(result.stderrLines).toContain("Command 'unknown' does not exist");
    expect(result.stderrLines).toContain(
      "Run 'ts-kit --help' to see available commands"
    );
  });
});
