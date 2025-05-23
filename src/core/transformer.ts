#!/usr/bin/env node

import fs from "fs";
import readline from "readline";
import { Project } from "ts-morph";

// 🔹 Crear interfaz de readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 🔹 Función para preguntar por consola
const ask = (question: string) =>
  new Promise<string>((resolve) => rl.question(question, resolve));

(async () => {
  // 🧠 Preguntar por los parámetros
  const tsConfigPath = await ask(
    "📁 Ruta a tsconfig.json (ej: ./tsconfig.json): "
  );
  const globPattern = await ask(
    "🌀 Glob de archivos (ej: src/**/*.{ts,tsx}): "
  );

  rl.close();

  // 🔍 Validar que el archivo existe
  if (!fs.existsSync(tsConfigPath)) {
    console.error(`❌ No se encontró el archivo ${tsConfigPath}`);
    process.exit(1);
  }

  // 🚀 Procesar archivos con ts-morph
  const project = new Project({ tsConfigFilePath: tsConfigPath });

  project.addSourceFilesAtPaths(globPattern);

  project.getSourceFiles().forEach((sourceFile) => {
    console.log("📄 Procesando archivo:", sourceFile.getBaseName());

    sourceFile.getImportDeclarations().forEach((importDecl) => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      if (moduleSpecifier.startsWith(".")) {
        importDecl.remove();
      }
    });

    sourceFile.fixMissingImports(
      {},
      {
        importModuleSpecifierPreference: "non-relative",
        importModuleSpecifierEnding: "minimal",
      }
    );

    sourceFile.organizeImports();
    console.log("✅ Arreglado:", sourceFile.getFilePath());
  });

  await project.save();
  console.log("🎉 Imports locales eliminados y reparados");
})();
