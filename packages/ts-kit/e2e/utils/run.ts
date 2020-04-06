import { spawnSync } from "child_process";

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
    stderr: result.stderr,
    stderrLines: result.stderr.split("\n"),
    stdout: result.stdout,
    stdoutLines: result.stdout.split("\n"),
  };
};
