const express = require('express')
const { checkLoggedIn } = require('../utils/checkLoggedIn')

const launchesRouter = require('./launches/launches.router')
const planetsRouter = require('./planets/planets.router')
const authRouter = require('./auth/auth.router')

const api = express.Router()

api.use('/planets', checkLoggedIn, planetsRouter)
api.use('/launches', launchesRouter)
api.use('/auth', authRouter)

module.exports = api
