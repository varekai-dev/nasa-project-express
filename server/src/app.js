const express = require('express')
// const morgan = require('morgan')
const path = require('path')
const cors = require('cors')
const passport = require('passport')
require('./services/google-auth')
const app = express()
const cookieSession = require('cookie-session')

const api = require('./routes/api')

app.use(
	cookieSession({
		name: 'session',
		maxAge: 24 * 60 * 60 * 1000,
		keys: [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2],
	})
)
app.use(passport.initialize())
app.use(passport.session())

app.use(
	cors({
		origin: 'http://localhost:3000',
	})
)
// app.use(morgan('combined'))

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/v1', api)

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app
