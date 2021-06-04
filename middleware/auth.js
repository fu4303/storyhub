//ensureAuth()
/* 
 If the user is already logged in, then just carry on to the next thing, otherwise, redirect them to the root end point, which in this case should render the logged in page.
*/

/* 
ensureGuest()
if the user is a guest, then we run the next function, otherwise, we take them to the dashboard.
*/

module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },
  ensureGuest: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/dashboard");
    }
  },
};
