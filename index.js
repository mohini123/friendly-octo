const core = require("@actions/core");
const { Octokit } = require("@octokit/rest");

async function getCommitsFromMainBranch(owner, repo) {
  const octokit = new Octokit();

  try {
    const response = await octokit.rest.repos.listCommits({
      owner,
      repo,
      sha: "main", // Change this to the default branch name if different
    });

    return response.data.map(info => info.commit);
  } catch (error) {
    throw new Error(`Failed to fetch commits: ${error.message}`);
  }
}

async function run() {
  try {
    const repositories = core.getInput("repositories").split(",");
    const owner = core.getInput("owner");

    const allCommits = [];

    for (const repo of repositories) {
      const commits = await getCommitsFromMainBranch(owner, repo.trim());
      allCommits.push({ repository: repo, commits });
    }

    console.log("INFO :: ", allCommits);

    core.setOutput("commit_data", JSON.stringify(allCommits));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
