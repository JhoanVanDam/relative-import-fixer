import fs from "fs";
import { Project } from "ts-morph";
import { dependencyNames } from "./package-dependencies";

interface FixRelativeImportsProps {
  globPattern: string;
  tsConfigPath: string;
}

export async function fixRelativeImports({ globPattern, tsConfigPath }: FixRelativeImportsProps) {
  // 🚀 Procesar archivos con ts-morph

  console.log("globPattern", globPattern, " tsConfigPath", tsConfigPath);

  // 🔍 Validar que el archivo existe
  if (!fs.existsSync(tsConfigPath)) {
    console.error(`❌ No se encontró el archivo ${tsConfigPath}`);
    process.exit(1);
  }

  const project = new Project({ tsConfigFilePath: tsConfigPath });

  const dependencies = dependencyNames;
  console.log("📄 dependencies:", dependencies);

  project.addSourceFilesAtPaths(globPattern);

  // 🔍 Recorrer archivos

  project.getSourceFiles().forEach((sourceFile) => {
    console.log("📄 Procesando archivo:", sourceFile.getBaseName());

    sourceFile.getImportDeclarations().forEach((importDecl) => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      const resolvedSourceFile = importDecl.getModuleSpecifierSourceFile();
      const pathDeclaration = resolvedSourceFile?.getFilePath();
      console.log("moduleSpecifier", moduleSpecifier);
      console.log("pathDeclaration", pathDeclaration);
      if (!pathDeclaration) return;
      const isLib = dependencies.includes(pathDeclaration);
      if (isLib) {
        console.log(`${moduleSpecifier} isLib ${isLib} `);
      }

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
}
