const passport = require('passport')
const dotenv = require('dotenv')
const GoogleStrategy = require('passport-google-oauth20').Strategy

dotenv.config()

const config = {
	CLIENT_ID: process.env.OAUTH_CLIENT_ID,
	CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET,
}

const AUTH_OPTIONS = {
	callbackURL: '/v1/auth/google/callback',
	clientID: config.CLIENT_ID,
	clientSecret: config.CLIENT_SECRET,
}

//  save the session to the cookie
passport.serializeUser((user, done) => {
	// console.log('user', user)
	done(null, user)
})

// read the session from the cookie
passport.deserializeUser((obj, done) => {
	// console.log('obj', obj)
	done(null, obj)
})

function verifyCallback(accessToken, refreshToken, profile, done) {
	console.log('Google profile', profile)
	done(null, profile)
}

passport.use(new GoogleStrategy(AUTH_OPTIONS, verifyCallback))

module.exports = { passport }
