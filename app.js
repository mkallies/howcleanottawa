var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var flash = require('connect-flash');
var session = require('express-session');

//models

var Business = require('./models/business');
var User = require('./models/user');
var Comment = require('./models/comment');


//routes
var businessRoute = require('./routes/index');

mongoose.connect('mongodb://localhost/restaurants');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// PASSPORT CONFIG
app.use(require('express-session')({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// FLASH

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// ROUTES

app.use(businessRoute);


app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
