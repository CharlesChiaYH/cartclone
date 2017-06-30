//app.js is the "entry point" of the application that listens for request to routes//

//Import/requrie middleware//
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
//Require express-sessions to allow CSRF to function//
var session = require('express-session');
var passport = require ('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var dotenv = require('dotenv');
//import dotenv from 'dotenv';//
dotenv.load({path: '.env'});


//set MongoStore for 'connect-mongo' middleware package//
//'connect-mongo' is set up after sessions, and sessions//
//is passed as an argument to it//
var MongoStore = require('connect-mongo')(session);

//Set the routing//
var routes = require('./routes/index');
var userRoutes = require('./routes/user');

var app = express();

mongoose.connect(process.env.MONGODB_URI);

//Setup Passport methods from passport.js. Binding to variable is not required//
//this is done to avoid dumping all the code from passport.js into app.js//
require('./config/passport');


// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//Setup middleware//
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
//validator parses the body and retrieves the parameters from the request body//
//hence its position for setup is after cookieParser//
app.use(validator());

//'Connect-mongo' is uses here after requiring it (above), and incorporated to each initialised session//
//MongoStore takes in an object that configures the mongoose connection key to the current connection//
//Cookie determines session length with maxAge key - in milliseconds (180 = minutes)//
//Arguments for resave and saveUninitialized set to false, as per documentation recomendation//
app.use(session({
  secret: 'secretitem',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180*60*1000 }
}));
//Use Flash midleware - Session middleware has to be initialised first//
app.use(flash());
app.use(passport.initialize());
//Use Passport middleware - Session middleware has to be initialised first//
app.use(passport.session());
app.use(express.static(path.join(__dirname, '/public')));

//Create an exotess middlware function that executes on all requests//
//".locals" object is global variable available to all views//
app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

//"Use" the paths after setting it above. This will listen for requests to these routes//
app.use('/user', userRoutes);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//require('./seed/product-seeder.js');
module.exports = app;
