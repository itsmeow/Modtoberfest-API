const trackerJob = require("./tracker").job;

function schedule() {
  console.log("[TASKS] Scheduling tasks...");

  trackerJob.start();

  console.log("[TASKS] Tasks scheduled.");
}

module.exports = {
  schedule,
};
