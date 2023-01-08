
import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import postController from "../controllers/post"
import myRequest from "../common/Request"

export = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, 
            socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
                
    const getAllPosts = async () => {
        console.log("getAllPosts handler")
        try {
            const res = await postController.getAllPostsEvent()
            socket.emit('post:get_all', res)
        } catch (err) {
            socket.emit('post:get_all', {'status' : 'fail'})
        }
    }

    //payload is what we got from the event
     const getPostById = async (payload) => {

        try{
            const res = await postController.getPostById(new myRequest(payload, socket.data.user,payload))
            socket.emit('post:get_by_id.response', res)
        } catch(err) {
            socket.emit('post:get_by_id.response', {'status' : 'fail'})
        }
    }

    const addNewPost = async (payload) => {
        console.log("addNewPost handler")
        try{
            const res = await postController.addNewPost(new myRequest(payload, socket.data.user))
            socket.emit('post:post.response', res)
        } catch(err){
            socket.emit('post:post.response', {'status' : 'fail'})
        }
    }

    const getPostBySender = async (payload) => {
        console.log("getPostBySender handler")
        try{
            const res = await postController.getAllPosts(new myRequest(payload, socket.data.user,null,payload))
            socket.emit('post:get_post_by_sender.response', res)
        } catch(err) {
            socket.emit('post:get_post_by_sender.response', {'status' : 'fail'})
        }
    }

    const putPostById = async (payload) => {
        console.log("putPostById handler")
        try{
            const res = await postController.putPostById(new myRequest(payload, socket.data.user,payload,payload))
            socket.emit('post:put_post_by_id.response', res)
        } catch(err) {
            socket.emit('post:put_post_by_id.response', {'status' : 'fail'})
        }

    }
    console.log('register echo handlers')
    socket.on("post:get_all", getAllPosts)
    socket.on("post:get_by_id", getPostById)
    socket.on("post:post", addNewPost)
    socket.on("post:get_post_by_sender", getPostBySender)
    socket.on("post:put_post_by_id",putPostById)
}