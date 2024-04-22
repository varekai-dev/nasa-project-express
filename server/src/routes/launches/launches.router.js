const express = require('express')
const {
	httpGetAllLaunches,
	httpAddNewLaunch,
	httpAbortLunch,
} = require('./launches.controller')

const launchesRouter = express.Router()

launchesRouter.get('/', httpGetAllLaunches)
launchesRouter.post('/', httpAddNewLaunch)
launchesRouter.delete('/:id', httpAbortLunch)

module.exports = launchesRouter
