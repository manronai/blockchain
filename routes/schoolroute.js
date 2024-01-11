
const express = require("express")
const router = express.Router()
const push_stu_name_password = require("../MAP_NAME_PASS")


const checkLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect("/profile");
    }
    next();
  };
  

  

router.get("/input_students", (req, res)=>{
    res.render("school_pages/student_name_pass_entry",{title: req.session.passport.user})
})

router.post("/input_students", async (req, res)=>{
    var usr;
    console.log(req.session.passport.user);
    await push_stu_name_password.contract.methods.schoolMembership(req.session.passport.user).call().then((obj)=>{
        usr = obj;
        console.log(usr);
    });
    if(usr.is_admin==2){
    await push_stu_name_password.map_student_name_and_password(req.body.student_name, usr.schoolName, req.body.password, usr.addr, usr.privateKey);
    res.send("student data saved");}
    else{
        res.send("failed uploading data")
    }


})




router.get("/applications",async (req, res)=>{

    var usr;
    console.log(req.session.passport.user);
    await push_stu_name_password.contract.methods.schoolMembership(req.session.passport.user).call().then((obj)=>{
        usr = obj;
        console.log(usr);
    });
    var string = usr.applied_for_cert;
    //Trim the string first
    string = string.trim()

    var string_array = string.split(" ")
    var new_string_array = [];
    console.log(string_array.length);
    for(var str of string_array){
        
        str = str.trim();
        if(str){
            new_string_array.push(str)
        }
    }
    
    console.log(new_string_array);
    res.render("school_pages/check_applications", {applications: new_string_array, title: req.session.passport.user});
})

router.post("/applications",async (req, res)=>{
    req.session.passport.applicant_name = req.body.username;
    console.log("schoolroute: ", req.body.username, " ", req.session.passport.applicant_name)
    res.redirect("/upload/upload")

})

//router.post("/")
module.exports = router
