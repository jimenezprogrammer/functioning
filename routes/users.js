const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  if (req.body.email && req.body.name && req.body.password && req.body.password2) {
    if (req.body.password !== req.body.password2) {
      var err = new Error('Passwords do not match');
      return next(err);
    } //end of second if
  } //end of first else
  var user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }); //end of var user
  user.save(function(err) {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        err = 'An account with that email already exists. Login instead!'
        res.render('error', {
          errormessage: err
        });
      } //end of err.name === mongoerror
      else {
        res.render('error', {
          errormessage: 'Username exists, please choose a different one!'
        });
      }
    } //end of first err
    else {
      res.render('welcome', {
        message: user.name
      });
      console.log('working');
    }
  });
});
// POST /login
// 'USER.AUTHENTICATE' is from the authenticate method defined above
router.post('/login', function(req, res, next) {
  //if both have been "posted" i.e. entered into the form fields
  if (req.body.email && req.body.password) {
    //use the authenticate method which takes the username and pass as parameters and then
    // runs a callback function which takes error and user as parameters
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      //if there is either an error or user doesn't exist
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        res.render('error',{errormessage: err});
        // err.status = 401;
        // return next(err);
      } else {
        //give the user a session id so that they can seamlessly navigate restricated pages
        req.session.userId = user._id;
        res.render('dashboard', {
          message: user.name
        })
      }
    });
  }
  /*----This else block is not needed if "required" attribute is set on the form fields in
  login.ejs
   else {
  var err = new Error('Email and password are required.');
  err.status = 401;
  return next(err);
  }*/
});

router.get('/logout', function(req, res, next){
  if(req.session){
    console.log('deleting the session of '+ req.session.userId);
    //delete session object
    req.session.destroy(function(err) {
      if(err){
        return next(err);
      }else{
        console.log('deleted req.session')
        return res.redirect('/')
      }
    })
  }
})


module.exports = router;
