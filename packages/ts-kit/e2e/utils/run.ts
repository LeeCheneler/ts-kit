import { spawnSync } from "child_process";

export interface RunTsKitResult {
  status: number;
  stdout: string;
  stdoutLines: string[];
}

export const runTsKit = (args: string): RunTsKitResult => {
  const processedArgs = args.split(" ").filter((a) => a !== "");
  const result = spawnSync(
    "yarn",
    ["run", "ts-kit", ...processedArgs, "--disable-colors"],
    {
      encoding: "utf8",
    }
  );

  return {
    status: result.status,
    stdout: result.stdout,
    stdoutLines: result.stdout.split("\n"),
  };
};
