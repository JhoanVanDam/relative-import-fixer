import { checkGitStatusAndExitIfDirty } from "core/git-changes";
import { hasAbsoluteTsconfigPaths } from "core/has-absolute-paths";
import { fixRelativeImports } from "core/transformer";
import { verifyTsConfigFile } from "core/verify-ts-config-file";
import readline from "readline";
// 🔹 Crear interfaz de readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 🔹 Función para preguntar por consola
const ask = (question: string) => new Promise<string>((resolve) => rl.question(question, resolve));

(async () => {
  // 🧠 Preguntar por los parámetros

  await checkGitStatusAndExitIfDirty();

  const tsConfigPathInput = await ask("📁 Path to tsconfig.json (ex: ./tsconfig.json): ");
  const globPatternInput = await ask("🌀 Glob files (ex: src/**/*.{ts,tsx}): ");

  const tsConfigPath = tsConfigPathInput.trim() || "tsconfig.json";
  const globPattern = globPatternInput.trim() || "src/**/*.{ts,tsx}";

  verifyTsConfigFile(tsConfigPath);
  hasAbsoluteTsconfigPaths(tsConfigPath);

  rl.close();

  fixRelativeImports({ globPattern, tsConfigPath });
})();
