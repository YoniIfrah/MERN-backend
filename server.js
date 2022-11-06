// npm run devstart is for auto start the server after every change in the code by clicking save

const express = require('express');
const app = express();
const dotenv = require('dotenv').config();

// body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true, limit: '1mb'}))
app.use(bodyParser.json())

//connecting to db
/**
 **if the connection to the mongoose service is missing use the following command:
 brew services start mongodb-community@6.0
 **to stop the service from running:
 brew services stop mongodb-community@6.0
 */
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', err => {console.error(err)})
db.once('open', () => console.log('connected to mongo'))

//static pages
app.use('/public',express.static('public'))


const postRouter = require('./routes/post_route.js');
app.use('/post',postRouter);

module.exports = app