const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
//@desc Auth with Google
//@route GET/ auth/google
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

//@desc Google with callback
//@route GET/ auth/google/callback
//If it fails this redirects to the root and if it passes, this redirects to the dashboard
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => res.redirect("/dashboard")
);

//@desc Google with callback
//@route GET/ login/
router.get("/login/", (req, res, next) => {
  const user = {
    firstName: "Demo User",
    email: "demo-user@gmail.com",
    password: "halifax-baby",
    lastName: "demo-lastName",
  };

  req.body = user;

  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.json({ error: info });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect("/dashboard");
    });
  })(req, res, next);
});

//DEMO User Authentication
router.get("/signup/", async (req, res, next) => {
  try {
    const newUser = new User({
      firstName: "Demo User",
      email: "demo-user@gmail.com",
      password: "halifax-baby",
      lastName: "demo-lastName",
    });

    req.body = newUser;

    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.json({ msg: "Account with that email address or username already exists" });
    }

    await newUser.save();

    req.login(newUser, function (err) {
      if (err) return next(err);
      return res.redirect("/dashboard");
    });
  } catch (error) {
    console.error(error);
  }
});

//@desc Logout user
//@route /auth/logout
router.get("/logout", (req, res) => {
  //The passport request body comes with a logout method
  req.logout();
  res.redirect("/");
});
module.exports = router;
