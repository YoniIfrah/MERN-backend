import request  from 'supertest'
import app  from '../server'
import mongoose  from 'mongoose'
import Post  from '../models/post_model'

const newPostMessage = 'this is a new post message'
const newPostSender = '999000'
let newPostId = '' //defualt value
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
        newPostId = response.body._id
        console.log(newPostId)
    })
    test('get all post', async () =>{
        const response = await request(app).get('/post')
        expect(response.statusCode).toEqual(200)
        expect(response.body[0].message).toEqual(newPostMessage)
        expect(response.body[0].sender).toEqual(newPostSender)

    })
    test('get post by Id', async () =>{
        const response = await request(app).get('/post/' + newPostId).send({
            'message': newPostMessage,
            'sender':newPostSender
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessage)
        expect(response.body.sender).toEqual(newPostSender)
        expect(response.body._id).toEqual(newPostId)

    })

    test('get post by sender', async () =>{
        const response = await request(app).get('/post?=' + newPostSender).send({
            'message': newPostMessage,
            'sender':newPostSender
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body[0].message).toEqual(newPostMessage)
        expect(response.body[0].sender).toEqual(newPostSender)
        expect(response.body[0]._id).toEqual(newPostId)

    })

    test('put post by id', async () =>{
        const putMsg = 'message from put request'
        const putSender = '111000'
        console.log(newPostId)
        const response = await request(app).put('/post/' + newPostId).send({
            'message': putMsg,
            'sender':putSender
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(putMsg)
        expect(response.body.sender).toEqual(putSender)
        expect(response.body._id).toEqual(newPostId)
        expect(response.body.message).not.toEqual(newPostMessage)
        expect(response.body.sender).not.toEqual(newPostSender)
        
        //trying with invalid id
        const response2 = await request(app).put('/post/' + '0').send({
            'message': 'invalid',
            'sender':'invalid'
        })
        expect(response2.statusCode).toEqual(400)
    })

})
