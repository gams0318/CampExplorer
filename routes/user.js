const express = require("express");
const router = express.Router();
const User = require("../models/users");
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const users = require("../controllers/user");
router
  .route("/register")
  .get(users.register)
  .post(catchAsync(users.registerNewUser));

router
  .route("/login")
  .get(users.login)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.userLogin
  );

router.get("/logout", users.logout);
module.exports = router;
