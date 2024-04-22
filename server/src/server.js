const http = require('http')
const { mongoConnect } = require('./services/mongo')
const dotenv = require('dotenv')
const app = require('./app')
const { loadPlanetsData } = require('./models/planets.model')
const { loadLunchData } = require('./models/launches.model')
dotenv.config()

const PORT = process.env.PORT || 8000

const server = http.createServer(app)

async function startServer() {
	await mongoConnect()
	await loadPlanetsData()
	await loadLunchData()

	server.listen(PORT, () => {
		console.log(`Listening on port ${PORT}...`)
	})
}

startServer()
