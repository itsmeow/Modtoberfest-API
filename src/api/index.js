var express = require("express");
var router = express.Router();

router.use("/participants", require("./sponsors"));
router.use("/repositories", require("./repositories"));

module.exports = router;
