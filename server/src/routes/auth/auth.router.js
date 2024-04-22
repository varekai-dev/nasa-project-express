const express = require('express')
const { passport } = require('../../services/google-auth')

const authRouter = express.Router()

authRouter.get(
	'/google',
	passport.authenticate('google', {
		scope: ['email'],
	})
)
authRouter.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/v1/auth/failure',
		successRedirect: '/login.html',
		session: false,
	}),
	(req, res) => {
		console.log('Google called us back!')
	}
)
authRouter.get('/failure', (req, res) => {
	return res.send('Failed to login')
})
authRouter.get('/logout', (req, res) => {})

module.exports = authRouter
