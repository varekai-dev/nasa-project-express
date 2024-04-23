const request = require('supertest')
const app = require('../../app')
const { mongoConnect, mongoDisconnect } = require('../../services/mongo')
const { loadPlanetsData } = require('../../models/planets.model')

describe('Launches API', () => {
	beforeAll(async () => {
		await mongoConnect()
		await loadPlanetsData()
	})
	afterAll(async () => {
		await mongoDisconnect()
	})

	describe('Test GET /launches', () => {
		test('It should respond with 200 success', async () => {
			await request(app)
				.get('/v1/launches')
				.expect(200)
				.expect('Content-Type', /json/)
		})
	})

	describe('Test POST /launch', () => {
		const launchDataWithoutDate = {
			mission: 'USS',
			rocket: 'NCC 1701-D',
			target: 'Kepler-1652 b',
		}

		const launchDate = 'January 4, 2028'

		const completeLaunchData = {
			...launchDataWithoutDate,
			launchDate,
		}

		const launchDataWithInvalidDate = {
			...launchDataWithoutDate,
			launchDate: 'zod',
		}

		test('It should respond with 201 created', async () => {
			const response = await request(app)
				.post('/v1/launches')
				.send(completeLaunchData)
				.expect('Content-Type', /json/)
				.expect(201)

			const requestDate = new Date(launchDate).valueOf()
			const responseDate = new Date(response.body.launchDate).valueOf()

			expect(requestDate).toBe(responseDate)

			expect(response.body).toMatchObject(launchDataWithoutDate)
		})

		test('It should catch missing required properties', async () => {
			const response = await request(app)
				.post('/v1/launches')
				.send(launchDataWithoutDate)
				.expect('Content-Type', /json/)
				.expect(400)
			expect(response.body).toStrictEqual({
				error: 'Missing required launch property',
			})
		})

		test('It should catch invalid dates', async () => {
			const response = await request(app)
				.post('/v1/launches')
				.send(launchDataWithInvalidDate)
				.expect('Content-Type', /json/)
				.expect(400)
			expect(response.body).toStrictEqual({
				error: 'Invalid launch date',
			})
		})
	})
})
