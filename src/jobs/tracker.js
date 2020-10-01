const CronJob = require("cron").CronJob;
const knex = require("../lib/knex");
const github = require("../lib/github");

function log(message) {
  console.log(`[Progress Tracker]: ${message}`);
}

async function run() {
  log("Starting");

  let newPr = 0;
  let newContributions = 0;

  try {
    const repos = await knex.table("repository").select("id", "repository_id");

    const participants = await knex
      .table("participant")
      .select("id", "github_id");

    const prs = await knex
      .table("pullrequest")
      .select("id", "github_id", "repository_id");

    const contributions = await knex("contribution").select("pr_id");

    log(`Processing ${repos.length} repositories`);

    for (const repo of repos) {
      const limit = new Date(Date.UTC(2020, 9, 1, 0, 0, 0));

      const repoPrs = await github.getPullRequests(repo.repository_id);

      // Go down the PRs until we hit the last one or October 1st
      for (const pr of repoPrs) {
        const createdAt = new Date(pr.created_at);

        // Make sure it's after October 1st
        if (limit.getTime() > createdAt.getTime()) break;

        // Check if not already in DB
        let prId = null;
        const existingPr = prs.find((p) => p.github_id == pr.id);
        if (existingPr) {
          prId = existingPr.id;
        } else {
          // Save new PR
          try {
            prId = await knex("pullrequest")
              .insert({
                repository_id: repo.id,
                github_id: pr.id,
                url: pr.html_url,
                author_github_id: pr.user.id,
                created_at: pr.created_at,
              })
              .returning("id");

            newPr += 1;

            if (!prId) {
              throw new Error("No insertion ID returned from saving PR");
            }
          } catch (error) {
            log(`Failed to save PR ${pr.number}: ${error}`);
            break;
          }
        }

        // Try to match it against a participant
        const participant = participants.find(
          (p) => p.github_id === pr.user.id.toString()
        );

        const existingContribution = contributions.find(
          (c) => c.pr_id === prId
        );

        if (!existingContribution && participant) {
          try {
            await knex("contribution").insert({
              pr_id: prId,
              participant_id: participant.id,
              repo_id: repo.id,
              valid: true,
            });

            newContributions += 1;
          } catch (error) {
            log(
              `Failed to save PR ${prId} for ${participant.id} (in ${repo.id}): ${error}`
            );
            break;
          }
        }
      }
    }
  } catch (error) {
    log(`Error running task: ${error}`);
  }

  log(
    `Task completed; ${newPr} new PRs, ${newContributions} new Contributions.`
  );
}

const job = new CronJob(
  "*/5 * * * *",
  async () => {
    return run();
  },
  () => {
    log("Job completed.");
  },
  false
);

module.exports = {
  job,
  run,
};
