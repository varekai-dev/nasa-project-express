const {
	getAllLaunches,
	scheduleNewLaunch,
	existsLaunchWithId,
	abortLaunchById,
} = require('../../models/launches.model')
const { getPagination } = require('../../services/query.js')

async function httpGetAllLaunches(req, res) {
	const { limit, skip } = getPagination(req.query)
	return res.status(200).json(await getAllLaunches(limit, skip))
}

async function httpAddNewLaunch(req, res) {
	try {
		const launch = req.body

		if (
			!launch.mission ||
			!launch.rocket ||
			!launch.launchDate ||
			!launch.target
		) {
			return res.status(400).json({ error: 'Missing required launch property' })
		}

		if (new Date(launch.launchDate).toString() === 'Invalid Date') {
			return res.status(400).json({
				error: 'Invalid launch date',
			})
		}

		launch.launchDate = new Date(launch.launchDate)

		const result = await scheduleNewLaunch(launch)
		return res.status(201).json(result)
	} catch (error) {
		res.status(400).json({ error: String(error) })
	}
}

async function httpAbortLunch(req, res) {
	try {
		const launchId = Number(req.params.id)
		const launchExist = await existsLaunchWithId(launchId)
		if (!launchExist) {
			return res.status(404).json({
				error: 'Launch not found',
			})
		}
		const aborted = await abortLaunchById(launchId)
		if (!aborted) {
			return res.status(400).json({
				error: 'Launch not aborted',
			})
		}
		return res.status(200).json({
			ok: true,
		})
	} catch (error) {
		throw new Error(error)
	}
}

module.exports = {
	httpGetAllLaunches,
	httpAddNewLaunch,
	httpAbortLunch,
}
