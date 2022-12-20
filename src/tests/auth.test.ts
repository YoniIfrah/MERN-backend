import request  from 'supertest'
import app  from '../server'
import mongoose  from 'mongoose'
import User  from '../models/user_model'
import Post  from '../models/post_model'

const userEmail: string = 'user1@gmail.com'
const password: string = '12345'
var accessToken: string = ''
var refreshToken: string = ''


beforeAll(async ()=>{
    await Post.remove()
    await User.remove()
})

afterAll(async ()=>{
    await Post.remove()
    await User.remove()
    mongoose.connection.close()
})

describe('Auth Tests', ()=>{
    test('Not auth attempt test', async () =>{
        const response = await request(app).post('/post')
        expect(response.statusCode).not.toEqual(200)
    })

    test('Register test', async () =>{
        const response = await request(app).post('/auth/register').send({
            'email': userEmail,
            'password':password
        })
        expect(response.statusCode).toEqual(200)

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

    test('Login test', async () =>{
        const response = await request(app).post('/auth/login').send({
            'email': userEmail,
            'password':password
        })
        expect(response.statusCode).toEqual(200)
        accessToken = response.body.accessToken
        expect(accessToken).not.toBeNull()
        refreshToken = response.body.refreshToken
        expect(refreshToken).not.toBeNull()
    })

    test('Checking if the access token is valid', async () =>{
        const response = await request(app).get('/post').set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(200)
    })
    test('Checking if the access token is invalid', async () =>{
        const response = await request(app).get('/post').set('Authorization', 'JWT invalid' + accessToken);
        expect(response.statusCode).not.toEqual(200)
    })

    //test expired token
    jest.setTimeout(30000)
    test("test expired token",async ()=>{
        await new Promise(r => setTimeout(r,10000))
        const response = await request(app).get('/post').set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).not.toEqual(200)
    })

    test("test refresh token",async ()=>{
        let response = await request(app).get('/auth/refresh').set('Authorization', 'JWT ' + refreshToken);
        expect(response.statusCode).toEqual(200)

        accessToken = response.body.accessToken
        expect(accessToken).not.toBeNull()
        refreshToken = response.body.refreshToken
        expect(refreshToken).not.toBeNull()
        
        response = await request(app).get('/post').set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(200)

    })

    test("Logout test",async ()=>{
        const response = await request(app).get('/auth/logout').set('Authorization', 'JWT ' + refreshToken)
        expect(response.statusCode).toEqual(200)
    })

})
