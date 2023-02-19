const axios = require('axios')

const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')

jest.mock('axios')
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
    axios.get.mockImplementationOnce(() =>
      Promise.reject({ message: 'mocked request error' })
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
        expect(response.error.text).toBe('mocked request error')
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

    axios.get.mockImplementationOnce(() => Promise.resolve(expectedResponse))

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
        expect(response.statusCode).toBe(422)
        expect(response.error.text).toBe(expectedError)
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

    axios.get.mockImplementationOnce(() => Promise.resolve(expectedResponse))
    jest
      .spyOn(ConversionRequest.prototype, 'save')
      .mockImplementationOnce(() =>
        Promise.reject({ message: 'mocked db error' })
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
        expect(response.error.text).toBe('mocked db error')
      })
  })
})
