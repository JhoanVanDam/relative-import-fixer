import { Project } from "ts-morph";
import { isNodeBuiltin, isPackageJsonDependency, isRelativeImport } from "utils/import-utils";

interface FixRelativeImportsProps {
  globPattern: string;
  tsConfigPath: string;
}

export async function fixRelativeImports({ globPattern, tsConfigPath }: FixRelativeImportsProps) {
  const project = new Project({ tsConfigFilePath: tsConfigPath });

  project.addSourceFilesAtPaths(globPattern);

  project.getSourceFiles().forEach((sourceFile) => {
    sourceFile.getImportDeclarations().forEach((importDecl) => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();

      // Solo procesamos imports relativos
      if (!isRelativeImport(moduleSpecifier)) return;
      // Solo procesamos imports relativos
      const resolvedFile = importDecl.getModuleSpecifierSourceFile();
      if (!resolvedFile) return;

      // Si no es un módulo de Node.js ni una dependencia externa, lo eliminamos
      const importName = resolvedFile.getBaseNameWithoutExtension();
      const isExternal = isNodeBuiltin(moduleSpecifier) || isPackageJsonDependency(importName);

      if (!isExternal) {
        importDecl.remove();
      }
    });

    // Reparar los imports faltantes y organizar
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
