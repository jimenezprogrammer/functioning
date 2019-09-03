var express = require('express');
var router = express.Router();

router.get('/dashboard', function(req, res){
  res.render('dashboard');
});

router.get('/', function(req, res) {
res.render('index');
});

router.get('/welcome', function(req, res){
  res.render('welcome');
});

module.exports = router;
