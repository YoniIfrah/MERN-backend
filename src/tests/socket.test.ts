import server from "../app"
import mongoose from "mongoose"
import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

import request from 'supertest'
import Post from '../models/post_model'
import User from '../models/user_model'
import Message from "../models/message_model";

const userEmail = "user1@gmail.com"
const userPassword = "12345"

const userEmail2 = "user2@gmail.com"
const userPassword2 = "12345"

let newPostId = ''
const message = "hi... test 123"

/**
 * @param arr array of objects
 * @param string the value to check if the key has it
 * @param key name of the key to iterate inside the object
 * @returns iterate the array of objects and checks if they value of the key exits then true else false
 */
const hasString = (arr: { [key: string]: string }[], string: string, key?: string): boolean => {
    // eslint-disable-next-line no-prototype-builtins
    return arr.some(obj => key ? obj.hasOwnProperty(key) && obj[key].includes(string) : Object.values(obj).some(value => value.includes(string)));
};


type Client = {
    socket : Socket<DefaultEventsMap, DefaultEventsMap>,
    accessToken : string,
    id : string
}

let client1: Client
let client2: Client

function clientSocketConnect(clientSocket):Promise<string>{
    return new Promise((resolve)=>{
        clientSocket.on("connect", ()=>{
            resolve("1")
        });
    })
}

const connectUser = async (userEmail, userPassword )=>{
    const response1 = await request(server).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword 
    })
    const userId = response1.body._id
    const response = await request(server).post('/auth/login').send({
        "email": userEmail,
        "password": userPassword 
    })
    const token = response.body.accessToken

    const socket = Client('http://localhost:' + process.env.PORT, {
        auth: {
            token: 'barrer ' + token
        }
    })
    await clientSocketConnect(socket)
    const client = {socket: socket, accessToken: token, id: userId }
    return client
}
/**
 * once - fire thoe command and when it finish is deleted
 * on - like once but not geting deleted when it finishes
 * emit - send message to all clients that are in the same socket
 * arg - the response we received
 * payload - is what we send  in the emit command
 */
describe("My project", () => {
    jest.setTimeout(15000)

   beforeAll(async () => {
        await Post.remove()
        await User.remove()
        await Message.remove();
        client1 = await connectUser(userEmail, userPassword )
        client2 = await connectUser(userEmail2, userPassword2 )
        console.log("finish beforeAll")
   });

   afterAll(() => {
       client1.socket.close()
       client2.socket.close()
       server.close()
       mongoose.connection.close()
   });

   test("should work", (done) => {
        client1.socket.once("echo:echo_res",(arg) => {
           console.log("echo:echo")
           expect(arg.msg).toBe('hello');
           done();
       });
       client1.socket.emit("echo:echo", {'msg':'hello'})
    });
    test("postAdd", (done) => {
        client1.socket.emit('post:post',{'message':'this is my message', 'sender': client1.id })
        client1.socket.on('post:post.response', (arg) => {
            expect(arg.body.message).toEqual('this is my message')
            expect(arg.body.sender).toEqual(client1.id)
            newPostId = arg.body._id
            console.log('post id:',newPostId)
            done();
        });
    })
    
   test("Post get all test", (done) => {
        client1.socket.once('post:get_all', (arg) => {
            console.log("on any " + arg)
            expect(arg.status).toBe('OK');
            done();
        });
        console.log(" test post get all")
        client1.socket.emit("post:get_all","stam")
    });


    test('Get Post By ID', done =>{
        client1.socket.once('post:get_by_id.response', (arg) => {
            expect(arg.body.message).toEqual('this is my message')
            expect(arg.body.sender).toEqual(client1.id)
            done();
        });    
        client1.socket.emit('post:get_by_id',{'id': newPostId })
    })
    test('Get Post with wrong ID', done =>{
        client1.socket.once('post:get_by_id.response', (arg) => {
            expect(arg.err.code).toEqual(400)
            done();
        });    
        client1.socket.emit('post:get_by_id',{'id': '12345' })
    })
    test('Get Post By Sender', done =>{
        client1.socket.once('post:get_post_by_sender.response', (arg) => {
            expect(hasString(arg.body, 'this is my message','message')).toEqual(true)
            expect(hasString(arg.body, client1.id,'sender')).toEqual(true)
            done();
        });
        client1.socket.emit('post:get_post_by_sender', {'sender': client1.id })
    })
    test('Get Post with wrong Sender', done =>{
        client1.socket.once('post:get_post_by_sender.response', (arg) => {
            expect(hasString(arg.body, 'this is my message','message')).toEqual(false)
            expect(hasString(arg.body, client1.id,'sender')).toEqual(false)
            done();
        });
        client1.socket.emit('post:get_post_by_sender', {'sender': '12345' })
    })
    test('Put Post By Id', done =>{
        client1.socket.once('post:put_post_by_id.response', (arg) => {
            expect(arg.body.message).toEqual('new post message')
            expect(arg.body.sender).toEqual(client1.id)
            done();
        });
        client1.socket.emit('post:put_post_by_id', {'id': newPostId, 'message': 'new post message'})
    })
    test('Put Post with worng Id', done =>{
        client1.socket.once('post:put_post_by_id.response', (arg) => {
            expect(arg.err.code).toEqual(400)
            done();
        });
        client1.socket.emit('post:put_post_by_id', {'id': '12345', 'message': 'new post message'})
    })
    test("Test chat messages", (done)=>{
        client2.socket.once('chat:message',(args)=>{
            expect(args.to).toBe(client2.id)
            expect(args.message).toBe(message)
            expect(args.from).toBe(client1.id)
            done()
        })
        console.log(`cient 1 ${client1.id}`)
        console.log(`cient 2 ${client2.id}`)
        client1.socket.emit("chat:send_message",{'to' : client2.id, 'message' : message, 'from' : client1.id})
    })
    test("Test chat messages - get all messages by ", (done)=>{
        client1.socket.once('chat:get_all_messages_by_id',(args)=>{
            console.log(args)
            // may need to check for a lot of messages
            expect(args[0].sender).toBe(client1.id)
            expect(args[0].reciver).toBe(client2.id)
            expect(args[0].message).toBe(message)
            done()
        })
        client1.socket.emit("chat:get_all_messages_by_id",{'sender' : client1.id})
    })
});
