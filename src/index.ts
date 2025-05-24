import readline from "readline";
import { fixRelativeImports } from "./core/transformer";
// 🔹 Crear interfaz de readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 🔹 Función para preguntar por consola
const ask = (question: string) => new Promise<string>((resolve) => rl.question(question, resolve));

(async () => {
  // 🧠 Preguntar por los parámetros
  const tsConfigPathInput = await ask("📁 Ruta a tsconfig.json (ej: ./tsconfig.json): ");
  const globPatternInput = await ask("🌀 Glob de archivos (ej: src/**/*.{ts,tsx}): ");

  const tsConfigPath = tsConfigPathInput.trim() || "tsconfig.json";
  const globPattern = globPatternInput.trim() || "src/**/*.{ts,tsx}";

  rl.close();

  fixRelativeImports({ globPattern, tsConfigPath });
})();
