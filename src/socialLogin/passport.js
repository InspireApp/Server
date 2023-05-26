import GoogleStrategy from 'passport-google-oauth20';
import passport from 'passport';
import { config } from '../config/index.js';
import { googleModel } from '../models/googleSocial.js';

export const passportSetup = () => {

  passport.serializeUser((user, done) => {
    done(null, user.id)
  });

  passport.deserializeUser((id, done) => {

    googleModel.findById(id).then((user) => {
      done(null, user);
    });

  })


  passport.use(new GoogleStrategy(
    {
      clientID: config.google_strategy_client_id,
      clientSecret: config.google_strategy_client_secret,
      callbackURL: "http://localhost:3000/api/v1/auth/google/redirect"
    },

    async (accessToken, refreshToken, profile, done) => {

      // check if the user exists in the database
      const currentUser = await googleModel.findOne({ googleId: profile.id })

      if (currentUser) {
        done(null, currentUser);

      } else {
        // save google profile data into the database
        const user = await googleModel.create({ displayName: profile.displayName, googleId: profile.id });
        done(null, user);
      }
    }

  ));


}

