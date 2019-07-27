const passport = require("passport");
const facebookStrategy = require("passport-facebook").Strategy;
const googleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const jwt = require("jsonwebtoken");

const { User } = require("../../model/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      //check if profile id exist
      const existingUser = await User.findOne({ profileId: profile.id });
      if (existingUser) {
        //true
        token = jwt.sign(existingUser["_id"].toHexString(), process.env.SECRET);
        User.findOneAndUpdate(
          { _id: existingUser["_id"] },
          {
            $set: {
              token: token
            }
          },
          { new: true },
          (err, user) => {
            done(null, user);
          }
        );
      } else {
        const user = new User();
        user.profileId = profile.id;
        user.name = profile.displayName;
        user.email = profile.emails[0].value;
        user.token = jwt.sign(user._id.toHexString(), process.env.SECRET);
        user.save();
        done(null, user);
      }
    }
  )
);

passport.use(
  new facebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      //check if profile id exist
      const existingUser = await User.findOne({ profileId: profile.id });
      if (existingUser) {
        //true
        token = jwt.sign(existingUser["_id"].toHexString(), process.env.SECRET);
         User.findOneAndUpdate(
          { _id: existingUser["_id"] },
          {
            $set: {
              token: token
            }
          },
          { new: true },
          (err, user) => {
            done(null, user);
          }
        );
      } else {
        const user = new User();
        (user.profileId = profile.id),
          (user.name = profile.displayName),
          (user.email = profile.emails[0].value),
          (user.token = jwt.sign(user._id.toHexString(), process.env.SECRET));
        user.save();
        done(null, user);
      }
    }
  )
);
