const launchesDatabase = require('./launches.mongo')
const planets = require('./planets.mongo')
const axios = require('axios')

const DEFAULT_FLIGHT_NUMBER = 100

async function getLatestFlightNumber() {
	const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber')

	return latestLaunch?.flightNumber || DEFAULT_FLIGHT_NUMBER
}

async function getAllLaunches(limit, skip) {
	return await launchesDatabase
		.find({}, { __v: 0 })
		.sort({
			flightNumber: 1,
		})
		.skip(skip)
		.limit(limit)
}

async function saveLaunch(launch) {
	try {
		const result = await launchesDatabase.findOneAndUpdate(
			{
				flightNumber: launch.flightNumber,
			},
			launch,
			{ upsert: true, new: true }
		)
		return result
	} catch (error) {
		throw new Error(error)
	}
}

async function existsLaunchWithId(launchId) {
	const launchExist = await findLaunch({
		flightNumber: launchId,
	})

	return !!launchExist
}

async function abortLaunchById(launchId) {
	try {
		const result = await launchesDatabase.findOneAndUpdate(
			{
				flightNumber: launchId,
			},
			{
				upcoming: false,
				success: false,
			},
			{
				new: true,
			}
		)
		return result
	} catch (error) {
		throw new Error(error)
	}
}

async function scheduleNewLaunch(launch) {
	try {
		const planet = await planets.findOne({ keplerName: launch.target })

		if (!planet) {
			throw new Error('No matched planed found')
		}
		const newFlightNumber = (await getLatestFlightNumber()) + 1
		const newLaunch = {
			...launch,
			upcoming: true,
			success: true,
			customers: ['Zero to Mastery', 'NASA'],
			flightNumber: newFlightNumber,
		}
		return await saveLaunch(newLaunch)
	} catch (error) {
		throw new Error(error)
	}
}

async function findLaunch(filter) {
	return await launchesDatabase.findOne(filter)
}

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

async function populateDatabase() {
	console.log('Downloading launch data...')
	const response = await axios.post(SPACEX_API_URL, {
		query: {},
		options: {
			pagination: false,
			populate: [
				{
					path: 'rocket',
					select: {
						name: 1,
					},
				},
				{
					path: 'payloads',
					select: {
						customers: 1,
					},
				},
			],
		},
	})
	if (response.status !== 200) {
		console.log('Problem downloading launch data')
		throw new Error('Launch download data failed')
	}
	const launchDocs = response.data.docs
	for (const launchDoc of launchDocs) {
		const payloads = launchDoc['payloads']
		const customers = payloads.flatMap(payload => {
			return payload['customers']
		})
		const launch = {
			flightNumber: launchDoc['flight_number'],
			mission: launchDoc['name'],
			rocket: launchDoc['rocket']['name'],
			launchDate: launchDoc['date_local'],
			upcoming: launchDoc['upcoming'],
			success: launchDoc['success'],
			customers,
		}
		await saveLaunch(launch)
	}
}

async function loadLunchData() {
	const firstLaunch = await findLaunch({
		flightNumber: 1,
		rocket: 'Falcon 1',
		mission: 'FalconSat',
	})
	if (firstLaunch) {
		console.log('Launch data already loaded')
	} else {
		populateDatabase()
	}
}

module.exports = {
	getAllLaunches,
	existsLaunchWithId,
	abortLaunchById,
	scheduleNewLaunch,
	loadLunchData,
}
