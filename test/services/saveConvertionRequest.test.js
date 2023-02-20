const SaveConversionRequest = require('../../services/saveConvertionRequest')
const { ConversionRequest } = require('../../models/conversionRequest')
const mongoose = require('mongoose')

beforeEach(async () => {
  await ConversionRequest.deleteMany()
})

beforeAll(() => {
  mongoose.connect('mongodb://0.0.0.0:27017/money_changer_test')
})

afterAll((done) => {
  mongoose.disconnect(done)
})

describe('tests SaveConversionRequest service', () => {
  it('should save the request and throw emit SUCCESS', () => {
    const request_parameters = {
      user_id: 1,
      original_currency: 'BRL',
      original_value: 2,
      conversion_currency: 'USD',
      conversion_rate: 2,
      converted_value: 4,
    }

    const saveService = new SaveConversionRequest()

    saveService
      .on('SUCCESS', (record) => {
        expect(record.user_id).toBe(1)
        expect(record.original_currency).toBe('BRL')
        expect(record.conversion_currency).toBe('USD')
        expect(record.original_value).toBe(2)
        expect(record.converted_value).toBe(4)
      })
      .on('VALIDATION_ERROR', () => {
        throw new Error('it should not reach here')
      })
      .on('ERROR', () => {
        throw new Error('it should not reach here')
      })
    saveService.execute(request_parameters)
  })

  it('should not save the request and throw emit VAIDATION_ERROR', () => {
    const request_parameters = {
      user_id: null,
      original_currency: 'BRL',
      original_value: 2,
      conversion_currency: 'USD',
      conversion_rate: 2,
      converted_value: 4,
    }
    const expectedError =
      'ConversionRequest validation failed: user_id: Path `user_id` is required.'

    const saveService = new SaveConversionRequest()

    saveService
      .on('SUCCESS', () => {
        throw new Error('it should not reach here')
      })
      .on('VALIDATION_ERROR', (error) =>
        expect(error.message).toBe(expectedError)
      )
      .on('ERROR', () => {
        throw new Error('it should not reach here')
      })
    saveService.execute(request_parameters)
  })

  it.only('should not save the request and throw emit ERROR', () => {
    const request_parameters = {
      user_id: null,
      original_currency: 'BRL',
      original_value: 2,
      conversion_currency: 'USD',
      conversion_rate: 2,
      converted_value: 4,
    }

    jest
      .spyOn(ConversionRequest.prototype, 'save')
      .mockImplementationOnce(() =>
        Promise.reject({ message: 'mocked db error' })
      )

    const saveService = new SaveConversionRequest()

    saveService
      .on('SUCCESS', () => {
        throw new Error('it should not reach here')
      })
      .on('VALIDATION_ERROR', () => {
        throw new Error('it should not reach here')
      })
      .on('ERROR', (error) => expect(error.message).toBe('mocked db error'))
    saveService.execute(request_parameters)
  })
})
