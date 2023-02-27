import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import fs from 'mz/fs';
import {StudentId} from '../services/unitTestVar'


beforeAll(async () => {
    console.log('beforeAll')
})

afterAll(async () => {
    console.log('afterAll')
    mongoose.connection.close()
})

jest.setTimeout(30000)

describe("File Tests", () => {
    test("upload file", async () => {
        const filePath = `${__dirname}/avatar.png`;
        const rs = await fs.exists(filePath)
        if (rs) {
            const response = await request(app)
                .post("/file/file?file=123.jpeg").attach('file', filePath)
            expect(response.statusCode).toEqual(200);
        }
    })

    test("update file by email", async () => {//passed

        const userEmail = 'user1@gmail.com'
        const filePath = `${__dirname}/ava.png`;
        const rs = await fs.exists(filePath)
        if (rs) {
            const response = await request(app)
                .put(`/file/file/${userEmail}`).attach('file', filePath)
            expect(response.statusCode).toEqual(200);
        }
    })

    test.skip("update file by id", async () => {//passed

        // // TODO: need to change every unit test the id - done
        // const userId = '63fba585b63ccbce16b24761'
        const userId = StudentId.getStudenId()

        const filePath = `randomPath`;
        const rs = await fs.exists(filePath)
        if (rs) {
            const response = await request(app)
                .put(`/file/file/id/${userId}`).attach('file', filePath)
            expect(response.statusCode).toEqual(200);
            expect(response.body.avatarUrl).toEqual(filePath);
        }
    })
})