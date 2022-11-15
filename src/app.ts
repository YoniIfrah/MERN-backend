// npm run devstart is for auto start the server after every change in the code by clicking save

import app  from './server'
const port = process.env.PORT;

// app.get('/index', (req, res) => {
//     res.send('Hello World')
// })

app.listen(port, ()=> {
    console.log(`listening on port: ${port}!`)
})