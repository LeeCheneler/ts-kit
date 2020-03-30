import { spawn } from "child_process";
import { setupWorkspace, WORKSPACE_DIR } from "../workspace.js";

export const build = async ([...args]) => {
  await setupWorkspace();

  const runner = spawn(`yarn`, ["run", "rollup", "-c"], {
    cwd: WORKSPACE_DIR,
    stdio: "inherit"
  });

  runner.on("close", code => {
    process.exit(code);
  });
};
