// match from database authentication
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ejs = require("ejs");
//const mongoose = require("mongoose");
//const User = require("./models/user.model");








require("./passport");
const passport = require("passport");
const session = require('express-session');	//To Acquire it
const FileStore = require("session-file-store")(session)


const loginR = require("./routes/loginroute")
const registerR = require("./routes/registerroute")
const profileR = require("./routes/profileroute")
const uploadR = require("./routes/uploadroute")
const logoutR = require("./routes/logoutroute")
const schoolR = require("./routes/schoolroute")
const studentR = require("./routes/studentroute")
const companyR = require("./routes/companyroute")



const app = express();
const PORT = process.env.PORT || 5000;
//const dbURL = process.env.MONGO_URL;


//app.set('views', __dirname + '\\views');
app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("trust proxy", 1);

app.use(session({ 		//Usuage
  store : new FileStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
 // cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());



/*
mongoose
  .connect(dbURL)
  .then(() => {
    console.log("mongodb atlas is connected");
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
*/

app.use("/register", registerR);
app.use("/login", loginR);
app.use("/profile", profileR);
app.use("/upload", uploadR);
app.use("/logout", logoutR);
app.use("/school", schoolR);
app.use("/student", studentR);
app.use("/company", companyR);



/*
app.post("/login", async (req, res) => {
  try {
    const  email= req.body.username;
    const password= req.body.password;
    
   // const user = await User.findOne({ email: email });
    console.log(email);
    console.log(User.users);
    let obj ;
    await makeUser.contract.methods.membership(email).call().then(function(object){
      obj = object;
    })
    /*
    if (User.users[email] && User.users[email].password === password) {
      res.status(200).json({ status: "valid user" });
    } else {
      res.status(404).json({ status: "Not valid user" });
    }
    *
    if (obj) {

      res.status(200).json(obj);
    } else {
      res.status(404).json({ status: "Not valid user" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
}); */

// logout route

// route not found error
/*
app.use((req, res, next) => {
  res.status(404).json({
    message: "route not found",
  });
});
*/
//handling server error
/*
app.use((err, req, res, next) => {
  res.status(500).json({
    message: "something broke",
  });
});
*/



app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
