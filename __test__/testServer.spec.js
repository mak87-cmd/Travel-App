import { app } from "../src/server/server"

const supertest = require('supertest')
const request = supertest(app)

describe("Testing the server", () => {
    test("Testing the /all endpoint", async done => {
        const response = await request.get('/all')
        expect(response.status).toBe(200)
        expect(response.body).toBeDefined();
        done()
})});