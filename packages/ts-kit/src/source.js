import path from "path";
import fs from "fs-extra";
import recursive from "recursive-readdir";

const PACKAGE_DIR = process.cwd();
const SOURCE_DIR = path.resolve(process.cwd(), "src");

export const getSourceFiles = async () => {
  const filenames = await recursive(SOURCE_DIR);
  return Promise.all(
    filenames.map(async (f) => {
      return {
        filename: f.replace(PACKAGE_DIR, "").substring(1), // skip first char as its a '/'
        content: await fs.readFile(f),
      };
    })
  );
};
