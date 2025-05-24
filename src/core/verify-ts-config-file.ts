import fs from "fs";

export function verifyTsConfigFile(tsConfigPath: string) {
  if (!fs.existsSync(tsConfigPath)) {
    console.error(`❌ File not found ${tsConfigPath}`);
    process.exit(1);
  }
}
