const express = require("express");
const { confirmAccount } = require("../controller/auth");
const router = express.Router();

router.route("/:token").get(confirmAccount);
module.exports = router;
