import { dependencyNames } from "core/package-dependencies";
import * as module from "module";

export function isRelativeImport(path: string) {
  return path.startsWith(".");
}

export function isNodeBuiltin(path: string) {
  return module.builtinModules.includes(path);
}

export function isPackageJsonDependency(importName: string) {
  return dependencyNames.includes(importName);
}
