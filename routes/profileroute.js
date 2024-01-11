

const express = require("express")
const router = express.Router()


const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  };
  



// profile protected route
router.get("/profile", checkAuthenticated, (req, res) => {
    res.send("profile :"+ req.session.passport.user);
  });

  

module.exports = router