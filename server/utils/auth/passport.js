const passport = require("passport");
const facebookStrategy = require("passport-facebook").Strategy;
const googleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

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
        done(null, existingUser);
      } else {
        const user = await new User({
          profileId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        }).save();
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
        return done(null, existingUser);
      }
      const user = await new User({
        profileId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      }).save();
      done(null, user);
    }
  )
);
