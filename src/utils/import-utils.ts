import { dependencyNames } from "core/package-dependencies";
import fs from "fs";
import * as module from "module";
import { ImportDeclaration } from "ts-morph";

export function isRelativeImport(path: string) {
  return path.startsWith(".");
}

export function isNodeBuiltin(path: string) {
  return module.builtinModules.includes(path);
}

export function isPackageJsonDependency(importName: string) {
  return dependencyNames.includes(importName);
}

export function detectEOL(filePath: string): "lf" | "crlf" {
  const content = fs.readFileSync(filePath, "utf8");
  const crlfCount = (content.match(/\r\n/g) || []).length;
  const lfCount = (content.match(/(?<!\r)\n/g) || []).length;
  return crlfCount > lfCount ? "crlf" : "lf";
}

export function isSideEffectImport(importDecl: ImportDeclaration): boolean {
  const hasNoNamedImports = importDecl.getNamedImports().length === 0;
  const hasNoDefaultImport = importDecl.getDefaultImport() === undefined;
  const hasNoNamespaceImport = importDecl.getNamespaceImport() === undefined;

  return hasNoNamedImports && hasNoDefaultImport && hasNoNamespaceImport;
}
