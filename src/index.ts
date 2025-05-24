#!/usr/bin/env node

/**
 * @license MIT
 * Copyright (c) 2025 Jhoan Hernández
 */

import { Command } from "commander";
import { checkGitStatusAndExitIfDirty } from "core/git-changes";
import { hasAbsoluteTsconfigPaths } from "core/has-absolute-paths";
import { fixRelativeImports } from "core/transformer";
import { verifyTsConfigFile } from "core/verify-ts-config-file";

const program = new Command();

program
  .name("relative-import-fixer")
  .description("Fix and convert relative imports to absolute imports")
  .option("-f, --force", "skip Git check and force execution")
  .option("-t, --tsconfig <path>", "path to tsconfig.json", "tsconfig.json")
  .option("-g, --glob <pattern>", "glob pattern to match files", "src/**/*.{ts,tsx}")
  .parse(process.argv);

const options = program.opts();
console.log("options", options);

(async () => {
  if (!options.force) {
    await checkGitStatusAndExitIfDirty();
  }

  const tsConfigPath = options.tsconfig;
  const globPattern = options.glob;

  verifyTsConfigFile(tsConfigPath);
  hasAbsoluteTsconfigPaths(tsConfigPath);

  await fixRelativeImports({ globPattern, tsConfigPath });
})();
