import path from "path";
import fs from "fs-extra";
import { getConfigFiles } from "./config.js";
import { getSourceFiles } from "./source.js";

export const WORKSPACE_FOLDER_NAME = ".workspace";
export const WORKSPACE_DIR = path.resolve(
  process.cwd(),
  "node_modules/@opsnoir/ts-kit",
  WORKSPACE_FOLDER_NAME
);

const createCleanWorkspace = async () => {
  if (!WORKSPACE_DIR.endsWith(".workspace")) {
    // If we're not deleting ".workspace/" then panic and exit for safety
    console.warn(
      "Did not create a clean workspace due to the path being wrong!"
    );
    process.exit(1);
  }

  await fs.emptyDir(WORKSPACE_DIR);
};

const writeFileToWorkspace = async (filename, contents) => {
  const dir = path.dirname(filename);
  await fs.ensureDir(path.resolve(WORKSPACE_DIR, dir));
  await fs.writeFile(path.resolve(WORKSPACE_DIR, filename), contents);
};

export const setupWorkspace = async () => {
  await createCleanWorkspace();

  for (let file of await getConfigFiles()) {
    await writeFileToWorkspace(file.filename, file.content);
  }

  for (let file of await getSourceFiles()) {
    await writeFileToWorkspace(file.filename, file.content);
  }
};
