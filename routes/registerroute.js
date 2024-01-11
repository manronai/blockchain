

const express = require("express")
const router = express.Router()
const User = require("../models/mymodel");
const makeUser = require("../makeUser");
const makeSchool = require("../makeSchool");


const checkLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect("/profile");
    }
    next();
  };
  

  



// register : get
router.get("/student_register", (req, res) => {
    res.render("registers/student_register");
  });
  
  
  router.post("/student_register", async (req, res) => {
    try {
      //const newUser = new User(req.body);
      const  addr= req.body.addr;
      const privateKey= req.body.privateKey;
      const newUser = new User.r(req.body.username, req.body.password, addr, privateKey);
     // User.users[newUser.email] = newUser;
      //console.log(User.users);
      //await newUser.save();
      const  email= req.body.username;
      const password= req.body.password;
      
      
  
      await makeUser.make_User(email, password, addr, privateKey);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json(error.message);
    }
  });
  
  
// register : get
router.get("/school_register",  (req, res) => {
  res.render("registers/school_register");
});


router.post("/school_register", async (req, res) => {
  try {
    //const newUser = new User(req.body);
    const  addr= req.body.addr;
    const privateKey= req.body.privateKey;
    const newUser = new User.r(req.body.username, req.body.password, addr, privateKey);
   // User.users[newUser.email] = newUser;
    //console.log(User.users);
    //await newUser.save();
    const  email= req.body.username;
    const password= req.body.password;
    
    

    await makeSchool.make_school(email, password, addr, privateKey);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
  module.exports = router
  