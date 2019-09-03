/*jshint esversion: 6 */
const express = require('express');
const expressLayout = require('express-layout');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const port = process.env.PORT || 3000;
const routes = require('./routes/index');
const users = require('./routes/users');
const auth = require('./routes/auth');
const User = require('./models/user');

//set DB connection
var db = require('./config/keys').MongoURI;
//connect to mongo using mongoose
mongoose.connect(db, {
  newURLParser: true
}).then(() => console.log("MongoDB connected")).catch(err => console.log(err));

//use sessions for tracking logins
// The saveUninitialized option will force a brand to the session store
app.use(session({
  secret: 'Dont steal my cookies',
  resave: true,
  saveUninitialized: false
}));
//initialize passport middleware for use
app.use(passport.initialize());

//passport uses sessions to seamlessly naviagte restricted areas via persistent login
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.currentUser = req.session.userID;
  next();
});


// parse incoming requests
app.use(bodyParser.urlencoded({
  extended: false
}));


app.use('/auth', auth)
app.use(bodyParser());
//app.use(expressLayout());
//use public dir
app.use(express.static(path.join(__dirname, 'public')));
// view engine setup
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('view options', {
  layout: '/views/layout.ejs'
});


// include routes
app.use('/', routes);
app.use('/users', users);
//If someone does a facebook login for the first time we want to make a new account
//else let's not make a new account, let's just update their account incase they changed
// their facebook display name

function generateOrFindUser(accessToken, refreshToken, profile, done) {
  if (profile.emails[0].value) {
    User.findOneAndUpdate({
        email: profile.emails[0].value
      }, {
        name: profile.displayName || profile.username,
        email: profile.emails[0].value,
        photo: profile.photos[0].value
      }, {
        upsert: true
      },
      done
    );
  } else {
    var noEmailError = new Error("Your email privacy settings prevent you from signing into Bookworm.");
    done(noEmailError, null);
  }
}
// make a facebook developer account and use the clientID and clientSecret that is unique to you
passport.use(new FacebookStrategy({
    clientID: "1732713756872044",
    clientSecret: "46fcd5d62067f01fd3520203c3be7246",
    callbackURL: "http://localhost:3000/auth/facebook/return",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  generateOrFindUser));
//Passport requires you to implement methods called serialize and de-serialize
// These methods tell passport how to get info from a user object and store it
//inside a a session
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
//de-set get the id from the cookie in the user's browser
passport.deserializeUser(function(userId, done) {
  User.findById(userId, done);
});


app.listen(port, function() {
  console.log('listening on port ' + port);
});
