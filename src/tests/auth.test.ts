import request  from 'supertest'
import app  from '../server'
import mongoose  from 'mongoose'
import User  from '../models/user_model'
import Post  from '../models/post_model'

const userEmail: string = 'user1@gmail.com'
const password: string = '12345'
var accessToken: string = 

beforeAll(async () =>{
    await Post.remove()
    await User.remove()
})

afterAll(async () =>{
    await Post.remove()
    await User.remove()
    mongoose.connection.close()

})

describe('Auth Tests', ()=>{
    test('Register test', async () =>{
        const response = await request(app).post('/auth/register').send({
            'email': userEmail,
            'password':password
        })
        expect(response.statusCode).toEqual(200)

    })
    test('Login test', async () =>{
        const response = await request(app).post('/auth/login').send({
            'email': userEmail,
            'password':password
        })
        expect(response.statusCode).toEqual(200)
        const token = response.body.accessToken
        expect(token).not.toBeNull()

    })
    test('Login test with wrong password', async () =>{
        const response = await request(app).post('/auth/login').send({
            'email': userEmail,
            'password':password+'wrong'
        })
        expect(response.statusCode).not.toEqual(200)
        const token = response.body.accessToken
        expect(token).toBeUndefined()

    })
    test('Logout test', async () =>{
        const response = await request(app).post('/auth/logout').send({
            'email': userEmail,
            'password':password
        })
        expect(response.statusCode).toEqual(200)

    })
   
})
