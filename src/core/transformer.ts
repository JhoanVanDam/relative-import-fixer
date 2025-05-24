import { Project } from "ts-morph";
import { dependencyNames } from "./package-dependencies";

interface FixRelativeImportsProps {
  globPattern: string;
  tsConfigPath: string;
}

export async function fixRelativeImports({ globPattern, tsConfigPath }: FixRelativeImportsProps) {
  // 🚀 Procesar archivos con ts-morph

  const project = new Project({ tsConfigFilePath: tsConfigPath });

  const dependencies = dependencyNames;

  project.addSourceFilesAtPaths(globPattern);

  // 🔍 Recorrer archivos

  project.getSourceFiles().forEach((sourceFile) => {
    console.log("📄 Processing file:", sourceFile.getBaseName());

    sourceFile.getImportDeclarations().forEach((importDecl) => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      const resolvedSourceFile = importDecl.getModuleSpecifierSourceFile();
      const pathDeclaration = resolvedSourceFile?.getFilePath();
      if (!pathDeclaration) return;
      const isLib = dependencies.includes(pathDeclaration);
      if (isLib) return; //is node module lib

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
    console.log("✅ Fixed:", sourceFile.getFilePath());
  });

  await project.save();
  console.log("🎉 Local imports removed and repaired");
}
