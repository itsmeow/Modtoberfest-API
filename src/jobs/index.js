const trackerJob = require("./tracker").job;
const trackerRun = require("./tracker").run;

function schedule() {
  console.log("[TASKS] Scheduling tasks...");

  // trackerJob.start();
  trackerRun();

  console.log("[TASKS] Tasks scheduled.");
}

module.exports = {
  schedule,
};
