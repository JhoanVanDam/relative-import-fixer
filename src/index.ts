import fs from "fs";
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
  const tsConfigPath = await ask("📁 Ruta a tsconfig.json (ej: ./tsconfig.json): ");
  const globPattern = await ask("🌀 Glob de archivos (ej: src/**/*.{ts,tsx}): ");

  rl.close();

  // 🔍 Validar que el archivo existe
  if (!fs.existsSync(tsConfigPath)) {
    console.error(`❌ No se encontró el archivo ${tsConfigPath}`);
    process.exit(1);
  }

  fixRelativeImports({ globPattern, tsConfigPath });
})();
