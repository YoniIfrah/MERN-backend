import { Server } from "socket.io"
import http from 'http';//websocket based on http
import jwt from 'jsonwebtoken'
import echoHandler from "./socket/echoHandler";
import postHandler from "./socket/postHandler"
import chatHandler from './socket/chatHandler'

/**
 * The resaon that we exporting as a function
 * is to be able to run the sockets after the server is running.
 ** echo server - replying what he get
 */
export = (server: http.Server) => {
   const io = new Server(server);


   /**
    * Since we have register/login API
      We would like to authenticate the client using the accessToken
    * reading token from client
    * if the token is not valid or any other error happend then return error
    * else extrating the id from of the user and keep it inside of user data of the socket
    */
   io.use(async (socket, next) => {
        let token = socket.handshake.auth.token;
        if(token == null) return next(new Error('Authentication error'))
        token = token.split(' ')[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err){
                return next(new Error('Authentication error'));
            } else{
                socket.data.user = user.id
                return next()
            }
        })
    });

   io.on('connection', async (socket) => {
       console.log('a user connected ' + socket.id);
       echoHandler(io,socket)
       postHandler(io,socket)
       chatHandler(io,socket)

       const userId = socket.data.user
       await socket.join(userId)
   });
   return io
}