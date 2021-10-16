const express = require("express");
const {
  login,
  confirmAccount,
  forgetPassword,
  resetPassword,
} = require("../controller/auth");
const router = express.Router();
router.route("/login").post(login);
router.route("/:token").get(confirmAccount);
router.route("/forgotPassword/").post(forgetPassword);
router.route("/resetPassword/:id").post(resetPassword);
module.exports = router;
