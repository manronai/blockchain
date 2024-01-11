const express = require("express")
const router = express.Router()
const push_in_apply_array = require("../push_in_apply_array")

router.get("/apply", (req, res)=>{
    res.render("student_pages/apply_for_cert", {EMAIL: req.session.passport.user})
})

router.post("/apply",async (req, res)=>{
    var usr;
        await push_in_apply_array.contract.methods.membership(req.session.passport.user).call().then(function(object){
        usr =  object;});
       // console.log("passport.js : user : ", usr.email);

    await push_in_apply_array.push_in_apply_array_function(usr.email, req.body.schoolname, req.body.password, usr.addr, usr.privateKey);
    console.log(usr);
    req.session.applied_flag = true;
    res.redirect("/student/status");
})

router.get("/status", async (req, res)=>{
    var usr;
        await push_in_apply_array.contract.methods.membership(req.session.passport.user).call().then(function(object){
        usr =  object;});
    if(usr.fileHash){
        var pass = {status: usr.fileHash, EMAIL: req.session.passport.user}
    }
    else if (!usr.fileHash && req.session.applied_flag){
        var pass = {status: "Pending", EMAIL: req.session.passport.user}
    }
    else{
        var pass = {status: "Not Applied Yet!", EMAIL: req.session.passport.user}
    }

    res.render("student_pages/see_hash_if_available", pass)
})


module.exports = router;