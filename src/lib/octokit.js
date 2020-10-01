const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
});

module.exports = octokit;
