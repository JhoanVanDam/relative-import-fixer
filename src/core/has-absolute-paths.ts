import fs from "fs";
import path from "path";

export function hasAbsoluteTsconfigPaths(tsconfigPath: string): void {
  const fullPath = path.resolve(tsconfigPath);
  const config = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  const hasPaths = config?.compilerOptions?.paths && Object.keys(config.compilerOptions.paths).length > 0;
  if (!hasPaths) {
    console.error(`❌ No absolute paths have been defined`);
    process.exit(1);
  }
}
