const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')
const { ConversionRequest } = require('../../models/conversionRequest')

beforeEach(async () => {
  await ConversionRequest.deleteMany()
})

beforeAll(() => {
  mongoose.connect('mongodb://0.0.0.0:27017/money_changer_test')
})

afterAll((done) => {
  mongoose.disconnect(done)
})

describe('GET /users/:id/conversions', () => {
  it('It should response the GET method', async () => {
    const request1 = new ConversionRequest({
      user_id: 1,
      original_currency: 'BRL',
      original_value: 2,
      conversion_currency: 'USD',
      conversion_rate: 2,
      converted_value: 4,
    })
    const createdRequest1 = await request1.save()

    const request2 = new ConversionRequest({
      user_id: 2,
      original_currency: 'EUR',
      original_value: 1,
      conversion_currency: 'USD',
      conversion_rate: 4,
      converted_value: 4,
    })
    await request2.save()

    return request(app)
      .get('/users/1/conversions')
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(response.body[0]._id).toBe(createdRequest1.id)
        expect(response.body.length).toBe(1)
      })
  })
})
