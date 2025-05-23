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
  console.log("📄 dependencies:", dependencies);

  project.addSourceFilesAtPaths(globPattern);

  project.getSourceFiles().forEach((sourceFile) => {
    console.log("📄 Procesando archivo:", sourceFile.getBaseName());

    sourceFile.getImportDeclarations().forEach((importDecl) => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      console.log("moduleSpecifier", moduleSpecifier);
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
