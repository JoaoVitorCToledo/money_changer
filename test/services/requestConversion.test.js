const requestConversion = require('../../services/requestConversion')

const axios = require('axios')

jest.mock('axios')

describe('tests requestConversion service', () => {
  it('should call axios and return a promixe', async () => {
    const expectedResponse = Promise.resolve({
      data: {
        success: true,
        query: { from: 'BRL', to: 'USD', amount: 2 },
        info: { timestamp: 1676391363, rate: 0.193926 },
        date: '2023-02-14',
        result: 0.387852,
      },
    })

    axios.get.mockImplementation(() => expectedResponse)

    expect(requestConversion('USD', 'BRL', 2)).toBe(expectedResponse)
  })
})
