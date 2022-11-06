const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const Post = require('../models/post_model')

const newPostMessage = 'this is a new post message'
const newPostSender = '999000'
let nrePostId = null
beforeAll(async () =>{
    await Post.remove()
})

afterAll(async () =>{
    await Post.remove()
    mongoose.connection.close()

})

describe('Posts Tests', ()=>{
    test('add new post', async () =>{
        const response = await request(app).post('/post').send({
            'message': newPostMessage,
            'sender':newPostSender
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessage)
        expect(response.body.sender).toEqual(newPostSender)
    })
    test('get all post', async () =>{
        const response = await request(app).get('/post')
        expect(response.statusCode).toEqual(200)
        expect(response.body[0].message).toEqual(newPostMessage)
        expect(response.body[0].sender).toEqual(newPostSender)

    })
    //need to define it somewhere (look at the record of the class)
    // newPostId = response.body.id
    // test('get post by Id', async () =>{
    //     const response = await request(app).get('/post/' + newPostId).send({
    //         'message': newPostMessage,
    //         'sender':newPostSender
    //     })
    //     expect(response.statusCode).toEqual(200)
    //     expect(response.body.message).toEqual(newPostMessage)
    //     expect(response.body.sender).toEqual(newPostSender)
    // })

})
