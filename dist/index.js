#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// bin/index.ts
var import_fs = __toESM(require("fs"));
var import_readline = __toESM(require("readline"));
var import_ts_morph = require("ts-morph");
var rl = import_readline.default.createInterface({
  input: process.stdin,
  output: process.stdout
});
var ask = (question) => new Promise((resolve) => rl.question(question, resolve));
(async () => {
  const tsConfigPath = await ask(
    "\u{1F4C1} Ruta a tsconfig.json (ej: ./tsconfig.json): "
  );
  const globPattern = await ask(
    "\u{1F300} Glob de archivos (ej: src/**/*.{ts,tsx}): "
  );
  rl.close();
  if (!import_fs.default.existsSync(tsConfigPath)) {
    console.error(`\u274C No se encontr\xF3 el archivo ${tsConfigPath}`);
    process.exit(1);
  }
  const project = new import_ts_morph.Project({ tsConfigFilePath: tsConfigPath });
  project.addSourceFilesAtPaths(globPattern);
  project.getSourceFiles().forEach((sourceFile) => {
    console.log("\u{1F4C4} Procesando archivo:", sourceFile.getBaseName());
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
        importModuleSpecifierEnding: "minimal"
      }
    );
    sourceFile.organizeImports();
    console.log("\u2705 Arreglado:", sourceFile.getFilePath());
  });
  await project.save();
  console.log("\u{1F389} Imports locales eliminados y reparados");
})();
