const express = require('express');
const app = require('../server.js')
const router = express.Router();
const passport = require('passport');
//const passportFacebook = require('../auth/facebook');
const User = require('../models/user')

router.get('/login/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
  }));

//GET /auth/facebook/return
router.get('/facebook/return',
  passport.authenticate('facebook', {
    failureRedirect: '/'
  }),
  function(req, res) {
    const user_id = req.user.id;
    //var pic = '[https://graph.facebook.com/](https://graph.facebook.com/)' + [req.user.id](http://req.user.id/) + '/picture?height=350&width=250'
    // Successful authentication, redirect home.
    res.render('dashboard', {
      message: req.user.name
    })
    console.log(user_id)

  });

//GET /auth/logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

/* if not using a seperate auth/facebook.js file then use passport.authenticate */
router.get('/login/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
  }));

//GET /auth/facebook/return
router.get('/facebook/return',
  passport.authenticate('facebook', {
    failureRedirect: '/'
  }),
  function(req, res) {
    var user_id = req.user.id;
    //var pic = '[https://graph.facebook.com/](https://graph.facebook.com/)' + [req.user.id](http://req.user.id/) + '/picture?height=350&width=250'
    // Successful authentication, redirect home.
    res.render('dashboard', {
      message: req.user.name
    });
    console.log(user_id)

  });

//GET /auth/logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

/* if not using a seperate auth/facebook.js file then use passport.authenticate */

module.exports = router;
