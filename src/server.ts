// npm run devstart is for auto start the server after every change in the code by clicking save

import express from 'express'
const app = express();
import dotenv from 'dotenv'
if (process.env.NODE_ENV == 'test'){
    dotenv.config({ path: './.testenv' })
}else{
    dotenv.config()
}
// dotenv.config()

// socket io
import http from 'http';
const server = http.createServer(app);

// body-parser
import bodyParser from 'body-parser'
app.use(bodyParser.urlencoded({extended: true, limit: '1mb'}))
app.use(bodyParser.json())

//connecting to db
/**
 **if the connection to the mongoose service is missing use the following command:
 brew services start mongodb-community@6.0
 **to stop the service from running:
 brew services stop mongodb-community@6.0
 */
import mongoose from 'mongoose'
mongoose.connect(process.env.DATABASE_URL)//, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', err => {console.error(err)})
db.once('open', () => console.log('connected to mongo'))

//static pages
app.use('/public',express.static('public'))
app.use('/uploads',express.static('uploads'))



import postRouter from './routes/post_route'
app.use('/post',postRouter);

import authRouter from './routes/auth_route'
app.use('/auth',authRouter);

import studentRouter from './routes/student_route'
app.use('/student', studentRouter)

import fileRouter from './routes/file_route'
app.use('/file', fileRouter)



//implementing swagger
import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"

if (process.env.NODE_ENV == "development") {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Web Dev REST API",
                version: "1.0.0",
                description: "REST server including authentication using JWT",
 },
            servers: [{url: "http://localhost:3000",},],
        },
        //searching for all the API's that are inside the route dir
        apis: ["./src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
 }

export = server
