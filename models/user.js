/*jshint esversion: 6 */
var mongoose = require("mongoose");
var bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true
  },
  name: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({
      email: email
    })
    .exec(function(error, user) {
      if (error) {
        return callback(error);
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      //if the user exists, compare the hashed password to the new hash from req.body.password
      bcrypt.compare(password, user.password, function(error, result) {
        // if passwords are the same return the user
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      });
    });
};

//sign up with an existing username NOT allowed
// User will not be added to the database
UserSchema.pre('save', function(next) {
  var self = this;
  User.find({
    email: self.email
  }, function(err, doc) {
    if (!doc.length) {
      next();
    } else {
      console.log('User Exists: ', self.email);
      next(new Error('User exists!'));
    }
  });
});

//using bcrypt to hash password
UserSchema.pre('save', function(next) {
  const user = this;
  bcrypt.hash(user.password, 10, function(error, hash) {
    if (error) {
      return next(error);
    }
    user.password = hash;
    next();
  });
});




var User = mongoose.model('User', UserSchema);
module.exports = User;
