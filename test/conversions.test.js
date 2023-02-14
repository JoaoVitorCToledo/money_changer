const axios = require('axios')

const request = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')

jest.mock('axios')
const { ConversionRequest } = require('../models/conversionRequest')

beforeEach(async () => {
  await ConversionRequest.deleteMany()
})

beforeAll(() => {
  mongoose.connect('mongodb://0.0.0.0:27017/money_changer_test')
})

afterAll((done) => {
  mongoose.disconnect(done)
})

describe('GET /conversions', () => {
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

    const createdRequest2 = await request2.save()

    return request(app)
      .get('/conversions')
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(response.body[0]._id).toBe(createdRequest1.id)
        expect(response.body[1]._id).toBe(createdRequest2.id)
        expect(response.body.length).toBe(2)
      })
  })
})

describe('GET /conversions/by_user/:id', () => {
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
      .get('/conversions/by_user/1')
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(response.body[0]._id).toBe(createdRequest1.id)
        expect(response.body.length).toBe(1)
      })
  })
})

describe('POST /conversions/', () => {
  it('should create a ConversionRequest', async () => {
    const expectedResponse = {
      data: {
        success: true,
        query: { from: 'BRL', to: 'USD', amount: 2 },
        info: { timestamp: 1676391363, rate: 0.193926 },
        date: '2023-02-14',
        result: 0.387852,
      },
    }

    axios.get.mockImplementation(() => Promise.resolve(expectedResponse))

    return request(app)
      .post('/conversions')
      .send({
        user_id: 1,
        from: 'BRL',
        amount: 2,
        to: 'USD',
      })
      .then((response) => {
        expect(response.statusCode).toBe(201)
        expect(response.body.user_id).toBe(1)
        expect(response.body.original_currency).toBe('BRL')
        expect(response.body.conversion_currency).toBe('USD')
        expect(response.body.original_value).toBe(2)
        expect(response.body.converted_value).toBe(
          2 * expectedResponse.data.info.rate
        )
      })
  })

  it('should not create a ConversionRequest when conversion requisition fails', async () => {
    axios.get.mockImplementation(() =>
      Promise.reject({ message: 'mocked error' })
    )

    return request(app)
      .post('/conversions')
      .send({
        user_id: 1,
        from: 'BRL',
        amount: 2,
        to: 'USD',
      })
      .then((response) => {
        expect(response.statusCode).toBe(500)
        expect(response.error.text).toBe('mocked error')
      })
  })

  it('should not create a ConversionRequest it fails saving the requisition', async () => {
    const expectedResponse = {
      data: {
        success: true,
        query: { from: 'BRL', to: 'USD', amount: 2 },
        info: { timestamp: 1676391363, rate: 0.193926 },
        date: '2023-02-14',
        result: 0.387852,
      },
    }

    axios.get.mockImplementation(() => Promise.resolve(expectedResponse))

    const expectedError =
      'ConversionRequest validation failed: user_id: Path `user_id` is required.'

    return request(app)
      .post('/conversions')
      .send({
        from: 'BRL',
        amount: 2,
        to: 'USD',
      })
      .then((response) => {
        expect(response.statusCode).toBe(500)
        expect(response.error.text).toBe(expectedError)
      })
  })
})
