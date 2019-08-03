const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SALT_I = 10;
require("dotenv").config();
const crypto = require("crypto");
const moment = require("moment");

const userSchema = mongoose.Schema({
  profileId: Number,
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minLength: 6
  },
  name: {
    type: String,
    required: true,
    maxLength: 100
  },
  units: {
    type: Number,
    default: 0
  },
  initialUnit: {
    type: Number,
    default: 50
  },
  cash: Number,
  role: {
    type: Number,
    default: 0
  },
  token: String,
  resetToken: {
    type: String
  },
  resetTokenExp: {
    type: Number
  },
  lastLogin: Number,
  sent: {
    type: Array,
    default: [] 
  }
});

userSchema.pre("save", function(next) {
  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(SALT_I, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.generateResetToken = function(cb) {
  var user = this;

  crypto.randomBytes(20, function(err, buffer) {
    var token = buffer.toString("hex");
    var today = moment()
      .startOf("day")
      .valueOf();
    var tomorrow = moment(today)
      .endOf("day")
      .valueOf();

    user.resetToken = token;
    user.resetTokenExp = tomorrow;
    user.save(function(err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function(cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), process.env.SECRET);
  user.token = token;

  user.save(function(err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function(token, cb) {
  var user = this;

  jwt.verify(token, process.env.SECRET, function(err, decode) {
    user.findOne({ _id: decode, token: token }, function(err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
