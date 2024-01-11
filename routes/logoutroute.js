


const express = require("express")
const router = express.Router()









router.get("/logout", (req, res) => {
    try {
      req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/login/admin_login");
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  module.exports = router