var express = require("express");
var router = express.Router();
const knex = require("../lib/knex");
const getEventStage = require("../lib/stage");

router.get("/:id/progress", async function (req, res, next) {
  const { id } = req.params;

  try {
    const contributions = await knex
      .table("contribution")
      .select("participant_id", "repo_id")
      .groupByRaw("participant_id, repo_id")
      .where({ participant_id: id, valid: true });

    return res.json({ unique: contributions.length });
  } catch (error) {
    res.status(400);
    return res.json({ error: "Unable to get progress for user" });
  }
});

module.exports = router;
