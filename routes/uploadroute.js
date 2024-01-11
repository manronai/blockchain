
const express = require("express")
const router = express.Router()
const makeUser = require("../makeUser");
const moralis_upload = require("../moralis_ipfs")
const multer = require("multer")
const fs = require('fs');
const path = require("path")
const uplaodedFileHash = require("../uploadFileHash")
const remove_from_applied = require("../remove_from_applied")
const push_stu_name_password = require("../MAP_NAME_PASS.js")

const uploadDirectory = "./views/uploads/";
var filename;


const storage = new multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, uploadDirectory);
  },
  filename: function(req, file, cb){
    var extention_name = path.extname(file.originalname);
    var noExtfilename = file.originalname.replace(extention_name, "").toLowerCase().split(" ").join("-")+ Date.now();
    //filename = noExtfilename+extention_name;
    filename = req.session.passport.applicant_name + extention_name;
    cb(null,  filename);
  }
})

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb)=>{
    if(file.mimetype == "image/png"){
      cb(null, true);
    }else{
      cb(new Error("This is an error message"))
    }
  }
})



router.get("/upload", (req, res)=>{
    console.log(req.session.passport.applicant_name)
                
    res.render("fileUplaod", {title: req.session.passport.applicant_name , school: req.session.passport.user})
  })
  
  router.post("/upload", upload.single("avater"), async (req, res)=>{
    try{
    
    var hash = await moralis_upload.upLoadToIPFS(filename,uploadDirectory+filename);
    
    console.log(hash);
    let obj ;
      await makeUser.contract.methods.membership(req.session.passport.applicant_name).call().then(function(object){
        obj = object;
      })
     // console.log(obj);
    await uplaodedFileHash.upload_file_hash(obj.email, hash[0].path, obj.addr, obj.privateKey);
    
    
    const dir = uploadDirectory+filename;
  
  // delete directory recursively
    try {
      fs.rm(dir, { recursive: true, force: true }, (error) => {
        //you can handle the error here
        console.log(error);
    });
  
      console.log(`${dir} is deleted!`);
    } catch (err) {
      console.error(`Error while deleting ${dir}.`);
    }
  }
  catch(error){
    console.log(error);
  }
  //file upload and fileHash varible is set now delete applicant 
  var usr;
    console.log(req.session.passport.user);
    await push_stu_name_password.contract.methods.schoolMembership(req.session.passport.user).call().then((obj)=>{
        usr = obj;
        console.log(usr);
    });

    
    console.log("dksj")
    
    await remove_from_applied.remove_from_applied_function(req.session.passport.applicant_name, req.session.passport.user, usr.addr, usr.privateKey)
    
  res.redirect("/school/applications");
  })

  module.exports = router;


