const express = require("express")
const router = express.Router()
const makeUser = require("../makeUser")


router.get("/verify", (req, res)=>{
    res.render("company/take_input")
})

router.post("/verify",async (req, res)=>{
    var usr;
    console.log(req.session.passport.user);
    await makeUser.contract.methods.membership(req.body.username).call().then((obj)=>{
        usr = obj;
        console.log(usr);
    });
    if(usr.fileHash==req.body.hash){
        var verify = { verify: "verified"}
    }
    else{
        var verify = { verify: "Not recognized"}
    }
    res.render("company/verified_result", verify)
})

module.exports = router