var express = require("express");
var router = express.Router();
const knex = require("../lib/knex");

router.get("/", async function (req, res, next) {
  const repositories = await knex
    .table("repository")
    .select(
      "repository.name as repository_name",
      "repository.description",
      "repository.url",
      "sponsor.name as sponsor_name",
      "sponsor.id as sponsor_id"
    )
    .join("sponsor", "sponsor.id", "repository.sponsor_id")
    .orderByRaw("RANDOM()");

  return res.json(repositories);
});

module.exports = router;
