

const express = require("express")
const router = express.Router()
const passport = require("passport");

const checkLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect("/profile");
    }
    next();
  };
  
  





// login : get
router.get("/admin_login",checkLoggedIn, (req, res) => {
    res.render("logins/admin_login");
  });
  
  router.post("/admin_login",  passport.authenticate("user", {
    failureRedirect: "/admin_login"
  }), (req, res)=> {
    res.redirect("admin");
  })

  //admin page
  router.get("/admin", (req, res)=>{
    res.render("admin_page");
  })
  
  // login : get
router.get("/student_login",checkLoggedIn, (req, res) => {
  res.render("logins/student_login");
});

router.post("/student_login",  passport.authenticate("user", {
  failureRedirect: "/student_login",
  successRedirect: "/student/apply",
}))

// login : get
router.get("/school_login",checkLoggedIn, (req, res) => {
  res.render("logins/school_login");
});

router.post("/school_login",  passport.authenticate("school", {
  failureRedirect: "/school_login"}),
  (req, res)=>{res.redirect("/school/applications")}
)



  module.exports = router;