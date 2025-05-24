import { Project } from "ts-morph";
import { isNodeBuiltin, isPackageJsonDependency, isRelativeImport, isSideEffectImport } from "utils/import-utils";

interface FixRelativeImportsProps {
  globPattern: string;
  tsConfigPath: string;
}

export async function fixRelativeImports({ globPattern, tsConfigPath }: FixRelativeImportsProps) {
  const project = new Project({ tsConfigFilePath: tsConfigPath });

  project.addSourceFilesAtPaths(globPattern);

  for (const sourceFile of project.getSourceFiles()) {
    let hasChanged = false;

    const diagnostics = sourceFile.getPreEmitDiagnostics();
    const hasErrrors = diagnostics.length > 0;

    if (hasErrrors) {
      // El archivo tiene errores
      console.log(`Errors in file ${sourceFile.getFilePath()}:`);
      console.log(
        sourceFile
          .getPreEmitDiagnostics()
          .map((d) => d.getMessageText())
          .join("\n")
      );
      hasChanged = true;
    }

    sourceFile.getImportDeclarations().forEach((importDecl) => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();

      // Only process non sideEffect imports
      if (isSideEffectImport(importDecl)) return;
      // Only process relative imports
      if (!isRelativeImport(moduleSpecifier)) return;

      const resolvedFile = importDecl.getModuleSpecifierSourceFile();
      if (!resolvedFile) return;

      // Remove if not Node.js builtin nor dependency
      const importName = resolvedFile.getBaseNameWithoutExtension();
      const isExternal = isNodeBuiltin(moduleSpecifier) || isPackageJsonDependency(importName);

      if (!isExternal) {
        importDecl.remove();
        hasChanged = true;
      }
    });

    if (!hasChanged || !hasErrrors) continue;

    // Fix missing imports and organize
    sourceFile.fixMissingImports(
      {},
      {
        importModuleSpecifierPreference: "non-relative",
        importModuleSpecifierEnding: "minimal",
      }
    );

    sourceFile.organizeImports();

    if (hasChanged) {
      await sourceFile.save();
      console.log("✅ Fixed and saved:", sourceFile.getFilePath());
    }
  }

  console.log("🎉 Local imports removed and repaired");
}
