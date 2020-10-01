const octokit = require("./octokit");

async function getPullRequests(repoId) {
  const { data, status } = await octokit.request(
    "GET /repositories/:id/pulls?state=all",
    {
      id: repoId,
    }
  );

  if (status === 200) {
    return data;
  } else {
    throw new Error(`Failed to fetch pull requests for repository ${repoId}`);
  }
}

module.exports = {
  getPullRequests,
};
