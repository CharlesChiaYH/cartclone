//All User related routes here//

var express = require('express');
var router = express.Router();

//Bringing in CSRF middleware protection//
var csrf = require('csurf');

var passport = require('passport');

var csrfProtect = csrf();
//Protect all routes in express-router with CSRF//
router.use(csrfProtect);

//GET to profile page upon successful sign-up - and check if logged in//
//"isLoggedIn" function is invoked to ensure that following route calls//
//are available to proceed only if user is logged in//
router.get('/profile', isLoggedIn, function(req, res, next){
  res.render('user/profile');
});

//Create logout route, where .logout is a method in Passport package//
//logout is place in this order since it can only be available if user is logged in//
router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
});

//"router.use" targets all requests, and is placed after the first route call above//
//If the above calls are not satisfied, their "next" is invoked and user is redirected eventually to sign-up//
//This is to check that user is logged before allowing further access (like a filter)//
router.use('/', notLoggedIn, function(req, res, next){
  next();
});

//ROUTES FOR SIGN-UP//
//GET signup page//
router.get('/signup', function(req, res, next){
  var messages = req.flash('error'); //stores error message that may occur during this view, passed to render command below//
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

//Receive POST from signup page, and passport package uses the //
//"local.signup" strategy defined in passport.js, and an object//
//that tells it where to direct to, if on success of failure//
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
  //flashes error message on unsuccessful sign-in. Message from passport.js//
}));


//ROUTES FOR SIGN-IN//
router.get('/signin', function(req, res, next){
  var messages = req.flash('error'); //stores error message that may occur during this view, passed to render command below//
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

//create POST route for user sign-in - uses local.signin strategy set up in passport.js//
//Note that on sign-up failure, routed to sing-in page
router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));


module.exports = router;

//Protect the routes such that they can only be accessed if user is logged in//
//isLoggedIn function takes in an object with isAuthenticated -which is a method//
//packaged with passport middelware that manages the authentication state of the session, //
//if is successfully logged in passport sets isAuthenticated to true; must be "required" here in user.js//
function isLoggedIn(req,res, next){
  if (req.isAuthenticated()){
    return next();
  }
  //if not logged in, redirect to some place//
  res.redirect('/');
}

//A function to check that user is NOT logged in - logic is opposite of isLoggedIn//
function notLoggedIn(req,res, next){
  if (!req.isAuthenticated()){
    return next();
  }
  //if not logged in, redirect to some place//
  res.redirect('/');
}
