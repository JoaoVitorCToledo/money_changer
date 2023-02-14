const request = require("supertest");
const app = require('../app');
const mongoose = require("mongoose");

describe('GET /conversions', () => {
  beforeAll(() => {
    mongoose.connect(
      "mongodb://0.0.0.0:27017"
    );
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });

  test("It should response the GET method", () => {
    return request(app)
      .get("/conversions")
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });
})