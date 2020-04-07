import { spawnSync } from "child_process";
import stripAnsi from "strip-ansi";

export interface RunTsKitResult {
  status: number;
  stderr: string;
  stderrLines: string[];
  stdout: string;
  stdoutLines: string[];
}

export interface RunTsKitOptions {
  cwd?: string;
}

export const runTsKit = (
  commandAndArgs: string,
  options: RunTsKitOptions = {
    cwd: process.cwd(),
  }
): RunTsKitResult => {
  const processedArgs = commandAndArgs.split(" ").filter((a) => a !== "");
  const result = spawnSync("yarn", ["run", "ts-kit", ...processedArgs], {
    encoding: "utf8",
    cwd: options.cwd,
  });

  return {
    status: result.status,
    stderr: stripAnsi(result.stderr) ?? "",
    stderrLines: (stripAnsi(result.stderr) ?? "").split("\n"),
    stdout: stripAnsi(result.stdout) ?? "",
    stdoutLines: (stripAnsi(result.stdout) ?? "").split("\n"),
  };
};
