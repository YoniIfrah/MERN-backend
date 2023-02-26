import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import Student from '../models/student_model'

let newStudenId = ""
const email = "oren@gmail.com"
beforeAll(async () => {
    await Student.remove()//{ 'id: ': newStudenId })
    console.log('beforeAll')
})

afterAll(async () => {
    console.log('afterAll')
    mongoose.connection.close()
})

describe("Student Tests", () => {
    test("add new student", async () => {
        const response = await request(app).post('/student')
            .send({
                "email": email,
                "name": "Oren",
                "avatarUrl": "www.localhost:3000/oren.jpg"
            })
        expect(response.statusCode).toEqual(200)
        newStudenId = response.body._id
    })

    test("get all students", async () => {
        const response = await request(app).get('/student')
        expect(response.statusCode).toEqual(200)
        expect(response.body.length).toBeGreaterThanOrEqual(1)
    })

    test("get student by id", async () => {
        const response = await request(app).get('/student/' + newStudenId)
        expect(response.statusCode).toEqual(200)
    })

    test("get all students by email", async () => {
        //adding 2 students
        let response = await request(app).post('/student')
        .send({
            "email": email,
            "name": "Oren2",
            "avatarUrl": "www.localhost:3000/oren.jpg"
        })        
        response = await request(app).post('/student')
        .send({
            "email": email+"2",
            "name": "notOren",
            "avatarUrl": "www.localhost:3000/oren.jpg"
        })
        response = await request(app).get('/student/email/' + email)
        expect(response.statusCode).toEqual(200)
    })
    test("delete student by id", async () => {
        const response = await request(app).delete('/student/delete/' + newStudenId)
        expect(response.statusCode).toEqual(200)
    })
    //need to add delete and put methods
    
    
})