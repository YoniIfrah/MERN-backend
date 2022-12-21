// npm run devstart is for auto start the server after every change in the code by clicking save

import server  from './server'
import io from './socket_server'
io(server)
const port = process.env.PORT;

// app.get('/index', (req, res) => {
//     res.send('Hello World')
// })

server.listen(port, ()=> {
    console.log(`listening on port: ${port}!`)
})

export = server