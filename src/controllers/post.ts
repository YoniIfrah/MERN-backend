import myError from '../common/Error'
import myResponse from '../common/Response'
import myRequest from '../common/Request'
import Post from '../models/post_model'
// import { Request, Response } from 'express'

const getAllPostsEvent = async () => { 
    console.log("Entered getAllPostsEvent")
    try{
        const posts = await Post.find()
        return {status: 'OK', data: posts}
    }catch(err){
        return {status: 'FAIL', data: ""}
    }
}

const getAllPosts = async (req:myRequest) => {
    try {
        let posts = {}
        if (req.query.sender == null || req.query == null){
            posts = await Post.find()
        } else {
            posts = await Post.find({'sender': req.query.sender})
        }
          return new myResponse(posts)
    } catch (error) {
        console.log("fail to get posts in db")
        return new myResponse(null, null, null, new myError(400, error.message))
    }    
}

const addNewPost = async (req:myRequest) => {
    console.log("this is the request body: ", req.body);

    const post = new Post({
        message:req.body.message,
        sender:req.body.sender
    })

    try {
        //need to do this to the rest of the API in this file
        const newPost = await post.save()
        // console.log('save post in db')
        // res.status(200).send(newPost)
        return new myResponse(newPost, req.userId)
    } catch (error) {
        // console.log("fail to save post in db")
        // res.status(400).send({ "error": error.message})
        return new myResponse(null, post.sender,null, new myError(400, error.message))
    }

} 

const getPostById = async (req:myRequest) => {
    const id = req.params.id
    console.log('getPostById: ', id)
    if ( id == '12345'){
        console.log('stoping test')
    }
    if ( id == null || id == undefined) {
        return new myResponse(null, null, null, new myError(400, 'null or undifined id'))
    }
    try {
        const posts = await Post.findById(id)
        return new myResponse(posts, id)
    } catch (error) {  
        return new myResponse(null, id, null, new myError(400, error.message))
    }

}

const putPostById = async (req:myRequest) => {
    const id = req.params.id
    console.log('putPostById: ', id)
    if ( id == null || id == undefined ) {
        return new myResponse(null, id, new myError(400, 'id is null or undefined'))
    }
    try {
        const posts = await Post.findByIdAndUpdate(id, req.body, {
            new: true
        })
        return new myResponse(posts, id)
    } catch (error) {
        return new myResponse(null, id, null,new myError(400, error.message))

    }

}

export = {getAllPosts, addNewPost, getPostById, putPostById, getAllPostsEvent}