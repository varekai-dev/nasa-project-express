const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once('open', () => {
	console.log('mongodb connection ready')
})

mongoose.connection.on('error', error => {
	console.error(error)
})

async function mongoConnect() {
	await mongoose.connect(MONGO_URL)
}

async function mongoDisconnect() {
	await mongoose.disconnect()
}

module.exports = {
	mongoConnect,
	mongoDisconnect,
}
