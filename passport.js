
const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const makeUser = require("./makeUser");
const makeSchool = require("./makeSchool");

passport.use("school",
  new LocalStrategy(async (username, password, done) => {
    try {
      //const user = await User.findOne({ username: username });
        
        var user;
        await makeUser.contract.methods.schoolMembership(username).call().then(function(object){
        user =  object;});
        console.log("passport.js : user : ", user);
      
      if (!user) {
        return done(null, false, { message: "Incorrect Username" });
      }
      if ((!password)) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);


passport.use("user",
  new LocalStrategy(async (username, password, done) => {
    try {
      //const user = await User.findOne({ username: username });
        
        var user;
        await makeUser.contract.methods.membership(username).call().then(function(object){
        user =  object;});
        console.log("passport.js : user : ", user.email);
      
      if (!user) {
        return done(null, false, { message: "Incorrect Username" });
      }
      if ((!password)) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// create session id
// whenever we login it creares user id inside session
passport.serializeUser((user, done) => {
  if(user.is_admin!= 2){
  done(null, user.email);
  }
  else{
    done(null, user.schoolName);
  }
});

// find session info using session id
passport.deserializeUser(async (email, done) => {
  try {
    var user;
    await makeUser.contract.methods.membership(email).call().then(function(object){
    user = object;});
    if(!user.email){
      await makeUser.contract.methods.schoolMembership(email).call().then(function(object){
        user = object;});
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});
