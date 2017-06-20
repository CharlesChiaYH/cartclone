//Passport.js contains the signin/signup strategies//

var passport = require('passport');
var User = require('../models/users');

//Import passport-local strategy object//
var LocalStrategy = require('passport-local').Strategy;

//Store User in the session by storing a serilaized ID.//
passport.serializeUser(function(user, done){
  done(null, user.id);
});

//Deserializer takes in user ID property as an arguement in current session//
passport.deserializeUser(function(id, done){
  //checks User model and find by ID, first function callback is an error,//
  //second callback is that user is found//
  User.findById(id, function(err, user){
    done(err, user);
  });
});

//Utilize the "use" method in passport for creating local signup strategy//
//localStrategy constructor takes in two arguments: a javascript object, and//
//a callback. The javascript objects refer to class name in handlebars doc//
passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
  //passReqToCallback set to true to pass infor back to call back function below//
  //The callback function receives this request and checks User DB for ext'g user//
  //
}, function(req, email, password, done){
    console.log(email, password);
    User.findOne({'email':email}, function(err, user){
      //on first "if", if an error is found, return an error//
      if (err){
        return done(err);
      }
      //if User is found, null (no error is returned), but this is still not a successful result//
      // hence a "false" argument is passed, and a flash message is displayed in error message//
      //area in signup.hbs//
      if (user){
        return done(null, false, {message: 'This email is already taken'});
      }
      //if no matches in DB during this request, new User is created in DB//
      //with property fields of "email" and "password". Note the newUser password is//
      //the encrypted password created from user.js//
      var newUser = new User();
      newUser.email = email;
      newUser.password = newUser.encryptPassword(password);
      //Save this this new user//
      newUser.save(function(err, result){
        if (err){
          return done(err);
        }
        return done (null, newUser);
      });
    });
}));
