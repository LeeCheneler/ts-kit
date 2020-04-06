import { spawnSync } from "child_process";

export interface RunTsKitResult {
  status: number;
  stderr: string;
  stderrLines: string[];
  stdout: string;
  stdoutLines: string[];
}

export const runTsKit = (commandAndArgs: string): RunTsKitResult => {
  const processedArgs = commandAndArgs.split(" ").filter((a) => a !== "");
  const result = spawnSync(
    "yarn",
    ["run", "ts-kit", ...processedArgs, "--disable-colors"],
    {
      encoding: "utf8",
    }
  );

  return {
    status: result.status,
    stderr: result.stderr,
    stderrLines: result.stderr.split("\n"),
    stdout: result.stdout,
    stdoutLines: result.stdout.split("\n"),
  };
};
