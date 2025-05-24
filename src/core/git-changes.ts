import simpleGit from "simple-git";

const git = simpleGit();

export async function checkGitStatusAndExitIfDirty() {
  const isClean = await git.status().then((status) => status.isClean());

  if (!isClean) {
    console.error("⛔ You have uncommitted changes. Please commit or stash them before running this script.");
    process.exit(1);
  }
}
