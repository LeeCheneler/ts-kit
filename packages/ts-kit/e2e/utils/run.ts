import { spawnSync, spawn } from "child_process";
import stripAnsi from "strip-ansi";
import terminate from "terminate";

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

export const runTsKitAsync = (
  commandAndArgs: string,
  options: RunTsKitOptions = {
    cwd: process.cwd(),
  }
) => {
  const processedArgs = commandAndArgs.split(" ").filter((a) => a !== "");
  const runner = spawn("yarn", ["run", "ts-kit", ...processedArgs], {
    stdio: "pipe",
    cwd: options.cwd,
  });
  runner.stdout.setEncoding("utf8");
  runner.stderr.setEncoding("utf8");

  const stdoutLines = [];
  const stderrLines = [];
  let resolveStdoutFound = null;
  let stdoutToLookFor = "";
  let resolveStderrFound = null;
  let stderrToLookFor = "";

  runner.stdout.on("data", (data) => {
    const newLines = data.split("\n");
    stdoutLines.push(...newLines);

    if (resolveStdoutFound && newLines.includes(stdoutToLookFor)) {
      resolveStdoutFound();
      resolveStdoutFound = null;
    }
  });

  runner.stderr.on("data", (data) => {
    const newLines = data.split("\n");
    stderrLines.push(...newLines);

    if (resolveStderrFound && newLines.includes(stderrToLookFor)) {
      resolveStderrFound();
      resolveStderrFound = null;
    }
  });

  return {
    kill: () => terminate(runner.pid),
    getStdoutLines: () => stdoutLines,
    getStderrLines: () => stderrLines,
    waitForStdout: (value) => {
      stdoutToLookFor = value;
      return new Promise((resolve) => {
        resolveStdoutFound = resolve;
      });
    },
    waitForStderr: (value) => {
      stderrToLookFor = value;
      return new Promise((resolve) => {
        resolveStderrFound = resolve;
      });
    },
  };
};
