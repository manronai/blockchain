// match from database authentication
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ejs = require("ejs");
//const mongoose = require("mongoose");
//const User = require("./models/user.model");
const User = require("./models/mymodel");
const makeUser = require("./makeUser");

const app = express();
const PORT = process.env.PORT || 5000;
//const dbURL = process.env.MONGO_URL;



app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/./views/index.html");
});

// register : get
app.get("/register", (req, res) => {
  res.render("register");
});


app.post("/register", async (req, res) => {
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


// login : get
app.get("/login", (req, res) => {
  res.render("login");
});


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
    */
    if (obj) {

      res.status(200).json(obj);
    } else {
      res.status(404).json({ status: "Not valid user" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// route not found error
app.use((req, res, next) => {
  res.status(404).json({
    message: "route not found",
  });
});

//handling server error
app.use((err, req, res, next) => {
  res.status(500).json({
    message: "something broke",
  });
});

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
