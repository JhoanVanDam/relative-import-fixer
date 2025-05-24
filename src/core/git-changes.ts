import simpleGit from "simple-git";

const git = simpleGit();

export async function checkGitStatusAndExitIfDirty() {
  const status = await git.status();

  const hasChanges = status.files.length > 0 || status.created.length > 0 || status.modified.length > 0 || status.not_added.length > 0 || status.deleted.length > 0 || status.renamed.length > 0;

  if (hasChanges) {
    console.error("❌ The repository has uncommitted or modified files. Save or commit your changes before continuing.");
    process.exit(1);
  }
}
