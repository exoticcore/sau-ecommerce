import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const GOOGLE_CALLBACK_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.SERVER_URL_PROD + '/api/v1/auth/google/callback'
    : 'http://localhost:3000/api/v1/auth/google/callback';

passport.use(
  new GoogleStrategy(
    {
      clientID: <string>process.env.GOOGLE_CLIENT_ID,
      clientSecret: <string>process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile: any, cb) => {
      cb(null, profile, { test: 'test na ja' });
    }
  )
);
