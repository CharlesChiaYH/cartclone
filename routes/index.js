var express = require('express');
var router = express.Router();

//Bringing in CSRF middleware protection//
var csrf = require('csurf');

var passport = require('passport');

//Bringing in product model from models folder//
var Product = require('../models/product');

var csrfProtect = csrf();
//Protect all routes in express-router with CSRF//
router.use(csrfProtect);

/* GET home page. */
router.get('/', function (req, res, next) {
    Product.find(function (err, docs) {
      var productPortion = [];
        var portionSize = 3;
        //argument: docs in this function refers to the compiled "documents" from seeder inside DB//
        console.log('here is the items ==' + docs);

        for (var i = 0; i < docs.length; i += portionSize) {
            productPortion.push(docs.slice(i, i + portionSize));
            //to display 3 items in a row, the "portion size" is kept at 3 items//
            //on first iteration, the push is a sliced array from "docs" (of 5 items in DB)//
            //in which index starts from index position 0 up, but not including, index position 3//
            //in 2nd iteration, the push is a sliced array from "docs", but from index position 3//
            //since "portion size" is added to i (which starts initially at zero), all the way to end (index position 4)//
            console.log("this is part of == " + i + "product chuncks =="+productPortion);
        }
        res.render('shop/index', {title: 'Shopping Cart', products: productPortion});
    });
});

//ROUTES FOR SIGN-UP//
//GET signup page//
router.get('/user/signup', function(req, res, next){
  var messages = req.flash('error'); //stores error message that may occur during this view, passed to render command below//
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

//Receive POST from signup page, and passport package uses the //
//"local.signup" strategy defined in passport.js, and an object//
//that tells it where to direct to, if on success of failure//
router.post('/user/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
  //flashes error message on unsuccessful sign-in. Message from passport.js//
}));

//GET to profile page upon successful sign-up//
router.get('/user/profile', function(req, res, next){
  res.render('user/profile');
});

//ROUTES FOR SIGN-IN//
router.get('/user/signin', function(req, res, next){
  var messages = req.flash('error'); //stores error message that may occur during this view, passed to render command below//
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

//create POST route for user sign-in - uses local.signin strategy set up in passport.js//
//Note that on sign-up failure, routed to sing-in page
router.post('/user/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true

}));


module.exports = router;
