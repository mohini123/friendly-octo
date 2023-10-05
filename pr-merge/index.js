const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');

async function run() {
  try {
    const labels = core.getInput('labels').split(',');
    const octokit = new Octokit();

    // Fetch the list of merged PRs to the main branch
    const { data: mergedPRs } = await octokit.rest.pulls.listMerged({
      owner: process.env.GITHUB_REPOSITORY.split('/')[0],
      repo: 'special-dollop',
      base: 'main',
    });

    // Filter PRs by labels
    const prsWithLabels = mergedPRs.filter((pr) => {
      return labels.every((label) => pr.labels.some((prLabel) => prLabel.name === label));
    });

    console.log('INFO :: ', JSON.stringify(prsWithLabels, null, 2));

    // Print the filtered PRs
    core.setOutput('merged-prs', JSON.stringify(prsWithLabels));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
