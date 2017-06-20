//Passport.js contains the signin/signup strategies//

var passport = require('passport');
var User = require('../models/users');

//Import passport-local strategy object//
var LocalStrategy = require('passport-local').Strategy;


//SIGN UP Strategy//
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
    //since passReqToCallback is true above, the request body is passed to function below//
    //therefore, Validator can be applied here to check body of the Request for valid entry//
    console.log(email, password);
    //"checkBody" is a function in Validator. 1st parameter is what is to be checked, 2nd parameter returns response//
    //when validation fails. Chaining with isEmpty and isEmail are Validator functions//
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
    //Assign a variable for errors that requests error with validationErrors//
    //validationErrors is a built-in function in Validator.//
    var errors = req.validationErrors();
    if(errors){
      //if there are errors, a variable assigned to an array will store the error messages//
      //the forEach function will loop through and push each error message into message array//
      //"error.msg" is a Validator package syntax that refers the property containing only the message//
      var messages = [];
      errors.forEach(function(error){
        messages.push(error.msg);
      });
      return done(null, false, req.flash('error', messages));
      //Above: return null because no tech error, false becasue not success//
      //and req.flash the error messages from checkBody into "messages" handlebar in views//
    }
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
      //with property fields of "email" and encrypted "password". Note the newUser password is//
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

//SIGN-IN strategy//
//Most of the following code is from SIGN-UP strategy
passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done){
    //Sign-in will require validation in case user forgets password or makes a typo//
    //Here, the validation will be for proper email entry and non-empty password field//
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if(errors){

      var messages = [];
      errors.forEach(function(error){
        messages.push(error.msg);
      });
      return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email':email}, function(err, user){
      //on first "if", if an error is found, return an error//
      if (err){
        return done(err);
      }
      //if User is NOT found, the error message passed by flash message//
      if (!user){
        return done(null, false, {message: 'Sorry, no such User'});
      }
      //If password is wrong, return error message//
      if (!user.validPassword(password)){
        return done(null, false, {message: 'Sorry, wrong password'});
      }
      //If no technical erros, user is found, and password is valid,//
      //return donw and the user, wheere user is from database//
      return done(null, user);
    });
}));
