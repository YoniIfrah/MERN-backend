// npm run devstart is for auto start the server after every change in the code by clicking save

const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const port = process.env.PORT;

// body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true, limit: '1mb'}))
app.use(bodyParser.json())

//connecting to db
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', err => {console.error(err)})
db.once('open', () => console.log('connected to mongo'))


const postRouter = require('./routes/post_route.js');
app.use('/post',postRouter);

// app.get('/index', (req, res) => {
//     res.send('Hello World')
// })

app.listen(port, ()=> {
    console.log(`listening on port: ${port}!`)
})