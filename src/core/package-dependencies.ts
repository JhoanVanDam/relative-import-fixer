import * as path from "path";

const packageJsonPath = path.resolve("package.json");

// Carga el archivo como texto
const text = require("fs").readFileSync(packageJsonPath, "utf-8");

// Parsea como JSON y accede a dependencias
const pkg = JSON.parse(text);
const allDeps = {
  ...pkg.dependencies,
  ...pkg.devDependencies,
  ...pkg.peerDependencies,
  ...pkg.optionalDependencies,
};

export const dependencyNames = Object.keys(allDeps);

console.log(dependencyNames);
