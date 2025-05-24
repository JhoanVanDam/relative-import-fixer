import { NewLineKind, Project } from "ts-morph";
import { detectEOL, isNodeBuiltin, isPackageJsonDependency, isRelativeImport } from "utils/import-utils";

interface FixRelativeImportsProps {
  globPattern: string;
  tsConfigPath: string;
}

export async function fixRelativeImports({ globPattern, tsConfigPath }: FixRelativeImportsProps) {
  const project = new Project({ tsConfigFilePath: tsConfigPath });

  project.addSourceFilesAtPaths(globPattern);

  for (const sourceFile of project.getSourceFiles()) {
    sourceFile.getImportDeclarations().forEach((importDecl) => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();

      // Only process relative imports
      if (!isRelativeImport(moduleSpecifier)) return;

      const resolvedFile = importDecl.getModuleSpecifierSourceFile();
      if (!resolvedFile) return;

      // Remove if not Node.js builtin nor dependency
      const importName = resolvedFile.getBaseNameWithoutExtension();
      const isExternal = isNodeBuiltin(moduleSpecifier) || isPackageJsonDependency(importName);

      if (!isExternal) {
        importDecl.remove();
      }
    });

    // Fix missing imports and organize
    sourceFile.fixMissingImports(
      {},
      {
        importModuleSpecifierPreference: "non-relative",
        importModuleSpecifierEnding: "minimal",
      }
    );

    sourceFile.organizeImports();

    // Detect and set EOL per file before saving
    const eol = detectEOL(sourceFile.getFilePath());
    project.manipulationSettings.set({
      newLineKind: eol === "crlf" ? NewLineKind.CarriageReturnLineFeed : NewLineKind.LineFeed,
    });

    console.log("✅ Fixed:", sourceFile.getFilePath());
  }

  await project.save();
  console.log("🎉 Local imports removed and repaired");
}
