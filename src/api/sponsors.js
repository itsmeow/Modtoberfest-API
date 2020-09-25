var express = require("express");
var router = express.Router();
const knex = require("../lib/knex");
const getEventStage = require("../lib/stage");

router.get("/", async function (req, res, next) {
  const sponsors = await knex.table("sponsor").select().orderByRaw("RANDOM()");

  if (getEventStage() === "pre") {
    sponsors.push({
      name: "More coming soon!",
      github_user: "Modtoberfest",
      website_url: "https://modtoberfest.com/faq",
    });
  }

  return res.json(sponsors);
});

module.exports = router;
