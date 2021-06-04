const express = require("express");
const router = express.Router();
//This is object destructuring to bring in the middlewares needed
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Story = require("../models/Story");

//@desc Login/Landing Page
//@route GET/
//In the router method, middlewares are the second parameter.
router.get("/", ensureGuest, (req, res) => res.render("login", { layout: "login" }));

//@desc Dashboard
//@route GET/
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    //The lean method returns a smaller and less memory intensive version of the object
    const stories = await Story.find({ user: req.user.id }).lean();
    const storyCount = await Story.countDocuments({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      stories,
      storyCount,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
